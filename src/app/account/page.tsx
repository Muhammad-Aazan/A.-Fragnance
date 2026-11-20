"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

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
  createdAt: string;
}

interface OrderItem {
  productId?: string;
  productName: string;
  image?: string;
  price: number;
  volume?: string;
  quantity: number;
}

interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  city: string;
  country: string;
  postalCode: string;
  subtotal?: number;
  shippingCost?: number;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  deliveryOption?: string;
  deliveryDays?: number;
  estimatedDelivery?: string;
  items: OrderItem[];
  createdAt: string;
}

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "orders";

  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "dossier">(
    initialTab as any
  );
  const [user, setUser] = useState<AfUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Orders state
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    country: "Pakistan",
    postalCode: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSavedMsg, setProfileSavedMsg] = useState("");
  const [profileError, setProfileError] = useState("");

  // Sync tab with URL if param changes
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "profile" || tabParam === "orders" || tabParam === "dossier") {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Load user from localStorage and fetch MongoDB profile & orders
  useEffect(() => {
    const stored = localStorage.getItem("af_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setProfileForm({
          name: parsed.name || "",
          phone: parsed.phone || "",
          address: parsed.address || "",
          city: parsed.city || "London",
          country: parsed.country || "United Kingdom",
          postalCode: parsed.postalCode || "",
        });

        // Fetch fresh profile from MongoDB
        fetch(`/api/auth/profile?email=${encodeURIComponent(parsed.email)}`)
          .then((res) => res.json())
          .then((d) => {
            if (d.success && d.data) {
              setUser((prev) => ({ ...prev, ...d.data }));
              setProfileForm({
                name: d.data.name || "",
                phone: d.data.phone || "",
                address: d.data.address || "",
                city: d.data.city || "London",
                country: d.data.country || "United Kingdom",
                postalCode: d.data.postalCode || "",
              });
            }
          })
          .catch(console.error);

        // Fetch orders from MongoDB
        setOrdersLoading(true);
        fetch(`/api/orders?email=${encodeURIComponent(parsed.email)}`)
          .then((res) => res.json())
          .then((d) => {
            if (d.success && d.data) {
              setOrders(d.data);
            }
          })
          .catch(console.error)
          .finally(() => setOrdersLoading(false));
      } catch (e) {
        console.error(e);
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("af_user");
    setUser(null);
    window.dispatchEvent(new Event("af_auth_change"));
    router.push("/login");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);
    setProfileSavedMsg("");
    setProfileError("");

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          ...profileForm,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const updatedUser = { ...user, ...data.data };
        setUser(updatedUser);
        localStorage.setItem("af_user", JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("af_auth_change"));
        setProfileSavedMsg("Profile & delivery settings updated successfully.");
        setTimeout(() => setProfileSavedMsg(""), 3500);
      } else {
        setProfileError(data.error || "Unable to save changes.");
      }
    } catch {
      setProfileError("Network error updating profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcfaf7] pt-32 pb-24 px-8 flex items-center justify-center text-[#8a6829] text-xs tracking-widest uppercase font-mono">
        Loading Account Information...
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-[#fcfaf7] pt-28 pb-24 px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-10 border-b border-[#e6decb] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-[#8a6829] text-xs tracking-[0.4em] mb-2 uppercase font-mono">
                PATRON OF THE HOUSE
              </p>
              <h1 className="font-serif text-5xl text-[#171513]">{user.name}</h1>
              <p className="text-[#756a5c] text-sm mt-1">{user.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/shop"
                className="btn-gold px-5 py-2.5 text-xs text-[#171513] tracking-widest uppercase font-medium"
              >
                Explore Archive →
              </Link>
              <button
                onClick={handleLogout}
                className="border border-[#e6decb] px-5 py-2.5 text-xs text-[#756a5c] hover:text-[#171513] hover:border-[#c6a56b] tracking-widest uppercase transition-colors"
              >
                Sign Out ↗
              </button>
            </div>
          </div>

          {/* Patron Privileges Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="border border-[#e6decb] bg-white p-6">
              <span className="text-[#8a6829] text-[10px] tracking-widest uppercase font-mono block mb-1">
                MEMBERSHIP STATUS
              </span>
              <div className="font-serif text-2xl text-[#171513]">VIP Circle</div>
              <p className="text-[#756a5c] text-xs mt-1 font-light">
                Complimentary insured express delivery on all orders across Pakistan.
              </p>
            </div>

            <div className="border border-[#e6decb] bg-white p-6">
              <span className="text-[#8a6829] text-[10px] tracking-widest uppercase font-mono block mb-1">
                TOTAL ORDERS
              </span>
              <div className="font-serif text-2xl text-[#171513]">
                {orders.length} {orders.length === 1 ? "Order" : "Orders"}
              </div>
              <p className="text-[#756a5c] text-xs mt-1 font-light">
                Recorded in House of A. Fragrance archives.
              </p>
            </div>

            <div className="border border-[#e6decb] bg-white p-6">
              <span className="text-[#8a6829] text-[10px] tracking-widest uppercase font-mono block mb-1">
                CUSTOMER CARE
              </span>
              <div className="font-serif text-2xl text-[#171513]">Active</div>
              <Link
                href="/contact"
                className="text-[#8a6829] text-xs tracking-widest uppercase mt-1 inline-block hover:underline"
              >
                Direct Customer Consultation →
              </Link>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#e6decb] mb-8 gap-8">
            <button
              onClick={() => setActiveTab("orders")}
              className={`pb-4 text-xs uppercase tracking-[0.2em] font-medium transition-all relative ${
                activeTab === "orders"
                  ? "text-[#8a6829]"
                  : "text-[#756a5c] hover:text-[#171513]"
              }`}
            >
              My Orders ({orders.length})
              {activeTab === "orders" && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c6a56b]" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`pb-4 text-xs uppercase tracking-[0.2em] font-medium transition-all relative ${
                activeTab === "profile"
                  ? "text-[#8a6829]"
                  : "text-[#756a5c] hover:text-[#171513]"
              }`}
            >
              Profile & Delivery Settings
              {activeTab === "profile" && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c6a56b]" />
              )}
            </button>
          </div>

          {/* TAB 1: Placed Orders History */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              {ordersLoading ? (
                <div className="border border-[#e6decb] bg-white p-12 text-center text-[#8a6829] text-xs tracking-widest uppercase font-mono">
                  Loading Placed Acquisitions from Archive...
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div
                      key={order.id || order.orderNumber}
                      className="border border-[#e6decb] bg-white p-6 md:p-8 transition-colors hover:border-[#c6a56b]"
                    >
                      {/* Order Header */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#e6decb] gap-4 mb-6">
                        <div>
                          <div className="flex items-center gap-3 mb-1.5">
                            <span className="text-[#8a6829] font-mono text-base font-bold">
                              {order.orderNumber}
                            </span>
                            <span className="text-[10px] bg-[#fdf8ef] text-[#8a6829] border border-[#c6a56b]/50 px-2.5 py-0.5 tracking-widest font-mono uppercase font-semibold">
                              {order.status}
                            </span>
                            <span className="text-[10px] bg-[#f7f3eb] text-[#5c5348] border border-[#e6decb] px-2 py-0.5 font-mono">
                              {order.deliveryDays === 1
                                ? "⚡ 1-Day Urgent VIP"
                                : order.deliveryDays === 3
                                ? "✈ 3-Day Fast Express"
                                : "📦 5-Day Standard Courier"}
                            </span>
                          </div>
                          <p className="text-[#5c5348] text-xs font-mono">
                            Placed on {new Date(order.createdAt).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })} · Method: {order.paymentMethod} ({order.paymentStatus})
                          </p>
                          {order.estimatedDelivery && (
                            <p className="text-[#8a6829] text-xs font-mono mt-1 font-medium">
                              Estimated Arrival: {order.estimatedDelivery}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-[#5c5348] text-xs block font-mono">TOTAL AMOUNT</span>
                          <span className="font-serif text-2xl md:text-3xl text-[#171513] font-bold">
                            Rs. {order.total.toLocaleString("en-PK")}
                          </span>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="divide-y divide-[#e6decb] mb-6">
                        {(order.items || []).map((item, idx) => (
                          <div key={idx} className="py-3 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="relative w-12 h-14 bg-[#fcfaf7] border border-[#e6decb] flex-shrink-0">
                                <Image
                                  src={item.image || "/luxury-flacon.jpg"}
                                  alt={item.productName}
                                  fill
                                  className="object-contain p-1"
                                />
                              </div>
                              <div>
                                <h4 className="font-serif text-lg text-[#171513]">
                                  {item.productName}
                                </h4>
                                <p className="text-xs text-[#756a5c] font-mono">
                                  Qty: {item.quantity} · {item.volume || "50 ml"}
                                </p>
                              </div>
                            </div>
                            <div className="text-sm font-mono text-[#8a6829] font-bold">
                              Rs. {(item.price * item.quantity).toLocaleString("en-PK")}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Delivery destination footer */}
                      <div className="pt-4 border-t border-[#e6decb] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#756a5c] gap-2 font-light">
                        <span>
                          Insured Delivery to: {order.shippingAddress}, {order.city},{" "}
                          {order.country}
                        </span>
                        <span className="text-[#8a6829] font-mono text-[11px] tracking-wider uppercase">
                          ✓ VIP White-Glove Presentation
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-[#e6decb] bg-white p-12 text-center">
                  <span className="text-[#8a6829] font-serif text-4xl block mb-3">✦</span>
                  <h3 className="font-serif text-2xl text-[#171513] mb-2">
                    No Orders Placed Yet
                  </h3>
                  <p className="text-[#756a5c] text-xs max-w-md mx-auto mb-6 font-light">
                    Your confirmed orders will be listed here with live delivery tracking and dispatch status.
                  </p>
                  <Link
                    href="/shop"
                    className="btn-gold inline-block px-8 py-3.5 text-xs tracking-widest uppercase text-white font-medium"
                  >
                    Explore All Perfumes ↗
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Profile & Settings */}
          {activeTab === "profile" && (
            <div className="border border-[#e6decb] bg-white p-8 md:p-10">
              <div className="mb-8 pb-6 border-b border-[#e6decb]">
                <h2 className="font-serif text-3xl text-[#171513] mb-1">
                  Profile & Delivery Address
                </h2>
                <p className="text-[#756a5c] text-xs">
                  Maintain your delivery preferences and contact details for express shipping.
                </p>
              </div>

              {profileSavedMsg && (
                <div className="border border-[#c6a56b] bg-[#fdf8ef] text-[#8a6829] text-xs p-4 mb-6">
                  {profileSavedMsg}
                </div>
              )}

              {profileError && (
                <div className="border border-red-900/60 bg-red-950/20 text-red-300 text-xs p-4 mb-6">
                  {profileError}
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#756a5c] text-[11px] tracking-[0.25em] uppercase mb-2 font-mono">
                      FULL NAME
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full bg-white border border-[#e6decb] px-4 py-3 text-sm text-[#171513] focus:border-[#c6a56b] outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[#756a5c] text-[11px] tracking-[0.25em] uppercase mb-2 font-mono">
                      EMAIL ADDRESS (READ-ONLY)
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full bg-[#fcfaf7]/60 border border-[#e6decb]/40 px-4 py-3 text-sm text-[#756a5c] cursor-not-allowed outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[#756a5c] text-[11px] tracking-[0.25em] uppercase mb-2 font-mono">
                      CONTACT PHONE NUMBER
                    </label>
                    <input
                      type="text"
                      placeholder="+44 20 7946 0991"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full bg-white border border-[#e6decb] px-4 py-3 text-sm text-[#171513] focus:border-[#c6a56b] outline-none transition-colors"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[#756a5c] text-[11px] tracking-[0.25em] uppercase mb-2 font-mono">
                      DEFAULT DELIVERY ADDRESS
                    </label>
                    <input
                      type="text"
                      placeholder="Street address & suite"
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      className="w-full bg-white border border-[#e6decb] px-4 py-3 text-sm text-[#171513] focus:border-[#c6a56b] outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[#756a5c] text-[11px] tracking-[0.25em] uppercase mb-2 font-mono">
                      CITY
                    </label>
                    <input
                      type="text"
                      value={profileForm.city}
                      onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                      className="w-full bg-white border border-[#e6decb] px-4 py-3 text-sm text-[#171513] focus:border-[#c6a56b] outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[#756a5c] text-[11px] tracking-[0.25em] uppercase mb-2 font-mono">
                      POSTAL CODE
                    </label>
                    <input
                      type="text"
                      value={profileForm.postalCode}
                      onChange={(e) => setProfileForm({ ...profileForm, postalCode: e.target.value })}
                      className="w-full bg-white border border-[#e6decb] px-4 py-3 text-sm text-[#171513] focus:border-[#c6a56b] outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#e6decb] flex items-center justify-between">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="btn-gold px-8 py-3.5 text-xs tracking-[0.25em] text-white font-medium uppercase shadow-lg shadow-[#c6a56b]/20"
                  >
                    {savingProfile ? "SAVING CHANGES..." : "SAVE SETTINGS →"}
                  </button>

                  <Link
                    href="/forgot-password"
                    className="text-xs text-[#756a5c] hover:text-[#8a6829] underline tracking-wider font-mono"
                  >
                    Change Password via OTP ↗
                  </Link>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Not logged in view
  return (
    <div className="min-h-screen bg-[#fcfaf7] pt-28 pb-24 px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 border-b border-[#e6decb] pb-8">
          <p className="text-[#8a6829] text-xs tracking-[0.4em] mb-3 uppercase font-mono">
            CLIENT ACCESS
          </p>
          <h1 className="font-serif text-5xl text-[#171513]">My Account</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Sign In Prompt */}
          <div className="border border-[#e6decb] bg-white p-8 flex flex-col justify-between">
            <div>
              <p className="text-[#8a6829] text-[10px] tracking-[0.3em] uppercase mb-2 font-mono">
                EXISTING PATRONS
              </p>
              <h2 className="font-serif text-3xl text-[#171513] mb-4">Sign In</h2>
              <p className="text-[#756a5c] text-sm leading-relaxed mb-6 font-light">
                Access your private order records, olfactory preferences, and curated recommendations.
              </p>
            </div>
            <div className="space-y-3">
              <Link
                href="/login"
                className="w-full btn-gold py-4 text-xs tracking-[0.25em] text-[#171513] font-medium flex items-center justify-center uppercase block text-center"
              >
                Sign In to Account →
              </Link>
              <Link
                href="/forgot-password"
                className="block text-center text-[#756a5c] text-xs tracking-wider hover:text-[#8a6829] transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          {/* Benefits / Create Account */}
          <div className="border border-[#e6decb] bg-white p-8 flex flex-col justify-between">
            <div>
              <p className="text-[#8a6829] text-[10px] tracking-[0.3em] uppercase mb-2 font-mono">
                NEW PATRONS
              </p>
              <h2 className="font-serif text-3xl text-[#171513] mb-4">Privileges of the House</h2>
              <p className="text-[#756a5c] text-sm leading-relaxed mb-6 font-light">
                Create an account to track deliveries, maintain your personal fragrance profile, and receive invitations to private extrait releases.
              </p>
              <ul className="space-y-3 text-xs text-[#756a5c]">
                <li className="flex items-center gap-3">
                  <span className="text-[#8a6829]">✦</span> Complimentary samples with every order
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#8a6829]">✦</span> Early access to limited batch extraits
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#8a6829]">✦</span> Private consultation booking
                </li>
              </ul>
            </div>
            <Link
              href="/signup"
              className="w-full border border-[#c6a56b]/40 py-4 text-xs tracking-[0.25em] text-[#8a6829] hover:bg-[#fdf8ef] transition-colors uppercase block text-center mt-6"
            >
              Establish New Account →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fcfaf7] pt-32 pb-24 px-8 flex items-center justify-center text-[#8a6829] text-xs tracking-widest uppercase font-mono">
          Loading Account...
        </div>
      }
    >
      <AccountContent />
    </Suspense>
  );
}


