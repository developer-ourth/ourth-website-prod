"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { getCategories, type MarketCategory } from "@/lib/api";
import { Fragment, useCallback, useEffect, useState } from "react";

export default function FounderCategoriesPage() {
  return (
    <DashboardGuard requiredRole="founder">
      <CategoriesContent />
    </DashboardGuard>
  );
}

function CategoriesContent() {
  const [categories, setCategories] = useState<MarketCategory[]>([]);
  const [loading, setLoading]       = useState(true);

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

  const totalProducts = categories.reduce((sum, c) => sum + (c.products_count ?? 0), 0);
  const activeCount   = categories.filter((c) => c.is_active).length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
        <p className="mt-0.5 text-sm text-gray-500">Marketplace category structure</p>
      </div>

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Categories", value: categories.length, color: "text-primary" },
          { label: "Active", value: activeCount, color: "text-green-600" },
          { label: "Total Products", value: totalProducts, color: "text-blue-600" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-stroke bg-white p-4 shadow-sm dark:border-dark-3 dark:bg-gray-dark">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-stroke bg-white shadow-sm dark:border-dark-3 dark:bg-gray-dark">
        <table className="min-w-full text-sm">
          <thead className="border-b border-stroke bg-gray-50 dark:border-dark-3 dark:bg-dark-2">
            <tr>
              {["Category", "Slug", "Products", "Order", "Status"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stroke dark:divide-dark-3">
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-400">Loading…</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-400">No categories found.</td></tr>
            ) : categories.map((c) => (
              <Fragment key={c.id}>
                <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-dark-2">
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
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
