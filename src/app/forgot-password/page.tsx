"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [tokenHint, setTokenHint] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        if (data.token) {
          setTokenHint(data.token);
        }
      } else {
        setError(data.error || "Unable to process request.");
      }
    } catch {
      setError("Network or server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fcfaf7] to-[#f7f3eb] pt-28 pb-24 px-8 flex items-center justify-center">
      <div className="max-w-md w-full border border-[#e6decb] bg-white p-8 md:p-12 shadow-[0_8px_40px_rgba(198,165,107,0.12)]">
        <div className="text-center mb-8">
          <p className="text-[#8a6829] text-xs tracking-[0.4em] uppercase mb-2 font-mono">
            SECURITY VERIFICATION
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-[#171513]">Reset Access</h1>
          <p className="text-[#756a5c] text-xs mt-2 font-light">
            Enter your email address to receive password reset instructions via secure email.
          </p>
        </div>

        {error && (
          <div className="border border-red-300 bg-red-50 text-red-700 text-xs p-3 mb-6 rounded">
            {error}
          </div>
        )}

        {submitted ? (
          <div className="space-y-6 text-center">
            <div className="border border-[#c6a56b]/40 bg-[#fdf8ef] p-6">
              <span className="text-[#c6a56b] font-serif text-3xl block mb-2">✦</span>
              <p className="text-[#171513] text-sm leading-relaxed mb-3">
                Instructions have been dispatched to <strong>{email}</strong>.
              </p>
              {tokenHint && (
                <div className="mt-4 pt-3 border-t border-[#e6decb] text-xs text-[#756a5c]">
                  Verification Token: <span className="text-[#8a6829] font-mono font-bold">{tokenHint}</span>
                </div>
              )}
            </div>

            <Link
              href={`/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(tokenHint)}`}
              className="btn-gold inline-block w-full py-4 text-xs tracking-[0.25em] font-medium uppercase"
            >
              PROCEED TO ENTER NEW PASSPHRASE →
            </Link>

            <div>
              <Link href="/login" className="text-xs text-[#756a5c] hover:text-[#8a6829] tracking-widest">
                ← Return to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[#5c5348] text-[11px] tracking-[0.25em] uppercase mb-2">
                REGISTERED EMAIL ADDRESS
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#fcfaf7] border border-[#e6decb] px-4 py-3 text-sm text-[#171513] focus:border-[#c6a56b] outline-none transition-colors"
                placeholder="patron@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold py-4 text-xs tracking-[0.25em] font-medium uppercase hover:opacity-90 transition-opacity"
            >
              {loading ? "TRANSMITTING INSTRUCTIONS..." : "SEND RESET INSTRUCTIONS →"}
            </button>

            <div className="text-center pt-2">
              <Link href="/login" className="text-xs text-[#756a5c] hover:text-[#8a6829] tracking-widest">
                ← Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
