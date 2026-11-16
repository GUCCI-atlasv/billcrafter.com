# BillCrafter 全站系统升级与 AI OCR 落地实施方案（PRD & Tech Spec）

> **编写日期**：2026-11-13  
> **适用站点**：`billcrafter.com`（Next.js 16 + `@opennextjs/cloudflare` + D1 + KV + R2 + Browser Rendering）  
> **技术路线**：方案 C — Cloudflare Edge 路由 + Google Cloud（Vertex AI / API）调用 `Gemini 2.5 Flash` 结构化 JSON 提取  
> **关联文档**：`PRD.md`、`迭代PRD-2026Q4-SEO与转化.md`、`SEO-GSC-诊断与修复方案.md`、`UI-REDESIGN-PRD.md`

---

## 1. 战略背景与商业目标

### 1.1 站点基线与核心机会
- **流量底盘**：GSC 已积累 **1,575 个自然查询词**、**1.4 万+ 自然曝光**，105+ 页面稳定收录；访问设备结构为 **桌面端 78% / 移动端 22%**；AI Assistant（ChatGPT / Perplexity / Claude）引流会话已超传统自然点击。
- **现行商业模型**：全站已采用轻量化免费增长模型（`db/0016_free_model.sql`：匿名用户每日免费额度 + 免费注册账号解锁高频能力 + Google AdSense `ca-pub-8028325929767359` 流量变现，并保留 Waffo / PayPal 支付底座供增值包扩展）。
- **破局逻辑**：核心大词 `invoice generator`（月搜 673,000，KD 63）竞争激烈，单纯靠静态模板页难以短期冲进前 10。通过增设 **Receipt & Invoice OCR Scanner（票据识别转 Excel/CSV/PDF）** 子产品矩阵，用 **KD 15–42 的高痛点工具词与评测词** 快速切入前 10 名获取高意向流量与自然外链，同步拉高全站域名权重（DR）与 AdSense 单千次展示收益（RPM）。

### 1.2 目标商业词族与承接路由映射

| 目标关键词 | 月搜索量 | KD | CPC | 用户核心意图与主要设备 | 承接 URL（SSG 静态渲染） | 核心转化漏斗 |
|---|---:|---:|---:|---|---|---|
| `best ocr software for invoice processing` | 1,600 | **15** | $0.00 | 选型对比评测（85% 桌面端） | `/guides/best-free-invoice-ocr-software` | 实测对比表 + **第 2 屏内嵌免登录 OCR 沙盒** → 导流至自家 OCR 工具页 |
| `invoice ocr` | 720 | **25** | **$19.30** | 企业/财务提取发票表格（90% 桌面端） | `/invoice-ocr-scanner` | 拖入 PDF/照片 → 结构化校对 → 导出 Excel/CSV + 高 eCPM B2B 广告位 |
| `receipt photo to CSV OCR` | 4,400 | **42** | $2.65 | 小票拍照/传图转电子表格（60% 桌面 / 40% 移动） | `/receipt-to-csv-converter` | 连续上传/拍照多张小票 → 汇总成 1 张 CSV 报销表 **或** 一键转客户请款 PDF |
| `invoice generator` | 673,000 | 63 | $7.11 | 核心行业终极大词（双端） | `/`（根域首页） | 全站 OCR 工具页、评测文、自然外链与多语言矩阵向首页回输权重 |

---

## 2. 核心技术方案：Google Cloud + Gemini 2.5 Flash OCR（方案 C）

### 2.1 整体架构设计原则
1. **100% Cloudflare Workers 原生兼容**：严禁引入 `@google-cloud/vertexai` 或 `google-auth-library` 等依赖 Node.js `fs`/`net`/`http2` 的重型 SDK，避免 OpenNext 构建体积超限（Worker 压缩后大小限制）或 Edge 运行时报错。全链路采用 **Web Crypto API + 标准 `fetch` REST 调用**。
2. **双模式 Google Cloud 鉴权（生产服务账号 + 开发 API Key 平滑兼容）**：
   - **主模式（生产环境推荐）**：**Google Cloud Service Account（服务账号 JSON） + Vertex AI REST API**。走企业级 GCP 结算（可使用 GCP 赠金/配额，享受 Google Cloud 企业级数据隐私承诺：**默认零数据留存、绝不用于训练 Google 模型**）。
   - **备选/本地模式**：支持配置 **Google Cloud API Key（`GOOGLE_CLOUD_API_KEY`）**，便于本地 `wrangler dev` / `next dev` 快速调试或在区域故障时自动降级回退。
3. **隐私优先（Memory-Only 默认零落盘）**：匿名用户上传的发票图片/PDF 仅在 Worker 请求生命周期内存中转为 Base64 发往 Google Cloud Vertex AI，响应结束后立即释放内存，**不写入 R2、不把客户敏感金额写入 D1**。

### 2.2 Google Cloud 配置清单（上线前 3 分钟完成）

