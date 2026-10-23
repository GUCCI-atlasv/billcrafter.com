# BillCrafter 迭代 PRD — 2026 Q4：转化埋点 · 核心工具页差异化 · 多语种修正

> 编写日期：2026-10-23 · 数据来源：CCC Dashboard（GSC / GA4 / Bing，近 30 天 09/23–10/22）+ 线上页面抽检 + 代码检查
> 相关文档：`SEO-GSC-诊断与修复方案.md`（2026-08-08，hreflang 幽灵 URL 已修）、`PRD.md`

---

## 1. 背景与基线

| 指标 | 数值 | 说明 |
|---|---|---|
| Google 曝光 / 点击（近 30 天） | ≈ 4,000 / 6 | 10 月曝光 3,474，已超 9 月全月 |
| Google 平均排名 | 72（8 月）→ 62（9 月）→ **50（10 月）** | 趋势向好，但仍在 4–7 页 |
| 本周 vs 上周（10/14–20） | 曝光 1,006 → **1,743（+73%）**，排名 42.7 → 52 | 新增曝光多在 40–80 名，点不到 |
| GA4 会话（10/16–22） | 33（上周 16） | Direct 18 · **AI Assistant 10** · Organic 3 |
| GA4 key events | **0** | 只采到 `form_start` ×1，无下载/打印/发送事件 |
| 设备 | 桌面 78% / 移动 22% | 参与率 24% |
| 收录 | sitemap 110 条，已收录 105 | 2 个 Discovered：attorney / tutoring 模板页 |

**核心判断**

1. **不是收录问题，是排名问题。** 105/110 已收录，但核心词几乎全部在 40–70 名。
2. **工具页模板化严重。** receipt / estimate / quote / bill / 各行业页的 H2 结构完全一致，约 1,450 词中「Make one now」「Three steps」「What the official guidance says」「Other documents」等通用段落占近一半，独特信息量偏低，Google 难以给出前 20 的排名。
3. **GA4 里没有转化数据。** 编辑器已有自有埋点（`/api/track` 的 `export` 事件，记录 PDF 下载和邮件发送），但没有进入 GA4，无法和渠道、落地页数据对照，后续优化无法在同一处验收。
4. **AI Assistant 渠道已经比 Google 自然搜索带来更多会话**，值得单独度量。

### 最接近前 20 的词（近 30 天 GSC）

| 查询 | 曝光 | 排名 | 目标页 |
|---|---|---|---|
| price quote generator | 18 | **22.4** | /quote-generator |
| quotation maker | 24 | 34.8 | /quote-generator |
| hourly invoice | 20 | 36.3 | /hourly-invoice |
| estimate generator | 130 | 39.8 | /estimate-generator |
| receipt maker | 42 | 40.6 | /receipt-maker |
| create quotes and invoices online | 41 | 44.1 | /quote-generator |
| free estimate generator | 46 | 44.9 | /estimate-generator |
| handyman invoice / bill / receipt template | 83 | 46–48 | /handyman-invoice-template |
| free receipt maker | 65 | 47.8 | /receipt-maker |

### 页面级基线（近 30 天）

| 页面 | 曝光 | 点击 | 排名 |
|---|---|---|---|
| /receipt-maker | 900 | 1 | 56.5 |
| /estimate-generator | 854 | 0 | 56.9 |
| /quote-generator | 738 | 1 | 44.5 |
| /templates | 500 | 0 | 61.2 |
| / | 321 | 4 | 45.2 |
| /cleaning-invoice-template | 144 | 0 | **27.1** |
| /handyman-invoice-template | 128 | 0 | 44.0 |
| /consulting-invoice-generator | 33 | 0 | **18.6** |

---

## 2. 目标（KPI）

| 时间点 | Google 周点击 | 核心 3 页平均排名 | 进入前 20 的目标词 | 周 `generate_pdf` |
|---|---|---|---|---|
| 基线（10/14–20） | 2 | ≈ 52 | 0 | GA4 未采集；先从 `/api/track` 的 `export` 历史数据取周均值作临时基线 |
| 2026-11-20 | ≥ 10 | ≤ 35 | ≥ 3 | 有数据，建立基线 |
| 2026-12-31 | ≥ 40 | ≤ 25 | ≥ 8 | 较 11 月基线 +50% |

