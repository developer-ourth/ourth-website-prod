"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { useAuth } from "@/contexts/auth-context";
import { getVendorCatalog } from "@/lib/api";
import { useEffect, useState } from "react";

export default function VendorCatalogPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getVendorCatalog(user.vendor_id ?? 0)
      .then((res) => setProducts((res.products ?? []) as Record<string, unknown>[]))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [user]);

  const reorderAlerts = products.filter((p) => Boolean(p.is_low_stock));
  const lowStockCount = reorderAlerts.length;

  return (
    <DashboardGuard requiredRole="vendor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark dark:text-white">🗂️ Catalog & Inventory</h1>
            <p className="text-sm text-dark-4 dark:text-dark-6">Stock levels and reorder alerts for your products</p>
          </div>
          {lowStockCount > 0 && (
            <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
              {lowStockCount} Low Stock
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : reorderAlerts.length === 0 ? (
          <div className="rounded-[10px] bg-white p-12 text-center shadow-1 dark:bg-gray-dark">
            <p className="text-4xl">✅</p>
            <p className="mt-3 font-medium text-dark dark:text-white">All stock levels healthy</p>
            <p className="mt-1 text-sm text-dark-4">No reorder alerts at this time</p>
          </div>
        ) : (
          <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
            <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">⚠️ Reorder Alerts</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stroke dark:border-dark-3">
                    <th className="pb-3 text-left text-sm font-medium text-dark-4">Product</th>
                    <th className="pb-3 text-left text-sm font-medium text-dark-4">SKU</th>
                    <th className="pb-3 text-right text-sm font-medium text-dark-4">Current Stock</th>
                    <th className="pb-3 text-right text-sm font-medium text-dark-4">Available Stock</th>
                    <th className="pb-3 text-center text-sm font-medium text-dark-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reorderAlerts.map((p, i) => {
                    const stock = Number(p.current_stock ?? 0);
                    const available = Number(p.available_stock ?? 0);
                    const isCritical = stock === 0;
                    return (
                      <tr key={i} className="border-b border-stroke/50 dark:border-dark-3/50">
                        <td className="py-3 text-sm font-medium text-dark dark:text-white">{String(p.name ?? "—")}</td>
                        <td className="py-3 text-sm text-dark-4">{String(p.sku ?? "—")}</td>
                        <td className="py-3 text-right text-sm font-bold text-red-600">{stock}</td>
                        <td className="py-3 text-right text-sm text-dark-4">{available}</td>
                        <td className="py-3 text-center">
                          <span className={`rounded px-2 py-0.5 text-xs font-semibold ${isCritical ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                            {isCritical ? "OUT OF STOCK" : "LOW STOCK"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardGuard>
  );
}