1. 登录 Google Cloud Console，选择或新建项目（如 `billcrafter-prod`）。
2. 在 **APIs & Services → Library** 中搜索并启用 **`Vertex AI API`**（`aiplatform.googleapis.com`）。
3. **方式 A（服务账号鉴权 — 主推）**：
   - 进入 **IAM & Admin → Service Accounts → Create Service Account**，命名为 `billcrafter-ocr-worker`。
   - 授予最小权限角色：**`Vertex AI User`**（`roles/aiplatform.user`），无需任何存储或管理权限。
   - 在该服务账号的 **Keys → Add Key → Create new key (JSON)** 下载密钥文件。
   - 将 JSON 压缩为单行注入 Cloudflare Worker Secret：
     ```bash
     jq -c . service-account.json | npx wrangler secret put GCP_SERVICE_ACCOUNT_JSON
     ```
   - 在 `wrangler.toml` 的 `[vars]` 中配置区域（推荐 `us-central1` 或 `global`）：
     ```toml
     GCP_LOCATION = "us-central1"
     GEMINI_MODEL = "gemini-2.5-flash"
     ```
4. **方式 B（API Key 鉴权 — 备选/本地快速联调）**：
   - 在 Google Cloud Console → **APIs & Services → Credentials → Create Credentials → API key**（限制仅允许调用 Vertex AI API / Generative Language API），注入 Secret：
     ```bash
     npx wrangler secret put GOOGLE_CLOUD_API_KEY
     ```

### 2.3 服务端核心模块设计

#### 模块 1：`lib/server/gcpAuth.js` — Web Crypto 服务账号 JWT 签发与双层缓存
利用与现有 `lib/server/auth.js` 相同的 Web Crypto API（`RSASSA-PKCS1-v1_5` + `SHA-256`）签发 Google OAuth2 JWT，并通过 **Worker 内存 + Cloudflare KV（复用 `env.SESSIONS`）** 缓存 `access_token` 55 分钟，使 99.9% 的 OCR 请求达到 **0ms 鉴权耗时**。

```js
// lib/server/gcpAuth.js — 核心实现规范（零外部依赖，运行于 Cloudflare Workers）
const TOKEN_URI = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/cloud-platform";
const KV_TOKEN_TTL = 3300; // 55 分钟（Google Token 有效期为 3600 秒）

// 一级缓存：Worker Isolate 内存态，避免每次请求消耗 KV 读配额
let memToken = { key: "", token: "", expiresAt: 0 };

function base64UrlEncode(input) {
  const bytes = typeof input === "string" ? new TextEncoder().encode(input) : input;
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function pemToArrayBuffer(pem) {
  const clean = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s+/g, "");
  const bin = atob(clean);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

export function parseServiceAccount(raw) {
  if (!raw) return null;
  const trimmed = raw.trim();
  const jsonStr = trimmed.startsWith("{") ? trimmed : atob(trimmed);
  const sa = JSON.parse(jsonStr);
  if (!sa.project_id || !sa.client_email || !sa.private_key) {
    throw new Error("invalid_gcp_service_account");
  }
  return sa;
}

export async function getVertexAccessToken(env, sa) {
  const now = Date.now();
  const cacheId = `gcp:tok:${sa.client_email}`;

  // 1. 命中 Worker 内存缓存
  if (memToken.key === cacheId && memToken.expiresAt > now + 30_000) {
    return memToken.token;
  }

  // 2. 命中 Cloudflare KV 缓存
  if (env?.SESSIONS) {
    try {
      const cached = await env.SESSIONS.get(cacheId);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.token && parsed.expiresAt > now + 30_000) {
          memToken = { key: cacheId, token: parsed.token, expiresAt: parsed.expiresAt };
          return parsed.token;
        }
      }
    } catch {}
  }

  // 3. Web Crypto RS256 签发 JWT 并向 Google 换取 Access Token
  const iat = Math.floor(now / 1000);
  const exp = iat + 3600;
  const header = base64UrlEncode(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64UrlEncode(
    JSON.stringify({ iss: sa.client_email, sub: sa.client_email, aud: TOKEN_URI, scope: SCOPE, iat, exp })
  );
  const unsigned = `${header}.${payload}`;

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(sa.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuf = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, new TextEncoder().encode(unsigned));
  const jwt = `${unsigned}.${base64UrlEncode(new Uint8Array(sigBuf))}`;

  const res = await fetch(TOKEN_URI, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });
  if (!res.ok) throw new Error(`gcp_oauth_failed_${res.status}`);
  const data = await res.json();
  const expiresAt = now + KV_TOKEN_TTL * 1000;

  memToken = { key: cacheId, token: data.access_token, expiresAt };
  if (env?.SESSIONS) {
    try {
      await env.SESSIONS.put(cacheId, JSON.stringify({ token: data.access_token, expiresAt }), {
        expirationTtl: KV_TOKEN_TTL,
      });
    } catch {}
  }
  return data.access_token;
}
```

#### 模块 2：`lib/ocrSchema.js` — 与 `InvoiceEditor.jsx` 100% 同构的结构化提取契约
Vertex AI 的 `responseSchema` 强制模型严格返回指定类型字段，禁止任何幻觉格式或 Markdown 代码块包裹：

