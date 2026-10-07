// Internationalisation. English stays on the root path (existing indexed URLs are
// untouched); every other locale lives under /<code>/… with hreflang alternates.
import { TYPES } from "./invoice";

export const DEFAULT_LOCALE = "en";

// Each locale is a language *and* a primary market, because an invoice has to
// carry the right currency, number format and tax wording — not just translated
// labels. `flag`/`country` describe that primary market.
//
// Note: a flag stands for a market, not a language. Spanish and Portuguese are
// spoken far beyond ES/BR — see `variants` for alternates worth adding if we
// target Latin America or Portugal specifically.
// `lang` is the translation dictionary to use; `code` is the URL segment.
// Regional variants share a language but carry their own currency, tax wording
// and number formatting — which is what actually matters on an invoice.
export const LOCALES = [
  // English — one language, several invoicing markets
  { code: "en",         lang: "en", hreflang: "en",         native: "English",   label: "English (US)",        flag: "🇺🇸", iso: "US", country: "United States", intl: "en-US",      currency: "USD", taxLabel: "Sales tax", vat: null },
  { code: "en-GB",      lang: "en", hreflang: "en-GB",      native: "English",   label: "English (UK)",        flag: "🇬🇧", iso: "GB", country: "United Kingdom", intl: "en-GB",     currency: "GBP", taxLabel: "VAT",       vat: 20 },
  { code: "en-SG",      lang: "en", hreflang: "en-SG",      native: "English",   label: "English (Singapore)", flag: "🇸🇬", iso: "SG", country: "Singapore",     intl: "en-SG",      currency: "SGD", taxLabel: "GST",       vat: 9 },
  { code: "en-AU",      lang: "en", hreflang: "en-AU",      native: "English",   label: "English (Australia)", flag: "🇦🇺", iso: "AU", country: "Australia",     intl: "en-AU",      currency: "AUD", taxLabel: "GST",       vat: 10 },
  { code: "en-CA",      lang: "en", hreflang: "en-CA",      native: "English",   label: "English (Canada)",    flag: "🇨🇦", iso: "CA", country: "Canada",        intl: "en-CA",      currency: "CAD", taxLabel: "GST/HST",   vat: 5 },
  // UAE: English is the standard language for commercial invoices (Arabic is
  // RTL and its own translation effort — not needed for the invoicing use case).
  { code: "en-AE",      lang: "en", hreflang: "en-AE",      native: "English",   label: "English (UAE)",       flag: "🇦🇪", iso: "AE", country: "United Arab Emirates", intl: "en-AE", currency: "AED", taxLabel: "VAT",       vat: 5 },
  // India: English is the standard language for GST invoices. GST is the headline
  // tax (18% is the most common slab); Hindi can be added later if needed.
  { code: "en-IN",      lang: "en", hreflang: "en-IN",      native: "English",   label: "English (India)",     flag: "🇮🇳", iso: "IN", country: "India",         intl: "en-IN",      currency: "INR", taxLabel: "GST",       vat: 18 },
  // Israel: shipped as an English-language market for now. Hebrew is right-to-left
  // and RTL support is a layout project of its own (nav, editor, sheet templates
  // and the html2canvas PDF pass all assume LTR) — same call we made for the UAE.
  // מע"מ (VAT) is 18% since 1 Jan 2025.
  { code: "en-IL",      lang: "en", hreflang: "en-IL",      native: "English",   label: "English (Israel)",    flag: "🇮🇱", iso: "IL", country: "Israel",        intl: "en-IL",      currency: "ILS", taxLabel: "VAT",       vat: 18 },

  // Spanish
  { code: "es",         lang: "es", hreflang: "es-ES",      native: "Español",   label: "Spanish (Spain)",     flag: "🇪🇸", iso: "ES", country: "España",        intl: "es-ES",      currency: "EUR", taxLabel: "IVA",       vat: 21 },
  { code: "es-MX",      lang: "es", hreflang: "es-MX",      native: "Español",   label: "Spanish (Mexico)",    flag: "🇲🇽", iso: "MX", country: "México",        intl: "es-MX",      currency: "MXN", taxLabel: "IVA",       vat: 16 },
  // Peru: IGV (Impuesto General a las Ventas) is 18%. Shares the "es" language
  // dictionary — only currency, tax wording and the market/flag differ.
  { code: "es-PE",      lang: "es", hreflang: "es-PE",      native: "Español",   label: "Spanish (Peru)",      flag: "🇵🇪", iso: "PE", country: "Perú",          intl: "es-PE",      currency: "PEN", taxLabel: "IGV",       vat: 18 },
  // Dominican Republic: ITBIS (Impuesto sobre Transferencias de Bienes
  // Industrializados y Servicios) is 18%. Shares the "es" language dictionary.
  { code: "es-DO",      lang: "es", hreflang: "es-DO",      native: "Español",   label: "Spanish (Dominican Republic)", flag: "🇩🇴", iso: "DO", country: "República Dominicana", intl: "es-DO", currency: "DOP", taxLabel: "ITBIS", vat: 18 },

  // Portuguese
  { code: "pt",         lang: "pt", hreflang: "pt-BR",      native: "Português", label: "Portuguese (Brazil)", flag: "🇧🇷", iso: "BR", country: "Brasil",        intl: "pt-BR",      currency: "BRL", taxLabel: "Imposto",   vat: null },
  { code: "pt-PT",      lang: "pt", hreflang: "pt-PT",      native: "Português", label: "Portuguese (Portugal)", flag: "🇵🇹", iso: "PT", country: "Portugal",    intl: "pt-PT",      currency: "EUR", taxLabel: "IVA",       vat: 23 },

  { code: "fr",         lang: "fr", hreflang: "fr",         native: "Français",  label: "French",              flag: "🇫🇷", iso: "FR", country: "France",        intl: "fr-FR",      currency: "EUR", taxLabel: "TVA",       vat: 20 },
  { code: "de",         lang: "de", hreflang: "de",         native: "Deutsch",   label: "German",              flag: "🇩🇪", iso: "DE", country: "Deutschland",   intl: "de-DE",      currency: "EUR", taxLabel: "MwSt.",     vat: 19 },
  { code: "it",         lang: "it", hreflang: "it",         native: "Italiano",  label: "Italian",             flag: "🇮🇹", iso: "IT", country: "Italia",        intl: "it-IT",      currency: "EUR", taxLabel: "IVA",       vat: 22 },

  // Traditional Chinese — Hong Kong has no VAT/GST, so no default rate.
  { code: "zh-Hant",    lang: "zh-Hant", hreflang: "zh-Hant-HK", native: "繁體中文", label: "Traditional Chinese (HK)", flag: "🇭🇰", iso: "HK", country: "香港", intl: "zh-Hant-HK", currency: "HKD", taxLabel: "稅項",   vat: null },
  { code: "zh-Hant-TW", lang: "zh-Hant", hreflang: "zh-Hant-TW", native: "繁體中文", label: "Traditional Chinese (TW)", flag: "🇹🇼", iso: "TW", country: "台灣", intl: "zh-Hant-TW", currency: "TWD", taxLabel: "營業稅", vat: 5 },

  { code: "ru",         lang: "ru", hreflang: "ru",         native: "Русский",   label: "Russian",             flag: "🇷🇺", iso: "RU", country: "Россия",        intl: "ru-RU",      currency: "RUB", taxLabel: "НДС",       vat: 20 },

  { code: "bn",         lang: "bn", hreflang: "bn",         native: "বাংলা",     label: "Bengali",             flag: "🇧🇩", iso: "BD", country: "বাংলাদেশ",      intl: "bn-BD",      currency: "BDT", taxLabel: "ভ্যাট",      vat: 15 },

  { code: "ko",         lang: "ko", hreflang: "ko",         native: "한국어",     label: "Korean",              flag: "🇰🇷", iso: "KR", country: "대한민국",      intl: "ko-KR",      currency: "KRW", taxLabel: "부가세",     vat: 10 },
  // Japan: 消費税 (consumption tax) is 10% standard, with an 8% reduced rate for
  // food and some subscriptions. JPY has no minor unit — see ZERO_DECIMAL.
  { code: "ja",         lang: "ja", hreflang: "ja",         native: "日本語",     label: "Japanese",            flag: "🇯🇵", iso: "JP", country: "日本",          intl: "ja-JP",      currency: "JPY", taxLabel: "消費税",     vat: 10 },
  { code: "nl",         lang: "nl", hreflang: "nl",         native: "Nederlands", label: "Dutch",               flag: "🇳🇱", iso: "NL", country: "Nederland",     intl: "nl-NL",      currency: "EUR", taxLabel: "Btw",       vat: 21 },
  // Sweden: moms is 25% standard (12% and 6% reduced). SEK is written after the
  // amount — see SUFFIX_CURRENCY in lib/invoice.js.
  { code: "sv",         lang: "sv", hreflang: "sv",         native: "Svenska",   label: "Swedish",             flag: "🇸🇪", iso: "SE", country: "Sverige",       intl: "sv-SE",      currency: "SEK", taxLabel: "Moms",      vat: 25 },
  { code: "id",         lang: "id", hreflang: "id",         native: "Bahasa Indonesia", label: "Indonesian",    flag: "🇮🇩", iso: "ID", country: "Indonesia",     intl: "id-ID",      currency: "IDR", taxLabel: "PPN",       vat: 11 },
  // Vietnam: URL/locale code is the country (vn / VN), while lang stays "vi" so
  // DOC/STAMPS/T/marketing/about dictionaries keep the ISO 639-1 language key.
  // thuế GTGT (VAT) standard rate is 10%. VND has no minor unit in everyday use
  // — see ZERO_DECIMAL/SUFFIX_CURRENCY in lib/invoice.js.
  { code: "vn",         lang: "vi", hreflang: "vi-VN",      native: "Tiếng Việt", label: "Vietnamese (Vietnam)", flag: "🇻🇳", iso: "VN", country: "Việt Nam", intl: "vi-VN", currency: "VND", taxLabel: "Thuế GTGT", vat: 10 },
];

