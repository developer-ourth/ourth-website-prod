"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  getProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  type MarketProduct,
  type MarketCategory,
  type ProductPayload,
} from "@/lib/api";
import { useCallback, useEffect, useState } from "react";

const UNITS = ["piece", "kg", "g", "litre", "ml", "dozen", "pack", "box", "pair"];

const EMPTY_FORM: ProductPayload = {
  name: "",
  description: "",
  category_id: null,
  base_price: 0,
  discounted_price: null,
  primary_image_url: "",
  sku: "",
  unit: "piece",
  stock_quantity: 0,
  weight_grams: null,
  is_active: true,
  is_featured: false,
};

export default function AdminProductsPage() {
  return (
    <DashboardGuard requiredRole="admin">
      <ProductsContent />
    </DashboardGuard>
  );
}

function ProductsContent() {
  const [products, setProducts]     = useState<MarketProduct[]>([]);
  const [categories, setCategories] = useState<MarketCategory[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [search, setSearch]         = useState("");
  const [catFilter, setCatFilter]   = useState("");
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal]   = useState(false);
  const [editId, setEditId]         = useState<number | null>(null);
  const [form, setForm]             = useState<ProductPayload>(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);
  const [formError, setFormError]   = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Parameters<typeof getProducts>[0] = { page, per_page: 15 };
      if (catFilter) params.category_id = parseInt(catFilter);
      if (search)    params.search = search;
      const res = await getProducts(params);
      setProducts(res.data ?? []);
      setTotalPages(res.meta?.last_page ?? 1);
    } catch {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, [page, catFilter, search]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    getCategories().then((r) => setCategories(r.data ?? [])).catch(() => {});
  }, []);

  function openCreate() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowModal(true);
  }

  function openEdit(p: MarketProduct) {
    setEditId(p.id);
    setForm({
      name: p.name,
      description: p.description ?? "",
      category_id: p.category_id,
      base_price: parseFloat(p.base_price),
      discounted_price: p.discounted_price ? parseFloat(p.discounted_price) : null,
      primary_image_url: p.primary_image_url ?? "",
      sku: p.sku ?? "",
      unit: p.unit,
      stock_quantity: p.stock_quantity,
      weight_grams: p.weight_grams,
      is_active: p.is_active,
      is_featured: p.is_featured,
    });
    setFormError("");
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.name.trim()) { setFormError("Product name is required."); return; }
    if (!form.base_price || form.base_price <= 0) { setFormError("Base price must be greater than 0."); return; }
    setSaving(true); setFormError("");
    try {
      if (editId) {
        await updateProduct(editId, form);
      } else {
        await createProduct(form);
      }
      setShowModal(false);
      load();
    } catch (e: unknown) {
      const msg = (e as { message?: string })?.message;
      setFormError(msg ?? "Failed to save product.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(id);
      load();
    } catch (e: unknown) {
      alert((e as { message?: string })?.message ?? "Failed to delete.");
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="mt-0.5 text-sm text-gray-500">Marketplace product catalogue</p>
        </div>
        <button
          onClick={openCreate}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          + Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search products…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-64 rounded-lg border border-stroke px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
        />
        <select
          value={catFilter}
          onChange={(e) => { setCatFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-stroke px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
        >
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="overflow-hidden rounded-xl border border-stroke bg-white shadow-sm dark:border-dark-3 dark:bg-gray-dark">
        <table className="min-w-full text-sm">
          <thead className="border-b border-stroke bg-gray-50 dark:border-dark-3 dark:bg-dark-2">
            <tr>
              {["Product", "Category", "Price", "Stock", "Unit", "Status", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stroke dark:divide-dark-3">
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">Loading…</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">No products found.</td></tr>
            ) : products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-dark-2">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.primary_image_url ? (
                      <img src={p.primary_image_url} alt={p.name} className="h-9 w-9 rounded-lg border border-stroke object-cover" />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">No img</div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{p.name}</p>
                      {p.is_featured && <span className="text-xs font-medium text-yellow-600">★ Featured</span>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{p.category?.name ?? "—"}</td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                  ₹{parseFloat(p.base_price).toFixed(2)}
                  {p.discounted_price && (
                    <span className="ml-1 text-xs text-green-600">→ ₹{parseFloat(p.discounted_price).toFixed(2)}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{p.stock_quantity}</td>
                <td className="px-4 py-3 capitalize text-gray-600 dark:text-gray-400">{p.unit}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${p.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {p.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="rounded bg-blue-50 px-2 py-1 text-xs text-blue-600 hover:bg-blue-100">Edit</button>
                    <button onClick={() => handleDelete(p.id, p.name)} className="rounded bg-red-50 px-2 py-1 text-xs text-red-600 hover:bg-red-100">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-stroke px-4 py-3 dark:border-dark-3">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="rounded border px-3 py-1 text-xs disabled:opacity-40">← Prev</button>
            <span className="text-xs text-gray-500">Page {page} of {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="rounded border px-3 py-1 text-xs disabled:opacity-40">Next →</button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-xl dark:bg-gray-dark">
            <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-dark-3">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{editId ? "Edit Product" : "Add New Product"}</h2>
              <button onClick={() => setShowModal(false)} className="text-xl leading-none text-gray-400 hover:text-gray-600">×</button>
            </div>
            <div className="space-y-4 px-6 py-4">
              {formError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{formError}</p>}

              <Field label="Product Name *">
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputCls} placeholder="e.g. Fresh Tomatoes" />
              </Field>
              <Field label="Description">
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} className={inputCls} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Category">
                  <select value={form.category_id ?? ""} onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value ? parseInt(e.target.value) : null }))} className={inputCls}>
                    <option value="">— None —</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </Field>
                <Field label="Unit">
                  <select value={form.unit} onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))} className={inputCls}>
                    {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Base Price (₹) *">
                  <input type="number" min="0" step="0.01" value={form.base_price} onChange={(e) => setForm((f) => ({ ...f, base_price: parseFloat(e.target.value) || 0 }))} className={inputCls} />
                </Field>
                <Field label="Sale Price (₹)">
                  <input type="number" min="0" step="0.01" value={form.discounted_price ?? ""} onChange={(e) => setForm((f) => ({ ...f, discounted_price: e.target.value ? parseFloat(e.target.value) : null }))} className={inputCls} placeholder="Optional" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Stock Quantity">
                  <input type="number" min="0" value={form.stock_quantity} onChange={(e) => setForm((f) => ({ ...f, stock_quantity: parseInt(e.target.value) || 0 }))} className={inputCls} />
                </Field>
                <Field label="Weight (grams)">
                  <input type="number" min="0" value={form.weight_grams ?? ""} onChange={(e) => setForm((f) => ({ ...f, weight_grams: e.target.value ? parseFloat(e.target.value) : null }))} className={inputCls} placeholder="Optional" />
                </Field>
              </div>
              <Field label="Product Image">
                <ImageUpload
                  value={form.primary_image_url}
                  onChange={(url) => setForm((f) => ({ ...f, primary_image_url: url }))}
                  aspectHint="PNG, JPG, WEBP — max 2 MB"
                />
              </Field>
              <Field label="SKU">
                <input value={form.sku} onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))} className={inputCls} placeholder="Auto-generated if empty" />
              </Field>
              <div className="flex gap-6">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} className="h-4 w-4" />
                  Active
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))} className="h-4 w-4" />
                  Featured
                </label>
              </div>
            </div>
            <div className="flex gap-3 border-t border-stroke px-6 py-4 dark:border-dark-3">
              <button onClick={() => setShowModal(false)} className="flex-1 rounded-lg border border-stroke py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50">
                {saving ? "Saving…" : editId ? "Save Changes" : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-400">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-stroke px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white";
