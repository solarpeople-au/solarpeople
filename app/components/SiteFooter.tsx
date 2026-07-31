import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-top">
        <div className="footer-brand">
          <img src="/solar-people-logo.svg" alt="The Solar People" />
          <p>Professional solar and battery solutions for Melbourne homes and businesses.</p>
        </div>
        <div><h3>Solutions</h3><Link href="/residential-solar">Residential Solar</Link><Link href="/commercial-solar">Commercial Solar</Link><Link href="/our-work">Our Work</Link></div>
        <div><h3>Company</h3><Link href="/about">About Us</Link><Link href="/free-quote">Contact</Link><Link href="/free-quote">Free Quote</Link></div>
        <div><h3>Melbourne, VIC</h3><a href="mailto:hello@solarpeople.com.au">hello@solarpeople.com.au</a><p>Contact details to be confirmed</p></div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} The Solar People. All rights reserved.</span>
        <span>Privacy · Terms</span>
      </div>
    </footer>
  );
}
