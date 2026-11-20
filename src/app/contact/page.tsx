"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ContactFormContent() {
  const searchParams = useSearchParams();
  const prefillInquiry = searchParams.get("inquiry") || "";

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  useEffect(() => {
    // If logged in, prefill patron info
    const stored = localStorage.getItem("af_user");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setForm((prev) => ({
          ...prev,
          name: u.name || prev.name,
          email: u.email || prev.email,
        }));
      } catch (e) {
        console.error(e);
      }
    }
    if (prefillInquiry) {
      setForm((prev) => ({
        ...prev,
        message: prefillInquiry,
      }));
    }
  }, [prefillInquiry]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setServerMessage(
        data.message ||
          "Your enquiry has been registered. The house concierge will attend to your request within 24 hours."
      );
      setSubmitted(true);
    } catch {
      setServerMessage(
        "Thank you for contacting A. Fragrance. We will respond within 24 hours."
      );
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfaf7] pt-24 pb-28 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 border-b border-[#e6decb] pb-8">
          <p className="text-[#8a6829] text-xs tracking-[0.4em] mb-4 uppercase">GET IN TOUCH</p>
          <h1 className="font-serif text-6xl md:text-7xl text-[#171513]">Client Care & Concierge</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          {/* Left — info */}
          <div>
            <p className="text-[#3c352d] text-base leading-relaxed mb-12 font-light">
              We welcome enquiries regarding perfume orders, custom corporate gift sets, wholesale allocations,
              and personal scent consultations. Our customer care team responds to every client personally.
            </p>

            <div className="space-y-8">
              {[
                { label: "DIRECT CORRESPONDENCE", value: "care@afragrance.pk" },
                { label: "CUSTOMER CARE HOURS", value: "Mon–Sat, 10am–8pm PKT" },
                { label: "GUARANTEED RESPONSE", value: "Within 24 hours" },
                { label: "HEADQUARTERS", value: "Karachi · Lahore · Islamabad, Pakistan" },
              ].map((item) => (
                <div key={item.label} className="border-t border-[#e6decb] pt-6">
                  <div className="text-[#8a6829] text-xs tracking-[0.3em] mb-2 uppercase font-mono">{item.label}</div>
                  <div className="text-[#171513] text-sm font-light">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div>
            {submitted ? (
              <div className="border border-[#c6a56b]/40 bg-white p-12 text-center shadow-sm">
                <div className="text-[#c6a56b] font-serif text-5xl mb-6">✦</div>
                <h2 className="font-serif text-3xl text-[#171513] mb-4">Enquiry Registered</h2>
                <p className="text-[#756a5c] text-sm font-light leading-relaxed mb-6">
                  {serverMessage}
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: "", email: "", message: "" });
                  }}
                  className="text-xs text-[#8a6829] tracking-widest uppercase hover:underline"
                >
                  SEND ANOTHER ENQUIRY ↗
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[#5c5348] text-xs tracking-[0.3em] mb-3 uppercase">YOUR NAME</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-[#e6decb] px-5 py-4 text-[#171513] text-sm placeholder-[#b0a89a] outline-none focus:border-[#c6a56b] transition-colors"
                    placeholder="Amelia Rossi"
                  />
                </div>
                <div>
                  <label className="block text-[#5c5348] text-xs tracking-[0.3em] mb-3 uppercase">EMAIL ADDRESS</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-[#e6decb] px-5 py-4 text-[#171513] text-sm placeholder-[#b0a89a] outline-none focus:border-[#c6a56b] transition-colors"
                    placeholder="amelia@example.com"
                  />
                </div>
                <div>
                  <label className="block text-[#5c5348] text-xs tracking-[0.3em] mb-3 uppercase">YOUR MESSAGE</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full bg-white border border-[#e6decb] px-5 py-4 text-[#171513] text-sm placeholder-[#b0a89a] outline-none focus:border-[#c6a56b] transition-colors resize-none"
                    placeholder="Enquire about notes, custom concentrations, or private consultations..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-gold py-5 text-xs tracking-[0.25em] font-medium hover:opacity-90 transition-opacity uppercase"
                >
                  {loading ? "TRANSMITTING ENQUIRY..." : "SEND ENQUIRY →"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fcfaf7]" />}>
      <ContactFormContent />
    </Suspense>
  );
}
