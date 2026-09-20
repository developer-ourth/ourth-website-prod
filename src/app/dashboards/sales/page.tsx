"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { StatCard } from "@/components/ui/stat-card";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function SalesTeamDashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchSalesLeads = async () => {
    try {
      const res = await api.get("/v1/admin/sales-leads");
      if (res.data?.status === "success") {
        setLeads(res.data.data?.data || []);
      }
    } catch (e) {
      console.error("Failed to load sales leads", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesLeads();
  }, []);

  const handleUpdateStatus = async (user: any, newType: string) => {
    setUpdatingId(user.id);
    try {
      await api.put(`/v1/admin/sales-leads/${user.id}`, { user_type: newType });
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

  const b2bCount = leads.filter((l) => l.user_type === "B2B_Distributor").length;
  const b2cCount = leads.filter((l) => l.user_type === "B2C").length;

  return (
    <DashboardGuard requiredRole="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark dark:text-white">💼 Sales Team Lead Pipeline & CRM</h1>
            <p className="text-sm text-dark-4 dark:text-dark-6">
              Manage incoming B2B Wholesale Leads, Caterers, and 1-Click WhatsApp Sales Outreach
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 2xl:gap-7.5">
              <StatCard label="Total Active Leads" value={leads.length} trend="up" icon="📞" iconBg="bg-blue-100" />
              <StatCard label="B2B Wholesale Leads" value={b2bCount} trend="up" icon="🏢" iconBg="bg-orange-100" />
              <StatCard label="Retail Consumers" value={b2cCount} icon="🛒" iconBg="bg-green-100" />
            </div>

            {/* Sales Lead Pipeline Table */}
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
                              value={lead.user_type || "B2C"}
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
                            {lead.phone_number && (
                              <button
                                onClick={() => openWhatsAppChat(lead.phone_number, lead.name)}
                                className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-green-700"
                              >
                                💬 Chat on WhatsApp
                              </button>
                            )}
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
            </div>
          </>
        )}
      </div>
    </DashboardGuard>
  );
}
