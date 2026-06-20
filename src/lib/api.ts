const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";
const TOKEN_KEY = "ourth_auth_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers ?? {}),
  };

  const method = (options.method ?? "GET").toUpperCase();
  const fetchOptions: RequestInit = { ...options, headers };

  // Dashboard data should always reflect latest DB state.
  if (method === "GET" && fetchOptions.cache == null) {
    fetchOptions.cache = "no-store";
  }

  const res = await fetch(`${API_BASE}${endpoint}`, fetchOptions);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw { status: res.status, message: body?.message ?? res.statusText, body };
  }

  return res.json() as Promise<T>;
}

// ── Auth ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  vendor_id?: number;
}

export interface LoginResponse {
  success: boolean;
  data: { token: string; user: AuthUser };
}

export interface RegisterResponse {
  success: boolean;
  data: { token: string; user: AuthUser };
}

export function loginApi(email: string, password: string) {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function registerApi(
  name: string,
  email: string,
  password: string,
  password_confirmation: string,
) {
  return request<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, password_confirmation }),
  });
}

export function logoutApi() {
  return request<{ success: boolean }>("/auth/logout", { method: "POST" });
}

export function getMeApi() {
  return request<{ success: boolean; data: AuthUser }>("/auth/user");
}

export function forgotPasswordApi(email: string) {
  return request<{ success: boolean; message: string }>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function resetPasswordApi(
  token: string,
  email: string,
  password: string,
  password_confirmation: string,
) {
  return request<{ success: boolean; message: string }>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, email, password, password_confirmation }),
  });
}

// ── Dashboard endpoints ──────────────────────────────────────────────────────

export function getFounderDashboard() {
  return request<Record<string, unknown>>(
    "/dashboard/founder",
  );
}

export function getFounderKpis(days = 30) {
  return request<Record<string, unknown>>(`/dashboard/founder/kpis?days=${days}`);
}

export function getFounderProducts(params?: { category_id?: number; search?: string; page?: number; per_page?: number; is_active?: boolean }) {
  const qs = new URLSearchParams();
  if (params?.category_id) {
    qs.set("category_id", String(params.category_id));
  }
  if (params?.search) {
    qs.set("search", params.search);
  }
  if (params?.is_active != null) {
    qs.set("is_active", params.is_active ? "1" : "0");
  }
  qs.set("page", String(params?.page ?? 1));
  qs.set("per_page", String(params?.per_page ?? 20));

  return request<ProductListResponse>(`/dashboard/founder/products?${qs}`);
}

export function getVendorDashboard(vendorId: number) {
  return request<Record<string, unknown>>(
    `/dashboard/vendor/${vendorId}`,
  );
}

export function getVendorEarnings(vendorId: number, days = 30) {
  return request<Record<string, unknown>>(`/dashboard/vendor/${vendorId}/earnings?days=${days}`);
}

export function getVendorCatalog(vendorId: number) {
  return request<Record<string, unknown>>(`/dashboard/vendor/${vendorId}/catalog`);
}

export function getConsumerDashboard(userId: number) {
  return request<Record<string, unknown>>(
    `/dashboard/consumer/${userId}`,
  );
}

export function getConsumerNearbyVendors(userId: number, params: { latitude: number; longitude: number; radius_km?: number }) {
  const qs = new URLSearchParams({
    latitude: String(params.latitude),
    longitude: String(params.longitude),
  });
  if (params.radius_km != null) {
    qs.set("radius_km", String(params.radius_km));
  }
  return request<Record<string, unknown>>(`/dashboard/consumer/${userId}/nearby-vendors?${qs}`);
}

export function getConsumerRewardsSummary(userId: number) {
  return request<Record<string, unknown>>(`/dashboard/consumer/${userId}/rewards`);
}

export function getOperationsDashboard() {
  return request<Record<string, unknown>>(
    "/dashboard/operations",
  );
}

export function getOperationsRoutes(date?: string) {
  const qs = date ? `?date=${encodeURIComponent(date)}` : "";
  return request<Record<string, unknown>>(`/dashboard/operations/routes${qs}`);
}

export function getOperationsInventory(page = 1) {
  return request<Record<string, unknown>>(`/dashboard/operations/inventory?page=${page}`);
}

export function getWasteManagementDashboard() {
  return request<Record<string, unknown>>(
    "/dashboard/waste-management",
  );
}

export function getWasteDustbins(page = 1) {
  return request<Record<string, unknown>>(`/dashboard/waste-management/dustbins?page=${page}`);
}

export function getWasteCollections(date?: string) {
  const qs = date ? `?date=${encodeURIComponent(date)}` : "";
  return request<Record<string, unknown>>(`/dashboard/waste-management/collections${qs}`);
}

