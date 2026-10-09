// Marketing-copy translations for the localized home pages.
//
// Kept separate from lib/i18n.js on purpose: that file holds short UI labels and
// the document vocabulary printed on the PDF, while this one holds long-form
// marketing prose. Keyed by *language* (not locale) — regional variants like
// en-GB or zh-Hant-TW share their language's copy, exactly like DOC/STAMPS/T.
//
// Screenshot alt text stays in English: the step images show the English UI, so
// describing them in another language would misdescribe the picture.
//
// Every factual claim here must match lib/server/quota.js and the real limits:
// Fully free: 1 export per IP per day without an account (no status stamps),
// unlimited exports and every feature with a free account. No paid plans.

import { getLocale, DEFAULT_LOCALE } from "./i18n";

const M = {
  en: {
    feat: {
      eyebrow: "Why BillCrafter",
      h2: "Make one now. Sign in to keep it.",
      lead: "Try it before you decide anything — then let an account do the remembering.",
      cards: [
        ["1 · Make your first invoice free", "Start typing on the document right now — no account, no card, nothing to install. Fill in your details and download a polished PDF in under two minutes. Without an account you get one free export a day."],
        ["2 · Sign in and it’s saved", "A free account keeps your business details, clients and every past invoice in the cloud — so the next one takes seconds, from any device. With an account, exports are free and unlimited."],
        ["3 · The fields your trade actually bills on", "Split labor from materials, bill by the hour with dated entries, ask for a deposit up front, or put photos of the finished job on the invoice itself. 45 templates across eight layouts open with the right ones already in place."],
      ],
      browse: "Browse the library",
    },
    step: {
      eyebrow: "How it works",
      h2: "Three steps to a paid invoice.",
      items: [
        ["Type on the invoice", "Fill in your business, client, and line items right on the document. Totals and tax calculate live as you type."],
        ["Customize & preview", "Upload your logo, pick one of eight layouts and a color — the invoice you see is exactly what downloads."],
        ["Download or send", "Download a clean PDF, or sign in and email it straight to your client."],
      ],
    },
    tpl: {
      eyebrow: "Templates",
      h2: "An invoice built for your line of work.",
      lead: "Open the contractor template and labor is already split from materials; the consulting one bills dated hours against a rate; the cleaning one states the period and how often you attend.",
    },
    faq: {
      eyebrow: "FAQ",
      h2: "Questions, answered.",
      items: [
        ["Is BillCrafter free?", "Yes, completely. There are no paid plans. Without an account you can export 1 PDF a day; with a free account, exports and every feature — status stamps, share links, recurring invoices, e-signature and email — are unlimited."],
        ["Do I need to create an account to use it?", "No. The editor works the moment the page loads — no account, no card, nothing to install. You can fill in a complete invoice and download one PDF a day without signing up. A free account removes the limit and adds saved history and your client list; it’s there when you want it, not before you start."],
        ["Will my invoice have a watermark or BillCrafter branding?", "No. Nothing is added to your document on any plan — no watermark, no logo, no “created with” line. The PDF contains only what you put on it. The optional PAID / UNPAID stamps are something you switch on yourself with a free account, not branding."],
        ["What format do invoices download in?", "PDF — one format, done properly. Every invoice exports as a pixel-accurate PDF and prints in one click, on any device, with nothing to install. A PDF keeps your layout identical on your client’s screen and printer — but a standard PDF is not tamper-proof, so keep your own copy as the record. Pick a colored accent and one of 8 layouts to make it yours."],
        ["Can my client pay the invoice online through BillCrafter?", "No — BillCrafter creates the document, it doesn’t process payments. You add your own payment details instead: a bank transfer, a PayPal or Stripe link, or a crypto wallet address with a scannable QR code. Payment goes straight to you, and we never handle your money or charge a transaction fee."],
        ["Can I email the invoice to my client?", "Yes, with a free account. The invoice is sent as a PDF attachment and replies come back to your own email address. Sending is free and unlimited."],
        ["Can I invoice international clients in another currency?", "Yes. There are more than 25 currencies — including USD, EUR, GBP, INR, JPY, BRL and SEK — plus USDT, USDC and GRAM (Ton) if you’re paid in crypto. Number formatting and the tax wording follow the market you pick, so a Swedish invoice reads “Moms” and a Japanese one shows whole yen with no decimals."],
        ["Can I add VAT, GST or sales tax?", "Yes. Set a tax rate and mark each line taxable or not — useful when labor and materials are treated differently. The tax label follows the region you choose (VAT, GST, Moms, IVA and so on). Rates and rules differ by country and state, so confirm your own situation with an accountant or your tax authority."],
        ["Can I use BillCrafter on my phone?", "Yes. It runs in a mobile browser, so you can fill in the invoice, download the PDF and email it from a phone or tablet. There’s nothing to install and no app store involved."],
        ["Do I need a registered business to send an invoice?", "No. Freelancers and self-employed individuals can invoice under their own name and address. Include an EIN if you have one — never put your SSN on an invoice."],
        ["What’s the difference between an invoice and a receipt?", "An invoice is a request for payment sent before payment. A receipt confirms payment after it’s been made. BillCrafter supports invoices, estimates, quotes, and receipts."],
        ["How long should payment terms be?", "Net 14 or Net 15 is a sensible default for most freelancers and small businesses. Reserve Net 30 for established clients or larger B2B contracts."],
        ["Is my data private?", "Your draft stays in your browser until you choose to save it to an account. Saved data is encrypted, and you can export or delete it anytime."],
      ],
      still: "Still have a question? Email",
    },
    tr: {
      eyebrow: "Trusted by small businesses",
      h2: "Professional invoices, taken seriously.",
      items: [["Free", "no signup to download"], ["PDF", "pixel-accurate export"], ["45", "invoice templates"], ["Private", "encrypted, never sold"]],
    },
  },

  es: {
    feat: {
      eyebrow: "Por qué BillCrafter",
      h2: "Crea una ahora. Regístrate para conservarla.",
      lead: "Pruébalo antes de decidir nada — y deja que la cuenta se encargue de recordar.",
      cards: [
        ["1 · Tu primera factura, gratis", "Empieza a escribir en el documento ahora mismo: sin cuenta, sin tarjeta, sin instalar nada. Rellena tus datos y descarga un PDF impecable en menos de dos minutos. Sin cuenta tienes 1 descarga gratis al día."],
        ["2 · Regístrate y queda guardada", "Una cuenta gratuita guarda en la nube tus datos fiscales, tus clientes y todas tus facturas anteriores, así la siguiente te lleva segundos desde cualquier dispositivo. Con cuenta, las descargas son ilimitadas y gratis."],
        ["3 · Los campos que de verdad usa tu oficio", "Separa la mano de obra de los materiales, factura por horas con entradas fechadas, pide un anticipo o pon fotos del trabajo terminado en la propia factura. Las 45 plantillas, repartidas en ocho diseños, ya vienen con lo que necesitas."],
      ],
      browse: "Ver la biblioteca",
    },
    step: {
      eyebrow: "Cómo funciona",
      h2: "Tres pasos hasta cobrar.",
      items: [
        ["Escribe sobre la factura", "Introduce tu empresa, tu cliente y las líneas de detalle directamente en el documento. Los totales y los impuestos se calculan en vivo mientras escribes."],
        ["Personaliza y previsualiza", "Sube tu logotipo y elige uno de los ocho diseños y un color: la factura que ves es exactamente la que se descarga."],
        ["Descarga o envía", "Descarga un PDF impecable, o inicia sesión y envíalo por correo a tu cliente."],
      ],
    },
    tpl: {
      eyebrow: "Plantillas",
      h2: "Una factura hecha para tu actividad.",
      lead: "Abre la plantilla de contratista y la mano de obra ya está separada de los materiales; la de consultoría factura horas con fecha según tu tarifa; la de limpieza indica el periodo y con qué frecuencia acudes.",
    },
    faq: {
      eyebrow: "Preguntas frecuentes",
      h2: "Respuestas claras.",
      items: [
        ["¿BillCrafter es gratis?", "Sí, totalmente. No hay planes de pago. Sin cuenta puedes descargar 1 PDF al día; con una cuenta gratuita, las descargas y todas las funciones —sellos de estado, enlaces para compartir, facturas recurrentes, firma electrónica y envío por correo— son ilimitadas."],
        ["¿Necesito crear una cuenta para usarlo?", "No. El editor funciona en cuanto carga la página: sin cuenta, sin tarjeta y sin instalar nada. Puedes rellenar una factura completa y descargar 1 PDF al día sin registrarte. Una cuenta gratuita elimina el límite y añade el historial guardado y tu lista de clientes; está ahí cuando la quieras, no antes de empezar."],
        ["¿La factura llevará marca de agua o el logo de BillCrafter?", "No. No añadimos nada a tu documento en ningún plan: ni marca de agua, ni logotipo, ni una línea de «creado con». El PDF contiene solo lo que tú pongas. Los sellos opcionales de PAGADO / NO PAGADO los activas tú con una cuenta gratuita; no son una marca nuestra."],
        ["¿En qué formato se descargan las facturas?", "En PDF, y bien hecho. Cada factura se exporta como un PDF de precisión milimétrica que se imprime con un clic, en cualquier dispositivo y sin instalar nada. El PDF conserva el diseño idéntico en la pantalla y la impresora de tu cliente, pero un PDF estándar no es a prueba de manipulaciones: guarda tu propia copia como registro. Elige un color de acento y uno de los 8 diseños para personalizarla."],
        ["¿Mi cliente puede pagar la factura online desde BillCrafter?", "No: BillCrafter crea el documento, no procesa pagos. Pones tus propios datos de cobro — una transferencia, un enlace de PayPal, Stripe o Bizum, o una dirección de monedero con código QR. El dinero va directo a ti, y nosotros nunca tocamos tus cobros ni cobramos comisión por transacción."],
        ["¿Puedo enviar la factura por correo a mi cliente?", "Sí, con una cuenta gratuita. Se envía como PDF adjunto y las respuestas llegan a tu propia dirección de correo. Los envíos son gratuitos y sin límite."],
        ["¿Puedo facturar a clientes de otros países en otra moneda?", "Sí. Hay más de 25 divisas — euro, dólar, libra, peso mexicano, sol peruano, real y más — además de USDT y USDC si cobras en stablecoins. El formato de los números y la palabra del impuesto siguen al mercado que elijas, así que una factura española dice «IVA» y una mexicana también, pero con el tipo y el formato locales."],
        ["¿Puedo añadir IVA?", "Sí. Indica el tipo y marca cada línea como sujeta o no sujeta, algo útil cuando conviven conceptos con distinto tratamiento. En España el tipo general es el 21 %, con reducidos del 10 % y del 4 %; si facturas desde México el IVA es del 16 % y desde Perú el IGV del 18 %. Ten en cuenta que un autónomo que factura a una empresa o a otro profesional normalmente debe aplicar además la retención de IRPF. Las reglas cambian según tu actividad y tu situación: confírmalo con tu gestoría o con la Agencia Tributaria."],
        ["¿Puedo usar BillCrafter en el móvil?", "Sí. Funciona en el navegador del móvil, así que puedes rellenar la factura, descargar el PDF y enviarla por correo desde el teléfono o la tablet. No hay nada que instalar ni que buscar en ninguna tienda de aplicaciones."],
        ["¿Necesito una empresa registrada para facturar?", "No. Los autónomos y trabajadores por cuenta propia pueden facturar con su propio nombre y dirección. Incluye tu NIF si lo tienes, y nunca pongas datos personales sensibles en una factura."],
        ["¿Cuál es la diferencia entre una factura y un recibo?", "La factura es una solicitud de pago que se envía antes de cobrar. El recibo confirma el pago una vez realizado. BillCrafter admite facturas, presupuestos, cotizaciones y recibos."],
        ["¿Qué plazo de pago conviene poner?", "14 o 15 días es un valor razonable para la mayoría de autónomos y pequeñas empresas. Reserva los 30 días para clientes consolidados o contratos B2B grandes."],
        ["¿Mis datos son privados?", "Tu borrador permanece en tu navegador hasta que decides guardarlo en una cuenta. Los datos guardados están cifrados y puedes exportarlos o eliminarlos cuando quieras."],
      ],
      still: "¿Te queda alguna duda? Escribe a",
    },
    tr: {
      eyebrow: "La eligen pequeñas empresas",
      h2: "Facturas profesionales, en serio.",
      items: [["Gratis", "sin registro para descargar"], ["PDF", "exportación exacta"], ["45", "plantillas de factura"], ["Privado", "cifrado y nunca vendido"]],
    },
  },

  pt: {
    feat: {
      eyebrow: "Por que o BillCrafter",
      h2: "Crie uma agora. Entre para guardá-la.",
      lead: "Experimente antes de decidir qualquer coisa — depois deixe a conta lembrar por você.",
      cards: [
        ["1 · Sua primeira fatura é grátis", "Comece a digitar no documento agora mesmo: sem conta, sem cartão, sem instalar nada. Preencha seus dados e baixe um PDF impecável em menos de dois minutos. Sem conta, você tem 1 exportação grátis por dia."],
        ["2 · Entre e fica salvo", "Uma conta gratuita guarda na nuvem os dados da sua empresa, seus clientes e todas as faturas anteriores — assim a próxima leva segundos, em qualquer dispositivo. Com conta, as exportações são ilimitadas e gratuitas."],
        ["3 · Os campos que o seu ofício realmente usa", "Separe mão de obra de materiais, cobre por hora com lançamentos datados, peça um sinal ou coloque fotos do serviço concluído na própria fatura. Os 45 modelos, em oito layouts, já abrem com o que você precisa."],
      ],
      browse: "Ver a biblioteca",
    },
    step: {
      eyebrow: "Como funciona",
      h2: "Três passos até receber.",
      items: [
        ["Digite na fatura", "Preencha sua empresa, o cliente e os itens direto no documento. Totais e impostos são calculados ao vivo enquanto você digita."],
        ["Personalize e visualize", "Envie seu logotipo e escolha um dos oito layouts e uma cor — a fatura que você vê é exatamente a que será baixada."],
        ["Baixe ou envie", "Baixe um PDF impecável, ou entre e envie por e-mail direto ao cliente."],
      ],
    },
    tpl: {
      eyebrow: "Modelos",
      h2: "Uma fatura feita para o seu ramo.",
      lead: "Abra o modelo de empreiteiro e a mão de obra já vem separada dos materiais; o de consultoria cobra horas datadas conforme sua taxa; o de limpeza informa o período e a frequência das visitas.",
    },
    faq: {
      eyebrow: "Perguntas frequentes",
      h2: "Respostas diretas.",
      items: [
        ["O BillCrafter é grátis?", "Sim, totalmente. Não há planos pagos. Sem conta você pode baixar 1 PDF por dia; com uma conta gratuita, as exportações e todos os recursos — selos de status, links de compartilhamento, faturas recorrentes, assinatura eletrônica e envio por e-mail — são ilimitados."],
        ["Preciso criar uma conta para usar?", "Não. O editor funciona assim que a página carrega: sem conta, sem cartão e sem instalar nada. Você pode preencher uma fatura completa e baixar 1 PDF por dia sem se cadastrar. Uma conta gratuita remove o limite e acrescenta o histórico salvo e sua lista de clientes; ela está lá quando você quiser, não antes de começar."],
        ["Minha fatura terá marca d’água ou a marca do BillCrafter?", "Não. Nada é acrescentado ao seu documento em nenhum plano — sem marca d’água, sem logotipo, sem linha de «criado com». O PDF contém apenas o que você colocar nele. Os carimbos opcionais PAGO / NÃO PAGO são ativados por você com uma conta gratuita, não são uma marca nossa."],
        ["Em que formato as faturas são baixadas?", "Em PDF, e bem feito. Cada fatura é exportada como um PDF fiel ao pixel que imprime com um clique, em qualquer dispositivo e sem instalar nada. O PDF mantém o layout idêntico na tela e na impressora do cliente — mas um PDF comum não é à prova de alterações, por isso guarde sua própria cópia como registro. Escolha uma cor de destaque e um dos 8 layouts para personalizar."],
        ["Meu cliente pode pagar a fatura online pelo BillCrafter?", "Não — o BillCrafter cria o documento, não processa pagamentos. Você inclui os seus próprios dados de recebimento: uma chave Pix, uma transferência bancária, um link do PayPal ou Stripe, ou um endereço de carteira com QR code. O dinheiro vai direto para você, e nunca ficamos com nada nem cobramos taxa por transação."],
        ["Posso enviar a fatura por e-mail para o cliente?", "Sim, com uma conta gratuita. Ela é enviada como PDF anexo e as respostas voltam para o seu próprio e-mail. Os envios são gratuitos e sem limite."],
        ["Posso faturar clientes internacionais em outra moeda?", "Sim. São mais de 25 moedas — real, dólar, euro, libra e outras — além de USDT e USDC se você recebe em stablecoins. A formatação dos números e a palavra usada para o imposto seguem o mercado escolhido, então uma fatura brasileira e uma portuguesa não saem iguais."],
        ["Posso incluir impostos?", "Sim. Defina a alíquota e marque cada linha como tributada ou não. Vale um aviso importante: no Brasil o documento gerado aqui é uma fatura ou recibo de cobrança, e não substitui a nota fiscal eletrônica, que precisa ser emitida pelo sistema da sua prefeitura (ISS, geralmente entre 2 % e 5 %) ou do seu estado (ICMS). Em Portugal, o IVA padrão é de 23 %, e a fatura legal também exige software certificado. Use o BillCrafter para cobrar e se organizar, e confirme a parte fiscal com seu contador."],
        ["Posso usar o BillCrafter no celular?", "Sim. Ele roda no navegador do celular, então dá para preencher a fatura, baixar o PDF e enviá-la por e-mail do telefone ou do tablet. Não há nada para instalar nem loja de aplicativos envolvida."],
        ["Preciso de empresa registrada para emitir uma fatura?", "Não. Freelancers e autônomos podem faturar com o próprio nome e endereço. Inclua seu CNPJ ou CPF conforme o caso — e evite expor dados pessoais sensíveis na fatura."],
        ["Qual a diferença entre fatura e recibo?", "A fatura é um pedido de pagamento enviado antes do pagamento. O recibo confirma o pagamento depois de feito. O BillCrafter cobre faturas, orçamentos, cotações e recibos."],
        ["Qual prazo de pagamento usar?", "14 ou 15 dias é um padrão sensato para a maioria dos freelancers e pequenas empresas. Deixe 30 dias para clientes consolidados ou contratos B2B maiores."],
        ["Meus dados são privados?", "Seu rascunho fica no navegador até você decidir salvá-lo em uma conta. Os dados salvos são criptografados e você pode exportá-los ou excluí-los quando quiser."],
      ],
      still: "Ainda tem dúvida? Escreva para",
    },
    tr: {
      eyebrow: "Usado por pequenas empresas",
      h2: "Faturas profissionais, com seriedade.",
      items: [["Grátis", "sem cadastro para baixar"], ["PDF", "exportação fiel"], ["45", "modelos de fatura"], ["Privado", "criptografado, nunca vendido"]],
    },
  },
};

