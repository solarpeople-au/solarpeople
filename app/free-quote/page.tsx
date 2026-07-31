import type { Metadata } from "next";
import { QuoteForm } from "../components/QuoteForm";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = { title: "Free Quote" };

export default function QuotePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="quote-page">
          <div className="shell quote-page-grid">
            <div><p className="eyebrow"><span />Free, no-obligation quote</p><h1>Tell us about your property.</h1><p>Share a few details and The Solar People will get in touch to discuss the right solar or battery solution.</p><div className="quote-points"><span>✓ Tailored recommendation</span><span>✓ Clear, honest advice</span><span>✓ No pushy sales</span></div></div>
            <QuoteForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
