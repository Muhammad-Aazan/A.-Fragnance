"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message || "Welcome to the Inner Circle.");
      setSubmitted(true);
      setEmail("");
    } catch {
      setMessage("Welcome to the Inner Circle.");
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-24 px-8 bg-white border-y border-[#e6decb]">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-[#8a6829] text-xs tracking-[0.4em] mb-4 uppercase font-mono font-medium">THE INNER CIRCLE</p>
        <h2 className="font-serif text-4xl md:text-5xl text-[#171513] mb-6">
          A little closer to the extraordinary.
        </h2>
        <p className="text-[#5c5348] text-sm leading-relaxed mb-10 font-light">
          Be the first to discover new extraits, private attar releases, and seasonal harvest chronicles from the house.
        </p>

        {submitted ? (
          <div className="border border-[#c6a56b] bg-[#faf8f5] p-8 max-w-md mx-auto shadow-sm">
            <span className="text-[#c6a56b] font-serif text-3xl block mb-2">✦</span>
            <div className="text-[#171513] font-serif text-xl italic mb-1">
              Welcome to the circle.
            </div>
            <p className="text-[#756a5c] text-xs font-light">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto shadow-xs">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 bg-[#faf8f5] border border-[#e6decb] px-5 py-3 text-sm text-[#171513] placeholder-[#9e9384] focus:outline-none focus:border-[#c6a56b] transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-gold px-7 py-3 text-xs tracking-[0.2em] font-semibold whitespace-nowrap"
            >
              {loading ? "..." : "JOIN CIRCLE"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
