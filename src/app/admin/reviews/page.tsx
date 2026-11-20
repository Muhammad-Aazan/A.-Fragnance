"use client";

import { useState, useEffect, useCallback } from "react";

const ADMIN_KEY = "AFAdmin2026!";
const PAGE_SIZE = 20;

interface Review {
  id: string;
  productId: string;
  productName?: string;
  author: string;
  rating: number;
  comment: string;
  verified: boolean;
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

function Stars({ rating }: { rating: number }) {
  return (
    <span style={{ color: "#c6a56b" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < rating ? "★" : "☆"}</span>
      ))}
    </span>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [productFilter, setProductFilter] = useState("");
  const [productInput, setProductInput] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => setToast({ msg, type });

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
    if (productFilter) params.set("productId", productFilter);
    try {
      const res = await fetch(`/api/admin/reviews?${params}`, { headers: { "x-admin-key": ADMIN_KEY } });
      const data = await res.json();
      setReviews(data.reviews ?? []);
      setTotal(data.total ?? 0);
    } catch {
      showToast("Failed to load reviews", "error");
    } finally {
      setLoading(false);
    }
  }, [page, productFilter]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  async function handleDelete(id: string, author: string) {
    if (!confirm(`Delete review by "${author}"?`)) return;
    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, {
        method: "DELETE", headers: { "x-admin-key": ADMIN_KEY },
      });
      if (!res.ok) throw new Error();
      setReviews((r) => r.filter((x) => x.id !== id));
      setTotal((t) => t - 1);
      showToast("Review deleted");
    } catch {
      showToast("Failed to delete review", "error");
    }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="p-6 md:p-8 space-y-6">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div>
        <p style={{ color: "#c6a56b", letterSpacing: "0.15em" }} className="text-xs uppercase mb-1">Management</p>
        <h1 style={{ color: "#171513", fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl font-light">Reviews</h1>
        <p style={{ color: "#756a5c" }} className="text-sm mt-1">{total} total reviews</p>
      </div>

      <form className="flex gap-2 max-w-md" onSubmit={(e) => { e.preventDefault(); setProductFilter(productInput); setPage(1); }}>
        <input value={productInput} onChange={(e) => setProductInput(e.target.value)}
          placeholder="Filter by Product ID…"
          className="flex-1 px-4 py-2 rounded-lg text-sm font-sans outline-none"
          style={{ border: "1px solid #e6decb", background: "#fff", color: "#171513" }} />
        <button type="submit" className="px-4 py-2 rounded-lg text-sm font-sans" style={{ background: "#c6a56b", color: "#fff" }}>Filter</button>
        {productFilter && (
          <button type="button" onClick={() => { setProductFilter(""); setProductInput(""); setPage(1); }}
            className="px-3 py-2 rounded-lg text-sm font-sans" style={{ border: "1px solid #e6decb", color: "#756a5c" }}>Clear</button>
        )}
      </form>

      <div className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid #e6decb" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid #e6decb" }}>
                {["Product", "Author", "Rating", "Comment", "Date", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left"
                    style={{ color: "#756a5c", fontWeight: 500, fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f3eada" }}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 rounded" style={{ background: "linear-gradient(90deg,#e6decb 25%,#f3eada 50%,#e6decb 75%)" }} />
                      </td>
                    ))}
                  </tr>
                ))
                : reviews.map((review) => (
                  <tr key={review.id} style={{ borderBottom: "1px solid #f3eada" }} className="hover:bg-[#fcfaf7] transition-colors">
                    <td className="px-4 py-4" style={{ color: "#171513" }}>
                      <div className="text-xs font-medium">{review.productName || "—"}</div>
                      <div style={{ color: "#756a5c" }} className="text-xs font-mono">{review.productId.slice(0, 8)}…</div>
                    </td>
                    <td className="px-4 py-4">
                      <div style={{ color: "#171513" }}>{review.author}</div>
                      {review.verified && (
                        <span className="text-xs" style={{ color: "#c6a56b" }}>✓ Verified</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <Stars rating={review.rating} />
                      <span style={{ color: "#756a5c" }} className="text-xs ml-1">({review.rating}/5)</span>
                    </td>
                    <td className="px-4 py-4" style={{ color: "#756a5c" }}>
                      <span className="line-clamp-2 max-w-xs block">{review.comment}</span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap" style={{ color: "#756a5c" }}>
                      {new Date(review.createdAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-4 py-4">
                      <button onClick={() => handleDelete(review.id, review.author)}
                        className="text-xs px-3 py-1 rounded-lg" style={{ background: "#fee2e2", color: "#991b1b" }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              {!loading && reviews.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center" style={{ color: "#756a5c" }}>No reviews found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t" style={{ borderColor: "#e6decb" }}>
            <span style={{ color: "#756a5c" }} className="text-sm">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 rounded-lg text-sm disabled:opacity-40" style={{ border: "1px solid #e6decb", color: "#756a5c" }}>Previous</button>
              <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 rounded-lg text-sm disabled:opacity-40" style={{ border: "1px solid #e6decb", color: "#756a5c" }}>Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
