"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [token, setToken] = useState(searchParams.get("token") || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passphrases do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Passphrase must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess("Passphrase updated successfully. Redirecting to sign in...");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        setError(data.error || "Unable to reset passphrase.");
      }
    } catch {
      setError("Network or server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full border border-[#e6decb] bg-white p-8 md:p-12 shadow-[0_8px_40px_rgba(198,165,107,0.12)]">
      <div className="text-center mb-8">
        <p className="text-[#8a6829] text-xs tracking-[0.4em] uppercase mb-2 font-mono">
          NEW CREDENTIALS
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-[#171513]">Establish Passphrase</h1>
        <p className="text-[#756a5c] text-xs mt-2 font-light">
          Enter the verification token received in your email along with your new passphrase.
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

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[#5c5348] text-[11px] tracking-[0.25em] uppercase mb-2">
            EMAIL ADDRESS
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#fcfaf7] border border-[#e6decb] px-4 py-3 text-sm text-[#171513] focus:border-[#c6a56b] outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-[#5c5348] text-[11px] tracking-[0.25em] uppercase mb-2">
            VERIFICATION TOKEN
          </label>
          <input
            type="text"
            required
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full bg-[#fcfaf7] border border-[#e6decb] px-4 py-3 text-sm text-[#171513] font-mono tracking-widest focus:border-[#c6a56b] outline-none transition-colors"
            placeholder="e.g. 8A9B2C"
          />
        </div>

        <div>
          <label className="block text-[#5c5348] text-[11px] tracking-[0.25em] uppercase mb-2">
            NEW PASSPHRASE
          </label>
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-[#fcfaf7] border border-[#e6decb] px-4 py-3 text-sm text-[#171513] focus:border-[#c6a56b] outline-none transition-colors"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-[#5c5348] text-[11px] tracking-[0.25em] uppercase mb-2">
            CONFIRM NEW PASSPHRASE
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-[#fcfaf7] border border-[#e6decb] px-4 py-3 text-sm text-[#171513] focus:border-[#c6a56b] outline-none transition-colors"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-gold py-4 text-xs tracking-[0.25em] font-medium uppercase hover:opacity-90 transition-opacity"
        >
          {loading ? "UPDATING..." : "CONFIRM NEW PASSPHRASE →"}
        </button>
      </form>

      <div className="text-center pt-6">
        <Link href="/login" className="text-xs text-[#756a5c] hover:text-[#8a6829] tracking-widest">
          ← Return to Sign In
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fcfaf7] to-[#f7f3eb] pt-28 pb-24 px-8 flex items-center justify-center">
      <Suspense fallback={<div className="text-[#8a6829] text-xs">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
