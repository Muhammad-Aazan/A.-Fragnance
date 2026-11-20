"use client";

import { useState, useEffect, useCallback } from "react";

const ADMIN_KEY = "AFAdmin2026!";

interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

function Toast({ msg, type, onClose }: { msg: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-sans"
      style={{ background: type === "success" ? "#c6a56b" : "#ef4444", color: "#fff" }}>
      {msg}
    </div>
  );
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => setToast({ msg, type });

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/subscribers", { headers: { "x-admin-key": ADMIN_KEY } });
      const data = await res.json();
      setSubscribers(data.subscribers ?? data ?? []);
    } catch {
      showToast("Failed to load subscribers", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSubscribers(); }, [fetchSubscribers]);

  async function handleDelete(id: string, email: string) {
    if (!confirm(`Remove "${email}" from the newsletter list?`)) return;
    try {
      const res = await fetch(`/api/admin/subscribers?id=${id}`, {
        method: "DELETE", headers: { "x-admin-key": ADMIN_KEY },
      });
      if (!res.ok) throw new Error();
      setSubscribers((s) => s.filter((x) => x.id !== id));
      showToast("Subscriber removed");
    } catch {
      showToast("Failed to remove subscriber", "error");
    }
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div>
        <p style={{ color: "#c6a56b", letterSpacing: "0.15em" }} className="text-xs uppercase mb-1">Management</p>
        <h1 style={{ color: "#171513", fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl font-light">Subscribers</h1>
      </div>

      {/* Count card */}
      {!loading && (
        <div className="inline-flex flex-col items-center px-10 py-6 bg-white rounded-2xl" style={{ border: "1px solid #e6decb" }}>
          <p style={{ color: "#756a5c" }} className="text-xs uppercase tracking-widest mb-1">Total Newsletter Subscribers</p>
          <p style={{ color: "#171513", fontFamily: "'Cormorant Garamond', serif" }} className="text-5xl font-light">
            {subscribers.length}
          </p>
          <p style={{ color: "#c6a56b" }} className="text-xs mt-1">active subscribers</p>
        </div>
      )}

      <div className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid #e6decb" }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: "#e6decb" }}>
          <h3 style={{ color: "#171513", fontFamily: "'Cormorant Garamond', serif" }} className="text-lg font-light">
            All Subscribers
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid #e6decb" }}>
                <th className="px-6 py-3 text-left" style={{ color: "#756a5c", fontWeight: 500, fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" }}>#</th>
                <th className="px-6 py-3 text-left" style={{ color: "#756a5c", fontWeight: 500, fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" }}>Email</th>
                <th className="px-6 py-3 text-left" style={{ color: "#756a5c", fontWeight: 500, fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" }}>Joined</th>
                <th className="px-6 py-3 text-left" style={{ color: "#756a5c", fontWeight: 500, fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f3eada" }}>
                    {Array.from({ length: 4 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 rounded" style={{ background: "linear-gradient(90deg,#e6decb 25%,#f3eada 50%,#e6decb 75%)" }} />
                      </td>
                    ))}
                  </tr>
                ))
                : subscribers.map((sub, idx) => (
                  <tr key={sub.id} style={{ borderBottom: "1px solid #f3eada" }} className="hover:bg-[#fcfaf7] transition-colors">
                    <td className="px-6 py-4" style={{ color: "#756a5c" }}>{idx + 1}</td>
                    <td className="px-6 py-4" style={{ color: "#171513" }}>{sub.email}</td>
                    <td className="px-6 py-4" style={{ color: "#756a5c" }}>
                      {new Date(sub.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleDelete(sub.id, sub.email)}
                        className="text-xs px-3 py-1 rounded-lg" style={{ background: "#fee2e2", color: "#991b1b" }}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              {!loading && subscribers.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-12 text-center" style={{ color: "#756a5c" }}>No subscribers yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
