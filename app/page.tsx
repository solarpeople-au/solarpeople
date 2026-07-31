import Link from "next/link";
import { ProjectMap } from "./components/ProjectMap";
import { QuoteForm } from "./components/QuoteForm";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero">
          <div className="hero-image" aria-hidden="true" />
          <div className="hero-shade" aria-hidden="true" />
          <div className="shell hero-inner">
            <div className="eyebrow"><span /> Melbourne solar specialists</div>
            <h1>Smarter solar.<br />Installed properly.</h1>
            <p className="hero-copy">
              Honest advice, quality systems and professional solar and battery
              installations for Melbourne homes and businesses.
            </p>
            <div className="button-row">
              <Link className="button button-primary" href="/free-quote">
                Get a free quote <span>↗</span>
              </Link>
              <Link className="button button-ghost" href="/our-work">
                Explore our installations
              </Link>
            </div>
          </div>
          <div className="shell trust-strip">
            <div><strong>Hundreds</strong><span>of Melbourne installations</span></div>
            <div><strong>Local</strong><span>advice and installation</span></div>
            <div><strong>Residential</strong><span>& commercial expertise</span></div>
          </div>
        </section>

        <section className="section intro-section">
          <div className="shell split-heading">
            <div>
              <p className="kicker">Why The Solar People</p>
              <h2>Energy decisions made clear.</h2>
            </div>
            <div className="section-copy">
              <p>
                Solar should feel straightforward. We design each system around
                the property, the energy use and the result you actually want —
                without the pressure or confusion.
              </p>
              <Link className="text-link" href="/about">Meet The Solar People <span>→</span></Link>
            </div>
          </div>
          <div className="shell value-grid">
            {[
              ["01", "Tailored advice", "A system designed around your roof, usage and goals."],
              ["02", "Quality workmanship", "Careful installation by experienced Melbourne professionals."],
              ["03", "Trusted technology", "Reliable solar panels, inverters and battery solutions."],
              ["04", "Ongoing support", "Clear answers before, during and after your installation."],
            ].map(([number, title, text]) => (
              <article className="value-card" key={number}>
                <span>{number}</span><h3>{title}</h3><p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section services-section">
          <div className="shell section-heading-row">
            <div><p className="kicker">What we do</p><h2>Solar built for the way you use energy.</h2></div>
            <p>From family homes to high-demand commercial sites, every system starts with a practical plan.</p>
          </div>
          <div className="shell service-grid">
            <Link className="service-card residential-card" href="/residential-solar">
              <div className="service-number">01 / Residential</div>
              <div>
                <h3>Power your home with confidence.</h3>
                <p>Solar panels, battery storage and system upgrades designed for long-term savings.</p>
                <span className="round-arrow">↗</span>
              </div>
            </Link>
            <Link className="service-card commercial-card" href="/commercial-solar">
              <div className="service-number">02 / Commercial</div>
              <div>
                <h3>Turn your roof into a business asset.</h3>
                <p>Commercial solar systems designed to lower operating costs and improve energy control.</p>
                <span className="round-arrow">↗</span>
              </div>
            </Link>
          </div>
        </section>

        <section className="section work-section">
          <div className="shell map-layout">
            <div className="map-copy">
              <p className="kicker">Our work across Melbourne</p>
              <h2>Local experience you can see.</h2>
              <p>
                Explore a selection of residential, commercial and battery
                installations completed across Melbourne.
              </p>
              <div className="map-stat">
                <strong>100s</strong><span>of systems installed across metropolitan Melbourne</span>
              </div>
              <Link className="button button-primary" href="/our-work">View all projects <span>↗</span></Link>
            </div>
            <ProjectMap compact />
          </div>
        </section>

        <section className="section testimonials-section">
          <div className="shell">
            <div className="section-heading-row">
              <div><p className="kicker">Customer stories</p><h2>Trusted by Melbourne property owners.</h2></div>
              <div className="rating-summary"><strong>5.0</strong><span>★★★★★</span><small>Customer review preview</small></div>
            </div>
            <div className="testimonial-grid">
              {[
                ["“The whole process was clear and professional. The team took the time to explain the options and the installation was exceptionally tidy.”", "Residential customer", "Glen Waverley"],
                ["“Reliable, responsive and easy to work with. Our new system is performing exactly as promised.”", "Commercial customer", "Dandenong South"],
                ["“No pressure, just practical advice. We felt confident from the first conversation through to handover.”", "Solar + battery customer", "Point Cook"],
              ].map(([quote, name, suburb]) => (
                <blockquote key={suburb}>
                  <span className="quote-mark">“</span><p>{quote}</p>
                  <footer><strong>{name}</strong><span>{suburb}, VIC · Preview content</span></footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section className="section quote-section" id="quote">
          <div className="shell quote-layout">
            <div>
              <p className="kicker">Start the conversation</p>
              <h2>Ready for a smarter energy setup?</h2>
              <p>Tell us a little about your property and we’ll be in touch to prepare a free, no-obligation quote.</p>
              <div className="quote-points">
                <span>✓ Free, tailored assessment</span>
                <span>✓ No pushy sales</span>
                <span>✓ Melbourne-based support</span>
              </div>
            </div>
            <QuoteForm compact />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