每周一 CCC Dashboard 周报自动对比；本文档基线表为对照。

---

## 3. P0 — 转化埋点（目标 2026-10-30 前上线）〔高〕

**现状**：
- `components/GoogleAnalytics.jsx` 只做了 `gtag('config')`，GA4 里没有任何编辑器事件。
- `components/InvoiceEditor.jsx` 已有自有埋点：`track(event, extra)`（约第 172 行）向 `/api/track` 发送 beacon，服务端记录 IP / 国家；`trackExport(format)` 在 PDF 下载成功（`doExport()` 内两处）和邮件发送成功（`sendEmail()`）时发送 `export` 事件，参数含 `template`、`docType`、`format`、`path`。
- 打印、分享、签名、保存、注册等动作两边都没有事件。

**需求**：

1. **扩展现有 `track()`，不另起一套。** 把 `track()` 抽到 `lib/analytics.js`，同一次调用同时：① 照旧发 `/api/track`；② `window.gtag` 存在时调用 `gtag('event', name, params)`，否则跳过。在 `/render/*`、`/i/*`、`/admin` 不发 GA4（与现有 SKIP 规则一致）。保证自有数据和 GA4 数据来自同一触发点，不会出现两边口径不一致。
2. 上线前先从 `/api/track` 历史数据导出近 4 周的 `export` 事件（按 `docType`、`path` 汇总），作为 `generate_pdf` 的临时基线。
3. 埋点清单（`generate_pdf`、`email_doc` 挂在现有 `trackExport()` 的同一位置；`/api/track` 的 `export` 事件保留原名，避免历史数据断档）：

| 事件名 | 触发点（`InvoiceEditor.jsx`） | 参数 | 标记为 key event |
|---|---|---|---|
| `generate_pdf` | `doExport()` 成功下载后（现有 `trackExport("pdf")` 两处） | `doc_type`（invoice/estimate/quote/receipt/bill）、`template_id`、`landing_slug`、`signed_in` | ✅ |
| `pdf_failed` | `doExport()` 失败分支 | `doc_type`、`reason` | |
| `print_doc` | `doPrint()` | `doc_type` | ✅ |
| `share_link` | `doShare()` 成功 | `doc_type` | ✅ |
| `email_doc` | `sendEmail()` 收到 `r.ok` 后（现有 `trackExport("email")` 处；`doEmail()` 只是打开邮件弹窗） | `doc_type` | ✅ |
| `sign_doc` | `doSign()` 完成 | `doc_type` | |
| `save_invoice` | `doSaveInvoice()` | `doc_type` | |
| `editor_start` | 编辑器首次输入（每次会话一次） | `doc_type`、`landing_slug` | |
| `template_select` | 模板画廊选择模板 | `template_id`、`category` | |
| `sign_up` | 注册成功（邮箱 / Google） | `method` | ✅ |

4. `landing_slug` 取会话首个落地页 path（存 `sessionStorage`），用于按落地页算转化率。
5. GA4 后台：把 ✅ 事件标记为 key event；新建探索报告「落地页 × generate_pdf」「渠道 × generate_pdf」。
6. 不得把客户名、金额、邮箱等表单内容作为事件参数发送。

**验收**：GA4 DebugView 中依次操作编辑器，10 个事件全部到达且参数正确；次日 CCC Dashboard 中 BillCrafter `key_events` > 0。

---

## 4. P1 — 核心工具页差异化（目标 2026-11-13 前完成）

### P1-1 三个核心工具页加独有内容块 〔高〕

范围：`/estimate-generator`、`/quote-generator`、`/receipt-maker`（合计占近 30 天曝光 62%）。

**问题**：三页与行业模板页共用同一套区块和 H2 骨架，差异只在少量段落。

**需求**：每页新增 1 个 **该页独有、不可复用** 的内容模块（≥ 600 词或等价的表格/示例），放在首屏编辑器之后、通用区块之前：

| 页面 | 独有模块 | 要覆盖的查询 |
|---|---|---|
| /estimate-generator | 按行业的估价示例：装修、维修工、摄影、清洁各 1 份完整示例（明细行 + 合计 + 有效期 + 排除项），可一键「用此示例开始」 | estimate generator / free estimate maker / free online estimate generator / construction estimate |
| /quote-generator | 「Quote vs Estimate vs Invoice」对比表 + 报价转发票的 3 步截图流程；报价有效期与付款节点写法示例 | price quote generator / quotation maker / create quotes and invoices online / quote builder |
| /receipt-maker | 现金、刷卡、部分付款、已付清 4 种收据样例；收据与发票差异；常见场景（租金、家政、二手交易） | receipt maker / free receipt maker / receipt generator free / online receipt generator |

