import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: "Privacy Policy",
  description: "How BillCrafter collects, uses, and protects your data.",
  alternates: { canonical: "/privacy" },
};

// Fully static: legal copy is edited in-repo, so a redeploy refreshes it. (A
// runtime `revalidate` would force the Cloudflare worker to re-render on-demand,
// which the read-only static-assets cache can't persist — see open-next.config.)
export const dynamic = "force-static";

const UPDATED = "October 9, 2026";

export default function Privacy() {
  return (
    <>
      <SiteNav />
      <main>
        <section className="hero"><div className="wrap"><div className="legal">
          <h1>Privacy Policy</h1>
          <div className="updated">Last updated: {UPDATED}</div>
          <p className="lead">This Privacy Policy explains what BillCrafter, operated by <strong>CCC STUDIO</strong> (“BillCrafter”, “we”, “us”), collects when you use billcrafter.com and our invoice tools (the “Service”), how we use it, and the choices you have.</p>

          <div className="toc">
            <a href="#collect">1. What we collect</a><a href="#use">2. How we use it</a><a href="#invoice-data">3. Your invoice data</a><a href="#email">4. Email &amp; invoice delivery</a><a href="#sharing">5. Sharing</a><a href="#cookies">6. Cookies</a><a href="#retention">7. Retention &amp; deletion</a><a href="#security">8. Security</a><a href="#rights">9. Your rights</a><a href="#intl">10. International</a><a href="#children">11. Children</a><a href="#changes">12. Changes</a><a href="#contact">13. Contact</a>
          </div>

          <h2 id="collect">1. Information we collect</h2>
          <p>We aim to collect as little as possible.</p>
          <ul>
            <li><strong>Account data.</strong> When you create an account we store your email address and a <strong>hashed</strong> password (we never store passwords in plain text). If you request a magic-link sign-in, we temporarily store a one-time token tied to your email. If you sign in with Google (when enabled), we receive your basic profile email.</li>
            <li><strong>Content you enter.</strong> The business details, clients, saved items, and invoices/estimates/quotes/receipts you create and choose to save to your account.</li>
            <li><strong>Email send data.</strong> When you email an invoice, we record metadata such as your account email, the recipient address, subject line, attachment filename, delivery status, and any provider error message. We also process the message body and PDF you asked us to send.</li>
            <li><strong>Usage data.</strong> Counts needed to enforce the export limit for visitors without an account (1 export per day, counted by IP), and basic, aggregated analytics about how the Service is used.</li>
            <li><strong>Contact form data.</strong> If you write to us via the contact page, we receive the name, email, and message you submit.</li>
            <li><strong>Device &amp; log data.</strong> IP address, browser type, and request logs, used for security and to operate the Service.</li>
          </ul>
          <p>Before you create an account, drafts are kept in your browser’s local storage and are not sent to us.</p>

          <h2 id="use">2. How we use information</h2>
          <ul>
            <li>Provide, maintain, and secure the Service and your account.</li>
            <li>Save and sync your business profile, clients, items, and documents.</li>
            <li>Send magic-link sign-in emails and deliver invoice PDFs you choose to email to clients.</li>
            <li>Enforce the daily export limit for visitors without an account.</li>
            <li>Detect, prevent, and respond to fraud, abuse, spam, and security incidents.</li>
            <li>Communicate with you about your account, security, and product updates.</li>
            <li>Improve the Service using aggregated, non-identifying insights.</li>
          </ul>
          <p>Under the GDPR, our legal bases are performance of a contract (providing the Service), our legitimate interests (security and improvement), consent (where required), and legal obligations.</p>

          <h2 id="invoice-data">3. Your invoice content is yours</h2>
          <p>The documents and client details you create belong to you. We access them only to provide the Service (for example, to store, render, export, or email them at your request) or where required by law. <strong>We do not sell your personal information or your invoice content, and we do not use it for advertising.</strong></p>

          <h2 id="email">4. Email &amp; invoice delivery</h2>
          <p>Transactional email (magic links, contact form notifications, and invoice emails you send) is delivered through our email provider. When you email an invoice:</p>
          <ul>
            <li>The PDF and message are sent to the recipient address you provide.</li>
            <li>Your account email is typically used as the reply-to address so clients can reply to you directly.</li>
            <li>We keep an internal send log for support, abuse prevention, and service reliability. That log is available to authorized administrators of the Service.</li>
          </ul>

          <h2 id="sharing">5. How we share information</h2>
          <p>We share data only with service providers that help us run the Service, under contracts that protect your data:</p>
          <ul>
            <li><strong>Cloudflare</strong> — hosting, database (D1), and sessions (KV).</li>
            <li><strong>Resend</strong> — transactional and invoice email delivery.</li>
            <li><strong>Google Analytics</strong> — measuring how visitors find and use our public pages (pages viewed, approximate location, device and browser). It is not loaded on invoice share links or on the page that renders your PDF, and it never receives your invoice content.</li>
          </ul>
          <p>We may also disclose information to comply with the law, enforce our Terms, or in connection with a merger or acquisition (with notice where required). We do not sell personal data.</p>

          <h2 id="cookies">6. Cookies</h2>
          <p>We use a strictly necessary, secure session cookie to keep you signed in. We also use Google Analytics, which sets its own cookies (such as <code>_ga</code>) to count visits and understand how the Service is used. You can block these with your browser settings or Google’s <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener nofollow">opt-out add-on</a> without affecting the Service. Disabling the session cookie will sign you out.</p>

          <h2 id="retention">7. Data retention &amp; deletion</h2>
          <p>We keep your account and content while your account is active. You can delete individual clients, items, profiles, and documents at any time, and you can delete your entire account, which removes your associated data (subject to limited retention for legal, security, or backup purposes). Email send logs may be retained for a reasonable period for security and abuse prevention.</p>

          <h2 id="security">8. Security</h2>
          <p>We protect data in transit and at rest, hash passwords, and scope every account’s data to that account. No method of transmission or storage is 100% secure, but we work to protect your information and to respond promptly to any incident.</p>

          <h2 id="rights">9. Your rights</h2>
          <p>Depending on where you live (including the EU/UK under GDPR and California under the CCPA/CPRA), you may have the right to access, correct, delete, or export your data, to object to or restrict certain processing, and to withdraw consent. California residents may request disclosure of data practices and to opt out of “sale” or “sharing” — note that <strong>we do not sell or share personal information</strong>. We will not discriminate against you for exercising these rights. To make a request, contact us below.</p>

          <h2 id="intl">10. International transfers</h2>
          <p>We operate on globally distributed infrastructure, so your data may be processed in countries other than yours. Where required, we use appropriate safeguards for such transfers.</p>

          <h2 id="children">11. Children</h2>
          <p>The Service is not directed to children under 16, and we do not knowingly collect their personal information. If you believe a child has provided us data, contact us and we will delete it.</p>

          <h2 id="changes">12. Changes to this policy</h2>
          <p>We may update this policy from time to time. We will change the “Last updated” date and, for material changes, provide additional notice.</p>

          <h2 id="contact">13. Contact us</h2>
          <p>Privacy questions or data requests: <a href="mailto:privacy@billcrafter.com">privacy@billcrafter.com</a>. For general help, contact <a href="mailto:support@billcrafter.com">support@billcrafter.com</a> or visit our <a href="/contact">contact page</a>.</p>

          <div className="note">BillCrafter is operated by CCC STUDIO (United States). Privacy questions or data requests: <a href="mailto:privacy@billcrafter.com">privacy@billcrafter.com</a>.</div>
        </div></div></section>
      </main>
      <SiteFooter />
    </>
  );
}
