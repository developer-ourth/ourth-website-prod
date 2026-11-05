"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { StatCard } from "@/components/ui/stat-card";
import { getZohoStatusApi, retryZohoOrderApi, syncZohoStockApi } from "@/lib/api";
import { useEffect, useState } from "react";

type Unmatched = { type: "product" | "pack"; id: number; name: string; sku: string | null };
type AttentionOrder = {
  id: number;
  order_number: string;
  total_amount: string;
  created_at: string;
  zoho_salesorder_id: string | null;
  zoho_synced_at: string | null;
  zoho_sync_error: string | null;
};

export default function ZohoInventoryPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [retryingId, setRetryingId] = useState<number | null>(null);

  const load = async () => {
    try {
      const res = await getZohoStatusApi();
      setData(res.data);
    } catch (e: any) {
      setMessage({ ok: false, text: e?.message || "Could not load Zoho status." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    setMessage(null);
    try {
      const res = await syncZohoStockApi();
      setMessage({ ok: true, text: res.message });
      setTimeout(load, 15000);
    } catch (e: any) {
      setMessage({ ok: false, text: e?.message || "Could not start stock sync." });
    } finally {
      setSyncing(false);
    }
  };

  const handleRetry = async (order: AttentionOrder) => {
    setRetryingId(order.id);
    setMessage(null);
    try {
      const res = await retryZohoOrderApi(order.id);
      setMessage({ ok: true, text: res.message });
      setTimeout(load, 10000);
    } catch (e: any) {
      setMessage({ ok: false, text: e?.message || "Could not retry the order." });
    } finally {
      setRetryingId(null);
    }
  };

  const stock = data?.stock_sync;
  const unmatched: Unmatched[] = stock?.unmatched ?? [];
  const attention: AttentionOrder[] = data?.orders_needing_attention ?? [];
  const fmtDate = (iso?: string | null) => (iso ? new Date(iso).toLocaleString("en-IN") : "—");

  return (
    <DashboardGuard requiredRole={["admin", "operations", "finance"]}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-dark dark:text-white">📦 Zoho Inventory</h1>
            <p className="text-sm text-dark-4 dark:text-dark-6">
              Stock comes from Zoho every {data?.stock_sync_minutes ?? 10} minutes. Paid orders go to Zoho as sales order, invoice and payment.
            </p>
          </div>
          <button
            onClick={handleSync}
            disabled={syncing || !data?.configured}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50"
          >
            {syncing ? "Starting…" : "🔄 Sync stock now"}
          </button>
        </div>

        {message && (
          <div className={`rounded-lg p-3 text-sm font-medium ${message.ok ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : !data?.configured ? (
          <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
            <h2 className="mb-2 text-lg font-bold text-dark dark:text-white">Zoho is not connected yet</h2>
            <p className="text-sm text-dark-4 dark:text-dark-6">
              Add ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN and ZOHO_ORGANIZATION_ID to the backend environment, then deploy.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 2xl:gap-7.5">
              <StatCard label="Last Stock Sync" value={stock?.ran_at ? new Date(stock.ran_at).toLocaleTimeString("en-IN") : "Never"} icon="🔄" iconBg="bg-blue-100" />
              <StatCard label="Products & Packs Synced" value={(stock?.products_synced ?? 0) + (stock?.packs_synced ?? 0)} icon="✅" iconBg="bg-green-100" />
              <StatCard label="SKUs Missing in Zoho" value={stock?.unmatched_count ?? 0} icon="⚠️" iconBg="bg-orange-100" />
              <StatCard label="Orders Sent to Zoho" value={data.orders_synced ?? 0} icon="🧾" iconBg="bg-purple-100" />
            </div>

            {stock?.error && (
              <div className="rounded-lg bg-red-100 p-3 text-sm text-red-800">
                <strong>Last stock sync failed</strong> ({fmtDate(stock.failed_at)}): {stock.error}
              </div>
            )}

            {stock && !stock.stock_field && (
              <div className="rounded-lg bg-orange-100 p-3 text-sm text-orange-800">
                Zoho items didn&apos;t include a stock field, so website stock was not changed. Set ZOHO_STOCK_FIELD in the backend (run <code>php artisan zoho check</code> to see the available fields).
              </div>
            )}

            <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
              <h2 className="mb-1 text-lg font-bold text-dark dark:text-white">⚠️ Orders needing attention</h2>
              <p className="mb-4 text-xs text-dark-4 dark:text-dark-6">
                Paid orders that haven&apos;t reached Zoho, or reached it with a warning. Fix the cause (usually a SKU missing in Zoho), then press Retry.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stroke dark:border-dark-3">
                      <th className="pb-3 text-left text-sm font-medium text-dark-4">Order</th>
                      <th className="pb-3 text-left text-sm font-medium text-dark-4">Placed</th>
                      <th className="pb-3 text-right text-sm font-medium text-dark-4">Amount</th>
                      <th className="pb-3 text-left text-sm font-medium text-dark-4 pl-4">Problem</th>
                      <th className="pb-3 text-right text-sm font-medium text-dark-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attention.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-4 text-center text-sm text-dark-4">
                          All paid orders are in Zoho. ✅
                        </td>
                      </tr>
                    ) : (
                      attention.map((order) => {
                        const warningOnly = order.zoho_synced_at && order.zoho_sync_error?.startsWith("WARNING:");
                        return (
                          <tr key={order.id} className="border-b border-stroke/50 align-top dark:border-dark-3/50">
                            <td className="py-3 text-sm font-semibold text-dark dark:text-white">{order.order_number}</td>
                            <td className="py-3 text-sm text-dark-4">{fmtDate(order.created_at)}</td>
                            <td className="py-3 text-right text-sm text-dark-4">₹{Number(order.total_amount).toLocaleString("en-IN")}</td>
                            <td className={`py-3 pl-4 text-xs ${warningOnly ? "text-orange-700" : "text-red-700"}`}>
                              {order.zoho_sync_error || "Not sent yet (queue may be behind)"}
                            </td>
                            <td className="py-3 text-right">
                              {!warningOnly && (
                                <button
                                  onClick={() => handleRetry(order)}
                                  disabled={retryingId === order.id}
                                  className="rounded-lg border border-primary px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/10 disabled:opacity-50"
                                >
                                  {retryingId === order.id ? "Queuing…" : "Retry"}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
              <h2 className="mb-1 text-lg font-bold text-dark dark:text-white">🔍 Website SKUs not found in Zoho</h2>
              <p className="mb-4 text-xs text-dark-4 dark:text-dark-6">
                These active products/packs have no Zoho item with the same SKU, so their stock isn&apos;t synced and orders containing them can&apos;t be sent to Zoho.
                Add the item in Zoho (or correct the SKU on either side), then sync stock.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stroke dark:border-dark-3">
                      <th className="pb-3 text-left text-sm font-medium text-dark-4">Type</th>
                      <th className="pb-3 text-left text-sm font-medium text-dark-4">Name</th>
                      <th className="pb-3 text-left text-sm font-medium text-dark-4">Website SKU</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unmatched.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-4 text-center text-sm text-dark-4">
                          {stock ? "Every active product and pack matches a Zoho item. ✅" : "Run a stock sync to check."}
                        </td>
                      </tr>
                    ) : (
                      unmatched.map((u) => (
                        <tr key={`${u.type}-${u.id}`} className="border-b border-stroke/50 dark:border-dark-3/50">
                          <td className="py-3 text-sm capitalize text-dark-4">{u.type}</td>
                          <td className="py-3 text-sm text-dark dark:text-white">{u.name}</td>
                          <td className="py-3 font-mono text-sm text-dark-4">{u.sku || "(empty)"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {stock?.unmatched_count > unmatched.length && (
                <p className="mt-3 text-xs text-dark-4">Showing the first {unmatched.length} of {stock.unmatched_count}.</p>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardGuard>
  );
}