M.fr = {
  feat: {
    eyebrow: "Pourquoi BillCrafter",
    h2: "Créez-en une maintenant. Connectez-vous pour la garder.",
    lead: "Essayez avant de décider quoi que ce soit — ensuite, laissez le compte tout mémoriser.",
    cards: [
      ["1 · Votre première facture gratuite", "Commencez à écrire sur le document tout de suite : sans compte, sans carte, sans rien installer. Renseignez vos informations et téléchargez un PDF soigné en moins de deux minutes. Sans compte, vous avez 1 export gratuit par jour."],
      ["2 · Connectez-vous, tout est enregistré", "Un compte gratuit conserve dans le cloud vos coordonnées, vos clients et toutes vos factures passées — la suivante ne prend que quelques secondes, depuis n’importe quel appareil. Avec un compte, les exports sont gratuits et illimités."],
      ["3 · Les champs dont votre métier a vraiment besoin", "Séparez la main-d’œuvre des fournitures, facturez à l’heure avec des lignes datées, demandez un acompte, ou placez les photos du chantier terminé sur la facture elle-même. Les 45 modèles, répartis sur huit mises en page, s’ouvrent déjà avec ce qu’il faut."],
    ],
    browse: "Parcourir la bibliothèque",
  },
  step: {
    eyebrow: "Comment ça marche",
    h2: "Trois étapes pour être payé.",
    items: [
      ["Écrivez sur la facture", "Renseignez votre entreprise, votre client et les lignes directement sur le document. Totaux et TVA se calculent en direct pendant la saisie."],
      ["Personnalisez et prévisualisez", "Ajoutez votre logo, choisissez l’une des huit mises en page et une couleur — la facture affichée est exactement celle qui sera téléchargée."],
      ["Téléchargez ou envoyez", "Téléchargez un PDF net, ou connectez-vous pour l’envoyer directement par e-mail à votre client."],
    ],
  },
  tpl: {
    eyebrow: "Modèles",
    h2: "Une facture pensée pour votre métier.",
    lead: "Ouvrez le modèle artisan : la main-d’œuvre est déjà séparée des fournitures ; celui de conseil facture des heures datées à votre taux ; celui de ménage indique la période et la fréquence de vos passages.",
  },
  faq: {
    eyebrow: "FAQ",
    h2: "Vos questions, nos réponses.",
    items: [
      ["BillCrafter est-il gratuit ?", "Oui, entièrement. Il n’y a aucune offre payante. Sans compte, vous pouvez exporter 1 PDF par jour ; avec un compte gratuit, les exports et toutes les fonctions — tampons de statut, liens de partage, factures récurrentes, signature électronique et envoi par e-mail — sont illimités."],
      ["Dois-je créer un compte pour l’utiliser ?", "Non. L’éditeur fonctionne dès le chargement de la page : pas de compte, pas de carte, rien à installer. Vous pouvez remplir une facture complète et télécharger 1 PDF par jour sans vous inscrire. Un compte gratuit supprime la limite et ajoute l’historique enregistré et votre liste de clients ; il est là quand vous en voulez, pas avant de commencer."],
      ["Ma facture portera-t-elle un filigrane ou la marque BillCrafter ?", "Non. Rien n’est ajouté à votre document, quelle que soit l’offre : pas de filigrane, pas de logo, pas de mention « créé avec ». Le PDF ne contient que ce que vous y mettez. Les tampons PAYÉE / IMPAYÉE sont une option que vous activez vous-même avec un compte gratuit, pas un marquage de notre part."],
      ["Dans quel format les factures sont-elles téléchargées ?", "En PDF, et bien fait. Chaque facture s’exporte en PDF au pixel près, imprimable en un clic, sur tous les appareils et sans rien installer. Le PDF garde une mise en page identique à l’écran comme à l’impression chez votre client — mais un PDF standard n’est pas infalsifiable : conservez votre propre copie comme référence. Choisissez une couleur d’accent et l’une des 8 mises en page pour la personnaliser."],
      ["Mon client peut-il payer la facture en ligne via BillCrafter ?", "Non — BillCrafter crée le document, il ne traite pas les paiements. Vous indiquez vos propres coordonnées de règlement : un virement avec votre IBAN, un lien PayPal ou Stripe, ou une adresse de portefeuille avec QR code. L’argent vous parvient directement, et nous ne touchons jamais à vos encaissements ni ne prélevons de commission."],
      ["Puis-je envoyer la facture par e-mail à mon client ?", "Oui, avec un compte gratuit. Elle part en pièce jointe PDF et les réponses arrivent sur votre propre adresse. Les envois sont gratuits et illimités."],
      ["Puis-je facturer des clients étrangers dans une autre devise ?", "Oui. Plus de 25 devises sont disponibles — euro, dollar, livre, franc suisse, dollar canadien et d’autres — ainsi que l’USDT et l’USDC si vous êtes payé en stablecoins. Le format des nombres et le mot employé pour la taxe suivent le marché choisi : une facture française affiche « TVA », une facture suédoise « Moms »."],
      ["Puis-je ajouter la TVA ?", "Oui. Saisissez le taux et indiquez ligne par ligne ce qui y est soumis. En France, le taux normal est de 20 %, avec des taux réduits de 10 %, 5,5 % et 2,1 %. Si vous êtes micro-entrepreneur sous le régime de la franchise en base, vous ne facturez pas de TVA et devez porter la mention « TVA non applicable, art. 293 B du CGI » — le champ Notes est fait pour cela. Pensez aussi à faire figurer votre numéro SIRET. Les règles dépendent de votre activité : vérifiez avec votre comptable ou le service des impôts des entreprises."],
      ["Puis-je utiliser BillCrafter sur mon téléphone ?", "Oui. Tout fonctionne dans le navigateur mobile : vous remplissez la facture, téléchargez le PDF et l’envoyez par e-mail depuis un téléphone ou une tablette. Rien à installer, aucun passage par un magasin d’applications."],
      ["Faut-il une entreprise enregistrée pour facturer ?", "Non. Les freelances et travailleurs indépendants peuvent facturer sous leur propre nom et adresse. Indiquez votre numéro SIRET ou de TVA si vous en avez un, et évitez toute donnée personnelle sensible sur une facture."],
      ["Quelle différence entre une facture et un reçu ?", "La facture est une demande de paiement envoyée avant le règlement. Le reçu confirme le paiement après coup. BillCrafter gère factures, devis, offres et reçus."],
      ["Quel délai de paiement choisir ?", "14 ou 15 jours est un choix raisonnable pour la plupart des freelances et petites entreprises. Réservez 30 jours aux clients établis ou aux contrats B2B importants."],
      ["Mes données sont-elles privées ?", "Votre brouillon reste dans votre navigateur jusqu’à ce que vous choisissiez de l’enregistrer sur un compte. Les données enregistrées sont chiffrées et vous pouvez les exporter ou les supprimer à tout moment."],
    ],
    still: "Une autre question ? Écrivez à",
  },
  tr: {
    eyebrow: "Adopté par les petites entreprises",
    h2: "Des factures professionnelles, prises au sérieux.",
    items: [["Gratuit", "sans inscription pour télécharger"], ["PDF", "export au pixel près"], ["45", "modèles de facture"], ["Privé", "chiffré, jamais revendu"]],
  },
};

M.de = {
  feat: {
    eyebrow: "Warum BillCrafter",
    h2: "Jetzt eine erstellen. Anmelden, um sie zu behalten.",
    lead: "Erst ausprobieren, dann entscheiden — das Merken übernimmt das Konto.",
    cards: [
      ["1 · Die erste Rechnung ist kostenlos", "Schreiben Sie sofort direkt im Dokument: kein Konto, keine Karte, keine Installation. Daten eintragen und in unter zwei Minuten ein saubere PDF herunterladen. Ohne Konto haben Sie 1 kostenlosen Export pro Tag."],
      ["2 · Anmelden und alles ist gespeichert", "Ein kostenloses Konto speichert Ihre Firmendaten, Kunden und alle früheren Rechnungen in der Cloud — die nächste dauert dann nur Sekunden, auf jedem Gerät. Mit Konto sind Exporte kostenlos und unbegrenzt."],
      ["3 · Die Felder, mit denen Ihr Gewerk wirklich abrechnet", "Trennen Sie Arbeit von Material, rechnen Sie stundenweise mit datierten Positionen ab, fordern Sie eine Anzahlung, oder setzen Sie Fotos der fertigen Arbeit direkt auf die Rechnung. Die 45 Vorlagen in acht Layouts bringen das Passende schon mit."],
    ],
    browse: "Zur Vorlagenbibliothek",
  },
  step: {
    eyebrow: "So funktioniert’s",
    h2: "In drei Schritten zur bezahlten Rechnung.",
    items: [
      ["Direkt in die Rechnung tippen", "Tragen Sie Ihr Unternehmen, den Kunden und die Positionen direkt im Dokument ein. Summen und Steuer werden live beim Tippen berechnet."],
      ["Anpassen und prüfen", "Logo hochladen, eines der acht Layouts und eine Farbe wählen — die Rechnung, die Sie sehen, ist genau die, die heruntergeladen wird."],
      ["Herunterladen oder senden", "Laden Sie ein sauberes PDF herunter oder melden Sie sich an und mailen Sie es direkt an den Kunden."],
    ],
  },
  tpl: {
    eyebrow: "Vorlagen",
    h2: "Eine Rechnung, gebaut für Ihre Branche.",
    lead: "Öffnen Sie die Handwerker-Vorlage, und Arbeit ist bereits vom Material getrennt; die Beratungsvorlage rechnet datierte Stunden zu Ihrem Satz ab; die Reinigungsvorlage nennt den Zeitraum und den Turnus.",
  },
  faq: {
    eyebrow: "FAQ",
    h2: "Fragen, beantwortet.",
    items: [
      ["Ist BillCrafter kostenlos?", "Ja, vollständig. Es gibt keine kostenpflichtigen Tarife. Ohne Konto können Sie 1 PDF pro Tag exportieren; mit einem kostenlosen Konto sind Exporte und alle Funktionen — Status-Stempel, Freigabelinks, wiederkehrende Rechnungen, E-Signatur und E-Mail-Versand — unbegrenzt."],
      ["Muss ich ein Konto anlegen, um es zu nutzen?", "Nein. Der Editor läuft, sobald die Seite geladen ist — kein Konto, keine Karte, nichts zu installieren. Sie können eine vollständige Rechnung ausfüllen und 1 PDF pro Tag herunterladen, ohne sich anzumelden. Ein kostenloses Konto hebt die Grenze auf und ergänzt gespeicherte Historie und Ihre Kundenliste; es ist da, wenn Sie es wollen, nicht vorher."],
      ["Hat meine Rechnung ein Wasserzeichen oder BillCrafter-Branding?", "Nein. In keinem Tarif wird Ihrem Dokument etwas hinzugefügt — kein Wasserzeichen, kein Logo, keine « erstellt mit »-Zeile. Das PDF enthält nur das, was Sie hineinschreiben. Die optionalen Stempel BEZAHLT / OFFEN schalten Sie mit einem kostenlosen Konto selbst ein – das ist kein Branding."],
      ["In welchem Format wird die Rechnung heruntergeladen?", "Als PDF – ein Format, dafür richtig. Jede Rechnung wird als pixelgenaues PDF exportiert, das sich mit einem Klick drucken lässt, auf jedem Gerät und ohne Installation. Das PDF sieht auf Bildschirm und Drucker Ihres Kunden genau gleich aus – ein normales PDF ist aber nicht fälschungssicher, bewahren Sie deshalb Ihre eigene Kopie als Beleg auf. Wählen Sie eine Akzentfarbe und eines der 8 Layouts."],
      ["Kann mein Kunde die Rechnung über BillCrafter online bezahlen?", "Nein — BillCrafter erstellt das Dokument, wickelt aber keine Zahlungen ab. Sie tragen Ihre eigenen Zahlungsdaten ein: IBAN für die Überweisung, einen PayPal- oder Stripe-Link oder eine Wallet-Adresse mit QR-Code. Das Geld geht direkt an Sie, wir fassen es nie an und berechnen keine Transaktionsgebühr."],
      ["Kann ich die Rechnung per E-Mail an meinen Kunden senden?", "Ja, mit einem kostenlosen Konto. Sie wird als PDF-Anhang verschickt, und Antworten landen in Ihrem eigenen Postfach. Der Versand ist kostenlos und unbegrenzt."],
      ["Kann ich Kunden im Ausland in einer anderen Währung berechnen?", "Ja. Über 25 Währungen stehen bereit — Euro, US-Dollar, Pfund, Schweizer Franken und weitere — dazu USDT und USDC, falls Sie in Stablecoins bezahlt werden. Zahlenformat und Steuerbezeichnung richten sich nach dem gewählten Markt: eine deutsche Rechnung zeigt « MwSt. », eine schwedische « Moms »."],
      ["Kann ich Umsatzsteuer ausweisen?", "Ja. Tragen Sie den Satz ein und markieren Sie jede Position als steuerpflichtig oder nicht. In Deutschland gelten 19 % Regelsatz und 7 % ermäßigt. Als Kleinunternehmer nach § 19 UStG weisen Sie keine Umsatzsteuer aus und sollten den Hinweis « Gemäß § 19 UStG wird keine Umsatzsteuer berechnet » aufnehmen — dafür ist das Notizfeld da. Denken Sie außerdem an Ihre Steuernummer oder USt-IdNr. auf der Rechnung. Was für Sie gilt, klären Sie mit Ihrem Steuerberater oder dem Finanzamt."],
      ["Kann ich BillCrafter auf dem Handy nutzen?", "Ja. Es läuft im mobilen Browser: Rechnung ausfüllen, PDF herunterladen und direkt vom Handy oder Tablet per E-Mail versenden. Nichts zu installieren, kein App Store nötig."],
      ["Brauche ich ein angemeldetes Gewerbe, um zu fakturieren?", "Nein. Freiberufler und Selbstständige können unter eigenem Namen und Adresse Rechnungen stellen. Geben Sie Ihre Steuer- oder USt-IdNr. an, falls vorhanden — sensible persönliche Daten gehören nicht auf eine Rechnung."],
      ["Was ist der Unterschied zwischen Rechnung und Quittung?", "Eine Rechnung ist eine Zahlungsaufforderung vor der Zahlung. Eine Quittung bestätigt die Zahlung danach. BillCrafter unterstützt Rechnungen, Kostenvoranschläge, Angebote und Quittungen."],
      ["Wie lang sollte das Zahlungsziel sein?", "14 oder 15 Tage sind für die meisten Freiberufler und Kleinunternehmen ein sinnvoller Standard. 30 Tage bleiben etablierten Kunden oder größeren B2B-Verträgen vorbehalten."],
      ["Sind meine Daten privat?", "Ihr Entwurf bleibt im Browser, bis Sie ihn bewusst in einem Konto speichern. Gespeicherte Daten sind verschlüsselt, und Sie können sie jederzeit exportieren oder löschen."],
    ],
    still: "Noch eine Frage? Schreiben Sie an",
  },
  tr: {
    eyebrow: "Von Kleinunternehmen genutzt",
    h2: "Professionelle Rechnungen, ernst genommen.",
    items: [["Gratis", "ohne Anmeldung herunterladen"], ["PDF", "pixelgenauer Export"], ["45", "Rechnungsvorlagen"], ["Privat", "verschlüsselt, nie verkauft"]],
  },
};

