"use client";

import Link from "next/link";
import { products } from "@/lib/products";
import ProductCard from "@/components/ui/ProductCard";
import { useWishlist } from "@/lib/wishlist-context";

export default function WishlistPage() {
  const { likedIds } = useWishlist();

  const likedProducts = products.filter((p) => likedIds.includes(p.id));

  return (
    <div className="min-h-screen bg-[#fcfaf7] pt-24 pb-28 px-6 md:px-12 text-[#171513]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 border-b border-[#e6decb] pb-8">
          <p className="text-[#8a6829] text-xs tracking-[0.4em] mb-3 uppercase font-mono font-medium">
            YOUR CURATED FAVORITES
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-5xl md:text-6xl text-[#171513]">Liked Fragrances</h1>
              <p className="text-[#5c5348] text-sm mt-2 font-light">
                Your personally liked perfumes and pure artisanal attars saved in your private selection.
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-[#fdf8ef] border border-[#c6a56b]/50 text-[#8a6829] px-4 py-2 rounded-full">
              {likedProducts.length} {likedProducts.length === 1 ? "FRAGRANCE" : "FRAGRANCES"} LIKED
            </span>
          </div>
        </div>

        {/* Content */}
        {likedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {likedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#e6decb] p-16 text-center rounded-2xl shadow-xs max-w-2xl mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#fdf8ef] border border-[#c6a56b]/40 flex items-center justify-center text-red-500 text-2xl">
              ♡
            </div>
            <h3 className="font-serif text-3xl text-[#171513] mb-2 font-medium">No Liked Fragrances Yet</h3>
            <p className="text-[#5c5348] text-sm mb-8 font-light max-w-md mx-auto">
              Tap the heart icon on any perfume or attar card to save your favorite scents here for easy access.
            </p>
            <Link
              href="/shop"
              className="btn-gold inline-block px-8 py-4 text-xs tracking-[0.25em] font-semibold text-white uppercase rounded-xl"
            >
              EXPLORE OUR COLLECTION →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
