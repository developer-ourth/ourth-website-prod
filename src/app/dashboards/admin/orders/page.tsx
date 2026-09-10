"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import {
  AdminOrder,
  cancelAdminOrder,
  confirmOrder,
  deliverOrder,
  dispatchOrder,
  getAdminOrders,
  getAdminOrderDetail,
  FullOrderDetail,
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

function Modal({ title, onClose, children, maxWidth = "max-w-sm" }: { title: string; onClose: () => void; children: React.ReactNode; maxWidth?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className={`w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-dark`}>
        <div className="mb-4 flex items-center justify-between border-b border-stroke pb-3 dark:border-dark-3">
          <h3 className="text-base font-bold text-dark dark:text-white">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-dark-4 hover:bg-gray-100 hover:text-dark dark:hover:bg-dark-2 dark:hover:text-white">✕</button>
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
  
  const [viewDetailModal, setViewDetailModal] = useState<FullOrderDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

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

  async function handleOpenDetail(orderId: number) {
    setDetailLoading(true);
    try {
      const res = await getAdminOrderDetail(orderId);
      setViewDetailModal(res.data);
    } catch (e: unknown) {
      setError((e as { message?: string })?.message ?? "Failed to load order details");
    } finally {
      setDetailLoading(false);
    }
  }

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
            >
              {t === "out_for_delivery" ? "Out for Delivery" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark border border-stroke/40 dark:border-dark-3">
            <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-stroke bg-gray-50/80 dark:border-dark-3 dark:bg-gray-dark/80">
                    <th className="pl-5 pr-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Order #</th>
                    <th className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Customer</th>
                    <th className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Vendor</th>
                    <th className="px-3 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Platform</th>
                    <th className="px-3 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Type</th>
                    <th className="px-3 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                    <th className="px-3 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Payment</th>
                    <th className="px-3 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Items</th>
                    <th className="px-4 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Total</th>
                    <th className="px-4 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</th>
                    <th className="pl-4 pr-5 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stroke dark:divide-dark-3">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const busy = actionLoading === order.id;
                      const orderType = order.order_type ?? "b2c";
                      return (
                        <tr key={order.id} className="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/5">
                          <td className="pl-5 pr-4 py-3.5 whitespace-nowrap">
                            <button
                              onClick={() => handleOpenDetail(order.id)}
                              className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
                            >
                              {order.order_number}
                            </button>
                          </td>
                          <td className="px-4 py-3.5 text-xs text-dark dark:text-white max-w-[160px]">
                            <div className="truncate">
                              <span className="font-semibold text-sm">{order.customer_name ?? "Guest / Consumer"}</span>
                              {order.customer_email && (
                                <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                                  {order.customer_email}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-xs text-dark dark:text-white max-w-[140px]">
                            <div className="truncate">
                              <span className="font-medium">{order.vendor_name ?? "—"}</span>
                              {orderType === "b2b" && order.buyer_gstin && (
                                <div className="text-[11px] text-gray-500 dark:text-gray-400 font-mono truncate">
                                  GST: {order.buyer_gstin}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-3.5 text-center">
                            <span className={`rounded-md px-2 py-1 text-[11px] font-bold tracking-wide uppercase ${
                              order.source === "app" 
                                ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400" 
                                : "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400"
                            }`}>
                              {order.source ?? "website"}
                            </span>
                          </td>
                          <td className="px-3 py-3.5 text-center">
                            <span className={`rounded-md px-2 py-1 text-[11px] font-bold tracking-wide uppercase ${
                              orderType === "b2b" 
                                ? "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400" 
                                : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                            }`}>
                              {orderType}
                            </span>
                          </td>
                          <td className="px-3 py-3.5 text-center">
                            <span className={`rounded px-2 py-1 text-[11px] font-semibold capitalize whitespace-nowrap ${STATUS_BADGE[order.order_status] ?? "bg-gray-100 text-gray-600"}`}>
                              {order.order_status === "out_for_delivery" ? "Out for Delivery" : order.order_status.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="px-3 py-3.5 text-center">
                            <div className="flex flex-col items-center gap-0.5">
                              <span className={`rounded px-2 py-1 text-[11px] font-semibold capitalize ${PAYMENT_BADGE[order.payment_status] ?? "bg-gray-100 text-gray-600"}`}>
                                {order.payment_status}
                              </span>
                              {order.payment_method && (
                                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  {order.payment_method}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-3.5 text-center text-xs font-medium text-gray-700 dark:text-gray-300">{order.items_count}</td>
                          <td className="px-4 py-3.5 text-right text-sm font-bold text-dark dark:text-white whitespace-nowrap">
                            ₹{Number(order.total_amount).toLocaleString("en-IN")}
                          </td>
                          <td className="px-4 py-3.5 text-right text-xs text-gray-700 dark:text-gray-300 whitespace-nowrap">
                            {new Date(order.created_at).toLocaleDateString("en-IN")}
                          </td>
                          <td className="pl-4 pr-5 py-3.5 text-right whitespace-nowrap">
                            <div className="inline-flex gap-1.5">
                              <button
                                onClick={() => handleOpenDetail(order.id)}
                                className="rounded bg-gray-100 px-2.5 py-1 text-xs font-semibold text-dark hover:bg-gray-200 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
                              >
                                Details
                              </button>
                              {order.order_status === "pending" && (
                                <button
                                  onClick={() => handleConfirm(order)}
                                  disabled={busy}
                                  className="rounded bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                  {busy ? "…" : "Confirm"}
                                </button>
                              )}
                              {order.order_status === "confirmed" && (
                                <button
                                  onClick={() => handleProcess(order)}
                                  disabled={busy}
                                  className="rounded bg-orange-500 px-2.5 py-1 text-xs font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
                                >
                                  {busy ? "…" : "Ready Box"}
                                </button>
                              )}
                              {order.order_status === "processing" && (
                                <button
                                  onClick={() => handleDispatch(order)}
                                  disabled={busy}
                                  className="rounded bg-purple-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
                                >
                                  {busy ? "…" : "Dispatch"}
                                </button>
                              )}
                              {order.order_status === "out_for_delivery" && (
                                <button
                                  onClick={() => handleDeliver(order)}
                                  disabled={busy}
                                  className="rounded bg-green-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                                >
                                  {busy ? "…" : "Delivered"}
                                </button>
                              )}
                              {!["delivered", "cancelled"].includes(order.order_status) && (
                                <button
                                  onClick={() => { setCancelModal(order); setCancelReason(""); setError(""); }}
                                  disabled={busy}
                                  className="rounded bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-200 disabled:opacity-50"
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

      {/* Details modal */}
      {viewDetailModal && (
        <Modal
          title={`Order Details: ${viewDetailModal.order_number}`}
          onClose={() => setViewDetailModal(null)}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6 text-sm text-dark dark:text-white">
            {/* Overview Row */}
            <div className="grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4 dark:bg-dark-2 sm:grid-cols-4">
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400 block uppercase font-medium">Status</span>
                <span className={`inline-block mt-1 rounded px-2 py-0.5 text-xs font-semibold capitalize ${STATUS_BADGE[viewDetailModal.order_status]}`}>
                  {viewDetailModal.order_status.replace(/_/g, " ")}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400 block uppercase font-medium">Payment</span>
                <span className={`inline-block mt-1 rounded px-2 py-0.5 text-xs font-semibold capitalize ${PAYMENT_BADGE[viewDetailModal.payment_status]}`}>
                  {viewDetailModal.payment_status}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400 block uppercase font-medium">Platform / Type</span>
                <span className="font-semibold uppercase text-xs">
                  {viewDetailModal.source ?? "website"} ({viewDetailModal.order_type ?? "b2c"})
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400 block uppercase font-medium">Total Amount</span>
                <span className="text-base font-bold text-teal-600 dark:text-teal-400">
                  ₹{Number(viewDetailModal.total_amount).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Delivery & Address */}
            <div>
              <h4 className="font-bold text-dark dark:text-white border-b border-stroke pb-1 mb-2 dark:border-dark-3">
                Shipping & Delivery Address
              </h4>
              {viewDetailModal.delivery ? (
                <div className="space-y-1 text-sm bg-gray-50 p-3 rounded-lg dark:bg-dark-2">
                  <p className="font-semibold">{viewDetailModal.delivery.address_line1}</p>
                  {viewDetailModal.delivery.address_line2 && <p>{viewDetailModal.delivery.address_line2}</p>}
                  <p>{viewDetailModal.delivery.city}, {viewDetailModal.delivery.state} - {viewDetailModal.delivery.postal_code}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Phone: <span className="font-mono text-dark dark:text-white font-medium">{viewDetailModal.delivery.phone}</span></p>
                  {viewDetailModal.delivery.awb_number && (
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 font-mono">
                      AWB: {viewDetailModal.delivery.awb_number} ({viewDetailModal.delivery.courier_partner ?? "Shadowfax"})
                    </p>
                  )}
                </div>
              ) : viewDetailModal.delivery_address_line1 ? (
                <div className="space-y-1 text-sm bg-gray-50 p-3 rounded-lg dark:bg-dark-2">
                  <p className="font-semibold">{viewDetailModal.delivery_address_line1}</p>
                  {viewDetailModal.delivery_address_line2 && <p>{viewDetailModal.delivery_address_line2}</p>}
                  <p>{viewDetailModal.delivery_city}, {viewDetailModal.delivery_state} - {viewDetailModal.delivery_postal_code}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Phone: <span className="font-mono text-dark dark:text-white font-medium">{viewDetailModal.delivery_phone}</span></p>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">No shipping details provided</p>
              )}
            </div>

            {/* Order Items */}
            <div>
              <h4 className="font-bold text-dark dark:text-white border-b border-stroke pb-1 mb-2 dark:border-dark-3">
                Order Items ({viewDetailModal.items?.length ?? viewDetailModal.items_count})
              </h4>
              {viewDetailModal.items && viewDetailModal.items.length > 0 ? (
                <div className="divide-y divide-stroke border rounded-lg overflow-hidden dark:divide-dark-3 dark:border-dark-3">
                  {viewDetailModal.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-white/5">
                      <div>
                        <p className="font-semibold text-sm">{item.product_name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Qty: {item.quantity} × ₹{Number(item.unit_price).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <span className="font-mono font-bold text-sm">
                        ₹{Number(item.total_price).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">No item list available</p>
              )}
            </div>

            {/* Customer & Vendor Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <h4 className="font-bold text-dark dark:text-white border-b border-stroke pb-1 mb-2 dark:border-dark-3">
                  Customer
                </h4>
                <p className="font-semibold">{viewDetailModal.user?.name ?? viewDetailModal.customer_name ?? "Guest / Consumer"}</p>
                {(viewDetailModal.user?.email ?? viewDetailModal.customer_email) && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{viewDetailModal.user?.email ?? viewDetailModal.customer_email}</p>
                )}
                {viewDetailModal.user?.phone && (
                  <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-0.5">Ph: {viewDetailModal.user.phone}</p>
                )}
              </div>
              <div>
                <h4 className="font-bold text-dark dark:text-white border-b border-stroke pb-1 mb-2 dark:border-dark-3">
                  Vendor
                </h4>
                <p className="font-medium">{viewDetailModal.vendor?.business_name ?? viewDetailModal.vendor_name ?? "Direct / Healing Ourth"}</p>
                {viewDetailModal.buyer_gstin && (
                  <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-1">GSTIN: {viewDetailModal.buyer_gstin}</p>
                )}
              </div>
              <div>
                <h4 className="font-bold text-dark dark:text-white border-b border-stroke pb-1 mb-2 dark:border-dark-3">
                  Payment Method
                </h4>
                <p className="font-medium uppercase">{viewDetailModal.payment_method ?? viewDetailModal.payment?.payment_method ?? "—"}</p>
                {viewDetailModal.payment?.transaction_id && (
                  <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-1">Txn ID: {viewDetailModal.payment.transaction_id}</p>
                )}
              </div>
            </div>

            {viewDetailModal.cancel_reason && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700">
                <strong>Cancellation Reason:</strong> {viewDetailModal.cancel_reason}
              </div>
            )}
          </div>
        </Modal>
      )}

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