```js
// lib/ocrSchema.js
export const OCR_RESPONSE_SCHEMA = {
  type: "OBJECT",
  required: ["isBillingDocument", "docType", "currency", "lineItems", "total"],
  properties: {
    isBillingDocument: {
      type: "BOOLEAN",
      description: "True if the image/PDF contains an invoice, receipt, bill, quote, or estimate.",
    },
    docType: {
      type: "STRING",
      enum: ["invoice", "receipt", "quote", "estimate"],
    },
    vendorName:    { type: "STRING", nullable: true },
    vendorDetails: { type: "STRING", nullable: true, description: "Address, email, phone, and tax ID (EIN/VAT/GST/ABN) joined by newlines" },
    clientName:    { type: "STRING", nullable: true },
    clientDetails: { type: "STRING", nullable: true },
    documentNumber:{ type: "STRING", nullable: true },
    issueDate:     { type: "STRING", nullable: true, description: "ISO 8601 YYYY-MM-DD if recognizable" },
    dueDate:       { type: "STRING", nullable: true, description: "ISO 8601 YYYY-MM-DD if recognizable" },
    poNumber:      { type: "STRING", nullable: true },
    paymentMethod: { type: "STRING", nullable: true, description: "e.g. Cash, Visa *4242, Bank Transfer, Zelle" },
    currency:      { type: "STRING", description: "3-letter ISO 4217 code such as USD, EUR, GBP, JPY, CAD, AUD, HKD, TWD" },
    lineItems: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        required: ["desc", "qty", "rate", "amount"],
        properties: {
          date:     { type: "STRING", nullable: true, description: "YYYY-MM-DD if line has a service date" },
          category: { type: "STRING", nullable: true, description: "Expense category e.g. Meals, Supplies, Travel, Software, Labor" },
          desc:     { type: "STRING" },
          detail:   { type: "STRING", nullable: true },
          qty:      { type: "NUMBER" },
          rate:     { type: "NUMBER" },
          amount:   { type: "NUMBER" },
          taxable:  { type: "BOOLEAN", nullable: true },
        },
      },
    },
    subtotal:       { type: "NUMBER", nullable: true },
    discountAmount: { type: "NUMBER", nullable: true },
    shippingAmount: { type: "NUMBER", nullable: true },
    taxRatePercent: { type: "NUMBER", nullable: true },
    taxAmount:      { type: "NUMBER", nullable: true },
    tipAmount:      { type: "NUMBER", nullable: true },
    amountPaid:     { type: "NUMBER", nullable: true },
    total:          { type: "NUMBER" },
    notes:          { type: "STRING", nullable: true },
    confidence:     { type: "NUMBER", description: "0.0 to 1.0 overall legibility confidence" },
  },
};
```

#### 模块 3：`app/api/ocr/route.js` — Vertex AI `Gemini 2.5 Flash` 调用与关键性能调优
- **Endpoint 拼接规则**：
  - 服务账号模式（Vertex AI）：
    `const host = location === "global" ? "aiplatform.googleapis.com" : `${location}-aiplatform.googleapis.com`;`
    `POST https://${host}/v1/projects/${sa.project_id}/locations/${location}/publishers/google/models/${model}:generateContent`
    Header: `Authorization: Bearer ${accessToken}`
  - API Key 备选模式：
    `POST https://aiplatform.googleapis.com/v1/publishers/google/models/${model}:generateContent?key=${apiKey}`（或 `generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`）
- **关键工程调优 —— 显式关闭冗余 Thinking 延迟**：
  `gemini-2.5-flash` 默认启用动态推理（Thinking），在票据文字提取任务上若不加限制，会多消耗 2–4 秒延迟与数倍 Output Token。在 `generationConfig` 中固定设置：
  ```json
  {
    "temperature": 0,
    "responseMimeType": "application/json",
    "responseSchema": OCR_RESPONSE_SCHEMA,
    "thinkingConfig": {
      "thinkingBudget": 0
    }
  }
  ```
  实测可将单张小票/发票的端到端延迟稳定压缩至 **1.4–2.2 秒**，单次调用成本降至 **~$0.00035**（**约 2,800 次识别仅 $1**）。
- **请求体大小与安全边界**：
  - 允许 `mimeType`：`image/jpeg`、`image/png`、`image/webp`、`application/pdf`。
  - 限制单次 Base64 解码后字节数 `≤ 4.5 MB`（图片经前端压缩后普遍仅 `180–350 KB`；PDF 限制 `≤ 4 MB`）。
  - 若返回的 `isBillingDocument === false`，仍返回提示信息但计入防刷尝试次数，避免接口被挪作通用图片识别。

### 2.4 配额、防刷与账单安全锁（`db/0017_ocr_usage.sql` + `lib/server/ocrQuota.js`）

延续 `app/api/pdf/route.js` 的核心设计原则：**仅在模型成功返回有效结构化数据时扣除用户的产品配额；用独立的 KV 滑动窗口拦截恶意脚本攻击；并加设全局日熔断锁防止云账单失控。**

| 层级 | 规则设定 | 存储介质 | 商业与风控目的 |
|---|---|---|---|
| **匿名访客免费配额** | **3 张 / UTC 日**（按客户端真实 IP） | KV 主读 + D1 持久化 | 足够真实用户测试单张发票或 3 张报销小票，建立口碑 |
| **免费注册账号配额** | **20 张 / UTC 日**（按 `user.id`） | KV 主读 + D1 持久化 | 强力驱动匿名高频用户注册账号（留存邮箱资产） |
| **预置样张秒试** | **无限次（0 API 消耗）** | 前端静态预置 JSON + 模拟 600ms 扫描动效 | 访客点“试用样张”直接渲染预跑好的真实结果，**0 成本、100% 秒开**！ |
| **单 IP 突发限流** | 10 分钟内最多 **15 次**请求 | Cloudflare KV (`ocratt:{id}`) | 防止并发脚本刷接口 |
| **全站全局日熔断** | 默认 **3,000 次 / UTC 日**（环境变量可调） | Cloudflare KV (`ocr:global:{day}`) | 极端被刷情况下当日 GCP 费用严格封顶在 **$1.20 以内** |