export const LOCALE_CODES = LOCALES.map((l) => l.code);
export const isLocale = (c) => LOCALE_CODES.includes(c);
export const getLocale = (c) => LOCALES.find((l) => l.code === c) || LOCALES[0];

// The first locale listed for a language is that language's canonical market;
// every later one sharing the same `lang` is a market variant. Variants render
// the same translated copy and differ only in currency and tax defaults, which
// are applied client-side — so the HTML Google sees is ~99% identical.
//
// Measured on the live site: /es-MX, /es-PE and /es-DO are 99.8–99.9% identical
// to /es (a genuinely different language, /de, scores 35.6% against it). Google
// agreed — it declined to index /es-DO and folded the English variants into /.
//
// So keep every market available in the product, but declare only the canonical
// market of each language as an indexable page. This mirrors what /about has
// always done (one URL per language via aboutHasOwnUrl) and generalises the
// English-only rule that previously left es-*, pt-PT and zh-Hant-TW exposed.
const PRIMARY_LOCALE_FOR_LANG = new Map();
for (const l of LOCALES) if (!PRIMARY_LOCALE_FOR_LANG.has(l.lang)) PRIMARY_LOCALE_FOR_LANG.set(l.lang, l.code);

export const isMarketVariant = (code) => {
  const locale = getLocale(code);
  return PRIMARY_LOCALE_FOR_LANG.get(locale.lang) !== locale.code;
};

// The canonical URL a market variant folds into: its language's primary market.
export const primaryLocaleOf = (code) => PRIMARY_LOCALE_FOR_LANG.get(getLocale(code).lang) || DEFAULT_LOCALE;

// hreflang must only declare URLs that are self-canonical and indexable.
export const INDEXABLE_HOME_LOCALES = LOCALES.filter((l) => !isMarketVariant(l.code));

export function homeAlternates() {
  const languages = {};
  for (const locale of INDEXABLE_HOME_LOCALES) {
    languages[locale.hreflang] = localePath(locale.code, "/");
  }
  return { languages: { ...languages, "x-default": "/" } };
}

// Region helpers used by the editor/document.
export const intlTag = (c) => getLocale(c).intl;
export const localeCurrency = (c) => getLocale(c).currency;
export const localeTaxLabel = (c) => getLocale(c).taxLabel;
// Typical headline VAT/GST rate for the market. Offered as a convenience only —
// never auto-applied, since whether a business charges it depends on registration.
export const localeVat = (c) => getLocale(c).vat;

// Prefix a path with the locale ("/" stays "/" for English).
export function localePath(locale, path = "") {
  const p = path.startsWith("/") ? path : `/${path}`;
  const clean = p === "/" ? "" : p;
  return locale === DEFAULT_LOCALE ? (clean || "/") : `/${locale}${clean}`;
}

// Paths that exist in every language. Anything not listed here is English-only
// (contact, templates, terms, privacy, the SEO verticals, the category hubs), so
// switching language from those pages goes to the locale home rather than
// building a URL like "/zh-Hant/contact" that has no route and would 404.
// Add a path here as soon as it gets a localized route.
export const LOCALIZED_PATHS = ["about"];

// Swap the locale of a path, keeping the page when that page is localized.
//   "/about"     + "ja" -> "/ja/about"   (localized page, preserved)
//   "/contact"   + "ja" -> "/ja"         (English-only page -> locale home)
//   "/ja/about"  + "en" -> "/about"      (back to English)
export function swapLocalePath(pathname, next) {
  const parts = (pathname || "/").split("/").filter(Boolean);
  if (parts.length && LOCALE_CODES.includes(parts[0])) parts.shift();
  const rest = parts.join("/");
  const keep = rest && LOCALIZED_PATHS.includes(parts[0]);
  if (next === DEFAULT_LOCALE) return "/" + rest; // English keeps the same page
  return keep ? `/${next}/${rest}` : `/${next}`;
}

