import Link from "next/link";

export function PageHero({ eyebrow, title, copy, imageClass }: { eyebrow: string; title: string; copy: string; imageClass: string }) {
  return (
    <section className={`page-hero ${imageClass}`}>
      <div className="page-hero-shade" />
      <div className="shell">
        <p className="eyebrow"><span />{eyebrow}</p>
        <h1>{title}</h1><p>{copy}</p>
        <Link className="button button-primary" href="/free-quote">Get a free quote <span>↗</span></Link>
      </div>
    </section>
  );
}
