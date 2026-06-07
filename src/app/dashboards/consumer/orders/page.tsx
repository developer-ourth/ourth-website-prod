"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { useAuth } from "@/contexts/auth-context";
import { getConsumerDashboard } from "@/lib/api";
import { useEffect, useState } from "react";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  dispatched: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function ConsumerOrdersPage() {
  const { user } = useAuth();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getConsumerDashboard(user.id)
      .then((res) => setData(res))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [user]);

  const orders = (data?.recent_orders ?? []) as Record<string, unknown>[];

  return (
    <DashboardGuard requiredRole="consumer">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">📋 Order History</h1>
          <p className="text-sm text-dark-4 dark:text-dark-6">Your recent orders from eco-friendly vendors</p>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-[10px] bg-white p-12 text-center shadow-1 dark:bg-gray-dark">
            <p className="text-4xl">🛍️</p>
            <p className="mt-3 font-medium text-dark dark:text-white">No orders yet</p>
            <p className="mt-1 text-sm text-dark-4">Browse nearby vendors to place your first eco-friendly order</p>
          </div>
        ) : (
          <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stroke dark:border-dark-3">
                    <th className="pb-3 text-left text-sm font-medium text-dark-4">Order #</th>
                    <th className="pb-3 text-right text-sm font-medium text-dark-4">Amount</th>
                    <th className="pb-3 text-center text-sm font-medium text-dark-4">Status</th>
                    <th className="pb-3 text-right text-sm font-medium text-dark-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, i) => (
                    <tr key={i} className="border-b border-stroke/50 dark:border-dark-3/50">
                      <td className="py-3 text-sm font-medium text-dark dark:text-white">{String(o.order_number ?? "—")}</td>
                      <td className="py-3 text-right text-sm text-dark-4">₹{Number(o.total_amount ?? 0).toLocaleString("en-IN")}</td>
                      <td className="py-3 text-center">
                        <span className={`rounded px-2 py-0.5 text-xs font-semibold uppercase ${STATUS_STYLES[String(o.order_status ?? "")] ?? "bg-gray-100 text-gray-600"}`}>
                          {String(o.order_status ?? "—")}
                        </span>
                      </td>
                      <td className="py-3 text-right text-sm text-dark-4">
                        {o.created_at ? new Date(String(o.created_at)).toLocaleDateString("en-IN") : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardGuard>
  );
}
