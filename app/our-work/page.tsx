import type { Metadata } from "next";
import { ProjectMap } from "../components/ProjectMap";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = { title: "Our Work" };

export default function WorkPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="simple-hero"><div className="shell"><p className="eyebrow"><span />Our work</p><h1>Solar installations across Melbourne.</h1><p>Explore the homes and businesses we’ve helped move toward smarter, more reliable energy.</p></div></section>
        <section className="section map-page"><div className="shell"><ProjectMap /></div></section>
        <section className="section testimonials-section">
          <div className="shell content-split">
            <div><p className="kicker">Built on real outcomes</p><h2>Every pin will tell a project story.</h2></div>
            <div className="rich-copy"><p>When the project list is supplied, each location can include system size, installation type, suburb, completion year, project photography and an approved customer review.</p><p>Residential locations will be shown at suburb level to protect customer privacy.</p></div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
