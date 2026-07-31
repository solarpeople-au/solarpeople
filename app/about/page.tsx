import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="simple-hero about-simple"><div className="shell"><p className="eyebrow"><span />About The Solar People</p><h1>Local experience. Straight answers. Quality work.</h1><p>We help Melbourne property owners make confident energy decisions with practical advice and professional installation.</p></div></section>
        <section className="section">
          <div className="shell content-split">
            <div><p className="kicker">Our approach</p><h2>Solar without the confusion.</h2></div>
            <div className="rich-copy"><p>The Solar People was built around a simple idea: recommend the right system, install it properly and stand behind the work.</p><p>This section will be completed with the company’s real history, team profiles, licences, accreditations and verified installation figures.</p><Link className="button button-primary" href="/free-quote">Talk to our team <span>↗</span></Link></div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