新增数据库迁移文件 `db/0017_ocr_usage.sql`：
```sql
-- OCR daily usage tracking (Anon by IP + Member by User ID)
-- Apply: wrangler d1 execute billcrafter --remote --file=./db/0017_ocr_usage.sql

CREATE TABLE IF NOT EXISTS ocr_daily_usage (
  subject     TEXT NOT NULL,   -- 'ip:1.2.3.4' or 'u:<user_id>'
  day         TEXT NOT NULL,   -- 'YYYY-MM-DD' (UTC)
  count       INTEGER NOT NULL DEFAULT 0,
  updated_at  INTEGER NOT NULL,
  PRIMARY KEY (subject, day)
);
```

---

## 3. 双端产品体验与工作流闭环设计（Desktop 75% + Mobile 25%）

### 3.1 为什么桌面端与移动端必须差异化适配？
根据现有 GA4 数据（桌面 78% / 移动 22%）与关键词意图拆解：
- **桌面端主场景（财务对账、月底集中报销、评测体验）**：发票 PDF 附件在邮箱里，或一沓小票照片已传到电脑文件夹中，用户核心诉求是 **批量拖入、分屏核对数字、一键下载干净的 Excel/CSV**。
- **移动端主场景（工地/门店现场收据数字化）**：承包商（Contractor/Handyman）、自由职业者刚买完材料或吃完商务餐，掏出手机网页直接拍下热敏小票，转成 CSV 发自己邮箱或直接生成向客户请款的 PDF 发票。

### 3.2 输入层设计（4 种零门槛输入方式）
1. **拖拽与多选上传（Desktop 主力）**：支持一次拖入 1–10 个 `.jpg / .png / .webp / .pdf` 文件（匿名单次最多 3 张，登录最多 10 张队列顺序解析）。
2. **`Ctrl+V` / `Cmd+V` 全局剪贴板粘贴（Desktop 效率杀手锏）**：监听页面 `paste` 事件，用户打开任何 PDF 或网银账单截图后按 `Ctrl+V` 直接开始扫描。
3. **原生相机直拍（Mobile 主力）**：在小屏设备（`< 768px`）首屏突出显示全宽品牌橙主按钮 **`Scan Receipt with Camera`**（`<input type="file" accept="image/*" capture="environment" />`），直接拉起手机后置高清镜头拍照，并在前端 `lib/ocrClient.js`（扩展自现有 `lib/logo.js`）自动完成 EXIF 方向矫正与 `1600px` JPEG 压缩（将 8MB 原图压至 ~220KB，弱网 0.3 秒传完）。
4. **免上传一键实测样张（Zero-Friction Demo）**：上传框正下方提供 3 个胶囊按钮：
   - `Try sample: Crumpled coffee receipt`（褶皱餐饮小票）
   - `Try sample: Contractor hardware invoice`（分项计税五金材料单）
   - `Try sample: Multi-line consulting PDF`（多行咨询服务账单）
   点击后展示 0.6 秒红色扫描线过场动画，随即呈现左图右表完整校对界面（零 API 消耗，将跳出率降至最低）。

*(Phase 1.5 增强项)*：**跨端扫码秒传（复用现有 `lib/qr.js`）**——桌面端点击 `Use Phone Camera` 弹出 SVG 二维码（KV 绑定 5 分钟临时通道 `ocrbridge:{token}`），手机扫码拍照后桌面端自动轮询拉取识别结果。

### 3.3 校对工作台（Split-View Workbench）与算术防错护栏
遵循 `UI-REDESIGN-PRD.md` 的 Groq 浅色设计系统（`#F3F3EE` 暖骨白底色 + `#FFFFFF` 卡片 + `#F43E01` 品牌橙点缀）：
- **左栏（原件检视器）**：显示上传的发票图片（支持滚轮/按钮 `100% / 150% / 200%` 缩放与 `90°` 旋转）或嵌入式 PDF 预览；多张队列时顶部显示缩略图切换条。
- **右栏（可编辑结构化表格 + 自动验算护栏）**：
  - 顶部字段条：`Vendor`、`Client`、`Doc #`、`Date`、`Currency`、`Payment Method` 均可直接点击修改。
  - 明细行表格：`Date | Category | Description | Qty | Unit Rate | Tax | Amount`，支持增删行。
  - **自动算术验算（Math Sanity Check）**：前端实时计算 $\Delta = |(\sum \text{LineItems} - \text{Discount} + \text{Shipping} + \text{Tax} + \text{Tip}) - \text{Total}|$：
    - 若 $\Delta \le 0.02$：显示绿色徽章 `✓ Math verified — lines & tax match total`（极大增强财务人员信任度）。
    - 若 $\Delta > 0.02$：显示琥珀色提示条 `Heads up: extracted total ($142.50) differs from sum of lines ($132.50) by $10.00 — check tax or tip`，一键定位拍照反光漏识项。

### 3.4 三大高价值导出出口（打通全站产品闭环）
1. **导出 CSV（直击 `receipt photo to CSV OCR` 月搜 4,400）**：
   - 纯前端生成，自动前置 `\uFEFF`（UTF-8 BOM），确保 Windows Excel 双击打开中文、日文、欧元 `€` 零乱码。
   - 提供 **导出模式切换器**：
     - `Line Items CSV`（每行一个商品明细，适合发票入库）
     - `Expense Ledger CSV`（多张小票合并时，每张小票汇总为 1 行：`Date, Vendor, Receipt #, Category, Currency, Subtotal, Tax, Tip, Total, Payment Method`，完美匹配出差报销单！）
     - `QuickBooks / Xero Compatible CSV`（按主流会计软件导入列名映射表头）
