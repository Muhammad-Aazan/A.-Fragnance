"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Dashboard", icon: "📊", href: "/admin" },
  { label: "Orders", icon: "📦", href: "/admin/orders" },
  { label: "Products", icon: "🧴", href: "/admin/products" },
  { label: "Collections", icon: "✨", href: "/admin/collections" },
  { label: "Customers", icon: "👤", href: "/admin/customers" },
  { label: "Reviews", icon: "⭐", href: "/admin/reviews" },
  { label: "Inquiries", icon: "💬", href: "/admin/inquiries" },
  { label: "Subscribers", icon: "📧", href: "/admin/subscribers" },
];

const ADMIN_KEY = "AFAdmin2026!";
const STORAGE_KEY = "af_admin_key";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [password, setPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Wait for hydration before reading localStorage (avoid SSR mismatch)
  useEffect(() => {
    setMounted(true);
    if (localStorage.getItem(STORAGE_KEY) === ADMIN_KEY) {
      setAuthed(true);
    }
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_KEY) {
      localStorage.setItem(STORAGE_KEY, ADMIN_KEY);
      setAuthed(true);
      setPwError("");
    } else {
      setPwError("Incorrect password. Please try again.");
      setPassword("");
    }
  }

  function handleLogout() {
    localStorage.removeItem(STORAGE_KEY);
    setAuthed(false);
    setSidebarOpen(false);
  }

  return (
    <div style={{ background: "#fcfaf7" }} className="min-h-screen font-sans">

      {/* ── Auth gate overlay ───────────────────────────────────────────────
          Rendered on top as a fixed overlay so {children} always mounts
          (required for Next.js instant-navigation validation). Hidden once
          authed or before hydration completes.
      ────────────────────────────────────────────────────────────────────── */}
      {mounted && !authed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "#fcfaf7" }}
        >
          <div
            className="w-full max-w-sm bg-white border shadow-xl p-10"
            style={{ borderColor: "#e6decb" }}
          >
            <div className="text-center mb-8">
              <p
                className="text-xs font-medium uppercase mb-3"
                style={{ color: "#c6a56b", letterSpacing: "0.15em" }}
              >
                A. Fragrance
              </p>
              <h1
                className="text-3xl font-light"
                style={{ color: "#171513", fontFamily: "'Cormorant Garamond', serif" }}
              >
                Command Centre
              </h1>
              <p className="text-sm mt-2" style={{ color: "#756a5c" }}>
                Enter your admin password to continue
              </p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  className="block text-xs uppercase tracking-widest mb-2"
                  style={{ color: "#756a5c" }}
                >
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  autoFocus
                  className="w-full px-4 py-3 text-sm bg-white outline-none transition-all"
                  style={{
                    border: `1px solid ${pwError ? "#ef4444" : "#e6decb"}`,
                    color: "#171513",
                  }}
                />
                {pwError && (
                  <p className="text-red-500 text-xs mt-1">{pwError}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full py-3 text-sm font-medium transition-all hover:opacity-90"
                style={{ background: "#c6a56b", color: "#fff", letterSpacing: "0.08em" }}
              >
                ENTER
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Admin chrome (always in DOM so children always render) ───────── */}
      <div
        className="flex min-h-screen"
        style={{ visibility: mounted && !authed ? "hidden" : "visible" }}
      >
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full z-30 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{
            width: "240px",
            background: "#fff",
            borderRight: "1px solid #e6decb",
            minHeight: "100vh",
          }}
        >
          {/* Brand */}
          <div className="px-6 py-6 border-b" style={{ borderColor: "#e6decb" }}>
            <p
              className="text-xs font-medium uppercase mb-1"
              style={{ color: "#c6a56b", letterSpacing: "0.15em" }}
            >
              A. Fragrance
            </p>
            <h2
              className="text-lg font-light leading-tight"
              style={{ color: "#171513", fontFamily: "'Cormorant Garamond', serif" }}
            >
              Command
            </h2>
          </div>

          {/* Nav links */}
          <nav className="flex-1 py-4 overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-6 py-3 text-sm transition-all"
                  style={{
                    color: isActive ? "#c6a56b" : "#756a5c",
                    background: isActive ? "rgba(198,165,107,0.08)" : "transparent",
                    borderRight: isActive ? "2px solid #c6a56b" : "2px solid transparent",
                    fontWeight: isActive ? 500 : 400,
                  }}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sign out */}
          <div className="p-6 border-t" style={{ borderColor: "#e6decb" }}>
            <button
              onClick={handleLogout}
              className="w-full text-xs uppercase tracking-widest py-2 transition-all hover:opacity-80"
              style={{ color: "#756a5c", border: "1px solid #e6decb" }}
            >
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile top bar */}
          <header
            className="flex items-center justify-between px-6 py-4 lg:hidden border-b"
            style={{ background: "#fff", borderColor: "#e6decb" }}
          >
            <button onClick={() => setSidebarOpen(true)} className="p-1">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#756a5c" strokeWidth="1.5">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <span
              className="text-lg font-light"
              style={{ color: "#171513", fontFamily: "'Cormorant Garamond', serif" }}
            >
              A. Fragrance — Command
            </span>
            <div className="w-6" />
          </header>

          {/* Page children — always rendered */}
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
