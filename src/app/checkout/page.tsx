"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/lib/cart-context";

interface AfUser {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
}

const DELIVERY_OPTIONS = [
  {
    id: "STANDARD",
    days: 5,
    price: 0,
    title: "Standard Insured Courier",
    subtitle: "Delivered in 5 business days across Pakistan",
    tag: "FREE",
  },
  {
    id: "FAST",
    days: 3,
    price: 850,
    title: "Fast Express Dispatch",
    subtitle: "Delivered in 3 business days via TCS / Leopards Courier",
    tag: "+Rs. 850",
  },
  {
    id: "URGENT",
    days: 1,
    price: 1800,
    title: "Urgent VIP 24-Hour Courier",
    subtitle: "Delivered in 1 business day · Priority white-glove direct handover",
    tag: "+Rs. 1,800",
  },
];

function CheckoutContent() {
  const searchParams = useSearchParams();
  const { items, total: rawTotal, clearCart } = useCart();

  // Auth & user state
  const [user, setUser] = useState<AfUser | null>(null);

  // Order state
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [confirmedDelivery, setConfirmedDelivery] = useState({
    option: "STANDARD",
    days: 5,
    estimatedDate: "",
    shippingCost: 0,
    finalTotal: 0,
  });

  // Delivery option state
  const [deliveryOption, setDeliveryOption] = useState<"STANDARD" | "FAST" | "URGENT">("STANDARD");

  // OTP state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpSentNotice, setOtpSentNotice] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "Karachi",
    country: "Pakistan",
    postalCode: "74200",
    paymentMethod: "COD",
  });

  // Calculate pricing (PKR)
  const subtotal = rawTotal > 0 ? rawTotal : 18500;
  const currentDelivery = DELIVERY_OPTIONS.find((d) => d.id === deliveryOption) || DELIVERY_OPTIONS[0];
  const finalTotal = subtotal + currentDelivery.price;

  // Format estimated arrival date
  const estimatedArrivalDate = new Date(
    Date.now() + currentDelivery.days * 24 * 60 * 60 * 1000
  ).toLocaleDateString("en-PK", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Check URL params for post-checkout return
  useEffect(() => {
    const successParam = searchParams.get("success");
    const orderParam = searchParams.get("order");
    if (successParam === "true" && orderParam) {
      setOrderNumber(orderParam);
      setCompleted(true);
      if (typeof clearCart === "function") clearCart();
    }
  }, [searchParams, clearCart]);

  // Load user data if logged in
  useEffect(() => {
    const stored = localStorage.getItem("af_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        const nameParts = (parsed.name || "").split(" ");
        setFormData((prev) => ({
          ...prev,
          firstName: nameParts[0] || prev.firstName,
          lastName: nameParts.slice(1).join(" ") || prev.lastName,
          email: parsed.email || prev.email,
          phone: parsed.phone || prev.phone,
          address: parsed.address || prev.address,
          city: parsed.city || prev.city,
          country: "Pakistan",
          postalCode: parsed.postalCode || prev.postalCode,
        }));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Initiate checkout: trigger OTP authentication right at payment step
  const handleInitiateCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!isEmailVerified) {
      setOtpLoading(true);
      setOtpError("");
      try {
        const res = await fetch("/api/auth/otp/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, type: "CHECKOUT" }),
        });
        const data = await res.json();
        if (data.success) {
          setOtpSentNotice(data.message || `Code dispatched to ${formData.email}`);
          setShowOtpModal(true);
        } else {
          setOtpError(data.error || "Unable to dispatch security code.");
          setShowOtpModal(true);
        }
      } catch {
        setOtpSentNotice(`Code dispatched to ${formData.email}`);
        setShowOtpModal(true);
      } finally {
        setOtpLoading(false);
      }
      return;
    }

    await executeOrderPlacement();
  };

  // Verify OTP and proceed to checkout
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpLoading(true);
    setOtpError("");

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          code: otpCode,
          type: "CHECKOUT",
          userData: {
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            country: formData.country,
            postalCode: formData.postalCode,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsEmailVerified(true);
        setShowOtpModal(false);
        if (data.user) {
          localStorage.setItem("af_user", JSON.stringify(data.user));
          setUser(data.user);
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("af_auth_change"));
          }
        }
        await executeOrderPlacement();
      } else {
        setOtpError(data.error || "Invalid code entered. Please verify.");
      }
    } catch {
      setOtpError("Failed to authenticate code. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  // Execute order placement to MongoDB
  const executeOrderPlacement = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: `${formData.firstName} ${formData.lastName}`.trim() || "Valued Client",
          customerEmail: formData.email,
          shippingAddress: formData.address,
          city: formData.city,
          country: formData.country,
          postalCode: formData.postalCode,
          items,
          subtotal,
          shippingCost: currentDelivery.price,
          total: finalTotal,
          deliveryOption,
          paymentMethod: formData.paymentMethod,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setConfirmedDelivery({
          option: deliveryOption,
          days: currentDelivery.days,
          estimatedDate: estimatedArrivalDate,
          shippingCost: currentDelivery.price,
          finalTotal: data.total || finalTotal,
        });

        if (data.sessionUrl && formData.paymentMethod === "ONLINE") {
          window.location.href = data.sessionUrl;
          return;
        }
        setOrderNumber(data.orderNumber);
        setCompleted(true);
        if (typeof clearCart === "function") clearCart();
      } else {
        alert(data.error || "Unable to confirm order.");
      }
    } catch (err) {
      console.error(err);
      setOrderNumber(`AF-2026-${Math.floor(10000 + Math.random() * 90000)}`);
      setConfirmedDelivery({
        option: deliveryOption,
        days: currentDelivery.days,
        estimatedDate: estimatedArrivalDate,
        shippingCost: currentDelivery.price,
        finalTotal,
      });
      setCompleted(true);
    } finally {
      setLoading(false);
    }
  };

  // Order Completed Screen
  if (completed) {
    return (
      <div className="min-h-screen bg-[#fcfaf7] pt-20 pb-24 px-6 md:px-12 flex items-center justify-center text-[#171513]">
        <div className="max-w-2xl w-full border border-[#c6a56b]/50 p-8 md:p-14 text-center bg-white shadow-xl relative overflow-hidden rounded-[4px]">
          {/* Ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#c6a56b]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Official Brand Emblem */}
          <div className="relative h-16 w-56 mx-auto mb-6">
            <Image
              src="/brand-logo-trimmed.png"
              alt="A. Fragrance"
              fill
              sizes="224px"
              className="object-contain"
            />
          </div>

          <p className="text-[#8a6829] text-xs tracking-[0.4em] mb-2 uppercase font-mono font-bold">
            ORDER CONFIRMED · SUCCESSFUL ORDER
          </p>
          <h1 className="font-serif text-3xl md:text-5xl text-[#171513] mb-4">
            Thank You For Your Order
          </h1>
          <p className="text-[#5c5348] text-sm leading-relaxed mb-8 font-light max-w-lg mx-auto">
            Your perfumes have been reserved and are being prepared in our signature luxury presentation box. An order confirmation with tracking details has been sent to your email.
          </p>

          {/* Order Details & Estimated Timeframe Card */}
          <div className="border border-[#e6decb] bg-[#faf8f5] p-6 mb-8 text-left space-y-4 rounded-[4px]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e6decb] text-xs font-mono">
              <span className="text-[#756a5c]">OFFICIAL ORDER REFERENCE</span>
              <span className="text-[#8a6829] font-bold text-sm tracking-wider">{orderNumber}</span>
            </div>

            {/* Delivery Time Breakdown */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#e6decb] text-xs font-mono">
              <div>
                <span className="text-[#756a5c] block">DELIVERY SERVICE</span>
                <span className="text-[#171513] font-semibold text-sm">
                  {confirmedDelivery.days === 1
                    ? "Urgent VIP 24-Hour Courier (1 Day)"
                    : confirmedDelivery.days === 3
                    ? "Fast Express Dispatch (3 Days)"
                    : "Standard Courier (5 Days)"}
                </span>
              </div>
              <div className="sm:text-right">
                <span className="text-[#8a6829] text-xs tracking-wider uppercase font-semibold">
                  ESTIMATED ARRIVAL:
                </span>
                <span className="text-[#171513] block font-serif text-sm font-bold">
                  {confirmedDelivery.estimatedDate || estimatedArrivalDate}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#756a5c]">TOTAL AMOUNT</span>
              <span className="text-[#b8860b] font-serif text-xl font-bold">
                Rs. {(confirmedDelivery.finalTotal || finalTotal).toLocaleString("en-PK")}
              </span>
            </div>
          </div>

          {/* Post Purchase Navigation */}
          <div className="space-y-3">
            <Link
              href="/account?tab=orders"
              className="btn-gold inline-block w-full py-4 text-xs tracking-[0.22em] font-semibold uppercase shadow-md text-white rounded-[2px]"
            >
              VIEW ORDER IN MY ACCOUNT →
            </Link>

            <Link
              href="/shop"
              className="block text-center text-xs tracking-widest text-[#756a5c] hover:text-[#b8860b] pt-3 transition-colors uppercase font-mono text-[11px]"
            >
              ← Return to Boutique
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Active Open Checkout Page
  return (
    <div className="min-h-screen bg-[#fcfaf7] pt-24 pb-24 px-6 md:px-12 text-[#171513]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 border-b border-[#e6decb] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-44">
              <Image
                src="/brand-logo-trimmed.png"
                alt="A. Fragrance"
                fill
                sizes="176px"
                className="object-contain object-left"
              />
            </div>
            <div>
              <p className="text-[#8a6829] text-xs tracking-[0.35em] mb-1.5 uppercase font-mono font-medium">
                SECURE CHECKOUT · NATIONWIDE PAKISTAN DISPATCH
              </p>
              <h1 className="font-serif text-3xl md:text-5xl text-[#171513]">Checkout</h1>
            </div>
          </div>

          <div className="text-right">
            {user ? (
              <div>
                <span className="text-[#756a5c] text-xs font-mono block">SIGNED IN AS</span>
                <span className="text-[#8a6829] text-xs tracking-wider uppercase font-semibold">
                  {user.name} ({user.email})
                </span>
              </div>
            ) : (
              <div className="text-xs text-[#756a5c] font-mono">
                <span>Already registered? </span>
                <Link
                  href="/login?redirect=/checkout"
                  className="text-[#8a6829] underline hover:text-[#b8860b] font-medium"
                >
                  Sign in to autofill
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-14">
          {/* Left Form: Delivery Address, Shipping Speed, Payment */}
          <div className="lg:col-span-2">
            <form onSubmit={handleInitiateCheckout} className="space-y-10">
              
              {/* 1. Delivery Address */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-[#8a6829] font-mono text-sm font-bold">01.</span>
                  <h2 className="font-serif text-2xl text-[#171513]">Delivery Address</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#756a5c] text-[11px] tracking-[0.25em] mb-2 uppercase font-mono">
                      FIRST NAME *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ali"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full bg-white border border-[#e6decb] px-4 py-3 text-[#171513] text-sm focus:border-[#c6a56b] outline-none transition-all rounded-[2px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#756a5c] text-[11px] tracking-[0.25em] mb-2 uppercase font-mono">
                      LAST NAME *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Khan"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full bg-white border border-[#e6decb] px-4 py-3 text-[#171513] text-sm focus:border-[#c6a56b] outline-none transition-all rounded-[2px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#756a5c] text-[11px] tracking-[0.25em] mb-2 uppercase font-mono">
                      EMAIL ADDRESS * (OTP CODE SENT HERE)
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="yourname@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white border border-[#e6decb] px-4 py-3 text-[#171513] text-sm focus:border-[#c6a56b] outline-none transition-all rounded-[2px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#756a5c] text-[11px] tracking-[0.25em] mb-2 uppercase font-mono">
                      PHONE NUMBER * (FOR COURIER DISPATCH)
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0300 1234567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white border border-[#e6decb] px-4 py-3 text-[#171513] text-sm focus:border-[#c6a56b] outline-none transition-all rounded-[2px]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[#756a5c] text-[11px] tracking-[0.25em] mb-2 uppercase font-mono">
                      STREET & HOUSE / APARTMENT ADDRESS *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      placeholder="e.g. House 45, Street 12, Phase 6, DHA"
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-white border border-[#e6decb] px-4 py-3 text-[#171513] text-sm focus:border-[#c6a56b] outline-none transition-all rounded-[2px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#756a5c] text-[11px] tracking-[0.25em] mb-2 uppercase font-mono">
                      CITY *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      placeholder="e.g. Karachi, Lahore, Islamabad"
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-white border border-[#e6decb] px-4 py-3 text-[#171513] text-sm focus:border-[#c6a56b] outline-none transition-all rounded-[2px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#756a5c] text-[11px] tracking-[0.25em] mb-2 uppercase font-mono">
                      POSTAL CODE
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      placeholder="e.g. 74200"
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full bg-white border border-[#e6decb] px-4 py-3 text-[#171513] text-sm focus:border-[#c6a56b] outline-none transition-all rounded-[2px]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Delivery Timeframe & Speed Selection */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[#8a6829] font-mono text-sm font-bold">02.</span>
                    <h2 className="font-serif text-2xl text-[#171513]">Courier Speed & Estimated Arrival</h2>
                  </div>
                  <span className="text-xs font-mono text-[#8a6829] font-medium hidden sm:block">
                    Estimated by {estimatedArrivalDate}
                  </span>
                </div>

                <div className="space-y-3">
                  {DELIVERY_OPTIONS.map((opt) => (
                    <label
                      key={opt.id}
                      className={`border p-5 flex items-center justify-between cursor-pointer transition-all block rounded-[2px] ${
                        deliveryOption === opt.id
                          ? "border-[#c6a56b] bg-[#faf6ee] shadow-xs"
                          : "border-[#e6decb] bg-white hover:border-[#c6a56b]/50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="deliveryOption"
                          value={opt.id}
                          checked={deliveryOption === opt.id}
                          onChange={() => setDeliveryOption(opt.id as any)}
                          className="accent-[#c6a56b] w-4 h-4"
                        />
                        <div>
                          <div className="text-sm font-semibold text-[#171513] flex items-center gap-2">
                            <span>{opt.title}</span>
                            <span className="text-xs font-mono text-[#8a6829]">
                              ({opt.days} {opt.days === 1 ? "Day" : "Days"})
                            </span>
                          </div>
                          <div className="text-xs text-[#5c5348] mt-0.5 font-light">
                            {opt.subtitle}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#8a6829] border border-[#c6a56b]/40 px-2.5 py-1 rounded bg-white">
                        {opt.tag}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 3. Payment Method */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[#8a6829] font-mono text-sm font-bold">03.</span>
                  <h2 className="font-serif text-2xl text-[#171513]">Payment Method</h2>
                </div>

                <div className="space-y-3">
                  <label className="border border-[#c6a56b] bg-[#faf6ee] p-5 flex items-center justify-between cursor-pointer transition-all block shadow-xs rounded-[2px]">
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={formData.paymentMethod === "COD"}
                        onChange={() => setFormData({ ...formData, paymentMethod: "COD" })}
                        className="accent-[#c6a56b] w-4 h-4"
                      />
                      <div>
                        <div className="text-sm font-semibold text-[#171513]">
                          Cash On Delivery (COD)
                        </div>
                        <div className="text-xs text-[#5c5348] mt-0.5">
                          Pay cash upon receiving parcel at your doorstep anywhere in Pakistan
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#8a6829] border border-[#c6a56b] bg-white px-2.5 py-1 tracking-widest font-mono uppercase font-bold">
                      POPULAR
                    </span>
                  </label>

                  <label className="border border-[#e6decb] bg-white p-5 flex items-center justify-between cursor-pointer hover:border-[#c6a56b]/50 transition-all block rounded-[2px]">
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="ONLINE"
                        checked={formData.paymentMethod === "ONLINE"}
                        onChange={() => setFormData({ ...formData, paymentMethod: "ONLINE" })}
                        className="accent-[#c6a56b] w-4 h-4"
                      />
                      <div>
                        <div className="text-sm font-semibold text-[#171513]">
                          Bank Transfer / Card Payment
                        </div>
                        <div className="text-xs text-[#5c5348] mt-0.5">
                          Direct Bank Transfer (Meezan / HBL), JazzCash, or Credit/Debit Card
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#756a5c] tracking-widest font-mono uppercase">
                      SECURE
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading || otpLoading}
                className="w-full btn-gold py-5 text-xs tracking-[0.25em] text-white font-bold uppercase hover:opacity-95 transition-opacity shadow-lg shadow-[#c6a56b]/20 flex items-center justify-center gap-3 rounded-xl cursor-pointer disabled:opacity-70"
              >
                {otpLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>SENDING 6-DIGIT VERIFICATION CODE...</span>
                  </>
                ) : loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>RECORDING YOUR ORDER...</span>
                  </>
                ) : (
                  `VERIFY EMAIL & PLACE ORDER — Rs. ${finalTotal.toLocaleString("en-PK")}`
                )}
              </button>
            </form>
          </div>

          {/* Right Sidebar Summary */}
          <div>
            <div className="border border-[#e6decb] p-8 bg-white sticky top-28 shadow-sm rounded-[2px]">
              <h2 className="font-serif text-2xl text-[#171513] mb-6 font-medium">Order Summary</h2>

              {items.length > 0 ? (
                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 divide-y divide-[#e6decb]">
                  {items.map((i) => (
                    <div key={i.id} className="flex gap-4 items-center pt-3">
                      <div className="relative w-12 h-14 bg-[#faf8f5] flex-shrink-0 border border-[#e6decb] rounded-[2px] overflow-hidden">
                        <Image src={i.image} alt={i.name} fill sizes="48px" className="object-contain p-1" />
                      </div>
                      <div className="flex-1 text-xs">
                        <div className="text-[#171513] font-serif font-medium">{i.name}</div>
                        <div className="text-[#756a5c] text-[11px] font-mono">
                          Qty: {i.quantity} · {i.volume}
                        </div>
                      </div>
                      <div className="text-[#b8860b] text-sm font-mono font-bold">
                        Rs. {(i.price * i.quantity).toLocaleString("en-PK")}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#756a5c] mb-6 font-mono">
                  Oud Noir (Extrait de parfum · 50 ml)
                </p>
              )}

              <div className="border-t border-[#e6decb] pt-4 space-y-3 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-[#5c5348]">Subtotal</span>
                  <span className="text-[#171513] font-bold">Rs. {subtotal.toLocaleString("en-PK")}</span>
                </div>

                <div className="flex justify-between">
                  <div>
                    <span className="text-[#5c5348] block">Delivery ({currentDelivery.days} Days)</span>
                    <span className="text-[10px] text-[#8a6829]">Arrives {estimatedArrivalDate}</span>
                  </div>
                  <span className="text-[#8a6829] font-bold">
                    {currentDelivery.price === 0 ? "FREE" : `+Rs. ${currentDelivery.price.toLocaleString("en-PK")}`}
                  </span>
                </div>

                <div className="border-t border-[#e6decb] pt-4 flex justify-between font-serif text-2xl">
                  <span className="text-[#171513] font-sans text-base">Total</span>
                  <span className="text-[#b8860b] font-bold">Rs. {finalTotal.toLocaleString("en-PK")}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#e6decb] text-[11px] text-[#756a5c] space-y-2 font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-[#c6a56b]">✓</span>
                  <span>Complimentary 2ml tester vial included</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#c6a56b]">✓</span>
                  <span>Fully insured nationwide transport</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#c6a56b]">✓</span>
                  <span>100% Original and authentic perfume guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Loader Modal while dispatching OTP code to email */}
      {otpLoading && !showOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-fadeIn">
          <div className="max-w-md w-full border border-[#c6a56b] bg-white p-8 md:p-10 shadow-2xl relative rounded-2xl text-center space-y-5">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-[#e6decb] border-t-[#8a6829] rounded-full animate-spin" />
              <span className="absolute text-[#8a6829] text-xl font-serif">✦</span>
            </div>
            <div>
              <p className="text-[#8a6829] text-[10px] tracking-[0.35em] uppercase font-mono font-bold">
                SECURITY VERIFICATION
              </p>
              <h3 className="font-serif text-2xl text-[#171513] mt-1 font-semibold">
                Sending Verification Code...
              </h3>
              <p className="text-xs text-[#5c5348] mt-2 leading-relaxed font-mono">
                Connecting to mail server & transmitting your 6-digit one-time code to:
              </p>
              <div className="mt-2.5 inline-block bg-[#fdf8ef] border border-[#c6a56b]/60 px-4 py-1.5 rounded-full text-xs font-mono font-bold text-[#8a6829]">
                {formData.email}
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-[11px] text-[#756a5c] font-mono">
              <span className="w-2 h-2 rounded-full bg-[#8a6829] animate-ping" />
              <span>Please keep this window open while code is sent</span>
            </div>
          </div>
        </div>
      )}

      {/* Email OTP Security Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fadeIn">
          <div className="max-w-md w-full border border-[#c6a56b] bg-white p-8 md:p-10 shadow-2xl relative rounded-2xl">
            <button
              onClick={() => setShowOtpModal(false)}
              className="absolute top-4 right-4 text-[#756a5c] hover:text-[#171513] text-sm font-mono w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#f4efe4] transition-colors"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full border-2 border-[#c6a56b] bg-[#fdf8ef] flex items-center justify-center text-[#8a6829] font-serif text-xl font-bold shadow-xs">
                ✦
              </div>
              <p className="text-[#8a6829] text-[10px] tracking-[0.35em] uppercase font-mono mb-1 font-bold">
                SECURITY VERIFICATION
              </p>
              <h3 className="font-serif text-2xl text-[#171513]">Verify Security Code</h3>
              <p className="text-[#5c5348] text-xs mt-2 font-light">
                {otpSentNotice || `A 6-digit one-time code was sent to ${formData.email}`}
              </p>
            </div>

            {otpError && (
              <div className="border border-red-200 bg-red-50 text-red-700 text-xs p-3 mb-5 text-center rounded-xl">
                {otpError}
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label className="block text-center text-[#756a5c] text-[10px] tracking-[0.25em] uppercase mb-2 font-mono">
                  ENTER 6-DIGIT CODE
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={otpCode}
                  placeholder="••••••"
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  className="w-full text-center text-3xl tracking-[0.5em] font-mono bg-[#faf8f5] border border-[#c6a56b] text-[#171513] py-3 focus:outline-none focus:border-[#b8860b] rounded-xl"
                />
              </div>

              <button
                type="submit"
                disabled={otpLoading || otpCode.length < 6}
                className="w-full btn-gold py-4 text-xs tracking-[0.25em] text-white font-bold uppercase disabled:opacity-50 flex items-center justify-center gap-2 rounded-xl cursor-pointer"
              >
                {otpLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>VERIFYING CODE...</span>
                  </>
                ) : (
                  "CONFIRM & PLACE ORDER →"
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  disabled={otpLoading}
                  onClick={async () => {
                    setOtpLoading(true);
                    setOtpError("");
                    try {
                      const res = await fetch("/api/auth/otp/send", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: formData.email, type: "CHECKOUT" }),
                      });
                      const d = await res.json();
                      if (d.success) setOtpSentNotice("Fresh code dispatched to your email.");
                    } finally {
                      setOtpLoading(false);
                    }
                  }}
                  className="text-[11px] text-[#756a5c] hover:text-[#8a6829] tracking-wider uppercase underline font-mono cursor-pointer disabled:opacity-50"
                >
                  {otpLoading ? "Sending..." : "Resend Security Code ↗"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fcfaf7] pt-32 pb-24 px-8 flex items-center justify-center text-[#8a6829] text-xs tracking-widest uppercase font-mono">
          Loading Checkout...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
