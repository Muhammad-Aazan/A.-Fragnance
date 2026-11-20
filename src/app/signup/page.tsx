"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/account";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // OTP State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpSentNotice, setOtpSentNotice] = useState("");

  const handleInitiateSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passphrases do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Passphrase must be at least 6 characters.");
      return;
    }

    // Step 1: Send OTP to verify email before creating account
    setLoading(true);
    try {
      const otpRes = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: "SIGNUP" }),
      });
      const otpData = await otpRes.json();

      if (otpData.success) {
        setOtpSentNotice(otpData.message || `Verification code sent to ${email}`);
        setShowOtpModal(true);
      } else {
        setError(otpData.error || "Unable to send authentication code.");
      }
    } catch {
      setError("Network error sending authentication code.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpAndCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpLoading(true);
    setOtpError("");

    try {
      // Step 2: Verify OTP
      const verifyRes = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otpCode, type: "SIGNUP" }),
      });
      const verifyData = await verifyRes.json();

      if (!verifyData.success || !verifyData.verified) {
        setOtpError(verifyData.error || "Invalid or expired security code.");
        setOtpLoading(false);
        return;
      }

      // Step 3: Create user in MongoDB
      const regRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const regData = await regRes.json();

      if (regData.success) {
        setShowOtpModal(false);
        if (typeof window !== "undefined" && regData.user) {
          localStorage.setItem("af_user", JSON.stringify(regData.user));
          window.dispatchEvent(new Event("af_auth_change"));
        }
        setSuccess("Account authenticated and established. Redirecting...");
        setTimeout(() => {
          router.push(redirectTarget);
        }, 1000);
      } else {
        setOtpError(regData.error || "Failed to create account in database.");
      }
    } catch {
      setOtpError("Error completing registration.");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full border border-[#e6decb] bg-white p-8 md:p-12 relative">
      <div className="text-center mb-8">
        <p className="text-[#8a6829] text-xs tracking-[0.4em] uppercase mb-2 font-mono">
          CLIENT REGISTRATION
        </p>
        <h1 className="font-serif text-4xl text-[#171513]">Create Account</h1>
        <p className="text-[#756a5c] text-xs mt-2 font-light">
          Join the private circle of A. Fragrance.
        </p>
      </div>

      {error && (
        <div className="border border-red-900/60 bg-red-950/20 text-red-300 text-xs p-3 mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="border border-[#c6a56b] bg-[#fdf8ef] text-[#8a6829] text-xs p-3 mb-6">
          {success}
        </div>
      )}

      <form onSubmit={handleInitiateSignup} className="space-y-5">
        <div>
          <label className="block text-[#756a5c] text-[11px] tracking-[0.25em] uppercase mb-2 font-mono">
            PATRON FULL NAME
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#fcfaf7] border border-[#e6decb] px-4 py-3 text-sm text-[#171513] focus:border-[#c6a56b] outline-none transition-colors"
            placeholder="Lord / Lady / Full Name"
          />
        </div>

        <div>
          <label className="block text-[#756a5c] text-[11px] tracking-[0.25em] uppercase mb-2 font-mono">
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
          <label className="block text-[#756a5c] text-[11px] tracking-[0.25em] uppercase mb-2 font-mono">
            PASSPHRASE (MIN. 6 CHARACTERS)
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#fcfaf7] border border-[#e6decb] px-4 py-3 text-sm text-[#171513] focus:border-[#c6a56b] outline-none transition-colors"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-[#756a5c] text-[11px] tracking-[0.25em] uppercase mb-2 font-mono">
            CONFIRM PASSPHRASE
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
          className="w-full btn-gold py-4 text-xs tracking-[0.25em] text-[#171513] font-medium uppercase hover:opacity-90 transition-opacity shadow-lg shadow-[#c6a56b]/20"
        >
          {loading ? "DISPATCHING VERIFICATION..." : "VERIFY EMAIL & CREATE ACCOUNT →"}
        </button>
      </form>

      <div className="border-t border-[#e6decb] mt-8 pt-6 text-center text-xs text-[#756a5c]">
        <span>Already have an account? </span>
        <Link
          href={`/login${redirectTarget ? `?redirect=${encodeURIComponent(redirectTarget)}` : ""}`}
          className="text-[#8a6829] hover:underline font-medium"
        >
          Sign In
        </Link>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-6">
          <div className="max-w-md w-full border border-[#c6a56b]/50 bg-white p-8 md:p-10 shadow-2xl relative">
            <button
              onClick={() => setShowOtpModal(false)}
              className="absolute top-4 right-4 text-[#756a5c] hover:text-[#171513] text-sm font-mono"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <span className="text-[#8a6829] font-serif text-4xl block mb-2">✦</span>
              <p className="text-[#8a6829] text-[10px] tracking-[0.35em] uppercase font-mono mb-2">
                EMAIL AUTHENTICATION
              </p>
              <h3 className="font-serif text-2xl text-[#171513]">Enter 6-Digit Code</h3>
              <p className="text-[#756a5c] text-xs mt-2 font-light">
                {otpSentNotice || `Security code transmitted to ${email}`}
              </p>
            </div>

            {otpError && (
              <div className="border border-red-900/60 bg-red-950/20 text-red-300 text-xs p-3 mb-5 text-center">
                {otpError}
              </div>
            )}

            <form onSubmit={handleVerifyOtpAndCreate} className="space-y-5">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={otpCode}
                  placeholder="••••••"
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  className="w-full text-center text-3xl tracking-[0.5em] font-mono bg-[#fcfaf7] border border-[#c6a56b]/50 text-[#8a6829] py-3 focus:outline-none focus:border-[#c6a56b]"
                />
              </div>

              <button
                type="submit"
                disabled={otpLoading || otpCode.length < 6}
                className="w-full btn-gold py-4 text-xs tracking-[0.25em] text-[#171513] font-medium uppercase disabled:opacity-50"
              >
                {otpLoading ? "AUTHENTICATING..." : "VERIFY & ACTIVATE ACCOUNT →"}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={async () => {
                    setOtpLoading(true);
                    setOtpError("");
                    try {
                      const res = await fetch("/api/auth/otp/send", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, type: "SIGNUP" }),
                      });
                      const d = await res.json();
                      if (d.success) setOtpSentNotice("Fresh code dispatched to your email.");
                    } finally {
                      setOtpLoading(false);
                    }
                  }}
                  className="text-[11px] text-[#756a5c] hover:text-[#8a6829] tracking-wider uppercase underline font-mono"
                >
                  Resend Security Code ↗
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#fcfaf7] pt-28 pb-24 px-8 flex items-center justify-center">
      <Suspense
        fallback={
          <div className="text-[#8a6829] text-xs font-mono tracking-widest uppercase">
            Loading Account Registration...
          </div>
        }
      >
        <SignupForm />
      </Suspense>
    </div>
  );
}

