"use client";
import toast from "react-hot-toast";

import React from "react";
import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type MarketCategory,
  type CategoryPayload,
} from "@/lib/api";
import { useCallback, useEffect, useState } from "react";

const EMPTY_FORM: CategoryPayload = {
  name: "",
  description: "",
  icon_url: "",
  parent_id: null,
  sort_order: 0,
  is_active: true,
};

export default function AdminCategoriesPage() {
  return (
    <DashboardGuard requiredRole="admin">
      <CategoriesContent />
    </DashboardGuard>
  );
}

function CategoriesContent() {
  const [categories, setCategories] = useState<MarketCategory[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [editId, setEditId]         = useState<number | null>(null);
  const [form, setForm]             = useState<CategoryPayload>(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);
  const [formError, setFormError]   = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      setCategories(res.data ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowModal(true);
  }

  function openEdit(c: MarketCategory) {
    setEditId(c.id);
    setForm({
      name: c.name,
      description: c.description ?? "",
      icon_url: c.icon_url ?? "",
      parent_id: c.parent_id,
      sort_order: c.sort_order,
      is_active: c.is_active,
    });
    setFormError("");
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.name.trim()) { setFormError("Name is required."); return; }
    setSaving(true); setFormError("");
    try {
      if (editId) {
        await updateCategory(editId, form);
      } else {
        await createCategory(form);
      }
      setShowModal(false);
      load();
    } catch (e: unknown) {
      setFormError((e as { message?: string })?.message ?? "Failed to save category.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Delete category "${name}"?`)) return;
    try {
      await deleteCategory(id);
      load();
    } catch (e: unknown) {
      toast.error((e as { message?: string })?.message ?? "Failed to delete category.");
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
          <p className="mt-0.5 text-sm text-gray-500">Organise products into categories</p>
        </div>
        <button
          onClick={openCreate}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          + Add Category
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-stroke bg-white shadow-sm dark:border-dark-3 dark:bg-gray-dark">
        <table className="min-w-full text-sm">
          <thead className="border-b border-stroke bg-gray-50 dark:border-dark-3 dark:bg-dark-2">
            <tr>
              {["Category", "Slug", "Products", "Order", "Status", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stroke dark:divide-dark-3">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">Loading…</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">No categories yet.</td></tr>
            ) : categories.map((c) => (
              <React.Fragment key={c.id}>
                <tr className="hover:bg-gray-50 dark:hover:bg-dark-2">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {c.icon_url && <img src={c.icon_url} alt="" className="h-7 w-7 rounded object-cover" />}
                      <span className="font-medium text-gray-900 dark:text-white">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{c.slug}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{c.products_count ?? 0}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{c.sort_order}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${c.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {c.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(c)} className="rounded bg-blue-50 px-2 py-1 text-xs text-blue-600 hover:bg-blue-100">Edit</button>
                      <button onClick={() => handleDelete(c.id, c.name)} className="rounded bg-red-50 px-2 py-1 text-xs text-red-600 hover:bg-red-100">Delete</button>
                    </div>
                  </td>
                </tr>
                {c.children?.map((sub) => (
                  <tr key={sub.id} className="bg-gray-50/50 hover:bg-gray-50 dark:bg-dark-2/50 dark:hover:bg-dark-2">
                    <td className="py-2 pl-10 pr-4 text-gray-700 dark:text-gray-300">↳ {sub.name}</td>
                    <td className="px-4 py-2 font-mono text-xs text-gray-400">{sub.slug}</td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{sub.products_count ?? 0}</td>
                    <td className="px-4 py-2 text-gray-500">{sub.sort_order}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${sub.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {sub.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(sub)} className="rounded bg-blue-50 px-2 py-1 text-xs text-blue-600 hover:bg-blue-100">Edit</button>
                        <button onClick={() => handleDelete(sub.id, sub.name)} className="rounded bg-red-50 px-2 py-1 text-xs text-red-600 hover:bg-red-100">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl dark:bg-gray-dark">
            <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-dark-3">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{editId ? "Edit Category" : "New Category"}</h2>
              <button onClick={() => setShowModal(false)} className="text-xl leading-none text-gray-400 hover:text-gray-600">×</button>
            </div>
            <div className="space-y-4 px-6 py-4">
              {formError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{formError}</p>}
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-400">Name *</label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputCls} placeholder="e.g. Fresh Vegetables" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-400">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} className={inputCls} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-400">Category Icon</label>
                <ImageUpload
                  value={form.icon_url}
                  onChange={(url) => setForm((f) => ({ ...f, icon_url: url }))}
                  aspectHint="Square icon recommended — max 2 MB"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-400">Parent Category</label>
                  <select value={form.parent_id ?? ""} onChange={(e) => setForm((f) => ({ ...f, parent_id: e.target.value ? parseInt(e.target.value) : null }))} className={inputCls}>
                    <option value="">— Top-level —</option>
                    {categories.filter((c) => c.id !== editId).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-400">Sort Order</label>
                  <input type="number" min="0" value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} className={inputCls} />
                </div>
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} className="h-4 w-4" />
                Active
              </label>
            </div>
            <div className="flex gap-3 border-t border-stroke px-6 py-4 dark:border-dark-3">
              <button onClick={() => setShowModal(false)} className="flex-1 rounded-lg border border-stroke py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50">
                {saving ? "Saving…" : editId ? "Save" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-stroke px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white";
