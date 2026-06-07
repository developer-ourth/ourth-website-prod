"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { getFounderProducts, getCategories, type MarketProduct, type MarketCategory } from "@/lib/api";
import { useCallback, useEffect, useState } from "react";

export default function FounderProductsPage() {
  return (
    <DashboardGuard requiredRole="founder">
      <ProductsContent />
    </DashboardGuard>
  );
}

function ProductsContent() {
  const [products, setProducts]     = useState<MarketProduct[]>([]);
  const [categories, setCategories] = useState<MarketCategory[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [catFilter, setCatFilter]   = useState("");
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]           = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Parameters<typeof getFounderProducts>[0] = { page, per_page: 15 };
      if (catFilter) params.category_id = parseInt(catFilter);
      if (search)    params.search = search;
      const res = await getFounderProducts(params);
      setProducts(res.data ?? []);
      setTotalPages(res.meta?.last_page ?? 1);
      setTotal(res.meta?.total ?? 0);
    } catch {
      setProducts([]);
      setTotalPages(1);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, catFilter, search]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    getCategories().then((r) => setCategories(r.data ?? [])).catch(() => {});
  }, []);

  const activeCount   = products.filter((p) => p.is_active).length;
  const featuredCount = products.filter((p) => p.is_featured).length;
  const lowStock      = products.filter((p) => p.stock_quantity < 5).length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
        <p className="mt-0.5 text-sm text-gray-500">Marketplace catalogue overview</p>
      </div>

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Products", value: total, color: "text-primary" },
          { label: "Active", value: activeCount, color: "text-green-600" },
          { label: "Featured", value: featuredCount, color: "text-yellow-600" },
          { label: "Low Stock (<5)", value: lowStock, color: "text-red-500" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-stroke bg-white p-4 shadow-sm dark:border-dark-3 dark:bg-gray-dark">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
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

      <div className="overflow-hidden rounded-xl border border-stroke bg-white shadow-sm dark:border-dark-3 dark:bg-gray-dark">
        <table className="min-w-full text-sm">
          <thead className="border-b border-stroke bg-gray-50 dark:border-dark-3 dark:bg-dark-2">
            <tr>
              {["Product", "Category", "Price", "Stock", "Unit", "Status"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stroke dark:divide-dark-3">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">Loading…</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">No products found.</td></tr>
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
                <td className={`px-4 py-3 font-medium ${p.stock_quantity < 5 ? "text-red-500" : "text-gray-700 dark:text-gray-300"}`}>
                  {p.stock_quantity}
                </td>
                <td className="px-4 py-3 capitalize text-gray-600 dark:text-gray-400">{p.unit}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${p.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {p.is_active ? "Active" : "Inactive"}
                  </span>
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
    </div>
  );
}
