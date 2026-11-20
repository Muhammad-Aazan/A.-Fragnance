import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Heritage & Story — The House of A. Fragrance",
  description:
    "Discover the philosophy, wild agarwood harvests, and artisanal distillation behind A. Fragrance extraits and pure sacred attars.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "The House of A. Fragrance — Not Just Worn. Remembered.",
    description:
      "Crafted with rare Assamese agarwood, vintage Taif roses, and sacred distillation rituals.",
    images: ["/about-atelier.jpg"],
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fcfaf7] pt-24">
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] flex items-end overflow-hidden">
        <Image
          src="/about-atelier.jpg"
          alt="Our Perfumery"
          fill
          quality={95}
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#fcfaf7] via-[#fcfaf7]/40 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-8 pb-16 w-full">
          <p className="text-[#8a6829] text-xs tracking-[0.4em] mb-4">THE HOUSE OF A. FRAGRANCE</p>
          <h1 className="font-serif text-6xl md:text-7xl text-[#171513] leading-tight">
            Not just worn.<br />Remembered.
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 px-8 bg-[#fcfaf7]">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#3c352d] text-lg leading-loose mb-10">
            We believe a fragrance is more than a finishing touch. It is a memory in the making.
            A quiet declaration. Something entirely your own.
          </p>
          <p className="text-[#3c352d] text-lg leading-loose mb-10">
            From the depth of oud to the intimacy of attar, each creation brings rare materials
            and considered craftsmanship into perfect balance.
          </p>
          <p className="text-[#3c352d] text-lg leading-loose mb-16">
            A. Fragrance was founded on a simple belief: that the finest fragrances should be
            available to those who seek them — without compromise, without noise, without distraction.
            Only the quiet confidence of exceptional materials, working in harmony.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { num: "2017", label: "Founded" },
              { num: "3", label: "Signature creations" },
              { num: "50+", label: "Rare ingredients sourced" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-[#e6decb] px-10 py-12 text-center rounded-2xl shadow-xs">
                <div className="font-serif text-5xl text-[#c6a56b] mb-3">{stat.num}</div>
                <div className="text-[#171513] font-bold text-xs tracking-[0.3em] font-mono">{stat.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 px-8 bg-[#f7f3eb] border-y border-[#e6decb]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#8a6829] text-xs tracking-[0.4em] mb-6">OUR PHILOSOPHY</p>
              <h2 className="font-serif text-5xl text-[#171513] mb-8">
                The art of leaving an impression.
              </h2>
              <p className="text-[#3c352d] text-base leading-relaxed mb-6">
                Every formulation begins with intention. We ask: what feeling should linger?
                What memory should form? Only then do we begin the work of sourcing, testing,
                and refining — a process that may take years.
              </p>
              <p className="text-[#3c352d] text-base leading-relaxed mb-10">
                The result is never hurried. It is considered. And it is entirely yours.
              </p>
              <Link
                href="/shop"
                className="text-[#8a6829] text-xs tracking-[0.3em] hover:text-[#171513] transition-colors inline-flex items-center gap-3 border-b border-[#c6a56b]/50 pb-2 hover:border-[#8a6829]"
              >
                EXPLORE THE COLLECTION ↗
              </Link>
            </div>
            <div className="relative aspect-square bg-[#fdf8ef] border border-[#e6decb] overflow-hidden rounded-2xl">
              <Image
                src="/luxury-flacon.jpg"
                alt="Luxury Perfume"
                fill
                className="object-contain p-8"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
