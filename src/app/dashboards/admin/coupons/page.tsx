"use client";
import toast from "react-hot-toast";
import React from "react";
import { DashboardGuard } from "@/components/ui/dashboard-guard";
import {
  getAdminCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getProducts,
  type Coupon,
  type CouponPayload,
  type MarketProduct
} from "@/lib/api";
import { useCallback, useEffect, useState } from "react";

const EMPTY_FORM: CouponPayload = {
  code: "",
  discount_percentage: 0,
  product_id: null,
  expires_at: null,
  usage_limit: null,
  is_active: true,
};

export default function AdminCouponsPage() {
  return (
    <DashboardGuard requiredRole="admin">
      <CouponsContent />
    </DashboardGuard>
  );
}

function CouponsContent() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [products, setProducts] = useState<MarketProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<CouponPayload>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminCoupons();
      setCoupons(res);
      // Fetch products for the dropdown
      const prodRes = await getProducts({ per_page: 1000 });
      if (prodRes && prodRes.data) {
        setProducts(prodRes.data);
      }
    } catch (e) {
      toast.error("Failed to load coupons");
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

  function openEdit(c: Coupon) {
    setEditId(c.id);
    setForm({
      code: c.code,
      discount_percentage: parseFloat(c.discount_percentage) || 0,
      product_id: c.product_id,
      expires_at: c.expires_at ? c.expires_at.split(' ')[0] : null, // format date appropriately for date input
      usage_limit: c.usage_limit,
      is_active: c.is_active,
    });
    setFormError("");
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.code.trim()) { setFormError("Code is required."); return; }
    if (form.discount_percentage <= 0 || form.discount_percentage > 100) {
        setFormError("Discount must be between 0 and 100."); return;
    }
    setSaving(true); setFormError("");
    try {
      if (editId) {
        await updateCoupon(editId, form);
      } else {
        await createCoupon(form);
      }
      setShowModal(false);
      load();
    } catch (e: unknown) {
      setFormError((e as { message?: string })?.message ?? "Failed to save coupon.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number, code: string) {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    try {
      await deleteCoupon(id);
      load();
    } catch (e: unknown) {
      toast.error((e as { message?: string })?.message ?? "Failed to delete coupon.");
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Coupons</h1>
          <p className="mt-0.5 text-sm text-gray-500">Manage promotional discount codes</p>
        </div>
        <button
          onClick={openCreate}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          + Add Coupon
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-stroke bg-white shadow-sm dark:border-dark-3 dark:bg-gray-dark">
        <table className="min-w-full text-sm">
          <thead className="border-b border-stroke bg-gray-50 dark:border-dark-3 dark:bg-dark-2">
            <tr>
              {["Code", "Discount", "Applies To", "Expires At", "Usage Limit", "Status", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stroke dark:divide-dark-3">
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">Loading…</td></tr>
            ) : coupons.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">No coupons yet.</td></tr>
            ) : coupons.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-dark-2">
                <td className="px-4 py-3">
                  <span className="font-bold font-mono text-gray-900 dark:text-white">{c.code}</span>
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{Number(c.discount_percentage)}%</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {c.product_id ? (c.product?.name ?? `Product #${c.product_id}`) : 'Whole Cart'}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {c.expires_at ? new Date(c.expires_at).toLocaleDateString() : 'Never'}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {c.usage_count} / {c.usage_limit ? c.usage_limit : '∞'}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${c.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {c.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(c)} className="rounded bg-blue-50 px-2 py-1 text-xs text-blue-600 hover:bg-blue-100">Edit</button>
                    <button onClick={() => handleDelete(c.id, c.code)} className="rounded bg-red-50 px-2 py-1 text-xs text-red-600 hover:bg-red-100">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl dark:bg-gray-dark">
            <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-dark-3">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{editId ? "Edit Coupon" : "New Coupon"}</h2>
              <button onClick={() => setShowModal(false)} className="text-xl leading-none text-gray-400 hover:text-gray-600">×</button>
            </div>
            <div className="space-y-4 px-6 py-4 max-h-[70vh] overflow-y-auto">
              {formError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{formError}</p>}
              
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-400">Coupon Code *</label>
                <input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} className={inputCls} placeholder="e.g. SUMMER10" />
              </div>
              
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-400">Discount Percentage *</label>
                <input type="number" step="0.1" min="0" max="100" value={form.discount_percentage} onChange={(e) => setForm((f) => ({ ...f, discount_percentage: parseFloat(e.target.value) || 0 }))} className={inputCls} placeholder="10" />
              </div>
              
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-400">Applies To Product (Optional)</label>
                <select value={form.product_id ?? ""} onChange={(e) => setForm((f) => ({ ...f, product_id: e.target.value ? parseInt(e.target.value) : null }))} className={inputCls}>
                  <option value="">— Whole Cart —</option>
                  {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <p className="mt-1 text-xs text-gray-500">Leave blank to apply discount to the entire cart.</p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-400">Expiration Date (Optional)</label>
                <input type="date" value={form.expires_at ?? ""} onChange={(e) => setForm((f) => ({ ...f, expires_at: e.target.value || null }))} className={inputCls} />
              </div>
              
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-400">Usage Limit (Optional)</label>
                <input type="number" min="1" value={form.usage_limit ?? ""} onChange={(e) => setForm((f) => ({ ...f, usage_limit: e.target.value ? parseInt(e.target.value) : null }))} className={inputCls} placeholder="e.g. 100" />
              </div>

              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mt-2">
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
