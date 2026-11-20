"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";

export default function Navbar() {
  const pathname = usePathname();
  const { count } = useCart();
  const { likeCount } = useWishlist();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [isCartBumping, setIsCartBumping] = useState(false);

  const checkUser = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("af_user");
      if (stored) {
        try {
          const u = JSON.parse(stored);
          setUserName(u.name ? u.name.split(" ")[0] : "Account");
          return;
        } catch {}
      }
      setUserName(null);
    }
  };

  useEffect(() => {
    checkUser();
    window.addEventListener("af_auth_change", checkUser);
    
    const handleBump = () => {
      setIsCartBumping(true);
      setTimeout(() => setIsCartBumping(false), 900);
    };
    window.addEventListener("af_cart_bump", handleBump);

    return () => {
      window.removeEventListener("af_auth_change", checkUser);
      window.removeEventListener("af_cart_bump", handleBump);
    };
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Stories", href: "/blog" },
    { label: "Collections", href: "/collections" },
    { label: "About", href: "/about" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-[#e6decb] shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between h-[76px]">
        {/* Brand Logo with User's Official Emblem */}
        <Link href="/" className="flex items-center gap-3 group py-1">
          <div className="relative h-12 w-44 md:w-48 transition-transform group-hover:scale-105 duration-300">
            <Image
              src="/brand-logo-trimmed.png"
              alt="A. Fragrance - Scents Beyond Time"
              fill
              sizes="(max-width: 768px) 176px, 192px"
              priority
              className="object-contain object-left"
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`relative py-2 text-[11px] uppercase tracking-[0.2em] transition-all duration-200 ${
                  isActive
                    ? "text-[#b8860b] font-semibold"
                    : "text-[#52493e] hover:text-[#b8860b]"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c6a56b] to-transparent shadow-[0_0_8px_rgba(198,165,107,0.6)]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link
            href="/shop"
            className="text-[11px] font-mono tracking-[0.18em] uppercase text-[#52493e] hover:text-[#b8860b] transition-colors hidden sm:block font-medium"
          >
            Search
          </Link>

          {/* Wishlist / Liked Fragrances Link with Counter */}
          <Link
            href="/wishlist"
            className="relative flex items-center justify-center w-9 h-9 rounded-full border border-[#c6a56b]/50 text-[#8a6829] hover:text-[#b8860b] hover:border-[#b8860b] hover:bg-[#fdf8ef] transition-all group"
            title="Saved Fragrances (Wishlist)"
          >
            <svg
              className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                likeCount > 0 ? "fill-[#dc2626] text-[#dc2626]" : "fill-none stroke-current stroke-2"
              }`}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            {likeCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#dc2626] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold font-mono shadow-xs">
                {likeCount}
              </span>
            )}
          </Link>

          {userName ? (
            <Link
              href="/account"
              className="text-[11px] font-mono tracking-[0.18em] uppercase text-[#8a6829] hover:underline flex items-center gap-2 font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-[#c6a56b] shadow-[0_0_6px_rgba(198,165,107,0.7)]" />
              <span>{userName}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-[11px] font-mono tracking-[0.18em] uppercase text-[#52493e] hover:text-[#b8860b] transition-colors font-medium hidden sm:block"
            >
              Sign In
            </Link>
          )}

          {/* Luxury Animated Bag Link */}
          <Link
            href="/cart"
            id="navbar-bag-link"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#c6a56b]/60 bg-[#faf6ee] text-xs font-mono tracking-widest text-[#8a6829] font-semibold transition-all duration-300 ${
              isCartBumping
                ? "animate-cart-bump border-[#c6a56b] bg-[#c6a56b] text-white shadow-[0_0_20px_rgba(198,165,107,0.7)]"
                : "hover:border-[#c6a56b] hover:bg-[#c6a56b] hover:text-white hover:shadow-[0_2px_12px_rgba(198,165,107,0.25)]"
            }`}
          >
            <span>BAG</span>
            <span className="bg-[#c6a56b] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold font-mono">
              {count}
            </span>
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-[#52493e] hover:text-[#b8860b] text-xl p-1"
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#e6decb] bg-white px-8 py-6 space-y-4 shadow-xl">
          {navLinks.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`block text-xs uppercase tracking-[0.2em] py-2 transition-colors ${
                  isActive
                    ? "text-[#b8860b] font-bold"
                    : "text-[#52493e] hover:text-[#b8860b]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-[#e6decb] space-y-3">
            <Link
              href="/wishlist"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between text-xs uppercase tracking-widest text-[#8a6829] font-mono font-bold"
            >
              <span>Saved Perfumes (Wishlist)</span>
              <span className="bg-[#dc2626] text-white text-[10px] px-2 py-0.5 rounded-full">
                {likeCount}
              </span>
            </Link>
            <div className="flex items-center justify-between pt-2">
              {userName ? (
                <Link
                  href="/account"
                  onClick={() => setMenuOpen(false)}
                  className="text-xs uppercase tracking-widest text-[#8a6829] font-mono font-bold"
                >
                  My Account ({userName})
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-xs uppercase tracking-widest text-[#52493e] font-mono"
                >
                  Sign In / Create Account
                </Link>
              )}
              <Link
                href="/cart"
                onClick={() => setMenuOpen(false)}
                className="text-xs uppercase tracking-widest text-[#8a6829] font-mono font-bold"
              >
                Bag ({count})
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