M.it = {
  feat: {
    eyebrow: "Perché BillCrafter",
    h2: "Creane una adesso. Accedi per conservarla.",
    lead: "Provalo prima di decidere qualsiasi cosa — poi lascia che sia l’account a ricordare.",
    cards: [
      ["1 · La prima fattura è gratis", "Inizia a scrivere sul documento adesso: senza account, senza carta, senza installare nulla. Inserisci i tuoi dati e scarica un PDF impeccabile in meno di due minuti. Senza account hai 1 esportazione gratuita al giorno."],
      ["2 · Accedi ed è salvata", "Un account gratuito conserva nel cloud i dati della tua attività, i clienti e tutte le fatture passate — così la successiva richiede pochi secondi, da qualsiasi dispositivo. Con un account le esportazioni sono gratuite e illimitate."],
      ["3 · I campi su cui il tuo mestiere fattura davvero", "Separa manodopera e materiali, fattura a ore con voci datate, chiedi un acconto, oppure metti le foto del lavoro finito sulla fattura stessa. I 45 modelli, su otto layout, si aprono già con quello che serve."],
    ],
    browse: "Sfoglia la libreria",
  },
  step: {
    eyebrow: "Come funziona",
    h2: "Tre passi per farti pagare.",
    items: [
      ["Scrivi sulla fattura", "Inserisci la tua attività, il cliente e le righe direttamente sul documento. Totali e imposte si calcolano in tempo reale mentre scrivi."],
      ["Personalizza e visualizza", "Carica il logo, scegli uno degli otto layout e un colore — la fattura che vedi è esattamente quella che scarichi."],
      ["Scarica o invia", "Scarica un PDF pulito, oppure accedi e invialo via e-mail direttamente al cliente."],
    ],
  },
  tpl: {
    eyebrow: "Modelli",
    h2: "Una fattura pensata per il tuo settore.",
    lead: "Apri il modello per l’edilizia e la manodopera è già separata dai materiali; quello per la consulenza fattura ore datate alla tua tariffa; quello per le pulizie indica il periodo e ogni quanto intervieni.",
  },
  faq: {
    eyebrow: "Domande frequenti",
    h2: "Risposte chiare.",
    items: [
      ["BillCrafter è gratuito?", "Sì, completamente. Non esistono piani a pagamento. Senza account puoi esportare 1 PDF al giorno; con un account gratuito le esportazioni e tutte le funzioni — timbri di stato, link di condivisione, fatture ricorrenti, firma elettronica e invio via e-mail — sono illimitate."],
      ["Devo creare un account per usarlo?", "No. L’editor funziona appena la pagina si carica: niente account, niente carta, niente da installare. Puoi compilare una fattura completa e scaricare 1 PDF al giorno senza registrarti. Un account gratuito toglie il limite e aggiunge lo storico salvato e la tua rubrica clienti; c’è quando ti serve, non prima di iniziare."],
      ["La mia fattura avrà una filigrana o il marchio BillCrafter?", "No. Su nessun piano viene aggiunto qualcosa al tuo documento: nessuna filigrana, nessun logo, nessuna riga « creato con ». Il PDF contiene solo ciò che ci metti tu. I timbri PAGATA / NON PAGATA li attivi tu con un account gratuito: non sono un marchio nostro."],
      ["In che formato si scarica la fattura?", "In PDF, fatto bene. Ogni fattura si esporta in un PDF fedele al pixel che si stampa con un clic, su qualsiasi dispositivo e senza installare nulla. Il PDF mantiene il layout identico sullo schermo e sulla stampante del cliente, ma un PDF standard non è a prova di manomissione: conserva la tua copia come riferimento. Scegli un colore d’accento e uno degli 8 layout per personalizzarla."],
      ["Il mio cliente può pagare la fattura online tramite BillCrafter?", "No — BillCrafter crea il documento, non gestisce i pagamenti. Inserisci tu le coordinate di incasso: un bonifico con il tuo IBAN, un link PayPal o Stripe, oppure un indirizzo di wallet con QR code. I soldi arrivano direttamente a te: non li tocchiamo mai e non tratteniamo commissioni."],
      ["Posso inviare la fattura via e-mail al cliente?", "Sì, con un account gratuito. Parte come allegato PDF e le risposte arrivano al tuo indirizzo. Gli invii sono gratuiti e senza limiti."],
      ["Posso fatturare clienti esteri in un’altra valuta?", "Sì. Ci sono più di 25 valute — euro, dollaro, sterlina, franco svizzero e altre — oltre a USDT e USDC se vieni pagato in stablecoin. Il formato dei numeri e la parola usata per l’imposta seguono il mercato scelto: una fattura italiana riporta « IVA », una svedese « Moms »."],
      ["Posso aggiungere l’IVA?", "Sì. Imposta l’aliquota e indica riga per riga cosa è imponibile. In Italia l’aliquota ordinaria è il 22 %, con ridotte al 10 %, 5 % e 4 %. In regime forfettario non applichi l’IVA e va indicata la dicitura « Operazione senza applicazione dell’IVA ai sensi dell’art. 1, commi 54-89, Legge 190/2014 »: il campo Note serve a questo. Attenzione a un punto importante: verso privati e imprese in Italia vige l’obbligo di fattura elettronica tramite SdI, quindi il PDF creato qui vale come documento di cortesia o proforma, non sostituisce l’invio allo SdI. Verifica la tua posizione con il commercialista."],
      ["Posso usare BillCrafter dal telefono?", "Sì. Funziona nel browser del telefono: compili la fattura, scarichi il PDF e la mandi via e-mail da smartphone o tablet. Non c’è nulla da installare e nessuno store di mezzo."],
      ["Serve una partita IVA per emettere una fattura?", "I liberi professionisti possono fatturare con il proprio nome e indirizzo, ma in Italia l’emissione di fatture è legata al regime fiscale e spesso alla partita IVA: verifica la tua situazione con un commercialista. Indica il codice fiscale o la partita IVA se ne hai una."],
      ["Che differenza c’è tra fattura e ricevuta?", "La fattura è una richiesta di pagamento inviata prima del pagamento. La ricevuta conferma il pagamento dopo che è avvenuto. BillCrafter gestisce fatture, preventivi, offerte e ricevute."],
      ["Quali termini di pagamento usare?", "14 o 15 giorni è un valore sensato per la maggior parte dei freelance e delle piccole imprese. Riserva i 30 giorni ai clienti consolidati o ai contratti B2B più grandi."],
      ["I miei dati sono privati?", "La bozza resta nel tuo browser finché non scegli di salvarla in un account. I dati salvati sono cifrati e puoi esportarli o eliminarli quando vuoi."],
    ],
    still: "Hai ancora una domanda? Scrivi a",
  },
  tr: {
    eyebrow: "Scelto dalle piccole imprese",
    h2: "Fatture professionali, prese sul serio.",
    items: [["Gratis", "nessuna registrazione per scaricare"], ["PDF", "esportazione fedele"], ["45", "modelli di fattura"], ["Privato", "cifrato, mai venduto"]],
  },
};

M["zh-Hant"] = {
  feat: {
    eyebrow: "為什麼選 BillCrafter",
    h2: "現在就開一張。登入即可保存。",
    lead: "先試用，再決定 —— 記錄的事就交給帳號。",
    cards: [
      ["1 · 第一張發票免費", "現在就直接在文件上輸入：不必註冊、不必綁卡、不用安裝。填好資料，兩分鐘內就能下載一份精緻的 PDF。未註冊每天可免費匯出 1 次。"],
      ["2 · 登入後自動保存", "免費帳號會把你的商家資料、客戶與所有歷史發票存在雲端 —— 下一張只需幾秒鐘，任何裝置都能開。註冊後匯出次數不限，完全免費。"],
      ["3 · 你這一行真正要填的欄位", "把工資與材料分開列、以工時計費並逐筆註明日期、先收訂金，或把完工照片直接放進發票裡。45 款範本、八種版面，一開啟就已經備好你需要的欄位。"],
    ],
    browse: "瀏覽範本庫",
  },
  step: {
    eyebrow: "使用方式",
    h2: "三步完成一張能收款的發票。",
    items: [
      ["直接在發票上輸入", "商家、客戶與明細都直接填在文件上。金額與稅額會隨著輸入即時計算。"],
      ["自訂並預覽", "上傳標誌，選一種版面與主色 —— 你看到的樣子，就是下載後的樣子。"],
      ["下載或寄出", "下載乾淨的 PDF，或登入後直接以電子郵件寄給客戶。"],
    ],
  },
  tpl: {
    eyebrow: "範本",
    h2: "為你的行業量身打造的發票。",
    lead: "打開承包商範本，工資與材料已經分開；顧問範本以費率計算逐日工時；清潔範本則寫明服務期間與到府頻率。",
  },
  faq: {
    eyebrow: "常見問題",
    h2: "問題，一次說清楚。",
    items: [
      ["BillCrafter 免費嗎？", "是，完全免費，沒有任何付費方案。未註冊每天可匯出 1 份 PDF；註冊免費帳號後，匯出次數與所有功能——狀態印章、分享連結、週期性發票、電子簽名與電子郵件寄送——皆不限次數。"],
      ["一定要註冊帳號才能用嗎？", "不用。網頁一載入編輯器就能用：不必註冊、不必綁卡、不用安裝任何東西。未註冊每天可完整填好並下載 1 份 PDF。免費帳號會解除次數限制，並提供雲端歷史紀錄與客戶名單——想用的時候再開就好，不會擋在你開始之前。"],
      ["發票上會有浮水印或 BillCrafter 的標誌嗎？", "不會。任何方案都不會在你的文件上加東西：沒有浮水印、沒有我們的標誌，也沒有「由某某製作」那一行。PDF 裡只有你自己放進去的內容。已付款／未付款印章需登入免費帳號後由你自己選擇開啟，不是我們的品牌標記。"],
      ["發票會以什麼格式下載？", "PDF —— 只做一種格式，但做到位。每張發票都能匯出像素級精準的 PDF，一鍵列印，任何裝置都打得開，也不必安裝任何軟體。PDF 能讓版面在客戶的螢幕和印表機上保持一致；但一般 PDF 並非無法竄改，請自行保留一份作為存檔依據。你可以挑選主色與 8 種版面之一來打造專屬樣式。"],
      ["客戶可以直接在 BillCrafter 上線上付款嗎？", "不行——BillCrafter 只負責產生文件，不處理金流。你填上自己的收款方式：銀行轉帳帳號、PayPal 或 Stripe 連結，或是附上 QR code 的加密貨幣錢包地址。款項直接進你的帳戶，我們不經手你的錢，也不抽任何交易手續費。"],
      ["可以直接把發票用電子郵件寄給客戶嗎？", "可以，需要一個免費帳號。發票會以 PDF 附件寄出，客戶回信會直接回到你自己的信箱。寄送完全免費，沒有次數上限。"],
      ["可以用其他幣別向國外客戶開票嗎？", "可以。內建 25 種以上幣別——港幣、新台幣、美元、人民幣、日圓、歐元等——另外還支援 USDT 與 USDC，適合以穩定幣收款的情況。數字格式與稅目名稱會跟著你選的市場走，所以台灣的單據會顯示「營業稅」，日本的則是「消費税」。"],
      ["可以加上稅金嗎？", "可以。填入稅率，並逐行標記哪些項目要課稅。香港沒有增值稅或消費稅，稅率留 0 即可；台灣營業稅為 5 %。要特別說明的是：在台灣，這裡產生的 PDF 屬於請款單或估價單性質，並不等同於統一發票——統一發票必須透過財政部電子發票整合服務平台或加值中心開立。你可以用 BillCrafter 請款與留存紀錄，稅務開立的部分請依主管機關規定辦理，或詢問你的記帳士。"],
      ["手機上可以用嗎？", "可以。它在手機瀏覽器裡就能運作，你可以直接用手機或平板填好發票、下載 PDF 並寄給客戶。不必安裝任何 App，也不用經過應用程式商店。"],
      ["一定要有登記的公司才能開發票嗎？", "不必。自由接案者與自營者可以用本人姓名與地址開立。若有商業登記號碼或稅務編號可一併填入；請勿在發票上放身分證等敏感個人資料。另請注意，香港與台灣對統一發票／收據的規定不同，涉及稅務時請諮詢會計師。"],
      ["發票與收據有什麼不同？", "發票是付款前寄出的請款文件；收據則是在款項收到後確認付款。BillCrafter 支援發票、估價單、報價單與收據。"],
      ["付款期限該設多久？", "對多數自由接案者與小型企業來說，14 或 15 天是合理的預設值。30 天則留給長期合作客戶或較大的 B2B 合約。"],
      ["我的資料是否保密？", "草稿只留在你的瀏覽器，直到你選擇存入帳號。已儲存的資料經過加密，你隨時可以匯出或刪除。"],
    ],
    still: "還有問題嗎？請來信",
  },
  tr: {
    eyebrow: "小型企業的選擇",
    h2: "專業發票，認真對待。",
    items: [["免費", "無需註冊即可下載"], ["PDF", "像素級精準匯出"], ["45", "款發票範本"], ["隱私", "加密保存，絕不販售"]],
  },
};

