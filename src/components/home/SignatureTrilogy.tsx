import Image from "next/image";
import Link from "next/link";

const trilogy = [
  {
    badge: "01",
    tagline: "SMOKY · WOODY · INTENSE",
    name: "Oud Noir",
    description:
      "Darkness, with a golden soul. Rare Assamese agarwood unfolds through saffron and velvet rose before settling into a lingering embrace of smoky sandalwood and worn Tuscan leather.",
    slug: "oud-noir",
    image: "/luxury-flacon.jpg",
  },
  {
    badge: "02",
    tagline: "WARM · AMBER · SENSUAL",
    name: "Amber Elixir",
    description:
      "Golden fossil amber at its purest. A composition that wraps the skin in rich Bourbon vanilla, cardamom pods, and a trail that lingers like a secret whispered close in candlelit salons.",
    slug: "amber-elixir",
    image: "/cbc113c162329708705a8c9d568dfb40f3e40664.png",
  },
  {
    badge: "03",
    tagline: "SOFT · MUSKY · REGAL",
    name: "Royal Musk",
    description:
      "A fragrance of commanding stillness. Opens with crisp bergamot and green cardamom, before revealing the quiet confidence of Florentine iris and a trail of pure, skin-close crystalline musk.",
    slug: "royal-musk",
    image: "/5fcd58373e5d8421f1bba0b6212df03fde048044.png",
  },
];

export default function SignatureTrilogy() {
  return (
    <section className="py-24 px-6 md:px-12 bg-[#fcfaf7] border-y border-[#e6decb] relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="text-[#8a6829] text-xs tracking-[0.4em] mb-3 uppercase font-mono font-medium">
            THE SIGNATURE TRILOGY
          </p>
          <h2 className="font-serif text-5xl md:text-6xl text-[#171513]">
            Three expressions. One obsession.
          </h2>
        </div>

        {/* Cards with rounded corners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trilogy.map((item) => (
            <div
              key={item.slug}
              className="bg-white p-8 md:p-10 flex flex-col group hover:bg-[#faf8f5] border border-[#e6decb] hover:border-[#c6a56b] hover:shadow-[0_14px_36px_rgba(198,165,107,0.2)] transition-all duration-300 rounded-2xl"
            >
              {/* Badge */}
              <div className="text-[#c6a56b]/35 font-serif text-6xl leading-none mb-6 group-hover:text-[#c6a56b] transition-colors">
                {item.badge}
              </div>

              {/* Image */}
              <div className="relative w-full aspect-[4/5] mb-6 overflow-hidden bg-[#faf8f5] border border-[#eee8db] group-hover:border-[#c6a56b]/50 transition-colors rounded-xl">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Info */}
              <p className="text-[#8a6829] text-xs tracking-[0.25em] mb-2 font-mono uppercase font-medium">
                {item.tagline}
              </p>
              <h3 className="font-serif text-3xl text-[#171513] mb-3 group-hover:text-[#b8860b] transition-colors">
                {item.name}
              </h3>
              <p className="text-[#5c5348] text-sm leading-relaxed mb-8 flex-1 font-light">
                {item.description}
              </p>

              {/* CTA */}
              <Link
                href={`/shop/${item.slug}`}
                className="text-[#8a6829] text-xs tracking-[0.25em] hover:text-[#b8860b] transition-colors inline-flex items-center gap-2 uppercase font-mono font-semibold"
              >
                EXPLORE {item.name.toUpperCase()} ↗
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
