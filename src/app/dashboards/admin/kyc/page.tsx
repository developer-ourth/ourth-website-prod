"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import {
  approveKyc,
  getKycDetail,
  getKycList,
  KycVendor,
  rejectKyc,
} from "@/lib/api";
import { useEffect, useRef, useState } from "react";

const STATUS_BADGE: Record<string, string> = {
  pending:      "bg-yellow-100 text-yellow-700",
  under_review: "bg-blue-100   text-blue-700",
  verified:     "bg-green-100  text-green-700",
  rejected:     "bg-red-100    text-red-700",
};

const TABS = ["all", "pending", "under_review", "verified", "rejected"] as const;
type Tab = (typeof TABS)[number];

export default function AdminKycPage() {
  const [vendors, setVendors]       = useState<KycVendor[]>([]);
  const [loading, setLoading]       = useState(true);
  const [tab, setTab]               = useState<Tab>("all");
  const [selected, setSelected]     = useState<KycVendor | null>(null);
  const [modalMode, setModalMode]   = useState<"details" | "review" | "reject" | null>(null);
  const [notes, setNotes]           = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function load() {
    try {
      const res = await getKycList(tab === "all" ? undefined : tab);
      setVendors(res.data);
    } catch {
      setError("Failed to load KYC queue");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    load();
    // Auto-refresh every 10 s so new registrations appear live
    pollRef.current = setInterval(load, 10_000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  /** Opens read-only details panel (no approve action) */
  async function handleDetails(vendor: KycVendor) {
    try {
      const res = await getKycDetail(vendor.id);
      setSelected(res.data);
    } catch {
      setSelected(vendor);
    }
    setModalMode("details");
    setNotes("");
    setError("");
  }

  /** Opens vendor detail — also marks application as under_review on the backend */
  async function handleReview(vendor: KycVendor) {
    try {
      const res = await getKycDetail(vendor.id);
      setSelected(res.data);
    } catch {
      setSelected(vendor);
    }
    setModalMode("review");
    setNotes("");
    setError("");
  }

  async function handleApprove() {
    if (!selected) return;
    setSubmitting(true);
    try {
      await approveKyc(selected.id, notes);
      setModalMode(null);
      setSelected(null);
      await load();
    } catch (e: unknown) {
      setError((e as { message?: string })?.message ?? "Approval failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRejectSubmit() {
    if (!selected || !notes.trim()) return;
    setSubmitting(true);
    try {
      await rejectKyc(selected.id, notes);
      setModalMode(null);
      setSelected(null);
      await load();
    } catch (e: unknown) {
      setError((e as { message?: string })?.message ?? "Rejection failed");
    } finally {
      setSubmitting(false);
    }
  }

  const pendingCount = vendors.filter(
    (v) => v.kyc_status === "pending" || v.kyc_status === "under_review",
  ).length;

  return (
    <DashboardGuard requiredRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark dark:text-white">KYC Approvals</h1>
            <p className="text-sm text-dark-4 dark:text-dark-6">Vendor application review queue</p>
          </div>
          {pendingCount > 0 && (
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
              {pendingCount} Awaiting Review
            </span>
          )}
        </div>

        {error && !modalMode && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-1 border-b border-stroke dark:border-dark-3">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                tab === t
                  ? "border-b-2 border-primary text-primary"
                  : "text-dark-4 hover:text-dark dark:hover:text-white"
              }`}
            >
              {t === "under_review" ? "Under Review" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stroke bg-gray-50 dark:border-dark-3 dark:bg-gray-dark">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-dark-4">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-dark-4">Business</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-dark-4">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-dark-4">Location</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold uppercase text-dark-4">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-dark-4">Applied</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-dark-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stroke dark:divide-dark-3">
                {vendors.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-sm text-dark-4">
                      No applications found
                    </td>
                  </tr>
                ) : (
                  vendors.map((v) => (
                    <tr key={v.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-white/5">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-bold text-primary">#{v.vendor_code ?? v.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-dark dark:text-white">{v.business_name}</p>
                        {v.gstin && <p className="font-mono text-xs text-dark-4">{v.gstin}</p>}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-dark dark:text-white">{v.user?.name ?? "—"}</p>
                        <p className="text-xs text-dark-4">{v.user?.phone ?? v.user?.email ?? "—"}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-dark-4">
                        {[v.city, v.state].filter(Boolean).join(", ") || "—"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`rounded px-2 py-0.5 text-xs font-semibold capitalize ${STATUS_BADGE[v.kyc_status] ?? "bg-gray-100 text-gray-600"}`}>
                          {v.kyc_status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-dark-4">
                        {v.created_at ? new Date(v.created_at).toLocaleDateString("en-IN") : "—"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => handleDetails(v)}
                            className="rounded bg-dark-4 px-3 py-1 text-xs font-semibold text-white hover:bg-dark-3"
                          >
                            Details
                          </button>
                          {(v.kyc_status === "pending" || v.kyc_status === "under_review") && (
                            <>
                              <button
                                onClick={() => handleReview(v)}
                                className="rounded bg-primary px-3 py-1 text-xs font-semibold text-white hover:bg-primary/90"
                              >
                                Review
                              </button>
                              <button
                                onClick={() => { setSelected(v); setModalMode("reject"); setNotes(""); setError(""); }}
                                className="rounded bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review / Approve modal */}
      {(modalMode === "review" || modalMode === "details") && selected && (
        <Modal title={`${modalMode === "details" ? "Details" : "Review"}: ${selected.business_name}`} onClose={() => setModalMode(null)}>
          <div className="space-y-2 text-sm">
            <Row label="Vendor ID" value={<span className="font-mono font-bold text-primary">{selected.vendor_code ?? selected.id}</span>} />
            <Row label="Owner"    value={selected.user?.name ?? "—"} />
            <Row label="Email"    value={selected.user?.email ?? "—"} />
            <Row label="Phone"    value={selected.user?.phone ?? "—"} />
            <Row label="GST"      value={selected.gstin ?? "—"} />
            <Row label="Location" value={[selected.city, selected.state].filter(Boolean).join(", ") || "—"} />
            <Row label="Stage"    value={
              <span className={`rounded px-2 py-0.5 text-xs font-semibold capitalize ${STATUS_BADGE[selected.kyc_status] ?? "bg-gray-100 text-gray-600"}`}>
                {selected.kyc_status.replace("_", " ")}
              </span>
            } />
            {selected.kyc_documents && selected.kyc_documents.length > 0 && (
              <div className="pt-1">
                <p className="mb-1 text-xs font-semibold uppercase text-dark-4">Documents</p>
                <ul className="space-y-1">
                  {selected.kyc_documents.map((d) => (
                    <li key={d.id} className="flex items-center gap-2 text-xs">
                      <span className="capitalize">{d.document_type.replace("_", " ")}</span>
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${d.status === "verified" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {d.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          {modalMode === "review" && (
            <>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Approval notes (optional)"
                rows={3}
                className="mt-4 w-full rounded-lg border border-stroke px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-dark-3 dark:bg-gray-dark dark:text-white"
              />
              <div className="mt-4 flex gap-3">
                <button onClick={() => setModalMode(null)} className="flex-1 rounded-lg border border-stroke py-2 text-sm font-medium hover:bg-gray-50 dark:border-dark-3">
                  Cancel
                </button>
                <button onClick={handleApprove} disabled={submitting} className="flex-1 rounded-lg bg-green-600 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50">
                  {submitting ? "Approving…" : "Approve"}
                </button>
              </div>
            </>
          )}
          {modalMode === "details" && (
            <div className="mt-4">
              <button onClick={() => setModalMode(null)} className="w-full rounded-lg border border-stroke py-2 text-sm font-medium hover:bg-gray-50 dark:border-dark-3">
                Close
              </button>
            </div>
          )}
        </Modal>
      )}

      {/* Reject modal */}
      {modalMode === "reject" && selected && (
        <Modal title={`Reject: ${selected.business_name}`} onClose={() => setModalMode(null)}>
          <p className="mb-3 text-sm text-dark-4">Provide a reason — the vendor will see this message.</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Rejection reason (required)"
            rows={4}
            className="w-full rounded-lg border border-stroke px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:border-dark-3 dark:bg-gray-dark dark:text-white"
          />
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          <div className="mt-4 flex gap-3">
            <button onClick={() => setModalMode(null)} className="flex-1 rounded-lg border border-stroke py-2 text-sm font-medium hover:bg-gray-50 dark:border-dark-3">
              Cancel
            </button>
            <button onClick={handleRejectSubmit} disabled={submitting || !notes.trim()} className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">
              {submitting ? "Rejecting…" : "Reject"}
            </button>
          </div>
        </Modal>
      )}
    </DashboardGuard>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl dark:bg-gray-dark">
        <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-dark-3">
          <h3 className="font-semibold text-dark dark:text-white">{title}</h3>
          <button onClick={onClose} className="text-lg leading-none text-dark-4 hover:text-dark dark:hover:text-white">✕</button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="w-20 shrink-0 text-xs font-semibold uppercase text-dark-4">{label}</span>
      <span className="text-sm text-dark dark:text-white">{value}</span>
    </div>
  );
}
