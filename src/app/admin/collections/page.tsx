"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const ADMIN_KEY = "AFAdmin2026!";

interface Collection {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
}

const EMPTY: Omit<Collection, "id"> = { slug: "", name: "", tagline: "", description: "", image: "" };

function Toast({ msg, type, onClose }: { msg: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-sans"
      style={{ background: type === "success" ? "#c6a56b" : "#ef4444", color: "#fff" }}>
      {msg}
    </div>
  );
}

function CollectionModal({
  collection, onClose, onSave,
}: { collection: Partial<Collection> | null; onClose: () => void; onSave: (d: Partial<Collection>) => Promise<void> }) {
  const [form, setForm] = useState<Partial<Collection>>(collection ?? EMPTY);
  const [saving, setSaving] = useState(false);

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  }

  const inputCls = "w-full px-3 py-2 rounded-lg text-sm font-sans outline-none";
  const inputStyle = { border: "1px solid #e6decb", background: "#fff", color: "#171513" };
  const labelCls = "block text-xs uppercase tracking-widest mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(23,21,19,0.6)" }}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl" style={{ border: "1px solid #e6decb" }}>
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: "#e6decb" }}>
          <h2 style={{ color: "#171513", fontFamily: "'Cormorant Garamond', serif" }} className="text-xl font-light">
            {form.id ? "Edit Collection" : "New Collection"}
          </h2>
          <button onClick={onClose} style={{ color: "#756a5c" }} className="text-xl">×</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={labelCls} style={{ color: "#756a5c" }}>Slug *</label>
            <input required className={inputCls} style={inputStyle} value={form.slug ?? ""} onChange={(e) => set("slug", e.target.value)} />
          </div>
          <div>
            <label className={labelCls} style={{ color: "#756a5c" }}>Name *</label>
            <input required className={inputCls} style={inputStyle} value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div>
            <label className={labelCls} style={{ color: "#756a5c" }}>Tagline</label>
            <input className={inputCls} style={inputStyle} value={form.tagline ?? ""} onChange={(e) => set("tagline", e.target.value)} />
          </div>
          <div>
            <label className={labelCls} style={{ color: "#756a5c" }}>Description</label>
            <textarea rows={3} className={inputCls} style={inputStyle} value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} />
          </div>
          <div>
            <label className={labelCls} style={{ color: "#756a5c" }}>Image URL *</label>
            <input required className={inputCls} style={inputStyle} value={form.image ?? ""} onChange={(e) => set("image", e.target.value)} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg text-sm font-sans"
              style={{ border: "1px solid #e6decb", color: "#756a5c" }}>Cancel</button>
            <button type="submit" disabled={saving} className="px-5 py-2 rounded-lg text-sm font-sans disabled:opacity-60"
              style={{ background: "#c6a56b", color: "#fff" }}>
              {saving ? "Saving…" : "Save Collection"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Partial<Collection> | null | false>(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => setToast({ msg, type });

  const fetchCollections = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/collections", { headers: { "x-admin-key": ADMIN_KEY } });
      const data = await res.json();
      setCollections(data.collections ?? data ?? []);
    } catch {
      showToast("Failed to load collections", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCollections(); }, [fetchCollections]);

  async function handleSave(data: Partial<Collection>) {
    try {
      const isEdit = !!data.id;
      const res = await fetch("/api/admin/collections", {
        method: isEdit ? "PUT" : "POST",
        headers: { "x-admin-key": ADMIN_KEY, "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setModal(false);
      fetchCollections();
      showToast(isEdit ? "Collection updated" : "Collection created");
    } catch {
      showToast("Failed to save collection", "error");
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete collection "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/collections?id=${id}`, {
        method: "DELETE", headers: { "x-admin-key": ADMIN_KEY },
      });
      if (!res.ok) throw new Error();
      setCollections((c) => c.filter((x) => x.id !== id));
      showToast("Collection deleted");
    } catch {
      showToast("Failed to delete", "error");
    }
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {modal !== false && <CollectionModal collection={modal} onClose={() => setModal(false)} onSave={handleSave} />}

      <div className="flex items-start justify-between gap-4">
        <div>
          <p style={{ color: "#c6a56b", letterSpacing: "0.15em" }} className="text-xs uppercase mb-1">Management</p>
          <h1 style={{ color: "#171513", fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl font-light">Collections</h1>
          <p style={{ color: "#756a5c" }} className="text-sm mt-1">{collections.length} collections</p>
        </div>
        <button onClick={() => setModal(null)} className="px-5 py-2.5 rounded-xl text-sm font-sans whitespace-nowrap"
          style={{ background: "#c6a56b", color: "#fff" }}>
          + Add Collection
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 rounded-xl" style={{ background: "linear-gradient(90deg,#e6decb 25%,#f3eada 50%,#e6decb 75%)", backgroundSize: "200% 100%" }} />
          ))}
        </div>
      ) : collections.length === 0 ? (
        <div className="text-center py-16" style={{ color: "#756a5c" }}>No collections yet</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((col) => (
            <div key={col.id} className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid #e6decb" }}>
              {col.image ? (
                <div className="relative h-40 bg-[#f3eada]">
                  <Image src={col.image} alt={col.name} fill className="object-cover" sizes="400px" unoptimized />
                </div>
              ) : (
                <div className="h-40 bg-[#f3eada] flex items-center justify-center text-4xl">✨</div>
              )}
              <div className="p-4">
                <h3 style={{ color: "#171513", fontFamily: "'Cormorant Garamond', serif" }} className="text-lg font-light">{col.name}</h3>
                <p style={{ color: "#c6a56b" }} className="text-xs mb-1">{col.slug}</p>
                {col.tagline && <p style={{ color: "#756a5c" }} className="text-sm mb-2 line-clamp-1">{col.tagline}</p>}
                {col.description && <p style={{ color: "#756a5c" }} className="text-xs line-clamp-2 mb-3">{col.description}</p>}
                <div className="flex gap-2 mt-2">
                  <button onClick={() => setModal(col)} className="flex-1 text-xs py-1.5 rounded-lg"
                    style={{ border: "1px solid #e6decb", color: "#756a5c" }}>Edit</button>
                  <button onClick={() => handleDelete(col.id, col.name)} className="flex-1 text-xs py-1.5 rounded-lg"
                    style={{ background: "#fee2e2", color: "#991b1b" }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
