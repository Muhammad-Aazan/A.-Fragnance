import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { products, getProductBySlug } from "@/lib/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Story | A. Fragrance",
    };
  }

  const siteUrl = process.env.NEXTAUTH_URL || "https://afragrance.pk";
  const storyUrl = `${siteUrl}/blog/${product.slug}`;

  return {
    title: `The Legend of ${product.name} — Scent Chronicles`,
    description: product.story,
    alternates: {
      canonical: storyUrl,
    },
    openGraph: {
      title: `The Legend of ${product.name} | A. Fragrance Journal`,
      description: product.story,
      url: storyUrl,
      images: [
        {
          url: product.image,
          width: 800,
          height: 1000,
          alt: product.name,
        },
      ],
      type: "article",
    },
  };
}

export default async function PerfumeStoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  // Find related stories
  const otherStories = products.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <article className="min-h-screen bg-[#fcfaf7] pt-24 pb-28 text-[#171513]">
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#756a5c] tracking-widest mb-10 font-mono">
          <Link href="/" className="hover:text-[#8a6829] transition-colors">HOME</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#8a6829] transition-colors">JOURNAL</Link>
          <span>/</span>
          <span className="text-[#171513] font-medium">{product.name.toUpperCase()}</span>
        </nav>

        {/* Article Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-[#fdf8ef] border border-[#c6a56b]/40 px-3.5 py-1 rounded-full text-[10px] tracking-widest font-mono uppercase text-[#8a6829] font-bold mb-4">
            <span>THE SCENT CHRONICLES</span>
            <span>·</span>
            <span>{product.category}</span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl text-[#171513] leading-tight mb-4">
            The Legend of {product.name}
          </h1>

          <p className="text-lg md:text-xl text-[#8a6829] font-serif italic mb-6">
            "{product.tagline}"
          </p>

          <div className="flex flex-wrap items-center gap-6 text-xs text-[#756a5c] font-mono border-y border-[#e6decb] py-3.5">
            <span>By Master Perfumer of A. Fragrance</span>
            <span>·</span>
            <span>5 Minute Read</span>
            <span>·</span>
            <span>Batch Recorded in Vault</span>
          </div>
        </div>

        {/* Hero Perfume Image Frame */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-[#e6decb] bg-[#faf8f5] shadow-md mb-12">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 800px"
            className="object-cover"
          />
        </div>

        {/* Narrative Content */}
        <div className="space-y-8 text-base md:text-lg leading-relaxed text-[#3c352d] font-light">
          <p className="first-letter:font-serif first-letter:text-6xl first-letter:float-left first-letter:mr-3 first-letter:text-[#8a6829] first-letter:leading-none">
            {product.story}
          </p>

          <p>
            Every bottle of <strong>{product.name}</strong> begins not in a laboratory, but in the field. Sourcing ingredients of this caliber requires patience measured not in days, but in decades. The raw botanical and resin distillations are sourced directly from sustainable family-run groves, where age-old ancestral techniques have been preserved through generations.
          </p>

          {/* Blockquote */}
          <blockquote className="my-10 border-l-4 border-[#c6a56b] pl-6 py-2 bg-[#faf6ee] rounded-r-xl">
            <p className="font-serif text-2xl md:text-3xl text-[#171513] italic font-normal leading-snug">
              "We do not create fragrances to blend into a room. We formulate them so the air itself preserves the memory of your passage."
            </p>
            <footer className="text-xs text-[#8a6829] font-mono mt-3 uppercase tracking-widest font-bold">
              — House of A. Fragrance Philosophy
            </footer>
          </blockquote>

          <h2 className="font-serif text-3xl md:text-4xl text-[#171513] pt-6 font-medium">
            The Olfactory Architecture
          </h2>

          <p>
            The construction of {product.name} follows a harmonious three-stage progression, designed to evolve on the skin over 14 to 24 hours without diminishing in sillage:
          </p>

          {/* Notes Breakdown Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
            <div className="bg-white border border-[#e6decb] p-6 rounded-2xl shadow-xs">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#8a6829] font-bold block mb-1">
                STAGE 01
              </span>
              <h3 className="font-serif text-xl text-[#171513] mb-2 font-medium">Top Notes</h3>
              <p className="text-xs text-[#5c5348] font-mono">{product.opening.join(", ")}</p>
              <p className="text-xs text-[#756a5c] mt-2 font-light">
                The immediate greeting. Vibrant, crisp, awakening the senses.
              </p>
            </div>

            <div className="bg-white border border-[#e6decb] p-6 rounded-2xl shadow-xs">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#8a6829] font-bold block mb-1">
                STAGE 02
              </span>
              <h3 className="font-serif text-xl text-[#171513] mb-2 font-medium">Heart Notes</h3>
              <p className="text-xs text-[#5c5348] font-mono">{product.heart.join(", ")}</p>
              <p className="text-xs text-[#756a5c] mt-2 font-light">
                The emotional core. Unfolds after 15 minutes and endures through the day.
              </p>
            </div>

            <div className="bg-white border border-[#e6decb] p-6 rounded-2xl shadow-xs">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#8a6829] font-bold block mb-1">
                STAGE 03
              </span>
              <h3 className="font-serif text-xl text-[#171513] mb-2 font-medium">Base Notes</h3>
              <p className="text-xs text-[#5c5348] font-mono">{product.trail.join(", ")}</p>
              <p className="text-xs text-[#756a5c] mt-2 font-light">
                The lingering sillage. Deep balsamic resins and precious woods.
              </p>
            </div>
          </div>

          <h2 className="font-serif text-3xl md:text-4xl text-[#171513] pt-6 font-medium">
            How to Wear {product.name}
          </h2>

          <p>
            {product.category === "Attars"
              ? "For pure concentrated attar oils, apply a single drop onto pulse points using the applicator wand: inside the wrists, behind the ears, and along the collarbone. Never rub the oil; allow your skin's natural warmth to release its complex facets organically."
              : "For extraits de parfum, 2 to 3 sprays upon pulse points provide a refined, room-commanding aura that will last from morning into the late evening."}
          </p>
        </div>

        {/* Embedded Acquisition Banner */}
        <div className="my-14 bg-white border-2 border-[#c6a56b]/60 p-8 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="relative w-24 h-28 flex-shrink-0 bg-[#faf8f5] rounded-xl overflow-hidden border border-[#eee8db]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <span className="text-[10px] text-[#8a6829] tracking-widest font-mono uppercase font-bold">
              EXPERIENCE THE CREATION
            </span>
            <h3 className="font-serif text-2xl text-[#171513] font-semibold">{product.name}</h3>
            <p className="text-xs text-[#756a5c] font-mono">
              {product.type} · {product.volume} · Rated {product.rating} ★ ({product.reviews} reviews)
            </p>
            <p className="font-serif text-2xl text-[#b8860b] font-bold mt-1">
              Rs. {product.price.toLocaleString("en-PK")}
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <Link
              href={`/shop/${product.slug}`}
              className="btn-gold px-8 py-4 text-xs tracking-widest font-bold uppercase text-center rounded-xl"
            >
              VIEW DETAILS & ORDER →
            </Link>
          </div>
        </div>

        {/* Read More Stories */}
        <div className="pt-12 border-t border-[#e6decb]">
          <h3 className="font-serif text-2xl text-[#171513] mb-6 font-medium">
            Discover Other Fragrance Stories
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {otherStories.map((other) => (
              <Link
                key={other.slug}
                href={`/blog/${other.slug}`}
                className="group bg-white border border-[#e6decb] hover:border-[#8a6829] p-4 rounded-xl shadow-xs transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[#faf8f5] mb-3">
                  <Image
                    src={other.image}
                    alt={other.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div>
                  <span className="text-[9px] text-[#8a6829] font-mono uppercase font-bold block mb-1">
                    {other.category}
                  </span>
                  <h4 className="font-serif text-lg text-[#171513] group-hover:text-[#b8860b] transition-colors font-medium">
                    {other.name}
                  </h4>
                  <p className="text-xs text-[#756a5c] font-mono mt-1">
                    Rs. {other.price.toLocaleString("en-PK")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
