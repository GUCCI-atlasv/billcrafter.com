import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of BillCrafter.",
  alternates: { canonical: "/terms" },
};

// Fully static: legal copy is edited in-repo, so a redeploy refreshes it. (A
// runtime `revalidate` would force the Cloudflare worker to re-render on-demand,
// which the read-only static-assets cache can't persist — see open-next.config.)
export const dynamic = "force-static";

const UPDATED = "September 15, 2026";

export default function Terms() {
  return (
    <>
      <SiteNav />
      <main>
        <section className="hero"><div className="wrap"><div className="legal">
          <h1>Terms of Service</h1>
          <div className="updated">Last updated: {UPDATED}</div>
          <p className="lead">These Terms of Service (“Terms”) govern your access to and use of billcrafter.com and the BillCrafter invoice tools (the “Service”), operated by <strong>CCC STUDIO</strong> (“we”, “us”). By using the Service, you agree to these Terms.</p>

          <div className="toc">
            <a href="#service">1. The service</a><a href="#accounts">2. Accounts</a><a href="#use">3. Acceptable use</a><a href="#content">4. Your content</a><a href="#email">5. Emailing invoices</a><a href="#plans">6. Price &amp; limits</a><a href="#advice">7. No professional advice</a><a href="#ip">8. Intellectual property</a><a href="#disclaimer">9. Disclaimers</a><a href="#liability">10. Liability</a><a href="#termination">11. Termination</a><a href="#law">12. Governing law</a><a href="#changes">13. Changes</a><a href="#contact">14. Contact</a>
          </div>

          <h2 id="service">1. The Service</h2>
          <p>BillCrafter lets you create invoices, estimates, quotes, and receipts; export them as PDF; and email a PDF to your clients. The Service is free — there are no paid plans. <strong>Visitors without an account can export 1 PDF per day</strong> (counted by IP address) and cannot add status stamps; <strong>registered accounts can export and email without limit</strong> and use every feature. We may apply reasonable technical limits to prevent abuse, and we may change features over time.</p>

          <h2 id="accounts">2. Accounts</h2>
          <ul>
            <li>You may sign up with email and password, or via a one-time magic link we email to you. You must provide accurate information and keep your credentials secure. You are responsible for activity under your account.</li>
            <li>You must be at least 16 years old (or the age of digital consent in your country).</li>
            <li>Notify us promptly of any unauthorized use.</li>
          </ul>

          <h2 id="use">3. Acceptable use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Service for fraudulent, deceptive, or unlawful purposes, including creating false or misleading invoices.</li>
            <li>Infringe others’ rights, upload malware, or attempt to disrupt, reverse engineer, or gain unauthorized access to the Service.</li>
            <li>Resell or abuse the Service or circumvent export limits or security controls.</li>
            <li>Use the email-invoice feature to send spam, unsolicited bulk mail, or content that violates applicable email or anti-spam laws.</li>
          </ul>

          <h2 id="content">4. Your content</h2>
          <p>You retain all rights to the business information, client details, and documents you create (“Your Content”). You grant us a limited license to host, store, process, display, and (when you request it) transmit Your Content solely to operate and provide the Service to you — including attaching a PDF to an email you send through the Service. You are responsible for Your Content and for ensuring you have the rights to use it and to send it to the recipients you choose.</p>

          <h2 id="email">5. Emailing invoices</h2>
          <ul>
            <li>You must be signed in to email an invoice. Delivery is provided through our email provider and is not guaranteed.</li>
            <li>You are solely responsible for the accuracy of the recipient address, the content of the message, and compliance with applicable law (including any consent requirements for commercial email).</li>
            <li>We may log metadata about sends (such as sender account, recipient address, subject, and delivery status) so we can operate, support, and secure the Service. See our <a href="/privacy">Privacy Policy</a>.</li>
          </ul>

          <h2 id="plans">6. Price &amp; limits</h2>
          <ul>
            <li><strong>Free.</strong> BillCrafter is provided at no charge. We do not sell subscriptions and never ask for payment details.</li>
            <li><strong>Without an account.</strong> 1 PDF export per day per IP address; status stamps (PAID, UNPAID and similar) require an account.</li>
            <li><strong>With a free account.</strong> Unlimited exports, emailed invoices, share links, recurring invoices, status stamps and e-signature.</li>
            <li><strong>Changes.</strong> If we ever introduce paid features, we will give prior notice and will not charge you without your explicit agreement.</li>
          </ul>

          <h2 id="advice">7. No professional advice</h2>
          <p>BillCrafter is a document tool, not an accounting, tax, or legal service. Documents you create do not constitute financial, tax, or legal advice. You are responsible for the accuracy of your invoices and for applicable tax and compliance obligations. Consult a qualified professional where needed.</p>

          <h2 id="ip">8. Intellectual property</h2>
          <p>The Service, including the BillCrafter name, logo, templates, and software, is owned by us and protected by law. These Terms do not grant you rights to our trademarks or to copy the Service, except that documents you generate are yours to use.</p>

          <h2 id="disclaimer">9. Disclaimers</h2>
          <p>The Service is provided “as is” and “as available,” without warranties of any kind, whether express or implied, including merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the Service will be uninterrupted, error-free, or secure, or that emails will be delivered, opened, or retained by recipients.</p>

          <h2 id="liability">10. Limitation of liability</h2>
          <p>To the maximum extent permitted by law, BillCrafter will not be liable for indirect, incidental, special, consequential, or punitive damages, or for lost profits, data, or goodwill. Our total liability for any claim relating to the Service will not exceed the greater of the amounts you paid us in the 12 months before the claim or USD $50. Some jurisdictions do not allow certain limitations, so some of these may not apply to you.</p>

          <h2 id="termination">11. Termination</h2>
          <p>You may stop using the Service and delete your account at any time. We may suspend or terminate access if you violate these Terms or to protect the Service. On termination, your right to use the Service ends; sections that by their nature should survive will survive.</p>

          <h2 id="law">12. Governing law</h2>
          <p>These Terms are governed by the laws of the <strong>United States</strong> and, where applicable, the state in which CCC STUDIO operates, without regard to conflict-of-laws rules. Disputes will be resolved in the courts located there, unless applicable law provides otherwise.</p>

          <h2 id="changes">13. Changes to these Terms</h2>
          <p>We may update these Terms from time to time. We will change the “Last updated” date and, for material changes, provide additional notice. Continued use after changes take effect means you accept the updated Terms.</p>

          <h2 id="contact">14. Contact</h2>
          <p>Questions about these Terms: <a href="mailto:legal@billcrafter.com">legal@billcrafter.com</a>. For general help, contact <a href="mailto:support@billcrafter.com">support@billcrafter.com</a> or visit our <a href="/contact">contact page</a>. BillCrafter is operated by CCC STUDIO.</p>

          <div className="note">BillCrafter is operated by CCC STUDIO (United States). Questions about these Terms: <a href="mailto:legal@billcrafter.com">legal@billcrafter.com</a>.</div>
        </div></div></section>
      </main>
      <SiteFooter />
    </>
  );
}