M.ru = {
  feat: {
    eyebrow: "Почему BillCrafter",
    h2: "Создайте счёт сейчас. Войдите, чтобы сохранить его.",
    lead: "Сначала попробуйте, а решите потом — запоминать всё будет аккаунт.",
    cards: [
      ["1 · Первый счёт — бесплатно", "Начните печатать прямо в документе: без аккаунта, без карты, без установки. Заполните данные и скачайте аккуратный PDF меньше чем за две минуты. Без аккаунта — 1 бесплатная выгрузка в день."],
      ["2 · Войдите — и всё сохранится", "Бесплатный аккаунт хранит в облаке ваши реквизиты, клиентов и все прошлые счёта — следующий займёт несколько секунд с любого устройства. С аккаунтом выгрузки бесплатны и не ограничены."],
      ["3 · Поля, по которым ваша сфера действительно выставляет счета", "Разделите работу и материалы, выставляйте счёт по часам с датами по каждой записи, попросите аванс или разместите фотографии готовой работы прямо на счёте. 45 шаблонов в восьми макетах открываются уже с нужными полями."],
    ],
    browse: "Открыть библиотеку",
  },
  step: {
    eyebrow: "Как это работает",
    h2: "Три шага до оплаченного счёта.",
    items: [
      ["Печатайте прямо в счёте", "Внесите свою компанию, клиента и позиции прямо в документ. Итоги и налог считаются на ходу, пока вы печатаете."],
      ["Настройте и посмотрите", "Загрузите логотип, выберите один из восьми макетов и цвет — счёт на экране выглядит точно так же, как в скачанном файле."],
      ["Скачайте или отправьте", "Скачайте чистый PDF или войдите и отправьте счёт клиенту по электронной почте."],
    ],
  },
  tpl: {
    eyebrow: "Шаблоны",
    h2: "Счёт, собранный под вашу сферу.",
    lead: "Откройте шаблон для подрядчика — работа уже отделена от материалов; консалтинговый считает часы с датами по вашей ставке; клининговый указывает период и периодичность визитов.",
  },
  faq: {
    eyebrow: "Частые вопросы",
    h2: "Отвечаем по существу.",
    items: [
      ["BillCrafter бесплатный?", "Да, полностью. Платных тарифов нет. Без аккаунта можно выгружать 1 PDF в день; с бесплатным аккаунтом выгрузки и все функции — штампы статуса, ссылки для просмотра, повторяющиеся счёта, электронная подпись и отправка по почте — без ограничений."],
      ["Нужно ли создавать аккаунт, чтобы пользоваться?", "Нет. Редактор работает сразу после загрузки страницы: без аккаунта, без карты, ничего устанавливать не нужно. Вы можете полностью заполнить счёт и скачивать 1 PDF в день без регистрации. Бесплатный аккаунт снимает ограничение и добавляет сохранённую историю и список клиентов — он появляется тогда, когда он вам нужен, а не до начала работы."],
      ["Будет ли на счёте водяной знак или логотип BillCrafter?", "Нет. Ни на одном тарифе мы ничего не добавляем в ваш документ: ни водяного знака, ни логотипа, ни строки «сделано в». В PDF есть только то, что вы туда вписали. Штампы ОПЛАЧЕНО / НЕ ОПЛАЧЕНО вы включаете сами в бесплатном аккаунте — это не наша маркировка."],
      ["В каком формате скачивается счёт?", "В PDF — один формат, зато сделанный как надо. Каждый счёт экспортируется в точный PDF с печатью в один клик, на любом устройстве и без установки программ. PDF сохраняет макет одинаковым на экране и принтере клиента, но обычный PDF не защищён от изменений — храните собственную копию как подтверждение. Выберите акцентный цвет и один из 8 макетов, чтобы оформить счёт по-своему."],
      ["Может ли клиент оплатить счёт онлайн через BillCrafter?", "Нет — BillCrafter создаёт документ, но не проводит платежи. Вы указываете свои реквизиты: банковский счёт, ссылку на оплату, СБП или адрес криптокошелька с QR-кодом. Деньги идут напрямую вам, мы их не касаемся и не берём комиссию за перевод."],
      ["Можно ли отправить счёт клиенту по электронной почте?", "Да, с бесплатным аккаунтом. Счёт уходит вложением в формате PDF, а ответы приходят на ваш собственный адрес. Отправка бесплатна и не ограничена."],
      ["Можно ли выставлять счета зарубежным клиентам в другой валюте?", "Да. Доступно более 25 валют — рубль, доллар, евро, тенге, юань и другие — плюс USDT и USDC, если вам платят стейблкоинами. Формат чисел и название налога подстраиваются под выбранный рынок: в российском счёте будет «НДС», а в шведском — «Moms»."],
      ["Можно ли добавить НДС?", "Да. Укажите ставку и отметьте, какие строки облагаются налогом. В России основная ставка НДС — 20 %, льготная — 10 %. На УСН и на НПД (самозанятость) НДС обычно не начисляется: оставьте ставку нулевой и добавьте в примечании «НДС не облагается». Важный момент: самозанятые обязаны формировать чек в приложении «Мой налог», а плательщики НДС — оформлять счёт-фактуру по установленной форме, и созданный здесь PDF их не заменяет. Свою ситуацию уточните у бухгалтера или в налоговой."],
      ["Можно ли пользоваться BillCrafter с телефона?", "Да. Всё работает в мобильном браузере: заполняете счёт, скачиваете PDF и отправляете его по почте прямо с телефона или планшета. Ничего устанавливать не нужно, магазин приложений не участвует."],
      ["Нужна ли зарегистрированная компания, чтобы выставить счёт?", "Нет. Фрилансеры и самозанятые могут выставлять счёта на своё имя и адрес. Укажите ИНН, если он есть, и не размещайте в счёте паспортные или другие чувствительные данные."],
      ["Чем счёт отличается от квитанции?", "Счёт — это требование оплаты, которое отправляют до платежа. Квитанция подтверждает, что оплата уже прошла. BillCrafter поддерживает счёта, сметы, предложения и квитанции."],
      ["Какой срок оплаты указывать?", "14 или 15 дней — разумный вариант для большинства фрилансеров и небольших компаний. 30 дней лучше оставить для постоянных клиентов и крупных B2B-договоров."],
      ["Мои данные в безопасности?", "Черновик остаётся в вашем браузере, пока вы сами не сохраните его в аккаунт. Сохранённые данные зашифрованы, их можно выгрузить или удалить в любой момент."],
    ],
    still: "Остался вопрос? Напишите на",
  },
  tr: {
    eyebrow: "Выбор небольших компаний",
    h2: "Профессиональные счёта — всерьёз.",
    items: [["Бесплатно", "скачивание без регистрации"], ["PDF", "точная выгрузка"], ["45", "шаблонов счёта"], ["Приватно", "шифруется и не продаётся"]],
  },
};

M.bn = {
  feat: {
    eyebrow: "কেন BillCrafter",
    h2: "এখনই একটি তৈরি করুন। সংরক্ষণ করতে সাইন ইন করুন।",
    lead: "কিছু ঠিক করার আগে যাচাই করে নিন — মনে রাখার কাজটা অ্যাকাউন্টই করবে।",
    cards: [
      ["১ · প্রথম চালানটি বিনামূল্যে", "এখনই সরাসরি নথিতে লেখা শুরু করুন: অ্যাকাউন্ট লাগবে না, কার্ড লাগবে না, কিছু ইনস্টলও করতে হবে না। তথ্য বসিয়ে দুই মিনিটের মধ্যেই পরিচ্ছন্ন একটি PDF নামিয়ে নিন। অ্যাকাউন্ট ছাড়া প্রতিদিন ১টি রপ্তানি বিনামূল্যে।"],
      ["২ · সাইন ইন করলেই সংরক্ষিত", "একটি বিনামূল্যের অ্যাকাউন্ট আপনার ব্যবসার তথ্য, ক্লায়েন্ট ও আগের সব চালান ক্লাউডে রেখে দেয় — ফলে পরেরটি যেকোনো ডিভাইস থেকে কয়েক সেকেন্ডেই হয়ে যায়। অ্যাকাউন্ট থাকলে রপ্তানি বিনামূল্যে ও সীমাহীন।"],
      ["৩ · আপনার পেশা আসলে যে ঘরগুলো ভরে", "শ্রম ও উপকরণ আলাদা করুন, তারিখসহ এন্ট্রি দিয়ে ঘণ্টা হিসেবে বিল করুন, আগাম টাকা চান, কিংবা শেষ হওয়া কাজের ছবি সরাসরি চালানেই দিন। আটটি বিন্যাসে ৪৫টি টেমপ্লেট খুললেই দরকারি ঘরগুলো তৈরি থাকে।"],
    ],
    browse: "টেমপ্লেট দেখুন",
  },
  step: {
    eyebrow: "কীভাবে কাজ করে",
    h2: "পরিশোধিত চালান পর্যন্ত তিন ধাপ।",
    items: [
      ["চালানের উপরেই লিখুন", "আপনার প্রতিষ্ঠান, ক্লায়েন্ট ও পণ্যের সারি সরাসরি নথিতে বসান। লেখার সঙ্গে সঙ্গেই মোট ও কর হিসাব হয়ে যায়।"],
      ["নিজের মতো সাজিয়ে দেখুন", "লোগো যোগ করুন, আটটি বিন্যাসের একটি ও একটি রঙ বেছে নিন — পর্দায় যেমন দেখছেন, ডাউনলোডেও ঠিক তেমনই।"],
      ["নামিয়ে নিন বা পাঠিয়ে দিন", "পরিচ্ছন্ন একটি PDF নামিয়ে নিন, কিংবা সাইন ইন করে সরাসরি ক্লায়েন্টকে ই-মেইল করুন।"],
    ],
  },
  tpl: {
    eyebrow: "টেমপ্লেট",
    h2: "আপনার পেশার জন্য তৈরি চালান।",
    lead: "কনট্রাক্টর টেমপ্লেট খুললেই শ্রম ও উপকরণ আলাদা করা থাকে; কনসাল্টিং টেমপ্লেট আপনার রেট ধরে তারিখসহ ঘণ্টা হিসাব করে; ক্লিনিং টেমপ্লেট সেবার মেয়াদ ও কত ঘন ঘন যাবেন তা লেখে।",
  },
  faq: {
    eyebrow: "সাধারণ প্রশ্ন",
    h2: "প্রশ্নের উত্তর।",
    items: [
      ["BillCrafter কি বিনামূল্যে?", "হ্যাঁ, পুরোপুরি। কোনো পেইড প্ল্যান নেই। অ্যাকাউন্ট ছাড়া প্রতিদিন ১টি PDF রপ্তানি করা যায়; বিনামূল্যের অ্যাকাউন্টে রপ্তানি ও সব সুবিধা — স্টেটাস সিল, শেয়ার লিঙ্ক, পুনরাবৃত্ত চালান, ই-স্বাক্ষর ও ই-মেইলে পাঠানো — সীমাহীন।"],
      ["ব্যবহার করতে কি অ্যাকাউন্ট খুলতে হবে?", "না। পাতা লোড হওয়ার সঙ্গে সঙ্গেই এডিটর কাজ করে — অ্যাকাউন্ট লাগে না, কার্ড লাগে না, কিছু ইনস্টলও করতে হয় না। সাইন আপ ছাড়াই প্রতিদিন একটি পূর্ণ চালান বানিয়ে ১টি PDF নামিয়ে নিতে পারেন। বিনামূল্যের অ্যাকাউন্টে সীমা উঠে যায় এবং যুক্ত হয় সংরক্ষিত ইতিহাস ও ক্লায়েন্ট তালিকা — যখন দরকার তখন নেবেন, শুরুর আগে নয়।"],
      ["আমার চালানে কি জলছাপ বা BillCrafter-এর ব্র্যান্ডিং থাকবে?", "না। কোনো প্ল্যানেই আপনার নথিতে আমরা কিছু যোগ করি না — জলছাপ নেই, আমাদের লোগো নেই, «দিয়ে তৈরি» ধরনের কোনো লাইনও নেই। PDF-এ কেবল আপনি যা রেখেছেন তা-ই থাকে। পরিশোধিত / অপরিশোধিত সিল বিনামূল্যের অ্যাকাউন্টে আপনি নিজে চালু করেন — সেটি আমাদের ব্র্যান্ডিং নয়।"],
      ["চালান কোন ফরম্যাটে ডাউনলোড হয়?", "PDF — একটিই ফরম্যাট, তবে নিখুঁতভাবে। প্রতিটি চালান নিখুঁত PDF হিসেবে রপ্তানি ও এক ক্লিকে প্রিন্ট করা যায়, যেকোনো ডিভাইসে, কিছু ইনস্টল না করেই। PDF ক্লায়েন্টের স্ক্রিনে ও প্রিন্টারে বিন্যাস একই রাখে — তবে সাধারণ PDF পরিবর্তন-রোধী নয়, তাই রেকর্ড হিসেবে নিজের একটি কপি রেখে দিন। একটি রঙ ও ৮টি বিন্যাসের একটি বেছে নিয়ে নিজের মতো সাজান।"],
      ["ক্লায়েন্ট কি BillCrafter দিয়ে অনলাইনে টাকা দিতে পারবে?", "না — BillCrafter নথি বানায়, লেনদেন করে না। আপনি নিজের পেমেন্ট তথ্য বসান: ব্যাংক হিসাব, বিকাশ বা নগদের নম্বর, PayPal বা Stripe লিঙ্ক, কিংবা QR সহ ক্রিপ্টো ওয়ালেট ঠিকানা। টাকা সরাসরি আপনার কাছেই যায় — আমরা কখনো তা ছুঁই না, কোনো লেনদেন ফিও নিই না।"],
      ["চালান কি ক্লায়েন্টকে ই-মেইলে পাঠানো যায়?", "হ্যাঁ, বিনামূল্যের অ্যাকাউন্ট থাকলে। চালানটি PDF সংযুক্তি হিসেবে যায় এবং উত্তর আসে আপনার নিজের ঠিকানাতেই। পাঠানো বিনামূল্যে এবং কোনো সীমা নেই।"],
      ["ভিন্ন মুদ্রায় বিদেশি ক্লায়েন্টকে চালান দেওয়া যায়?", "হ্যাঁ। ২৫টির বেশি মুদ্রা রয়েছে — টাকা, ডলার, ইউরো, পাউন্ড, রুপি ও আরও অনেক — সঙ্গে USDT ও USDC, যদি স্টেবলকয়েনে পেমেন্ট নেন। সংখ্যার বিন্যাস ও করের নাম আপনার বেছে নেওয়া বাজার অনুযায়ী বদলায়, তাই বাংলাদেশের চালানে «ভ্যাট» আর সুইডেনেরটিতে «Moms» দেখাবে।"],
      ["ভ্যাট যোগ করা যাবে?", "হ্যাঁ। হার বসান এবং কোন লাইনে কর বসবে তা আলাদা করে চিহ্নিত করুন। বাংলাদেশে মূসকের আদর্শ হার ১৫ %, তবে অনেক সেবার জন্য কমানো হার প্রযোজ্য। একটি জরুরি কথা: নিবন্ধিত প্রতিষ্ঠানের জন্য মূসক চালান NBR-নির্ধারিত মুসক-৬.৩ ফরমে দিতে হয়, এবং এখানে তৈরি PDF সেটির বিকল্প নয়। BillCrafter দিয়ে বিল করুন ও হিসাব রাখুন, আর করের অংশটি হিসাবরক্ষক বা এনবিআর-এর নির্দেশনা অনুযায়ী মেলান।"],
      ["ফোনে BillCrafter ব্যবহার করা যাবে?", "হ্যাঁ। এটি মোবাইল ব্রাউজারেই চলে, তাই ফোন বা ট্যাব থেকেই চালান পূরণ করে PDF নামিয়ে ই-মেইল করে দিতে পারেন। কিছু ইনস্টল করতে হয় না, অ্যাপ স্টোরেরও দরকার নেই।"],
      ["চালান দিতে নিবন্ধিত ব্যবসা থাকতে হবে?", "না। ফ্রিল্যান্সার ও স্বনিয়োজিত ব্যক্তিরা নিজের নাম ও ঠিকানায় চালান দিতে পারেন। থাকলে ব্যবসার নিবন্ধন বা কর শনাক্তকরণ নম্বর দিন; জাতীয় পরিচয়পত্রের মতো সংবেদনশীল তথ্য চালানে দেবেন না।"],
      ["চালান ও রসিদের পার্থক্য কী?", "চালান হলো পরিশোধের আগে পাঠানো অর্থ দাবির নথি। রসিদ পরিশোধের পর তা নিশ্চিত করে। BillCrafter-এ চালান, প্রাক্কলন, দরপত্র ও রসিদ — সবই আছে।"],
      ["পরিশোধের সময়সীমা কত রাখা উচিত?", "অধিকাংশ ফ্রিল্যান্সার ও ছোট ব্যবসার জন্য ১৪ বা ১৫ দিন যুক্তিসঙ্গত। ৩০ দিন বরং পুরোনো ক্লায়েন্ট বা বড় B2B চুক্তির জন্য রাখুন।"],
      ["আমার তথ্য কি গোপন থাকে?", "আপনি নিজে অ্যাকাউন্টে সংরক্ষণ করার সিদ্ধান্ত না নেওয়া পর্যন্ত খসড়াটি আপনার ব্রাউজারেই থাকে। সংরক্ষিত তথ্য এনক্রিপ্ট করা, এবং যেকোনো সময় রপ্তানি বা মুছে ফেলা যায়।"],
    ],
    still: "আরও প্রশ্ন আছে? লিখুন",
  },
  tr: {
    eyebrow: "ছোট ব্যবসার ভরসা",
    h2: "পেশাদার চালান, যথাযথ গুরুত্বে।",
    items: [["বিনামূল্যে", "ডাউনলোডে নিবন্ধন লাগে না"], ["PDF", "নিখুঁত রপ্তানি"], ["৪৫", "চালান টেমপ্লেট"], ["গোপনীয়", "এনক্রিপ্টেড, কখনও বিক্রি নয়"]],
  },
};

