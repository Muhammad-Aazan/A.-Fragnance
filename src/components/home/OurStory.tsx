import Image from "next/image";
import Link from "next/link";

export default function OurStory() {
  return (
    <section className="py-24 px-8 bg-[#faf8f5] border-y border-[#e6decb]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] border border-[#e6decb] shadow-md">
            <Image
              src="/4e072261d8eb05697372992567475ceb367cb913.png"
              alt="A. Fragrance Creation"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
          </div>

          {/* Text */}
          <div>
            <p className="text-[#8a6829] text-xs tracking-[0.4em] mb-6 font-mono font-medium">THE HOUSE OF A. FRAGRANCE</p>
            <h2 className="font-serif text-5xl md:text-6xl text-[#171513] leading-tight mb-10">
              Not just worn.<br />Remembered.
            </h2>
            <p className="text-[#5c5348] text-base leading-relaxed mb-6 font-light">
              We believe a fragrance is more than a finishing touch. It is a memory in the making.
              A quiet declaration. Something entirely your own.
            </p>
            <p className="text-[#5c5348] text-base leading-relaxed mb-12 font-light">
              From the depth of oud to the intimacy of attar, each creation brings rare materials
              and considered craftsmanship into perfect balance.
            </p>
            <Link
              href="/about"
              className="text-[#8a6829] text-xs tracking-[0.3em] hover:text-[#b8860b] transition-colors inline-flex items-center gap-3 border-b border-[#c6a56b]/40 pb-2 hover:border-[#c6a56b] font-mono font-semibold"
            >
              DISCOVER OUR STORY ↗
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
