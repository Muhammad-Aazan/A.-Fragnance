"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/products";

export default function BlogIndexPage() {
  const [selectedCat, setSelectedCat] = useState("All");

  const categories = ["All", "Perfumes", "Attars", "Oud", "Luxury Editions"];

  const filtered = selectedCat === "All"
    ? products
    : products.filter((p) => p.category === selectedCat);

  return (
    <div className="min-h-screen bg-[#fcfaf7] pt-24 pb-28 px-6 md:px-12 text-[#171513]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-14 text-center max-w-3xl mx-auto">
          <p className="text-[#8a6829] text-xs tracking-[0.4em] mb-3 uppercase font-mono font-bold">
            THE SCENT JOURNAL & FRAGRANCE STORIES
          </p>
          <h1 className="font-serif text-5xl md:text-7xl text-[#171513] leading-tight mb-4">
            The Story Behind Every Fragrance
          </h1>
          <p className="text-[#5c5348] text-base font-light leading-relaxed">
            Delve into the botanical journeys, vintage distillations, and artistic inspiration behind each creation of A. Fragrance. From high-mountain Taif roses to twenty-five-year aged Assam agarwood.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-5 py-2 text-xs tracking-wider border rounded-xl font-semibold transition-all cursor-pointer ${
                selectedCat === cat
                  ? "bg-[#171513] text-white border-[#171513] shadow-md"
                  : "bg-white text-[#171513] border-[#d8cfbd] hover:border-[#171513]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item) => (
            <article
              key={item.slug}
              className="group bg-white border border-[#e6decb] hover:border-[#c6a56b] rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <Link href={`/blog/${item.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-[#faf8f5]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-[#171513]/85 text-[#dfbe7a] text-[10px] tracking-widest font-mono uppercase px-3 py-1 rounded-md backdrop-blur-xs font-bold">
                    {item.category}
                  </div>
                </Link>

                {/* Article Header */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-[11px] text-[#8a6829] font-mono mb-2 uppercase">
                    <span>Artisan Story</span>
                    <span>·</span>
                    <span>{item.volume}</span>
                    <span>·</span>
                    <span>Rs. {item.price.toLocaleString("en-PK")}</span>
                  </div>

                  <Link href={`/blog/${item.slug}`}>
                    <h2 className="font-serif text-2xl text-[#171513] group-hover:text-[#b8860b] transition-colors font-medium leading-snug mb-3">
                      The Soul of {item.name}: {item.tagline}
                    </h2>
                  </Link>

                  <p className="text-[#5c5348] text-sm leading-relaxed font-light line-clamp-3 mb-4">
                    {item.story}
                  </p>

                  {/* Notes Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#f0ece2]">
                    {[...item.opening, ...item.heart.slice(0, 1)].map((note) => (
                      <span
                        key={note}
                        className="bg-[#faf6ee] text-[#8a6829] border border-[#e6decb] text-[10px] font-mono px-2 py-0.5 rounded"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer CTAs */}
              <div className="p-6 pt-0 border-t border-transparent flex items-center justify-between">
                <Link
                  href={`/blog/${item.slug}`}
                  className="text-xs text-[#8a6829] font-mono font-bold tracking-wider hover:text-[#171513] flex items-center gap-1"
                >
                  <span>Read Full Story</span>
                  <span>→</span>
                </Link>

                <Link
                  href={`/shop/${item.slug}`}
                  className="text-xs text-[#171513] font-mono hover:text-[#b8860b] underline"
                >
                  View Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