M.ko = {
  feat: {
    eyebrow: "왜 BillCrafter인가",
    h2: "지금 하나 만들어 보세요. 로그인하면 그대로 보관됩니다.",
    lead: "무엇을 결정하기 전에 먼저 써보세요 — 기억하는 일은 계정이 맡습니다.",
    cards: [
      ["1 · 첫 청구서는 무료", "지금 바로 문서 위에 입력해 보세요. 계정도, 카드도, 설치도 필요 없습니다. 정보를 채우고 2분 안에 깔끔한 PDF를 내려받으세요. 계정 없이도 하루 1회 무료로 내보낼 수 있습니다."],
      ["2 · 로그인하면 자동 저장", "무료 계정은 사업자 정보와 거래처, 지난 청구서를 모두 클라우드에 보관합니다. 다음 청구서는 어떤 기기에서든 몇 초면 끝납니다. 계정이 있으면 내보내기가 무료이고 무제한입니다."],
      ["3 · 그 업종이 실제로 청구하는 항목", "인건비와 자재비를 나누고, 날짜별 항목으로 시간당 청구하고, 착수금을 요청하고, 완료된 작업 사진을 청구서에 바로 넣으세요. 여덟 가지 레이아웃의 45가지 서식이 필요한 항목을 갖춘 채로 열립니다."],
    ],
    browse: "서식 목록 보기",
  },
  step: {
    eyebrow: "이용 방법",
    h2: "대금을 받기까지, 세 단계.",
    items: [
      ["청구서에 바로 입력", "사업자 정보와 거래처, 항목을 문서에 그대로 입력하세요. 합계와 세액은 입력하는 즉시 계산됩니다."],
      ["원하는 대로 꾸미고 확인", "로고를 올리고 여덟 가지 레이아웃과 색상을 고르세요. 화면에 보이는 그대로 내려받습니다."],
      ["내려받거나 보내기", "깔끔한 PDF로 내려받거나, 로그인해 거래처에 바로 이메일로 보내세요."],
    ],
  },
  tpl: {
    eyebrow: "서식",
    h2: "업종에 맞춰 만든 청구서.",
    lead: "시공 서식을 열면 인건비와 자재비가 이미 나뉘어 있고, 컨설팅 서식은 요율에 따라 날짜별 시간을 청구하며, 청소 서식은 서비스 기간과 방문 주기를 명시합니다.",
  },
  faq: {
    eyebrow: "자주 묻는 질문",
    h2: "궁금한 점에 답합니다.",
    items: [
      ["BillCrafter는 무료인가요?", "네, 완전히 무료입니다. 유료 요금제는 없습니다. 계정 없이 하루 1회 PDF를 내보낼 수 있고, 무료 계정이 있으면 내보내기와 모든 기능(상태 도장, 공유 링크, 반복 청구서, 전자 서명, 이메일 발송)을 제한 없이 사용할 수 있습니다."],
      ["사용하려면 계정을 만들어야 하나요?", "아니요. 페이지가 열리는 즉시 편집기가 동작합니다. 계정도, 카드도, 설치할 것도 없습니다. 가입 없이도 청구서를 끝까지 작성하고 하루 1회 PDF로 내려받을 수 있습니다. 무료 계정을 만들면 횟수 제한이 없어지고 저장된 이력과 거래처 목록이 더해집니다. 필요할 때 만들면 되고, 시작 전에 요구하지 않습니다."],
      ["청구서에 워터마크나 BillCrafter 로고가 찍히나요?", "아니요. 어떤 요금제에서도 문서에 무언가를 덧붙이지 않습니다. 워터마크도, 저희 로고도, «○○로 제작» 같은 문구도 없습니다. PDF에는 직접 넣은 내용만 담깁니다. 결제완료 / 미결제 도장은 무료 계정에서 직접 켜는 기능이지 저희 브랜딩이 아닙니다."],
      ["청구서는 어떤 형식으로 내려받나요?", "PDF 한 가지, 대신 제대로. 모든 청구서를 정확한 PDF로 내보내고 원클릭으로 인쇄할 수 있으며, 어떤 기기에서든 열리고 설치할 프로그램도 없습니다. PDF는 고객의 화면과 프린터에서 레이아웃을 그대로 유지하지만, 일반 PDF가 위변조 방지 문서는 아니므로 기록용 사본을 직접 보관하세요. 강조 색상과 8가지 레이아웃 중 하나를 골라 나만의 문서로 만드세요."],
      ["거래처가 BillCrafter에서 바로 온라인 결제를 할 수 있나요?", "아니요. BillCrafter는 문서를 만들 뿐 결제는 처리하지 않습니다. 대신 본인의 수금 정보를 적어 넣습니다. 계좌이체용 은행 계좌, 카카오페이나 토스 링크, PayPal·Stripe 링크, 또는 QR 코드가 있는 암호화폐 지갑 주소를 넣을 수 있습니다. 돈은 곧바로 본인에게 들어오고, 저희는 그 돈에 손대지도 수수료를 떼지도 않습니다."],
      ["청구서를 거래처에 이메일로 보낼 수 있나요?", "네, 무료 계정이 있으면 됩니다. PDF 첨부로 발송되고 답장은 본인 메일함으로 옵니다. 발송은 무료이며 횟수 제한이 없습니다."],
      ["해외 거래처에 다른 통화로 청구할 수 있나요?", "네. 원화, 달러, 유로, 엔, 위안 등 25가지가 넘는 통화를 지원하고, 스테이블코인으로 받는다면 USDT와 USDC도 쓸 수 있습니다. 숫자 표기와 세금 명칭은 선택한 시장을 따라가므로 한국 청구서에는 «부가세», 일본 청구서에는 «消費税»가 표시됩니다."],
      ["부가세를 넣을 수 있나요?", "네. 세율을 입력하고 어떤 항목이 과세 대상인지 줄 단위로 표시하면 됩니다. 한국의 부가가치세는 10 %이며, 간이과세자인지 일반과세자인지에 따라 취급이 달라집니다. 중요한 점 하나: 세금계산서는 국세청 홈택스를 통해 전자세금계산서로 발급해야 하며, 여기서 만든 PDF는 그 대체물이 아닙니다. 청구와 기록 관리에 BillCrafter를 쓰시고, 세금계산서 발급은 홈택스에서 처리하거나 세무 담당자와 확인하세요."],
      ["휴대폰에서도 쓸 수 있나요?", "네. 모바일 브라우저에서 그대로 동작하므로 휴대폰이나 태블릿으로 청구서를 작성하고 PDF를 내려받아 메일로 보낼 수 있습니다. 설치할 것도, 앱스토어를 거칠 일도 없습니다."],
      ["청구서를 보내려면 사업자 등록이 필요한가요?", "아니요. 프리랜서와 개인사업자는 본인 이름과 주소로 청구할 수 있습니다. 사업자등록번호가 있다면 함께 적어 주세요. 주민등록번호 같은 민감한 정보는 청구서에 넣지 마세요."],
      ["청구서와 영수증의 차이는 무엇인가요?", "청구서는 결제 전에 보내는 대금 청구 문서이고, 영수증은 결제가 끝난 뒤 이를 확인해 주는 문서입니다. BillCrafter는 청구서, 견적서, 견적 제안, 영수증을 모두 지원합니다."],
      ["결제 기한은 얼마로 하는 게 좋을까요?", "대부분의 프리랜서와 소규모 사업자에게는 14일이나 15일이 적당합니다. 30일은 오래 거래한 고객이나 규모가 큰 B2B 계약에 쓰세요."],
      ["제 데이터는 안전한가요?", "작성 중인 문서는 계정에 저장하기로 선택할 때까지 브라우저에만 남습니다. 저장된 데이터는 암호화되며, 언제든 내보내거나 삭제할 수 있습니다."],
    ],
    still: "더 궁금한 점이 있으면 이메일로 문의하세요:",
  },
  tr: {
    eyebrow: "소규모 사업자가 선택합니다",
    h2: "전문적인 청구서, 제대로 다룹니다.",
    items: [["무료", "가입 없이 내려받기"], ["PDF", "정확한 내보내기"], ["45", "청구서 서식"], ["비공개", "암호화, 절대 판매 없음"]],
  },
};

M.nl = {
  feat: {
    eyebrow: "Waarom BillCrafter",
    h2: "Maak er nu een. Meld je aan om hem te bewaren.",
    lead: "Probeer het eerst en beslis daarna — het onthouden doet je account.",
    cards: [
      ["1 · Je eerste factuur is gratis", "Begin nu direct in het document te typen: geen account, geen kaart, niets te installeren. Vul je gegevens in en download binnen twee minuten een verzorgde pdf. Zonder account krijg je 1 gratis export per dag."],
      ["2 · Meld je aan en het is bewaard", "Een gratis account bewaart je bedrijfsgegevens, klanten en al je eerdere facturen in de cloud — de volgende kost dan seconden, op elk apparaat. Met een account is exporteren gratis en onbeperkt."],
      ["3 · De velden waarop jouw vak echt factureert", "Scheid arbeid van materiaal, factureer per uur met gedateerde regels, vraag een aanbetaling, of zet foto’s van het afgeronde werk op de factuur zelf. De 45 sjablonen in acht lay-outs openen al met de juiste velden."],
    ],
    browse: "Bekijk de bibliotheek",
  },
  step: {
    eyebrow: "Hoe het werkt",
    h2: "In drie stappen naar een betaalde factuur.",
    items: [
      ["Typ op de factuur", "Vul je bedrijf, je klant en de regels rechtstreeks in het document in. Totalen en btw worden live berekend terwijl je typt."],
      ["Pas aan en bekijk", "Upload je logo en kies een van de acht lay-outs en een kleur — de factuur die je ziet is exact wat je downloadt."],
      ["Download of verstuur", "Download een schone pdf, of meld je aan en mail hem direct naar je klant."],
    ],
  },
  tpl: {
    eyebrow: "Templates",
    h2: "Een factuur gebouwd voor jouw vak.",
    lead: "Open het aannemerssjabloon en arbeid staat al los van materiaal; dat voor advieswerk factureert gedateerde uren tegen je tarief; dat voor schoonmaak vermeldt de periode en hoe vaak je komt.",
  },
  faq: {
    eyebrow: "Veelgestelde vragen",
    h2: "Vragen, beantwoord.",
    items: [
      ["Is BillCrafter gratis?", "Ja, volledig. Er zijn geen betaalde plannen. Zonder account kun je 1 pdf per dag exporteren; met een gratis account zijn exports en alle functies — statusstempels, deellinks, terugkerende facturen, e-handtekening en verzenden per e-mail — onbeperkt."],
      ["Moet ik een account aanmaken om het te gebruiken?", "Nee. De editor werkt zodra de pagina laadt: geen account, geen kaart, niets te installeren. Je kunt een volledige factuur invullen en 1 pdf per dag downloaden zonder je aan te melden. Een gratis account heft die limiet op en voegt bewaarde historie en je klantenlijst toe; het staat klaar wanneer je het wilt, niet daarvoor."],
      ["Komt er een watermerk of BillCrafter-logo op mijn factuur?", "Nee. In geen enkel plan voegen we iets aan je document toe: geen watermerk, geen logo, geen « gemaakt met »-regel. De pdf bevat alleen wat jij erin zet. De optionele stempels BETAALD / ONBETAALD zet je zelf aan met een gratis account; het is geen branding van ons."],
      ["In welk formaat wordt de factuur gedownload?", "Als pdf — één formaat, maar goed gedaan. Elk plan exporteert een pixelnauwkeurige pdf die met één klik print, op elk apparaat en zonder iets te installeren. Een pdf kan na verzending ook niet stiekem worden aangepast — precies wat je wilt bij een document over geld. Kies een accentkleur en een van de 8 lay-outs om hem eigen te maken."],
      ["Kan mijn klant de factuur online betalen via BillCrafter?", "Nee — BillCrafter maakt het document, het verwerkt geen betalingen. Je zet er je eigen betaalgegevens in: je IBAN voor een overboeking, een Tikkie-, PayPal- of Stripe-link, of een wallet-adres met QR-code. Het geld komt rechtstreeks bij jou binnen; wij raken het nooit aan en rekenen geen transactiekosten."],
      ["Kan ik de factuur naar mijn klant mailen?", "Ja, met een gratis account. Hij gaat als pdf-bijlage de deur uit en antwoorden komen op je eigen adres binnen. Verzenden is gratis en onbeperkt."],
      ["Kan ik buitenlandse klanten in een andere valuta factureren?", "Ja. Er zijn meer dan 25 valuta’s — euro, dollar, pond, Zwitserse frank en meer — plus USDT en USDC als je in stablecoins betaald wordt. De getalnotatie en het woord voor de belasting volgen de gekozen markt: een Nederlandse factuur toont « Btw », een Zweedse « Moms »."],
      ["Kan ik btw toevoegen?", "Ja. Vul het tarief in en geef per regel aan wat belast is. In Nederland is het algemene tarief 21 %, met 9 % verlaagd en 0 % voor bepaalde leveringen. Val je onder de kleineondernemersregeling, dan breng je geen btw in rekening en vermeld je dat op de factuur — het notitieveld is daarvoor bedoeld. Zet ook je KvK-nummer en btw-identificatienummer erop, want die zijn verplicht op een Nederlandse factuur. Twijfel je over je situatie, overleg dan met je boekhouder of de Belastingdienst."],
      ["Kan ik BillCrafter op mijn telefoon gebruiken?", "Ja. Het draait in de mobiele browser, dus je vult de factuur in, downloadt de pdf en mailt hem vanaf je telefoon of tablet. Er is niets te installeren en er komt geen appstore aan te pas."],
      ["Heb ik een ingeschreven bedrijf nodig om te factureren?", "Nee. Freelancers en zzp’ers kunnen op eigen naam en adres factureren. Vermeld je KvK- en btw-nummer als je die hebt, en zet geen gevoelige persoonsgegevens op een factuur."],
      ["Wat is het verschil tussen een factuur en een kwitantie?", "Een factuur is een betalingsverzoek dat je vóór de betaling stuurt. Een kwitantie bevestigt de betaling nadat die is gedaan. BillCrafter ondersteunt facturen, kostenramingen, offertes en kwitanties."],
      ["Welke betaaltermijn is gebruikelijk?", "14 of 15 dagen is een verstandig uitgangspunt voor de meeste freelancers en kleine bedrijven. Houd 30 dagen voor vaste klanten of grotere B2B-contracten."],
      ["Zijn mijn gegevens privé?", "Je concept blijft in je browser totdat je hem zelf in een account opslaat. Opgeslagen gegevens zijn versleuteld en je kunt ze altijd exporteren of verwijderen."],
    ],
    still: "Nog een vraag? Mail naar",
  },
  tr: {
    eyebrow: "Gebruikt door kleine bedrijven",
    h2: "Professionele facturen, serieus aangepakt.",
    items: [["Gratis", "downloaden zonder aanmelden"], ["PDF", "pixelnauwkeurige export"], ["45", "factuurtemplates"], ["Privé", "versleuteld, nooit verkocht"]],
  },
};

