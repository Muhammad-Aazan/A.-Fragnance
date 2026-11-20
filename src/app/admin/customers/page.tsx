"use client";

import { useState, useEffect, useCallback } from "react";

const ADMIN_KEY = "AFAdmin2026!";
const PAGE_SIZE = 20;

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
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

export default function CustomersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => setToast({ msg, type });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
    if (search) params.set("search", search);
    try {
      const res = await fetch(`/api/admin/users?${params}`, { headers: { "x-admin-key": ADMIN_KEY } });
      const data = await res.json();
      setUsers(data.users ?? []);
      setTotal(data.total ?? 0);
    } catch {
      showToast("Failed to load customers", "error");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  async function handleRoleToggle(user: User) {
    const newRole = user.role === "ADMIN" ? "CUSTOMER" : "ADMIN";
    if (!confirm(`Change ${user.name}'s role to ${newRole}?`)) return;
    setUpdatingId(user.id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "x-admin-key": ADMIN_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, role: newRole }),
      });
      if (!res.ok) throw new Error();
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, role: newRole } : u));
      showToast(`Role updated to ${newRole}`);
    } catch {
      showToast("Failed to update role", "error");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, {
        method: "DELETE", headers: { "x-admin-key": ADMIN_KEY },
      });
      if (!res.ok) throw new Error();
      setUsers((u) => u.filter((x) => x.id !== id));
      setTotal((t) => t - 1);
      showToast("User deleted");
    } catch {
      showToast("Failed to delete user", "error");
    }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="p-6 md:p-8 space-y-6">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div>
        <p style={{ color: "#c6a56b", letterSpacing: "0.15em" }} className="text-xs uppercase mb-1">Management</p>
        <h1 style={{ color: "#171513", fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl font-light">Customers</h1>
        <p style={{ color: "#756a5c" }} className="text-sm mt-1">{total} total users</p>
      </div>

      <form className="flex gap-2 max-w-md" onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); setPage(1); }}>
        <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name or email…"
          className="flex-1 px-4 py-2 rounded-lg text-sm font-sans outline-none"
          style={{ border: "1px solid #e6decb", background: "#fff", color: "#171513" }} />
        <button type="submit" className="px-4 py-2 rounded-lg text-sm font-sans" style={{ background: "#c6a56b", color: "#fff" }}>Search</button>
        {search && (
          <button type="button" onClick={() => { setSearch(""); setSearchInput(""); setPage(1); }}
            className="px-3 py-2 rounded-lg text-sm font-sans" style={{ border: "1px solid #e6decb", color: "#756a5c" }}>Clear</button>
        )}
      </form>

      <div className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid #e6decb" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid #e6decb" }}>
                {["Name", "Email", "Role", "Joined", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left"
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
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 rounded" style={{ background: "linear-gradient(90deg,#e6decb 25%,#f3eada 50%,#e6decb 75%)" }} />
                      </td>
                    ))}
                  </tr>
                ))
                : users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: "1px solid #f3eada" }} className="hover:bg-[#fcfaf7] transition-colors">
                    <td className="px-6 py-4" style={{ color: "#171513" }}>{user.name || "—"}</td>
                    <td className="px-6 py-4" style={{ color: "#756a5c" }}>{user.email}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                        style={{
                          background: user.role === "ADMIN" ? "rgba(198,165,107,0.15)" : "#f3f4f6",
                          color: user.role === "ADMIN" ? "#c6a56b" : "#6b7280",
                          border: user.role === "ADMIN" ? "1px solid #c6a56b" : "1px solid #e5e7eb",
                        }}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4" style={{ color: "#756a5c" }}>
                      {new Date(user.createdAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRoleToggle(user)}
                          disabled={updatingId === user.id}
                          className="text-xs px-3 py-1 rounded-lg disabled:opacity-40"
                          style={{ border: "1px solid #e6decb", color: "#756a5c" }}
                        >
                          {user.role === "ADMIN" ? "→ Customer" : "→ Admin"}
                        </button>
                        <button onClick={() => handleDelete(user.id, user.name)} className="text-xs px-3 py-1 rounded-lg"
                          style={{ background: "#fee2e2", color: "#991b1b" }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              {!loading && users.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-12 text-center" style={{ color: "#756a5c" }}>No users found</td></tr>
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
