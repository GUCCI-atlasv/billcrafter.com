import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { QUOTA_POLICY } from "@/lib/quotaConfig";

export const metadata = {
  title: "Privacy Policy",
  description: "How BillCrafter collects, processes, retains, and deletes your data.",
  alternates: { canonical: "/privacy" },
};

// Fully static: legal copy is edited in-repo, so a redeploy refreshes it.
export const dynamic = "force-static";

const UPDATED = "November 15, 2026";

export default function Privacy() {
  return (
    <>
      <SiteNav />
      <main>
        <section className="hero"><div className="wrap"><div className="legal">
          <h1>Privacy Policy</h1>
          <div className="updated">Last updated: {UPDATED}</div>
          <p className="lead">This Privacy Policy explains what BillCrafter, operated by <strong>CCC STUDIO</strong> (“BillCrafter”, “we”, “us”), collects when you use billcrafter.com and our invoice &amp; OCR tools (the “Service”), how each flow processes data, how long records are kept, and how to delete them.</p>

          <div className="toc">
            <a href="#collect">1. What we collect</a><a href="#drafts">2. Unregistered drafts</a><a href="#ocr-data">3. OCR uploads</a><a href="#accounts">4. Accounts &amp; deletion</a><a href="#email-share">5. Email &amp; share links</a><a href="#sharing">6. Third-party processors</a><a href="#cookies">7. Cookies</a><a href="#security">8. Security</a><a href="#rights">9. Your rights</a><a href="#intl">10. International</a><a href="#children">11. Children</a><a href="#changes">12. Changes</a><a href="#contact">13. Contact</a>
          </div>

          <h2 id="collect">1. Summary of data we collect</h2>
          <p>We aim to collect only what is needed to run each feature:</p>
          <ul>
            <li><strong>Account credentials.</strong> When you create an account we store your email address and a <strong>hashed</strong> password (never plain text). Magic-link sign-in creates a short-lived one-time token in Cloudflare KV. Google sign-in (when used) provides your basic profile email.</li>
            <li><strong>Saved billing records.</strong> Business profiles, clients, saved items, and documents you choose to save while signed in, plus optional e-signature PDFs and audit records (timestamp, IP address, user agent, SHA-256 hash, and consent wording).</li>
            <li><strong>Quota &amp; rate-limit counters.</strong> Daily IP/account counters needed to enforce free-tier limits ({QUOTA_POLICY.pdfGuestDaily} guest PDF export/day, {QUOTA_POLICY.ocrGuestDaily} guest / {QUOTA_POLICY.ocrMemberDaily} member OCR scans/day, and {QUOTA_POLICY.emailDailyLimit} outbound emails/day, resetting at 00:00 UTC).</li>
            <li><strong>Contact form submissions.</strong> Name, email, and message submitted through the contact page.</li>
            <li><strong>Operational &amp; security logs.</strong> Request metadata (such as IP address, browser user agent, and status codes) handled by Cloudflare and our Worker logs for abuse prevention and reliability.</li>
          </ul>

          <h2 id="drafts">2. Unregistered browser drafts</h2>
          <ul>
            <li><strong>Where drafts live.</strong> Before you sign in, in-progress drafts are auto-saved solely in your browser’s <code>localStorage</code> (keyed per tool path) and are <strong>not</strong> transmitted to BillCrafter servers on keystrokes.</li>
            <li><strong>Retention &amp; clearing.</strong> Local drafts expire after 7 days of inactivity, or immediately when you click <strong>Reset</strong> or clear your browser’s site data.</li>
            <li><strong>Backups.</strong> Clearing browser storage or switching browsers/devices removes unregistered drafts. Download your PDF or sign in with a free account to back up documents across devices.</li>
          </ul>

          <h2 id="ocr-data">3. AI Invoice &amp; Receipt OCR uploads</h2>
          <ul>
            <li><strong>How files travel.</strong> When you upload a JPG, PNG, WebP, or PDF (up to 4.5 MB), the file is sent over HTTPS to our Cloudflare Worker endpoint (<code>/api/ocr</code>) and forwarded to <strong>Google Cloud Vertex AI</strong> (<code>us-central1</code>, Gemini model) solely to extract structured line items, dates, tax, and totals back to your browser.</li>
            <li><strong>What is and is not stored.</strong> BillCrafter does <strong>not</strong> write your uploaded OCR image/PDF or extracted OCR JSON to our database (D1) or file bucket (R2), and discards the payload from Worker memory once the response returns. Only non-content quota counters (used/limit per UTC day) and aggregate error/latency metrics are logged.</li>
            <li><strong>Provider data governance.</strong> Under Google Cloud Vertex AI enterprise terms, customer prompts and uploaded documents are not used to train Google’s foundation models. Standard platform infrastructure logs may be handled transiently by Cloudflare and Google Cloud to operate and secure the API.</li>
            <li><strong>Optional transfer to Editor.</strong> If you choose “Open in Invoice Editor”, the extracted table moves inside your browser via <code>sessionStorage</code> until you download a PDF or explicitly save it while signed in.</li>
          </ul>

          <h2 id="accounts">4. Signed-in accounts, retention &amp; deletion</h2>
          <ul>
            <li><strong>Where account content is stored.</strong> Saved business profiles, clients, items, and documents are stored in Cloudflare D1 and scoped to your user ID. E-signed PDFs are stored in Cloudflare R2 with corresponding audit rows in D1.</li>
            <li><strong>How to delete data.</strong> You can delete individual saved clients, items, profiles, and documents from your dashboard, or request full account deletion via <a href="mailto:privacy@billcrafter.com">privacy@billcrafter.com</a>.</li>
            <li><strong>Deletion exceptions.</strong> Deleting your account removes active profile, client, item, and document records. Limited records may be retained where required for security/anti-abuse logs (such as email rate-limit or send logs) or legal/tamper-evident e-signature audit integrity, and encrypted infrastructure backups age out on their scheduled cycle.</li>
          </ul>

          <h2 id="email-share">5. Emailing invoices &amp; share links</h2>
          <ul>
            <li><strong>Emailed invoices.</strong> When you email an invoice, the PDF attachment and message body are submitted to Cloudflare Email Service for delivery to your chosen recipient, with your account email set as <code>Reply-To</code>. BillCrafter records send metadata (sender account, recipient address, subject, filename, timestamp, and delivery/error status) in D1 for support and anti-spam enforcement (max {QUOTA_POLICY.emailDailyLimit} emails/day).</li>
            <li><strong>Share links.</strong> Creating a share link stores a read-only document snapshot in D1 under a random unguessable token (<code>/i/[token]</code>). Anyone with the link can view that snapshot; share pages emit <code>noindex</code> and omit analytics/ad scripts so tokens are not leaked to search engines or ad networks.</li>
          </ul>

          <h2 id="sharing">6. Third-party processors</h2>
          <p>We do not sell your personal information or invoice content. We use the following infrastructure and service providers strictly to operate the Service (any vendor security certifications apply to the respective provider’s platform, not as an independent BillCrafter certification):</p>
          <ul>
            <li><strong>Cloudflare</strong> (United States / global edge network) — Workers hosting, D1 database, R2 object storage (signed PDFs), KV sessions, Browser Rendering (<code>/api/pdf</code>), and Email Service.</li>
            <li><strong>Google Cloud Vertex AI</strong> (United States, <code>us-central1</code>) — multimodal document extraction for the OCR Scanner under enterprise zero-training terms.</li>
            <li><strong>Google Analytics &amp; Google AdSense</strong> — aggregated traffic analytics and contextual/display ads on public marketing &amp; guide pages only; never loaded on <code>/i/*</code> share links, <code>/render/*</code> PDF renderers, or <code>/admin</code>.</li>
            <li><strong>Google OAuth</strong> — optional “Continue with Google” sign-in when chosen by the user.</li>
          </ul>

          <h2 id="cookies">7. Cookies</h2>
          <p>We use a strictly necessary session cookie to keep signed-in users authenticated, and a preference cookie (<code>bc_lang</code>) to remember if you dismiss the language suggestion banner. Google Analytics sets measurement cookies (such as <code>_ga</code>) on public pages; you can block them via browser settings or Google’s <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener nofollow">opt-out add-on</a> without affecting document creation.</p>

          <h2 id="security">8. Security</h2>
          <p>We protect data in transit over HTTPS, hash account passwords, scope database queries to the authenticated user ID, and keep share/PDF-render tokens separate from analytics scripts. No online transmission or storage is 100% immune from risk; report suspected security issues via <a href="/contact">contact</a> or <a href="mailto:privacy@billcrafter.com">privacy@billcrafter.com</a>.</p>

          <h2 id="rights">9. Your rights</h2>
          <p>Depending on where you live (including the EU/UK under GDPR and California under the CCPA/CPRA), you may have the right to access, correct, export, or delete your personal data, or object to/restrict certain processing. <strong>We do not sell or share personal information for cross-context behavioral advertising.</strong> Contact <a href="mailto:privacy@billcrafter.com">privacy@billcrafter.com</a> to exercise any right.</p>

          <h2 id="intl">10. International transfers</h2>
          <p>Because we run on Cloudflare’s global network and Google Cloud US endpoints, data may be processed outside your country of residence under applicable provider safeguards.</p>

          <h2 id="children">11. Children</h2>
          <p>The Service is not directed to children under 16, and we do not knowingly collect personal information from children. Contact us if you believe a child provided data so we can remove it.</p>

          <h2 id="changes">12. Changes to this policy</h2>
          <p>We update the “Last updated” date whenever material processing facts change and record significant updates in our <a href="/changelog">Changelog</a>.</p>

          <h2 id="contact">13. Contact us</h2>
          <p>Privacy questions or data deletion requests: <a href="mailto:privacy@billcrafter.com">privacy@billcrafter.com</a>. General support or corrections: <a href="mailto:support@billcrafter.com">support@billcrafter.com</a> or our <a href="/contact">contact page</a>.</p>

          <div className="note">BillCrafter is operated by CCC STUDIO (United States). Privacy &amp; deletion requests: <a href="mailto:privacy@billcrafter.com">privacy@billcrafter.com</a>.</div>
        </div></div></section>
      </main>
      <SiteFooter />
    </>
  );
}
