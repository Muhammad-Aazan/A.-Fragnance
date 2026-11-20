"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { items, removeItem, updateQty, total, count } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#fcfaf7] pt-24 flex items-center justify-center text-[#171513]">
        <div className="text-center px-6">
          <div className="text-[#c6a56b] font-serif text-6xl mb-6">∅</div>
          <h2 className="font-serif text-4xl text-[#171513] mb-4">Your bag is empty.</h2>
          <p className="text-[#5c5348] text-sm mb-10 max-w-md mx-auto">
            Discover fragrances and concentrated attars that speak before you do.
          </p>
          <Link
            href="/shop"
            className="btn-gold px-8 py-4 text-xs tracking-[0.25em] text-white font-semibold hover:opacity-95 transition-opacity inline-block"
          >
            EXPLORE ALL PERFUMES ↗
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfaf7] pt-24 pb-24 px-6 md:px-12 text-[#171513]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 border-b border-[#e6decb] pb-8">
          <p className="text-[#8a6829] text-xs tracking-[0.4em] mb-3 font-mono font-medium">YOUR SELECTION</p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#171513]">Shopping Bag ({count})</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Items */}
          <div className="lg:col-span-2 space-y-0 divide-y divide-[#e6decb] border-y border-[#e6decb]">
            {items.map((item) => (
              <div key={item.id} className="flex gap-6 py-8">
                {/* Image */}
                <Link href={`/shop/${item.slug}`} className="relative w-24 h-28 flex-shrink-0 bg-white border border-[#e6decb] rounded-[4px] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-contain p-2"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-serif text-xl text-[#171513] font-medium">
                        <Link href={`/shop/${item.slug}`} className="hover:text-[#b8860b] transition-colors">
                          {item.name}
                        </Link>
                      </h3>
                      <p className="text-[#756a5c] text-xs mt-1 font-mono">
                        {item.type} · {item.volume}
                      </p>
                    </div>
                    <span className="text-[#b8860b] font-serif text-xl font-bold">
                      Rs. {(item.price * item.quantity).toLocaleString("en-PK")}
                    </span>
                  </div>

                  <p className="text-[#756a5c] text-xs tracking-widest mb-5 font-mono">{item.tagline}</p>

                  {/* Qty + Remove */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center border border-[#e6decb] bg-white rounded-[2px]">
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="w-9 h-9 text-[#5c5348] hover:text-[#171513] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-9 h-9 flex items-center justify-center text-[#171513] text-sm border-x border-[#e6decb] font-mono font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="w-9 h-9 text-[#5c5348] hover:text-[#171513] transition-colors"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[#756a5c] text-xs tracking-widest hover:text-[#dc2626] transition-colors font-mono font-medium"
                    >
                      REMOVE
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div className="border border-[#e6decb] bg-white p-8 shadow-xs rounded-[4px]">
              <h2 className="font-serif text-2xl text-[#171513] mb-8 font-medium">Order Summary</h2>

              <div className="space-y-4 mb-8 font-mono">
                <div className="flex justify-between text-sm">
                  <span className="text-[#5c5348]">Subtotal</span>
                  <span className="text-[#171513] font-bold">Rs. {total.toLocaleString("en-PK")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#5c5348]">Standard Shipping</span>
                  <span className="text-[#8a6829] text-xs tracking-widest font-semibold">FREE (PAKISTAN)</span>
                </div>
                <div className="border-t border-[#e6decb] pt-4 flex justify-between items-baseline">
                  <span className="text-[#171513] font-medium font-sans">Total</span>
                  <span className="font-serif text-2xl text-[#b8860b] font-bold">
                    Rs. {total.toLocaleString("en-PK")}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full btn-gold py-5 text-xs tracking-[0.25em] text-white font-bold hover:opacity-95 transition-opacity mb-4 block text-center shadow-md rounded-[2px]"
              >
                PROCEED TO CHECKOUT →
              </Link>

              <Link
                href="/shop"
                className="block text-center text-[#756a5c] text-xs tracking-widest hover:text-[#8a6829] transition-colors py-3 font-mono"
              >
                CONTINUE SHOPPING
              </Link>

              {/* Perks */}
              <div className="mt-8 border-t border-[#e6decb] pt-6 space-y-2 font-mono">
                <div className="flex items-center gap-3 text-[#756a5c] text-xs">
                  <span className="text-[#c6a56b]">✦</span>
                  <span>Free insured delivery across Pakistan</span>
                </div>
                <div className="flex items-center gap-3 text-[#756a5c] text-xs">
                  <span className="text-[#c6a56b]">✦</span>
                  <span>Signature white-and-gold luxury packaging</span>
                </div>
                <div className="flex items-center gap-3 text-[#756a5c] text-xs">
                  <span className="text-[#c6a56b]">✦</span>
                  <span>100% Authentic artisanal distillations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
