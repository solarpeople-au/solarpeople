import Image from "next/image";

type Brand = {
  name: string;
  logo: string;
  href?: string;
};

// Add each manufacturer's approved website to `href` when the links are ready.
const brands: Brand[] = [
  { name: "AE Solar", logo: "/brands/ae-solar.png" },
  { name: "AlphaESS", logo: "/brands/alpha-ess.png" },
  { name: "Anker SOLIX", logo: "/brands/anker-solix.png" },
  { name: "Antai Solar", logo: "/brands/antai.png" },
  { name: "ASE Technology", logo: "/brands/ase-technology.png" },
  { name: "Canadian Solar", logo: "/brands/canadian-solar.png" },
  { name: "Dyness", logo: "/brands/dyness.png" },
  { name: "EGing PV", logo: "/brands/eging-pv.png" },
  { name: "Emerald", logo: "/brands/emerald.png" },
  { name: "FOX ESS", logo: "/brands/fox-ess.png" },
  { name: "GoodWe", logo: "/brands/goodwe.png" },
  { name: "JA Solar", logo: "/brands/ja-solar.png" },
  { name: "LG Energy Solution", logo: "/brands/lg-energy-solution.png" },
  { name: "NHP", logo: "/brands/nhp.png" },
  { name: "Risen", logo: "/brands/risen.png" },
  { name: "SAJ", logo: "/brands/saj.png" },
  { name: "SolarEdge", logo: "/brands/solaredge.png" },
  { name: "Solis", logo: "/brands/solis.png" },
  { name: "Solplanet", logo: "/brands/solplanet.png" },
  { name: "Sungrow", logo: "/brands/sungrow.png" },
  { name: "Sunman", logo: "/brands/sunman.png" },
  { name: "Titan Solar", logo: "/brands/titan-solar.png" },
  { name: "Trina Solar", logo: "/brands/trina-solar.png" },
  { name: "Tongwei", logo: "/brands/tongwei.png" },
];

function BrandArtwork({ brand }: { brand: Brand }) {
  return (
    <span className="brand-artwork">
      <Image
        src={brand.logo}
        alt={`${brand.name} logo`}
        fill
        sizes="(max-width: 560px) 38vw, (max-width: 900px) 20vw, 160px"
      />
    </span>
  );
}

export function BrandGrid() {
  return (
    <ul className="brand-grid" aria-label="Solar People technology brands">
      {brands.map((brand) => (
        <li className="brand-tile" key={brand.name}>
          {brand.href ? (
            <a href={brand.href} target="_blank" rel="noreferrer" aria-label={`Visit ${brand.name}`}>
              <BrandArtwork brand={brand} />
            </a>
          ) : (
            <div>
              <BrandArtwork brand={brand} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
