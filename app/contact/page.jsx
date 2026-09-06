import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact",
  description: "Get in touch with the BillCrafter team — support, billing, privacy and press.",
  alternates: { canonical: "/contact" },
};

const CHANNELS = [
  ["Support & general questions", "support@billcrafter.com", "Help with the app, your account, exports, or billing. We reply within 1–2 business days."],
  ["Privacy & data requests", "privacy@billcrafter.com", "Access, export, or delete your data, or ask about how it’s handled."],
  ["Legal", "legal@billcrafter.com", "Questions about our Terms of Service."],
];

export default function Contact() {
  return (
    <>
      <SiteNav />
      <main>
        <section className="hero"><div className="wrap" style={{ maxWidth: 720 }}>
          <div className="hero-head">
            <h1>Contact us</h1>
            <p className="sub">Questions, feedback, or need a hand? We’d love to hear from you.</p>
          </div>

          <div style={{ marginTop: 24 }}><ContactForm /></div>

          <h2 style={{ fontSize: 18, margin: "28px 0 4px" }}>Or email us directly</h2>
          <div style={{ display: "grid", gap: 14, marginTop: 12 }}>
            {CHANNELS.map(([title, email, desc]) => (
              <div key={email} className="panel" style={{ padding: 20, margin: 0 }}>
                <h3 style={{ fontSize: 16, marginBottom: 4 }}>{title}</h3>
                <p className="muted" style={{ fontSize: 13.5, margin: "0 0 12px" }}>{desc}</p>
                <a className="btn btn-ghost" href={`mailto:${email}`}>{email}</a>
              </div>
            ))}
          </div>

          <p className="muted" style={{ fontSize: 12.5, marginTop: 20 }}>
            Prefer to start faster? Just <a href="/" style={{ color: "var(--ink)", textDecoration: "underline" }}>create an invoice</a> — no signup needed.
          </p>
        </div></section>
      </main>
      <SiteFooter />
    </>
  );
}
