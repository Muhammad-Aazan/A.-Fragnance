import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { collections, getProductsByCollection } from "@/lib/products";
import ProductCard from "@/components/ui/ProductCard";

export const metadata: Metadata = {
  title: "The Collections — Curated Olfactory Wardrobes",
  description:
    "Explore the Signature Trilogy, Imperial Attars, and Private Reserve creations handcrafted by A. Fragrance.",
  alternates: {
    canonical: "/collections",
  },
  openGraph: {
    title: "Curated Perfume Collections | A. Fragrance",
    description:
      "Distinct expressions of high olfactory art from pure concentrated oils to extraits.",
    images: ["/luxury-flacon.jpg"],
  },
};

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-[#fcfaf7] pt-24 pb-28 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-20 border-b border-[#e6decb] pb-12">
          <p className="text-[#8a6829] text-xs tracking-[0.4em] mb-4 uppercase">
            CURATED ARCHIVES & HOUSES
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-serif text-5xl md:text-7xl text-[#171513] tracking-tight">
                The Collections
              </h1>
              <p className="text-[#756a5c] text-base mt-4 max-w-xl font-light">
                Distinct expressions of high olfactory art. From alcohol-free sacred attar oils to intensely concentrated extraits and private reserve crystal decanters.
              </p>
            </div>
            <Link
              href="/shop"
              className="text-[#8a6829] text-xs tracking-[0.25em] hover:text-[#171513] transition-colors inline-flex items-center gap-2 border-b border-[#c6a56b]/40 pb-1"
            >
              VIEW ENTIRE CATALOG (8) ↗
            </Link>
          </div>
        </div>

        {/* Collections Stack */}
        <div className="space-y-28">
          {collections.map((col, index) => {
            const colProducts = getProductsByCollection(col.slug);

            return (
              <section
                key={col.slug}
                id={col.slug}
                className="border border-[#e6decb] bg-white p-8 md:p-14 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* Collection Editorial Banner */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16 border-b border-[#e6decb] pb-12">
                  <div className="lg:col-span-7 space-y-6">
                    <span className="text-[#8a6829] text-xs tracking-[0.35em] font-mono uppercase">
                      {col.badge}
                    </span>
                    <h2 className="font-serif text-4xl md:text-5xl text-[#171513]">
                      {col.title}
                    </h2>
                    <p className="text-[#c6a56b] text-sm tracking-widest font-serif italic">
                      {col.subtitle}
                    </p>
                    <p className="text-[#3c352d] text-base leading-relaxed font-light max-w-xl">
                      {col.description}
                    </p>
                    <div className="pt-2">
                      <Link
                        href={`/collections/${col.slug}`}
                        className="btn-gold px-7 py-3.5 text-xs tracking-[0.25em] font-medium inline-block"
                      >
                        EXPLORE THIS VAULT ↗
                      </Link>
                    </div>
                  </div>

                  {/* Featured Collection Hero Image */}
                  <div className="lg:col-span-5 relative aspect-[4/3] bg-[#fdf8ef] border border-[#e6decb] overflow-hidden group">
                    <Image
                      src={col.image}
                      alt={col.title}
                      fill
                      className="object-contain p-6 group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>

                {/* Products in this Collection */}
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-[#8a6829] text-xs tracking-[0.3em] uppercase">
                      CURATED CREATIONS ({colProducts.length})
                    </span>
                    <span className="text-[#756a5c] text-xs tracking-widest">
                      COMPLIMENTARY DELIVERY INCLUDED
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {colProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
