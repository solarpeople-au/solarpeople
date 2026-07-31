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
        <section className="simple-hero"><div className="shell"><p className="eyebrow"><span />Our work</p><h1>Solar installations across Melbourne.</h1><p>Enter your postcode to explore completed projects nearby and see the depth of our local experience.</p></div></section>
        <section className="section map-page"><div className="shell"><ProjectMap /></div></section>
        <section className="section testimonials-section">
          <div className="shell content-split">
            <div><p className="kicker">Built on real outcomes</p><h2>Local experience, made visible.</h2></div>
            <div className="rich-copy"><p>The map brings hundreds of completed Solar People installations together in one place. Enter your postcode or use your location to understand how many systems we have delivered nearby.</p><p>Every residential point is deliberately moved away from the exact property address. The map demonstrates local experience without identifying our customers.</p></div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
