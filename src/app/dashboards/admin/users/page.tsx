"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { StatCard } from "@/components/ui/stat-card";
import { getUsersApi, deleteUserApi, bulkDeleteUsersApi, getAdminDashboard } from "@/lib/api";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

interface UserItem {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  status?: string;
  created_at?: string;
  orders_count?: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [stats, setStats] = useState<{ total: number; by_type: Record<string, number> }>({ total: 0, by_type: {} });
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [meta, setMeta] = useState<{ current_page: number; total: number; per_page: number; last_page: number }>({
    current_page: 1,
    total: 0,
    per_page: 50,
    last_page: 1,
  });

  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    type: "single" | "bulk";
    userId?: number;
    userName?: string;
  } | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch users list
      const res = await getUsersApi({
        role: roleFilter,
        search: searchQuery,
        page: page,
        per_page: 50,
      });

      if (res?.data) {
        setUsers(res.data);
        if (res.meta) {
          setMeta(res.meta);
        }
      }

      // Fetch overview dashboard stats
      getAdminDashboard()
        .then((dashRes: any) => {
          if (dashRes?.users) {
            setStats({
              total: dashRes.users.total || 0,
              by_type: dashRes.users.by_type || {},
            });
          }
        })
        .catch(() => {});

    } catch (err: any) {
      toast.error(err?.message || "Failed to load users list");
    } finally {
      setLoading(false);
    }
  }, [roleFilter, searchQuery, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle select all checkbox
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUserIds(users.map((u) => u.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  // Handle individual row checkbox
  const handleSelectUser = (id: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Single user deletion trigger
  const handleSingleDelete = (user: UserItem) => {
    setDeleteConfirm({
      open: true,
      type: "single",
      userId: user.id,
      userName: user.name || user.email || `User #${user.id}`,
    });
  };

  // Bulk deletion trigger
  const handleBulkDeleteTrigger = () => {
    if (selectedUserIds.length === 0) return;
    setDeleteConfirm({
      open: true,
      type: "bulk",
    });
  };

  // Execute deletion
  const executeDelete = async () => {
    if (!deleteConfirm) return;
    setActionLoading(true);

    try {
      if (deleteConfirm.type === "single" && deleteConfirm.userId) {
        await deleteUserApi(deleteConfirm.userId);
        toast.success(`User ${deleteConfirm.userName || ""} deleted successfully`);
        setSelectedUserIds((prev) => prev.filter((id) => id !== deleteConfirm.userId));
      } else if (deleteConfirm.type === "bulk") {
        const res = await bulkDeleteUsersApi(selectedUserIds);
        toast.success(res?.message || `Successfully deleted ${selectedUserIds.length} users`);
        setSelectedUserIds([]);
      }
      setDeleteConfirm(null);
      await loadData();
    } catch (err: any) {
      toast.error(err?.message || "Deletion failed. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const isAllSelected = users.length > 0 && users.every((u) => selectedUserIds.includes(u.id));

  return (
    <DashboardGuard requiredRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-dark dark:text-white">👥 User Management</h1>
            <p className="text-sm text-dark-4 dark:text-dark-6">Manage system users, vendors, and consumers</p>
          </div>

          {/* Bulk Action Toolbar */}
          {selectedUserIds.length > 0 && (
            <div className="flex items-center gap-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 p-2.5 px-4 rounded-[10px] animate-in fade-in duration-150">
              <span className="text-xs font-bold text-red-800 dark:text-red-300">
                {selectedUserIds.length} {selectedUserIds.length === 1 ? "User" : "Users"} Selected
              </span>
              <button
                onClick={handleBulkDeleteTrigger}
                disabled={actionLoading}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-md shadow-xs transition-colors flex items-center gap-1.5"
              >
                🗑️ Delete Selected
              </button>
            </div>
          )}
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Total Users" value={stats.total ? stats.total.toLocaleString("en-IN") : "—"} icon="👥" iconBg="bg-indigo-100" />
          <StatCard label="Consumers" value={stats.by_type?.consumer ? String(stats.by_type.consumer) : "0"} icon="👤" iconBg="bg-blue-100" />
          <StatCard label="Vendors / B2B" value={stats.by_type?.vendor ? String(stats.by_type.vendor) : "0"} icon="🏪" iconBg="bg-emerald-100" />
          <StatCard label="Admins / Staff" value={stats.by_type?.admin ? String(stats.by_type.admin) : "0"} icon="⚙️" iconBg="bg-purple-100" />
        </div>

        {/* Filter & Search Bar */}
        <div className="rounded-[10px] bg-white p-4 shadow-1 dark:bg-gray-dark flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Role Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-gray-100 dark:bg-dark-2 p-1 rounded-lg w-full md:w-auto">
            {[
              { id: "all", label: "All Roles" },
              { id: "consumer", label: "Consumers" },
              { id: "vendor", label: "Vendors" },
              { id: "admin", label: "Admins" },
              { id: "operations", label: "Operations" },
            ].map((role) => (
              <button
                key={role.id}
                onClick={() => {
                  setRoleFilter(role.id);
                  setPage(1);
                  setSelectedUserIds([]);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  roleFilter === role.id
                    ? "bg-white text-dark shadow-xs dark:bg-gray-dark dark:text-white"
                    : "text-dark-4 hover:text-dark dark:hover:text-white"
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-dark-2 border border-stroke dark:border-dark-3 rounded-lg focus:outline-none focus:border-primary dark:text-white"
            />
            <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 font-medium">No users found matching your filter criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stroke dark:border-dark-3 text-left">
                    <th className="pb-3 pr-2 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                      />
                    </th>
                    <th className="pb-3 text-sm font-semibold text-dark-4">User</th>
                    <th className="pb-3 text-sm font-semibold text-dark-4">Contact</th>
                    <th className="pb-3 text-center text-sm font-semibold text-dark-4">Role</th>
                    <th className="pb-3 text-center text-sm font-semibold text-dark-4">Orders</th>
                    <th className="pb-3 text-left text-sm font-semibold text-dark-4">Joined</th>
                    <th className="pb-3 text-right text-sm font-semibold text-dark-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const isSelected = selectedUserIds.includes(u.id);
                    return (
                      <tr
                        key={u.id}
                        className={`border-b border-stroke/50 dark:border-dark-3/50 hover:bg-gray-50/50 dark:hover:bg-dark-2/40 transition-colors ${
                          isSelected ? "bg-blue-50/40 dark:bg-blue-950/20" : ""
                        }`}
                      >
                        <td className="py-4 pr-2 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectUser(u.id)}
                            className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                          />
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm uppercase">
                              {(u.name || u.email || "U").charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-dark dark:text-white text-sm">{u.name || "—"}</p>
                              <p className="text-xs text-dark-4 font-mono">ID: #{u.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-sm">
                          <p className="text-dark dark:text-white text-sm font-medium">{u.email}</p>
                          {u.phone && <p className="text-xs text-dark-4 font-mono">{u.phone}</p>}
                        </td>
                        <td className="py-4 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                              u.role === "admin" || u.role === "founder"
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300"
                                : u.role === "vendor"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
                            }`}
                          >
                            {u.role || "consumer"}
                          </span>
                        </td>
                        <td className="py-4 text-center text-sm font-semibold text-dark dark:text-white">
                          {u.orders_count ?? 0}
                        </td>
                        <td className="py-4 text-sm text-dark-4">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString("en-IN") : "—"}
                        </td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => handleSingleDelete(u)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-md transition-colors"
                            title="Delete User"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          {meta.total > meta.per_page && (
            <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-stroke dark:border-dark-3 gap-4">
              <p className="text-xs text-dark-4">
                Showing {((meta.current_page - 1) * meta.per_page) + 1} to {Math.min(meta.current_page * meta.per_page, meta.total)} of {meta.total} users
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={meta.current_page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 text-xs font-bold rounded bg-gray-100 dark:bg-dark-2 text-dark dark:text-white hover:bg-gray-200 disabled:opacity-50 transition-all"
                >
                  Previous
                </button>
                <span className="text-xs font-bold text-dark dark:text-white">
                  Page {meta.current_page} of {meta.last_page}
                </span>
                <button
                  disabled={meta.current_page >= meta.last_page}
                  onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                  className="px-3 py-1.5 text-xs font-bold rounded bg-gray-100 dark:bg-dark-2 text-dark dark:text-white hover:bg-gray-200 disabled:opacity-50 transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-gray-dark border border-stroke dark:border-dark-3 rounded-[12px] p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
              <div className="flex items-center gap-3 text-red-600">
                <span className="text-3xl">⚠️</span>
                <h3 className="text-xl font-bold text-dark dark:text-white">
                  Confirm Deletion
                </h3>
              </div>

              <p className="text-sm text-dark-4 dark:text-dark-6">
                {deleteConfirm.type === "single"
                  ? `Are you sure you want to delete ${deleteConfirm.userName}? This user account will be soft-deleted.`
                  : `Are you sure you want to delete ${selectedUserIds.length} selected users? This action will soft-delete all selected accounts.`}
              </p>

              <div className="flex justify-end gap-3 pt-4 border-t border-stroke dark:border-dark-3">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(null)}
                  disabled={actionLoading}
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-gray-100 dark:bg-dark-2 text-dark dark:text-white hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeDelete}
                  disabled={actionLoading}
                  className="px-4 py-2 text-sm font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-xs transition-all flex items-center gap-2"
                >
                  {actionLoading ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardGuard>
  );
}
