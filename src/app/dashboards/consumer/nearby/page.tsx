"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { useAuth } from "@/contexts/auth-context";
import { getConsumerNearbyVendors } from "@/lib/api";
import { useEffect, useState } from "react";

export default function ConsumerNearbyPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (!("geolocation" in navigator)) {
      setError("Geolocation is not available in this browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await getConsumerNearbyVendors(user.id, {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            radius_km: 10,
          });
          setVendors((response.vendors ?? []) as Record<string, unknown>[]);
          setError(null);
        } catch {
          setError("Unable to fetch nearby vendors right now.");
          setVendors([]);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Please allow location access to see nearby vendors.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    );
  }, [user]);

  const filtered = vendors.filter(
    (v) => !filter || String(v.business_name ?? "").toLowerCase().includes(filter.toLowerCase()) || String(v.business_category ?? "").toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <DashboardGuard requiredRole="consumer">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">📍 Nearby Vendors</h1>
          <p className="text-sm text-dark-4 dark:text-dark-6">Eco-friendly vendors near your location</p>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : error ? (
          <div className="rounded-[10px] bg-white p-12 text-center shadow-1 dark:bg-gray-dark">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        ) : (
          <>
            {/* Search */}
            <input
              type="text"
              placeholder="Search by name or category…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-white px-4 py-2.5 text-sm text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-gray-dark dark:text-white"
            />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((v, i) => (
                <div key={i} className="rounded-[10px] bg-white p-5 shadow-1 dark:bg-gray-dark">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-dark dark:text-white">{String(v.business_name ?? "—")}</h3>
                      <p className="text-xs text-dark-4">{String(v.business_category ?? "—")}</p>
                    </div>
                    <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-bold text-yellow-700">⭐ {Number(v.average_rating ?? 0).toFixed(1)}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-dark-4">📍 {Number(v.distance_km ?? 0).toFixed(1)} km</span>
                    <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">{String(v.city ?? "Unknown")}</span>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <p className="text-center text-sm text-dark-4">No vendors match your search.</p>
            )}
          </>
        )}
      </div>
    </DashboardGuard>
  );
}
