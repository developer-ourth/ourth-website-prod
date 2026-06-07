"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { useAuth } from "@/contexts/auth-context";
import { getConsumerDashboard } from "@/lib/api";
import { useEffect, useState } from "react";

export default function ConsumerSubscriptionsPage() {
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

  const subs = (data?.active_subscriptions ?? []) as Record<string, unknown>[];
  const fmt = (n: unknown) => (n != null ? Number(n).toLocaleString("en-IN") : "—");

  return (
    <DashboardGuard requiredRole="consumer">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark dark:text-white">🔄 Subscriptions</h1>
            <p className="text-sm text-dark-4 dark:text-dark-6">Your active recurring delivery plans</p>
          </div>
          {subs.length > 0 && (
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
              {subs.length} Active
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : subs.length === 0 ? (
          <div className="rounded-[10px] bg-white p-12 text-center shadow-1 dark:bg-gray-dark">
            <p className="text-4xl">🛒</p>
            <p className="mt-3 font-medium text-dark dark:text-white">No active subscriptions</p>
            <p className="mt-1 text-sm text-dark-4">Subscribe to a vendor plan for regular eco-friendly deliveries</p>
          </div>
        ) : (
          <div className="space-y-4">
            {subs.map((sub, i) => {
              const items = (sub.items ?? []) as Record<string, unknown>[];
              return (
                <div key={i} className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-dark dark:text-white">{String(sub.plan_name ?? "—")}</h3>
                      <p className="text-sm text-dark-4">{String(sub.vendor_name ?? "—")}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">₹{fmt(sub.plan_price)}</p>
                      <p className="text-xs text-dark-4 capitalize">{String(sub.frequency ?? "—")}</p>
                    </div>
                  </div>
                  {sub.next_delivery_date != null && (
                    <p className="mt-2 text-sm text-dark-4">
                      Next delivery: <span className="font-medium text-dark dark:text-white">{new Date(String(sub.next_delivery_date)).toLocaleDateString("en-IN")}</span>
                    </p>
                  )}
                  {items.length > 0 && (
                    <div className="mt-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-dark-4">Items</p>
                      <div className="space-y-1">
                        {items.map((item, j) => (
                          <div key={j} className="flex justify-between rounded bg-gray-1 px-3 py-1.5 dark:bg-dark-2">
                            <span className="text-sm text-dark dark:text-white">{String(item.product_name ?? "—")}</span>
                            <span className="text-sm text-dark-4">×{String(item.quantity ?? 1)} @ ₹{fmt(item.unit_price)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardGuard>
  );
}