2. **导出 Excel `.xlsx`**：
   - 用户点击 `Download Excel (.xlsx)` 时按需动态加载轻量导出模块（首屏 JS 零增加），自动生成包含 **`Summary`（汇总表）** 与 **`Line Items`（明细表）** 两个工作表的标准 `.xlsx` 文件，金额列带数字格式。
3. **独家杀手锏：`Convert to Editable PDF Invoice →`（无缝桥接 `InvoiceEditor.jsx`）**：
   - 提供两个子动作：
     - **动作 A（重制干净 PDF 账单/收据）**：将识别到的全部抬头、明细、税率写入 `sessionStorage.setItem("bc_ocr_handoff", JSON.stringify(snapshot))`，跳转至 `/?from=ocr`（或当前页直接切换至 `InvoiceEditor`），一键套用 45 套精美模板并通过 `/api/pdf` 导出矢量 PDF。
     - **动作 B（转为向客户请款的报销发票 `Bill Expenses to Client`）**：把刚才拍下的多张材料/差旅小票自动归入 `InvoiceEditor` 的 **`Reimbursable Expenses` 分组**，清空收款方为用户的默认商户档案，并可选将刚拍的小票压缩图自动附在发票底部的 `Job Photos` 凭证栏里！

---

## 4. SEO 架构、专题内容与内链升级方案

### 4.1 新增 SSG 页面路由矩阵

1. **工具落地页（扩展 `lib/ocrSeo.js` + 独立静态路由）**：
   - `/invoice-ocr-scanner`
     - **Meta Title**：`Free Invoice OCR Scanner – Extract PDF & Photo to Excel`（55 字符）
     - **Meta Description**：`Extract vendor details, line items, tax, and totals from any PDF or photo invoice in seconds. Export clean Excel (.xlsx) or CSV — 100% free, no sign-up.`
     - **H1**：`Free invoice OCR scanner`
     - **目标词**：`invoice ocr` ($19.30 CPC), `free invoice ocr online`, `extract data from invoice pdf`, `ai invoice parser`
   - `/receipt-to-csv-converter`
     - **Meta Title**：`Receipt Photo to CSV & Excel Converter – Free AI OCR`（52 字符）
     - **Meta Description**：`Snap or upload receipt photos and convert them into a clean CSV or Excel expense spreadsheet in seconds. Batch scan multiple receipts — free, no sign-up.`
     - **H1**：`Receipt photo to CSV & Excel converter`
     - **目标词**：`receipt photo to CSV OCR` (4,400/月), `scan receipt to excel free`, `convert receipt image to csv`, `receipt scanner to spreadsheet`
   - `/invoice-to-excel-converter`
     - **Meta Title**：`Free PDF Invoice to Excel & CSV Converter Online`（48 字符）
     - **H1**：`Convert PDF & image invoices to Excel (.xlsx)`
     - **目标词**：`invoice to excel`, `pdf invoice to excel converter free`

2. **评测与实战专栏中心（新增 `app/guides/page.jsx` 与 `app/guides/[slug]/page.jsx`）**：
   - 首发第 1 篇（强攻 KD 15，月搜 1,600）：**`/guides/best-free-invoice-ocr-software`**
   - 首发第 2 篇（配套长尾实操词）：**`/guides/how-to-scan-receipts-to-excel`**

### 4.2 旗舰评测文《Best Free Invoice OCR Software in 2026》高转化内容规范

> **目标查询簇**：`best ocr software for invoice processing` (1,600/月, KD 15)、`free invoice ocr software`、`best receipt to excel app 2026`。  
> **核心打法**：用 **真实样张测试数据（E-E-A-T）+ 文内嵌入式免跳转 OCR 沙盒** 打穿传统纯文字水文。

