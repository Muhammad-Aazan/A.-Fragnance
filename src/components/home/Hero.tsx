"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const heroSlides = [
  {
    index: "01",
    total: "03",
    name: "OUD NOIR",
    slug: "oud-noir",
    tagline: "SMOKY · WOODY · INTENSE",
    concentration: "EXTRAIT DE PARFUM (25%)",
    volume: "50 ML",
    price: 18500,
    image: "/luxury-flacon.jpg",
    notes: ["Wild Assam Oud", "Saffron Threads", "Bulgarian Rose", "Smoky Sandalwood"],
    description: "Darkness with a golden soul. Rare Assam agarwood aged for 20 years, unfolding through saffron and velvet rose before settling into an unforgettable trail.",
    badge: "SIGNATURE FLAGSHIP",
  },
  {
    index: "02",
    total: "03",
    name: "AMBER ELIXIR",
    slug: "amber-elixir",
    tagline: "WARM · AMBER · SENSUAL",
    concentration: "EXTRAIT DE PARFUM (25%)",
    volume: "50 ML",
    price: 16500,
    image: "/cbc113c162329708705a8c9d568dfb40f3e40664.png",
    notes: ["Golden Fossil Amber", "Crushed Cardamom", "Bourbon Vanilla", "White Musk"],
    description: "Golden amber at its purest. Wraps the wearer in tactile warmth like an opulent secret whispered in candlelit Mayfair salons.",
    badge: "HOUSE FAVORITE",
  },
  {
    index: "03",
    total: "03",
    name: "ROYAL MUSK",
    slug: "royal-musk",
    tagline: "SOFT · MUSKY · REGAL",
    concentration: "EXTRAIT DE PARFUM (25%)",
    volume: "50 ML",
    price: 17500,
    image: "/5fcd58373e5d8421f1bba0b6212df03fde048044.png",
    notes: ["Green Bergamot", "Florentine Iris", "Crystalline Musk", "Virginian Cedar"],
    description: "A commanding declaration of royal quiet confidence. Clean green top notes yielding to velvety skin-close crystalline musk.",
    badge: "ROYAL ARCHIVE",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slide = heroSlides[current];

  // Auto transition every 6 seconds, paused on hover
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % heroSlides.length);
  };

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full min-h-[86vh] bg-gradient-to-b from-[#ffffff] via-[#fcfaf7] to-[#f7f3eb] flex flex-col justify-center overflow-hidden py-12 md:py-20"
    >
      {/* Radiant ambient lighting & gold aura (White/Gold Theme) */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-[#dfbe7a]/20 via-[#c6a56b]/15 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-[#c6a56b]/12 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-10 left-1/3 w-[350px] h-[350px] bg-[#dfbe7a]/15 rounded-full blur-[110px] pointer-events-none" />

      {/* Main hero grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center w-full">
          
          {/* Left Column: Headline, Story & Clean CTAs */}
          <div className="lg:col-span-7 space-y-7">
            {/* Headline */}
            <h1 className="font-serif text-[clamp(3.4rem,6.8vw,6.5rem)] leading-[0.94] text-[#171513] tracking-tight">
              DEFINE YOUR<br />
              <span className="italic font-light text-gold-gradient">PRESENCE</span>
            </h1>

            <p className="text-[#52493e] text-base md:text-lg leading-relaxed max-w-xl font-light">
              Crafted from wild Assamese agarwood, dewy Taif roses, and vintage distillates. Fragrances designed to captivate the room before a single word is spoken.
            </p>

            {/* Current Slide Highlight & CTAs */}
            <div className="pt-2 space-y-5">
              <div className="flex items-center gap-3 text-xs font-mono tracking-widest text-[#8a6829] uppercase">
                <span className="font-bold text-[#171513] font-serif text-base">{slide.name}</span>
                <span>·</span>
                <span>{slide.concentration}</span>
                <span>·</span>
                <span className="font-bold text-[#b8860b]">Rs. {slide.price.toLocaleString("en-PK")}</span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href={`/shop/${slide.slug}`}
                  className="btn-gold px-9 py-4 text-xs tracking-[0.22em] font-semibold"
                >
                  ORDER {slide.name} ↗
                </Link>
                <Link
                  href="/shop"
                  className="btn-outline px-8 py-4 text-xs tracking-[0.2em]"
                >
                  EXPLORE ALL PERFUMES
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Flacon Showcase with Increased Arrow Gap and White Arrows */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative w-full max-w-[420px] aspect-[4/5] flex items-center justify-center">
              
              {/* Radiant Radial Backlight Glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#c6a56b]/25 via-[#dfbe7a]/15 to-transparent rounded-full filter blur-3xl transform scale-95" />
              
              {/* Circular Decorative Luxury Pedestals */}
              <div className="absolute w-[340px] h-[340px] rounded-full border border-[#c6a56b]/35 shadow-[0_0_30px_rgba(198,165,107,0.15)] pointer-events-none" />
              <div className="absolute w-[380px] h-[380px] rounded-full border border-[#e6decb] pointer-events-none" />
              <div className="absolute w-[420px] h-[420px] rounded-full border border-[#e6decb]/60 pointer-events-none" />

              {/* The Perfume Bottle Image with smooth transition */}
              <div className="relative w-full h-full p-4 flex items-center justify-center transition-all duration-700 transform hover:scale-105 cursor-pointer">
                <Link href={`/shop/${slide.slug}`} className="relative w-full h-full block">
                  <Image
                    key={slide.slug}
                    src={slide.image}
                    alt={slide.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="object-contain object-center drop-shadow-[0_25px_40px_rgba(0,0,0,0.18)] animate-fadeIn"
                    priority
                  />
                </Link>
              </div>

              {/* CAROUSEL NAVIGATION ARROWS — HIGH CONTRAST & BOLD ICONS */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous Slide"
                className="absolute left-[-24px] sm:left-[-44px] md:left-[-64px] top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#171513] border-2 border-[#c6a56b] text-[#dfbe7a] flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:bg-[#c6a56b] hover:text-[#171513] hover:border-[#dfbe7a] hover:scale-110 active:scale-95 transition-all duration-300 group"
              >
                <svg className="w-6 h-6 stroke-current transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next Slide"
                className="absolute right-[-24px] sm:right-[-44px] md:right-[-64px] top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#171513] border-2 border-[#c6a56b] text-[#dfbe7a] flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:bg-[#c6a56b] hover:text-[#171513] hover:border-[#dfbe7a] hover:scale-110 active:scale-95 transition-all duration-300 group"
              >
                <svg className="w-6 h-6 stroke-current transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Floating detail badge */}
              <div className="absolute bottom-4 right-4 bg-white/95 border border-[#e6decb] backdrop-blur-md px-4 py-2.5 text-right shadow-xl">
                <div className="text-[#171513] font-serif text-base tracking-wide font-semibold leading-tight">
                  {slide.name}
                </div>
                <div className="text-[#8a6829] text-[10px] tracking-widest uppercase font-mono mt-0.5 font-medium">
                  {slide.volume} · {slide.concentration}
                </div>
              </div>
            </div>

            {/* Slide Pagination Dots with Progress Indicator */}
            <div className="flex items-center gap-3 mt-6">
              {heroSlides.map((item, idx) => (
                <button
                  key={item.slug}
                  onClick={() => setCurrent(idx)}
                  className={`h-2 transition-all duration-500 rounded-full ${
                    current === idx
                      ? "w-10 bg-[#c6a56b] shadow-[0_2px_10px_rgba(198,165,107,0.5)]"
                      : "w-2 bg-[#dcd2bd] hover:bg-[#c6a56b]/60"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Quick direct product link */}
            <Link
              href={`/shop/${slide.slug}`}
              className="mt-4 text-xs text-[#756a5c] hover:text-[#b8860b] tracking-[0.25em] inline-flex items-center gap-2 transition-colors font-mono"
            >
              DISCOVER {slide.name} SCENT PROFILE ↗
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
