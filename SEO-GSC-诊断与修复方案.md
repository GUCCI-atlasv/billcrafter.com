# BillCrafter — GSC 收录问题诊断与修复方案

诊断日期：2026-08-08 · 数据源：GSC Coverage Drilldown 4 份导出 + 线上实测

---

## 一、先说结论：为什么前 2–3 轮优化没有根本解决

**因为修的是症状，不是产生症状的机制。**

139 个报错 URL 里，116 个（83%）是同一个原因：**英文落地页的 hreflang 标签主动向 Google 宣告了 546 个并不存在的本地化 URL**。Google 忠实地去爬，全部撞上 301。

前几轮的修法在代码注释里留下了痕迹 —— `app/[slug]/[...rest]/page.jsx` 写着：

> "Earlier builds linked to things like /de/quote-generator from the localized nav, so Google crawled and remembered them — Search Console reported eight of them as 404s... A 301 to the English page keeps whatever link equity they picked up and stops the errors permanently."

这一步把 **404 变成了 301**，GSC 的报错从 "Not found" 变成了 "Page with redirect"。错误换了个名字，数量还涨了。因为**导流的水龙头（hreflang）一直开着**，而且每上线一个新落地页，就多 26 个待爬的幽灵 URL。

三个独立根因，必须分开处理：

| # | 根因 | 类型 | 影响 URL | 会自愈？ |
|---|---|---|---|---|
| 1 | hreflang 宣告不存在的本地化页 | **技术** | 116（潜在 546+） | 否，且持续增长 |
| 2 | HTTP 不跳 HTTPS，且部分路径是旧缓存 | **技术/基础设施** | 14 | 否 |
| 3 | 英语市场变体内容 98.6% 重复 | **内容** | 6 | 否 |
| 4 | http://www 未跳转（历史） | 技术 | 1 | **是，已修** |
| 5 | Crawled - currently not indexed | 待补数据 | 2 | — |

---

## 二、根因 1：hreflang 制造幽灵 URL（技术 · P0 · 116 个）

### 实测证据

访问 `https://billcrafter.com/contractor-invoice-generator`，页面 `<head>` 中有 **28 条 hreflang**：

```
en    => /contractor-invoice-generator          ← 存在，200
en-GB => /en-GB/contractor-invoice-generator    ← 不存在，301
en-AU => /en-AU/contractor-invoice-generator    ← 不存在，301
de    => /de/contractor-invoice-generator       ← 不存在，301
...（共 26 条指向不存在的 URL）
```

实测 `https://billcrafter.com/de/contractor-invoice-generator` → **301 → `/contractor-invoice-generator`**。

### 代码位置

`app/[slug]/page.jsx`：

```js
function alternatesFor(path) {
  const languages = {};
  for (const l of LOCALES) languages[l.hreflang] = localePath(l.code, path);
  return { languages: { ...languages, "x-default": path } };
}
// vertical 页也调用了它 ——
alternates: { canonical: `/${v.slug}`, ...alternatesFor(`/${v.slug}`) }
```

问题在于：**只有首页和 /about 有真正的本地化版本**，vertical 落地页从来只有英文版。但 `alternatesFor()` 对所有页面一视同仁地输出全套 locale。

### 规模测算

- LOCALES = 27 个 · VERTICALS = 21 个
- 21 × 26（非默认 locale）= **546 个必然 301 的 URL**
- GSC 目前只爬到 116 个 → **还有 430 个在路上**
- 数据侧证：受影响 locale 26 个（几乎全覆盖）、vertical 11 个（只覆盖了一半），说明爬取仍在扩散中
- 排名前两位的是 `progress-billing-invoice`(24) 和 `deposit-invoice`(22) —— 正是最近新增的页面，印证「每加一页 +26」

### 排除项（已验证，不是原因）

- ✅ sitemap.xml 干净：122 个 loc，**0 个** locale-vertical URL
- ✅ 模板详情页不发 hreflang（0 条），不参与放大
- ✅ 内部导航已无 `/de/quote-generator` 类链接

**唯一来源就是页面级 hreflang。**

### 修复方案

**原则：hreflang 只能指向真实存在、且 self-canonical 的页面。**

改 `app/[slug]/page.jsx`：

```js
// hreflang 是一份「这些语言版本确实存在」的声明，不是愿望清单。
// 只有首页和 /about 有本地化版本；落地页只有英文版，为它们输出
// 27 条 alternate 等于请 Google 去爬 546 个必然 301 的 URL。
export async function generateMetadata({ params }) {
  const { slug } = await params;

  if (isLocale(slug)) {
    // 首页：全部 locale 都真实存在 200，保留全套 alternates
    return { ..., alternates: { canonical: localePath(slug, "/"), ...alternatesFor("/") } };
  }

  const v = getVertical(slug);
  if (!v) return {};
  return {
    ...,
    // 英文独有页：只保留自引用 canonical，不输出 hreflang
    alternates: { canonical: `/${v.slug}` },
  };
}
```