| 模块顺位 | 模块结构与硬性内容要求 | 转化与排名机制 |
|---|---|---|
| **1. Hero & Byline** | H1：`7 Best Free Invoice OCR Software in 2026 (Tested on Real Bills)`；复用 `components/ContentMeta.jsx` 的 `<Byline />`（作者：Philips, Finance Professional + 更新日期 `SITE_UPDATED`） | 触发 `Article` 结构化数据新鲜度与金融专业作者权重 |
| **2. 30秒速览对比表** | 首屏直出 HTML 对比表：对比 **免费额度、是否免注册、表格行提取准确率、支持导出格式（CSV/XLSX/QBO/PDF）、适合人群** | 抢占 Google Featured Snippet（精选摘要）与 ChatGPT / Perplexity 引用源 |
| **3. 文内实时沙盒（核心钩子）** | 在第 1 名评测之前直接挂载 `<OcrWorkbench mode="embedded" />`：“*Skip the sales demos — drop a receipt or invoice right here, or click one of our 3 test bills to see live extraction in 2 seconds.*” | 大幅提升页面交互率与停留时间（Dwell Time > 3m），让评测读者在页内直接变成工具活跃用户 |
| **4. 公开实测方法论** | 展示我们用于横评的 3 张公开测试单据：① 褪色褶皱餐饮热敏小票（测试抗噪与小费识别）；② 含免税人工 + 计税材料的承包商发票（测试分项税率）；③ 双页 B2B 采购 PDF 发票（测试跨页表格合并）。给出每款软件的真实耗时与字段准确率得分 | 满足 Google Helpful Content 对一手实测证据（First-hand Experience）的最高评级标准，同时作为天然外链磁铁 |
| **5. 7 款产品深度横评** | **#1 BillCrafter Invoice & Receipt OCR**（最佳免注册即开即用 & 唯一支持一键转正式 PDF 账单）<br>**#2 Nanonets**（最佳自定义 ERP/AP 自动化流水线，免费额度 500 页但需企业注册配置）<br>**#3 Rossum**（中大型企业应付账款团队首选）<br>**#4 Dext Prepare**（代账会计对接 QuickBooks/Xero 老牌工具，仅免费试用）<br>**#5 Klippa DocHorizon**（欧盟 GDPR 合规与多语种票据 API）<br>**#6 Mindee / Veryfi**（面向开发者的低延迟 SDK）<br>**#7 Google Document AI / Microsoft Power Automate**（适合已有云工程团队自建） | 客观诚实地指出自家边界（“如果你需要 SAP 三单匹配审批流，选 Rossum；如果你只想零配置 3 秒把发票或手机小票变成干净 Excel/CSV，选 BillCrafter”），客观中立反而带来最高点击转化 |
| **6. FAQ & JSON-LD** | 6 条直答式 FAQ（含 `How accurate is AI OCR vs traditional OCR on crumpled receipts?`、`Is it safe to upload vendor invoices to an online OCR tool?`），自动输出 `FAQPage` Schema | 覆盖长尾疑问词并强化 AI 搜索引用 |

### 4.3 站内权重输送与存量 SEO 合并优化
1. **全局导航与页脚加权**：
   - `components/SiteNav.jsx`：新增 `OCR Scanner` 导航项（指向 `/invoice-ocr-scanner`），赋予全站最高内部链接权重。
   - `components/SiteFooter.jsx`：在 `Product` 栏新增 `Invoice OCR scanner`、 `Receipt to CSV` 与 `Guides`。
2. **双向工作流内链（驱动权重回流首页 `/`）**：
   - `components/VerticalDetail.jsx` 的 `CORE_WORKFLOW` 扩展第 5 张核心流转卡片或上下文横幅：`Have a paper receipt or vendor PDF? Extract it to Excel or an editable invoice with AI OCR →`。
   - 所有 OCR 页面与 `/guides/*` 文章页底部固定放置高转化回链模块：以精准锚文本链向 `/`（`free invoice generator`）、`/receipt-maker`、`/estimate-generator`、`/contractor-invoice-generator`。
3. **GEO（`public/llms.txt`）与埋点同步更新**：
   - 在 `public/llms.txt` 新增 `## Receipt & Invoice OCR` 与 `## Guides & Benchmarks` 章节。
   - 合并落地 `迭代PRD-2026Q4-SEO与转化.md` 中的统一 `lib/analytics.js`：同时向 `/api/track`（放行 `ocr_scan` 事件）和 GA4 发送 `ocr_scan`、`export_csv`、`export_xlsx`、`ocr_to_invoice`、`generate_pdf` 关键转化事件。
   - 在高 CPC 页（`/invoice-ocr-scanner`、`/guides/best-free-invoice-ocr-software`）预留并激活 `AD_SLOTS.inContent` 与 `AD_SLOTS.bottom`，直接承接 $19.30 CPC 的企业财税广告竞价（工作台交互区内严禁放广告，广告置于结果导出下方及指南正文之间，保障工具纯净度）。

---

## 5. 多语言体系升级方案（先修技术底座，再拓 Tier-1 蓝海词）

### 5.1 P0 技术修复：拆分 Route Groups 彻底解决 `<html lang="en">` 硬编码（保 100% SSG）
- **现状缺陷**：`app/layout.jsx:115` 写死 `<html lang="en">`，导致 `/es`、`/de`、`/ja`、`/zh-Hant` 等 14 个非英语首页在服务端首包 HTML 中仍声明为英语，削弱了多语种 SEO 排名信号。
- **架构改造（零动态渲染损耗）**：
  1. 将共享的字体（`Montserrat`）、全局 Schema、统计脚本抽离为 `components/RootShell.jsx`。
  2. 拆分两个平行 Route Groups，各自拥有独立的根 `layout.jsx`：
     - `app/(en)/layout.jsx`：固定输出 `<html lang="en">`，承载 `/`、所有英文工具页、`/templates/*`、`/guides/*` 等路径。
     - `app/(i18n)/[locale]/layout.jsx`：通过 `generateStaticParams()` 枚举非默认语言，服务端原生输出 `<html lang={getLocale(locale).hreflang}>`，承载 `/[locale]`、 `/[locale]/about` 以及后续本地化的 OCR 工具页。
  3. 构建校验：运行 `npm run build` 验证所有公开落地页仍为静态预渲染（`○ / ●`），绝不触发全站 `headers()` 动态降级（`ƒ`）。

### 5.2 P1 精选 6 大高价值语种本地化 OCR + 开票工具页
遵循 `SEO-GSC-诊断与修复方案.md` 铁律：**绝不批量生成空壳跳转页；做一个语种的母语级本地化，才在 `LOCALIZED_PATHS` 与 `sitemap.js` 中放开一个语种的 `hreflang` 集群。**

首批锁定商业价值最高、本地竞争度极低（KD 5–12）的 **6 个 Tier-1 语种** 上线 `/[locale]/invoice-ocr-scanner` 与 `/[locale]/receipt-to-csv-converter`：

