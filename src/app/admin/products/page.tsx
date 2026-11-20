"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const ADMIN_KEY = "AFAdmin2026!";
const PAGE_SIZE = 20;

interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  price: number;
  priceAlt?: number;
  priceAltLabel?: string;
  volume?: string;
  type?: string;
  category: string;
  concentration?: string;
  gender: string;
  image: string;
  model3d?: string;
  description?: string;
  story?: string;
  opening?: string;
  heart?: string;
  trail?: string;
  badge?: string;
  inStock: boolean;
  collectionSlug?: string;
  rating?: number;
  reviewsCount?: number;
}

const EMPTY_PRODUCT: Omit<Product, "id"> = {
  slug: "", name: "", tagline: "", price: 0, priceAlt: undefined, priceAltLabel: "",
  volume: "", type: "", category: "Perfumes", concentration: "", gender: "Unisex",
  image: "", model3d: "", description: "", story: "", opening: "", heart: "", trail: "",
  badge: "", inStock: true, collectionSlug: "",
};

function Toast({ msg, type, onClose }: { msg: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-sans"
      style={{ background: type === "success" ? "#c6a56b" : "#ef4444", color: "#fff", maxWidth: "340px" }}>
      {msg}
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest mb-1" style={{ color: "#756a5c" }}>{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3 py-2 rounded-lg text-sm font-sans outline-none";
const inputStyle = { border: "1px solid #e6decb", background: "#fff", color: "#171513" };

function ProductModal({
  product,
  onClose,
  onSave,
}: {
  product: Partial<Product> | null;
  onClose: () => void;
  onSave: (data: Partial<Product>) => Promise<void>;
}) {
  const [form, setForm] = useState<Partial<Product>>(product ?? EMPTY_PRODUCT);
  const [saving, setSaving] = useState(false);

  function set(k: string, v: unknown) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto" style={{ background: "rgba(23,21,19,0.6)" }}>
      <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-2xl" style={{ border: "1px solid #e6decb" }}>
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: "#e6decb" }}>
          <h2 style={{ color: "#171513", fontFamily: "'Cormorant Garamond', serif" }} className="text-xl font-light">
            {form.id ? "Edit Product" : "New Product"}
          </h2>
          <button onClick={onClose} style={{ color: "#756a5c" }} className="text-xl leading-none">×</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FieldRow label="Slug *">
              <input required className={inputCls} style={inputStyle} value={form.slug ?? ""} onChange={(e) => set("slug", e.target.value)} />
            </FieldRow>
            <FieldRow label="Name *">
              <input required className={inputCls} style={inputStyle} value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} />
            </FieldRow>
          </div>
          <FieldRow label="Tagline">
            <input className={inputCls} style={inputStyle} value={form.tagline ?? ""} onChange={(e) => set("tagline", e.target.value)} />
          </FieldRow>
          <div className="grid grid-cols-3 gap-4">
            <FieldRow label="Price (PKR) *">
              <input required type="number" className={inputCls} style={inputStyle} value={form.price ?? ""} onChange={(e) => set("price", Number(e.target.value))} />
            </FieldRow>
            <FieldRow label="Alt Price">
              <input type="number" className={inputCls} style={inputStyle} value={form.priceAlt ?? ""} onChange={(e) => set("priceAlt", e.target.value ? Number(e.target.value) : undefined)} />
            </FieldRow>
            <FieldRow label="Alt Price Label">
              <input className={inputCls} style={inputStyle} value={form.priceAltLabel ?? ""} onChange={(e) => set("priceAltLabel", e.target.value)} />
            </FieldRow>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FieldRow label="Volume">
              <input className={inputCls} style={inputStyle} value={form.volume ?? ""} onChange={(e) => set("volume", e.target.value)} />
            </FieldRow>
            <FieldRow label="Type">
              <input className={inputCls} style={inputStyle} value={form.type ?? ""} onChange={(e) => set("type", e.target.value)} />
            </FieldRow>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <FieldRow label="Category">
              <select className={inputCls} style={inputStyle} value={form.category ?? "Perfumes"} onChange={(e) => set("category", e.target.value)}>
                <option>Perfumes</option>
                <option>Attars</option>
                <option>Oud</option>
                <option>Luxury Editions</option>
              </select>
            </FieldRow>
            <FieldRow label="Concentration">
              <input className={inputCls} style={inputStyle} value={form.concentration ?? ""} onChange={(e) => set("concentration", e.target.value)} />
            </FieldRow>
            <FieldRow label="Gender">
              <select className={inputCls} style={inputStyle} value={form.gender ?? "Unisex"} onChange={(e) => set("gender", e.target.value)}>
                <option>Unisex</option>
                <option>Men</option>
                <option>Women</option>
              </select>
            </FieldRow>
          </div>
          <FieldRow label="Image URL *">
            <input required className={inputCls} style={inputStyle} value={form.image ?? ""} onChange={(e) => set("image", e.target.value)} />
          </FieldRow>
          <FieldRow label="3D Model URL (optional)">
            <input className={inputCls} style={inputStyle} value={form.model3d ?? ""} onChange={(e) => set("model3d", e.target.value)} />
          </FieldRow>
          <FieldRow label="Description">
            <textarea rows={3} className={inputCls} style={inputStyle} value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} />
          </FieldRow>
          <FieldRow label="Story">
            <textarea rows={3} className={inputCls} style={inputStyle} value={form.story ?? ""} onChange={(e) => set("story", e.target.value)} />
          </FieldRow>
          <div className="grid grid-cols-3 gap-4">
            <FieldRow label="Opening Notes">
              <input className={inputCls} style={inputStyle} value={form.opening ?? ""} onChange={(e) => set("opening", e.target.value)} />
            </FieldRow>
            <FieldRow label="Heart Notes">
              <input className={inputCls} style={inputStyle} value={form.heart ?? ""} onChange={(e) => set("heart", e.target.value)} />
            </FieldRow>
            <FieldRow label="Trail Notes">
              <input className={inputCls} style={inputStyle} value={form.trail ?? ""} onChange={(e) => set("trail", e.target.value)} />
            </FieldRow>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FieldRow label="Badge (optional)">
              <input className={inputCls} style={inputStyle} value={form.badge ?? ""} onChange={(e) => set("badge", e.target.value)} />
            </FieldRow>
            <FieldRow label="Collection Slug">
              <input className={inputCls} style={inputStyle} value={form.collectionSlug ?? ""} onChange={(e) => set("collectionSlug", e.target.value)} />
            </FieldRow>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => set("inStock", !form.inStock)}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              style={{ background: form.inStock ? "#c6a56b" : "#e6decb" }}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.inStock ? "translate-x-6" : "translate-x-1"}`} />
            </button>
            <span className="text-sm" style={{ color: "#171513" }}>In Stock</span>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg text-sm font-sans"
              style={{ border: "1px solid #e6decb", color: "#756a5c" }}>
              Cancel
            </button>
            <button type="submit" disabled={saving} className="px-5 py-2 rounded-lg text-sm font-sans disabled:opacity-60"
              style={{ background: "#c6a56b", color: "#fff" }}>
              {saving ? "Saving…" : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("");
  const [modalProduct, setModalProduct] = useState<Partial<Product> | null | false>(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => setToast({ msg, type });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    try {
      const res = await fetch(`/api/admin/products?${params}`, { headers: { "x-admin-key": ADMIN_KEY } });
      const data = await res.json();
      setProducts(data.products ?? []);
      setTotal(data.total ?? 0);
    } catch {
      showToast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  }, [page, search, category]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  async function handleSave(data: Partial<Product>) {
    try {
      const isEdit = !!data.id;
      const res = await fetch("/api/admin/products", {
        method: isEdit ? "PUT" : "POST",
        headers: { "x-admin-key": ADMIN_KEY, "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setModalProduct(false);
      fetchProducts();
      showToast(isEdit ? "Product updated" : "Product created");
    } catch {
      showToast("Failed to save product", "error");
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE", headers: { "x-admin-key": ADMIN_KEY },
      });
      if (!res.ok) throw new Error();
      setProducts((p) => p.filter((pr) => pr.id !== id));
      setTotal((t) => t - 1);
      showToast("Product deleted");
    } catch {
      showToast("Failed to delete", "error");
    }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="p-6 md:p-8 space-y-6">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {modalProduct !== false && (
        <ProductModal product={modalProduct} onClose={() => setModalProduct(false)} onSave={handleSave} />
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <p style={{ color: "#c6a56b", letterSpacing: "0.15em" }} className="text-xs uppercase mb-1">Management</p>
          <h1 style={{ color: "#171513", fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl font-light">Products</h1>
          <p style={{ color: "#756a5c" }} className="text-sm mt-1">{total} total products</p>
        </div>
        <button onClick={() => setModalProduct(null)} className="px-5 py-2.5 rounded-xl text-sm font-sans whitespace-nowrap"
          style={{ background: "#c6a56b", color: "#fff" }}>
          + Add Product
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <form className="flex gap-2 flex-1" onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); setPage(1); }}>
          <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products…" className="flex-1 px-4 py-2 rounded-lg text-sm font-sans outline-none"
            style={{ border: "1px solid #e6decb", background: "#fff", color: "#171513" }} />
          <button type="submit" className="px-4 py-2 rounded-lg text-sm font-sans" style={{ background: "#c6a56b", color: "#fff" }}>Search</button>
          {search && (
            <button type="button" onClick={() => { setSearch(""); setSearchInput(""); setPage(1); }}
              className="px-3 py-2 rounded-lg text-sm font-sans" style={{ border: "1px solid #e6decb", color: "#756a5c" }}>Clear</button>
          )}
        </form>
        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          className="px-4 py-2 rounded-lg text-sm font-sans outline-none"
          style={{ border: "1px solid #e6decb", background: "#fff", color: "#171513" }}>
          <option value="">All Categories</option>
          {["Perfumes", "Attars", "Oud", "Luxury Editions"].map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid #e6decb" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid #e6decb" }}>
                {["", "Name", "Category", "Price", "Stock", "Actions"].map((h) => (
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
                        <div className="h-4 rounded" style={{ background: "linear-gradient(90deg,#e6decb 25%,#f3eada 50%,#e6decb 75%)", backgroundSize: "200% 100%" }} />
                      </td>
                    ))}
                  </tr>
                ))
                : products.map((p) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid #f3eada" }} className="hover:bg-[#fcfaf7] transition-colors">
                    <td className="px-4 py-3">
                      {p.image ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#f3eada] relative">
                          <Image src={p.image} alt={p.name} fill className="object-cover" sizes="48px" unoptimized />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-[#f3eada] flex items-center justify-center text-xl">🧴</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div style={{ color: "#171513" }} className="font-medium">{p.name}</div>
                      <div style={{ color: "#756a5c" }} className="text-xs">{p.slug}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#f3eada", color: "#756a5c" }}>
                        {p.category}
                      </span>
                    </td>
                    <td className="px-4 py-3" style={{ color: "#171513" }}>{fmt(p.price)}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: p.inStock ? "#dcfce7" : "#fee2e2", color: p.inStock ? "#166534" : "#991b1b" }}>
                        {p.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => setModalProduct(p)} className="text-xs px-3 py-1 rounded-lg"
                          style={{ border: "1px solid #e6decb", color: "#756a5c" }}>Edit</button>
                        <button onClick={() => handleDelete(p.id, p.name)} className="text-xs px-3 py-1 rounded-lg"
                          style={{ background: "#fee2e2", color: "#991b1b" }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              {!loading && products.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center" style={{ color: "#756a5c" }}>No products found</td></tr>
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
