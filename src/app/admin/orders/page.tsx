"use client";

import { useState, useEffect, useCallback } from "react";

const ADMIN_KEY = "AFAdmin2026!";
const PAGE_SIZE = 20;

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  paymentMethod: string;
  paymentStatus: string;
  deliveryOption: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

const STATUSES = ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  CONFIRMED:  { bg: "#dcfce7", color: "#166534" },
  PENDING:    { bg: "#fef9c3", color: "#854d0e" },
  PROCESSING: { bg: "#fef9c3", color: "#854d0e" },
  SHIPPED:    { bg: "#dbeafe", color: "#1e40af" },
  DELIVERED:  { bg: "#bbf7d0", color: "#14532d" },
  CANCELLED:  { bg: "#fee2e2", color: "#991b1b" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? { bg: "#f3f4f6", color: "#374151" };
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: s.bg, color: s.color }}>
      {status}
    </span>
  );
}

function Toast({ msg, type, onClose }: { msg: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-sans"
      style={{ background: type === "success" ? "#c6a56b" : "#ef4444", color: "#fff", maxWidth: "340px" }}>
      {msg}
    </div>
  );
}

function RowSkeleton() {
  return (
    <tr>
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 rounded" style={{ background: "linear-gradient(90deg,#e6decb 25%,#f3eada 50%,#e6decb 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
        </td>
      ))}
    </tr>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") =>
    setToast({ msg, type });

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);
    try {
      const res = await fetch(`/api/admin/orders?${params}`, {
        headers: { "x-admin-key": ADMIN_KEY },
      });
      const data = await res.json();
      setOrders(data.orders ?? []);
      setTotal(data.total ?? 0);
    } catch {
      showToast("Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  async function handleStatusChange(orderId: string, newStatus: string) {
    setUpdatingStatus(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "x-admin-key": ADMIN_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (!res.ok) throw new Error();
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
      showToast("Order status updated");
    } catch {
      showToast("Failed to update status", "error");
    } finally {
      setUpdatingStatus(null);
    }
  }

  async function handleDelete(id: string, orderNumber: string) {
    if (!confirm(`Delete order #${orderNumber}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/orders?id=${id}`, {
        method: "DELETE",
        headers: { "x-admin-key": ADMIN_KEY },
      });
      if (!res.ok) throw new Error();
      setOrders((prev) => prev.filter((o) => o.id !== id));
      setTotal((t) => t - 1);
      showToast("Order deleted");
    } catch {
      showToast("Failed to delete order", "error");
    }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="p-6 md:p-8 space-y-6">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div>
        <p style={{ color: "#c6a56b", letterSpacing: "0.15em" }} className="text-xs uppercase mb-1">Management</p>
        <h1 style={{ color: "#171513", fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl font-light">Orders</h1>
        <p style={{ color: "#756a5c" }} className="text-sm mt-1">{total} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form
          className="flex gap-2 flex-1"
          onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); setPage(1); }}
        >
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or email…"
            className="flex-1 px-4 py-2 rounded-lg text-sm font-sans outline-none"
            style={{ border: "1px solid #e6decb", background: "#fff", color: "#171513" }}
          />
          <button type="submit" className="px-4 py-2 rounded-lg text-sm font-sans"
            style={{ background: "#c6a56b", color: "#fff" }}>Search</button>
          {search && (
            <button type="button" onClick={() => { setSearch(""); setSearchInput(""); setPage(1); }}
              className="px-3 py-2 rounded-lg text-sm font-sans" style={{ border: "1px solid #e6decb", color: "#756a5c" }}>
              Clear
            </button>
          )}
        </form>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2 rounded-lg text-sm font-sans outline-none"
          style={{ border: "1px solid #e6decb", background: "#fff", color: "#171513" }}
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid #e6decb" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid #e6decb" }}>
                {["Order #", "Customer", "Items", "Total", "Payment", "Delivery", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left whitespace-nowrap"
                    style={{ color: "#756a5c", fontWeight: 500, fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <RowSkeleton key={i} />)
                : orders.map((order) => (
                  <>
                    <tr
                      key={order.id}
                      className="cursor-pointer hover:bg-[#fcfaf7] transition-colors"
                      style={{ borderBottom: "1px solid #f3eada" }}
                      onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                    >
                      <td className="px-4 py-4" style={{ color: "#c6a56b", fontFamily: "monospace" }}>
                        #{order.orderNumber}
                      </td>
                      <td className="px-4 py-4">
                        <div style={{ color: "#171513" }}>{order.customerName}</div>
                        <div style={{ color: "#756a5c" }} className="text-xs">{order.customerEmail}</div>
                      </td>
                      <td className="px-4 py-4" style={{ color: "#756a5c" }}>
                        {order.items?.length ?? 0}
                      </td>
                      <td className="px-4 py-4" style={{ color: "#171513" }}>{fmt(order.total)}</td>
                      <td className="px-4 py-4">
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: order.paymentStatus === "PAID" ? "#dcfce7" : "#fef9c3",
                            color: order.paymentStatus === "PAID" ? "#166534" : "#854d0e" }}>
                          {order.paymentMethod} · {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs" style={{ color: "#756a5c" }}>
                        {order.deliveryOption}
                      </td>
                      <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          disabled={updatingStatus === order.id}
                          className="text-xs rounded-lg px-2 py-1 outline-none"
                          style={{ border: "1px solid #e6decb", background: "#fff", color: "#171513" }}
                        >
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleDelete(order.id, order.orderNumber)}
                          className="text-xs px-3 py-1 rounded-lg transition-colors hover:opacity-80"
                          style={{ background: "#fee2e2", color: "#991b1b" }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                    {expandedId === order.id && (
                      <tr key={`${order.id}-expanded`} style={{ background: "#fcfaf7", borderBottom: "1px solid #e6decb" }}>
                        <td colSpan={8} className="px-6 py-4">
                          <p style={{ color: "#756a5c" }} className="text-xs uppercase tracking-widest mb-3">Order Items</p>
                          <div className="space-y-2">
                            {(order.items ?? []).map((item) => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <span style={{ color: "#171513" }}>{item.productName} × {item.quantity}</span>
                                <span style={{ color: "#c6a56b" }}>{fmt(item.price * item.quantity)}</span>
                              </div>
                            ))}
                            <div className="border-t pt-2 mt-2 flex justify-between text-sm" style={{ borderColor: "#e6decb" }}>
                              <span style={{ color: "#756a5c" }}>Subtotal</span>
                              <span style={{ color: "#171513" }}>{fmt(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span style={{ color: "#756a5c" }}>Shipping</span>
                              <span style={{ color: "#171513" }}>{fmt(order.shippingCost)}</span>
                            </div>
                            <div className="flex justify-between text-sm font-medium">
                              <span style={{ color: "#171513" }}>Total</span>
                              <span style={{ color: "#c6a56b" }}>{fmt(order.total)}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              {!loading && orders.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center" style={{ color: "#756a5c" }}>
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t" style={{ borderColor: "#e6decb" }}>
            <span style={{ color: "#756a5c" }} className="text-sm">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 rounded-lg text-sm disabled:opacity-40"
                style={{ border: "1px solid #e6decb", color: "#756a5c" }}
              >
                Previous
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 rounded-lg text-sm disabled:opacity-40"
                style={{ border: "1px solid #e6decb", color: "#756a5c" }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
