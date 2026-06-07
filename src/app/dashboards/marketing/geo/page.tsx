"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { getMarketingDashboard } from "@/lib/api";
import { useEffect, useState } from "react";

export default function MarketingGeoPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMarketingDashboard()
      .then((res) => setData(res))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const growthByCity = (((data?.vendor_acquisition as Record<string, unknown>)?.by_city) ?? []) as Record<string, unknown>[];
  const fmtN = (n: unknown) => (n != null ? Number(n).toLocaleString("en-IN") : "—");

  const maxVendors = growthByCity.reduce((m, c) => Math.max(m, Number(c.new_vendors ?? 0)), 1);

  return (
    <DashboardGuard requiredRole="marketing">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">🗺️ Geo Performance</h1>
          <p className="text-sm text-dark-4 dark:text-dark-6">Vendor growth and distribution by city</p>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : growthByCity.length === 0 ? (
          <div className="rounded-[10px] bg-white p-12 text-center shadow-1 dark:bg-gray-dark">
            <p className="text-dark-4">No city data available</p>
          </div>
        ) : (
          <>
            {/* Bar chart */}
            <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
              <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Vendors by City</h2>
              <div className="space-y-3">
                {growthByCity.map((c, i) => {
                  const count = Number(c.new_vendors ?? 0);
                  const pct = Math.round((count / maxVendors) * 100);
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-28 text-sm text-dark dark:text-white truncate">{String(c.city ?? "—")}</span>
                      <div className="flex-1 overflow-hidden rounded-full bg-gray-2 dark:bg-dark-3">
                        <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-20 text-right text-sm font-medium text-dark dark:text-white">{fmtN(c.new_vendors)} vendors</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Table */}
            <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
              <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">City Details</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stroke dark:border-dark-3">
                      <th className="pb-3 text-left text-sm font-medium text-dark-4">City</th>
                      <th className="pb-3 text-right text-sm font-medium text-dark-4">New Vendors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {growthByCity.map((c, i) => (
                      <tr key={i} className="border-b border-stroke/50 dark:border-dark-3/50">
                        <td className="py-3 text-sm font-medium text-dark dark:text-white">{String(c.city ?? "—")}</td>
                        <td className="py-3 text-right text-sm text-dark-4">{fmtN(c.new_vendors)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardGuard>
  );
}
