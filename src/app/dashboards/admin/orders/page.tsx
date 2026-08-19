"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import {
  AdminOrder,
  cancelAdminOrder,
  confirmOrder,
  deliverOrder,
  dispatchOrder,
  getAdminOrders,
  processOrder,
} from "@/lib/api";
import { useEffect, useRef, useState } from "react";

const STATUS_BADGE: Record<string, string> = {
  pending:          "bg-yellow-100 text-yellow-700",
  confirmed:        "bg-blue-100   text-blue-700",
  processing:       "bg-orange-100 text-orange-700",
  out_for_delivery: "bg-purple-100 text-purple-700",
  delivered:        "bg-green-100  text-green-700",
  cancelled:        "bg-red-100    text-red-700",
};

const PAYMENT_BADGE: Record<string, string> = {
  pending: "bg-gray-100 text-gray-600",
  paid:    "bg-green-100 text-green-700",
  failed:  "bg-red-100 text-red-700",
};

const TABS = ["all", "pending", "confirmed", "processing", "out_for_delivery", "delivered", "cancelled"] as const;
type Tab = (typeof TABS)[number];

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-dark">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-dark dark:text-white">{title}</h3>
          <button onClick={onClose} className="text-dark-4 hover:text-dark dark:hover:text-white">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders]         = useState<AdminOrder[]>([]);
  const [loading, setLoading]       = useState(true);
  const [tab, setTab]               = useState<Tab>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "b2c" | "b2b">("all");
  const [platformFilter, setPlatformFilter] = useState<"all" | "app" | "website">("all");
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]           = useState(0);
  const [error, setError]           = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [cancelModal, setCancelModal] = useState<AdminOrder | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function load(p = page) {
    try {
      const res = await getAdminOrders({ status: tab === "all" ? undefined : tab, source: platformFilter === "all" ? undefined : platformFilter, page: p, per_page: 20 });
      setOrders(res.data);
      setTotalPages(res.meta.last_page);
      setTotal(res.meta.total);
    } catch {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    setPage(1);
    load(1);
    pollRef.current = setInterval(() => load(1), 15_000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, platformFilter]);

  useEffect(() => {
    if (!loading) load(page);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function handleConfirm(order: AdminOrder) {
    setActionLoading(order.id);
    try {
      await confirmOrder(order.id);
      await load(page);
    } catch (e: unknown) {
      setError((e as { message?: string })?.message ?? "Confirm failed");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleProcess(order: AdminOrder) {
    setActionLoading(order.id);
    try {
      await processOrder(order.id);
      await load(page);
    } catch (e: unknown) {
      setError((e as { message?: string })?.message ?? "Process failed");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDispatch(order: AdminOrder) {
    setActionLoading(order.id);
    try {
      await dispatchOrder(order.id);
      await load(page);
    } catch (e: unknown) {
      setError((e as { message?: string })?.message ?? "Dispatch failed");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDeliver(order: AdminOrder) {
    setActionLoading(order.id);
    try {
      await deliverOrder(order.id);
      await load(page);
    } catch (e: unknown) {
      setError((e as { message?: string })?.message ?? "Deliver update failed");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCancelSubmit() {
    if (!cancelModal || !cancelReason.trim()) return;
    setActionLoading(cancelModal.id);
    try {
      await cancelAdminOrder(cancelModal.id, cancelReason);
      setCancelModal(null);
      setCancelReason("");
      await load(page);
    } catch (e: unknown) {
      setError((e as { message?: string })?.message ?? "Cancel failed");
    } finally {
      setActionLoading(null);
    }
  }

  const pendingCount = orders.filter((o) => o.order_status === "pending").length;

  const filteredOrders = orders.filter((o) => {
    if (typeFilter === "all") return true;
    const type = o.order_type ?? "b2c";
    return type === typeFilter;
  });

  return (
    <DashboardGuard requiredRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark dark:text-white">Orders</h1>
            <p className="text-sm text-dark-4 dark:text-dark-6">
              Manage and dispatch B2B vendor and B2C consumer orders
              {total > 0 && <span className="ml-2 text-dark-3">({total} total)</span>}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-lg bg-gray-100 p-0.5 dark:bg-dark-2">
              {(["all", "b2c", "b2b"] as const).map((tFilter) => (
                <button
                  key={tFilter}
                  onClick={() => setTypeFilter(tFilter)}
                  className={`rounded-md px-3 py-1 text-xs font-semibold uppercase tracking-wider transition ${
                    typeFilter === tFilter
                      ? "bg-white text-dark shadow-sm dark:bg-gray-dark dark:text-white"
                      : "text-dark-4 hover:text-dark dark:hover:text-white"
                  }`}
                >
                  {tFilter === "all" ? "All" : tFilter === "b2c" ? "Consumer (B2C)" : "Business (B2B)"}
                </button>
              ))}
            </div>
            <div className="flex rounded-lg bg-gray-100 p-0.5 dark:bg-dark-2">
              {(["all", "app", "website"] as const).map((pFilter) => (
                <button
                  key={pFilter}
                  onClick={() => setPlatformFilter(pFilter)}
                  className={`rounded-md px-3 py-1 text-xs font-semibold uppercase tracking-wider transition ${
                    platformFilter === pFilter
                      ? "bg-white text-dark shadow-sm dark:bg-gray-dark dark:text-white"
                      : "text-dark-4 hover:text-dark dark:hover:text-white"
                  }`}
                >
                  {pFilter === "all" ? "All Platforms" : pFilter === "app" ? "App" : "Website"}
                </button>
              ))}
            </div>
            {pendingCount > 0 && (
              <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
                {pendingCount} Pending
              </span>
            )}
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-1 overflow-x-auto border-b border-stroke dark:border-dark-3">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors ${
                tab === t
                  ? "border-b-2 border-primary text-primary"
                  : "text-dark-4 hover:text-dark dark:hover:text-white"
              }`}
            >              {t === "out_for_delivery" ? "Out for Delivery" : t.charAt(0).toUpperCase() + t.slice(1)}
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
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-stroke bg-gray-50 dark:border-dark-3 dark:bg-gray-dark">
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-dark-4">Order #</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-dark-4">Vendor</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold uppercase text-dark-4">Platform</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold uppercase text-dark-4">Type</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold uppercase text-dark-4">Status</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold uppercase text-dark-4">Payment</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-dark-4">Items</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-dark-4">Total</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-dark-4">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-dark-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stroke dark:divide-dark-3">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-12 text-center text-sm text-dark-4">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const busy = actionLoading === order.id;
                      const orderType = order.order_type ?? "b2c";
                      return (
                        <tr key={order.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-white/5">
                          <td className="px-6 py-4">
                            <span className="font-mono text-sm font-bold text-primary">{order.order_number}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-dark dark:text-white">
                            <div>
                              <span>{order.vendor_name ?? "—"}</span>
                              {orderType === "b2b" && order.buyer_gstin && (
                                <div className="mt-0.5 text-xs text-dark-4 font-mono">
                                  GST: {order.buyer_gstin}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`rounded-md px-2.5 py-0.5 text-xs font-bold tracking-wide uppercase ${
                              order.source === "app" 
                                ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400" 
                                : "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400"
                            }`}>
                              {order.source ?? "website"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`rounded-md px-2.5 py-0.5 text-xs font-bold tracking-wide uppercase ${
                              orderType === "b2b" 
                                ? "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400" 
                                : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                            }`}>
                              {orderType}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`rounded px-2 py-0.5 text-xs font-semibold capitalize ${STATUS_BADGE[order.order_status] ?? "bg-gray-100 text-gray-600"}`}>
                              {order.order_status === "out_for_delivery" ? "Out for Delivery" : order.order_status.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className={`rounded px-2 py-0.5 text-xs font-semibold capitalize ${PAYMENT_BADGE[order.payment_status] ?? "bg-gray-100 text-gray-600"}`}>
                                {order.payment_status}
                              </span>
                              {order.payment_method && (
                                <span className="text-[10px] font-bold text-dark-4 dark:text-dark-6 uppercase tracking-wider">
                                  {order.payment_method}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right text-sm text-dark-4">{order.items_count}</td>
                          <td className="px-6 py-4 text-right text-sm font-semibold text-dark dark:text-white">
                            ₹{Number(order.total_amount).toLocaleString("en-IN")}
                          </td>
                          <td className="px-6 py-4 text-right text-sm text-dark-4">
                            {new Date(order.created_at).toLocaleDateString("en-IN")}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex gap-2">
                              {order.order_status === "pending" && (
                                <button
                                  onClick={() => handleConfirm(order)}
                                  disabled={busy}
                                  className="rounded bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                  {busy ? "…" : "Confirm"}
                                </button>
                              )}
                              {order.order_status === "confirmed" && (
                                <button
                                  onClick={() => handleProcess(order)}
                                  disabled={busy}
                                  className="rounded bg-orange-500 px-3 py-1 text-xs font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
                                >
                                  {busy ? "…" : "Ready Box"}
                                </button>
                              )}
                              {order.order_status === "processing" && (
                                <button
                                  onClick={() => handleDispatch(order)}
                                  disabled={busy}
                                  className="rounded bg-purple-600 px-3 py-1 text-xs font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
                                >
                                  {busy ? "…" : "Dispatch"}
                                </button>
                              )}
                              {order.order_status === "out_for_delivery" && (
                                <button
                                  onClick={() => handleDeliver(order)}
                                  disabled={busy}
                                  className="rounded bg-green-600 px-3 py-1 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                                >
                                  {busy ? "…" : "Mark Delivered"}
                                </button>
                              )}
                              {!["delivered", "cancelled"].includes(order.order_status) && (
                                <button
                                  onClick={() => { setCancelModal(order); setCancelReason(""); setError(""); }}
                                  disabled={busy}
                                  className="rounded bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-200 disabled:opacity-50"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-stroke px-6 py-3 dark:border-dark-3">
                <p className="text-sm text-dark-4">Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded border border-stroke px-3 py-1 text-xs font-medium hover:bg-gray-50 disabled:opacity-40 dark:border-dark-3"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="rounded border border-stroke px-3 py-1 text-xs font-medium hover:bg-gray-50 disabled:opacity-40 dark:border-dark-3"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cancel modal */}
      {cancelModal && (
        <Modal title={`Cancel Order ${cancelModal.order_number}`} onClose={() => setCancelModal(null)}>
          <p className="mb-3 text-sm text-dark-4">Provide a reason for cancellation. This cannot be undone.</p>
          <textarea
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="e.g. Vendor requested cancellation"
            rows={3}
            className="w-full rounded-lg border border-stroke px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-dark-3 dark:bg-gray-dark dark:text-white"
          />
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => setCancelModal(null)}
              className="flex-1 rounded-lg border border-stroke py-2 text-sm font-medium hover:bg-gray-50 dark:border-dark-3"
            >
              Go Back
            </button>
            <button
              onClick={handleCancelSubmit}
              disabled={!cancelReason.trim() || actionLoading !== null}
              className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
            >
              {actionLoading ? "Cancelling…" : "Cancel Order"}
            </button>
          </div>
        </Modal>
      )}
    </DashboardGuard>
  );
}