// Given the browser's language preferences (navigator.languages, most-preferred
// first), return the best matching locale code — or null if nothing matches.
// Matches an exact code/hreflang first (e.g. "pt-PT"), then the language subtag
// (e.g. "ko-KR" -> ko, "zh-TW" -> zh-Hant).
export function matchLocale(langs) {
  const list = Array.isArray(langs) ? langs : langs ? [langs] : [];
  for (const raw of list) {
    const low = String(raw || "").trim().toLowerCase();
    if (!low) continue;
    let hit = LOCALES.find((l) => l.code.toLowerCase() === low || l.hreflang.toLowerCase() === low);
    if (hit) return hit.code;
    const base = low.split("-")[0];
    hit = LOCALES.find((l) => l.lang.toLowerCase().split("-")[0] === base);
    if (hit) return hit.code;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Document vocabulary — the highest-value strings, since these are printed on
// the PDF the customer actually receives.
// ---------------------------------------------------------------------------
const DOC = {
  en: {
    invoice:  { word: "Invoice",  party: "Bill to",       total: "Total",           d2: "Due" },
    estimate: { word: "Estimate", party: "Prepared for",  total: "Estimated total", d2: "Valid until" },
    quote:    { word: "Quote",    party: "Prepared for",  total: "Quoted total",    d2: "Valid until" },
    receipt:  { word: "Receipt",  party: "Received from", total: "Total",           d2: "Paid on" },
  },
  es: {
    invoice:  { word: "Factura",      party: "Facturar a",     total: "Total",             d2: "Vencimiento" },
    estimate: { word: "Presupuesto",  party: "Preparado para", total: "Total estimado",    d2: "Válido hasta" },
    quote:    { word: "Cotización",   party: "Preparado para", total: "Total cotizado",    d2: "Válido hasta" },
    receipt:  { word: "Recibo",       party: "Recibido de",    total: "Total",             d2: "Pagado el" },
  },
  pt: {
    invoice:  { word: "Fatura",       party: "Faturar para",   total: "Total",             d2: "Vencimento" },
    estimate: { word: "Orçamento",    party: "Preparado para", total: "Total estimado",    d2: "Válido até" },
    quote:    { word: "Cotação",      party: "Preparado para", total: "Total cotado",      d2: "Válido até" },
    receipt:  { word: "Recibo",       party: "Recebido de",    total: "Total",             d2: "Pago em" },
  },
  fr: {
    invoice:  { word: "Facture",      party: "Facturer à",     total: "Total",             d2: "Échéance" },
    estimate: { word: "Devis",        party: "Établi pour",    total: "Total estimé",      d2: "Valable jusqu’au" },
    quote:    { word: "Offre",        party: "Établi pour",    total: "Total proposé",     d2: "Valable jusqu’au" },
    receipt:  { word: "Reçu",         party: "Reçu de",        total: "Total",             d2: "Payé le" },
  },
  de: {
    invoice:  { word: "Rechnung",            party: "Rechnung an", total: "Gesamt",           d2: "Fällig am" },
    estimate: { word: "Kostenvoranschlag",   party: "Erstellt für", total: "Geschätzt gesamt", d2: "Gültig bis" },
    quote:    { word: "Angebot",             party: "Erstellt für", total: "Angebotssumme",    d2: "Gültig bis" },
    receipt:  { word: "Quittung",            party: "Erhalten von", total: "Gesamt",           d2: "Bezahlt am" },
  },
  it: {
    invoice:  { word: "Fattura",    party: "Fatturare a",   total: "Totale",         d2: "Scadenza" },
    estimate: { word: "Preventivo", party: "Preparato per", total: "Totale stimato", d2: "Valido fino al" },
    quote:    { word: "Offerta",    party: "Preparato per", total: "Totale offerta", d2: "Valido fino al" },
    receipt:  { word: "Ricevuta",   party: "Ricevuto da",   total: "Totale",         d2: "Pagato il" },
  },
  "zh-Hant": {
    invoice:  { word: "發票",   party: "收件方", total: "總計",     d2: "到期日" },
    estimate: { word: "估價單", party: "致",     total: "估價總額", d2: "有效期至" },
    quote:    { word: "報價單", party: "致",     total: "報價總額", d2: "有效期至" },
    receipt:  { word: "收據",   party: "收款自", total: "總計",     d2: "付款日期" },
  },
  ru: {
    invoice:  { word: "Счёт",       party: "Плательщик", total: "Итого",          d2: "Срок оплаты" },
    estimate: { word: "Смета",      party: "Для",        total: "Итого по смете", d2: "Действует до" },
    quote:    { word: "Предложение", party: "Для",       total: "Итого",          d2: "Действует до" },
    receipt:  { word: "Квитанция",  party: "Получено от", total: "Итого",         d2: "Дата оплаты" },
  },
  bn: {
    invoice:  { word: "চালান",      party: "প্রাপক",        total: "সর্বমোট",       d2: "শেষ তারিখ" },
    estimate: { word: "প্রাক্কলন",   party: "প্রস্তুতকৃত",     total: "আনুমানিক মোট",  d2: "কার্যকর তারিখ" },
    quote:    { word: "দরপত্র",      party: "প্রস্তুতকৃত",     total: "উদ্ধৃত মোট",     d2: "কার্যকর তারিখ" },
    receipt:  { word: "রসিদ",       party: "প্রাপ্ত হতে",     total: "সর্বমোট",       d2: "পরিশোধের তারিখ" },
  },
  ja: {
    invoice:  { word: "請求書",   party: "請求先",   total: "合計",       d2: "支払期限" },
    estimate: { word: "見積書",   party: "宛先",     total: "見積合計",   d2: "有効期限" },
    quote:    { word: "御見積",   party: "宛先",     total: "見積合計",   d2: "有効期限" },
    receipt:  { word: "領収書",   party: "受領元",   total: "合計",       d2: "支払日" },
  },
  ko: {
    invoice:  { word: "청구서",   party: "청구 대상", total: "합계",      d2: "지급기한" },
    estimate: { word: "견적서",   party: "수신",     total: "예상 합계",  d2: "유효기한" },
    quote:    { word: "견적 제안", party: "수신",     total: "견적 합계",  d2: "유효기한" },
    receipt:  { word: "영수증",   party: "받은 곳",   total: "합계",      d2: "결제일" },
  },
  sv: {
    invoice:  { word: "Faktura",             party: "Faktureras till", total: "Totalt",           d2: "Förfallodatum" },
    estimate: { word: "Kostnadsförslag",     party: "Upprättad för",   total: "Beräknat totalt",  d2: "Giltig till" },
    quote:    { word: "Offert",              party: "Upprättad för",   total: "Offererat totalt", d2: "Giltig till" },
    receipt:  { word: "Kvitto",              party: "Mottaget från",   total: "Totalt",           d2: "Betald den" },
  },
  nl: {
    invoice:  { word: "Factuur",     party: "Factuuradres",  total: "Totaal",           d2: "Vervaldatum" },
    estimate: { word: "Kostenraming", party: "Opgesteld voor", total: "Geschatte totaal", d2: "Geldig tot" },
    quote:    { word: "Offerte",     party: "Opgesteld voor", total: "Totaal offerte",   d2: "Geldig tot" },
    receipt:  { word: "Kwitantie",   party: "Ontvangen van",  total: "Totaal",           d2: "Betaald op" },
  },
  id: {
    invoice:  { word: "Faktur",     party: "Ditagihkan kepada", total: "Total",           d2: "Jatuh tempo" },
    estimate: { word: "Estimasi",   party: "Disiapkan untuk",   total: "Perkiraan total", d2: "Berlaku hingga" },
    quote:    { word: "Penawaran",  party: "Disiapkan untuk",   total: "Total penawaran", d2: "Berlaku hingga" },
    receipt:  { word: "Kwitansi",   party: "Diterima dari",     total: "Total",           d2: "Dibayar pada" },
  },
  vi: {
    invoice:  { word: "Hóa đơn",  party: "Gửi đến",       total: "Tổng cộng",   d2: "Hạn thanh toán" },
    estimate: { word: "Dự toán",  party: "Chuẩn bị cho",  total: "Tổng dự toán", d2: "Có hiệu lực đến" },
    quote:    { word: "Báo giá",  party: "Chuẩn bị cho",  total: "Tổng báo giá", d2: "Có hiệu lực đến" },
    receipt:  { word: "Biên nhận", party: "Nhận từ",      total: "Tổng cộng",   d2: "Ngày thanh toán" },
  },
};

// Merge localized wording over the base TYPES config so every existing `ty.*`
// call site keeps working unchanged.
export function docType(locale, type) {
  const base = TYPES[type] || TYPES.invoice;
  const lang = getLocale(locale).lang;               // es-MX -> es
  const dict = DOC[locale] || DOC[lang] || DOC.en;
  const loc = dict[type] || dict.invoice;
  return { ...base, ...loc };
}


// ---------------------------------------------------------------------------
// Document stamps (watermarks). Printed on the PDF, so they follow the
// document's language rather than the UI language.
// ---------------------------------------------------------------------------
export const STAMP_KEYS = ["paid", "unpaid", "overdue", "draft", "void"];
const STAMPS = {
  en:        { paid: "PAID", unpaid: "UNPAID", overdue: "OVERDUE", draft: "DRAFT", void: "VOID" },
  es:        { paid: "PAGADO", unpaid: "NO PAGADO", overdue: "VENCIDO", draft: "BORRADOR", void: "ANULADO" },
  pt:        { paid: "PAGO", unpaid: "NÃO PAGO", overdue: "VENCIDO", draft: "RASCUNHO", void: "ANULADO" },
  fr:        { paid: "PAYÉE", unpaid: "IMPAYÉE", overdue: "EN RETARD", draft: "BROUILLON", void: "ANNULÉE" },
  de:        { paid: "BEZAHLT", unpaid: "OFFEN", overdue: "ÜBERFÄLLIG", draft: "ENTWURF", void: "STORNIERT" },
  it:        { paid: "PAGATA", unpaid: "NON PAGATA", overdue: "SCADUTA", draft: "BOZZA", void: "ANNULLATA" },
  "zh-Hant": { paid: "已付款", unpaid: "未付款", overdue: "逾期", draft: "草稿", void: "作廢" },
  ru:        { paid: "ОПЛАЧЕНО", unpaid: "НЕ ОПЛАЧЕНО", overdue: "ПРОСРОЧЕНО", draft: "ЧЕРНОВИК", void: "АННУЛИРОВАН" },
  bn:        { paid: "পরিশোধিত", unpaid: "অপরিশোধিত", overdue: "মেয়াদোত্তীর্ণ", draft: "খসড়া", void: "বাতিল" },
  ja:        { paid: "支払済", unpaid: "未払", overdue: "支払期限超過", draft: "下書き", void: "無効" },
  ko:        { paid: "결제완료", unpaid: "미결제", overdue: "연체", draft: "초안", void: "무효" },
  sv:        { paid: "BETALD", unpaid: "OBETALD", overdue: "FÖRFALLEN", draft: "UTKAST", void: "OGILTIG" },
  nl:        { paid: "BETAALD", unpaid: "ONBETAALD", overdue: "VERLOPEN", draft: "CONCEPT", void: "ONGELDIG" },
  id:        { paid: "LUNAS", unpaid: "BELUM DIBAYAR", overdue: "TERLAMBAT", draft: "DRAF", void: "BATAL" },
  vi:        { paid: "ĐÃ THANH TOÁN", unpaid: "CHƯA THANH TOÁN", overdue: "QUÁ HẠN", draft: "BẢN NHÁP", void: "ĐÃ HỦY" },
};
export function stampLabel(locale, key) {
  if (!key) return "";
  const lang = getLocale(locale).lang;
  const d = STAMPS[locale] || STAMPS[lang] || STAMPS.en;
  return d[key] || STAMPS.en[key] || "";
}

// ---------------------------------------------------------------------------
// UI strings
// ---------------------------------------------------------------------------
const T = {
  en: {
    "nav.templates": "Templates", "nav.contact": "Contact",
    "nav.login": "Log in", "nav.signup": "Sign up", "nav.start": "Start free",
    "home.eyebrow": "Free invoice generator",
    "home.h1": "Send a professional invoice in under a minute.",
    "home.sub": "Create invoices, estimates, quotes and receipts, then download a clean PDF. No signup to download, and never a watermark.",
    "home.m1": "No signup to download", "home.m2": "Free & unlimited editing", "home.m3": "Clean PDF download & print",
    "doc.description": "Description", "doc.qty": "Qty", "doc.rate": "Rate", "doc.amount": "Amount", "doc.tax": "Tax",
    "doc.subtotal": "Subtotal", "doc.discount": "Discount", "doc.shipping": "Shipping",
    "doc.amountPaid": "Amount paid", "doc.balanceDue": "Balance due", "doc.paidInFull": "Paid in full",
    "doc.notes": "Notes", "doc.payment": "Payment", "doc.no": "No.", "doc.issued": "Issued",
    "doc.from": "From", "doc.po": "PO", "doc.method": "Method",
    // Trades pack (P1): job-site address, deposit request, milestone schedule,
    // job photos. Other locales fall back to English until translated.
    "doc.jobsite": "Job site", "doc.depositDue": "Deposit due",
    "doc.schedule": "Payment schedule", "doc.photos": "Job photos",
    "doc.servicePeriod": "Service period", "doc.frequency": "Frequency",
    "doc.date": "Date", "doc.hours": "Hours", "doc.totalHours": "Total hours",
    "askai.lead": "Rather ask an AI?", "askai.ask": "Ask",
    "ed.downloadPdf": "Download PDF", "ed.email": "Email invoice",
    "ed.print": "Print", "ed.save": "Save", "ed.myInvoices": "My invoices", "ed.addItem": "Add item",
    "ed.template": "Template", "ed.accent": "Accent", "ed.currency": "Currency", "ed.docType": "Document type",
    "tpl.eyebrow": "Template library", "tpl.h1": "Pick a template. Edit it live. Download.",
    "tpl.all": "All documents", "tpl.use": "Use this template",
    "foot.product": "Product", "foot.company": "Company", "foot.language": "Language",
    "foot.tagline": "The free invoice generator for freelancers and small businesses.",
    "banner.prompt": "View this page in English?", "banner.switch": "Switch", "banner.dismiss": "Dismiss",
  },
  es: {
    "nav.templates": "Plantillas", "nav.contact": "Contacto",
    "nav.login": "Iniciar sesión", "nav.signup": "Registrarse", "nav.start": "Empezar gratis",
    "home.eyebrow": "Generador de facturas gratis",
    "home.h1": "Envía una factura profesional en menos de un minuto.",
    "home.sub": "Crea facturas, presupuestos, cotizaciones y recibos, y descarga un PDF impecable. Sin registro para descargar y nunca con marca de agua.",
    "home.m1": "Sin registro para descargar", "home.m2": "Edición gratis e ilimitada", "home.m3": "Descarga e imprime en PDF",
    "doc.description": "Descripción", "doc.qty": "Cant.", "doc.rate": "Precio", "doc.amount": "Importe", "doc.tax": "Impuesto",
    "doc.subtotal": "Subtotal", "doc.discount": "Descuento", "doc.shipping": "Envío",
    "doc.amountPaid": "Importe pagado", "doc.balanceDue": "Saldo pendiente", "doc.paidInFull": "Pagado en su totalidad",
    "doc.notes": "Notas", "doc.payment": "Pago", "doc.no": "N.º", "doc.issued": "Emitida",
    "doc.from": "De", "doc.po": "OC", "doc.method": "Método",
    "doc.jobsite": "Lugar del trabajo", "doc.depositDue": "Anticipo a pagar", "doc.schedule": "Calendario de pagos", "doc.photos": "Fotos del trabajo",
    "doc.servicePeriod": "Periodo de servicio", "doc.frequency": "Frecuencia",
    "doc.date": "Fecha", "doc.hours": "Horas", "doc.totalHours": "Total de horas",
    "askai.lead": "¿Prefieres preguntarle a una IA?", "askai.ask": "Preguntar a",
    "ed.downloadPdf": "Descargar PDF", "ed.email": "Enviar por correo",
    "ed.print": "Imprimir", "ed.save": "Guardar", "ed.myInvoices": "Mis facturas", "ed.addItem": "Añadir línea",
    "ed.template": "Plantilla", "ed.accent": "Color", "ed.currency": "Moneda", "ed.docType": "Tipo de documento",
    "tpl.eyebrow": "Biblioteca de plantillas", "tpl.h1": "Elige una plantilla. Edítala. Descárgala.",
    "tpl.all": "Todos los documentos", "tpl.use": "Usar esta plantilla",
    "foot.product": "Producto", "foot.company": "Empresa", "foot.language": "Idioma",
    "foot.tagline": "El generador de facturas gratuito para autónomos y pequeñas empresas.",
    "banner.prompt": "¿Ver esta página en español?", "banner.switch": "Cambiar", "banner.dismiss": "Descartar",
  },
  pt: {
    "nav.templates": "Modelos", "nav.contact": "Contato",
    "nav.login": "Entrar", "nav.signup": "Criar conta", "nav.start": "Começar grátis",
    "home.eyebrow": "Gerador de faturas grátis",
    "home.h1": "Envie uma fatura profissional em menos de um minuto.",
    "home.sub": "Crie faturas, orçamentos, cotações e recibos e baixe um PDF impecável. Sem cadastro para baixar e nunca com marca d’água.",
    "home.m1": "Sem cadastro para baixar", "home.m2": "Edição grátis e ilimitada", "home.m3": "Baixe e imprima em PDF",
    "doc.description": "Descrição", "doc.qty": "Qtd.", "doc.rate": "Preço", "doc.amount": "Valor", "doc.tax": "Imposto",
    "doc.subtotal": "Subtotal", "doc.discount": "Desconto", "doc.shipping": "Frete",
    "doc.amountPaid": "Valor pago", "doc.balanceDue": "Saldo devedor", "doc.paidInFull": "Pago integralmente",
    "doc.notes": "Notas", "doc.payment": "Pagamento", "doc.no": "N.º", "doc.issued": "Emitida",
    "doc.from": "De", "doc.po": "OC", "doc.method": "Método",
    "doc.jobsite": "Local do serviço", "doc.depositDue": "Sinal a pagar", "doc.schedule": "Cronograma de pagamentos", "doc.photos": "Fotos do serviço",
    "doc.servicePeriod": "Período de serviço", "doc.frequency": "Frequência",
    "doc.date": "Data", "doc.hours": "Horas", "doc.totalHours": "Total de horas",
    "askai.lead": "Prefere perguntar a uma IA?", "askai.ask": "Perguntar ao",
    "ed.downloadPdf": "Baixar PDF", "ed.email": "Enviar por e-mail",
    "ed.print": "Imprimir", "ed.save": "Salvar", "ed.myInvoices": "Minhas faturas", "ed.addItem": "Adicionar item",
    "ed.template": "Modelo", "ed.accent": "Cor", "ed.currency": "Moeda", "ed.docType": "Tipo de documento",
    "tpl.eyebrow": "Biblioteca de modelos", "tpl.h1": "Escolha um modelo. Edite. Baixe.",
    "tpl.all": "Todos os documentos", "tpl.use": "Usar este modelo",
    "foot.product": "Produto", "foot.company": "Empresa", "foot.language": "Idioma",
    "foot.tagline": "O gerador de faturas gratuito para freelancers e pequenas empresas.",
    "banner.prompt": "Ver esta página em português?", "banner.switch": "Mudar", "banner.dismiss": "Dispensar",
  },
  fr: {
    "nav.templates": "Modèles", "nav.contact": "Contact",
    "nav.login": "Connexion", "nav.signup": "S’inscrire", "nav.start": "Commencer gratuitement",
    "home.eyebrow": "Générateur de factures gratuit",
    "home.h1": "Envoyez une facture professionnelle en moins d’une minute.",
    "home.sub": "Créez factures, devis, offres et reçus, puis téléchargez un PDF impeccable. Aucune inscription pour télécharger, et jamais de filigrane.",
    "home.m1": "Aucune inscription pour télécharger", "home.m2": "Édition gratuite et illimitée", "home.m3": "PDF net à télécharger et imprimer",
    "doc.description": "Description", "doc.qty": "Qté", "doc.rate": "Prix unit.", "doc.amount": "Montant", "doc.tax": "TVA",
    "doc.subtotal": "Sous-total", "doc.discount": "Remise", "doc.shipping": "Livraison",
    "doc.amountPaid": "Montant payé", "doc.balanceDue": "Solde dû", "doc.paidInFull": "Intégralement payé",
    "doc.notes": "Notes", "doc.payment": "Paiement", "doc.no": "N°", "doc.issued": "Émise le",
    "doc.from": "De", "doc.po": "BC", "doc.method": "Méthode",
    "doc.jobsite": "Lieu d’intervention", "doc.depositDue": "Acompte à verser", "doc.schedule": "Échéancier de paiement", "doc.photos": "Photos du chantier",
    "doc.servicePeriod": "Période de service", "doc.frequency": "Fréquence",
    "doc.date": "Date", "doc.hours": "Heures", "doc.totalHours": "Total des heures",
    "askai.lead": "Vous préférez demander à une IA ?", "askai.ask": "Demander à",
    "ed.downloadPdf": "Télécharger le PDF", "ed.email": "Envoyer par e-mail",
    "ed.print": "Imprimer", "ed.save": "Enregistrer", "ed.myInvoices": "Mes factures", "ed.addItem": "Ajouter une ligne",
    "ed.template": "Modèle", "ed.accent": "Couleur", "ed.currency": "Devise", "ed.docType": "Type de document",
    "tpl.eyebrow": "Bibliothèque de modèles", "tpl.h1": "Choisissez un modèle. Modifiez-le. Téléchargez.",
    "tpl.all": "Tous les documents", "tpl.use": "Utiliser ce modèle",
    "foot.product": "Produit", "foot.company": "Entreprise", "foot.language": "Langue",
    "foot.tagline": "Le générateur de factures gratuit pour indépendants et petites entreprises.",
    "banner.prompt": "Afficher cette page en français ?", "banner.switch": "Changer", "banner.dismiss": "Ignorer",
  },
  de: {
    "nav.templates": "Vorlagen", "nav.contact": "Kontakt",
    "nav.login": "Anmelden", "nav.signup": "Registrieren", "nav.start": "Kostenlos starten",
    "home.eyebrow": "Kostenloser Rechnungsgenerator",
    "home.h1": "Versenden Sie eine professionelle Rechnung in unter einer Minute.",
    "home.sub": "Erstellen Sie Rechnungen, Kostenvoranschläge, Angebote und Quittungen und laden Sie ein sauberes PDF herunter. Kein Konto zum Herunterladen nötig – und nie ein Wasserzeichen.",
    "home.m1": "Kein Konto zum Herunterladen", "home.m2": "Kostenlos & unbegrenzt bearbeiten", "home.m3": "PDF herunterladen & drucken",
    "doc.description": "Beschreibung", "doc.qty": "Menge", "doc.rate": "Preis", "doc.amount": "Betrag", "doc.tax": "MwSt.",
    "doc.subtotal": "Zwischensumme", "doc.discount": "Rabatt", "doc.shipping": "Versand",
    "doc.amountPaid": "Bezahlt", "doc.balanceDue": "Offener Betrag", "doc.paidInFull": "Vollständig bezahlt",
    "doc.notes": "Anmerkungen", "doc.payment": "Zahlung", "doc.no": "Nr.", "doc.issued": "Ausgestellt",
    "doc.from": "Von", "doc.po": "BestellNr.", "doc.method": "Zahlungsart",
    "doc.jobsite": "Einsatzort", "doc.depositDue": "Fällige Anzahlung", "doc.schedule": "Zahlungsplan", "doc.photos": "Fotos der Arbeit",
    "doc.servicePeriod": "Leistungszeitraum", "doc.frequency": "Turnus",
    "doc.date": "Datum", "doc.hours": "Stunden", "doc.totalHours": "Stunden gesamt",
    "askai.lead": "Lieber eine KI fragen?", "askai.ask": "Fragen:",
    "ed.downloadPdf": "PDF herunterladen", "ed.email": "Per E-Mail senden",
    "ed.print": "Drucken", "ed.save": "Speichern", "ed.myInvoices": "Meine Rechnungen", "ed.addItem": "Position hinzufügen",
    "ed.template": "Vorlage", "ed.accent": "Farbe", "ed.currency": "Währung", "ed.docType": "Dokumenttyp",
    "tpl.eyebrow": "Vorlagen-Bibliothek", "tpl.h1": "Vorlage wählen. Bearbeiten. Herunterladen.",
    "tpl.all": "Alle Dokumente", "tpl.use": "Diese Vorlage verwenden",
    "foot.product": "Produkt", "foot.company": "Unternehmen", "foot.language": "Sprache",
    "foot.tagline": "Der kostenlose Rechnungsgenerator für Freiberufler und kleine Unternehmen.",
    "banner.prompt": "Diese Seite auf Deutsch anzeigen?", "banner.switch": "Wechseln", "banner.dismiss": "Schließen",
  },
  it: {
    "nav.templates": "Modelli", "nav.contact": "Contatti",
    "nav.login": "Accedi", "nav.signup": "Registrati", "nav.start": "Inizia gratis",
    "home.eyebrow": "Generatore di fatture gratuito",
    "home.h1": "Invia una fattura professionale in meno di un minuto.",
    "home.sub": "Crea fatture, preventivi, offerte e ricevute e scarica un PDF pulito. Nessuna registrazione per scaricare e mai una filigrana.",
    "home.m1": "Nessuna registrazione per scaricare", "home.m2": "Modifica gratis e illimitata", "home.m3": "Scarica e stampa in PDF",
    "doc.description": "Descrizione", "doc.qty": "Qtà", "doc.rate": "Prezzo", "doc.amount": "Importo", "doc.tax": "IVA",
    "doc.subtotal": "Subtotale", "doc.discount": "Sconto", "doc.shipping": "Spedizione",
    "doc.amountPaid": "Importo pagato", "doc.balanceDue": "Saldo dovuto", "doc.paidInFull": "Pagato per intero",
    "doc.notes": "Note", "doc.payment": "Pagamento", "doc.no": "N.", "doc.issued": "Emessa",
    "doc.from": "Da", "doc.po": "OdA", "doc.method": "Metodo",
    "doc.jobsite": "Luogo dell’intervento", "doc.depositDue": "Acconto dovuto", "doc.schedule": "Piano dei pagamenti", "doc.photos": "Foto del lavoro",
    "doc.servicePeriod": "Periodo di servizio", "doc.frequency": "Frequenza",
    "doc.date": "Data", "doc.hours": "Ore", "doc.totalHours": "Totale ore",
    "askai.lead": "Preferisci chiedere a un\u2019IA?", "askai.ask": "Chiedi a",
    "ed.downloadPdf": "Scarica PDF", "ed.email": "Invia per email",
    "ed.print": "Stampa", "ed.save": "Salva", "ed.myInvoices": "Le mie fatture", "ed.addItem": "Aggiungi voce",
    "ed.template": "Modello", "ed.accent": "Colore", "ed.currency": "Valuta", "ed.docType": "Tipo di documento",
    "tpl.eyebrow": "Libreria di modelli", "tpl.h1": "Scegli un modello. Modificalo dal vivo. Scarica.",
    "tpl.all": "Tutti i documenti", "tpl.use": "Usa questo modello",
    "foot.product": "Prodotto", "foot.company": "Azienda", "foot.language": "Lingua",
    "foot.tagline": "Il generatore di fatture gratuito per liberi professionisti e piccole imprese.",
    "banner.prompt": "Visualizzare questa pagina in italiano?", "banner.switch": "Cambia", "banner.dismiss": "Chiudi",
  },
  "zh-Hant": {
    "nav.templates": "範本", "nav.contact": "聯絡我們",
    "nav.login": "登入", "nav.signup": "註冊", "nav.start": "免費開始",
    "home.eyebrow": "免費發票產生器",
    "home.h1": "一分鐘內寄出專業發票。",
    "home.sub": "建立發票、估價單、報價單與收據,並下載乾淨的 PDF。免註冊即可下載,永不加浮水印。",
    "home.m1": "免註冊即可下載", "home.m2": "免費且無限次編輯", "home.m3": "下載乾淨的 PDF 並列印",
    "doc.description": "項目說明", "doc.qty": "數量", "doc.rate": "單價", "doc.amount": "金額", "doc.tax": "稅",
    "doc.subtotal": "小計", "doc.discount": "折扣", "doc.shipping": "運費",
    "doc.amountPaid": "已付金額", "doc.balanceDue": "應付餘額", "doc.paidInFull": "已全額付清",
    "doc.notes": "備註", "doc.payment": "付款方式", "doc.no": "編號", "doc.issued": "開立日期",
    "doc.from": "開立方", "doc.po": "採購單號", "doc.method": "付款方式",
    "doc.jobsite": "施工地點", "doc.depositDue": "應付訂金", "doc.schedule": "付款排程", "doc.photos": "施工照片",
    "doc.servicePeriod": "服務期間", "doc.frequency": "服務頻率",
    "doc.date": "日期", "doc.hours": "時數", "doc.totalHours": "總時數",
    "askai.lead": "想問問 AI？", "askai.ask": "問",
    "ed.downloadPdf": "下載 PDF", "ed.email": "以電子郵件寄送",
    "ed.print": "列印", "ed.save": "儲存", "ed.myInvoices": "我的發票", "ed.addItem": "新增項目",
    "ed.template": "範本", "ed.accent": "主題色", "ed.currency": "幣別", "ed.docType": "單據類型",
    "tpl.eyebrow": "範本庫", "tpl.h1": "挑選範本,即時編輯,立即下載。",
    "tpl.all": "所有單據", "tpl.use": "使用此範本",
    "foot.product": "產品", "foot.company": "公司", "foot.language": "語言",
    "foot.tagline": "為自由工作者與小型企業打造的免費發票產生器。",
    "banner.prompt": "以繁體中文顯示此頁面?", "banner.switch": "切換", "banner.dismiss": "關閉",
  },
  ru: {
    "nav.templates": "Шаблоны", "nav.contact": "Контакты",
    "nav.login": "Войти", "nav.signup": "Регистрация", "nav.start": "Начать бесплатно",
    "home.eyebrow": "Бесплатный генератор счетов",
    "home.h1": "Отправьте профессиональный счёт меньше чем за минуту.",
    "home.sub": "Создавайте счета, сметы, предложения и квитанции и скачивайте аккуратный PDF. Скачивание без регистрации и никаких водяных знаков.",
    "home.m1": "Скачивание без регистрации", "home.m2": "Бесплатное редактирование", "home.m3": "Скачивание и печать в PDF",
    "doc.description": "Описание", "doc.qty": "Кол-во", "doc.rate": "Цена", "doc.amount": "Сумма", "doc.tax": "Налог",
    "doc.subtotal": "Подытог", "doc.discount": "Скидка", "doc.shipping": "Доставка",
    "doc.amountPaid": "Оплачено", "doc.balanceDue": "К оплате", "doc.paidInFull": "Оплачено полностью",
    "doc.notes": "Примечания", "doc.payment": "Оплата", "doc.no": "№", "doc.issued": "Дата",
    "doc.from": "От", "doc.po": "Заказ №", "doc.method": "Способ оплаты",
    "doc.jobsite": "Объект работ", "doc.depositDue": "Аванс к оплате", "doc.schedule": "График платежей", "doc.photos": "Фото работ",
    "doc.servicePeriod": "Период обслуживания", "doc.frequency": "Периодичность",
    "doc.date": "Дата", "doc.hours": "Часы", "doc.totalHours": "Всего часов",
    "askai.lead": "Хотите спросить ИИ?", "askai.ask": "Спросить",
    "ed.downloadPdf": "Скачать PDF", "ed.email": "Отправить по почте",
    "ed.print": "Печать", "ed.save": "Сохранить", "ed.myInvoices": "Мои счета", "ed.addItem": "Добавить позицию",
    "ed.template": "Шаблон", "ed.accent": "Цвет", "ed.currency": "Валюта", "ed.docType": "Тип документа",
    "tpl.eyebrow": "Библиотека шаблонов", "tpl.h1": "Выберите шаблон. Отредактируйте. Скачайте.",
    "tpl.all": "Все документы", "tpl.use": "Использовать шаблон",
    "foot.product": "Продукт", "foot.company": "Компания", "foot.language": "Язык",
    "foot.tagline": "Бесплатный генератор счетов для фрилансеров и малого бизнеса.",
    "banner.prompt": "Показать эту страницу на русском?", "banner.switch": "Переключить", "banner.dismiss": "Закрыть",
  },
  bn: {
    "nav.templates": "টেমপ্লেট", "nav.contact": "যোগাযোগ",
    "nav.login": "লগ ইন", "nav.signup": "সাইন আপ", "nav.start": "ফ্রিতে শুরু করুন",
    "home.eyebrow": "ফ্রি চালান তৈরির টুল",
    "home.h1": "এক মিনিটেই পেশাদার চালান পাঠান।",
    "home.sub": "চালান, প্রাক্কলন, দরপত্র ও রসিদ তৈরি করুন এবং পরিষ্কার PDF ডাউনলোড করুন। ডাউনলোডের জন্য সাইন আপ লাগে না।",
    "home.m1": "ডাউনলোডে সাইন আপ লাগে না", "home.m2": "ফ্রি ও সীমাহীন সম্পাদনা", "home.m3": "PDF ডাউনলোড ও প্রিন্ট",
    "doc.description": "বিবরণ", "doc.qty": "পরিমাণ", "doc.rate": "দর", "doc.amount": "টাকা", "doc.tax": "কর",
    "doc.subtotal": "উপমোট", "doc.discount": "ছাড়", "doc.shipping": "পরিবহন",
    "doc.amountPaid": "পরিশোধিত", "doc.balanceDue": "বকেয়া", "doc.paidInFull": "সম্পূর্ণ পরিশোধিত",
    "doc.notes": "মন্তব্য", "doc.payment": "পরিশোধ", "doc.no": "নং", "doc.issued": "ইস্যুর তারিখ",
    "doc.from": "প্রেরক", "doc.po": "ক্রয়াদেশ নং", "doc.method": "পরিশোধ পদ্ধতি",
    "doc.jobsite": "কাজের ঠিকানা", "doc.depositDue": "প্রদেয় অগ্রিম", "doc.schedule": "পরিশোধ সূচি", "doc.photos": "কাজের ছবি",
    "doc.servicePeriod": "সেবার মেয়াদ", "doc.frequency": "কত ঘন ঘন",
    "doc.date": "তারিখ", "doc.hours": "ঘণ্টা", "doc.totalHours": "মোট ঘণ্টা",
    "askai.lead": "AI-কে জিজ্ঞেস করবেন?", "askai.ask": "জিজ্ঞেস করুন",
    "ed.downloadPdf": "PDF ডাউনলোড", "ed.email": "ইমেইলে পাঠান",
    "ed.print": "প্রিন্ট", "ed.save": "সংরক্ষণ", "ed.myInvoices": "আমার চালান", "ed.addItem": "আইটেম যোগ করুন",
    "ed.template": "টেমপ্লেট", "ed.accent": "রঙ", "ed.currency": "মুদ্রা", "ed.docType": "নথির ধরন",
    "tpl.eyebrow": "টেমপ্লেট লাইব্রেরি", "tpl.h1": "টেমপ্লেট বাছুন। সম্পাদনা করুন। ডাউনলোড করুন।",
    "tpl.all": "সব নথি", "tpl.use": "এই টেমপ্লেট ব্যবহার করুন",
    "foot.product": "পণ্য", "foot.company": "কোম্পানি", "foot.language": "ভাষা",
    "foot.tagline": "ফ্রিল্যান্সার ও ছোট ব্যবসার জন্য ফ্রি চালান তৈরির টুল।",
    "banner.prompt": "এই পৃষ্ঠাটি বাংলায় দেখবেন?", "banner.switch": "পরিবর্তন", "banner.dismiss": "বাতিল",
  },
  ko: {
    "nav.templates": "템플릿", "nav.contact": "문의",
    "nav.login": "로그인", "nav.signup": "가입", "nav.start": "무료로 시작",
    "home.eyebrow": "무료 청구서 생성기",
    "home.h1": "1분 안에 전문적인 청구서를 보내세요.",
    "home.sub": "청구서, 견적서, 제안서, 영수증을 만들고 깔끔한 PDF로 다운로드하세요. 다운로드에 가입이 필요 없고 워터마크도 없습니다.",
    "home.m1": "다운로드에 가입 불필요", "home.m2": "무료 무제한 편집", "home.m3": "깔끔한 PDF 다운로드·인쇄",
    "doc.description": "내용", "doc.qty": "수량", "doc.rate": "단가", "doc.amount": "금액", "doc.tax": "세금",
    "doc.subtotal": "소계", "doc.discount": "할인", "doc.shipping": "배송비",
    "doc.amountPaid": "결제 금액", "doc.balanceDue": "미결제 잔액", "doc.paidInFull": "전액 결제됨",
    "doc.notes": "비고", "doc.payment": "결제", "doc.no": "번호", "doc.issued": "발행일",
    "doc.from": "발행처", "doc.po": "발주번호", "doc.method": "결제 방법",
    "doc.jobsite": "작업 현장", "doc.depositDue": "지급할 계약금", "doc.schedule": "결제 일정", "doc.photos": "작업 사진",
    "doc.servicePeriod": "서비스 기간", "doc.frequency": "주기",
    "doc.date": "날짜", "doc.hours": "시간", "doc.totalHours": "총 시간",
    "askai.lead": "AI에게 물어볼까요?", "askai.ask": "물어보기:",
    "ed.downloadPdf": "PDF 다운로드", "ed.email": "이메일로 보내기",
    "ed.print": "인쇄", "ed.save": "저장", "ed.myInvoices": "내 청구서", "ed.addItem": "항목 추가",
    "ed.template": "템플릿", "ed.accent": "강조 색", "ed.currency": "통화", "ed.docType": "문서 유형",
    "tpl.eyebrow": "템플릿 라이브러리", "tpl.h1": "템플릿을 고르고 바로 편집해 다운로드하세요.",
    "tpl.all": "모든 문서", "tpl.use": "이 템플릿 사용",
    "foot.product": "제품", "foot.company": "회사", "foot.language": "언어",
    "foot.tagline": "프리랜서와 소상공인을 위한 무료 청구서 생성기.",
    "banner.prompt": "이 페이지를 한국어로 볼까요?", "banner.switch": "전환", "banner.dismiss": "닫기",
  },
  ja: {
    "nav.templates": "テンプレート", "nav.contact": "お問い合わせ",
    "nav.login": "ログイン", "nav.signup": "新規登録", "nav.start": "無料で始める",
    "home.eyebrow": "無料の請求書作成ツール",
    "home.h1": "プロ仕様の請求書を1分以内で送れます。",
    "home.sub": "請求書・見積書・御見積・領収書を作成し、そのまま美しいPDFでダウンロード。ダウンロードに登録は不要、透かしも入りません。",
    "home.m1": "登録なしでダウンロード", "home.m2": "編集は無料・無制限", "home.m3": "きれいなPDFをダウンロード・印刷",
    "doc.description": "内容", "doc.qty": "数量", "doc.rate": "単価", "doc.amount": "金額", "doc.tax": "税",
    "doc.subtotal": "小計", "doc.discount": "値引き", "doc.shipping": "送料",
    "doc.amountPaid": "入金額", "doc.balanceDue": "未払残高", "doc.paidInFull": "全額入金済",
    "doc.notes": "備考", "doc.payment": "お支払い", "doc.no": "番号", "doc.issued": "発行日",
    "doc.from": "発行元", "doc.po": "発注番号", "doc.method": "支払方法",
    "doc.jobsite": "作業場所", "doc.depositDue": "着手金（お支払い分）", "doc.schedule": "支払スケジュール", "doc.photos": "作業写真",
    "doc.servicePeriod": "サービス期間", "doc.frequency": "頻度",
    "doc.date": "日付", "doc.hours": "時間", "doc.totalHours": "合計時間",
    "askai.lead": "AI に聞いてみますか？", "askai.ask": "聞く:",
    "ed.downloadPdf": "PDFをダウンロード", "ed.email": "メールで送る",
    "ed.print": "印刷", "ed.save": "保存", "ed.myInvoices": "自分の請求書", "ed.addItem": "明細を追加",
    "ed.template": "テンプレート", "ed.accent": "アクセント色", "ed.currency": "通貨", "ed.docType": "書類の種類",
    "tpl.eyebrow": "テンプレート集", "tpl.h1": "テンプレートを選び、その場で編集してダウンロード。",
    "tpl.all": "すべての書類", "tpl.use": "このテンプレートを使う",
    "foot.product": "製品", "foot.company": "会社", "foot.language": "言語",
    "foot.tagline": "フリーランスと小規模事業者のための無料請求書作成ツール。",
    "banner.prompt": "このページを日本語で表示しますか？", "banner.switch": "切り替える", "banner.dismiss": "閉じる",
  },
  sv: {
    "nav.templates": "Mallar", "nav.contact": "Kontakt",
    "nav.login": "Logga in", "nav.signup": "Skapa konto", "nav.start": "Börja gratis",
    "home.eyebrow": "Gratis fakturaprogram",
    "home.h1": "Skicka en professionell faktura på under en minut.",
    "home.sub": "Skapa fakturor, kostnadsförslag, offerter och kvitton och ladda ner en snygg PDF. Ingen registrering för att ladda ner, och aldrig någon vattenstämpel.",
    "home.m1": "Ingen registrering för nedladdning", "home.m2": "Gratis och obegränsad redigering", "home.m3": "Ladda ner och skriv ut som PDF",
    "doc.description": "Beskrivning", "doc.qty": "Antal", "doc.rate": "À-pris", "doc.amount": "Belopp", "doc.tax": "Moms",
    "doc.subtotal": "Delsumma", "doc.discount": "Rabatt", "doc.shipping": "Frakt",
    "doc.amountPaid": "Betalt belopp", "doc.balanceDue": "Återstående belopp", "doc.paidInFull": "Fullt betald",
    "doc.notes": "Anteckningar", "doc.payment": "Betalning", "doc.no": "Nr", "doc.issued": "Fakturadatum",
    "doc.from": "Från", "doc.po": "Beställningsnr", "doc.method": "Betalsätt",
    "doc.jobsite": "Arbetsplats", "doc.depositDue": "Handpenning att betala", "doc.schedule": "Betalningsplan", "doc.photos": "Arbetsfoton",
    "doc.servicePeriod": "Serviceperiod", "doc.frequency": "Intervall",
    "doc.date": "Datum", "doc.hours": "Timmar", "doc.totalHours": "Totalt antal timmar",
    "askai.lead": "Vill du hellre fråga en AI?", "askai.ask": "Fråga",
    "ed.downloadPdf": "Ladda ner PDF", "ed.email": "Skicka via e-post",
    "ed.print": "Skriv ut", "ed.save": "Spara", "ed.myInvoices": "Mina fakturor", "ed.addItem": "Lägg till rad",
    "ed.template": "Mall", "ed.accent": "Accentfärg", "ed.currency": "Valuta", "ed.docType": "Dokumenttyp",
    "tpl.eyebrow": "Mallbibliotek", "tpl.h1": "Välj en mall. Redigera direkt. Ladda ner.",
    "tpl.all": "Alla dokument", "tpl.use": "Använd den här mallen",
    "foot.product": "Produkt", "foot.company": "Företag", "foot.language": "Språk",
    "foot.tagline": "Det gratis fakturaprogrammet för frilansare och småföretag.",
    "banner.prompt": "Vill du se den här sidan på svenska?", "banner.switch": "Byt", "banner.dismiss": "Stäng",
  },
  nl: {
    "nav.templates": "Sjablonen", "nav.contact": "Contact",
    "nav.login": "Inloggen", "nav.signup": "Registreren", "nav.start": "Gratis starten",
    "home.eyebrow": "Gratis factuurgenerator",
    "home.h1": "Verstuur een professionele factuur in minder dan een minuut.",
    "home.sub": "Maak facturen, kostenramingen, offertes en kwitanties en download een strak PDF. Geen registratie om te downloaden en nooit een watermerk.",
    "home.m1": "Geen registratie om te downloaden", "home.m2": "Gratis en onbeperkt bewerken", "home.m3": "PDF downloaden en afdrukken",
    "doc.description": "Omschrijving", "doc.qty": "Aantal", "doc.rate": "Prijs", "doc.amount": "Bedrag", "doc.tax": "Btw",
    "doc.subtotal": "Subtotaal", "doc.discount": "Korting", "doc.shipping": "Verzending",
    "doc.amountPaid": "Betaald bedrag", "doc.balanceDue": "Openstaand bedrag", "doc.paidInFull": "Volledig betaald",
    "doc.notes": "Opmerkingen", "doc.payment": "Betaling", "doc.no": "Nr.", "doc.issued": "Uitgegeven",
    "doc.from": "Van", "doc.po": "Bestelnr.", "doc.method": "Methode",
    "doc.jobsite": "Werklocatie", "doc.depositDue": "Verschuldigde aanbetaling", "doc.schedule": "Betalingsschema", "doc.photos": "Werkfoto’s",
    "doc.servicePeriod": "Serviceperiode", "doc.frequency": "Frequentie",
    "doc.date": "Datum", "doc.hours": "Uren", "doc.totalHours": "Totaal uren",
    "askai.lead": "Liever een AI vragen?", "askai.ask": "Vraag het",
    "ed.downloadPdf": "PDF downloaden", "ed.email": "Factuur e-mailen",
    "ed.print": "Afdrukken", "ed.save": "Opslaan", "ed.myInvoices": "Mijn facturen", "ed.addItem": "Regel toevoegen",
    "ed.template": "Sjabloon", "ed.accent": "Accentkleur", "ed.currency": "Valuta", "ed.docType": "Documenttype",
    "tpl.eyebrow": "Sjabloonbibliotheek", "tpl.h1": "Kies een sjabloon. Bewerk live. Download.",
    "tpl.all": "Alle documenten", "tpl.use": "Dit sjabloon gebruiken",
    "foot.product": "Product", "foot.company": "Bedrijf", "foot.language": "Taal",
    "foot.tagline": "De gratis factuurgenerator voor freelancers en kleine bedrijven.",
    "banner.prompt": "Deze pagina in het Nederlands bekijken?", "banner.switch": "Overschakelen", "banner.dismiss": "Sluiten",
  },
  id: {
    "nav.templates": "Templat", "nav.contact": "Kontak",
    "nav.login": "Masuk", "nav.signup": "Daftar", "nav.start": "Mulai gratis",
    "home.eyebrow": "Pembuat faktur gratis",
    "home.h1": "Kirim faktur profesional dalam waktu kurang dari satu menit.",
    "home.sub": "Buat faktur, estimasi, penawaran, dan kwitansi, lalu unduh PDF yang rapi. Tanpa pendaftaran untuk mengunduh dan tanpa tanda air.",
    "home.m1": "Tanpa pendaftaran untuk mengunduh", "home.m2": "Edit gratis tanpa batas", "home.m3": "Unduh & cetak PDF",
    "doc.description": "Deskripsi", "doc.qty": "Jml", "doc.rate": "Harga", "doc.amount": "Jumlah", "doc.tax": "Pajak",
    "doc.subtotal": "Subtotal", "doc.discount": "Diskon", "doc.shipping": "Pengiriman",
    "doc.amountPaid": "Jumlah dibayar", "doc.balanceDue": "Sisa tagihan", "doc.paidInFull": "Lunas",
    "doc.notes": "Catatan", "doc.payment": "Pembayaran", "doc.no": "No.", "doc.issued": "Diterbitkan",
    "doc.from": "Dari", "doc.po": "No. PO", "doc.method": "Metode",
    "doc.jobsite": "Lokasi pekerjaan", "doc.depositDue": "Uang muka jatuh tempo", "doc.schedule": "Jadwal pembayaran", "doc.photos": "Foto pekerjaan",
    "doc.servicePeriod": "Periode layanan", "doc.frequency": "Frekuensi",
    "doc.date": "Tanggal", "doc.hours": "Jam", "doc.totalHours": "Total jam",
    "askai.lead": "Mau tanya ke AI?", "askai.ask": "Tanya",
    "ed.downloadPdf": "Unduh PDF", "ed.email": "Kirim faktur via email",
    "ed.print": "Cetak", "ed.save": "Simpan", "ed.myInvoices": "Faktur saya", "ed.addItem": "Tambah item",
    "ed.template": "Templat", "ed.accent": "Warna aksen", "ed.currency": "Mata uang", "ed.docType": "Jenis dokumen",
    "tpl.eyebrow": "Pustaka templat", "tpl.h1": "Pilih templat. Edit langsung. Unduh.",
    "tpl.all": "Semua dokumen", "tpl.use": "Gunakan templat ini",
    "foot.product": "Produk", "foot.company": "Perusahaan", "foot.language": "Bahasa",
    "foot.tagline": "Pembuat faktur gratis untuk pekerja lepas dan usaha kecil.",
    "banner.prompt": "Lihat halaman ini dalam Bahasa Indonesia?", "banner.switch": "Ganti", "banner.dismiss": "Tutup",
  },
  vi: {
    "nav.templates": "Mẫu", "nav.contact": "Liên hệ",
    "nav.login": "Đăng nhập", "nav.signup": "Đăng ký", "nav.start": "Bắt đầu miễn phí",
    "home.eyebrow": "Công cụ tạo hóa đơn miễn phí",
    "home.h1": "Gửi hóa đơn chuyên nghiệp trong chưa đầy một phút.",
    "home.sub": "Tạo hóa đơn, dự toán, báo giá và biên nhận, rồi tải xuống PDF sạch đẹp. Không cần đăng ký để tải xuống, và không bao giờ có watermark.",
    "home.m1": "Không cần đăng ký để tải xuống", "home.m2": "Chỉnh sửa miễn phí, không giới hạn", "home.m3": "Tải PDF và in",
    "doc.description": "Mô tả", "doc.qty": "SL", "doc.rate": "Đơn giá", "doc.amount": "Thành tiền", "doc.tax": "Thuế",
    "doc.subtotal": "Tạm tính", "doc.discount": "Giảm giá", "doc.shipping": "Vận chuyển",
    "doc.amountPaid": "Đã thanh toán", "doc.balanceDue": "Số dư còn lại", "doc.paidInFull": "Đã thanh toán đủ",
    "doc.notes": "Ghi chú", "doc.payment": "Thanh toán", "doc.no": "Số", "doc.issued": "Ngày lập",
    "doc.from": "Từ", "doc.po": "Số PO", "doc.method": "Phương thức",
    "doc.jobsite": "Địa điểm thi công", "doc.depositDue": "Tiền cọc phải trả", "doc.schedule": "Lịch thanh toán", "doc.photos": "Ảnh công việc",
    "doc.servicePeriod": "Kỳ dịch vụ", "doc.frequency": "Tần suất",
    "doc.date": "Ngày", "doc.hours": "Giờ", "doc.totalHours": "Tổng số giờ",
    "askai.lead": "Muốn hỏi AI?", "askai.ask": "Hỏi",
    "ed.downloadPdf": "Tải PDF", "ed.email": "Gửi email hóa đơn",
    "ed.print": "In", "ed.save": "Lưu", "ed.myInvoices": "Hóa đơn của tôi", "ed.addItem": "Thêm mục",
    "ed.template": "Mẫu", "ed.accent": "Màu nhấn", "ed.currency": "Tiền tệ", "ed.docType": "Loại chứng từ",
    "tpl.eyebrow": "Thư viện mẫu", "tpl.h1": "Chọn mẫu. Chỉnh sửa trực tiếp. Tải xuống.",
    "tpl.all": "Tất cả chứng từ", "tpl.use": "Dùng mẫu này",
    "foot.product": "Sản phẩm", "foot.company": "Công ty", "foot.language": "Ngôn ngữ",
    "foot.tagline": "Công cụ tạo hóa đơn miễn phí cho freelancer và doanh nghiệp nhỏ.",
    "banner.prompt": "Xem trang này bằng tiếng Việt?", "banner.switch": "Chuyển", "banner.dismiss": "Đóng",
  },
};

export function t(locale, key) {
  const lang = getLocale(locale).lang;               // es-MX -> es
  const d = T[locale] || T[lang] || T.en;
  return d[key] ?? T[lang]?.[key] ?? T.en[key] ?? key;
}
// Bound translator: const tt = useT(locale); tt("nav.templates")
export const useT = (locale) => (key) => t(locale, key);
