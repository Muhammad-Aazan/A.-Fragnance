"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { products } from "@/lib/products";
import ProductCard from "@/components/ui/ProductCard";

const categories = [
  "All",
  "Perfumes",
  "Attars",
  "Oud",
  "Luxury Editions",
];

const scentProfiles = [
  "All Notes",
  "Woody & Smoky",
  "Warm Amber",
  "Floral & Rose",
  "Royal Musk",
  "Sensual Vanilla",
];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProfile, setSelectedProfile] = useState("All Notes");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== "All" && p.category !== selectedCategory) {
          return false;
        }
        // Scent profile filter
        if (
          selectedProfile !== "All Notes" &&
          (!p.scentProfile || !p.scentProfile.includes(selectedProfile))
        ) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchTagline = p.tagline.toLowerCase().includes(q);
          const matchNotes = [
            ...p.opening,
            ...p.heart,
            ...p.trail,
          ].some((note) => note.toLowerCase().includes(q));
          if (!matchName && !matchTagline && !matchNotes) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [selectedCategory, selectedProfile, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#fcfaf7] pt-24 pb-28 px-6 md:px-12 text-[#171513]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 border-b border-[#e6decb] pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-[#8a6829] text-xs tracking-[0.4em] mb-3 uppercase font-mono font-medium">
                THE BOUTIQUE CATALOG
              </p>
              <h1 className="font-serif text-5xl md:text-6xl text-[#171513]">
                Rare Fragrances & Attars
              </h1>
              <p className="text-[#5c5348] text-sm mt-3 max-w-lg font-light">
                Handcrafted extraits, wild aged agarwood distillations, and concentrated alcohol-free attars.
              </p>
            </div>

            {/* Quick Collections Link */}
            <div className="text-right">
              <Link
                href="/collections"
                className="text-xs text-[#8a6829] tracking-[0.25em] hover:text-[#b8860b] transition-colors border border-[#c6a56b]/50 bg-white px-5 py-3 inline-block font-mono font-semibold rounded-[2px] shadow-xs"
              >
                VIEW THEMED VAULTS (3) ↗
              </Link>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar Control Suite (Dark, Crisp High-Contrast Fonts & Rounded Borders) */}
        <div className="bg-white border border-[#d8cfbd] p-6 md:p-7 mb-12 space-y-6 shadow-sm rounded-2xl">
          {/* Top row: Search & Sort */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search notes (e.g. Oud, Saffron, Rose, Sandalwood)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#fdfaf5] border border-[#c8beaa] px-4 py-3 text-sm text-[#171513] placeholder-[#5c5348] font-medium focus:border-[#8a6829] focus:bg-white outline-none transition-colors rounded-xl shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-3.5 text-[#171513] hover:text-[#8a6829] font-bold text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#171513] font-bold tracking-widest uppercase font-mono">SORT BY:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-[#fdfaf5] border border-[#c8beaa] text-[#171513] text-xs font-semibold tracking-wider px-4 py-3 outline-none focus:border-[#8a6829] focus:bg-white rounded-xl shadow-xs cursor-pointer"
              >
                <option value="featured">House Curation</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated ★</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div>
            <div className="text-xs text-[#171513] tracking-[0.25em] uppercase mb-3 font-mono font-bold">
              CATEGORIES
            </div>
            <div className="flex flex-wrap gap-2.5">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      backgroundColor: isActive ? "#171513" : "#f4efe4",
                      color: isActive ? "#ffffff" : "#171513",
                      borderColor: isActive ? "#171513" : "#d8cfbd",
                    }}
                    className={`px-5 py-2.5 text-xs tracking-wider border rounded-xl cursor-pointer font-bold transition-all shadow-xs ${
                      isActive ? "shadow-md scale-[1.02]" : "hover:bg-white hover:border-[#171513]"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scent Profile Filter Pills */}
          <div className="border-t border-[#e6decb] pt-5">
            <div className="text-xs text-[#171513] tracking-[0.25em] uppercase mb-3 font-mono font-bold">
              SCENT NOTES PROFILE
            </div>
            <div className="flex flex-wrap gap-2">
              {scentProfiles.map((scent) => {
                const isActive = selectedProfile === scent;
                return (
                  <button
                    key={scent}
                    onClick={() => setSelectedProfile(scent)}
                    style={{
                      backgroundColor: isActive ? "#171513" : "#f4efe4",
                      color: isActive ? "#ffffff" : "#171513",
                      borderColor: isActive ? "#171513" : "#d8cfbd",
                    }}
                    className={`px-4 py-2 text-xs tracking-wider border rounded-full cursor-pointer font-semibold transition-all shadow-xs ${
                      isActive ? "shadow-md scale-[1.02]" : "hover:bg-white hover:border-[#171513]"
                    }`}
                  >
                    {scent}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Counter & Active Filters Bar */}
        <div className="flex items-center justify-between mb-8 text-xs text-[#171513] font-mono font-semibold">
          <span>
            SHOWING <strong className="text-[#8a6829] font-bold">{filteredProducts.length}</strong> OF {products.length} CREATIONS
          </span>
          {(selectedCategory !== "All" || selectedProfile !== "All Notes" || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedProfile("All Notes");
                setSearchQuery("");
              }}
              className="text-[#8a6829] hover:text-[#171513] hover:underline tracking-widest uppercase font-bold"
            >
              RESET ALL FILTERS ✕
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="border border-[#e6decb] bg-white p-16 text-center shadow-xs rounded-2xl">
            <div className="text-[#c6a56b] font-serif text-5xl mb-4">∅</div>
            <h3 className="font-serif text-3xl text-[#171513] mb-2">No Fragrances Found</h3>
            <p className="text-[#5c5348] text-sm mb-6">
              No creations match the selected scent profile and search parameters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedProfile("All Notes");
                setSearchQuery("");
              }}
              className="btn-gold px-8 py-3.5 text-xs tracking-[0.25em] text-white font-semibold"
            >
              CLEAR FILTERS
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