**保留** `[...rest]` 的 301 —— 历史 URL 和外链仍需正确落地，只是不再主动宣传它们。

### 预期

- 新增幽灵 URL：**归零**
- 已有 116 个：Google 重爬后确认无入口，数月内逐步退出报告（301 本身不是错误，只是噪音）
- 爬取预算回流到真正需要索引的 21 个落地页

---

## 三、根因 2：HTTP 未跳转 + 旧缓存（技术/基础设施 · P0 · 14 个）

### 实测证据

14 个 "Alternate page with proper canonical" **全部是 `http://`**（无一例外）。逐个实测：

| URL | 结果 |
|---|---|
| `http://billcrafter.com/hourly-invoice` | **200，不跳转**，内容是新的 |
| `http://billcrafter.com/templates/contractor-band` | **200，不跳转**，内容是**几个月前的旧构建** |
| `http://www.billcrafter.com/` | 301 → `https://billcrafter.com/` ✅ |

`http://billcrafter.com/templates/contractor-band` 返回的页面里有：
- "28 templates"（现在是 45）
- "3 free exports / month"（现在是 5）
- **Word (.doc) & Excel (.xls) 按钮**（已下线）
- 6 条 FAQ 的旧版本、旧页脚结构

同一路径的 **HTTPS 版本是最新的**（45 templates / Job site / Timesheet 全在）。

### 判断

两个独立故障叠加：

1. **apex 域的 HTTP 没有强制跳 HTTPS**（www 的跳转规则生效了，apex 的没有）
2. **HTTP 侧存在一个独立的、未失效的缓存层** —— 至少 `/templates/*` 下服务的是旧快照

第 2 点是「优化几轮都没解决」的一个隐藏原因：**改的是 HTTPS，Google 爬的一部分是 HTTP 旧快照**。14 个里有 10 个是 `/templates/*`，与旧快照路径高度吻合。

### 修复方案

1. Cloudflare → SSL/TLS → Edge Certificates → **Always Use HTTPS 打开**（覆盖 apex）
   - 或在 `middleware.js` 加 `x-forwarded-proto` 检查；但注意 `wrangler.toml` 里 `assets.run_worker_first` 的行为，预渲染资源可能绕过 middleware，边缘规则更可靠
2. **清空 Cloudflare 缓存**，重点 purge `/templates/*`
3. 部署后逐一验证：`http://billcrafter.com/templates/contractor-band` 必须 301 → https
4. 在 GSC 用「网址检查」对这 14 个 URL 请求重新编入索引

### 预期

HTTP 版本不再返回 200，14 个 URL 在重爬后消失。同时消除「Google 看到的是旧内容」这一长期隐患。

---

## 四、根因 3：英语市场变体是重复内容（**内容问题** · P1 · 6 个）

### 实测证据

用去标签后的正文做词集相似度对比：

| 对比 | 相似度 |
|---|---|
| `/` vs `/en-GB` | **98.6%** |
| `/` vs `/en-AU` | **98.6%** |
| `/` vs `/en-CA` | **98.6%** |
| `/` vs `/de`（对照组） | 35.7% |

GSC 报的 6 个「Google 选择了不同的规范网址」正是：`/en-GB`、`/en-GB/about`、`/en-AE/about`、`/en-CA/about`、`/en-AU/about`、`/en-IL/about`。

**Google 的判断是对的，这不是 bug。** 这 7 个英语市场（en-GB / en-AU / en-CA / en-AE / en-IN / en-SG / en-IL）共用同一套英文文案，服务端 HTML 的差异只有货币符号和税种名称，正文一字未改。

这是**内容问题，不是技术问题** —— 加 canonical、改 hreflang 都治不好，因为页面确实没有独立存在的价值。

### 两条路

**方案 A（短期，低成本）：承认它们不该独立索引**
- 把这 7 个英语市场页的 canonical 指向 `/`（en-GB/about → /about）
- 从 sitemap 移除
- 保留 URL 可访问（用户切换市场仍能用），但不再争取独立收录
- 代价：放弃 "invoice template UK / AU" 这类词的落地页

**方案 B（中期，推荐）：把它们做成真正的本地内容**

这正是之前内容规划里的「国家复制轴」。每个英语市场需要至少 300–500 字独有内容：