M.id = {
  feat: {
    eyebrow: "Mengapa BillCrafter",
    h2: "Buat satu sekarang. Masuk untuk menyimpannya.",
    lead: "Coba dulu sebelum memutuskan apa pun — biar akun yang mengingat semuanya.",
    cards: [
      ["1 · Faktur pertama gratis", "Mulai mengetik langsung di dokumen sekarang: tanpa akun, tanpa kartu, tanpa memasang apa pun. Isi data Anda dan unduh PDF yang rapi dalam waktu kurang dari dua menit. Tanpa akun, Anda mendapat 1 ekspor gratis per hari."],
      ["2 · Masuk dan otomatis tersimpan", "Akun gratis menyimpan data usaha, klien, dan seluruh faktur lama Anda di cloud — jadi faktur berikutnya hanya perlu beberapa detik, dari perangkat mana saja. Dengan akun, ekspor gratis dan tanpa batas."],
      ["3 · Kolom yang benar-benar dipakai bidang Anda", "Pisahkan upah dari bahan, tagih per jam dengan entri bertanggal, minta uang muka, atau pasang foto pekerjaan yang selesai di fakturnya langsung. 45 templat dalam delapan tata letak sudah terbuka dengan kolom yang tepat."],
    ],
    browse: "Lihat pustaka templat",
  },
  step: {
    eyebrow: "Cara kerjanya",
    h2: "Tiga langkah sampai faktur dibayar.",
    items: [
      ["Ketik langsung di faktur", "Isi data usaha, klien, dan baris item langsung di dokumen. Total dan pajak dihitung otomatis saat Anda mengetik."],
      ["Sesuaikan dan tinjau", "Unggah logo, pilih satu dari delapan tata letak dan sebuah warna — faktur yang Anda lihat sama persis dengan yang diunduh."],
      ["Unduh atau kirim", "Unduh PDF yang bersih, atau masuk lalu kirim langsung ke email klien."],
    ],
  },
  tpl: {
    eyebrow: "Templat",
    h2: "Faktur yang dibuat untuk bidang Anda.",
    lead: "Buka templat kontraktor dan upah sudah terpisah dari bahan; templat konsultan menagih jam bertanggal sesuai tarif Anda; templat kebersihan mencantumkan periode dan seberapa sering Anda datang.",
  },
  faq: {
    eyebrow: "Pertanyaan umum",
    h2: "Pertanyaan, dijawab.",
    items: [
      ["Apakah BillCrafter gratis?", "Ya, sepenuhnya. Tidak ada paket berbayar. Tanpa akun Anda bisa mengekspor 1 PDF per hari; dengan akun gratis, ekspor dan semua fitur — cap status, tautan berbagi, faktur berulang, tanda tangan elektronik, dan kirim lewat email — tanpa batas."],
      ["Apakah saya harus membuat akun untuk memakainya?", "Tidak. Editornya jalan begitu halaman terbuka: tanpa akun, tanpa kartu, tanpa memasang apa pun. Anda bisa mengisi faktur sampai selesai dan mengunduh 1 PDF per hari tanpa mendaftar. Akun gratis menghapus batas itu serta menambahkan riwayat tersimpan dan daftar klien — tersedia saat Anda membutuhkannya, bukan syarat untuk memulai."],
      ["Apakah faktur saya diberi tanda air atau merek BillCrafter?", "Tidak. Di paket mana pun kami tidak menambahkan apa pun ke dokumen Anda: tanpa tanda air, tanpa logo kami, tanpa baris « dibuat dengan ». PDF hanya berisi apa yang Anda tulis. Cap LUNAS / BELUM DIBAYAR Anda nyalakan sendiri dengan akun gratis, bukan penanda merek kami."],
      ["Faktur diunduh dalam format apa?", "PDF — satu format, tapi dikerjakan dengan benar. Setiap faktur diekspor sebagai PDF yang presisi dan dapat dicetak sekali klik, di perangkat apa pun dan tanpa memasang apa-apa. PDF menjaga tata letak tetap sama di layar dan printer klien — tetapi PDF biasa tidak antirekayasa, jadi simpan salinan Anda sendiri sebagai arsip. Pilih warna aksen dan satu dari 8 tata letak untuk menyesuaikannya."],
      ["Bisakah klien membayar faktur secara online lewat BillCrafter?", "Tidak — BillCrafter membuat dokumennya, bukan memproses pembayaran. Anda mencantumkan detail penerimaan sendiri: rekening bank untuk transfer, nomor e-wallet seperti GoPay atau OVO, tautan PayPal atau Stripe, atau alamat dompet kripto berikut kode QR. Uangnya langsung masuk ke Anda; kami tidak pernah memegangnya dan tidak memungut biaya transaksi."],
      ["Bisakah faktur dikirim ke email klien?", "Bisa, dengan akun gratis. Faktur dikirim sebagai lampiran PDF dan balasan masuk ke alamat email Anda sendiri. Pengiriman gratis dan tanpa batas."],
      ["Bisakah menagih klien luar negeri dalam mata uang lain?", "Bisa. Tersedia lebih dari 25 mata uang — rupiah, dolar, euro, poundsterling, dan lainnya — ditambah USDT dan USDC bila Anda dibayar dengan stablecoin. Format angka dan istilah pajaknya mengikuti pasar yang Anda pilih, jadi faktur Indonesia menampilkan « PPN » sementara faktur Swedia menampilkan « Moms »."],
      ["Bisakah menambahkan PPN?", "Bisa. Isikan tarifnya dan tandai baris mana yang kena pajak. Gunakan tarif PPN yang berlaku saat ini sesuai ketentuan DJP, karena tarifnya pernah berubah. Satu hal penting: bagi Pengusaha Kena Pajak, faktur pajak wajib diterbitkan melalui aplikasi e-Faktur, dan PDF yang dibuat di sini bukan penggantinya. Pakai BillCrafter untuk menagih dan menyimpan catatan, lalu urus faktur pajaknya sesuai aturan DJP atau tanyakan ke konsultan pajak Anda."],
      ["Bisakah BillCrafter dipakai di ponsel?", "Bisa. Semuanya berjalan di peramban ponsel, jadi Anda dapat mengisi faktur, mengunduh PDF, dan mengirimkannya lewat email dari ponsel atau tablet. Tidak ada yang perlu dipasang dan tidak perlu lewat toko aplikasi."],
      ["Apakah saya perlu badan usaha resmi untuk menerbitkan faktur?", "Tidak. Pekerja lepas dan wirausaha perorangan dapat menagih dengan nama dan alamat sendiri. Cantumkan NPWP jika ada, dan jangan mencantumkan data pribadi sensitif seperti NIK pada faktur."],
      ["Apa bedanya faktur dan kwitansi?", "Faktur adalah permintaan pembayaran yang dikirim sebelum pembayaran. Kwitansi menegaskan bahwa pembayaran sudah diterima. BillCrafter mendukung faktur, estimasi, penawaran, dan kwitansi."],
      ["Berapa lama sebaiknya tempo pembayaran?", "14 atau 15 hari adalah pilihan yang wajar bagi sebagian besar pekerja lepas dan usaha kecil. Simpan tempo 30 hari untuk klien lama atau kontrak B2B yang lebih besar."],
      ["Apakah data saya aman?", "Draf Anda tetap berada di peramban sampai Anda memilih menyimpannya ke akun. Data yang tersimpan dienkripsi, dan Anda bisa mengekspor atau menghapusnya kapan saja."],
    ],
    still: "Masih ada pertanyaan? Kirim email ke",
  },
  tr: {
    eyebrow: "Dipakai usaha kecil",
    h2: "Faktur profesional, digarap serius.",
    items: [["Gratis", "unduh tanpa mendaftar"], ["PDF", "ekspor presisi"], ["45", "templat faktur"], ["Privat", "terenkripsi, tidak pernah dijual"]],
  },
};

M.ja = {
  feat: {
    eyebrow: "BillCrafter を選ぶ理由",
    h2: "まず1枚作ってみる。ログインすればそのまま保存。",
    lead: "何かを決める前に、まず試してください。覚えておく作業はアカウントに任せましょう。",
    cards: [
      ["1 · 最初の請求書は無料", "いますぐ書類の上に直接入力できます。アカウントもクレジットカードもインストールも不要。必要事項を入れれば、2分以内に整った PDF をダウンロードできます。アカウントなしでも1日1回、無料で書き出せます。"],
      ["2 · ログインすれば自動で保存", "無料アカウントなら、自社情報・取引先・過去の請求書をすべてクラウドに保存。次回はどの端末からでも数秒で作成できます。アカウントがあれば書き出しは無料・無制限です。"],
      ["3 · その業種が実際に請求する項目", "手間と材料を分けて記載する、日付入りの明細で時間単位に請求する、着手金を求める、完工写真を請求書そのものに載せる。8種類のレイアウト・45種類のテンプレートは、必要な項目をあらかじめ備えた状態で開きます。"],
    ],
    browse: "テンプレート集を見る",
  },
  step: {
    eyebrow: "使い方",
    h2: "入金までの3ステップ。",
    items: [
      ["請求書に直接入力する", "自社情報・取引先・明細を書類の上でそのまま入力します。合計と税額は入力に合わせてその場で計算されます。"],
      ["調整してプレビュー", "ロゴを追加し、8種類のレイアウトとアクセントカラーを選びます。画面に見えているものが、そのままダウンロードされます。"],
      ["ダウンロードまたは送信", "きれいな PDF をダウンロードするか、ログインして取引先へ直接メール送信できます。"],
    ],
  },
  tpl: {
    eyebrow: "テンプレート",
    h2: "あなたの業種のために作られた請求書。",
    lead: "工事用テンプレートを開けば手間と材料は最初から分かれ、コンサルティング用は日付入りの時間を単価で請求し、清掃用はサービス期間と訪問の頻度を明記します。",
  },
  faq: {
    eyebrow: "よくある質問",
    h2: "ご質問にお答えします。",
    items: [
      ["BillCrafter は無料ですか？", "はい、完全無料です。有料プランはありません。アカウントなしでは1日1回 PDF を書き出せます。無料アカウントを作れば、書き出しとすべての機能（ステータス印、共有リンク、定期請求書、電子署名、メール送信）を無制限にご利用いただけます。"],
      ["利用するにはアカウント登録が必要ですか？", "いいえ。ページを開いた瞬間からエディタが使えます。アカウントもカードもインストールも不要です。登録しないまま請求書を最後まで作成し、1日1回 PDF をダウンロードできます。無料アカウントを作ると回数制限がなくなり、保存された履歴と取引先リストが加わります。必要になったときに作れば十分で、始める前に求めることはありません。"],
      ["請求書に透かしや BillCrafter のロゴは入りますか？", "いいえ。どのプランでも、あなたの書類に何かを足すことはありません。透かしも、当社のロゴも、「○○で作成」といった一行もありません。PDF に載るのは、あなたが入力したものだけです。支払済／未払のスタンプは無料アカウントでご自身が有効にする機能であり、当社のブランド表示ではありません。"],
      ["請求書はどの形式でダウンロードされますか？", "PDF の一本化です。どの請求書もレイアウトに忠実な PDF で書き出せ、ワンクリックで印刷でき、どの端末でも開けてインストールも要りません。PDF なら取引先の画面でも印刷でも体裁が崩れませんが、通常の PDF は改ざん防止ではないため、控えはご自身で保管してください。アクセントカラーと8種類のレイアウトから選んで、自社らしい体裁に整えられます。"],
      ["取引先は BillCrafter 上でオンライン決済できますか？", "いいえ。BillCrafter は書類を作るツールで、決済は扱いません。代わりに、ご自身の入金情報を書き入れます。銀行振込の口座、PayPal や Stripe のリンク、QR コード付きの暗号資産ウォレットアドレスなどです。お金は直接あなたに入り、当社が預かることも、手数料を差し引くこともありません。"],
      ["請求書を取引先にメールで送れますか？", "はい、無料アカウントがあれば送れます。PDF 添付で送信され、返信はあなた自身のメールアドレスに届きます。送信は無料で、回数の上限もありません。"],
      ["海外の取引先に別の通貨で請求できますか？", "できます。円・ドル・ユーロ・ポンド・人民元など25以上の通貨に対応し、ステーブルコインで受け取る場合は USDT と USDC も使えます。数字の表記と税の呼び方は選んだ市場に合わせて変わるため、日本の請求書は「消費税」、スウェーデンのものは「Moms」と表示されます。"],
      ["消費税を追加できますか？", "はい。税率を入力し、どの明細が課税対象かを行ごとに指定できます。日本の標準税率は10 %、飲食料品などの軽減税率は8 %です。重要な点として、インボイス制度（適格請求書等保存方式）のもとで取引先が仕入税額控除を受けるには、適格請求書発行事業者の登録番号（T＋13桁）と、税率ごとに区分した対価の額・消費税額の記載が必要です。登録番号は自社情報の欄に入力し、税率が混在する場合は明細をセクションで分けてください。ご自身が要件を満たすかは、税理士か所轄の税務署にご確認ください。"],
      ["スマートフォンでも使えますか？", "はい。スマートフォンのブラウザでそのまま動くので、請求書の入力から PDF のダウンロード、メール送信までを携帯やタブレットで完結できます。インストールは不要で、アプリストアを経由することもありません。"],
      ["請求書を出すのに法人登記は必要ですか？", "いいえ。フリーランスや個人事業主は、ご自身の氏名と住所で請求できます。インボイス制度（適格請求書）に対応する場合は登録番号の記載が必要になるなど、要件は事業形態によって異なります。消費税の扱いを含め、判断に迷う場合は税理士にご確認ください。"],
      ["請求書と領収書の違いは何ですか？", "請求書は支払いの前に送る支払いのお願いです。領収書は支払いが済んだことを後から証明するものです。BillCrafter は請求書・見積書・御見積・領収書に対応しています。"],
      ["支払期限はどのくらいが適切ですか？", "日本では「月末締め翌月末払い」が広く使われています。フリーランスや小規模事業者どうしの取引では14日や15日も妥当です。長い期限は、取引実績のある相手や規模の大きな法人契約に向いています。"],
      ["データは非公開ですか？", "作成中の下書きは、ご自身がアカウントへ保存を選ぶまでブラウザ内に留まります。保存されたデータは暗号化され、いつでも書き出しや削除ができます。"],
    ],
    still: "解決しない場合はこちらへご連絡ください:",
  },
  tr: {
    eyebrow: "小規模事業者に選ばれています",
    h2: "プロ仕様の請求書を、まじめに。",
    items: [["無料", "登録なしでダウンロード"], ["PDF", "レイアウトに忠実な書き出し"], ["45", "種類の請求書テンプレート"], ["非公開", "暗号化・第三者提供なし"]],
  },
};