- 示例数据进 `lib/` 的结构化配置，渲染为 SSG HTML（无 JS 也可读）。
- 「用此示例开始」把示例预填进编辑器，同时作为 `editor_start` 的 `source=example` 参数。

### P1-2 标题与描述覆盖长尾 〔高〕

| 页面 | 现 title | 新 title（≤ 60 字符） |
|---|---|---|
| /estimate-generator | Free estimate generator — BillCrafter | Free Estimate Generator – Make & Send Estimates as PDF |
| /quote-generator | Free Quote Generator & Quotation Maker Online — BillCrafter | Free Quote Generator & Quotation Maker – PDF, No Signup |
| /receipt-maker | Free receipt maker & receipt template — BillCrafter | Free Receipt Maker – Online Receipt Generator & Template |

- description 补具体卖点：No signup to download、PDF、Convert to invoice、模板数量。
- 上线 2 周后在 GSC 检查 SERP 实际标题是否被改写。

### P1-3 通用区块瘦身 〔中〕

- 「Make one now. Sign in to keep it.」「Three steps to a paid invoice.」等通用区块在工具页和行业页中**只保留一个**，或改为简短 CTA 条。
- 「What the official guidance says」按页面主题给出不同的引用来源（例如收据引用 IRS 记录保存要求，报价引用合同要约/承诺的基本规则），不同页面不得出现相同段落。
- 「Other documents you can create free」改为正文中的上下文内链（见 P1-4）。

**验收**：抽取三页正文去掉导航和页脚后两两比较，相同句子占比 < 20%（新增脚本 `scripts/seo-similarity.mjs`，部署前运行）。

### P1-4 内链结构 〔中〕

- estimate ↔ quote ↔ invoice ↔ receipt 四页之间，在正文中用目标词做锚文本互相链接（每页 ≥ 3 条）。
- 首页「An invoice built for your line of work」和 `/templates` 分类页链接到对应行业页。
- 给两个 Discovered 页面 `/attorney-invoice-template`、`/tutoring-invoice-template` 补首页或 /templates 入口，上线后在 GSC 请求编入索引。

---

## 5. P1 — 行业页扩展（目标 2026-11-27 前完成）〔中〕

**依据**：行业页里 consulting（18.6）、cleaning（27.1）排名最好；handyman 三个词（invoice / bill / receipt template）都在 46–48 名，合计 83 曝光。

**需求**：

1. 先加厚 handyman 页：增加 handyman 收费方式（按小时 / 按项目 / 材料加价）、常见服务项目明细示例、bill 与 receipt 写法；把「handyman bill template」「handyman receipt template」作为页内小节。
2. 新增 4 个行业页：plumber、electrician、landscaping / lawn care、auto repair。**每页必须有该行业独有内容**（收费惯例、常见明细行、税务或执照注意事项），不允许只替换行业名称。
3. 新页上线 3 周后，如果收录率低于 75% 或零曝光，暂停新增，先回头补内容。

---

## 6. P1 — 多语种页面修正 〔中〕

**现状**（2026-10-23 实测）：
- 首页 hreflang 已正确输出 16 条（`homeAlternates()`，仅非市场变体 locale）✅
- 工具页只输出自引用 canonical，不输出 hreflang ✅（沿用 08-08 方案）
- **问题**：`app/layout.jsx:113` 写死 `<html lang="en">`，`/es`、`/de`、`/zh-Hant` 等已翻译首页的 lang 属性仍是 `en`。
- `/id` 状态为「已抓取 - 尚未编入索引」；Bing 上 `/es`、`/zh-Hant`、`/pt` 已排第 2–8 名，有基础。

