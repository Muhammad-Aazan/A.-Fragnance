"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribedMessage, setSubscribedMessage] = useState("");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setSubscribing(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setSubscribedMessage(data.message || "Welcome to the Inner Circle.");
      setEmail("");
    } catch {
      setSubscribedMessage("Welcome to the Inner Circle.");
      setEmail("");
    } finally {
      setSubscribing(false);
    }
  }

  return (
    <footer className="bg-[#f7f4ec] border-t border-[#e6decb] py-16 px-8 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute bottom-0 right-0 w-[450px] h-[300px] bg-[#c6a56b]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Row: 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Col 1: Brand & Concierge */}
          <div>
            <Link href="/" className="inline-block mb-5 group">
              <div className="relative h-14 w-52 transition-transform group-hover:scale-105 duration-300">
                <Image
                  src="/brand-logo-trimmed.png"
                  alt="A. Fragrance"
                  fill
                  sizes="208px"
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-[#5c5348] text-sm leading-relaxed font-light mt-2 mb-6">
              Luxury perfumes and pure concentrated attars distilled from natural botanical extracts, wild Assam agarwood, and vintage resins.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-xs font-mono font-medium tracking-[0.2em] text-[#8a6829] hover:text-[#171513] transition-colors uppercase border border-[#c6a56b]/40 px-4 py-2 bg-white rounded-sm shadow-xs"
            >
              <span>💬 INQUIRE WITH CONCIERGE →</span>
            </Link>
          </div>

          {/* Col 2: Discover */}
          <div>
            <div className="text-[#8a6829] text-xs tracking-[0.25em] uppercase font-mono mb-6 font-semibold">
              DISCOVER
            </div>
            <ul className="space-y-3">
              {[
                { name: "Shop All Perfumes", href: "/shop" },
                { name: "Scent Stories & Notes", href: "/blog" },
                { name: "The Collections", href: "/collections" },
                { name: "Our Story", href: "/about" },
                { name: "My Saved Wishlist", href: "/wishlist" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-[#5c5348] text-sm hover:text-[#b8860b] transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Customer Care & Inquiries */}
          <div>
            <div className="text-[#8a6829] text-xs tracking-[0.25em] uppercase font-mono mb-6 font-semibold">
              CUSTOMER CARE
            </div>
            <ul className="space-y-3">
              {[
                { name: "Submit an Inquiry / Concierge", href: "/contact" },
                { name: "Sign In", href: "/login" },
                { name: "Create Account", href: "/signup" },
                { name: "My Orders & Profile", href: "/account" },
                { name: "Shopping Bag", href: "/cart" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-[#5c5348] text-sm hover:text-[#b8860b] transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Newsletter Subscription */}
          <div>
            <div className="text-[#8a6829] text-xs tracking-[0.25em] uppercase font-mono mb-3 font-semibold">
              THE INNER CIRCLE
            </div>
            <p className="text-[#5c5348] text-xs leading-relaxed font-light mb-4">
              Subscribe for private extrait releases, vintage harvest chronicles, and exclusive invitations.
            </p>

            {subscribedMessage ? (
              <div className="border border-[#c6a56b] bg-white p-4 rounded-sm text-center">
                <span className="text-[#c6a56b] font-serif text-lg block mb-1">✦</span>
                <p className="text-[#171513] text-xs font-serif font-medium">{subscribedMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  required
                  className="w-full bg-white border border-[#e6decb] px-3.5 py-2.5 text-xs text-[#171513] placeholder-[#9e9384] focus:outline-none focus:border-[#c6a56b] transition-colors rounded-sm"
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="w-full btn-gold py-2.5 text-[11px] tracking-[0.2em] font-medium uppercase rounded-sm"
                >
                  {subscribing ? "SUBSCRIBING..." : "SUBSCRIBE TO CIRCLE →"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="border-t border-[#e6decb] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#756a5c] text-xs font-mono">
            © 2026 A. Fragrance. Karachi · Lahore · Islamabad. Nationwide Delivery across Pakistan.
          </p>
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            <Link href="/about" className="text-[#756a5c] text-xs hover:text-[#b8860b] transition-colors">Privacy Policy</Link>
            <span className="text-[#e6decb]">/</span>
            <Link href="/about" className="text-[#756a5c] text-xs hover:text-[#b8860b] transition-colors">Terms of Service</Link>
            <span className="text-[#e6decb]">•</span>
            <div className="flex flex-wrap items-center gap-2 text-[#8a6829] text-[11px] font-mono font-semibold">
              <span className="border border-[#e6decb] px-2.5 py-1 rounded bg-white shadow-xs">Cash on Delivery</span>
              <span className="border border-[#e6decb] px-2.5 py-1 rounded bg-white shadow-xs">Bank Transfer</span>
              <span className="border border-[#e6decb] px-2.5 py-1 rounded bg-white shadow-xs">Visa / Mastercard</span>
              <span className="border border-[#e6decb] px-2.5 py-1 rounded bg-white shadow-xs">JazzCash / EasyPaisa</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
