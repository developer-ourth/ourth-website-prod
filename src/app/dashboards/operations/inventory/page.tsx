"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { useOperationsLiveRefresh } from "@/hooks/use-operations-live-refresh";
import { getOperationsInventory } from "@/lib/api";
import { useEffect, useState } from "react";

export default function OperationsInventoryPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const loadInventory = async () => {
    try {
      const response = await getOperationsInventory(page);
      setData(response);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadInventory();
  }, [page]);

  useOperationsLiveRefresh(loadInventory);

  const inventoryItems = (data?.data ?? []) as Record<string, unknown>[];
  const currentPage = Number(data?.current_page ?? 1);
  const lastPage = Number(data?.last_page ?? 1);
  const totalItems = Number(data?.total ?? inventoryItems.length);
  const lowStockItems = inventoryItems.filter((item) => Number(item.current_stock ?? 0) <= Number(item.minimum_stock_level ?? 0)).length;

  return (
    <DashboardGuard requiredRole="operations">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark dark:text-white">🏭 Warehouse Inventory</h1>
            <p className="text-sm text-dark-4 dark:text-dark-6">Live paginated stock levels from the inventory ledger</p>
          </div>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
            Page {currentPage} of {lastPage}
          </span>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[10px] bg-white p-5 shadow-1 dark:bg-gray-dark">
                <p className="text-sm text-dark-4">Tracked Inventory Rows</p>
                <p className="mt-1 text-2xl font-bold text-dark dark:text-white">{totalItems.toLocaleString("en-IN")}</p>
              </div>
              <div className="rounded-[10px] bg-white p-5 shadow-1 dark:bg-gray-dark">
                <p className="text-sm text-dark-4">Low Stock On This Page</p>
                <p className="mt-1 text-2xl font-bold text-red-600">{lowStockItems.toLocaleString("en-IN")}</p>
              </div>
              <div className="rounded-[10px] bg-white p-5 shadow-1 dark:bg-gray-dark">
                <p className="text-sm text-dark-4">Rows Per Page</p>
                <p className="mt-1 text-2xl font-bold text-dark dark:text-white">{Number(data?.per_page ?? inventoryItems.length).toLocaleString("en-IN")}</p>
              </div>
            </div>

            {inventoryItems.length > 0 && (
              <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Stock Rows</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-stroke dark:border-dark-3">
                        <th className="pb-3 text-left text-sm font-medium text-dark-4">Product</th>
                        <th className="pb-3 text-left text-sm font-medium text-dark-4">SKU</th>
                        <th className="pb-3 text-left text-sm font-medium text-dark-4">Vendor</th>
                        <th className="pb-3 text-left text-sm font-medium text-dark-4">Category</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Current</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Reserved</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Available</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Min</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventoryItems.map((item) => {
                        const product = (item.product ?? {}) as Record<string, unknown>;
                        const vendor = (item.vendor ?? {}) as Record<string, unknown>;
                        const currentStock = Number(item.current_stock ?? 0);
                        const reservedStock = Number(item.reserved_stock ?? 0);
                        const minimumStock = Number(item.minimum_stock_level ?? 0);
                        const availableStock = currentStock - reservedStock;
                        const lowStock = currentStock <= minimumStock;

                        return (
                          <tr key={String(item.id ?? `${product.name ?? "product"}-${vendor.business_name ?? "vendor"}`)} className="border-b border-stroke/50 dark:border-dark-3/50">
                            <td className="py-3 text-sm font-medium text-dark dark:text-white">{String(product.name ?? "—")}</td>
                            <td className="py-3 text-sm font-mono text-dark-4">{String(product.sku ?? "—")}</td>
                            <td className="py-3 text-sm text-dark-4">{String(vendor.business_name ?? "—")}</td>
                            <td className="py-3 text-sm text-dark-4">{String(product.category ?? "—")}</td>
                            <td className="py-3 text-right text-sm text-dark dark:text-white">{currentStock.toLocaleString("en-IN")}</td>
                            <td className="py-3 text-right text-sm text-dark-4">{reservedStock.toLocaleString("en-IN")}</td>
                            <td className="py-3 text-right text-sm text-dark-4">{availableStock.toLocaleString("en-IN")}</td>
                            <td className="py-3 text-right text-sm text-dark-4">{minimumStock.toLocaleString("en-IN")}</td>
                            <td className="py-3 text-right text-sm">
                              <span className={`rounded px-2 py-0.5 text-xs font-semibold uppercase ${lowStock ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                                {lowStock ? "low" : "healthy"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <p className="text-sm text-dark-4">
                    Showing page {currentPage} of {lastPage}
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage <= 1}
                      className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-dark disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-3 dark:text-white"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={() => setPage((prev) => Math.min(lastPage, prev + 1))}
                      disabled={currentPage >= lastPage}
                      className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-dark disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-3 dark:text-white"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            {inventoryItems.length === 0 && (
              <div className="rounded-[10px] bg-white p-12 text-center shadow-1 dark:bg-gray-dark">
                <p className="text-dark-4">No inventory rows available</p>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardGuard>
  );
}
