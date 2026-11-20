"use client";

import { useState, useEffect, useCallback } from "react";

const ADMIN_KEY = "AFAdmin2026!";

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  totalSubscribers: number;
  totalInquiries: number;
  recentOrders: RecentOrder[];
  monthlyRevenue: MonthlyRevenue[];
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

interface MonthlyRevenue {
  month: string;
  revenue: number;
}

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  CONFIRMED:  { bg: "#dcfce7", color: "#166534" },
  PENDING:    { bg: "#fef9c3", color: "#854d0e" },
  PROCESSING: { bg: "#fef9c3", color: "#854d0e" },
  SHIPPED:    { bg: "#dbeafe", color: "#1e40af" },
  DELIVERED:  { bg: "#bbf7d0", color: "#14532d" },
  CANCELLED:  { bg: "#fee2e2", color: "#991b1b" },
};

function Shimmer() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl" style={{ background: "linear-gradient(90deg, #e6decb 25%, #f3eada 50%, #e6decb 75%)", backgroundSize: "200% 100%" }} />
        ))}
      </div>
      <div className="h-64 rounded-xl" style={{ background: "linear-gradient(90deg, #e6decb 25%, #f3eada 50%, #e6decb 75%)" }} />
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div
      className="rounded-xl p-5 bg-white"
      style={{ border: "1px solid #e6decb" }}
    >
      <p style={{ color: "#756a5c" }} className="text-xs uppercase tracking-widest mb-2">{label}</p>
      <p style={{ color: "#171513", fontFamily: "'Cormorant Garamond', serif" }} className="text-2xl font-light">{value}</p>
      {sub && <p style={{ color: "#c6a56b" }} className="text-xs mt-1">{sub}</p>}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? { bg: "#f3f4f6", color: "#374151" };
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: s.bg, color: s.color }}>
      {status}
    </span>
  );
}

function BarChart({ data }: { data: MonthlyRevenue[] }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.revenue), 1);
  return (
    <div className="bg-white rounded-xl p-6" style={{ border: "1px solid #e6decb" }}>
      <h3 style={{ color: "#171513", fontFamily: "'Cormorant Garamond', serif" }} className="text-lg font-light mb-6">
        Monthly Revenue
      </h3>
      <div className="flex items-end gap-3 h-40">
        {data.map((d, i) => {
          const pct = (d.revenue / max) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <span style={{ color: "#756a5c" }} className="text-xs">
                {d.revenue > 0 ? `${Math.round(d.revenue / 1000)}k` : "0"}
              </span>
              <div className="w-full rounded-t-sm transition-all" style={{
                height: `${Math.max(pct, 2)}%`,
                background: i === data.length - 1 ? "#c6a56b" : "#e6decb",
                minHeight: "4px",
              }} />
              <span style={{ color: "#756a5c" }} className="text-xs truncate w-full text-center">
                {d.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats", {
        headers: { "x-admin-key": ADMIN_KEY },
      });
      const data = await res.json();
      if (!res.ok && !data.stats) throw new Error(data.error || "Failed to fetch stats");
      
      if (data.notice) {
        setNotice(data.notice);
      }
      setDbConnected(data.dbConnected ?? true);

      // API returns { stats: {...}, recentOrders, monthlyRevenue }
      setStats({
        ...data.stats,
        recentOrders: data.recentOrders ?? [],
        monthlyRevenue: data.monthlyRevenue ?? [],
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error loading stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <p style={{ color: "#c6a56b", letterSpacing: "0.15em" }} className="text-xs uppercase mb-1">Overview</p>
        <h1 style={{ color: "#171513", fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl font-light">
          Dashboard
        </h1>
      </div>

      {error && (
        <div className="rounded-xl p-4 text-sm" style={{ background: "#fee2e2", color: "#991b1b" }}>
          {error}
        </div>
      )}

      {notice && (
        <div className="rounded-xl p-4 text-xs font-sans border" style={{ background: "#fffbeb", borderColor: "#fde68a", color: "#92400e" }}>
          <div className="flex items-center gap-2 font-medium mb-1">
            <span>⚠️</span>
            <span>Database Access Notice (MongoDB Atlas)</span>
          </div>
          <p className="leading-relaxed text-[#78350f]">{notice}</p>
        </div>
      )}

      {loading ? (
        <Shimmer />
      ) : stats ? (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard label="Revenue" value={fmt(stats.totalRevenue)} />
            <StatCard label="Orders" value={stats.totalOrders} />
            <StatCard label="Products" value={stats.totalProducts} />
            <StatCard label="Customers" value={stats.totalUsers} />
            <StatCard label="Subscribers" value={stats.totalSubscribers} />
            <StatCard label="Inquiries" value={stats.totalInquiries} />
          </div>

          {/* Bar Chart */}
          {stats.monthlyRevenue && stats.monthlyRevenue.length > 0 && (
            <BarChart data={stats.monthlyRevenue} />
          )}

          {/* Recent Orders */}
          <div className="bg-white rounded-xl" style={{ border: "1px solid #e6decb" }}>
            <div className="px-6 py-4 border-b" style={{ borderColor: "#e6decb" }}>
              <h3 style={{ color: "#171513", fontFamily: "'Cormorant Garamond', serif" }} className="text-lg font-light">
                Recent Orders
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid #e6decb" }}>
                    {["Order #", "Customer", "Total", "Status", "Date"].map((h) => (
                      <th key={h} className="px-6 py-3 text-left" style={{ color: "#756a5c", fontWeight: 500, fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(stats.recentOrders ?? []).map((order) => (
                    <tr key={order.id} style={{ borderBottom: "1px solid #f3eada" }} className="hover:bg-[#fcfaf7] transition-colors">
                      <td className="px-6 py-4" style={{ color: "#c6a56b", fontFamily: "monospace" }}>
                        #{order.orderNumber}
                      </td>
                      <td className="px-6 py-4" style={{ color: "#171513" }}>{order.customerName}</td>
                      <td className="px-6 py-4" style={{ color: "#171513" }}>{fmt(order.total)}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4" style={{ color: "#756a5c" }}>
                        {new Date(order.createdAt).toLocaleDateString("en-GB")}
                      </td>
                    </tr>
                  ))}
                  {(!stats.recentOrders || stats.recentOrders.length === 0) && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center" style={{ color: "#756a5c" }}>
                        No recent orders
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