| 市场 | 独有内容支点 |
|---|---|
| en-GB | VAT 20%、发票必载项（GOV.UK 已在引用源里）、公司注册号 |
| en-AU | GST 10%、ABN 必填、Tax Invoice 的法定措辞门槛 |
| en-CA | GST/HST 按省不同、商业号（BN） |
| en-IN | GSTIN、e-invoice 强制门槛、IRN/QR |
| en-SG | GST 9%、UEN |
| en-AE | VAT 5%、TRN |
| en-IL | VAT 18% |

做完后每页有独立价值，hreflang 集群也才名副其实。

**建议：先 A 止血，把 B 排进内容排期，做完再拆出来。** 不要在没有独有内容的情况下继续争取收录 —— 那是在跟 Google 的去重机制对抗，赢不了。

---

## 五、根因 4：http://www（1 个 · 已自愈）

`http://www.billcrafter.com/`，GSC 最后爬取 **2026-07-01**。

实测现在：301 → `https://billcrafter.com/` ✅ middleware 的 www→apex 规则已生效。

**无需处理**，重爬后自动消失。可在 GSC 手动请求重新索引加速。

---

## 六、问题 5：Crawled - currently not indexed（2 个 · 待补数据）

这一项没有对应的导出表格，需要补充后才能定性。

通用判断路径：
- 若是编辑器类页面（/login /signup /invoicemanager）→ 正常，本就不该收录
- 若是新落地页 → 通常是「内容太新 + 站点权重不足」，等待即可，可用 GSC 手动提交
- 若是老页面且内容单薄 → 内容问题，需要补充独有正文

请导出该项的 URL 列表，我再具体定性。

---

## 七、执行清单（按优先级）

### P0 · 本周做完

| 项 | 类型 | 动作 | 验收标准 |
|---|---|---|---|
| 1 | 技术 | vertical 页移除 hreflang，只留 self-canonical | 落地页 `<head>` 中 `link[hreflang]` 数量 = 0 |
| 2 | 基础设施 | Cloudflare 开 Always Use HTTPS（含 apex） | `http://billcrafter.com/任意路径` 返回 301 |
| 3 | 基础设施 | Purge Cloudflare 缓存，重点 `/templates/*` | HTTP 侧不再返回旧构建 |

### P1 · 两周内

| 项 | 类型 | 动作 |
|---|---|---|
| 4 | 内容/技术 | 英语市场变体：canonical 指向 `/`，移出 sitemap（方案 A 止血） |
| 5 | 运维 | GSC 对 14 个 http URL + 6 个重复 URL 提交重新索引 |
| 6 | 数据 | 补 "Crawled - currently not indexed" 的 URL 列表 |

### P2 · 一个月内

| 项 | 类型 | 动作 |
|---|---|---|
| 7 | 内容 | 英语市场本地化内容（方案 B），先做 en-GB + en-AU |
| 8 | 技术 | 排查带尾斜杠的内链（`/sv/` 类），统一为无尾斜杠 |
| 9 | 流程 | 上线检查项：新增落地页时确认不产生新的 hreflang 幽灵 URL |

---

## 八、预期效果与验证

修完 P0 后：

| 指标 | 现在 | 预期 |
|---|---|---|
| Page with redirect | 116（增长中） | 新增归零，存量数月内退场 |
| Alternate page with proper canonical | 14 | → 0 |
| Duplicate without user-selected canonical | 1 | → 0（已自愈） |
| Duplicate, Google chose different canonical | 6 | P1 后 → 0 |
| 潜在幽灵 URL 上限 | 546+ | 0 |

**验证方法**（部署后立即可查）：

```
1. 落地页 hreflang 归零
   打开 /contractor-invoice-generator，控制台执行：
   document.querySelectorAll('link[rel=alternate][hreflang]').length   // 应为 0
   打开 /（首页），同样命令                                              // 应为 28，保持不变

2. HTTP 强制跳转
   fetch("http://billcrafter.com/templates/contractor-band", {redirect:"manual"})
   // 应返回 301，Location 为 https

3. 旧缓存已清
   http 版本的页面不应再出现 "28 templates" / "3 free exports" / "Word (.doc)"
```

---

## 九、一句话总结

**不是 Google 的问题，也不是 canonical 写错了。是站点用 hreflang 告诉 Google「我有 546 个本地化页面」，而实际上只有首页和 About 有；再加上 HTTP 侧还在供应一份没人清理的旧快照。**

把这两个水龙头关掉，报表会自己干净。剩下的 6 个英语市场重复页，是要么补内容、要么不收录的产品决策，不是技术能解决的问题。