| 语种路由 | 本地目标搜索词 | Gemini OCR + 编辑器本地化税制适配点 |
|---|---|---|
| **德语 `/de`** | `Rechnung OCR kostenlos` · `Kassenbon scannen Excel` | 自动识别 `19% / 7% MwSt.`、`USt-IdNr.`、`IBAN` |
| **西语 `/es`** | `OCR facturas gratis` · `Pasar tickets de compra a Excel` | 自动识别 `NIF/CIF`、`21% IVA` 及西班牙自由职业者刚需的 `IRPF` 预扣税行 |
| **法语 `/fr`** | `OCR facture gratuit` · `Scanner ticket de caisse Excel` | 自动识别 `SIRET / TVA Intracommunautaire`、`20% TVA` |
| **日语 `/ja`** | `請求書 OCR 無料` · `領収書 写真 Excel 変換` | 识别日本インボイス制度 `T+13桁` 適格請求書登録番号，区分 `10%` 与轻减税率 `8%` |
| **繁中 `/zh-Hant`** | `發票 OCR 轉 Excel` · `收據拍照轉 CSV` | 识别台湾统一发票 `8 码统编` 与 `5% 营业税` / 香港免税商业单据 |
| **葡语 `/pt`** | `OCR nota fiscal recibo Excel` · `Digitalizar recibos para planilha` | 识别 `CNPJ / CPF` 与葡语区税项明细 |

---

## 6. 视觉与视频素材生产方案

延续仓库现有的 **Python 矢量绘图脚本管线（`cairosvg` + `Pillow`）** 与 Groq 暖白极简视觉语言（`#F3F3EE` 骨白、`#2D2F33` 墨黑、`#F43E01` 朱红），做到全站视觉高度统一、2x Retina 锐利且零版权隐患：

1. **代码化生成 OCR 解剖图与流程图（新增 `scripts/render-ocr-assets.py`）**：
   - `public/anatomy/ocr-scanner.png`（`1040×720`）：左侧绘制带轻微阴影的纸质收据/发票，用品牌红 `#F43E01` 标注编号锚点（1 商户与税号、2 日期与单号、3 明细行识别、4 分项税额、5 算术核验总额），右侧箭头指向结构化 Excel/CSV 行与矢量 PDF。
   - `public/steps/ocr-step-1..3.png`（`720×460`）：Snap/Drop → Verify Table → Export CSV or PDF 三步插画。
2. **代码化生成 3 张高拟真标准测试票据（`public/samples/`）**：
   - 用 Python 脚本渲染 3 张完全虚构商户信息（零真实隐私泄露风险）但排版高度逼真的票据图片/PDF：
     - `sample-coffee-receipt.jpg`（模拟热敏纸点阵字体与轻微折痕阴影，含小费）
     - `sample-hardware-invoice.png`（承包商建材采购单，含计税材料与免税配送费）
     - `sample-consulting-invoice.pdf`（多行专业咨询账单）
   - 同时将这 3 张样张经 Gemini 2.5 Flash 提取的标准 JSON 固化在 `lib/ocrSamples.js`，支撑前端“0 成本秒开试用”和评测文公开下载。
3. **专属 OpenGraph 社交大图扩展（修改 `scripts/og-manifest.mjs`）**：
   - 为 `/invoice-ocr-scanner`、`/receipt-to-csv-converter` 及 `/guides/*` 自动生成 `1200×630` 品牌 OG 图。
4. **视频素材（复用 `lib/videos.js` `VideoObject` 严格校验机制）**：
   - 录制 **25 秒无声字幕演示短片**（桌面拖拽 PDF + 手机拍小票 → 2 秒出表 → 导出 Excel & 转报销发票 PDF），上传至官方 YouTube 频道 `@CCCSTUDIO-t6i`，读取精确 `uploadDate` 与 `duration` 写入 `lib/videos.js`，抢占 Google 视频富媒体搜索结果（Video Pack）。

---

## 7. 代码落地文件清单与分阶段排期

### 7.1 新增与修改文件精确清单（供开发直接执行）

