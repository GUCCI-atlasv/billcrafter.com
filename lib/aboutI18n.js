// Localized copy for the /about page (and /<locale>/about).
// Keyed by language; regional variants fall back to their language, then English.
import { getLocale, DEFAULT_LOCALE } from "./i18n";

const A = {
  en: {
    title: "About", desc: "About BillCrafter — a free online invoice generator built by CCC STUDIO for freelancers and small businesses. Our mission, how the tool works, and how to reach us.",
    eyebrow: "About", h1: "Invoicing shouldn’t cost anything to start.",
    sub: "BillCrafter is a free online invoice generator for freelancers and small businesses. It’s built and operated by CCC STUDIO, a small independent software team in the United States.",
    reviewed: "Reviewed by CCC STUDIO", updated: "Updated",
    figcaption: "Pick a template, edit it in the browser, and download a clean PDF — no account needed to start.",
    why: { h2: "Why we built it", p: "Getting paid is hard enough without wrestling billing software. Most invoicing tools ask you to create an account, pick a plan, and learn a dashboard before you can send a single document. We wanted the opposite: open the page, type on the invoice, and download a clean PDF — no signup, no card, nothing to install. Your first invoice is free and takes under two minutes." },
    how: { h2: "How it works", p: "The editor is fully WYSIWYG — what you type on the document is exactly what downloads. You can create invoices, estimates, quotes and receipts, choose from 45 templates across eight layouts, add your logo, and bill in 25+ currencies with region-aware tax formatting. Sign in with a free account and BillCrafter remembers your business details, clients and past invoices so the next one takes seconds. A free account unlocks everything — unlimited exports, status stamps and recurring invoices — with no paid plans." },
    who: { h2: "Who runs it", p: "BillCrafter is made by CCC STUDIO. We’re a small team, we don’t sell your data, and drafts stay in your browser until you choose to save them to an account. BillCrafter is a document tool, not an accounting or legal service — tax and contract rules vary by country and state, so check anything material with a qualified professional." },
    contact: { h2: "Get in touch", q: "Questions, feedback, or a feature request? Email", or: "or use the", pageLabel: "contact page", ready: "Ready to try it?", createLabel: "Create an invoice", tail: "— no signup needed." },
  },

  ja: {
    title: "運営者情報", desc: "BillCrafter について — フリーランスと小規模事業者のために CCC STUDIO が開発した無料のオンライン請求書作成ツール。目的、仕組み、お問い合わせ先をご案内します。",
    eyebrow: "運営者情報", h1: "請求書づくりは、始めるのに費用がかからないべきです。",
    sub: "BillCrafter は、フリーランスと小規模事業者のための無料オンライン請求書作成ツールです。アメリカの小さな独立系ソフトウェアチーム CCC STUDIO が開発・運営しています。",
    reviewed: "監修：CCC STUDIO", updated: "最終更新",
    figcaption: "テンプレートを選び、ブラウザ上で編集して、きれいな PDF をダウンロード。始めるのにアカウントは不要です。",
    why: { h2: "開発した理由", p: "入金までの道のりは、請求ソフトと格闘しなくても十分に大変です。多くの請求ツールは、1枚の書類を送る前にアカウント登録、プラン選択、管理画面の習得を求めてきます。私たちはその逆を目指しました。ページを開き、請求書に直接入力し、きれいな PDF をダウンロードする。登録もカードもインストールも不要です。最初の請求書は無料で、2分もかかりません。" },
    how: { h2: "仕組み", p: "エディタは完全な WYSIWYG です。書類の上で入力したものが、そのままダウンロードされます。請求書・見積書・御見積・領収書を作成でき、8種類のレイアウトにわたる45種類のテンプレートから選べます。ロゴを追加でき、25以上の通貨と地域に応じた税表示に対応しています。無料アカウントでログインすれば、自社情報・取引先・過去の請求書を記憶するので、次回は数秒で作成できます。無料アカウントだけで、無制限の書き出し、ステータス印、定期請求書まですべての機能が使えます。有料プランはありません。" },
    who: { h2: "運営者について", p: "BillCrafter は CCC STUDIO が制作しています。少人数のチームで、お客様のデータを販売することはありません。下書きは、ご自身がアカウントへ保存を選ぶまでブラウザ内に留まります。BillCrafter は書類作成ツールであり、会計や法務のサービスではありません。税務や契約の規定は国や地域によって異なるため、重要な判断は必ず専門家にご確認ください。" },
    contact: { h2: "お問い合わせ", q: "ご質問・ご感想・ご要望はこちらへ:", or: "または", pageLabel: "お問い合わせページ", ready: "さっそく試しますか？", createLabel: "請求書を作成する", tail: "— 登録は不要です。" },
  },

  "zh-Hant": {
    title: "關於我們", desc: "關於 BillCrafter —— 由 CCC STUDIO 為自由接案者與小型企業打造的免費線上發票產生器。我們的目標、工具運作方式與聯絡方式。",
    eyebrow: "關於我們", h1: "開發票，不該在起步時就要花錢。",
    sub: "BillCrafter 是為自由接案者與小型企業打造的免費線上發票產生器，由美國的小型獨立軟體團隊 CCC STUDIO 開發與營運。",
    reviewed: "由 CCC STUDIO 審閱", updated: "最後更新",
    figcaption: "選一款範本，在瀏覽器裡直接編輯，下載乾淨的 PDF —— 開始使用不需要帳號。",
    why: { h2: "我們為什麼做這個工具", p: "光是把款收回來就已經夠麻煩了，不該再跟開票軟體纏鬥。大多數開票工具在你送出第一份文件前，就要求你註冊帳號、挑選方案、學會一整套後台。我們想做的正好相反：打開網頁、直接在發票上輸入、下載乾淨的 PDF —— 不必註冊、不必綁卡、不用安裝。第一張發票免費，兩分鐘內就能完成。" },
    how: { h2: "運作方式", p: "編輯器是完全的所見即所得：你在文件上輸入的樣子，就是下載後的樣子。你可以建立發票、估價單、報價單與收據，從八種版面、共 45 款範本中挑選，加上自己的標誌，並以 25 種以上的幣別開票，稅制顯示會依地區調整。用免費帳號登入後，BillCrafter 會記住你的商家資料、客戶與歷史發票，下一張只要幾秒。註冊免費帳號即可使用全部功能 —— 無限匯出、狀態印章與週期性發票，沒有任何付費方案。" },
    who: { h2: "由誰營運", p: "BillCrafter 由 CCC STUDIO 製作。我們是一個小團隊，不會販售你的資料；草稿會留在你的瀏覽器，直到你選擇存入帳號。BillCrafter 是文件工具，不是會計或法律服務 —— 稅務與合約規定各國各地皆不同，重要事項請向合格專業人士確認。" },
    contact: { h2: "聯絡我們", q: "有問題、意見或功能建議嗎？請來信", or: "或使用", pageLabel: "聯絡頁面", ready: "想直接試試？", createLabel: "建立一張發票", tail: "—— 不需註冊。" },
  },

  es: {
    title: "Nosotros", desc: "Sobre BillCrafter: un generador de facturas online gratuito creado por CCC STUDIO para autónomos y pequeñas empresas. Nuestro objetivo, cómo funciona y cómo contactarnos.",
    eyebrow: "Nosotros", h1: "Empezar a facturar no debería costar nada.",
    sub: "BillCrafter es un generador de facturas online gratuito para autónomos y pequeñas empresas. Lo desarrolla y opera CCC STUDIO, un pequeño equipo independiente de software en Estados Unidos.",
    reviewed: "Revisado por CCC STUDIO", updated: "Actualizado",
    figcaption: "Elige una plantilla, edítala en el navegador y descarga un PDF impecable: no hace falta cuenta para empezar.",
    why: { h2: "Por qué lo creamos", p: "Cobrar ya es bastante difícil sin tener que pelearse con un programa de facturación. La mayoría de estas herramientas te piden crear una cuenta, elegir un plan y aprender a usar un panel antes de poder enviar un solo documento. Nosotros queríamos lo contrario: abrir la página, escribir sobre la factura y descargar un PDF impecable, sin registro, sin tarjeta y sin instalar nada. Tu primera factura es gratis y se hace en menos de dos minutos." },
    how: { h2: "Cómo funciona", p: "El editor es totalmente WYSIWYG: lo que escribes en el documento es exactamente lo que se descarga. Puedes crear facturas, presupuestos, cotizaciones y recibos, elegir entre 45 plantillas repartidas en ocho diseños, añadir tu logotipo y facturar en más de 25 divisas con el formato fiscal adecuado para cada región. Con una cuenta gratuita, BillCrafter recuerda tus datos, tus clientes y tus facturas anteriores, así la siguiente te lleva segundos. Con una cuenta gratuita todo queda desbloqueado —descargas ilimitadas, sellos de estado y facturas recurrentes—, sin planes de pago." },
    who: { h2: "Quién está detrás", p: "BillCrafter está hecho por CCC STUDIO. Somos un equipo pequeño, no vendemos tus datos y los borradores permanecen en tu navegador hasta que decides guardarlos en una cuenta. BillCrafter es una herramienta de documentos, no un servicio contable ni jurídico: las normas fiscales y contractuales cambian según el país y la región, así que consulta cualquier asunto importante con un profesional cualificado." },
    contact: { h2: "Contacto", q: "¿Dudas, comentarios o alguna función que echas en falta? Escribe a", or: "o usa la", pageLabel: "página de contacto", ready: "¿Listo para probarlo?", createLabel: "Crea una factura", tail: "— sin necesidad de registro." },
  },

  pt: {
    title: "Sobre", desc: "Sobre o BillCrafter: um gerador de faturas online gratuito criado pela CCC STUDIO para freelancers e pequenas empresas. Nosso objetivo, como funciona e como falar com a gente.",
    eyebrow: "Sobre", h1: "Começar a faturar não deveria custar nada.",
    sub: "O BillCrafter é um gerador de faturas online gratuito para freelancers e pequenas empresas. É desenvolvido e operado pela CCC STUDIO, uma pequena equipe independente de software nos Estados Unidos.",
    reviewed: "Revisado pela CCC STUDIO", updated: "Atualizado em",
    figcaption: "Escolha um modelo, edite no navegador e baixe um PDF impecável — não precisa de conta para começar.",
    why: { h2: "Por que criamos", p: "Receber já é difícil o bastante sem ter que brigar com um sistema de faturamento. A maioria dessas ferramentas exige criar conta, escolher um plano e aprender um painel antes de você enviar um único documento. Queríamos o contrário: abrir a página, digitar na fatura e baixar um PDF impecável — sem cadastro, sem cartão, sem instalar nada. Sua primeira fatura é grátis e leva menos de dois minutos." },
    how: { h2: "Como funciona", p: "O editor é totalmente WYSIWYG: o que você digita no documento é exatamente o que será baixado. Você pode criar faturas, orçamentos, cotações e recibos, escolher entre 45 modelos distribuídos em oito layouts, adicionar seu logotipo e faturar em mais de 25 moedas com formatação fiscal adequada à região. Com uma conta gratuita, o BillCrafter guarda os dados da sua empresa, seus clientes e as faturas anteriores, então a próxima leva segundos. Com uma conta gratuita, tudo fica liberado — exportações ilimitadas, selos de status e faturas recorrentes, sem planos pagos." },
    who: { h2: "Quem mantém", p: "O BillCrafter é feito pela CCC STUDIO. Somos uma equipe pequena, não vendemos seus dados e os rascunhos ficam no seu navegador até você decidir salvá-los em uma conta. O BillCrafter é uma ferramenta de documentos, não um serviço de contabilidade ou jurídico — as regras fiscais e contratuais variam por país e estado, então confirme qualquer ponto relevante com um profissional qualificado." },
    contact: { h2: "Fale com a gente", q: "Dúvidas, sugestões ou pedido de recurso? Escreva para", or: "ou use a", pageLabel: "página de contato", ready: "Quer experimentar?", createLabel: "Crie uma fatura", tail: "— sem precisar de cadastro." },
  },

  fr: {
    title: "À propos", desc: "À propos de BillCrafter : un générateur de factures en ligne gratuit créé par CCC STUDIO pour les freelances et les petites entreprises. Notre objectif, le fonctionnement et comment nous joindre.",
    eyebrow: "À propos", h1: "Commencer à facturer ne devrait rien coûter.",
    sub: "BillCrafter est un générateur de factures en ligne gratuit pour les freelances et les petites entreprises. Il est développé et exploité par CCC STUDIO, une petite équipe logicielle indépendante basée aux États-Unis.",
    reviewed: "Relu par CCC STUDIO", updated: "Mis à jour le",
    figcaption: "Choisissez un modèle, modifiez-le dans le navigateur et téléchargez un PDF net — aucun compte requis pour commencer.",
    why: { h2: "Pourquoi nous l’avons créé", p: "Se faire payer est déjà assez compliqué sans devoir se battre avec un logiciel de facturation. La plupart de ces outils demandent de créer un compte, de choisir une formule et d’apprendre à utiliser un tableau de bord avant même d’envoyer un seul document. Nous voulions l’inverse : ouvrir la page, écrire sur la facture et télécharger un PDF net — sans inscription, sans carte, sans rien installer. Votre première facture est gratuite et prend moins de deux minutes." },
    how: { h2: "Comment ça marche", p: "L’éditeur est entièrement WYSIWYG : ce que vous saisissez sur le document correspond exactement au fichier téléchargé. Vous pouvez créer des factures, des devis, des offres et des reçus, choisir parmi 45 modèles répartis sur huit mises en page, ajouter votre logo et facturer dans plus de 25 devises avec une mise en forme fiscale adaptée à la région. Avec un compte gratuit, BillCrafter retient vos coordonnées, vos clients et vos factures passées : la suivante ne prend que quelques secondes. Un compte gratuit débloque tout — exports illimités, tampons de statut et factures récurrentes — sans aucune offre payante." },
    who: { h2: "Qui est derrière", p: "BillCrafter est réalisé par CCC STUDIO. Nous sommes une petite équipe, nous ne vendons pas vos données, et vos brouillons restent dans votre navigateur jusqu’à ce que vous choisissiez de les enregistrer sur un compte. BillCrafter est un outil de documents, pas un service comptable ou juridique : les règles fiscales et contractuelles varient d’un pays et d’une région à l’autre, donc vérifiez tout point important avec un professionnel qualifié." },
    contact: { h2: "Nous contacter", q: "Une question, un retour ou une fonctionnalité à suggérer ? Écrivez à", or: "ou passez par la", pageLabel: "page de contact", ready: "Envie d’essayer ?", createLabel: "Créez une facture", tail: "— sans inscription." },
  },

  de: {
    title: "Über uns", desc: "Über BillCrafter — ein kostenloser Online-Rechnungsgenerator von CCC STUDIO für Freiberufler und Kleinunternehmen. Unser Ziel, wie das Tool funktioniert und wie Sie uns erreichen.",
    eyebrow: "Über uns", h1: "Der Einstieg ins Rechnungsstellen sollte nichts kosten.",
    sub: "BillCrafter ist ein kostenloser Online-Rechnungsgenerator für Freiberufler und Kleinunternehmen. Entwickelt und betrieben von CCC STUDIO, einem kleinen unabhängigen Software-Team in den USA.",
    reviewed: "Geprüft von CCC STUDIO", updated: "Aktualisiert am",
    figcaption: "Vorlage wählen, im Browser bearbeiten und ein sauberes PDF herunterladen — für den Start ist kein Konto nötig.",
    why: { h2: "Warum wir es gebaut haben", p: "Bezahlt zu werden ist schon schwierig genug, ohne sich mit einer Rechnungssoftware herumzuschlagen. Die meisten Tools verlangen erst ein Konto, die Wahl eines Tarifs und das Erlernen eines Dashboards, bevor man ein einziges Dokument verschicken kann. Wir wollten das Gegenteil: Seite öffnen, in die Rechnung tippen, ein sauberes PDF herunterladen — ohne Anmeldung, ohne Karte, ohne Installation. Die erste Rechnung ist kostenlos und dauert unter zwei Minuten." },
    how: { h2: "So funktioniert es", p: "Der Editor ist vollständig WYSIWYG: Was Sie im Dokument tippen, ist genau das, was heruntergeladen wird. Sie können Rechnungen, Kostenvoranschläge, Angebote und Quittungen erstellen, aus 45 Vorlagen in acht Layouts wählen, Ihr Logo einfügen und in über 25 Währungen mit regional passender Steuerdarstellung abrechnen. Mit einem kostenlosen Konto merkt sich BillCrafter Ihre Firmendaten, Kunden und früheren Rechnungen — die nächste dauert dann nur Sekunden. Ein kostenloses Konto schaltet alles frei — unbegrenzte Exporte, Status-Stempel und wiederkehrende Rechnungen — ganz ohne Bezahltarife." },
    who: { h2: "Wer dahintersteht", p: "BillCrafter wird von CCC STUDIO gemacht. Wir sind ein kleines Team, wir verkaufen Ihre Daten nicht, und Entwürfe bleiben in Ihrem Browser, bis Sie sie bewusst in einem Konto speichern. BillCrafter ist ein Dokumenten-Tool, kein Steuer- oder Rechtsdienst: Steuer- und Vertragsregeln unterscheiden sich je nach Land und Bundesland — klären Sie Wesentliches mit einer qualifizierten Fachperson." },
    contact: { h2: "Kontakt", q: "Fragen, Feedback oder ein Funktionswunsch? Schreiben Sie an", or: "oder nutzen Sie die", pageLabel: "Kontaktseite", ready: "Gleich ausprobieren?", createLabel: "Rechnung erstellen", tail: "— ohne Anmeldung." },
  },

  it: {
    title: "Chi siamo", desc: "Su BillCrafter: un generatore di fatture online gratuito creato da CCC STUDIO per freelance e piccole imprese. Il nostro obiettivo, come funziona e come contattarci.",
    eyebrow: "Chi siamo", h1: "Iniziare a fatturare non dovrebbe costare nulla.",
    sub: "BillCrafter è un generatore di fatture online gratuito per freelance e piccole imprese. È sviluppato e gestito da CCC STUDIO, un piccolo team di software indipendente negli Stati Uniti.",
    reviewed: "Revisionato da CCC STUDIO", updated: "Aggiornato il",
    figcaption: "Scegli un modello, modificalo nel browser e scarica un PDF pulito: per iniziare non serve un account.",
    why: { h2: "Perché l’abbiamo creato", p: "Farsi pagare è già abbastanza complicato senza dover combattere con un software di fatturazione. Molti strumenti chiedono di creare un account, scegliere un piano e imparare una dashboard prima di poter inviare un solo documento. Noi volevamo l’opposto: apri la pagina, scrivi sulla fattura e scarichi un PDF pulito — senza registrazione, senza carta, senza installare nulla. La prima fattura è gratuita e richiede meno di due minuti." },
    how: { h2: "Come funziona", p: "L’editor è completamente WYSIWYG: quello che scrivi sul documento è esattamente ciò che scarichi. Puoi creare fatture, preventivi, offerte e ricevute, scegliere tra 45 modelli distribuiti su otto layout, aggiungere il tuo logo e fatturare in oltre 25 valute con la formattazione fiscale adatta all’area. Con un account gratuito, BillCrafter ricorda i dati della tua attività, i clienti e le fatture passate, così la successiva richiede pochi secondi. Un account gratuito sblocca tutto — esportazioni illimitate, timbri di stato e fatture ricorrenti — senza piani a pagamento." },
    who: { h2: "Chi lo gestisce", p: "BillCrafter è realizzato da CCC STUDIO. Siamo un piccolo team, non vendiamo i tuoi dati e le bozze restano nel tuo browser finché non scegli di salvarle in un account. BillCrafter è uno strumento per documenti, non un servizio contabile o legale: le regole fiscali e contrattuali variano da Paese a Paese, quindi verifica ogni aspetto rilevante con un professionista qualificato." },
    contact: { h2: "Contattaci", q: "Domande, commenti o una funzione da suggerire? Scrivi a", or: "oppure usa la", pageLabel: "pagina dei contatti", ready: "Vuoi provarlo?", createLabel: "Crea una fattura", tail: "— senza registrazione." },
  },

  ru: {
    title: "О нас", desc: "О BillCrafter — бесплатный онлайн-генератор счётов от CCC STUDIO для фрилансеров и небольших компаний. Наша цель, как работает сервис и как с нами связаться.",
    eyebrow: "О нас", h1: "Начать выставлять счёта не должно стоить ничего.",
    sub: "BillCrafter — это бесплатный онлайн-генератор счётов для фрилансеров и небольших компаний. Его разрабатывает и поддерживает CCC STUDIO, небольшая независимая команда разработчиков из США.",
    reviewed: "Проверено CCC STUDIO", updated: "Обновлено",
    figcaption: "Выберите шаблон, отредактируйте его в браузере и скачайте аккуратный PDF — аккаунт для старта не нужен.",
    why: { h2: "Почему мы это сделали", p: "Получить оплату и без того непросто, чтобы ещё бороться с программой для выставления счётов. Большинство таких сервисов просят создать аккаунт, выбрать тариф и разобраться в панели управления, прежде чем вы отправите хотя бы один документ. Мы хотели обратного: открыть страницу, напечатать прямо в счёте и скачать аккуратный PDF — без регистрации, без карты, без установки. Первый счёт бесплатный и занимает меньше двух минут." },
    how: { h2: "Как это работает", p: "Редактор полностью WYSIWYG: то, что вы печатаете в документе, ровно то и скачивается. Можно создавать счёта, сметы, предложения и квитанции, выбирать из 45 шаблонов в восьми макетах, добавлять логотип и выставлять счёта более чем в 25 валютах с учётом регионального формата налога. С бесплатным аккаунтом BillCrafter запоминает ваши реквизиты, клиентов и прошлые счёта — следующий займёт несколько секунд. Бесплатный аккаунт открывает всё — неограниченные выгрузки, штампы статуса и повторяющиеся счёта — без платных тарифов." },
    who: { h2: "Кто за этим стоит", p: "BillCrafter создаёт CCC STUDIO. Мы небольшая команда, мы не продаём ваши данные, а черновики остаются в браузере, пока вы сами не сохраните их в аккаунт. BillCrafter — инструмент для документов, а не бухгалтерский или юридический сервис: налоговые и договорные правила различаются по странам и регионам, поэтому важные вопросы уточняйте у квалифицированного специалиста." },
    contact: { h2: "Связаться с нами", q: "Вопросы, отзывы или пожелания по функциям? Напишите на", or: "или воспользуйтесь", pageLabel: "страницей контактов", ready: "Готовы попробовать?", createLabel: "Создать счёт", tail: "— регистрация не нужна." },
  },

  bn: {
    title: "আমাদের কথা", desc: "BillCrafter সম্পর্কে — ফ্রিল্যান্সার ও ছোট ব্যবসার জন্য CCC STUDIO-র তৈরি বিনামূল্যের অনলাইন চালান জেনারেটর। আমাদের লক্ষ্য, কীভাবে কাজ করে এবং যোগাযোগের উপায়।",
    eyebrow: "আমাদের কথা", h1: "চালান দেওয়া শুরু করতে কোনো খরচ লাগা উচিত নয়।",
    sub: "BillCrafter ফ্রিল্যান্সার ও ছোট ব্যবসার জন্য একটি বিনামূল্যের অনলাইন চালান জেনারেটর। এটি তৈরি ও পরিচালনা করে যুক্তরাষ্ট্রের ছোট স্বাধীন সফটওয়্যার দল CCC STUDIO।",
    reviewed: "পর্যালোচনায় CCC STUDIO", updated: "সর্বশেষ হালনাগাদ",
    figcaption: "একটি টেমপ্লেট বেছে নিন, ব্রাউজারেই সম্পাদনা করুন এবং পরিচ্ছন্ন PDF নামিয়ে নিন — শুরু করতে অ্যাকাউন্ট লাগে না।",
    why: { h2: "কেন আমরা এটি বানিয়েছি", p: "টাকা আদায় করাই যথেষ্ট কঠিন, তার উপরে চালানের সফটওয়্যারের সঙ্গে যুদ্ধ করার দরকার নেই। বেশিরভাগ চালান টুল একটি নথি পাঠানোর আগেই অ্যাকাউন্ট খুলতে, প্ল্যান বাছতে ও ড্যাশবোর্ড শিখতে বলে। আমরা চেয়েছি ঠিক উল্টোটা: পাতা খুলুন, চালানের উপরেই লিখুন, আর পরিচ্ছন্ন একটি PDF নামিয়ে নিন — নিবন্ধন নয়, কার্ড নয়, ইনস্টলও নয়। আপনার প্রথম চালান বিনামূল্যে এবং দুই মিনিটেরও কম সময় লাগে।" },
    how: { h2: "কীভাবে কাজ করে", p: "এডিটরটি পুরোপুরি WYSIWYG — নথিতে যা লিখছেন, ডাউনলোডেও ঠিক তাই আসে। আপনি চালান, প্রাক্কলন, দরপত্র ও রসিদ বানাতে পারেন, আটটি বিন্যাসে ছড়ানো ৪৫টি টেমপ্লেট থেকে বাছতে পারেন, নিজের লোগো যোগ করতে পারেন এবং অঞ্চল অনুযায়ী কর বিন্যাসে ২৫টিরও বেশি মুদ্রায় চালান দিতে পারেন। বিনামূল্যের অ্যাকাউন্টে সাইন ইন করলে BillCrafter আপনার ব্যবসার তথ্য, ক্লায়েন্ট ও আগের চালান মনে রাখে, ফলে পরেরটি কয়েক সেকেন্ডেই হয়। বিনামূল্যের অ্যাকাউন্টেই সব খুলে যায় — সীমাহীন রপ্তানি, স্টেটাস সিল ও পুনরাবৃত্ত চালান — কোনো পেইড প্ল্যান নেই।" },
    who: { h2: "কারা চালায়", p: "BillCrafter তৈরি করে CCC STUDIO। আমরা ছোট একটি দল, আপনার তথ্য বিক্রি করি না, এবং আপনি নিজে অ্যাকাউন্টে সংরক্ষণ করতে না চাইলে খসড়া আপনার ব্রাউজারেই থাকে। BillCrafter একটি নথি তৈরির সরঞ্জাম, হিসাবরক্ষণ বা আইনি সেবা নয় — কর ও চুক্তির নিয়ম দেশ ও অঞ্চলভেদে আলাদা, তাই গুরুত্বপূর্ণ বিষয় যোগ্য পেশাদারের সঙ্গে যাচাই করুন।" },
    contact: { h2: "যোগাযোগ", q: "প্রশ্ন, মত বা কোনো সুবিধার অনুরোধ? লিখুন", or: "অথবা ব্যবহার করুন", pageLabel: "যোগাযোগ পাতা", ready: "এখনই দেখতে চান?", createLabel: "একটি চালান তৈরি করুন", tail: "— নিবন্ধন লাগবে না।" },
  },

  ko: {
    title: "소개", desc: "BillCrafter 소개 — 프리랜서와 소규모 사업자를 위해 CCC STUDIO가 만든 무료 온라인 청구서 생성기. 우리의 목표, 작동 방식, 문의 방법을 안내합니다.",
    eyebrow: "소개", h1: "청구서를 시작하는 데 비용이 들어야 할 이유는 없습니다.",
    sub: "BillCrafter는 프리랜서와 소규모 사업자를 위한 무료 온라인 청구서 생성기입니다. 미국의 작은 독립 소프트웨어 팀 CCC STUDIO가 개발하고 운영합니다.",
    reviewed: "검토: CCC STUDIO", updated: "최종 업데이트",
    figcaption: "서식을 고르고 브라우저에서 편집한 뒤 깔끔한 PDF로 내려받으세요. 시작할 때 계정은 필요 없습니다.",
    why: { h2: "만든 이유", p: "대금을 받는 일만으로도 충분히 번거로운데, 청구 소프트웨어와 씨름할 필요는 없습니다. 대부분의 청구 도구는 문서 한 장을 보내기 전에 계정을 만들고, 요금제를 고르고, 관리 화면을 익히라고 요구합니다. 우리는 그 반대를 원했습니다. 페이지를 열고, 청구서에 바로 입력하고, 깔끔한 PDF를 내려받는 것. 가입도, 카드도, 설치도 없습니다. 첫 청구서는 무료이며 2분도 걸리지 않습니다." },
    how: { h2: "작동 방식", p: "편집기는 완전한 WYSIWYG입니다. 문서에 입력한 그대로 내려받습니다. 청구서, 견적서, 견적 제안, 영수증을 만들 수 있고, 여덟 가지 레이아웃에 걸친 45가지 서식에서 고를 수 있으며, 로고를 넣고 지역에 맞는 세금 표기로 25개 이상의 통화로 청구할 수 있습니다. 무료 계정으로 로그인하면 BillCrafter가 사업자 정보와 거래처, 지난 청구서를 기억하므로 다음 청구서는 몇 초면 됩니다. 무료 계정만으로 무제한 내보내기, 상태 도장, 반복 청구서까지 모든 기능을 쓸 수 있으며 유료 요금제는 없습니다." },
    who: { h2: "운영 주체", p: "BillCrafter는 CCC STUDIO가 만듭니다. 우리는 작은 팀이며, 여러분의 데이터를 판매하지 않습니다. 작성 중인 문서는 계정에 저장하기로 선택할 때까지 브라우저에 남습니다. BillCrafter는 문서 도구이며 회계나 법률 서비스가 아닙니다. 세금과 계약 규정은 국가와 지역마다 다르므로, 중요한 사안은 자격을 갖춘 전문가에게 확인하세요." },
    contact: { h2: "문의하기", q: "질문, 의견, 기능 요청이 있으신가요? 이메일:", or: "또는", pageLabel: "문의 페이지", ready: "바로 사용해 보시겠어요?", createLabel: "청구서 만들기", tail: "— 가입은 필요 없습니다." },
  },

  sv: {
    title: "Om oss", desc: "Om BillCrafter — ett gratis fakturaprogram online byggt av CCC STUDIO för frilansare och småföretag. Vårt mål, hur verktyget fungerar och hur du når oss.",
    eyebrow: "Om oss", h1: "Att börja fakturera borde inte kosta något.",
    sub: "BillCrafter är ett gratis fakturaprogram online för frilansare och småföretag. Det byggs och drivs av CCC STUDIO, ett litet oberoende mjukvaruteam i USA.",
    reviewed: "Granskad av CCC STUDIO", updated: "Uppdaterad",
    figcaption: "Välj en mall, redigera den i webbläsaren och ladda ner en snygg PDF — inget konto behövs för att börja.",
    why: { h2: "Varför vi byggde det", p: "Att få betalt är svårt nog utan att behöva slåss med ett faktureringsprogram. De flesta verktyg kräver att du skapar ett konto, väljer en plan och lär dig en instrumentpanel innan du kan skicka ett enda dokument. Vi ville det motsatta: öppna sidan, skriv i fakturan och ladda ner en snygg PDF — ingen registrering, inget kort, inget att installera. Din första faktura är gratis och tar under två minuter." },
    how: { h2: "Så fungerar det", p: "Redigeraren är helt WYSIWYG: det du skriver i dokumentet är exakt det som laddas ner. Du kan skapa fakturor, kostnadsförslag, offerter och kvitton, välja bland 45 mallar i åtta layouter, lägga till din logotyp och fakturera i över 25 valutor med momsformat anpassat efter region. Med ett gratiskonto minns BillCrafter dina företagsuppgifter, kunder och tidigare fakturor, så nästa faktura tar sekunder. Ett gratiskonto låser upp allt — obegränsade nedladdningar, statusstämplar och återkommande fakturor — utan betalplaner." },
    who: { h2: "Vilka driver det", p: "BillCrafter görs av CCC STUDIO. Vi är ett litet team, vi säljer inte dina uppgifter, och utkast stannar i din webbläsare tills du väljer att spara dem på ett konto. BillCrafter är ett dokumentverktyg, inte en redovisnings- eller juridisk tjänst — skatte- och avtalsregler skiljer sig mellan länder och regioner, så kontrollera allt väsentligt med en kvalificerad rådgivare." },
    contact: { h2: "Kontakta oss", q: "Frågor, synpunkter eller önskemål om en funktion? Mejla", or: "eller använd vår", pageLabel: "kontaktsida", ready: "Vill du testa?", createLabel: "Skapa en faktura", tail: "— ingen registrering behövs." },
  },

  vi: {
    title: "Giới thiệu", desc: "Giới thiệu về BillCrafter — công cụ tạo hóa đơn trực tuyến miễn phí do CCC STUDIO xây dựng dành cho freelancer và doanh nghiệp nhỏ. Mục tiêu của chúng tôi, cách công cụ hoạt động và cách liên hệ.",
    eyebrow: "Giới thiệu", h1: "Xuất hóa đơn không nên tốn phí ngay từ đầu.",
    sub: "BillCrafter là công cụ tạo hóa đơn trực tuyến miễn phí dành cho freelancer và doanh nghiệp nhỏ. Được xây dựng và vận hành bởi CCC STUDIO, một đội ngũ phần mềm độc lập quy mô nhỏ tại Hoa Kỳ.",
    reviewed: "Được rà soát bởi CCC STUDIO", updated: "Cập nhật lần cuối",
    figcaption: "Chọn một mẫu, chỉnh sửa ngay trên trình duyệt, và tải xuống file PDF sạch đẹp — không cần tài khoản để bắt đầu.",
    why: { h2: "Vì sao chúng tôi xây dựng công cụ này", p: "Việc nhận thanh toán vốn đã đủ khó, không cần phải vật lộn thêm với phần mềm xuất hóa đơn. Hầu hết các công cụ lập hóa đơn yêu cầu bạn tạo tài khoản, chọn gói dịch vụ và học cách dùng bảng điều khiển trước khi có thể gửi một tài liệu duy nhất. Chúng tôi muốn điều ngược lại: mở trang web, nhập ngay trên hóa đơn, và tải xuống file PDF sạch đẹp — không cần đăng ký, không cần thẻ, không cần cài đặt gì. Hóa đơn đầu tiên của bạn hoàn toàn miễn phí và chỉ mất chưa đầy hai phút." },
    how: { h2: "Cách hoạt động", p: "Trình chỉnh sửa hoạt động theo kiểu WYSIWYG hoàn toàn: những gì bạn nhập trên tài liệu chính là những gì được tải xuống. Bạn có thể tạo hóa đơn, dự toán, báo giá và biên nhận, chọn từ 45 mẫu với tám kiểu bố cục, thêm logo của mình, và lập hóa đơn bằng hơn 25 loại tiền tệ với định dạng thuế theo từng khu vực. Với tài khoản miễn phí, BillCrafter ghi nhớ thông tin doanh nghiệp, khách hàng và các hóa đơn trước đó của bạn, nên lần sau chỉ mất vài giây. Tài khoản miễn phí mở khóa mọi tính năng — tải xuống không giới hạn, con dấu trạng thái và hóa đơn định kỳ — không có gói trả phí." },
    who: { h2: "Ai vận hành công cụ này", p: "BillCrafter được xây dựng bởi CCC STUDIO. Chúng tôi là một đội ngũ nhỏ, không bán dữ liệu của bạn, và bản nháp sẽ chỉ lưu trên trình duyệt cho đến khi bạn chọn lưu vào tài khoản. BillCrafter là công cụ soạn tài liệu, không phải dịch vụ kế toán hay pháp lý — quy định về thuế và hợp đồng khác nhau tùy quốc gia và khu vực, vì vậy hãy xác nhận mọi vấn đề quan trọng với chuyên gia phù hợp." },
    contact: { h2: "Liên hệ với chúng tôi", q: "Có câu hỏi, góp ý hoặc muốn đề xuất tính năng? Hãy email tới", or: "hoặc dùng", pageLabel: "trang liên hệ", ready: "Sẵn sàng dùng thử?", createLabel: "Tạo một hóa đơn", tail: "— không cần đăng ký." },
  },

  nl: {
    title: "Over ons", desc: "Over BillCrafter — een gratis online factuurgenerator van CCC STUDIO voor freelancers en kleine bedrijven. Ons doel, hoe het werkt en hoe je ons bereikt.",
    eyebrow: "Over ons", h1: "Beginnen met factureren hoort niets te kosten.",
    sub: "BillCrafter is een gratis online factuurgenerator voor freelancers en kleine bedrijven. Het wordt gebouwd en beheerd door CCC STUDIO, een klein onafhankelijk softwareteam in de Verenigde Staten.",
    reviewed: "Beoordeeld door CCC STUDIO", updated: "Bijgewerkt op",
    figcaption: "Kies een template, pas het aan in de browser en download een strakke pdf — je hebt geen account nodig om te beginnen.",
    why: { h2: "Waarom we het gemaakt hebben", p: "Betaald worden is al lastig genoeg zonder te vechten met factuursoftware. De meeste factuurtools vragen je eerst een account aan te maken, een pakket te kiezen en een dashboard te leren voordat je één document kunt versturen. Wij wilden het omgekeerde: pagina openen, op de factuur typen en een strakke pdf downloaden — geen registratie, geen kaart, niets te installeren. Je eerste factuur is gratis en kost minder dan twee minuten." },
    how: { h2: "Hoe het werkt", p: "De editor is volledig WYSIWYG: wat je op het document typt, is exact wat je downloadt. Je kunt facturen, kostenramingen, offertes en kwitanties maken, kiezen uit 45 templates verdeeld over acht lay-outs, je logo toevoegen en factureren in meer dan 25 valuta’s met btw-opmaak die past bij de regio. Met een gratis account onthoudt BillCrafter je bedrijfsgegevens, klanten en eerdere facturen, zodat de volgende seconden kost. Een gratis account ontgrendelt alles — onbeperkt exporteren, statusstempels en terugkerende facturen — zonder betaalde plannen." },
    who: { h2: "Wie het runt", p: "BillCrafter wordt gemaakt door CCC STUDIO. We zijn een klein team, we verkopen je gegevens niet, en concepten blijven in je browser tot je ze zelf in een account opslaat. BillCrafter is een documenttool, geen boekhoudkundige of juridische dienst: fiscale en contractuele regels verschillen per land en regio, dus leg belangrijke zaken voor aan een gekwalificeerde professional." },
    contact: { h2: "Neem contact op", q: "Vragen, feedback of een wens voor een functie? Mail naar", or: "of gebruik de", pageLabel: "contactpagina", ready: "Klaar om het te proberen?", createLabel: "Maak een factuur", tail: "— zonder aanmelden." },
  },

  id: {
    title: "Tentang", desc: "Tentang BillCrafter — pembuat faktur online gratis dari CCC STUDIO untuk pekerja lepas dan usaha kecil. Tujuan kami, cara kerjanya, dan cara menghubungi kami.",
    eyebrow: "Tentang", h1: "Mulai membuat faktur seharusnya tidak perlu biaya.",
    sub: "BillCrafter adalah pembuat faktur online gratis untuk pekerja lepas dan usaha kecil. Dikembangkan dan dijalankan oleh CCC STUDIO, tim perangkat lunak independen kecil di Amerika Serikat.",
    reviewed: "Ditinjau oleh CCC STUDIO", updated: "Diperbarui",
    figcaption: "Pilih templat, sunting di peramban, lalu unduh PDF yang rapi — tidak perlu akun untuk memulai.",
    why: { h2: "Mengapa kami membuatnya", p: "Menagih pembayaran sudah cukup sulit tanpa harus bergulat dengan perangkat lunak faktur. Sebagian besar alat faktur meminta Anda membuat akun, memilih paket, dan mempelajari dasbor sebelum bisa mengirim satu dokumen pun. Kami ingin sebaliknya: buka halaman, ketik di faktur, lalu unduh PDF yang rapi — tanpa pendaftaran, tanpa kartu, tanpa memasang apa pun. Faktur pertama Anda gratis dan selesai dalam waktu kurang dari dua menit." },
    how: { h2: "Cara kerjanya", p: "Editornya sepenuhnya WYSIWYG: apa yang Anda ketik di dokumen sama persis dengan yang diunduh. Anda dapat membuat faktur, estimasi, penawaran, dan kwitansi, memilih dari 45 templat dalam delapan tata letak, menambahkan logo, serta menagih dalam lebih dari 25 mata uang dengan format pajak sesuai wilayah. Dengan akun gratis, BillCrafter mengingat data usaha, klien, dan faktur lama Anda sehingga faktur berikutnya hanya perlu beberapa detik. Akun gratis membuka semua fitur — ekspor tanpa batas, cap status, dan faktur berulang — tanpa paket berbayar." },
    who: { h2: "Siapa yang menjalankannya", p: "BillCrafter dibuat oleh CCC STUDIO. Kami tim kecil, kami tidak menjual data Anda, dan draf tetap berada di peramban sampai Anda memilih menyimpannya ke akun. BillCrafter adalah alat pembuat dokumen, bukan layanan akuntansi atau hukum — aturan pajak dan kontrak berbeda di setiap negara dan wilayah, jadi pastikan hal-hal penting dengan profesional yang berkompeten." },
    contact: { h2: "Hubungi kami", q: "Ada pertanyaan, masukan, atau permintaan fitur? Kirim email ke", or: "atau gunakan", pageLabel: "halaman kontak", ready: "Siap mencoba?", createLabel: "Buat faktur", tail: "— tanpa perlu mendaftar." },
  },
};