M.sv = {
  feat: {
    eyebrow: "Varför BillCrafter",
    h2: "Gör en nu. Logga in för att spara den.",
    lead: "Prova innan du bestämmer något — låt sedan kontot sköta minnet.",
    cards: [
      ["1 · Din första faktura är gratis", "Börja skriva direkt i dokumentet nu: inget konto, inget kort, inget att installera. Fyll i dina uppgifter och ladda ner en snygg PDF på under två minuter. Utan konto får du 1 gratis nedladdning per dag."],
      ["2 · Logga in och allt sparas", "Ett gratiskonto sparar dina företagsuppgifter, kunder och alla tidigare fakturor i molnet — nästa faktura tar sekunder, från vilken enhet som helst. Med konto är nedladdningar gratis och obegränsade."],
      ["3 · Fälten din bransch faktiskt fakturerar på", "Skilj arbete från material, fakturera per timme med daterade rader, begär handpenning, eller lägg foton på det färdiga jobbet på själva fakturan. De 45 mallarna i åtta layouter öppnas redan med rätt fält på plats."],
    ],
    browse: "Utforska mallbiblioteket",
  },
  step: {
    eyebrow: "Så funkar det",
    h2: "Tre steg till en betald faktura.",
    items: [
      ["Skriv direkt i fakturan", "Fyll i ditt företag, kunden och raderna direkt i dokumentet. Summor och moms räknas ut medan du skriver."],
      ["Anpassa och förhandsgranska", "Ladda upp din logotyp och välj en av åtta layouter och en färg — fakturan du ser är exakt den som laddas ner."],
      ["Ladda ner eller skicka", "Ladda ner en ren PDF, eller logga in och mejla den direkt till kunden."],
    ],
  },
  tpl: {
    eyebrow: "Mallar",
    h2: "En faktura byggd för din bransch.",
    lead: "Öppna hantverksmallen så är arbete redan skilt från material; konsultmallen fakturerar daterade timmar mot din taxa; städmallen anger perioden och hur ofta du kommer.",
  },
  faq: {
    eyebrow: "Vanliga frågor",
    h2: "Frågor och svar.",
    items: [
      ["Är BillCrafter gratis?", "Ja, helt. Det finns inga betalplaner. Utan konto kan du ladda ner 1 PDF per dag; med ett gratiskonto är nedladdningar och alla funktioner — statusstämplar, delningslänkar, återkommande fakturor, e-signatur och mejlutskick — obegränsade."],
      ["Måste jag skapa ett konto för att använda det?", "Nej. Redigeraren fungerar så snart sidan laddats: inget konto, inget kort, inget att installera. Du kan fylla i en komplett faktura och ladda ner 1 PDF per dag utan att registrera dig. Ett gratiskonto tar bort gränsen och lägger till sparad historik och din kundlista — det finns när du vill ha det, inte innan du börjar."],
      ["Får min faktura en vattenstämpel eller BillCrafters logotyp?", "Nej. I ingen plan lägger vi till något i ditt dokument: ingen vattenstämpel, ingen logotyp, ingen « skapad med »-rad. PDF:en innehåller bara det du själv skrivit in. Stämplarna BETALD / OBETALD slår du på själv med ett gratiskonto – de är ingen märkning från oss."],
      ["I vilket format laddas fakturan ner?", "Som PDF — ett format, ordentligt gjort. Varje faktura exporteras som en pixelexakt PDF som skrivs ut med ett klick, på alla enheter och utan något att installera. En PDF ser likadan ut på kundens skärm och skrivare — men en vanlig PDF är inte manipuleringssäker, så spara din egen kopia som underlag. Välj en accentfärg och en av 8 layouter för att göra fakturan till din egen."],
      ["Kan min kund betala fakturan online via BillCrafter?", "Nej — BillCrafter skapar dokumentet, det hanterar inte betalningar. Du fyller i dina egna betaluppgifter: bankgiro eller kontonummer, ett Swish-nummer, en PayPal- eller Stripe-länk, eller en plånboksadress med QR-kod. Pengarna går direkt till dig; vi rör dem aldrig och tar ingen transaktionsavgift."],
      ["Kan jag mejla fakturan till kunden?", "Ja, med ett gratiskonto. Den skickas som PDF-bilaga och svaren kommer till din egen adress. Utskick är gratis och obegränsade."],
      ["Kan jag fakturera utländska kunder i en annan valuta?", "Ja. Det finns över 25 valutor — kronor, euro, dollar, pund och fler — plus USDT och USDC om du får betalt i stablecoins. Sifferformat och ordet för skatten följer marknaden du väljer, så en svensk faktura visar « Moms » och en tysk « MwSt. »."],
      ["Kan jag lägga på moms?", "Ja. Ange satsen och markera rad för rad vad som är momspliktigt. I Sverige är normalsatsen 25 %, med 12 % för bland annat livsmedel och restaurang och 6 % för persontransport, böcker och kultur. Kom också ihåg att en svensk faktura ska innehålla ditt organisationsnummer och momsregistreringsnummer, och det är brukligt att ange att företaget är godkänt för F-skatt. Är du osäker på vad som gäller dig, stäm av med din redovisningskonsult eller Skatteverket."],
      ["Kan jag använda BillCrafter i mobilen?", "Ja. Allt fungerar i mobilens webbläsare, så du kan fylla i fakturan, ladda ner PDF:en och mejla den från telefon eller surfplatta. Det finns inget att installera och ingen appbutik inblandad."],
      ["Behöver jag ett registrerat företag för att fakturera?", "I Sverige krävs normalt en registrerad verksamhet — till exempel enskild firma med F-skatt — för att fakturera som näringsidkare, och du ska ange organisationsnummer samt momsregistreringsnummer om du är momsregistrerad. Saknar du eget företag kan egenanställningsföretag fakturera åt dig. Kontrollera vad som gäller för dig hos Skatteverket eller din revisor."],
      ["Vad är skillnaden mellan en faktura och ett kvitto?", "En faktura är en betalningsbegäran som skickas före betalning. Ett kvitto bekräftar betalningen efter att den gjorts. BillCrafter hanterar fakturor, kostnadsförslag, offerter och kvitton."],
      ["Hur långa betalningsvillkor bör jag ha?", "30 dagar är vanligast i Sverige, medan 14 dagar fungerar bra för mindre uppdrag. Enligt räntelagen har du rätt till dröjsmålsränta om betalningen uteblir — ange villkoren på fakturan så blir de tydliga från början."],
      ["Är mina uppgifter privata?", "Ditt utkast stannar i din webbläsare tills du väljer att spara det på ett konto. Sparade uppgifter är krypterade och du kan exportera eller radera dem när du vill."],
    ],
    still: "Har du fortfarande en fråga? Mejla",
  },
  tr: {
    eyebrow: "Används av småföretag",
    h2: "Professionella fakturor, på allvar.",
    items: [["Gratis", "ingen registrering för nedladdning"], ["PDF", "pixelexakt export"], ["45", "fakturamallar"], ["Privat", "krypterat, säljs aldrig"]],
  },
};

M.vi = {
  feat: {
    eyebrow: "Tại sao chọn BillCrafter",
    h2: "Tạo ngay một hóa đơn. Đăng nhập để lưu lại.",
    lead: "Dùng thử trước khi quyết định — sau đó để tài khoản ghi nhớ mọi thứ.",
    cards: [
      ["1 · Hóa đơn đầu tiên miễn phí", "Bắt đầu nhập ngay trên tài liệu — không cần tài khoản, không cần thẻ, không cần cài đặt gì. Điền thông tin của bạn và tải xuống file PDF chuyên nghiệp trong chưa đầy hai phút. Không cần tài khoản, bạn được 1 lượt tải miễn phí mỗi ngày."],
      ["2 · Đăng nhập để lưu lại", "Tài khoản miễn phí lưu thông tin doanh nghiệp, khách hàng và toàn bộ hóa đơn cũ trên đám mây — lần sau chỉ mất vài giây, từ bất kỳ thiết bị nào. Có tài khoản, lượt tải hoàn toàn miễn phí và không giới hạn."],
      ["3 · Những mục mà nghề của bạn thực sự xuất hóa đơn", "Tách nhân công khỏi vật tư, tính theo giờ với từng dòng ghi rõ ngày, yêu cầu đặt cọc, hoặc đưa ảnh công việc đã hoàn thành lên chính hóa đơn. 45 mẫu trên tám bố cục mở ra là đã có sẵn những mục cần thiết."],
    ],
    browse: "Xem thư viện mẫu",
  },
  step: {
    eyebrow: "Cách hoạt động",
    h2: "Ba bước để được thanh toán.",
    items: [
      ["Nhập ngay trên hóa đơn", "Điền thông tin doanh nghiệp, khách hàng và các mục chi tiết trực tiếp trên tài liệu. Tổng tiền và thuế tự động tính khi bạn nhập."],
      ["Tùy chỉnh & xem trước", "Tải lên logo, chọn một trong tám kiểu bố cục và một màu — hóa đơn bạn thấy chính là hóa đơn sẽ được tải xuống."],
      ["Tải xuống hoặc gửi đi", "Tải xuống file PDF sạch đẹp, hoặc đăng nhập để gửi thẳng đến email khách hàng."],
    ],
  },
  tpl: {
    eyebrow: "Mẫu hóa đơn",
    h2: "Hóa đơn được thiết kế riêng cho ngành của bạn.",
    lead: "Mở mẫu nhà thầu, nhân công đã tách khỏi vật tư; mẫu tư vấn tính giờ có ghi ngày theo đơn giá của bạn; mẫu vệ sinh ghi rõ kỳ dịch vụ và tần suất bạn đến.",
  },
  faq: {
    eyebrow: "Câu hỏi thường gặp",
    h2: "Giải đáp thắc mắc.",
    items: [
      ["BillCrafter có miễn phí không?", "Có, hoàn toàn miễn phí. Không có gói trả phí nào. Không cần tài khoản, bạn có thể tải 1 file PDF mỗi ngày; với tài khoản miễn phí, lượt tải và mọi tính năng — con dấu trạng thái, liên kết chia sẻ, hóa đơn định kỳ, chữ ký điện tử và gửi email — đều không giới hạn."],
      ["Tôi có cần tạo tài khoản để sử dụng không?", "Không. Trình chỉnh sửa hoạt động ngay khi trang tải xong — không cần tài khoản, không cần thẻ, không cần cài đặt gì. Bạn có thể điền đầy đủ một hóa đơn và tải xuống 1 file PDF mỗi ngày mà không cần đăng ký. Tài khoản miễn phí bỏ giới hạn đó và bổ sung lịch sử lưu trữ cùng danh sách khách hàng — có sẵn khi bạn cần, không bắt buộc ngay từ đầu."],
      ["Hóa đơn của tôi có bị đóng watermark hay gắn thương hiệu BillCrafter không?", "Không. Không có gì được thêm vào tài liệu của bạn ở bất kỳ gói nào — không watermark, không logo, không dòng chữ “tạo bằng”. File PDF chỉ chứa những gì bạn nhập vào. Con dấu ĐÃ THANH TOÁN / CHƯA THANH TOÁN (tùy chọn) do bạn tự bật khi có tài khoản miễn phí, không phải gắn thương hiệu."],
      ["Hóa đơn được tải xuống ở định dạng nào?", "PDF — một định dạng duy nhất, làm đúng chuẩn. Mọi hóa đơn đều xuất ra file PDF chính xác từng pixel, in được chỉ với một cú nhấp, trên mọi thiết bị, không cần cài đặt gì. PDF giữ bố cục giống hệt trên màn hình và máy in của khách hàng — nhưng PDF thông thường không chống chỉnh sửa, vì vậy hãy tự lưu một bản làm hồ sơ. Chọn một màu nhấn và một trong 8 kiểu bố cục để tạo phong cách riêng."],
      ["Khách hàng của tôi có thể thanh toán hóa đơn trực tuyến qua BillCrafter không?", "Không — BillCrafter chỉ tạo tài liệu, không xử lý thanh toán. Bạn tự điền thông tin thanh toán của mình: số tài khoản ngân hàng, liên kết PayPal hoặc Stripe, hoặc địa chỉ ví tiền mã hóa kèm mã QR quét được. Tiền chuyển thẳng đến bạn, chúng tôi không bao giờ chạm vào tiền của bạn hay thu phí giao dịch."],
      ["Tôi có thể gửi hóa đơn qua email cho khách hàng không?", "Có, với tài khoản miễn phí. Hóa đơn được gửi dưới dạng file PDF đính kèm và mọi phản hồi sẽ về thẳng email của bạn. Việc gửi hoàn toàn miễn phí và không giới hạn."],
      ["Tôi có thể lập hóa đơn cho khách hàng nước ngoài bằng loại tiền tệ khác không?", "Có. Có hơn 25 loại tiền tệ — bao gồm USD, EUR, VND, JPY và nhiều loại khác — cùng USDT và USDC nếu bạn được thanh toán bằng stablecoin. Định dạng số và cách gọi thuế sẽ theo thị trường bạn chọn, nên hóa đơn Việt Nam hiển thị “Thuế GTGT” còn hóa đơn Nhật hiển thị số yên nguyên, không có phần thập phân."],
      ["Tôi có thể thêm thuế GTGT không?", "Có. Nhập mức thuế suất và đánh dấu từng dòng mục nào chịu thuế. Tại Việt Nam, thuế suất phổ biến nhất là 10%, với một số nhóm hàng hóa/dịch vụ áp dụng 5% hoặc 0%. Nếu bạn thuộc diện không chịu thuế hoặc tính thuế theo phương pháp trực tiếp, hãy ghi rõ trong phần Ghi chú. Quy định cụ thể tùy theo loại hình kinh doanh — hãy kiểm tra với kế toán hoặc cơ quan thuế của bạn."],
      ["Tôi có thể dùng BillCrafter trên điện thoại không?", "Có. Mọi thứ đều hoạt động trên trình duyệt di động — bạn có thể điền hóa đơn, tải file PDF và gửi email ngay từ điện thoại hoặc máy tính bảng. Không cần cài đặt gì, không cần qua kho ứng dụng."],
      ["Tôi có cần đăng ký kinh doanh để xuất hóa đơn không?", "Không nhất thiết, với hóa đơn tự lập dùng để yêu cầu thanh toán. Freelancer và cá nhân kinh doanh nhỏ lẻ có thể lập hóa đơn dưới tên riêng của mình. Nếu bạn cần xuất hóa đơn giá trị gia tăng hợp lệ theo quy định của cơ quan thuế, hãy tham khảo ý kiến kế toán hoặc chi cục thuế địa phương."],
      ["Sự khác biệt giữa hóa đơn (invoice) và biên nhận (receipt) là gì?", "Hóa đơn là yêu cầu thanh toán được gửi trước khi nhận tiền. Biên nhận xác nhận đã nhận thanh toán sau đó. BillCrafter hỗ trợ hóa đơn, dự toán, báo giá và biên nhận."],
      ["Thời hạn thanh toán nên đặt bao lâu?", "14 ngày là lựa chọn hợp lý cho hầu hết freelancer và doanh nghiệp nhỏ. Có thể đặt 30 ngày với khách hàng lâu năm hoặc hợp đồng B2B lớn."],
      ["Dữ liệu của tôi có được bảo mật không?", "Bản nháp của bạn chỉ lưu trên trình duyệt cho đến khi bạn chọn lưu vào tài khoản. Dữ liệu đã lưu được mã hóa và bạn có thể xuất hoặc xóa bất cứ lúc nào."],
    ],
    still: "Còn thắc mắc khác? Hãy email tới",
  },
  tr: {
    eyebrow: "Được doanh nghiệp nhỏ tin dùng",
    h2: "Hóa đơn chuyên nghiệp, nghiêm túc.",
    items: [["Miễn phí", "không cần đăng ký để tải"], ["PDF", "xuất file chính xác từng pixel"], ["45", "mẫu hóa đơn"], ["Riêng tư", "mã hóa, không bao giờ bán dữ liệu"]],
  },
};

