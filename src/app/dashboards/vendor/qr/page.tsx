"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { useAuth } from "@/contexts/auth-context";
import { getVendorDashboard } from "@/lib/api";
import { useEffect, useState } from "react";

export default function VendorQRPage() {
  const { user } = useAuth();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getVendorDashboard(user.vendor_id ?? 0)
      .then((res) => setData(res))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [user]);

  const vendor = (data?.vendor ?? {}) as Record<string, unknown>;
  const vendorId = user?.vendor_id ?? 0;

  // Build a simple QR code URL using Google Charts API (no external dep needed)
  const qrData = `OURTH-VENDOR:${vendorId}|${String(vendor.business_name ?? "")}`;
  const qrUrl = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${encodeURIComponent(qrData)}&choe=UTF-8`;

  return (
    <DashboardGuard requiredRole="vendor">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">📱 QR Code</h1>
          <p className="text-sm text-dark-4 dark:text-dark-6">Share your vendor QR code with customers</p>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 rounded-[10px] bg-white p-10 shadow-1 dark:bg-gray-dark sm:flex-row sm:items-start">
            <div className="shrink-0 overflow-hidden rounded-xl border-4 border-primary p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrUrl} alt="Vendor QR Code" width={250} height={250} />
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-dark-4">Business Name</p>
                <p className="mt-1 text-xl font-bold text-dark dark:text-white">{String(vendor.business_name ?? "—")}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-dark-4">City</p>
                <p className="mt-1 text-sm text-dark dark:text-white">{String(vendor.city ?? "—")}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-dark-4">Vendor ID</p>
                <p className="mt-1 font-mono text-sm text-dark dark:text-white">{vendorId}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-dark-4">KYC Status</p>
                <span className={`mt-1 inline-block rounded px-2 py-0.5 text-xs font-bold uppercase ${vendor.kyc_status === "verified" || vendor.kyc_status === "approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {String(vendor.kyc_status ?? "pending")}
                </span>
              </div>
              <p className="text-xs text-dark-4">
                Customers can scan this QR code to view your store and place orders on the OURTH app.
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardGuard>
  );
}