export function getFinanceDashboard() {
  return request<Record<string, unknown>>(
    "/dashboard/finance",
  );
}

export function getFinanceSnapshots(page = 1) {
  return request<Record<string, unknown>>(`/dashboard/finance/snapshots?page=${page}`);
}

export function getAdminDashboard() {
  return request<Record<string, unknown>>(
    "/dashboard/admin",
  );
}

export function getAdminUsers(params?: { user_type?: string; status?: string; search?: string; page?: number }) {
  const qs = new URLSearchParams();
  if (params?.user_type) {
    qs.set("user_type", params.user_type);
  }
  if (params?.status) {
    qs.set("status", params.status);
  }
  if (params?.search) {
    qs.set("search", params.search);
  }
  qs.set("page", String(params?.page ?? 1));
  return request<Record<string, unknown>>(`/dashboard/admin/users?${qs}`);
}

export function getAdminCities() {
  return request<Record<string, unknown>>(`/dashboard/admin/cities`);
}

export function getAdminCampaigns(params?: { status?: string; type?: string; page?: number }) {
  const qs = new URLSearchParams();
  if (params?.status) {
    qs.set("status", params.status);
  }
  if (params?.type) {
    qs.set("type", params.type);
  }
  qs.set("page", String(params?.page ?? 1));
  return request<Record<string, unknown>>(`/dashboard/admin/campaigns?${qs}`);
}

export function getAdminAlerts(params?: { severity?: string; unresolved?: boolean; page?: number }) {
  const qs = new URLSearchParams();
  if (params?.severity) {
    qs.set("severity", params.severity);
  }
  if (params?.unresolved != null) {
    qs.set("unresolved", params.unresolved ? "1" : "0");
  }
  qs.set("page", String(params?.page ?? 1));
  return request<Record<string, unknown>>(`/dashboard/admin/alerts?${qs}`);
}

export function getMarketingDashboard() {
  return request<Record<string, unknown>>(
    "/dashboard/marketing",
  );
}

// ── KYC Approval Management ──────────────────────────────────────────────────

export interface KycVendor {
  id: number;
  vendor_code: string | null;
  business_name: string;
  gstin: string | null;
  kyc_status: string;
  approval_stage: string;
  city: string | null;
  state: string | null;
  created_at: string;
  user?: { name: string; email: string; phone: string | null };
  kyc_documents?: { id: number; document_type: string; document_url: string; status: string }[];
}

export interface KycListResponse {
  success: boolean;
  data: KycVendor[];
  meta: { current_page: number; total: number; per_page: number; last_page: number };
}

export function getKycList(status?: string, page = 1) {
  const params = new URLSearchParams({ per_page: "50", page: String(page) });
  if (status && status !== "all") params.set("status", status);
  return request<KycListResponse>(`/kyc-approvals?${params}`);
}

/** Fetching detail also marks the application as under_review on the backend */
export function getKycDetail(vendorId: number) {
  return request<{ success: boolean; data: KycVendor }>(`/kyc-approvals/${vendorId}`);
}

export function approveKyc(vendorId: number, notes?: string) {
  return request<{ success: boolean; message: string }>(`/kyc-approvals/${vendorId}/approve`, {
    method: "POST",
    body: JSON.stringify({ notes: notes ?? "" }),
  });
}