**需求**：
1. 按路由设置正确的 `<html lang>`：locale 首页（`/es` 等）和 locale 的 about 页（`/es/about` 等）用该 locale 的 `lang`，其余页面保持 `en`。
   - **约束：不得让工具页、行业页变成动态渲染。** 根 layout 拿不到子路由的 params；如果在根 layout 里调用 `headers()` 读取 middleware 注入的 locale，全站所有页面都会退出 SSG，变成每次请求实时渲染，速度和 SEO 都会受损。所以不能用这种方式。
   - 难点：locale 首页和工具页目前共用 `app/[slug]/page.jsx`（locale about 在 `app/[slug]/about`），不能直接按目录拆分。
   - 推荐方案：拆成两个 route group，各自有自己的根 layout。`app/(site)/layout.jsx` 固定 `lang="en"`，放现有所有页面；`app/(locale)/…/[locale]/layout.jsx` 用 `lang={params.locale}`，放 locale 首页和 about。由 `middleware.js` 把 `/es`、`/es/about` 这类路径 rewrite 到 locale 路由；对外 URL 和 canonical 不变，两组都继续 `generateStaticParams` 静态生成。
   - 不采用的方案：在客户端用 JS 改 `document.documentElement.lang`。服务端 HTML 里仍然是 `en`，爬虫主要读服务端 HTML，修了等于没修。
   - 上线后用 `next build` 输出确认：工具页和行业页仍标记为静态（○ / ●），没有变成 ƒ。
2. 检查 `/id`、`/bn` 等低流量 locale 首页的翻译质量和正文长度，不达标的先 `noindex, follow` 并移出 hreflang 与 sitemap，达标后再加回。

**验收**：`curl -s https://billcrafter.com/es | grep '<html'` 输出 `lang="es"`；hreflang 列表里的每个 URL 都返回 200、自引用 canonical、无 noindex。

---

## 7. P2 — AI 助手渠道与站外信号（持续进行）

### P2-1 AI Assistant 渠道 〔中〕

- 本周 GA4 会话中 10/33 来自 AI Assistant，比 Organic 多（3）。
- 需求：
  - 更新现有 `public/llms.txt`（83 行，首次提交时就已存在，已覆盖产品能力、免费范围、行业功能和核心页面）：核对免费额度、模板数量、Pro 状态是否还和线上一致；补上本期新增的行业页和 estimate / quote / receipt 独有内容块的链接。
  - 首页和工具页的 FAQ 用直接、可引用的一句话回答（「Is BillCrafter free? Yes — …」），并保留 `FAQPage` JSON-LD。
  - 在 GA4 探索报告里单独追踪 AI Assistant 渠道的 `generate_pdf` 转化率。

### P2-2 外链与目录 〔中〕

- 工具目录：AlternativeTo（作为 Invoice Simple / Zoho Invoice 替代）、SaaSHub、Product Hunt。
- 社区：Reddit r/smallbusiness、r/freelance 中关于报价、收据模板的问题（真实回答，不刷）。
- 目标：2026-12-31 前 ≥ 15 个不同引用域，登记到外链表。

### P2-3 编辑器体验 〔低〕

- `/hourly-invoice` 本周落地 7 个会话、参与率 0：排查是否有渲染或加载问题。
- 确认 1366×768 桌面分辨率下，编辑器首屏可见（不需要先滚动过介绍文字）。

---

## 8. 排期建议

| 周 | 事项 |
|---|---|
| 10/26 – 10/30 | 导出 `/api/track` 历史 `export` 数据作临时基线 · **P0 埋点上线** · GA4 标记 key events · P1-2 三页 title / description |
| 11/02 – 11/13 | P1-1 三页独有内容块 · P1-3 通用区块瘦身 · P1-4 内链 · `seo-similarity.mjs` |
| 11/09 – 11/13 | P1 多语种 `<html lang>` 修正（route group + middleware rewrite，需确认不破坏 SSG） |
| 11/16 – 11/27 | handyman 加厚 · 4 个新行业页 |
| 持续 | P2-1 更新 llms.txt / FAQ · P2-2 外链每周 3–5 条 |
| 11/20、12/31 | 对照 KPI 表复盘 |

---

## 9. 不做 / 暂缓

- **不追「free estimate / free estimates」**（263 曝光）：搜索意图主要是找上门免费估价的服务商，不是工具。
- **`/bill-generator` 先观察**：10/17 才被发现，「bill template / bill generator」这组词约 250 曝光，2–3 周后确认 Google 是否把这组词分配给该页，再决定是否调整。
- 不新增语种，先把已有 locale 首页做好。
