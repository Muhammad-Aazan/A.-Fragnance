import Image from "next/image";
import Link from "next/link";

const tiles = [
  {
    name: "Extrait Perfumes",
    badge: "LUXURY PERFUMES",
    image: "/luxury-flacon.jpg",
    href: "/collections/signature-trilogy",
  },
  {
    name: "Sacred Attars",
    badge: "ZERO ALCOHOL OILS",
    image: "/attar-sultan.jpg",
    href: "/collections/imperial-attars",
  },
  {
    name: "Vintage Oud",
    badge: "AGED CAMBODIAN OIL",
    image: "/dehn-al-oud.jpg",
    href: "/collections/imperial-attars",
  },
  {
    name: "Private Reserve",
    badge: "LIMITED EDITIONS",
    image: "/celestial-oud.jpg",
    href: "/collections/private-reserve",
  },
];

export default function Collections() {
  return (
    <section className="py-24 px-6 md:px-12 bg-white border-t border-[#e6decb] relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <p className="text-[#8a6829] text-xs tracking-[0.4em] mb-3 uppercase font-mono font-medium">
              THE OLFACTORY WARDROBE
            </p>
            <h2 className="font-serif text-5xl md:text-6xl text-[#171513] leading-tight">
              Find your signature.
            </h2>
          </div>
          <Link
            href="/collections"
            className="text-[#8a6829] text-xs tracking-[0.3em] hover:text-[#b8860b] transition-colors mt-6 md:mt-0 inline-flex items-center gap-2 border-b border-[#c6a56b]/40 pb-1 font-mono uppercase font-semibold"
          >
            DISCOVER ALL ARCHIVES ↗
          </Link>
        </div>

        {/* Grid with full-bleed luxury editorial cards (edge-to-edge photo, no harsh floating boxes) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {tiles.map((tile) => (
            <Link
              key={tile.name}
              href={tile.href}
              className="group relative aspect-[3/4] overflow-hidden border border-[#e6decb] bg-[#171513] hover:border-[#c6a56b] hover:shadow-[0_16px_40px_rgba(198,165,107,0.25)] transition-all duration-300 rounded-2xl"
            >
              <Image
                src={tile.image}
                alt={tile.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-108"
              />
              {/* Bottom protection gradient for crystal clear text readability */}
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between z-10">
                <div>
                  <span className="text-[10px] tracking-widest uppercase text-[#dfbe7a] font-mono block mb-1 font-bold drop-shadow-sm">
                    {tile.badge}
                  </span>
                  <span className="text-white font-serif text-lg md:text-xl block group-hover:text-[#dfbe7a] transition-colors font-medium drop-shadow-md">
                    {tile.name}
                  </span>
                </div>
                <span className="text-[#dfbe7a] text-lg font-bold group-hover:translate-x-1.5 transition-transform duration-300 drop-shadow-sm">
                  ↗
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
