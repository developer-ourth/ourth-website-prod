"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { StatCard } from "@/components/ui/stat-card";
import { useEffect, useState } from "react";
import { getSalesLeadsApi, updateSalesLeadApi, discoverGoogleLeadsApi, importCsvLeadsApi } from "@/lib/api";

export default function SalesTeamDashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Auto-Discovery form state
  const [keyword, setKeyword] = useState("Caterers");
  const [city, setCity] = useState("Mumbai");
  const [discovering, setDiscovering] = useState(false);
  const [discoverResult, setDiscoverResult] = useState<{ success: boolean; message: string } | null>(null);

  // CSV Import state
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importingCsv, setImportingCsv] = useState(false);
  const [csvResult, setCsvResult] = useState<{ success: boolean; message: string } | null>(null);

  const fetchSalesLeads = async (targetPage = page) => {
    try {
      const res = await getSalesLeadsApi({ page: targetPage });
      if (res?.status === "success") {
        setLeads(res.data?.data || []);
        setLastPage(res.data?.last_page || 1);
        setTotalLeads(res.data?.total || 0);
        setCounts(res.counts || {});
      }
    } catch (e) {
      console.error("Failed to load sales leads", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesLeads(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleCsvImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) return;

    setImportingCsv(true);
    setCsvResult(null);

    try {
      const formData = new FormData();
      formData.append("csv_file", csvFile);

      const res = await importCsvLeadsApi(formData);
      if (res?.status === "success") {
        setCsvResult({ success: true, message: res.message });
        setCsvFile(null);
        fetchSalesLeads();
      } else {
        setCsvResult({ success: false, message: res?.message || "Failed to import CSV." });
      }
    } catch (err: any) {
      setCsvResult({ success: false, message: err?.message || "Error processing CSV upload." });
    } finally {
      setImportingCsv(false);
    }
  };

  const handleDiscoverLeads = async (e: React.FormEvent) => {
    e.preventDefault();
    setDiscovering(true);
    setDiscoverResult(null);

    try {
      const res = await discoverGoogleLeadsApi({ keyword, city });
      if (res?.success) {
        setDiscoverResult({ success: true, message: res.message });
        fetchSalesLeads();
      } else {
        setDiscoverResult({ success: false, message: res?.message || "Failed to discover leads." });
      }
    } catch (err: any) {
      setDiscoverResult({ success: false, message: err?.message || "Error discovering leads." });
    } finally {
      setDiscovering(false);
    }
  };

  const handleUpdateStatus = async (user: any, newSegment: string) => {
    setUpdatingId(user.id);
    try {
      await updateSalesLeadApi(user.id, { segment: newSegment });
      fetchSalesLeads();
    } catch (e) {
      console.error("Failed to update lead status", e);
    } finally {
      setUpdatingId(null);
    }
  };

  const openWhatsAppChat = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const message = encodeURIComponent(`Hi ${name || 'there'}! I am connecting with you from OURTH regarding your tableware & catering enquiry.`);
    window.open(`https://wa.me/${formattedPhone}?text=${message}`, "_blank");
  };

  const b2bCount = counts.B2B_Distributor ?? 0;
  const b2cCount = counts.B2C ?? 0;

  return (
    <DashboardGuard requiredRole={["admin", "marketing"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark dark:text-white">💼 Sales Team Lead Pipeline & CRM</h1>
            <p className="text-sm text-dark-4 dark:text-dark-6">
              Bring in new leads here. Follow-ups, notes and quotes happen in the Sales CRM.
            </p>
          </div>
          {process.env.NEXT_PUBLIC_CRM_URL && (
            <a
              href={`${process.env.NEXT_PUBLIC_CRM_URL}/admin/leads`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              🗂️ Open Sales CRM ↗
            </a>
          )}
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 2xl:gap-7.5">
              <StatCard label="Total Leads & Customers" value={totalLeads} trend="up" icon="📞" iconBg="bg-blue-100" />
              <StatCard label="B2B Wholesale Leads" value={b2bCount} trend="up" icon="🏢" iconBg="bg-orange-100" />
              <StatCard label="Retail Consumers" value={b2cCount} icon="🛒" iconBg="bg-green-100" />
            </div>

            {/* Google Places Auto-Discover B2B Leads Control Panel */}
            <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
              <h2 className="mb-2 text-lg font-bold text-dark dark:text-white">🔍 Auto-Discover B2B Leads (Google Places API)</h2>
              <p className="mb-4 text-xs text-dark-4 dark:text-dark-6">
                Automatically query Google business directories for caterers, event planners, and disposable tableware wholesalers across target cities and import them into your sales pipeline.
              </p>

              {discoverResult && (
                <div className={`mb-4 rounded-lg p-3 text-sm font-medium ${discoverResult.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {discoverResult.message}
                </div>
              )}

              <form onSubmit={handleDiscoverLeads} className="grid grid-cols-1 gap-4 sm:grid-cols-3 items-end">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-dark dark:text-white">Business Category</label>
                  <select
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2 text-sm text-dark dark:border-dark-3 dark:text-white"
                  >
                    <option value="Caterers">Caterers & Food Suppliers</option>
                    <option value="Event Planners">Event Planners & Wedding Organizers</option>
                    <option value="Disposable Tableware Wholesalers">Disposable Tableware Wholesalers</option>
                    <option value="Hotels & Restaurants">Hotels & Restaurants</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-dark dark:text-white">Target City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2 text-sm text-dark dark:border-dark-3 dark:text-white"
                  >
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Pune">Pune</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Kolkata">Kolkata</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Ahmedabad">Ahmedabad</option>
                    <option value="Jaipur">Jaipur</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={discovering}
                  className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50"
                >
                  {discovering ? "Finding & Importing Leads..." : "🚀 Auto-Discover Leads"}
                </button>
              </form>
            </div>

            {/* Bulk CSV Lead Importer Control Panel */}
            <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
              <h2 className="mb-2 text-lg font-bold text-dark dark:text-white">📂 Bulk CSV Contact Importer</h2>
              <p className="mb-4 text-xs text-dark-4 dark:text-dark-6">
                Upload a CSV contact file (e.g. from Justdial, IndiaMART, or offline event lists). Columns supported: <strong>Name, Phone, City, Segment</strong>.
              </p>

              {csvResult && (
                <div className={`mb-4 rounded-lg p-3 text-sm font-medium ${csvResult.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {csvResult.message}
                </div>
              )}

              <form onSubmit={handleCsvImport} className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-semibold text-dark dark:text-white">Select CSV File</label>
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                    className="w-full rounded-lg border border-stroke bg-transparent px-3 py-1.5 text-sm text-dark dark:border-dark-3 dark:text-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={importingCsv || !csvFile}
                  className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                >
                  {importingCsv ? "Importing CSV Contacts..." : "📥 Import CSV Leads"}
                </button>
              </form>
            </div>
            <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
              <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">📋 Lead Pipeline</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stroke dark:border-dark-3">
                      <th className="pb-3 text-left text-sm font-medium text-dark-4">Lead Name</th>
                      <th className="pb-3 text-left text-sm font-medium text-dark-4">Phone Number</th>
                      <th className="pb-3 text-left text-sm font-medium text-dark-4">Segment / Type</th>
                      <th className="pb-3 text-right text-sm font-medium text-dark-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.length > 0 ? (
                      leads.map((lead: any) => (
                        <tr key={lead.id} className="border-b border-stroke/50 dark:border-dark-3/50">
                          <td className="py-3 text-sm font-semibold text-dark dark:text-white">{lead.name || "Lead"}</td>
                          <td className="py-3 text-sm text-dark-4">{lead.phone_number || "—"}</td>
                          <td className="py-3 text-sm">
                            <select
                              value={lead.segment || "B2C"}
                              disabled={updatingId === lead.id}
                              onChange={(e) => handleUpdateStatus(lead, e.target.value)}
                              className="rounded border border-stroke bg-transparent px-2 py-1 text-xs font-semibold text-dark dark:border-dark-3 dark:text-white"
                            >
                              <option value="B2C">B2C Retail Customer</option>
                              <option value="B2B_Distributor">B2B Wholesale / Caterer</option>
                              <option value="Vendor">Vendor Partner</option>
                            </select>
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex flex-wrap justify-end gap-2">
                              {lead.crm_lead_url && (
                                <a
                                  href={lead.crm_lead_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="rounded-lg border border-primary px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/10"
                                >
                                  🗂️ View in CRM
                                </a>
                              )}
                              {lead.phone_number && (
                                <button
                                  onClick={() => openWhatsAppChat(lead.phone_number, lead.name)}
                                  className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-green-700"
                                >
                                  💬 Chat on WhatsApp
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-sm text-dark-4">
                          No leads in the pipeline yet. As customers register or fill Meta forms, leads will appear here automatically.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {lastPage > 1 && (
                <div className="mt-4 flex items-center justify-between text-sm text-dark-4">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="rounded-lg border border-stroke px-3 py-1.5 font-semibold disabled:opacity-40 dark:border-dark-3"
                  >
                    ← Previous
                  </button>
                  <span>
                    Page {page} of {lastPage}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                    disabled={page >= lastPage}
                    className="rounded-lg border border-stroke px-3 py-1.5 font-semibold disabled:opacity-40 dark:border-dark-3"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardGuard>
  );
}
