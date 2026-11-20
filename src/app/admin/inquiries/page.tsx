"use client";

import { useState, useEffect, useCallback } from "react";

const ADMIN_KEY = "AFAdmin2026!";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  status: "UNREAD" | "READ";
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

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => setToast({ msg, type });

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    try {
      const res = await fetch(`/api/admin/inquiries?${params}`, { headers: { "x-admin-key": ADMIN_KEY } });
      const data = await res.json();
      setInquiries(data.inquiries ?? data ?? []);
    } catch {
      showToast("Failed to load inquiries", "error");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchInquiries(); }, [fetchInquiries]);

  async function handleMarkRead(id: string) {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "x-admin-key": ADMIN_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "READ" }),
      });
      if (!res.ok) throw new Error();
      setInquiries((prev) => prev.map((inq) => inq.id === id ? { ...inq, status: "READ" } : inq));
      showToast("Marked as read");
    } catch {
      showToast("Failed to update", "error");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete inquiry from "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/inquiries?id=${id}`, {
        method: "DELETE", headers: { "x-admin-key": ADMIN_KEY },
      });
      if (!res.ok) throw new Error();
      setInquiries((i) => i.filter((x) => x.id !== id));
      showToast("Inquiry deleted");
    } catch {
      showToast("Failed to delete", "error");
    }
  }

  const unreadCount = inquiries.filter((i) => i.status === "UNREAD").length;

  return (
    <div className="p-6 md:p-8 space-y-6">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-start justify-between gap-4">
        <div>
          <p style={{ color: "#c6a56b", letterSpacing: "0.15em" }} className="text-xs uppercase mb-1">Management</p>
          <h1 style={{ color: "#171513", fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl font-light">Inquiries</h1>
          <p style={{ color: "#756a5c" }} className="text-sm mt-1">
            {inquiries.length} total · {unreadCount} unread
          </p>
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg text-sm font-sans outline-none"
          style={{ border: "1px solid #e6decb", background: "#fff", color: "#171513" }}>
          <option value="">All</option>
          <option value="UNREAD">Unread</option>
          <option value="READ">Read</option>
        </select>
      </div>

      <div className="space-y-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl" style={{ background: "linear-gradient(90deg,#e6decb 25%,#f3eada 50%,#e6decb 75%)", backgroundSize: "200% 100%" }} />
          ))
          : inquiries.length === 0 ? (
            <div className="text-center py-16" style={{ color: "#756a5c" }}>No inquiries found</div>
          )
          : inquiries.map((inq) => (
            <div key={inq.id} className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid #e6decb" }}>
              {/* Header Row */}
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-[#fcfaf7] transition-colors"
                onClick={() => setExpandedId(expandedId === inq.id ? null : inq.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span style={{ color: "#171513" }} className="font-medium text-sm">{inq.name}</span>
                    <span style={{ color: "#756a5c" }} className="text-xs">{inq.email}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: inq.status === "UNREAD" ? "rgba(198,165,107,0.15)" : "#f3f4f6",
                        color: inq.status === "UNREAD" ? "#c6a56b" : "#6b7280",
                        border: inq.status === "UNREAD" ? "1px solid #c6a56b" : "1px solid #e5e7eb",
                      }}
                    >
                      {inq.status}
                    </span>
                  </div>
                  <p style={{ color: "#756a5c" }} className="text-xs mt-1 truncate">{inq.message}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span style={{ color: "#756a5c" }} className="text-xs whitespace-nowrap">
                    {new Date(inq.createdAt).toLocaleDateString("en-GB")}
                  </span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#756a5c" strokeWidth="1.5"
                    className={`transition-transform ${expandedId === inq.id ? "rotate-180" : ""}`}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </div>

              {/* Expanded */}
              {expandedId === inq.id && (
                <div className="px-5 pb-5 border-t" style={{ borderColor: "#f3eada" }}>
                  <p style={{ color: "#171513" }} className="text-sm mt-4 leading-relaxed whitespace-pre-wrap">{inq.message}</p>
                  <div className="flex gap-3 mt-4">
                    {inq.status === "UNREAD" && (
                      <button
                        onClick={() => handleMarkRead(inq.id)}
                        disabled={updatingId === inq.id}
                        className="text-xs px-4 py-1.5 rounded-lg disabled:opacity-40"
                        style={{ background: "#c6a56b", color: "#fff" }}
                      >
                        {updatingId === inq.id ? "Updating…" : "Mark as Read"}
                      </button>
                    )}
                    <a href={`mailto:${inq.email}`} className="text-xs px-4 py-1.5 rounded-lg"
                      style={{ border: "1px solid #e6decb", color: "#756a5c" }}>
                      Reply via Email
                    </a>
                    <button onClick={() => handleDelete(inq.id, inq.name)} className="text-xs px-4 py-1.5 rounded-lg"
                      style={{ background: "#fee2e2", color: "#991b1b" }}>
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