export function rejectKyc(vendorId: number, reason: string) {
  return request<{ success: boolean; message: string }>(`/kyc-approvals/${vendorId}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

// ── Admin Orders ─────────────────────────────────────────────────────────────

export interface AdminOrder {
  id: number;
  order_number: string;
  vendor_name: string | null;
  order_status: "pending" | "confirmed" | "processing" | "out_for_delivery" | "delivered" | "cancelled";
  payment_status: "pending" | "paid" | "failed";
  total_amount: string;
  items_count: number;
  created_at: string;
}

export interface AdminOrderListResponse {
  success: boolean;
  data: AdminOrder[];
  meta: { current_page: number; total: number; per_page: number; last_page: number };
}

export function getAdminOrders(params?: { status?: string; page?: number; per_page?: number }) {
  const q = new URLSearchParams({ per_page: String(params?.per_page ?? 20), page: String(params?.page ?? 1) });
  if (params?.status && params.status !== "all") q.set("status", params.status);
  return request<AdminOrderListResponse>(`/orders?${q}`);
}

export function confirmOrder(orderId: number) {
  return request<{ success: boolean; message: string }>(`/orders/${orderId}/confirm`, { method: "POST" });
}

export function processOrder(orderId: number) {
  return request<{ success: boolean; message: string }>(`/orders/${orderId}/process`, { method: "POST" });
}

export function dispatchOrder(orderId: number) {
  return request<{ success: boolean; message: string }>(`/orders/${orderId}/dispatch`, { method: "POST" });
}

export function deliverOrder(orderId: number) {
  return request<{ success: boolean; message: string }>(`/orders/${orderId}/deliver`, { method: "POST" });
}

export function cancelAdminOrder(orderId: number, reason: string) {
  return request<{ success: boolean; message: string }>(`/orders/${orderId}/cancel`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

// ── Marketplace — Categories ─────────────────────────────────────────────────

export interface MarketCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon_url: string | null;
  sort_order: number;
  is_active: boolean;
  parent_id: number | null;
  products_count?: number;
  children?: MarketCategory[];
}

export interface CategoryPayload {
  name: string;
  description?: string;
  icon_url?: string;
  parent_id?: number | null;
  sort_order?: number;
  is_active?: boolean;
}

export interface CategoryListResponse {
  success: boolean;
  data: MarketCategory[];
}

export function getCategories() {
  return request<CategoryListResponse>("/categories");
}

export function createCategory(payload: CategoryPayload) {
  return request<{ success: boolean; data: MarketCategory }>("/admin/categories", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateCategory(id: number, payload: Partial<CategoryPayload>) {
  return request<{ success: boolean; data: MarketCategory }>(`/admin/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteCategory(id: number) {
  return request<{ success: boolean; message: string }>(`/admin/categories/${id}`, {
    method: "DELETE",
  });
}

// ── Marketplace — Products ───────────────────────────────────────────────────

export interface ProductPack {
  id: number;
  product_id: number;
  name: string;
  base_price: string;
  discounted_price: string | null;
  sku: string | null;
  stock_quantity: number;
  is_active: boolean;
}

export interface ProductPackPayload {
  id?: number;
  name: string;
  base_price: number;
  discounted_price?: number | null;
  sku?: string;
  stock_quantity?: number;
  is_active?: boolean;
}

export interface MarketProduct {
  id: number;
  name: string;
  description: string | null;
  sku: string | null;
  category_id: number | null;
  category?: Pick<MarketCategory, "id" | "name"> | null;
  base_price: string;
  discounted_price: string | null;
  primary_image_url: string | null;
  secondary_images: string[];
  unit: string;
  stock_quantity: number;
  weight_grams: number | null;
  is_active: boolean;
  is_featured: boolean;
  packs?: ProductPack[];
  created_at: string;
}

export interface ProductPayload {
  name: string;
  description?: string;
  category_id?: number | null;
  base_price: number;
  discounted_price?: number | null;
  primary_image_url?: string;
  secondary_images?: string[];
  sku?: string;
  unit?: string;
  stock_quantity?: number;
  weight_grams?: number | null;
  is_active?: boolean;
  is_featured?: boolean;
  packs?: ProductPackPayload[];
}

export interface ProductListResponse {
  success: boolean;
  data: MarketProduct[];
  meta: { current_page: number; last_page: number; total: number; per_page: number };
}

export function getProducts(params?: { category_id?: number; search?: string; featured?: boolean; page?: number; per_page?: number }) {
  const qs = new URLSearchParams();
  if (params?.category_id) qs.set("category_id", String(params.category_id));
  if (params?.search)      qs.set("search", params.search);
  if (params?.featured)    qs.set("featured", "1");
  qs.set("page", String(params?.page ?? 1));
  qs.set("per_page", String(params?.per_page ?? 20));
  return request<ProductListResponse>(`/admin/products?${qs}`);
}

export function getMarketplaceProducts(params?: { category_id?: number; search?: string; featured?: boolean; page?: number; per_page?: number }) {
  const qs = new URLSearchParams();
  if (params?.category_id) qs.set("category_id", String(params.category_id));
  if (params?.search)      qs.set("search", params.search);
  if (params?.featured)    qs.set("featured", "1");
  qs.set("page", String(params?.page ?? 1));
  qs.set("per_page", String(params?.per_page ?? 20));
  return request<ProductListResponse>(`/products?${qs}`);
}

export function getProduct(id: number) {
  return request<{ success: boolean; data: MarketProduct }>(`/products/${id}`);
}

export function createProduct(payload: ProductPayload) {
  return request<{ success: boolean; data: MarketProduct }>("/admin/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateProduct(id: number, payload: Partial<ProductPayload>) {
  return request<{ success: boolean; data: MarketProduct }>(`/admin/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteProduct(id: number) {
  return request<{ success: boolean; message: string }>(`/admin/products/${id}`, {
    method: "DELETE",
  });
}

// ── Image Upload ─────────────────────────────────────────────────────────────

export async function uploadImage(file: File): Promise<string> {
  const token = getToken();
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_BASE}/admin/upload-image`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw { status: res.status, message: body?.message ?? res.statusText, body };
  }

  const json = await res.json();
  return json.url as string;
}
