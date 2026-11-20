"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? "text-[#c6a56b]" : "text-[#e6decb]"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-[#756a5c] text-xs font-mono font-medium">{rating} ({count})</span>
    </div>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { isLiked, toggleLike } = useWishlist();
  const liked = isLiked(product.id);

  const [added, setAdded] = useState(false);
  const [isFlying, setIsFlying] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setIsFlying(true);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("af_cart_bump"));
    }

    setTimeout(() => {
      setIsFlying(false);
    }, 850);

    setTimeout(() => {
      setAdded(false);
    }, 1800);
  };

  return (
    <div className="group relative flex flex-col justify-between border border-[#e6decb] bg-white p-5 hover:border-[#c6a56b] hover:shadow-[0_14px_36px_rgba(198,165,107,0.2)] transition-all duration-300 rounded-2xl">
      
      {/* Flying Particle / "+1" Animation */}
      {isFlying && (
        <div className="absolute z-50 pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-fly-to-bag">
          <div className="flex items-center gap-1 bg-[#c6a56b] text-white px-3 py-1.5 rounded-full font-mono font-bold text-xs shadow-[0_4px_20px_rgba(198,165,107,0.6)] border border-white">
            <span>✦ +1</span>
          </div>
        </div>
      )}

      <div>
        {/* Category, Badge & Like Heart Button */}
        <div className="flex items-center justify-between gap-2 mb-3 min-h-[26px]">
          <div className="flex items-center gap-2">
            <span className="bg-[#f5f0e6] border border-[#d8cfbd] px-2.5 py-0.5 text-[10px] tracking-widest uppercase text-[#8a6829] font-mono font-bold rounded-md">
              {product.category}
            </span>

            {product.badge && (
              <span className="text-[10px] tracking-wider uppercase text-[#171513] font-mono font-semibold bg-[#fdf8ef] border border-[#c6a56b]/50 px-2 py-0.5 rounded-md">
                {product.badge}
              </span>
            )}
          </div>

          {/* Interactive Wishlist Heart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleLike(product.id);
            }}
            className="p-1.5 rounded-full hover:bg-[#f5f0e6] transition-all active:scale-125 cursor-pointer text-[#756a5c] hover:text-red-500 group/heart"
            title={liked ? "Remove from liked" : "Like this fragrance"}
            aria-label="Like fragrance"
          >
            <svg
              className={`w-4 h-4 transition-all ${
                liked
                  ? "fill-red-500 text-red-500 scale-110 drop-shadow-[0_2px_6px_rgba(239,68,68,0.4)]"
                  : "fill-none text-[#8a7e70] group-hover/heart:text-red-500"
              }`}
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>

        {/* Image showcase container with rounded corners and clean background */}
        <Link
          href={`/shop/${product.slug}`}
          className="block relative aspect-[4/5] overflow-hidden bg-[#faf8f5] mb-4 border border-[#eee8db] group-hover:border-[#c6a56b]/50 transition-colors rounded-xl"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Info */}
        <div className="space-y-2 mb-4">
          <StarRating rating={product.rating} count={product.reviews} />

          <div className="flex items-start justify-between gap-2">
            <Link href={`/shop/${product.slug}`}>
              <h3 className="font-serif text-xl text-[#171513] hover:text-[#b8860b] transition-colors leading-snug font-medium">
                {product.name}
              </h3>
            </Link>
            <span className="text-[#b8860b] font-serif text-xl whitespace-nowrap font-bold">
              Rs. {product.price.toLocaleString("en-PK")}
            </span>
          </div>

          <p className="text-[#8a6829] text-[11px] tracking-wider uppercase font-mono font-medium">
            {product.type} · {product.volume}
          </p>

          <p className="text-[#5c5348] text-xs line-clamp-2 leading-relaxed font-light">
            {product.description}
          </p>

          {/* Direct link to read story in Blog */}
          <div className="pt-1 flex items-center justify-between text-[11px] font-mono">
            <Link
              href={`/blog/${product.slug}`}
              className="text-[#8a6829] hover:text-[#171513] hover:underline transition-colors flex items-center gap-1 font-semibold"
            >
              <span>Read Story</span>
              <span>↗</span>
            </Link>
            <Link
              href={`/shop/${product.slug}`}
              className="text-[#756a5c] hover:text-[#8a6829] transition-colors"
            >
              View Details →
            </Link>
          </div>
        </div>
      </div>

      {/* Add To Bag Button */}
      <button
        onClick={handleAdd}
        className={`btn-add-to-bag ${added ? "is-added" : ""}`}
      >
        {added ? "ADDED TO BAG ✓" : "ADD TO BAG +"}
      </button>
    </div>
  );
}