// About copy is keyed by LANGUAGE, so every market sharing a language renders
// byte-identical text: /en-AU/about == /about, /es-MX/about == /es/about,
// /zh-Hant-TW/about == /zh-Hant/about. Google spotted this and reported
// /en-AU/about as "Duplicate, Google chose different canonical".
//
// So exactly one URL per language: the first locale listed for that language.
// Every other market 301s to it and is declared there with its own hreflang,
// which is the supported way to cover several markets with one page.
export function aboutUrlFor(code, LOCALES) {
  const lang = getLocale(code).lang;
  const primary = LOCALES.find((l) => l.lang === lang)?.code || DEFAULT_LOCALE;
  return primary === DEFAULT_LOCALE ? "/about" : `/${primary}/about`;
}

// True when this locale is the one that owns the URL for its language.
export function aboutHasOwnUrl(code, LOCALES) {
  return aboutUrlFor(code, LOCALES) === `/${code}/about`;
}

// hreflang set: each market points at whichever URL serves its language.
export function aboutAlternates(LOCALES) {
  const languages = {};
  for (const l of LOCALES) languages[l.hreflang] = aboutUrlFor(l.code, LOCALES);
  return { languages: { ...languages, "x-default": "/about" } };
}

export function about(locale = DEFAULT_LOCALE) {
  const lang = getLocale(locale).lang;
  const d = A[locale] || A[lang] || A.en;
  return { ...A.en, ...d };
}

export default A;
