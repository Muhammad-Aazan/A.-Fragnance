"use client";

import Link from "next/link";
import { products } from "@/lib/products";
import ProductCard from "@/components/ui/ProductCard";

export default function BestSellers() {
  const curated = [products[0], products[3], products[1], products[7]]; // Oud Noir, Attar Sultan, Amber Elixir, Celestial Oud

  return (
    <section className="py-24 px-6 md:px-12 bg-[#fcfaf7] border-t border-[#e6decb] relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-14 text-center">
          <p className="text-[#8a6829] text-xs tracking-[0.4em] mb-3 uppercase font-mono font-medium">
            THE MOST COVETED CREATIONS
          </p>
          <h2 className="font-serif text-5xl md:text-6xl text-[#171513]">
            Loved. Remembered. Repeated.
          </h2>
          <p className="text-[#5c5348] text-sm mt-3 max-w-md mx-auto font-light">
            Iconic compositions chosen repeatedly by our patrons worldwide for their peerless sillage.
          </p>
        </div>

        {/* Product Grid with Flying Add to Bag Animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {curated.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="btn-outline px-9 py-4 text-xs tracking-[0.25em]"
          >
            EXPLORE THE FULL ARCHIVE (8 CREATIONS) →
          </Link>
        </div>
      </div>
    </section>
  );
}
