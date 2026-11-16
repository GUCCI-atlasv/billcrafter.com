// SEO & multi-language content configuration for Receipt & Invoice OCR landing pages.
//
// Primary English tools:
//   - /invoice-ocr-scanner         (targets "invoice ocr", $19.30 CPC, KD 25)
//   - /receipt-to-csv-converter    (targets "receipt photo to CSV OCR", 4,400/mo, KD 42)
//   - /invoice-to-excel-converter  (targets "pdf invoice to excel", commercial spreadsheet intent)
//
// Tier-1 localized OCR markets (de, es, fr, ja, zh-Hant, zh-Hans, pt):
//   - /<locale>/invoice-ocr-scanner
//   - /<locale>/receipt-to-csv-converter

export const OCR_TIER1_LOCALES = ["de", "es", "fr", "ja", "zh-Hant", "zh-Hans", "pt"];

export const OCR_PAGES_EN = {
  "invoice-ocr-scanner": {
    slug: "invoice-ocr-scanner",
    defaultCsvPreset: "itemized",
    eyebrow: "AI Invoice & Receipt OCR · Instant Excel, CSV & PDF",
    metaTitle: "Free Invoice OCR Scanner – Extract PDF & Photo to Excel",
    metaDescription:
      "Extract vendor details, line items, tax, and totals from any PDF or photo invoice right in your browser. Export clean Excel (.xlsx) or CSV — 100% free, no sign-up.",
    h1: "Free invoice & receipt OCR scanner",
    sub: "Drop a PDF invoice, snap a paper receipt, or paste a screenshot (⌘V). AI extracts every line item, verifies the math, and exports clean Excel (.xlsx), CSV, or an editable PDF invoice — free, no sign-up.",
    pills: ["3 free scans/day · No sign-up", "Math-verified line items", "Exports CSV, Excel (.xlsx) & PDF"],
    stepsTitle: "From paper or PDF to clean spreadsheet in three steps",
    steps: [
      [
        "Drop a PDF, photo, or paste a screenshot",
        "Upload digital PDF invoices, phone photos of paper bills, or press ⌘V / Ctrl+V to paste directly from your clipboard.",
        "/steps/ocr-step-1.png",
      ],
      [
        "Review extracted lines with automatic math verification",
        "Vendor name, tax ID, dates, currency, and every line item populate side-by-side next to your original bill — with an instant subtotal + tax = total check.",
        "/steps/ocr-step-2.png",
      ],
      [
        "Download Excel (.xlsx), CSV, or convert to a client PDF invoice",
        "Export a formatted two-sheet Excel workbook, UTF-8 CSV (QuickBooks/Xero ready), or send extracted expenses straight into BillCrafter’s invoice editor.",
        "/steps/ocr-step-3.png",
      ],
    ],
    sections: [
      {
        h: "Why vision-model invoice OCR beats legacy template rules",
        p: "Traditional OCR engines read characters without understanding table structure — so a skewed contractor bill, a two-line product description, or a European VAT footer scrambles columns in Excel. BillCrafter’s scanner uses structured multimodal vision on Google Cloud Vertex AI to read invoices the way a bookkeeper does: separating quantities from unit rates, isolating sales tax or VAT from line subtotals, and normalizing dates and ISO currencies automatically.",
      },
      {
        h: "Built-in arithmetic sanity checks catch blurry digits before your books do",
        p: "The costliest OCR mistake is a faded thermal digit where an 8 reads as a 3 and silently enters your spreadsheet. Every scan in BillCrafter runs a deterministic math verification pass: we sum your extracted line items, subtract discounts, add tax and tip, and compare the result against the printed grand total. When everything reconciles within two cents, you get a green Verified badge; if anything is off, a one-click reconciliation bar highlights the exact discrepancy.",
      },
      {
        h: "The only free OCR tool that turns vendor receipts directly into client invoices",
        p: "Contractors, consultants, and freelancers don’t just scan bills to archive them — they scan supply-house receipts and travel slips to bill those expenses back to a client. Click “Open in Invoice Editor → Bill expenses to client” and BillCrafter bundles your scanned receipts into a clean Reimbursable Expenses section, attaches the original receipt photos at the bottom of the sheet as proof, and exports a watermark-free vector PDF.",
      },
    ],
    faq: [
      [
        "Is this invoice OCR scanner genuinely free without signing up?",
        "Yes. Guests can scan up to 3 real invoices or receipts per day and download CSV or two-sheet Excel (.xlsx) files immediately with no account and no watermark. Creating a free account unlocks 20 scans per day and 10-file batch uploads.",
      ],
      [
        "Are my uploaded vendor invoices stored or used to train AI?",
        "No. Guest uploads are processed strictly in volatile memory via Google Cloud Vertex AI (covered by enterprise zero-training data governance) and discarded the moment your structured table returns.",
      ],
      [
        "What file formats and languages does the invoice OCR support?",
        "You can upload native or scanned PDFs (up to 4.5 MB), JPG, PNG, or WebP photos, or paste screenshots from your clipboard. It accurately extracts English, German (MwSt.), Spanish (IVA/IRPF), French (TVA), Japanese (適格請求書 / 消費税), Traditional Chinese, and 25+ currencies.",
      ],
      [
        "Can I export multiple invoices into a single CSV or Excel workbook?",
        "Yes. Select up to 3 files as a guest (or 10 files signed in) and export them together into one consolidated Excel (.xlsx) workbook with a Summary sheet (including =SUM formulas) plus a detailed Line Items sheet.",
      ],
      [
        "Not sure how BillCrafter compares to enterprise AP tools?",
        "Read our 2026 side-by-side comparison of 7 free invoice OCR tools covering free-tier limits, sign-up friction, line-item and tax support, and export formats in our Guides hub.",
      ],
    ],
  },

  "receipt-to-csv-converter": {
    slug: "receipt-to-csv-converter",
    defaultCsvPreset: "ledger",
    eyebrow: "Receipt Photo to CSV & Excel · Batch Expense Scanner",
    metaTitle: "Receipt Photo to CSV & Excel Converter – Free AI OCR",
    metaDescription:
      "Snap or upload receipt photos and convert them into a clean CSV or Excel expense spreadsheet in seconds. Batch scan multiple receipts — free, no sign-up.",
    h1: "Receipt photo to CSV & Excel converter",
    sub: "Turn phone photos of crumpled paper receipts into a clean, UTF-8 CSV or Excel expense ledger in seconds. Pre-configured in Expense Report mode (1 row per receipt, or full line items) — 100% free, no sign-up.",
    pills: ["Phone camera & batch upload", "1-row-per-receipt Ledger CSV", "Excel, Google Sheets & QuickBooks ready"],
    stepsTitle: "Turn a stack of receipt photos into one clean CSV",
    steps: [
      [
        "Snap with your phone camera or drop multiple receipt photos",
        "Tap “Snap receipt photo” on iPhone or Android to use your rear camera, or drag a folder of receipt images from your desktop.",
        "/steps/ocr-step-1.png",
      ],
      [
        "Verify merchant, date, category, tax & tip",
        "AI reads faded thermal paper, separates restaurant tips and sales tax from the subtotal, and assigns an expense category automatically.",
        "/steps/ocr-step-2.png",
      ],
      [
        "Export Expense Ledger CSV, Excel (.xlsx), or reimbursement PDF",
        "Download a single CSV where each receipt sits neatly on its own row, export a formatted Excel workbook, or turn receipts into a client reimbursement invoice.",
        "/steps/ocr-step-3.png",
      ],
    ],
    sections: [
      {
        h: "Built for real-world thermal receipts: creases, shadows, and handwritten tips",
        p: "Phone photos of coffee, fuel, parking, and hardware receipts rarely look like flat flatbed scans. Thermal ink fades, paper curls in a wallet, and restaurant receipts split subtotal, tax, and tip at the very bottom. Our vision parser straightens skewed angles automatically, extracts card last-four digits (such as Visa *4242) into the Payment Method column, and keeps tax and gratuity in dedicated columns so your expense claim totals accurately.",
      },
      {
        h: "Two CSV modes: Expense Ledger (1 row per receipt) vs. Full Line Items",
        p: "When filing a monthly expense report or Schedule C bookkeeping sheet, you usually want one clean row per receipt — Date, Merchant, Receipt #, Category, Subtotal, Tax, Tip, and Total — rather than twenty rows of individual groceries. This page defaults to Expense Ledger CSV mode out of the box, while letting you switch to full Itemized Lines or QuickBooks/Xero import headers in one click.",
      },
      {
        h: "Zero character garbling in Microsoft Excel, Numbers, and Google Sheets",
        p: "Plain CSV files often break currency symbols (€, £, ¥) or accented merchant names when double-clicked in Windows Excel. Every CSV exported by BillCrafter includes a standards-compliant UTF-8 BOM header and RFC 4180 quote escaping so descriptions containing commas never shift your amount columns.",
      },
    ],
    faq: [
      [
        "Can I scan receipt photos directly from my iPhone or Android browser without an app?",
        "Yes. Tap “Snap receipt photo” at the top of this page to launch your phone’s rear camera directly in Safari or Chrome. Photos are compressed client-side before upload so even large camera shots transfer reliably.",
      ],
      [
        "How do I combine several receipt photos into one CSV spreadsheet?",
        "Upload up to 3 receipt photos at once without an account (or up to 10 at once with a free account), or click “+ Scan another bill” to keep adding receipts to your batch before clicking Export CSV.",
      ],
      [
        "Does it separate sales tax and restaurant tips from the receipt total?",
        "Yes. Subtotal, sales tax/VAT, and tip/gratuity are extracted into separate numeric columns and checked automatically against the receipt’s grand total.",
      ],
      [
        "Can I turn scanned material receipts into an invoice for my client?",
        "Yes — click “Open in Invoice Editor → Bill expenses to client”. Your scanned receipts populate under a Reimbursable Expenses heading with optional receipt photos attached at the bottom of the PDF.",
      ],
    ],
  },

  "invoice-to-excel-converter": {
    slug: "invoice-to-excel-converter",
    defaultCsvPreset: "itemized",
    eyebrow: "PDF & Image Invoice to Excel (.xlsx) · Two-Sheet Workbook",
    metaTitle: "Free PDF Invoice to Excel & CSV Converter Online",
    metaDescription:
      "Convert PDF and image invoices into structured Excel (.xlsx) workbooks with separate Summary and Line Items sheets plus =SUM formulas. Free, no sign-up.",
    h1: "Convert PDF & image invoices to Excel (.xlsx)",
    sub: "Stop copy-pasting rows out of locked PDFs. Drop any digital or scanned invoice to generate a native Microsoft Excel (.xlsx) workbook with frozen headers, numeric currency formatting, and live =SUM() formulas.",
    pills: ["Native .xlsx (Summary + Line Items)", "Live Excel =SUM() formulas", "Works on scanned & digital PDFs"],
    stepsTitle: "How to convert PDF invoices to clean Excel sheets",
    steps: [
      [
        "Upload native or scanned PDF invoices",
        "Drop up to 10 vendor PDFs or invoice screenshots into the converter — no template setup or zone drawing required.",
        "/steps/ocr-step-1.png",
      ],
      [
        "Inspect structured columns & tax math",
        "Verify vendor details, invoice numbers, due dates, quantities, unit prices, and tax flags right in your browser.",
        "/steps/ocr-step-2.png",
      ],
      [
        "Download formatted .xlsx workbook",
        "Get a genuine OpenXML .xlsx file containing both an executive Summary tab and a granular Line Items tab.",
        "/steps/ocr-step-3.png",
      ],
    ],
    sections: [
      {
        h: "Why generic “PDF to Excel” converters ruin invoice tables",
        p: "Generic layout converters try to turn every visual text box on a PDF into a spreadsheet cell — leaving your company address merged across columns C through F and your numbers stored as un-summable text strings. BillCrafter extracts the semantic accounting data instead, outputting clean, consistent database columns regardless of whether Vendor A puts their total at the top right or bottom left.",
      },
      {
        h: "Genuine two-sheet .xlsx output with real numeric types and =SUM() formulas",
        p: "Every Excel download builds two structured worksheets: Sheet 1 (Summary) lists one row per invoice with Subtotal, Discount, Tax, and Total columns wired to live =SUM() formulas at the foot; Sheet 2 (Line Items) breaks out every SKU, quantity, and unit rate keyed back to the invoice number for pivot tables and cost analysis.",
      },
    ],
    faq: [
      [
        "Does this work on scanned image PDFs as well as digital PDFs?",
        "Yes. Unlike text-layer scrapers that fail on scanned paper invoices, our vision OCR reads both crisp digital PDFs and scanned or photographed documents identically.",
      ],
      [
        "Are the exported Excel amounts real numbers or text?",
        "Every quantity, unit price, tax figure, and total is written as a native numeric cell (#,##0.00) with live =SUM() formulas in the footer row — ready for immediate Excel formulas and pivot tables.",
      ],
      [
        "Is there any watermark or trial paywall on the Excel file?",
        "Never. Exports are 100% clean OpenXML .xlsx and UTF-8 .csv files.",
      ],
    ],
  },
};

