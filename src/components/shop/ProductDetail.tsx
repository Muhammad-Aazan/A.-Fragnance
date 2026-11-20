"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product, getProductsByCollection } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import FlaconViewer3D from "@/components/ui/FlaconViewer3D";

interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  comment: string;
  verified: boolean;
  createdAt: string;
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < Math.floor(rating) ? "text-[#c6a56b]" : "text-[#e6decb]"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-[#756a5c] text-sm font-mono">
        {rating.toFixed(1)} · {count} verified review{count !== 1 ? "s" : ""}
      </span>
    </div>
  );
}

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { isLiked, toggleLike } = useWishlist();
  const liked = isLiked(product.id);
  const [selectedSize, setSelectedSize] = useState(product.volume.toUpperCase());
  const [activeImage, setActiveImage] = useState(product.image);
  const [viewMode, setViewMode] = useState<"image" | "3d">("image");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const [openPanel, setOpenPanel] = useState<string | null>("A considered composition");

  // Reviews State
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewNotice, setReviewNotice] = useState("");
  const [avgRating, setAvgRating] = useState(product.rating || 4.9);
  const [totalReviews, setTotalReviews] = useState((product as any).reviewsCount ?? (product as any).reviews ?? 0);

  const price =
    selectedSize === product.volume.toUpperCase()
      ? product.price
      : product.priceAlt ?? product.price;

  // Fetch verified reviews for this creation
  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${product.slug}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setReviews(data.data);
        if (data.data.length > 0) {
          setTotalReviews(data.data.length);
          const sum = data.data.reduce((acc: number, r: ReviewItem) => acc + (r.rating || 5), 0);
          setAvgRating(parseFloat((sum / data.data.length).toFixed(1)));
        }
      }
    } catch (e) {
      console.warn("Reviews load notice:", e);
    }
  }, [product.slug]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Handle Review Submission
  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;

    setSubmittingReview(true);
    setReviewNotice("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.slug,
          author: reviewAuthor.trim(),
          rating: reviewRating,
          comment: reviewComment.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReviewNotice("Thank you. Your patron review has been verified and published.");
        setReviewAuthor("");
        setReviewComment("");
        setReviewRating(5);
        fetchReviews();
        setTimeout(() => {
          setShowReviewModal(false);
          setReviewNotice("");
        }, 2200);
      } else {
        setReviewNotice(data.error || "Could not publish review. Please retry.");
      }
    } catch {
      setReviewNotice("Error submitting review. Please retry.");
    } finally {
      setSubmittingReview(false);
    }
  }

  function handleAddToBag() {
    for (let i = 0; i < qty; i++) {
      addItem({
        ...product,
        volume: selectedSize,
        price,
      });
    }
    setAdded(true);
    setIsFlying(true);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("af_cart_bump"));
    }

    setTimeout(() => setIsFlying(false), 850);
    setTimeout(() => setAdded(false), 2000);
  }

  const relatedProducts = getProductsByCollection(product.collectionSlug).filter(
    (p) => p.slug !== product.slug
  );
  const galleryImages = [
    product.image,
    "/4e072261d8eb05697372992567475ceb367cb913.png",
    ...(relatedProducts.length > 0 ? [relatedProducts[0].image] : []),
  ];

  const panels = [
    {
      title: "A considered composition",
      content:
        "Every formula is developed in-house over years of meticulous olfactory iteration. Sourced from the finest natural wild harvests, filtered through artisanal methods, and blended to age gracefully and intimately on the wearer's skin.",
    },
    {
      title: "The fragrance ritual",
      content:
        product.category === "Attars"
          ? "Unscrew the engraved golden applicator wand. Apply one drop directly to pulse points: inner wrists, behind the ears, and base of throat. Do not rub. Allow the concentrated pure oil to warm naturally with your skin's temperature."
          : "Apply 2-3 sprays to pulse points: neck hollow, wrists, and collarbone. Allow to settle for three minutes before assessing the opening notes.",
    },
    {
      title: "Delivery & Returns",
      content:
        "Complimentary insured express delivery on all orders across Pakistan. Each order arrives in signature white and gold gift packaging with a complimentary 2ml sample tester. Unopened items eligible for return within 14 days.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fcfaf7] pt-24 pb-28 text-[#171513]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#756a5c] tracking-widest mb-12 font-mono">
          <Link href="/" className="hover:text-[#b8860b] transition-colors">HOME</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#b8860b] transition-colors">SHOP</Link>
          <span>/</span>
          <span className="text-[#171513] font-medium">{product.name.toUpperCase()}</span>
        </nav>

        {/* Main Grid: Left Gallery, Right Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* LEFT — Media Showcase (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[4/5] bg-white border border-[#e6decb] overflow-hidden flex items-center justify-center shadow-sm rounded-2xl">
              {viewMode === "3d" && product.model3d ? (
                <div className="w-full h-full p-4">
                  <FlaconViewer3D modelSrc={product.model3d} alt={product.name} />
                </div>
              ) : (
                <Image
                  src={activeImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain object-center p-12 transition-transform duration-700 filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)]"
                  priority
                />
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-3">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveImage(img);
                    setViewMode("image");
                  }}
                  className={`relative aspect-square bg-white overflow-hidden border transition-all rounded-[2px] ${
                    viewMode === "image" && activeImage === img
                      ? "border-[#c6a56b] shadow-sm"
                      : "border-[#e6decb] opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`Angle ${i + 1}`} fill sizes="120px" className="object-contain p-3" />
                </button>
              ))}

              {product.model3d && (
                <button
                  onClick={() => setViewMode("3d")}
                  className={`relative aspect-square bg-white overflow-hidden border transition-all flex flex-col items-center justify-center p-2 rounded-[2px] ${
                    viewMode === "3d"
                      ? "border-[#c6a56b] shadow-sm text-[#8a6829]"
                      : "border-[#e6decb] opacity-70 hover:opacity-100 text-[#756a5c]"
                  }`}
                >
                  <span className="text-xl">🏛️</span>
                  <span className="text-[10px] font-mono tracking-wider mt-1 uppercase font-bold">3D VIEW</span>
                </button>
              )}
            </div>
          </div>

          {/* RIGHT — Product Information (6 Cols) */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-[#8a6829] text-xs tracking-[0.3em] uppercase font-mono font-bold">
                  {product.category} · {product.concentration}
                </span>
                <span className="text-[#756a5c] text-xs font-mono">{product.gender}</span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl text-[#171513] font-light tracking-wide mb-3">
                {product.name}
              </h1>
              <p className="text-[#5c5348] text-base italic font-serif mb-4">
                &ldquo;{product.tagline}&rdquo;
              </p>

              <div className="flex items-center justify-between border-y border-[#e6decb] py-4">
                <StarRating rating={avgRating} count={totalReviews} />
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="text-xs text-[#8a6829] hover:text-[#171513] font-mono tracking-wider uppercase font-medium hover:underline"
                >
                  + WRITE A REVIEW
                </button>
              </div>
            </div>

            {/* Price & Selection */}
            <div className="space-y-4">
              <div className="flex items-baseline gap-4">
                <span className="font-serif text-3xl sm:text-4xl text-[#171513]">
                  Rs. {price.toLocaleString()}
                </span>
                <span className="text-[#756a5c] text-xs font-mono">Tax Included · Free Nationwide Shipping</span>
              </div>

              {/* Volume Options */}
              <div className="space-y-2">
                <label className="text-xs uppercase font-mono tracking-widest text-[#756a5c] block">
                  SELECT VOLUME
                </label>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedSize(product.volume.toUpperCase())}
                    className={`px-6 py-3 border text-xs font-mono tracking-wider transition-all rounded-sm ${
                      selectedSize === product.volume.toUpperCase()
                        ? "border-[#c6a56b] bg-[#c6a56b]/10 text-[#8a6829] font-bold"
                        : "border-[#e6decb] text-[#5c5348] hover:border-[#c6a56b]"
                    }`}
                  >
                    {product.volume.toUpperCase()} — Rs. {product.price.toLocaleString()}
                  </button>

                  {product.priceAlt && product.priceAltLabel && (
                    <button
                      onClick={() => setSelectedSize(product.priceAltLabel!.toUpperCase())}
                      className={`px-6 py-3 border text-xs font-mono tracking-wider transition-all rounded-sm ${
                        selectedSize === product.priceAltLabel.toUpperCase()
                          ? "border-[#c6a56b] bg-[#c6a56b]/10 text-[#8a6829] font-bold"
                          : "border-[#e6decb] text-[#5c5348] hover:border-[#c6a56b]"
                      }`}
                    >
                      {product.priceAltLabel.toUpperCase()} — Rs. {product.priceAlt.toLocaleString()}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-[#3c352d] text-sm leading-relaxed font-light">
              {product.description}
            </p>

            {/* Quantity */}
            <div className="space-y-2">
              <label className="text-xs uppercase font-mono tracking-widest text-[#756a5c] block">
                QUANTITY
              </label>
              <div className="flex items-center border border-[#e6decb] bg-white w-fit rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-12 h-12 text-[#5c5348] hover:text-[#171513] text-lg transition-colors cursor-pointer"
                >
                  −
                </button>
                <span className="w-12 h-12 flex items-center justify-center text-[#171513] text-sm border-x border-[#e6decb] font-mono font-bold">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-12 h-12 text-[#5c5348] hover:text-[#171513] text-lg transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-2 relative">
              {isFlying && (
                <div className="absolute z-50 pointer-events-none top-0 left-1/2 -translate-x-1/2 animate-fly-to-bag">
                  <div className="flex items-center gap-1.5 bg-[#c6a56b] text-white px-4 py-2 rounded-full font-mono font-bold text-xs shadow-[0_4px_20px_rgba(198,165,107,0.6)] border border-white">
                    <span>✦ +{qty} ADDED TO BAG</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleAddToBag}
                className="w-full btn-gold py-5 text-xs tracking-[0.25em] text-white font-bold uppercase shadow-lg shadow-[#c6a56b]/20 rounded-xl cursor-pointer"
              >
                {added ? "ADDED TO BAG ✓" : "ADD TO BAG →"}
              </button>

              <button
                type="button"
                onClick={() => toggleLike(product.id)}
                className={`w-full border py-4 text-xs tracking-[0.25em] transition-all flex items-center justify-center gap-2.5 rounded-xl font-mono cursor-pointer ${
                  liked
                    ? "bg-red-50 border-red-300 text-red-600 font-bold"
                    : "bg-white border-[#e6decb] text-[#5c5348] hover:border-[#c6a56b] hover:text-[#8a6829]"
                }`}
              >
                <svg
                  className={`w-4 h-4 ${liked ? "fill-red-500 text-red-500" : "fill-none text-current"}`}
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{liked ? "SAVED IN FAVORITES ✓" : "LIKE & SAVE TO WISHLIST"}</span>
              </button>

              {/* Inquiry Prompt */}
              <div className="pt-2 text-center">
                <Link
                  href={`/contact?inquiry=${encodeURIComponent(`Enquiry regarding: ${product.name} (${selectedSize})`)}`}
                  className="text-xs text-[#756a5c] hover:text-[#8a6829] font-mono tracking-wider inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>💬 Have a question about this creation? Inquire with Concierge →</span>
                </Link>
              </div>
            </div>

            {/* Olfactory Notes Pyramid */}
            <div className="border border-[#e6decb] bg-white divide-y divide-[#e6decb] mt-8 rounded-2xl shadow-xs overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-2">
                <span className="text-[#8a6829] text-xs tracking-widest font-mono font-bold">
                  01 TOP NOTES
                </span>
                <span className="text-[#171513] text-xs tracking-wider">
                  {product.opening.join("  ·  ")}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-2">
                <span className="text-[#8a6829] text-xs tracking-widest font-mono font-bold">
                  02 HEART NOTES
                </span>
                <span className="text-[#171513] text-xs tracking-wider">
                  {product.heart.join("  ·  ")}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-2">
                <span className="text-[#8a6829] text-xs tracking-widest font-mono font-bold">
                  03 BASE NOTES
                </span>
                <span className="text-[#171513] text-xs tracking-wider">
                  {product.trail.join("  ·  ")}
                </span>
              </div>
            </div>

            {/* Accordion Panels */}
            <div className="border border-[#e6decb] bg-white divide-y divide-[#e6decb] mt-8 rounded-2xl overflow-hidden shadow-xs">
              {panels.map((panel) => (
                <div key={panel.title}>
                  <button
                    onClick={() => setOpenPanel(openPanel === panel.title ? null : panel.title)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left"
                  >
                    <span className="text-[#171513] text-sm tracking-wide font-medium">{panel.title}</span>
                    <span className="text-[#c6a56b] text-lg font-light">
                      {openPanel === panel.title ? "−" : "+"}
                    </span>
                  </button>
                  {openPanel === panel.title && (
                    <div className="px-6 pb-5 text-[#5c5348] text-sm leading-relaxed font-light">
                      {panel.content}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── CUSTOMER REVIEWS SECTION ── */}
        <section className="mt-20 pt-14 border-t border-[#e6decb]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-[#8a6829] text-xs tracking-[0.3em] uppercase font-mono font-bold mb-2">
                PATRON TESTIMONIALS
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-[#171513]">
                Client Reviews for {product.name}
              </h2>
            </div>
            <button
              onClick={() => setShowReviewModal(true)}
              className="btn-gold px-6 py-3.5 text-xs font-mono tracking-widest uppercase font-semibold w-fit"
            >
              + SHARE YOUR REVIEW
            </button>
          </div>

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="bg-white border border-[#e6decb] rounded-xl p-10 text-center space-y-3">
              <span className="text-[#c6a56b] text-3xl font-serif">✦</span>
              <p className="font-serif text-xl text-[#171513]">Be the first to review this creation.</p>
              <p className="text-[#756a5c] text-xs font-light max-w-md mx-auto">
                Share your sensory experience regarding the opening, projection, and sillage of {product.name}.
              </p>
              <button
                onClick={() => setShowReviewModal(true)}
                className="btn-outline px-6 py-2.5 text-xs font-mono tracking-widest uppercase mt-4"
              >
                WRITE REVIEW NOW
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white border border-[#e6decb] p-6 rounded-xl space-y-3 shadow-xs hover:border-[#c6a56b]/60 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 text-[#c6a56b]">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-sm">
                          {i < rev.rating ? "★" : "☆"}
                        </span>
                      ))}
                    </div>
                    {rev.verified && (
                      <span className="text-[10px] font-mono tracking-wider text-[#166534] bg-[#dcfce7] px-2 py-0.5 rounded-full font-medium">
                        ✓ VERIFIED
                      </span>
                    )}
                  </div>
                  <p className="text-[#3c352d] text-sm font-light leading-relaxed italic">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                  <div className="pt-2 border-t border-[#f3eada] flex items-center justify-between text-xs text-[#756a5c] font-mono">
                    <span className="font-semibold text-[#171513]">{rev.author}</span>
                    <span>{new Date(rev.createdAt).toLocaleDateString("en-GB")}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── WRITE REVIEW MODAL ── */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-[#e6decb] w-full max-w-md p-8 rounded-2xl shadow-2xl relative space-y-5">
              <button
                onClick={() => setShowReviewModal(false)}
                className="absolute top-5 right-5 text-[#756a5c] hover:text-[#171513] text-xl font-mono cursor-pointer"
              >
                ✕
              </button>

              <div>
                <p className="text-[#8a6829] text-xs tracking-widest uppercase font-mono font-bold mb-1">
                  PATRON FEEDBACK
                </p>
                <h3 className="font-serif text-2xl text-[#171513]">Review {product.name}</h3>
                <p className="text-[#756a5c] text-xs mt-1">
                  Your feedback helps other perfume connoisseurs discover their signature scent.
                </p>
              </div>

              {reviewNotice && (
                <div className="p-3 text-xs rounded bg-[#fef9c3] border border-[#fef08a] text-[#854d0e]">
                  {reviewNotice}
                </div>
              )}

              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Rating Selector */}
                <div>
                  <label className="text-xs uppercase font-mono tracking-widest text-[#756a5c] block mb-2">
                    RATING (STARS)
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className={`text-2xl transition-transform hover:scale-110 cursor-pointer ${
                          star <= reviewRating ? "text-[#c6a56b]" : "text-[#e6decb]"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="text-xs font-mono text-[#8a6829] self-center ml-2">
                      {reviewRating} of 5 Stars
                    </span>
                  </div>
                </div>

                {/* Author Name */}
                <div>
                  <label className="text-xs uppercase font-mono tracking-widest text-[#756a5c] block mb-1">
                    YOUR NAME
                  </label>
                  <input
                    type="text"
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    placeholder="e.g. Tariq Mehmood"
                    required
                    className="w-full bg-[#fcfaf7] border border-[#e6decb] px-4 py-2.5 text-xs text-[#171513] outline-none focus:border-[#c6a56b] rounded-sm"
                  />
                </div>

                {/* Review Comment */}
                <div>
                  <label className="text-xs uppercase font-mono tracking-widest text-[#756a5c] block mb-1">
                    YOUR OBSERVATIONS & NOTES
                  </label>
                  <textarea
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Describe the opening, sillage, dry-down, and longevity on your skin..."
                    required
                    className="w-full bg-[#fcfaf7] border border-[#e6decb] p-3 text-xs text-[#171513] outline-none focus:border-[#c6a56b] rounded-sm resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1 py-3 border border-[#e6decb] text-xs font-mono uppercase tracking-wider text-[#756a5c] hover:bg-gray-50"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="flex-1 btn-gold py-3 text-xs font-mono uppercase tracking-wider font-semibold"
                  >
                    {submittingReview ? "SUBMITTING..." : "PUBLISH REVIEW →"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
