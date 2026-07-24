"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { StatCard } from "@/components/ui/stat-card";
import { useAuth } from "@/contexts/auth-context";
import { getVendorDashboard } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VendorDashboard() {
  const { logout, user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    router.replace("/client/dashboard");
  }, [router]);

  useEffect(() => {
    if (!user) return;
    const vendorId = user.vendor_id ?? 0;
    getVendorDashboard(vendorId)
      .then((res) => setData(res))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const vendor = (data?.vendor ?? {}) as Record<string, unknown>;
  const today = (data?.today ?? {}) as Record<string, unknown>;
  const orders = (data?.recent_orders ?? []) as Record<string, unknown>[];
  const reorderAlerts = (data?.reorder_alerts ?? []) as Record<string, unknown>[];
  const fmt = (n: unknown) => n != null ? Number(n).toLocaleString("en-IN") : "—";

  return (
    <DashboardGuard requiredRole="vendor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark dark:text-white">
              🛒 Vendor Dashboard
            </h1>
            <p className="text-sm text-dark-4 dark:text-dark-6">
              {String(vendor.business_name ?? user?.name ?? "")} — {new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}
            </p>
          </div>
          <button onClick={handleLogout} className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-gray-dark">
            Sign Out
          </button>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 2xl:gap-7.5">
              <StatCard label="Orders Today" value={fmt(today.orders)} trend="up" icon="📦" iconBg="bg-blue-100" />
              <StatCard label="Revenue Today" value={`₹${fmt(today.revenue)}`} trend="up" icon="💰" iconBg="bg-green-100" />
              <StatCard label="Pending Orders" value={fmt(data?.pending_orders)} icon="⏳" iconBg="bg-yellow-100" />
              <StatCard label="Low Stock Items" value={fmt(data?.low_stock_count)} icon="📋" iconBg="bg-red-100" />
            </div>

            {orders.length > 0 && (
              <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Recent Orders</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-stroke dark:border-dark-3">
                        <th className="pb-3 text-left text-sm font-medium text-dark-4">Order</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Amount</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o, i) => (
                        <tr key={i} className="border-b border-stroke/50 dark:border-dark-3/50">
                          <td className="py-3 text-sm text-dark dark:text-white">{String(o.order_number ?? "")}</td>
                          <td className="py-3 text-right text-sm text-dark-4">₹{String(o.total_amount ?? "")}</td>
                          <td className="py-3 text-right text-sm font-medium text-green">{String(o.order_status ?? "")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {reorderAlerts.length > 0 && (
              <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">⚠️ Reorder Alerts</h2>
                <div className="space-y-2">
                  {reorderAlerts.map((p, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-yellow/10 px-4 py-2">
                      <span className="text-sm font-medium text-dark dark:text-white">{String(p.product_name ?? "")}</span>
                      <span className="text-xs text-dark-4">Stock: {String(p.current_stock ?? "")} / SKU: {String(p.sku ?? "")}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardGuard>
  );
}