// Tier-1 localized OCR landing page definitions (native tax terminology & copy).
export const OCR_PAGES_LOCALIZED = {
  de: {
    "invoice-ocr-scanner": {
      slug: "invoice-ocr-scanner",
      defaultCsvPreset: "itemized",
      eyebrow: "KI Rechnungs-OCR · PDF & Foto nach Excel / CSV",
      metaTitle: "Kostenloser Rechnungs-OCR Scanner – PDF & Belege nach Excel",
      metaDescription:
        "Rechnungen und Kassenbons per KI auslesen: Positionen, 19%/7% MwSt., USt-IdNr. und Summe automatisch erkennen und als Excel (.xlsx) oder CSV exportieren.",
      h1: "Kostenloser Rechnungs- & Beleg-OCR Scanner",
      sub: "Laden Sie PDF-Rechnungen oder Fotos von Kassenbons hoch. Unsere KI erkennt Rechnungsnummer, USt-IdNr., Einzelpositionen sowie 19 % / 7 % MwSt. und exportiert saubere Excel- (.xlsx) oder CSV-Tabellen — ohne Anmeldung.",
      pills: ["3 Gratis-Scans/Tag ohne Konto", "19 % / 7 % MwSt. & Summenprüfung", "Export als Excel (.xlsx), CSV & PDF"],
      stepsTitle: "In drei Schritten vom Belegfoto zur Excel-Tabelle",
      steps: [
        ["PDF-Rechnung oder Kassenbon hochladen", "Datei hineinziehen, per Smartphone fotografieren oder Screenshot mit ⌘V / Strg+V einfügen.", "/steps/ocr-step-1.png"],
        ["Positionen & MwSt. live prüfen", "Alle Zeilen, Nettobeträge und Umsatzsteuer werden automatisch mit der Gesamtsumme abgeglichen.", "/steps/ocr-step-2.png"],
        ["Als Excel (.xlsx), CSV oder PDF-Rechnung exportieren", "Laden Sie eine formatierte Excel-Arbeitsmappe herunter oder erstellen Sie direkt eine eigene Weiterberechnung.", "/steps/ocr-step-3.png"],
      ],
      sections: [
        {
          h: "Präzise Texterkennung für deutsche Rechnungen und Thermobelege",
          p: "Ob Handwerkerrechnung als PDF, Bewirtungsbeleg aus dem Restaurant oder Baumarkt-Kassenbon: Der BillCrafter OCR-Scanner trennt Netto-Einzelpreise sauber von 19 % bzw. 7 % Mehrwertsteuer, erkennt IBAN sowie USt-IdNr. und prüft sofort rechnerisch, ob alle Positionen mit dem Bruttobetrag übereinstimmen.",
        },
        {
          h: "Direkt nach Excel (.xlsx), DATEV-freundlichem CSV oder als Kundenrechnung",
          p: "Exportieren Sie einzelne oder gesammelte Belege ohne Zeichensalat (UTF-8 mit BOM) direkt für Excel oder übergeben Sie Auslagen mit einem Klick in unseren kostenlosen Rechnungsgenerator, um sie Ihren Auftraggebern inklusive Belegfoto weiterzuberechnen.",
        },
      ],
      faq: [
        ["Ist der Rechnungs-OCR Scanner wirklich kostenlos?", "Ja. Ohne Registrierung stehen Ihnen täglich 3 echte KI-Scans inklusive Excel- und CSV-Export kostenlos zur Verfügung. Mit einem kostenlosen Konto sind bis zu 20 Scans pro Tag möglich."],
        ["Werden meine hochgeladenen Rechnungen gespeichert?", "Nein. Gast-Uploads werden ausschließlich flüchtig im Arbeitsspeicher über Google Cloud Vertex AI ausgewertet und sofort danach gelöscht — ohne Nutzung für KI-Training."],
        ["Erkennt das Tool 19 % und 7 % MwSt. sowie USt-IdNr.?", "Ja. Steuersätze, Steuerbeträge, Rechnungsnummern und Lieferantendaten werden strukturiert ausgelesen und rechnerisch validiert."],
      ],
    },
    "receipt-to-csv-converter": {
      slug: "receipt-to-csv-converter",
      defaultCsvPreset: "ledger",
      eyebrow: "Kassenbon & Quittung nach CSV / Excel · Stapel-Scan",
      metaTitle: "Kassenbon & Beleg Foto nach CSV / Excel umwandeln – Gratis OCR",
      metaDescription:
        "Kassenbons und Quittungen fotografieren und automatisch in eine saubere CSV- oder Excel-Ausgabenliste umwandeln. Kostenlos online, ohne Registrierung.",
      h1: "Kassenbon-Foto nach CSV & Excel umwandeln",
      sub: "Fotografieren Sie Papierbelege mit dem Smartphone oder ziehen Sie mehrere Belegfotos hinein — sofort fertig als übersichtliche Ausgaben-CSV (1 Zeile pro Beleg) oder Excel-Datei.",
      pills: ["Smartphone-Kamera & Stapel-Upload", "Ausgabenliste: 1 Zeile pro Beleg", "UTF-8 CSV ohne Umlaut-Fehler"],
      stepsTitle: "Belegfotos in Sekunden zur fertigen Ausgabenliste",
      steps: [
        ["Belege fotografieren oder auswählen", "Direkt über den Smartphone-Browser aufnehmen oder mehrere Fotos vom PC hineinziehen.", "/steps/ocr-step-1.png"],
        ["Händler, Datum, MwSt. & Trinkgeld prüfen", "Auch zerknitterte Thermobelege werden sauber erkannt und automatisch auf Summenfehler geprüft.", "/steps/ocr-step-2.png"],
        ["CSV-Liste oder Excel herunterladen", "Perfekt formatiert für Reisekostenabrechnung, Buchhaltung und Steuerberater.", "/steps/ocr-step-3.png"],
      ],
      sections: [
        {
          h: "Reisekosten & Auslagen ohne Abtippen abrechnen",
          p: "Statt jeden Tank- und Restaurantbeleg einzeln abzutippen, bündelt der Ausgaben-Modus mehrere fotografierte Quittungen in einer einzigen CSV- oder Excel-Tabelle — inklusive korrekter deutscher Umlaute und Komma-Formatierung.",
        },
      ],
      faq: [
        ["Funktioniert das direkt mit der Handy-Kamera ohne App?", "Ja. Tippen Sie auf „Beleg fotografieren“, um direkt im mobilen Browser ein Foto aufzunehmen und als CSV oder Excel zu speichern."],
        ["Sind Umlaute (ä, ö, ü, €) in Excel korrekt lesbar?", "Ja, jede CSV-Datei enthält eine UTF-8-BOM-Kennung, sodass Microsoft Excel unter Windows und Mac alle Sonderzeichen sofort richtig anzeigt."],
      ],
    },
  },

  es: {
    "invoice-ocr-scanner": {
      slug: "invoice-ocr-scanner",
      defaultCsvPreset: "itemized",
      eyebrow: "OCR de Facturas con IA · PDF y Fotos a Excel / CSV",
      metaTitle: "OCR de Facturas Gratis Online – Pasar PDF y Fotos a Excel",
      metaDescription:
        "Extrae datos, líneas de detalle, NIF/CIF, IVA e importes de facturas en PDF o foto en segundos. Exporta a Excel (.xlsx) o CSV gratis y sin registro.",
      h1: "Escáner OCR de facturas y recibos gratis",
      sub: "Sube una factura en PDF, fotografía un ticket en papel o pega una captura (⌘V). Nuestra IA extrae proveedor, NIF, conceptos, IVA y total, y exporta un Excel (.xlsx) o CSV impecable — gratis y sin registro.",
      pills: ["3 escaneos gratis/día sin cuenta", "Verificación automática de IVA y total", "Exporta Excel (.xlsx), CSV y PDF"],
      stepsTitle: "De factura en PDF o papel a Excel en tres pasos",
      steps: [
        ["Sube tu PDF o foto de factura", "Arrastra archivos desde tu ordenador, usa la cámara del móvil o pega una captura con Ctrl+V.", "/steps/ocr-step-1.png"],
        ["Revisa líneas e impuestos verificados", "Comprobamos automáticamente que la base imponible más el IVA coincida con el total del documento.", "/steps/ocr-step-2.png"],
        ["Descarga Excel (.xlsx), CSV o crea factura PDF", "Obtén un libro Excel con fórmulas =SUM() o convierte gastos en una factura lista para enviar a tu cliente.", "/steps/ocr-step-3.png"],
      ],
      sections: [
        {
          h: "Extracción inteligente adaptada a facturas en español (NIF, IVA, recargos)",
          p: "Olvídate de copiar tablas a mano desde PDFs bloqueados. El motor OCR de BillCrafter identifica emisor, NIF/CIF, número de factura, base imponible e IVA (21 %, 10 %, 4 % o 16 % en México), entregando columnas numéricas limpias listas para tu gestoría o contabilidad.",
        },
      ],
      faq: [
        ["¿Es realmente gratis pasar facturas a Excel sin registrarse?", "Sí. Puedes escanear hasta 3 facturas o tickets al día gratis sin cuenta y descargar Excel o CSV sin marcas de agua. Con una cuenta gratuita dispones de 20 escaneos diarios."],
        ["¿Se guardan mis facturas en algún servidor?", "No. Los documentos de usuarios invitados se procesan en memoria mediante Google Cloud Vertex AI y se borran al instante."],
      ],
    },
    "receipt-to-csv-converter": {
      slug: "receipt-to-csv-converter",
      defaultCsvPreset: "ledger",
      eyebrow: "Pasar Tickets de Compra a Excel y CSV · Escáner IA",
      metaTitle: "Pasar Fotos de Tickets y Recibos a CSV / Excel – OCR Gratis",
      metaDescription:
        "Convierte fotos de tickets de compra, restaurantes y gasolina en una hoja CSV o Excel de gastos en segundos. Gratis, sin instalar apps y sin registro.",
      h1: "Convertir fotos de tickets y recibos a CSV y Excel",
      sub: "Haz una foto a tus tickets de gastos o sube varias imágenes a la vez para generar una hoja de gastos CSV o Excel ordenada por fecha, comercio, categoría, IVA y total.",
      pills: ["Cámara móvil y subida por lotes", "Modo hoja de gastos (1 fila/ticket)", "CSV UTF-8 compatible con Excel"],
      stepsTitle: "Digitaliza tus tickets de gastos en segundos",
      steps: [
        ["Fotografía o arrastra varios tickets", "Funciona directamente desde el navegador del móvil o en escritorio.", "/steps/ocr-step-1.png"],
        ["Comprueba importe, IVA y propina", "Detecta tickets térmicos arrugados y valida la suma automáticamente.", "/steps/ocr-step-2.png"],
        ["Exporta tu CSV de gastos o refactura al cliente", "Descarga la tabla unificada o genera una factura PDF de gastos reembolsables.", "/steps/ocr-step-3.png"],
      ],
      sections: [
        {
          h: "Ideal para autónomos, notas de gastos de viaje y pequeños negocios",
          p: "Reúne hasta 10 tickets de taxi, comidas o materiales en una sola tabla resumen sin errores de acentos ni símbolos de euro (€) al abrir en Microsoft Excel.",
        },
      ],
      faq: [
        ["¿Puedo unir varios tickets en un solo archivo Excel o CSV?", "Sí. Sube varios tickets seguidos y descárgalos todos juntos en una única hoja resumen lista para liquidar gastos."],
      ],
    },
  },

  fr: {
    "invoice-ocr-scanner": {
      slug: "invoice-ocr-scanner",
      defaultCsvPreset: "itemized",
      eyebrow: "OCR Facture IA · Extraire PDF & Photo vers Excel / CSV",
      metaTitle: "OCR Facture Gratuit en Ligne – Convertir PDF & Reçu en Excel",
      metaDescription:
        "Extrayez automatiquement fournisseur, SIRET, lignes, TVA et total de vos factures PDF ou photos. Export Excel (.xlsx) et CSV gratuit, sans inscription.",
      h1: "Scanner OCR de factures et reçus gratuit",
      sub: "Glissez une facture PDF ou photographiez un justificatif : l’IA extrait chaque ligne, vérifie le calcul HT + TVA = TTC et génère un fichier Excel (.xlsx) ou CSV propre — sans compte requis.",
      pills: ["3 scans gratuits/jour sans inscription", "Contrôle automatique HT + TVA = TTC", "Export Excel (.xlsx), CSV & PDF"],
      stepsTitle: "Transformez vos factures en tableau Excel en 3 étapes",
      steps: [
        ["Importez un PDF ou une photo", "Glissez-déposez vos fichiers, prenez une photo sur mobile ou collez une capture (⌘V / Ctrl+V).", "/steps/ocr-step-1.png"],
        ["Vérifiez les lignes et la TVA", "Les montants HT, taux de TVA (20 %, 10 %, 5,5 %) et totaux TTC sont contrôlés automatiquement.", "/steps/ocr-step-2.png"],
        ["Téléchargez en Excel, CSV ou refacturez en PDF", "Récupérez un classeur Excel structuré ou basculez les frais dans notre éditeur de factures gratuit.", "/steps/ocr-step-3.png"],
      ],
      sections: [
        {
          h: "Fini la saisie manuelle des factures fournisseurs et notes de frais",
          p: "Notre lecteur OCR propulsé par Google Cloud Vertex AI reconnaît instantanément les numéros SIRET/TVA, les lignes d’articles et les devises, tout en garantissant zéro conservation des fichiers invités.",
        },
      ],
      faq: [
        ["Cet outil OCR facture est-il vraiment gratuit ?", "Oui : 3 scans par jour sans inscription, et jusqu’à 20 scans par jour avec un compte gratuit, sans aucun filigrane."],
      ],
    },
    "receipt-to-csv-converter": {
      slug: "receipt-to-csv-converter",
      defaultCsvPreset: "ledger",
      eyebrow: "Ticket de Caisse vers CSV & Excel · Note de Frais IA",
      metaTitle: "Convertir Photo de Ticket de Caisse en CSV & Excel – OCR Gratuit",
      metaDescription:
        "Photographiez vos tickets de caisse et reçus pour les convertir en tableau CSV ou Excel de notes de frais en quelques secondes. Gratuit, sans inscription.",
      h1: "Convertir vos photos de tickets de caisse en CSV & Excel",
      sub: "Transformez vos justificatifs papier (restaurant, carburant, fournitures) en une note de frais CSV ou Excel prête pour la comptabilité.",
      pills: ["Appareil photo mobile & lot", "1 ligne par reçu (Note de frais)", "Encodage UTF-8 parfait pour Excel"],
      stepsTitle: "Vos justificatifs papier en fichier Excel en quelques secondes",
      steps: [
        ["Prenez en photo ou déposez vos reçus", "Directement depuis Safari/Chrome sur téléphone ou sur ordinateur.", "/steps/ocr-step-1.png"],
        ["Contrôlez commerçant, date et TVA", "Extraction fiable même sur les tickets thermiques froissés.", "/steps/ocr-step-2.png"],
        ["Exportez en CSV / Excel ou refacturez", "Un fichier unique propre pour votre expert-comptable ou votre client.", "/steps/ocr-step-3.png"],
      ],
      sections: [
        {
          h: "Idéal pour les indépendants, consultants et artisans",
          p: "Regroupez plusieurs reçus en une seule feuille récapitulative ou transformez vos achats de matériel en facture client PDF avec justificatifs photo joints.",
        },
      ],
      faq: [
        ["Puis-je regrouper plusieurs tickets dans un seul CSV ?", "Oui, importez plusieurs photos et téléchargez un récapitulatif consolidé en un clic."],
      ],
    },
  },

  ja: {
    "invoice-ocr-scanner": {
      slug: "invoice-ocr-scanner",
      defaultCsvPreset: "itemized",
      eyebrow: "AI請求書・領収書OCR · PDF・写真をExcel / CSVへ即時変換",
      metaTitle: "無料 請求書OCRスキャナー｜PDF・領収書画像をExcel・CSV変換",
      metaDescription:
        "PDF請求書やスマホで撮った領収書から取引先・登録番号(インボイスT番号)・明細行・消費税をAIが自動抽出。登録不要・無料でExcel(.xlsx)やCSVに出力。",
      h1: "無料の請求書・領収書 AI OCRスキャナー",
      sub: "PDF請求書や紙の領収書写真をドロップするだけ。AIが発行元・適格請求書登録番号・品目明細・消費税（10% / 8%）を読み取り、文字化けしないExcel（.xlsx）やCSVへ即座に変換します。",
      pills: ["登録不要で1日3件無料", "明細合計＋消費税の自動検算", "Excel(.xlsx)・CSV・PDF請求書出力"],
      stepsTitle: "たった3ステップで紙・PDFをきれいなExcel表へ",
      steps: [
        ["PDFまたは領収書写真をアップロード", "ドラッグ＆ドロップ、スマホカメラ撮影、または ⌘V / Ctrl+V でのスクショ貼り付けに対応。", "/steps/ocr-step-1.png"],
        ["原本と見比べながら自動検算チェック", "小計＋消費税＝合計金額が一致しているかを自動で検証し、読み取りミスを防ぎます。", "/steps/ocr-step-2.png"],
        ["Excel(.xlsx)・CSV保存、またはPDF請求書化", "SUM関数付きの2シートExcelブックとして保存、または立替経費の請求書PDFをワンクリック作成。", "/steps/ocr-step-3.png"],
      ],
      sections: [
        {
          h: "インボイス制度（T番号）や軽減税率を含む日本の請求書・領収書にも対応",
          p: "従来のOCRでは崩れやすかった複数行の品目テーブルや日本語の縦横混在レイアウトも、Google Cloud Vertex AIの最新ビジョンモデルが高精度に構造化。端数処理や税額も自動で突合します。",
        },
      ],
      faq: [
        ["本当にアカウント登録なしで無料で使えますか？", "はい。登録なしで1日3件まで無料でOCR解析およびExcel・CSVダウンロードが可能です。無料アカウントを作成すると1日20件・最大10枚の一括処理が解放されます。"],
        ["アップロードした請求書データは保存・AI学習されますか？", "いいえ。ゲスト利用時のファイルはメモリ上でのみ一時処理され、結果返却と同時に破棄されます。AIモデルの学習にも一切使用されません。"],
      ],
    },
    "receipt-to-csv-converter": {
      slug: "receipt-to-csv-converter",
      defaultCsvPreset: "ledger",
      eyebrow: "領収書・レシート写真をCSV / Excel変換 · 経費精算OCR",
      metaTitle: "領収書・レシート写真をExcel・CSVに無料変換｜AI経費OCR",
      metaDescription:
        "スマホで撮影した領収書やレシート画像を、文字化けしないCSV・Excel経費精算シートへ数秒で自動変換。複数枚のまとめ出力にも対応、登録不要・無料。",
      h1: "領収書・レシート写真をCSV＆Excelへ一括変換",
      sub: "溜まった紙のレシートや領収書をスマホで撮ってアップロードするだけ。日付・支払先・勘定科目・消費税・合計金額を1枚1行の経費精算CSVまたはExcelへ自動集計します。",
      pills: ["スマホカメラ直撮り＆複数枚対応", "経費精算モード（1領収書＝1行）", "Windows Excelで文字化けゼロ(BOM付)"],
      stepsTitle: "レシートの山を数秒で経費精算シートへ",
      steps: [
        ["スマホで撮影または画像をまとめて選択", "アプリ不要でiPhone / Androidのブラウザから直接カメラを起動できます。", "/steps/ocr-step-1.png"],
        ["日付・店舗名・税額を確認", "シワのある感熱紙レシートも高精度に読み取り、合計金額を自動チェック。", "/steps/ocr-step-2.png"],
        ["CSV / Excel出力、または取引先へ立替請求", "確定申告や経費精算にそのまま使える表形式でダウンロードできます。", "/steps/ocr-step-3.png"],
      ],
      sections: [
        {
          h: "確定申告・月次経費精算の手入力をゼロに",
          p: "BOM付きUTF-8形式でCSVを生成するため、Windows版Microsoft Excelでダブルクリックしても日本語や円記号が一切文字化けしません。",
        },
      ],
      faq: [
        ["複数枚のレシートを1つのExcel・CSVにまとめられますか？", "はい。連続でスキャンして「CSV出力」または「Excel (.xlsx)」を押すと、全レシートが1つの集計表にまとまって出力されます。"],
      ],
    },
  },

  "zh-Hans": {
    "invoice-ocr-scanner": {
      slug: "invoice-ocr-scanner",
      defaultCsvPreset: "itemized",
      eyebrow: "AI 发票与票据 OCR · PDF 与照片秒转 Excel / CSV",
      metaTitle: "免费发票 OCR 识别工具 – PDF 与纸质票据自动转 Excel / CSV",
      metaDescription:
        "上传 PDF 发票或手机拍摄小票，AI 自动提取商家税号、日期、明细行、增值税与总额，一键导出不乱码 Excel (.xlsx) 或 CSV。免注册免费使用。",
      h1: "免费 AI 发票与票据 OCR 识别器",
      sub: "拖入 PDF 供应商发票、手机拍下纸质小票或按 ⌘V 粘贴截图，AI 自动提取明细表格并核对「小计＋税额＝总计」，一键下载双工作表 Excel (.xlsx)、CSV 或转为正式 PDF 请款单。",
      pills: ["免注册每日免费 3 张", "自动算术核对防漏字", "支持 Excel (.xlsx)、CSV 与转开发票"],
      stepsTitle: "三步将纸质或 PDF 发票转为整洁电子表格",
      steps: [
        ["上传 PDF、照片或粘贴截图", "支持电脑批量拖拽、手机后置摄像头直接拍照，或 Ctrl+V / ⌘V 粘贴屏幕截图。", "/steps/ocr-step-1.png"],
        ["左图右表实时校对与金额验算", "自动识别税号、币种（含 CNY 人民币）、单价数量与 13%/9%/6% 增值税，并实时比对总金额是否相符。", "/steps/ocr-step-2.png"],
        ["导出 Excel / CSV 或一键生成请款 PDF", "下载含 =SUM() 公式的原生 Excel 文件，或将代垫票据直接送入发票编辑器向客户请款。", "/steps/ocr-step-3.png"],
      ],
      sections: [
        {
          h: "专为中国商业单据与跨境外币发票打造的结构化视觉识别",
          p: "无论是增值税电子/纸质发票、商业 Invoice 还是海外供应商寄来的英文/日文 PDF 账单，都能精准分离品名、数量、单价与税额，告别手动录入与复制粘贴错位。",
        },
      ],
      faq: [
        ["导出的 CSV 在 Windows Excel 打开中文会乱码吗？", "不会乱码。所有 CSV 均自动写入标准 UTF-8 BOM 文件头，在 Windows Excel、WPS 表格、Mac Numbers 或 Google 表格中直接双击打开即可正常显示简体中文与人民币（¥）等货币符号。"],
        ["上传的公司发票会被保存或外泄吗？", "不会。未登录访客的文件仅在内存中通过企业级 Google Cloud Vertex AI 解析，返回表格后立即释放，不写入数据库也不用于训练模型。"],
      ],
    },
    "receipt-to-csv-converter": {
      slug: "receipt-to-csv-converter",
      defaultCsvPreset: "ledger",
      eyebrow: "票据拍照转 CSV 与 Excel · 差旅报销批量扫描",
      metaTitle: "小票拍照转 CSV & Excel 免费工具 – AI 自动整理报销明细",
      metaDescription:
        "用手机拍下餐饮、交通、采购小票，几秒内自动转成整齐的 CSV 或 Excel 费用报销表。支持多张票据合并导出，免安装 App、免注册。",
      h1: "票据照片转 CSV 与 Excel 报销表转换器",
      sub: "出差与采购小票不用再一张张手打！手机浏览器直接拍照或批量拖入照片，自动汇总成“一张票据一行”的干净 CSV / Excel 费用台账。",
      pills: ["手机相机直拍免装 App", "默认报销台账模式 (1张1行)", "一键转为附票据照片的客户请款单"],
      stepsTitle: "几秒内把一叠纸质票据变成报销 Excel",
      steps: [
        ["手机拍照或批量选取小票照片", "点击“拍照识别票据”直接打开手机后置摄像头，自动压缩加速上传。", "/steps/ocr-step-1.png"],
        ["自动分类餐饮、差旅、材料与税额", "即使热敏小票轻微褶皱或含手写小费，也能准确分离并验算金额。", "/steps/ocr-step-2.png"],
        ["下载汇总报销表或转向客户请款", "一次导出干净表格，或连同票据照片一键生成专业 PDF 报销发票。", "/steps/ocr-step-3.png"],
      ],
      sections: [
        {
          h: "自由职业者、工程承包与财务报销的月底救星",
          p: "支持连续扫描多张小票并自动合并为同一份 Excel 工作簿（含 Summary 汇总表与 Line Items 明细表），大幅减少人工录单时间。",
        },
      ],
      faq: [
        ["可以把拍完的采购或差旅小票直接变成向客户请款的发票吗？", "可以！点击右上角“转入发票编辑器 → 转为向客户请款的报销发票”，系统会自动生成代垫费用明细并将票据原图附在 PDF 底部作为凭证。"],
      ],
    },
  },

  "zh-Hant": {
    "invoice-ocr-scanner": {
      slug: "invoice-ocr-scanner",
      defaultCsvPreset: "itemized",
      eyebrow: "AI 發票與收據 OCR · PDF 與照片秒轉 Excel / CSV",
      metaTitle: "免費發票 OCR 辨識工具 – PDF 與紙本收據自動轉 Excel / CSV",
      metaDescription:
        "上傳 PDF 發票或手機拍攝收據，AI 自動擷取廠商統編、日期、品項明細、營業稅與總額，一鍵匯出不亂碼 Excel (.xlsx) 或 CSV。免註冊免費使用。",
      h1: "免費 AI 發票與收據 OCR 辨識器",
      sub: "拖入 PDF 廠商發票、手機拍下紙本收據或按 ⌘V 貼上截圖，AI 自動擷取品項表格並比對「小計＋稅額＝總計」加總，一鍵下載雙工作表 Excel (.xlsx)、CSV 或轉為正式 PDF 請款單。",
      pills: ["免註冊每日免費 3 張", "自動算術核對防漏字", "支援 Excel (.xlsx)、CSV 與轉開發票"],
      stepsTitle: "三步驟將紙本或 PDF 發票轉為整齊電子表格",
      steps: [
        ["上傳 PDF、照片或貼上截圖", "支援電腦批次拖曳、手機後置鏡頭直接拍照，或 Ctrl+V / ⌘V 貼上畫面截圖。", "/steps/ocr-step-1.png"],
        ["左圖右表即時校對與金額驗算", "自動辨識統一編號、幣別、單價數量與 5% 營業稅，並即時比對總金額是否相符。", "/steps/ocr-step-2.png"],
        ["匯出 Excel / CSV 或一鍵產生請款 PDF", "下載含 =SUM() 公式的原生 Excel 檔，或將代墊收據直接送入發票編輯器向客戶請款。", "/steps/ocr-step-3.png"],
      ],
      sections: [
        {
          h: "專為台灣與香港商業單據、外幣發票打造的結構化視覺辨識",
          p: "不論是台灣三聯式發票（8 碼統編與 5% 營業稅）、香港免稅商業 Invoice，或是歐美日供應商寄來的英文/日文 PDF 帳單，皆能精準分離品項、數量、單價與稅金，徹底告別手動敲表與複製貼上錯位。",
        },
      ],
      faq: [
        ["匯出的 CSV 在 Windows Excel 打開中文會亂碼嗎？", "絕不亂碼。所有 CSV 均自動寫入標準 UTF-8 BOM 檔頭，無論在 Windows Excel、Mac Numbers 或 Google 試算表直接雙擊皆完美顯示繁體中文與各國貨幣符號。"],
        ["上傳的公司發票會被儲存或外洩嗎？", "不會。未登入訪客的檔案僅於記憶體中透過企業級 Google Cloud Vertex AI 解析，回傳表格後立即銷毀，絕不留存亦不用於訓練模型。"],
      ],
    },
    "receipt-to-csv-converter": {
      slug: "receipt-to-csv-converter",
      defaultCsvPreset: "ledger",
      eyebrow: "收據拍照轉 CSV 與 Excel · 差旅報銷批次掃描",
      metaTitle: "收據拍照轉 CSV & Excel 免費工具 – AI 自動整理報銷明細",
      metaDescription:
        "用手機拍下餐飲、交通、五金採購收據，數秒內自動轉成整齊的 CSV 或 Excel 費用報銷表。支援多張收據合併匯出，免安裝 App、免註冊。",
      h1: "收據照片轉 CSV 與 Excel 報銷表轉換器",
      sub: "出差與採購收據不必再一張張手打！手機網頁直接拍照或批次拖入照片，自動彙整成「一張收據一行」的乾淨 CSV / Excel 費用總表。",
      pills: ["手機相機直拍免裝 App", "預設報銷總表模式 (1張1行)", "一鍵轉為附收據照片的客戶請款單"],
      stepsTitle: "數秒內把一疊紙本收據變成報銷 Excel",
      steps: [
        ["手機拍照或批次選取收據照片", "點選「拍照辨識收據」直接開啟手機後鏡頭，自動壓縮加速上傳。", "/steps/ocr-step-1.png"],
        ["自動分類餐飲、交通、材料與稅金", "即使熱感應紙微皺或含手寫小費，也能準確分離並驗算金額。", "/steps/ocr-step-2.png"],
        ["下載合併報銷表或轉向客戶請款", "一次匯出乾淨試算表，或連同收據照片一鍵產生專業 PDF 報銷發票。", "/steps/ocr-step-3.png"],
      ],
      sections: [
        {
          h: "自由工作者、工程統包與行政會計的月底報銷救星",
          p: "支援連續掃描多張小票並自動合併為同一份 Excel 工作簿（含 Summary 總表與 Line Items 明細表），省下 90% 人工登打時間。",
        },
      ],
      faq: [
        ["可以把拍完的五金或差旅收據直接變成跟客戶請款的發票嗎？", "可以！點擊右上角「轉入發票編輯器 → 轉為向客戶請款的報銷發票」，系統會自動建立代墊費用明細並將收據原圖附在 PDF 底部作為憑證。"],
      ],
    },
  },

  pt: {
    "invoice-ocr-scanner": {
      slug: "invoice-ocr-scanner",
      defaultCsvPreset: "itemized",
      eyebrow: "OCR de Faturas e Recibos com IA · PDF e Foto para Excel",
      metaTitle: "Scanner OCR de Faturas Grátis – Converter PDF e Foto em Excel",
      metaDescription:
        "Extraia fornecedor, CNPJ/NIF, itens, impostos e totais de faturas em PDF ou foto em segundos. Baixe em Excel (.xlsx) ou CSV grátis e sem cadastro.",
      h1: "Scanner OCR gratuito de faturas e recibos",
      sub: "Envie uma fatura em PDF, tire foto de um recibo ou cole uma captura (⌘V). A IA extrai todos os itens, confere a soma e exporta para Excel (.xlsx), CSV ou fatura PDF editável — grátis e sem registro.",
      pills: ["3 scans grátis/dia sem cadastro", "Conferência matemática automática", "Exporta Excel (.xlsx), CSV e PDF"],
      stepsTitle: "De PDF ou recibo em papel para o Excel em 3 passos",
      steps: [
        ["Envie o PDF ou foto do documento", "Arraste arquivos no computador, fotografe pelo celular ou cole com Ctrl+V.", "/steps/ocr-step-1.png"],
        ["Confira itens, impostos e total", "Verificação automática se os itens + impostos batem com o valor total.", "/steps/ocr-step-2.png"],
        ["Baixe Excel (.xlsx), CSV ou gere fatura PDF", "Planilha pronta com fórmulas =SUM() ou reembolso em PDF para seu cliente.", "/steps/ocr-step-3.png"],
      ],
      sections: [
        {
          h: "Extração contábil limpa para faturas no Brasil e em Portugal",
          p: "Reconhece R$ (BRL), € (EUR), CNPJ/CPF, NIF e IVA, gerando colunas numéricas reais no Excel sem desconfigurar acentos.",
        },
      ],
      faq: [
        ["É realmente gratuito e sem marca d’água?", "Sim! Até 3 digitalizações diárias grátis como visitante (ou 20/dia com conta gratuita), com exportação limpa em Excel e CSV."],
      ],
    },
    "receipt-to-csv-converter": {
      slug: "receipt-to-csv-converter",
      defaultCsvPreset: "ledger",
      eyebrow: "Foto de Recibo para CSV e Excel · Relatório de Despesas",
      metaTitle: "Converter Foto de Recibo e Cupom para CSV / Excel – OCR Grátis",
      metaDescription:
        "Fotografe recibos e cupons e transforme-os automaticamente em uma planilha CSV ou Excel de despesas em segundos. Grátis online e sem cadastro.",
      h1: "Conversor de foto de recibo para CSV e Excel",
      sub: "Transforme fotos de recibos de viagem, alimentação e materiais em uma planilha organizada de reembolso (1 linha por recibo) em segundos.",
      pills: ["Câmera do celular e envio em lote", "Modo planilha de despesas", "CSV UTF-8 pronto para Excel"],
      stepsTitle: "Seus recibos em planilha sem digitação manual",
      steps: [
        ["Tire foto ou envie vários recibos", "Funciona direto no navegador do celular sem baixar aplicativo.", "/steps/ocr-step-1.png"],
        ["Revise data, local, categoria e valor", "Leitura precisa até em papel térmico amassado.", "/steps/ocr-step-2.png"],
        ["Exporte CSV / Excel ou cobre do cliente", "Baixe o relatório consolidado ou gere uma fatura PDF com fotos anexadas.", "/steps/ocr-step-3.png"],
      ],
      sections: [
        {
          h: "Perfeito para prestação de contas e reembolso de clientes",
          p: "Junte vários recibos em um único arquivo CSV ou Excel e economize horas de fechamento mensal.",
        },
      ],
      faq: [
        ["Posso juntar vários recibos na mesma planilha?", "Sim, envie vários arquivos em sequência e baixe todos consolidados em um único CSV ou Excel."],
      ],
    },
  },
};

export function getOcrPageConfig(slug, locale = "en") {
  if (locale === "en") return OCR_PAGES_EN[slug] || null;
  return OCR_PAGES_LOCALIZED[locale]?.[slug] || null;
}

export function ocrAlternatesFor(slug) {
  // Only invoice-ocr-scanner and receipt-to-csv-converter exist across Tier-1 locales
  if (slug !== "invoice-ocr-scanner" && slug !== "receipt-to-csv-converter") {
    return { canonical: `/${slug}` };
  }
  const hreflangMap = {
    en: `/${slug}`,
    de: `/de/${slug}`,
    "es-ES": `/es/${slug}`,
    fr: `/fr/${slug}`,
    ja: `/ja/${slug}`,
    "zh-Hant-HK": `/zh-Hant/${slug}`,
    "zh-Hans-CN": `/zh-Hans/${slug}`,
    "pt-BR": `/pt/${slug}`,
    "x-default": `/${slug}`,
  };
  return { languages: hreflangMap };
}
