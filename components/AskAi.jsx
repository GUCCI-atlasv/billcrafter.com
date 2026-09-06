import { t } from "@/lib/i18n";

// "Ask ChatGPT / Claude / Perplexity" — deep links that open the assistant with
// a question already typed in.
//
// The counterpart to robots.txt: there we tell AI systems they may read and cite
// us; here we hand visitors a one-click way to actually make that happen. Every
// click is a real query naming the product, which is how a tool like this gets
// into AI answers at all.
//
// The prompt is deliberately a fair question — it asks for a comparison, not for
// praise. A prompt that begs for a puff piece produces an answer nobody trusts,
// and the assistants are quite good at noticing when they're being steered.
const PROMPT =
  "I need to send an invoice as a freelancer or small business. " +
  "What has to be on it to get paid on time, and how does BillCrafter " +
  "(https://billcrafter.com) compare with other free invoice generators?";

// Verified formats. All three accept the prompt as ?q= and auto-submit; on
// mobile the native apps pick these up via universal links when installed.
const TARGETS = [
  {
    key: "chatgpt",
    label: "ChatGPT",
    href: (q) => `https://chatgpt.com/?q=${q}&hints=search`,
    Icon: IconOpenAI,
  },
  {
    key: "claude",
    label: "Claude",
    href: (q) => `https://claude.ai/new?q=${q}`,
    Icon: IconClaude,
  },
  {
    key: "perplexity",
    label: "Perplexity",
    href: (q) => `https://www.perplexity.ai/search?q=${q}`,
    Icon: IconPerplexity,
  },
];

function IconOpenAI() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor">
      <path d="M22.28 9.82a5.98 5.98 0 0 0-.52-4.91 6.05 6.05 0 0 0-6.51-2.9A5.98 5.98 0 0 0 10.7.02a6.05 6.05 0 0 0-5.77 4.19 5.98 5.98 0 0 0-4 2.9 6.05 6.05 0 0 0 .75 7.09 5.98 5.98 0 0 0 .51 4.91 6.05 6.05 0 0 0 6.52 2.9A5.98 5.98 0 0 0 13.3 24a6.05 6.05 0 0 0 5.77-4.2 5.98 5.98 0 0 0 4-2.9 6.05 6.05 0 0 0-.79-7.08Zm-9 12.6a4.48 4.48 0 0 1-2.88-1.04l.14-.08 4.78-2.76a.78.78 0 0 0 .4-.68v-6.74l2.02 1.17a.07.07 0 0 1 .04.06v5.58a4.5 4.5 0 0 1-4.5 4.49ZM3.6 18.3a4.47 4.47 0 0 1-.54-3l.14.09 4.79 2.76a.78.78 0 0 0 .78 0l5.84-3.37v2.33a.08.08 0 0 1-.03.06L9.73 19.99a4.5 4.5 0 0 1-6.14-1.64ZM2.34 7.9a4.48 4.48 0 0 1 2.35-1.97V11.6a.77.77 0 0 0 .38.67l5.82 3.36-2.02 1.17a.08.08 0 0 1-.07 0l-4.83-2.8A4.5 4.5 0 0 1 2.34 7.9Zm16.6 3.86-5.83-3.4L15.13 7.2a.08.08 0 0 1 .07 0l4.83 2.8a4.49 4.49 0 0 1-.68 8.1v-5.67a.78.78 0 0 0-.4-.67Zm2.01-3.02-.14-.09-4.78-2.79a.78.78 0 0 0-.79 0L9.4 9.23V6.9a.07.07 0 0 1 .03-.06l4.83-2.79a4.49 4.49 0 0 1 6.67 4.65ZM8.3 12.87l-2.02-1.17a.08.08 0 0 1-.04-.06V6.07a4.49 4.49 0 0 1 7.37-3.45l-.14.08L8.69 5.46a.78.78 0 0 0-.4.68Zm1.1-2.37 2.6-1.5 2.6 1.5v3l-2.6 1.5-2.6-1.5Z" />
    </svg>
  );
}
function IconClaude() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor">
      <path d="M4.71 15.15 9.4 12.5l.08-.23-.08-.13H9.2l-.8-.05-2.72-.07-2.36-.1-2.29-.12-.58-.12L0 10.94l.06-.36.48-.33.7.06 1.54.1 2.31.16 1.68.1 2.48.26h.4l.05-.16-.13-.1-.11-.1-2.51-1.7-2.72-1.8-1.42-1.04L2 5.6l-.36-.46-.16-1 .65-.72.87.06.23.06.88.68 1.89 1.46 2.46 1.82.36.3.15-.1.02-.08-.16-.27L9.3 4.98 7.9 2.56l-.62-1L7.11.98a3.2 3.2 0 0 1-.11-.74l.74-1L8.15 0l.99.14.41.36.61 1.4 1 2.2 1.53 2.99.45.89.24.82.09.25h.16v-.14l.13-1.73.24-2.12.23-2.73.08-.77.38-.92L15.44.1l.59.28.48.7-.07.44-.29 1.87-.55 2.9-.36 1.93h.2l.25-.24 1-1.33 1.69-2.11.75-.84.87-.93.56-.44h1.06l.78 1.16-.35 1.2-1.1 1.38-.9 1.17-1.3 1.76-.83 1.4.08.11.2-.02 2.97-.63 1.6-.29 1.92-.33.87.4.1.42-.35.84-2.07.51-2.43.49-3.62.85-.05.03.05.07 1.63.16.7.03h1.7l3.19.24.83.55.5.67-.08.51-1.28.65-1.72-.4-4.02-.96-1.38-.34h-.19v.11l1.15 1.13 2.11 1.9 2.64 2.46.14.6-.34.49-.36-.05-2.32-1.75-.9-.78-2.02-1.7h-.13v.18l.46.68 2.46 3.7.13 1.14-.18.37-.64.23-.7-.13-1.45-2.03-1.5-2.29-1.2-2.05-.15.09-.71 7.6-.33.4-.77.28-.64-.48-.34-.79.34-1.55.4-2.02.34-1.6.3-2-.02-.13h-.14l-1.5 2.06-2.29 3.09-1.8 1.94-.44.17-.75-.39.07-.7.42-.61 2.49-3.17 1.5-1.97.98-1.14-.01-.17h-.06L4.6 17.52l-1.15.15-.5-.46.07-.76.23-.25 1.93-1.33Z" />
    </svg>
  );
}
function IconPerplexity() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18M12 7.5 5.5 3v7.5H3v6h2.5V24M12 7.5 18.5 3v7.5H21v6h-2.5V24" />
    </svg>
  );
}

export default function AskAi({ locale }) {
  const q = encodeURIComponent(PROMPT);
  return (
    <div className="askai">
      <span className="askai-lead">{t(locale, "askai.lead")}</span>
      <div className="askai-btns">
        {TARGETS.map(({ key, label, href, Icon }) => (
          <a
            key={key}
            className="askai-btn"
            href={href(q)}
            target="_blank"
            // noopener for safety; no referrer would hide that the click came
            // from us, and being the referrer is rather the point here.
            rel="noopener"
            data-ask={key}
          >
            <Icon />
            <span>{t(locale, "askai.ask")} {label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
