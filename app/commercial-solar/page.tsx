import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "../components/PageHero";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = { title: "Commercial Solar" };

export default function CommercialPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Commercial solar"
          title="Put your energy costs to work."
          copy="Commercial solar and battery systems designed to reduce overheads, improve control and support long-term business performance."
          imageClass="commercial-page-hero"
        />
        <section className="section">
          <div className="shell content-split">
            <div><p className="kicker">Commercial capability</p><h2>Built around the demands of your site.</h2></div>
            <div className="rich-copy">
              <p>From assessment and system design to installation and monitoring, we provide a clear path to a better-performing energy setup.</p>
              <div className="check-list"><span>Commercial system design</span><span>High-capacity solar installation</span><span>Battery and storage solutions</span><span>Performance monitoring</span></div>
            </div>
          </div>
        </section>
        <section className="section metric-band"><div className="shell"><div><strong>Lower</strong><span>operating costs</span></div><div><strong>Better</strong><span>energy visibility</span></div><div><strong>Long-term</strong><span>asset performance</span></div></div></section>
        <section className="section"><div className="shell closing-cta"><p className="kicker">Talk to our team</p><h2>Let’s assess the opportunity at your site.</h2><Link className="button button-primary" href="/free-quote">Request a commercial quote <span>↗</span></Link></div></section>
      </main>
      <SiteFooter />
    </>
  );
}