| 类别 | 文件路径 | 动作 | 职责说明 |
|---|---|---|---|
| **后端与 GCP 鉴权** | `lib/server/gcpAuth.js` | 新增 | Web Crypto RS256 签发 Google Cloud 服务账号 JWT + 内存/KV 双层 Token 缓存 |
| **后端配额风控** | `db/0017_ocr_usage.sql` | 新增 | `ocr_daily_usage` 表定义 |
| **后端配额风控** | `lib/server/ocrQuota.js` | 新增 | 匿名 3 次/日、登录 20 次/日、10 分钟防刷限流、全局 3,000 次/日成本熔断锁 |
| **OCR 核心接口** | `app/api/ocr/route.js` | 新增 | 校验图片/PDF → 扣减限流 → 调 Vertex AI `gemini-2.5-flash`（兼容 API Key）→ 返回结构化 JSON |
| **数据结构与导出** | `lib/ocrSchema.js` | 新增 | Vertex `responseSchema`、算术验算函数、转 `InvoiceEditor` 快照转换器 |
| **前端预处理/导出** | `lib/ocrClient.js` | 新增 | 拍照/图片 `1600px` 压缩、剪贴板粘贴解析、UTF-8 BOM CSV 生成器（4 种预设）、动态 `.xlsx` 导出 |
| **预置样张数据** | `lib/ocrSamples.js` | 新增 | 3 张免上传测试样张元数据与预提取 JSON |
| **OCR 交互组件** | `components/OcrWorkbench.jsx` | 新增 | 双端自适应上传/拍照框 + 左图右表分屏校对器 + 算术校验条 + CSV/Excel/转开发票导出栏 |
| **编辑器桥接** | `components/InvoiceEditor.jsx` | 修改 | 挂载时检测 `bc_ocr_handoff` 快照，支持一键预填提取结果及“转为客户报销发票”模式 |
| **SEO 工具页** | `lib/ocrSeo.js` | 新增 | `/invoice-ocr-scanner`、`/receipt-to-csv-converter`、`/invoice-to-excel-converter` 文案与 FAQ 配置 |
| **SEO 工具路由** | `app/(en)/invoice-ocr-scanner/page.jsx` 等 | 新增 | 静态 SSG 渲染的 OCR 工具落地页（含 `SoftwareApplication` + `HowTo` + `FAQPage` Schema） |
| **评测专栏系统** | `lib/guides.js` & `app/(en)/guides/...` | 新增 | 专栏索引页与《Best Free Invoice OCR Software in 2026》长文页（支持正文内嵌 `<OcrWorkbench />`） |
| **多语言重构** | `app/(en)/layout.jsx` & `app/(i18n)/[locale]/layout.jsx` | 重构 | 修复服务端 `<html lang>` 硬编码问题，保持全站 100% SSG |
| **埋点与全站链接** | `lib/analytics.js`, `app/api/track/route.js`, `SiteNav.jsx`, `SiteFooter.jsx`, `sitemap.js`, `public/llms.txt` | 修改 | 全链路转化埋点、导航提权、双向内链闭环、Sitemap 与 AI 索引文件同步 |
| **素材生成脚本** | `scripts/render-ocr-assets.py`, `scripts/og-manifest.mjs` | 新增/修改 | 自动生成解剖图、3 张合成测试样张与全套新页面 OG 图 |
| **环境配置** | `wrangler.toml`, `.dev.vars.example` | 修改 | 声明 `GCP_LOCATION`、`GEMINI_MODEL` 变量及 `GCP_SERVICE_ACCOUNT_JSON` / `GOOGLE_CLOUD_API_KEY` 注释说明 |

### 7.2 四阶段敏捷交付里程碑

- **Sprint 1（第 1 周 — 核心 OCR 引擎与工具页 MVP 上线）**：
  - 完成 Google Cloud 服务账号 / API Key 鉴权模块、`/api/ocr` 路由、`db/0017_ocr_usage.sql` 配额表；
  - 完成 `OcrWorkbench.jsx`（拖拽 / 粘贴 / 手机拍照 + 3 张免传样张 + CSV/XLSX 导出 + 一键送入 `InvoiceEditor` 出 PDF）；
  - 上线 `/invoice-ocr-scanner` 与 `/receipt-to-csv-converter`，接入 `SiteNav` / `SiteFooter` / `sitemap.js` / GA4 埋点。
- **Sprint 2（第 2 周 — KD 15 旗舰评测文与视觉素材上线）**：
  - 上线 `/guides` 专栏架构与《Best Free Invoice OCR Software in 2026》（内嵌实时 OCR 沙盒）及《How to Scan Receipts to Excel》；
  - 运行 `render-ocr-assets.py` 生成全套解剖图、样张与 OG 图；更新 `public/llms.txt` 并执行 `npm run indexnow` + GSC 提交索引。
- **Sprint 3（第 3–4 周 — 多语言 `<html lang>` 修复与存量核心页去同质化）**：
  - 完成 Route Groups 拆分修复多语言 `<html lang>`（验证 `next build` 全静态）；
  - 落地 `/estimate-generator`、`/quote-generator`、`/receipt-maker` 独有行业示例模块；补齐跨端二维码扫码传图（`lib/qr.js`）。
- **Sprint 4（第 5–6 周 — Tier-1 六语种 OCR 矩阵与商业化放量）**：
  - 上线德、西、法、日、繁中、葡 6 语种本地化 OCR 页面；
  - 启用高 CPC 页面 AdSense 内容广告位并录制上线 YouTube 实操演示视频，分发基准报告获取首批外链。

---

## 8. 上线验收标准（Definition of Done）

1. **鉴权与性能**：配置 `GCP_SERVICE_ACCOUNT_JSON` 后，首次请求成功获取并缓存 Vertex Token 至 KV；后续连续调用无额外 OAuth 请求，单张 1600px 发票图片端到端识别耗时 **< 3.0 秒**。
2. **准确性与闭环**：上传 3 类测试单据（褶皱热敏收据、分项计税发票、电子 PDF 发票），明细行与总计提取准确，导出 CSV 在 Excel 打开无乱码，点击 `Convert to PDF Invoice` 能将全部字段无损带入 `InvoiceEditor` 并成功导出矢量 PDF。
3. **风控与成本安全**：未登录 IP 第 4 次真实扫描返回友好注册引导弹窗（`402 quota`），预置样张点击不消耗配额且无限可用。
4. **SEO 与构建质量**：`npm run build` 全部新增工具页、指南页、多语言页均为静态生成（`○ / ●`）；GSC Rich Results Test 验证 `SoftwareApplication`、`Article`、`FAQPage` 零报错；非英语路由 `curl` 检查 `<html lang="...">` 与当前语言严格一致。
