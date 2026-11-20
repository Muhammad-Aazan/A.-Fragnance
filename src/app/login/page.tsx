"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        if (typeof window !== "undefined") {
          localStorage.setItem("af_user", JSON.stringify(data.user));
          window.dispatchEvent(new Event("af_auth_change"));
        }
        setSuccess(`Welcome back, ${data.user.name}. Redirecting...`);
        setTimeout(() => {
          router.push(redirectTarget);
        }, 800);
      } else {
        setError(data.error || "Invalid patron credentials.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full border border-[#e6decb] bg-white p-8 md:p-12 shadow-[0_8px_40px_rgba(198,165,107,0.12)]">
      <div className="text-center mb-8">
        <p className="text-[#8a6829] text-xs tracking-[0.4em] uppercase mb-2 font-mono">
          CLIENT ACCESS
        </p>
        <h1 className="font-serif text-4xl text-[#171513]">Sign In</h1>
        <p className="text-[#756a5c] text-xs mt-2 font-light">
          {redirectTarget.includes("checkout")
            ? "Sign in to authenticate your account and complete your order."
            : "Enter your credentials to access your private orders & allocations."}
        </p>
      </div>

      {error && (
        <div className="border border-red-300 bg-red-50 text-red-700 text-xs p-3 mb-6 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="border border-[#c6a56b]/60 bg-[#fdf8ef] text-[#8a6829] text-xs p-3 mb-6 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[#5c5348] text-[11px] tracking-[0.25em] uppercase mb-2 font-mono">
            EMAIL ADDRESS
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

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-[#5c5348] text-[11px] tracking-[0.25em] uppercase font-mono">
              PASSPHRASE
            </label>
            <Link
              href="/forgot-password"
              className="text-[11px] text-[#8a6829] hover:underline tracking-wider"
            >
              Forgot passphrase?
            </Link>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#fcfaf7] border border-[#e6decb] px-4 py-3 text-sm text-[#171513] focus:border-[#c6a56b] outline-none transition-colors"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-gold py-4 text-xs tracking-[0.25em] font-medium uppercase hover:opacity-90 transition-opacity"
        >
          {loading ? "VERIFYING..." : "SIGN IN →"}
        </button>
      </form>

      <div className="border-t border-[#e6decb] mt-8 pt-6 text-center text-xs text-[#756a5c]">
        <span>New to the house? </span>
        <Link
          href={`/signup${redirectTarget ? `?redirect=${encodeURIComponent(redirectTarget)}` : ""}`}
          className="text-[#8a6829] hover:underline font-medium"
        >
          Establish an Account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fcfaf7] to-[#f7f3eb] pt-28 pb-24 px-8 flex items-center justify-center">
      <Suspense
        fallback={
          <div className="text-[#8a6829] text-xs font-mono tracking-widest uppercase">
            Loading Client Access...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