// Nav + footer chrome. Kept here rather than in lib/i18n.js's T map so all the
// prose added for full localization lives in one file.
//
// Industry names in the footer's Templates column (Freelance, Contractor, …) stay
// English on purpose: those pages are English-only, so an English label sets the
// right expectation about where the link goes.
const CHROME = {
  en: {
    nav: { features: "Features", guide: "Guide", about: "About" },
    foot: { product: "Product", templates: "Templates", company: "Company", legal: "Legal",
      invoiceGen: "Invoice generator", quoteGen: "Quote generator", estimateGen: "Estimate generator",
      receiptMaker: "Receipt maker", allTemplates: "All templates",
      browseAll: "Browse all →", about: "About", changelog: "Changelog", contact: "Contact & support", manager: "Invoice manager",
      login: "Log in", signup: "Sign up", terms: "Terms of Service", privacy: "Privacy Policy",
      termsShort: "Terms", privacyShort: "Privacy", contactShort: "Contact",
      rights: "© 2026 BillCrafter by CCC STUDIO. All rights reserved.", operated: "Operated by CCC STUDIO · United States" },
  },
  es: {
    nav: { features: "Funciones", guide: "Guía", about: "Nosotros" },
    foot: { product: "Producto", templates: "Plantillas", company: "Empresa", legal: "Legal",
      invoiceGen: "Generador de facturas", quoteGen: "Generador de cotizaciones", estimateGen: "Generador de presupuestos",
      receiptMaker: "Generador de recibos", allTemplates: "Todas las plantillas",
      browseAll: "Ver todas →", about: "Nosotros", changelog: "Novedades", contact: "Contacto y soporte", manager: "Gestor de facturas",
      login: "Iniciar sesión", signup: "Registrarse", terms: "Términos del servicio", privacy: "Política de privacidad",
      termsShort: "Términos", privacyShort: "Privacidad", contactShort: "Contacto",
      rights: "© 2026 BillCrafter de CCC STUDIO. Todos los derechos reservados.", operated: "Operado por CCC STUDIO · Estados Unidos" },
  },
  pt: {
    nav: { features: "Recursos", guide: "Guia", about: "Sobre" },
    foot: { product: "Produto", templates: "Modelos", company: "Empresa", legal: "Jurídico",
      invoiceGen: "Gerador de faturas", quoteGen: "Gerador de cotações", estimateGen: "Gerador de orçamentos",
      receiptMaker: "Gerador de recibos", allTemplates: "Todos os modelos",
      browseAll: "Ver todos →", about: "Sobre", changelog: "Novidades", contact: "Contato e suporte", manager: "Gerenciador de faturas",
      login: "Entrar", signup: "Criar conta", terms: "Termos de Serviço", privacy: "Política de Privacidade",
      termsShort: "Termos", privacyShort: "Privacidade", contactShort: "Contato",
      rights: "© 2026 BillCrafter por CCC STUDIO. Todos os direitos reservados.", operated: "Operado por CCC STUDIO · Estados Unidos" },
  },
  fr: {
    nav: { features: "Fonctionnalités", guide: "Guide", about: "À propos" },
    foot: { product: "Produit", templates: "Modèles", company: "Entreprise", legal: "Mentions légales",
      invoiceGen: "Générateur de factures", quoteGen: "Générateur d’offres", estimateGen: "Générateur de devis",
      receiptMaker: "Générateur de reçus", allTemplates: "Tous les modèles",
      browseAll: "Voir tout →", about: "À propos", changelog: "Nouveautés", contact: "Contact et assistance", manager: "Gestion des factures",
      login: "Connexion", signup: "S’inscrire", terms: "Conditions d’utilisation", privacy: "Politique de confidentialité",
      termsShort: "Conditions", privacyShort: "Confidentialité", contactShort: "Contact",
      rights: "© 2026 BillCrafter par CCC STUDIO. Tous droits réservés.", operated: "Exploité par CCC STUDIO · États-Unis" },
  },
  de: {
    nav: { features: "Funktionen", guide: "Leitfaden", about: "Über uns" },
    foot: { product: "Produkt", templates: "Vorlagen", company: "Unternehmen", legal: "Rechtliches",
      invoiceGen: "Rechnungsgenerator", quoteGen: "Angebotsgenerator", estimateGen: "Kostenvoranschlag-Generator",
      receiptMaker: "Quittungsgenerator", allTemplates: "Alle Vorlagen",
      browseAll: "Alle ansehen →", about: "Über uns", changelog: "Änderungen", contact: "Kontakt & Support", manager: "Rechnungsverwaltung",
      login: "Anmelden", signup: "Registrieren", terms: "Nutzungsbedingungen", privacy: "Datenschutzerklärung",
      termsShort: "AGB", privacyShort: "Datenschutz", contactShort: "Kontakt",
      rights: "© 2026 BillCrafter von CCC STUDIO. Alle Rechte vorbehalten.", operated: "Betrieben von CCC STUDIO · USA" },
  },
  it: {
    nav: { features: "Funzioni", guide: "Guida", about: "Chi siamo" },
    foot: { product: "Prodotto", templates: "Modelli", company: "Azienda", legal: "Note legali",
      invoiceGen: "Generatore di fatture", quoteGen: "Generatore di offerte", estimateGen: "Generatore di preventivi",
      receiptMaker: "Generatore di ricevute", allTemplates: "Tutti i modelli",
      browseAll: "Vedi tutti →", about: "Chi siamo", changelog: "Novità", contact: "Contatti e assistenza", manager: "Gestione fatture",
      login: "Accedi", signup: "Registrati", terms: "Termini di servizio", privacy: "Informativa sulla privacy",
      termsShort: "Termini", privacyShort: "Privacy", contactShort: "Contatti",
      rights: "© 2026 BillCrafter di CCC STUDIO. Tutti i diritti riservati.", operated: "Gestito da CCC STUDIO · Stati Uniti" },
  },
  "zh-Hant": {
    nav: { features: "功能", guide: "指南", about: "關於我們" },
    foot: { product: "產品", templates: "範本", company: "公司", legal: "法律條款",
      invoiceGen: "發票產生器", quoteGen: "報價單產生器", estimateGen: "估價單產生器",
      receiptMaker: "收據產生器", allTemplates: "所有範本",
      browseAll: "瀏覽全部 →", about: "關於我們", changelog: "更新日誌", contact: "聯絡與支援", manager: "發票管理",
      login: "登入", signup: "註冊", terms: "服務條款", privacy: "隱私權政策",
      termsShort: "條款", privacyShort: "隱私權", contactShort: "聯絡",
      rights: "© 2026 BillCrafter by CCC STUDIO. 保留一切權利。", operated: "由 CCC STUDIO 營運 · 美國" },
  },
  ru: {
    nav: { features: "Возможности", guide: "Руководство", about: "О нас" },
    foot: { product: "Продукт", templates: "Шаблоны", company: "Компания", legal: "Правовая информация",
      invoiceGen: "Генератор счётов", quoteGen: "Генератор предложений", estimateGen: "Генератор смет",
      receiptMaker: "Генератор квитанций", allTemplates: "Все шаблоны",
      browseAll: "Смотреть все →", about: "О нас", changelog: "Обновления", contact: "Контакты и поддержка", manager: "Управление счётами",
      login: "Войти", signup: "Регистрация", terms: "Условия использования", privacy: "Политика конфиденциальности",
      termsShort: "Условия", privacyShort: "Конфиденциальность", contactShort: "Контакты",
      rights: "© 2026 BillCrafter от CCC STUDIO. Все права защищены.", operated: "Управляется CCC STUDIO · США" },
  },
  bn: {
    nav: { features: "সুবিধা", guide: "নির্দেশিকা", about: "আমাদের কথা" },
    foot: { product: "পণ্য", templates: "টেমপ্লেট", company: "প্রতিষ্ঠান", legal: "আইনি",
      invoiceGen: "চালান জেনারেটর", quoteGen: "দরপত্র জেনারেটর", estimateGen: "প্রাক্কলন জেনারেটর",
      receiptMaker: "রসিদ জেনারেটর", allTemplates: "সব টেমপ্লেট",
      browseAll: "সব দেখুন →", about: "আমাদের কথা", changelog: "হালনাগাদ", contact: "যোগাযোগ ও সহায়তা", manager: "চালান ব্যবস্থাপনা",
      login: "প্রবেশ", signup: "নিবন্ধন", terms: "সেবার শর্তাবলি", privacy: "গোপনীয়তা নীতি",
      termsShort: "শর্তাবলি", privacyShort: "গোপনীয়তা", contactShort: "যোগাযোগ",
      rights: "© ২০২৬ BillCrafter — CCC STUDIO। সর্বস্বত্ব সংরক্ষিত।", operated: "পরিচালনায় CCC STUDIO · যুক্তরাষ্ট্র" },
  },
  ja: {
    nav: { features: "機能", guide: "ガイド", about: "運営者情報" },
    foot: { product: "製品", templates: "テンプレート", company: "会社", legal: "規約",
      invoiceGen: "請求書作成ツール", quoteGen: "御見積作成ツール", estimateGen: "見積書作成ツール",
      receiptMaker: "領収書作成ツール", allTemplates: "すべてのテンプレート",
      browseAll: "すべて見る →", about: "運営者情報", changelog: "更新履歴", contact: "お問い合わせ・サポート", manager: "請求書管理",
      login: "ログイン", signup: "新規登録", terms: "利用規約", privacy: "プライバシーポリシー",
      termsShort: "規約", privacyShort: "プライバシー", contactShort: "お問い合わせ",
      rights: "© 2026 BillCrafter by CCC STUDIO. All rights reserved.", operated: "運営：CCC STUDIO · アメリカ合衆国" },
  },
  ko: {
    nav: { features: "기능", guide: "가이드", about: "소개" },
    foot: { product: "제품", templates: "서식", company: "회사", legal: "법적 고지",
      invoiceGen: "청구서 생성기", quoteGen: "견적 제안 생성기", estimateGen: "견적서 생성기",
      receiptMaker: "영수증 생성기", allTemplates: "전체 서식",
      browseAll: "전체 보기 →", about: "소개", changelog: "업데이트", contact: "문의 및 지원", manager: "청구서 관리",
      login: "로그인", signup: "가입", terms: "서비스 약관", privacy: "개인정보 처리방침",
      termsShort: "약관", privacyShort: "개인정보", contactShort: "문의",
      rights: "© 2026 BillCrafter by CCC STUDIO. All rights reserved.", operated: "운영: CCC STUDIO · 미국" },
  },
  sv: {
    nav: { features: "Funktioner", guide: "Guide", about: "Om oss" },
    foot: { product: "Produkt", templates: "Mallar", company: "Företag", legal: "Juridik",
      invoiceGen: "Fakturaprogram", quoteGen: "Offertverktyg", estimateGen: "Kostnadsförslag",
      receiptMaker: "Kvittoverktyg", allTemplates: "Alla mallar",
      browseAll: "Visa alla →", about: "Om oss", changelog: "Nyheter", contact: "Kontakt och support", manager: "Fakturahantering",
      login: "Logga in", signup: "Skapa konto", terms: "Användarvillkor", privacy: "Integritetspolicy",
      termsShort: "Villkor", privacyShort: "Integritet", contactShort: "Kontakt",
      rights: "© 2026 BillCrafter av CCC STUDIO. Alla rättigheter förbehållna.", operated: "Drivs av CCC STUDIO · USA" },
  },
  vi: {
    nav: { features: "Tính năng", guide: "Hướng dẫn", about: "Giới thiệu" },
    foot: { product: "Sản phẩm", templates: "Mẫu", company: "Công ty", legal: "Pháp lý",
      invoiceGen: "Công cụ tạo hóa đơn", quoteGen: "Công cụ tạo báo giá", estimateGen: "Công cụ tạo dự toán",
      receiptMaker: "Công cụ tạo biên nhận", allTemplates: "Tất cả mẫu",
      browseAll: "Xem tất cả →", about: "Giới thiệu", changelog: "Cập nhật mới", contact: "Liên hệ & hỗ trợ", manager: "Quản lý hóa đơn",
      login: "Đăng nhập", signup: "Đăng ký", terms: "Điều khoản dịch vụ", privacy: "Chính sách bảo mật",
      termsShort: "Điều khoản", privacyShort: "Bảo mật", contactShort: "Liên hệ",
      rights: "© 2026 BillCrafter bởi CCC STUDIO. Bảo lưu mọi quyền.", operated: "Vận hành bởi CCC STUDIO · Hoa Kỳ" },
  },
  nl: {
    nav: { features: "Functies", guide: "Gids", about: "Over ons" },
    foot: { product: "Product", templates: "Templates", company: "Bedrijf", legal: "Juridisch",
      invoiceGen: "Factuurgenerator", quoteGen: "Offertegenerator", estimateGen: "Kostenramingsgenerator",
      receiptMaker: "Kwitantiegenerator", allTemplates: "Alle templates",
      browseAll: "Bekijk alles →", about: "Over ons", changelog: "Wat is er nieuw", contact: "Contact en support", manager: "Factuurbeheer",
      login: "Inloggen", signup: "Aanmelden", terms: "Servicevoorwaarden", privacy: "Privacybeleid",
      termsShort: "Voorwaarden", privacyShort: "Privacy", contactShort: "Contact",
      rights: "© 2026 BillCrafter van CCC STUDIO. Alle rechten voorbehouden.", operated: "Beheerd door CCC STUDIO · Verenigde Staten" },
  },
  id: {
    nav: { features: "Fitur", guide: "Panduan", about: "Tentang" },
    foot: { product: "Produk", templates: "Templat", company: "Perusahaan", legal: "Legal",
      invoiceGen: "Pembuat faktur", quoteGen: "Pembuat penawaran", estimateGen: "Pembuat estimasi",
      receiptMaker: "Pembuat kwitansi", allTemplates: "Semua templat",
      browseAll: "Lihat semua →", about: "Tentang", changelog: "Pembaruan", contact: "Kontak & dukungan", manager: "Pengelola faktur",
      login: "Masuk", signup: "Daftar", terms: "Ketentuan Layanan", privacy: "Kebijakan Privasi",
      termsShort: "Ketentuan", privacyShort: "Privasi", contactShort: "Kontak",
      rights: "© 2026 BillCrafter oleh CCC STUDIO. Seluruh hak dilindungi.", operated: "Dioperasikan oleh CCC STUDIO · Amerika Serikat" },
  },
};

// Headings for the video section. The video titles themselves stay in English
// (they're the real YouTube titles), so only the surrounding copy is translated.
const VID = {
  en: { eyebrow: "Watch", h2: "See it in action.", lead: "Three short videos: how the editor works, why there are no forms to fill in, and how every invoice after the first one takes seconds." },
  es: { eyebrow: "Vídeos", h2: "Míralo en acción.", lead: "Tres vídeos cortos: cómo funciona el editor, por qué no hay formularios que rellenar y por qué cada factura después de la primera se hace en segundos." },
  pt: { eyebrow: "Vídeos", h2: "Veja funcionando.", lead: "Três vídeos curtos: como o editor funciona, por que não há formulários para preencher e por que cada fatura depois da primeira leva segundos." },
  fr: { eyebrow: "Vidéos", h2: "Voyez-le à l’œuvre.", lead: "Trois courtes vidéos : comment fonctionne l’éditeur, pourquoi il n’y a aucun formulaire à remplir, et pourquoi chaque facture après la première ne prend que quelques secondes." },
  de: { eyebrow: "Videos", h2: "Sehen Sie es in Aktion.", lead: "Drei kurze Videos: wie der Editor funktioniert, warum es keine Formulare auszufüllen gibt und warum jede Rechnung nach der ersten nur Sekunden dauert." },
  it: { eyebrow: "Video", h2: "Guardalo all’opera.", lead: "Tre brevi video: come funziona l’editor, perché non ci sono moduli da compilare e perché ogni fattura dopo la prima richiede pochi secondi." },
  "zh-Hant": { eyebrow: "影片", h2: "實際看看怎麼用。", lead: "三支短片：編輯器怎麼運作、為什麼不需要填表單，以及第一張之後的每張發票為何只要幾秒鐘。" },
  ja: { eyebrow: "動画", h2: "実際の動きを見る。", lead: "3本の短い動画：エディタの使い方、入力フォームが不要な理由、そして2枚目以降の請求書が数秒で終わる理由。" },
  ko: { eyebrow: "영상", h2: "직접 확인해 보세요.", lead: "짧은 영상 세 편: 편집기가 어떻게 작동하는지, 왜 입력 양식이 필요 없는지, 그리고 두 번째 청구서부터는 왜 몇 초면 끝나는지." },
  ru: { eyebrow: "Видео", h2: "Посмотрите, как это работает.", lead: "Три коротких видео: как устроен редактор, почему не нужно заполнять формы и почему каждый счёт после первого занимает секунды." },
  bn: { eyebrow: "ভিডিও", h2: "কাজ করতে দেখুন।", lead: "তিনটি ছোট ভিডিও: এডিটর কীভাবে কাজ করে, কেন কোনো ফর্ম পূরণ করতে হয় না, আর প্রথমটির পর প্রতিটি চালান কেন কয়েক সেকেন্ডেই হয়ে যায়।" },
  nl: { eyebrow: "Video’s", h2: "Zie het in actie.", lead: "Drie korte video’s: hoe de editor werkt, waarom je geen formulieren hoeft in te vullen, en waarom elke factuur na de eerste seconden kost." },
  id: { eyebrow: "Video", h2: "Lihat cara kerjanya.", lead: "Tiga video singkat: cara kerja editor, mengapa tidak ada formulir yang perlu diisi, dan mengapa setiap faktur setelah yang pertama hanya perlu beberapa detik." },
  sv: { eyebrow: "Filmer", h2: "Se det i praktiken.", lead: "Tre korta filmer: hur redigeraren fungerar, varför du slipper fylla i formulär, och varför varje faktura efter den första tar sekunder." },
  vi: { eyebrow: "Video", h2: "Xem cách hoạt động.", lead: "Ba video ngắn: trình chỉnh sửa hoạt động thế nào, vì sao không cần điền biểu mẫu, và vì sao mỗi hóa đơn sau lần đầu chỉ mất vài giây." },
};

// Resolve the marketing copy for a locale. Regional variants fall back to their
// language (en-GB -> en, zh-Hant-TW -> zh-Hant), and anything missing falls back
// to English section-by-section so a partial translation can never blank a page.
export function mktg(locale = DEFAULT_LOCALE) {
  const lang = getLocale(locale).lang;
  const d = M[locale] || M[lang] || M.en;
  const c = CHROME[locale] || CHROME[lang] || CHROME.en;
  return {
    feat: d.feat || M.en.feat,
    step: d.step || M.en.step,
    tpl: d.tpl || M.en.tpl,
    faq: d.faq || M.en.faq,
    tr: d.tr || M.en.tr,
    nav: { ...CHROME.en.nav, ...(c.nav || {}) },
    foot: { ...CHROME.en.foot, ...(c.foot || {}) },
    vid: { ...VID.en, ...(VID[locale] || VID[lang] || {}) },
  };
}

export default M;
