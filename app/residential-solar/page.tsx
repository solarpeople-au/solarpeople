import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "../components/PageHero";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = { title: "Residential Solar" };

export default function ResidentialPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Residential solar"
          title="A smarter home starts on the roof."
          copy="Tailored solar panel and battery systems designed for your home, your energy use and your long-term savings."
          imageClass="residential-hero"
        />
        <section className="section">
          <div className="shell content-split">
            <div><p className="kicker">Designed around your home</p><h2>More control over your energy.</h2></div>
            <div className="rich-copy">
              <p>We assess your roof, usage patterns and future needs before recommending a system. The result is practical, efficient and built to perform.</p>
              <div className="check-list"><span>Solar panel installation</span><span>Home battery storage</span><span>Existing system upgrades</span><span>Monitoring and support</span></div>
            </div>
          </div>
        </section>
        <section className="section process-section">
          <div className="shell">
            <p className="kicker">A clear process</p><h2>From first conversation to switch-on.</h2>
            <div className="process-grid">
              {[["01","Tell us about your home"],["02","Receive a tailored recommendation"],["03","Professional installation"],["04","Handover and ongoing support"]].map(([n,t])=><div key={n}><span>{n}</span><h3>{t}</h3></div>)}
            </div>
            <Link className="button button-primary" href="/free-quote">Start with a free quote <span>↗</span></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
