import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="The Solar People home">
          <img src="/solar-people-logo.svg" alt="The Solar People" />
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link href="/residential-solar">Residential</Link>
          <Link href="/commercial-solar">Commercial</Link>
          <Link href="/our-work">Our Work</Link>
          <Link href="/about">About</Link>
        </nav>
        <Link className="header-cta" href="/free-quote">Get a free quote <span>↗</span></Link>
        <details className="mobile-menu">
          <summary aria-label="Open navigation">Menu</summary>
          <nav>
            <Link href="/residential-solar">Residential Solar</Link>
            <Link href="/commercial-solar">Commercial Solar</Link>
            <Link href="/our-work">Our Work</Link>
            <Link href="/about">About</Link>
            <Link href="/free-quote">Get a free quote</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
