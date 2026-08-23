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
  kyc_status?: string | null;
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

export function loginWithGoogle(idToken: string) {
  return request<LoginResponse>("/auth/google", {
    method: "POST",
    body: JSON.stringify({ id_token: idToken }),
  });
}

export function sendEmailOtp(email: string) {
  return request<{ success: boolean; message: string }>("/auth/otp/send-email", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function apiVerifyOtp(identifier: string, otp: string, type: "email" | "phone") {
  return request<any>("/auth/otp/verify", {
    method: "POST",
    body: JSON.stringify({ identifier, otp, type }),
  });
}

export function registerApi(
  name: string,
  email: string,
  password: string,
  password_confirmation: string,
  phone?: string,
  role?: "vendor" | "consumer",
  gstin?: string,
  business_name?: string,
) {
  return request<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
      password_confirmation,
      phone,
      role,
      gstin,
      business_name,
    }),
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
  order_type?: "b2c" | "b2b";
  buyer_gstin?: string | null;
  source?: "app" | "website";
  payment_method?: string;
}

export interface AdminOrderListResponse {
  success: boolean;
  data: AdminOrder[];
  meta: { current_page: number; total: number; per_page: number; last_page: number };
}

export function getAdminOrders(params?: { status?: string; page?: number; per_page?: number; source?: "all" | "app" | "website" }) {
  const q = new URLSearchParams({ per_page: String(params?.per_page ?? 20), page: String(params?.page ?? 1) });
  if (params?.status && params.status !== "all") q.set("status", params.status);
  if (params?.source && params.source !== "all") q.set("source", params.source);
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

// ── Admin Coupons ────────────────────────────────────────────────────────────

export interface Coupon {
  id: number;
  code: string;
  discount_percentage: string;
  product_id: number | null;
  expires_at: string | null;
  usage_limit: number | null;
  usage_count: number;
  is_active: boolean;
  product?: Pick<MarketProduct, "id" | "name"> | null;
}

export interface CouponPayload {
  code: string;
  discount_percentage: number;
  product_id?: number | null;
  expires_at?: string | null;
  usage_limit?: number | null;
  is_active?: boolean;
}

export function getAdminCoupons() {
  return request<Coupon[]>("/admin/coupons");
}

export function createCoupon(payload: CouponPayload) {
  return request<Coupon>("/admin/coupons", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateCoupon(id: number, payload: Partial<CouponPayload>) {
  return request<Coupon>(`/admin/coupons/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteCoupon(id: number) {
  return request<{ success: boolean; message: string }>(`/admin/coupons/${id}`, {
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
  wholesale_price: string | null;
  wholesale_discounted_price: string | null;
  min_order_quantity: number | null;
  sku: string | null;
  stock_quantity: number;
  is_active: boolean;
}

export interface ProductPackPayload {
  id?: number;
  name: string;
  base_price: number;
  discounted_price?: number | null;
  wholesale_price?: number | null;
  wholesale_discounted_price?: number | null;
  min_order_quantity?: number | null;
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
  wholesale_price: string | null;
  wholesale_discounted_price: string | null;
  min_order_quantity: number;
  primary_image_url: string | null;
  app_primary_image_url?: string | null;
  secondary_images: string[];
  unit: string;
  stock_quantity: number;
  weight_grams: number | null;
  dimensions_cm: { length?: number; width?: number; height?: number } | null;
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
  wholesale_price?: number | null;
  wholesale_discounted_price?: number | null;
  min_order_quantity?: number;
  primary_image_url?: string;
  app_primary_image_url?: string;
  secondary_images?: string[];
  sku?: string;
  unit?: string;
  stock_quantity?: number;
  weight_grams?: number | null;
  dimensions_cm?: { length?: number; width?: number; height?: number } | null;
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

export function getProduct(idOrSku: string | number) {
  return request<{ success: boolean; data: MarketProduct }>(`/products/${idOrSku}`);
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

// ── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  product_pack_id?: number | null;
  quantity: number;
  unit_price: string;
  total_price: string;
  product?: Pick<MarketProduct, "id" | "name" | "primary_image_url" | "base_price" | "discounted_price" | "wholesale_price" | "min_order_quantity" | "category">;
  productPack?: ProductPack | null;
}

export interface Cart {
  id: number;
  user_id: number;
  vendor_id: number;
  status: string;
  total_amount: string;
  total_items: number;
  discount_amount?: string;
  coupon_id?: number | null;
  coupon?: Coupon | null;
  items: CartItem[];
}

export function getCart() {
  return request<{ success: boolean; data: Cart }>("/me/cart");
}

export function addCartItem(productId: number, quantity = 1, productPackId?: number | null) {
  return request<{ success: boolean; data: Cart }>("/me/cart/items", {
    method: "POST",
    body: JSON.stringify({ product_id: productId, quantity, product_pack_id: productPackId }),
  });
}

export function updateCartItem(itemId: number, quantity: number) {
  return request<{ success: boolean; data: Cart }>(`/me/cart/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(itemId: number) {
  return request<{ success: boolean; message: string }>(`/me/cart/items/${itemId}`, {
    method: "DELETE",
  });
}

export function clearCart() {
  return request<{ success: boolean; message: string }>("/me/cart", {
    method: "DELETE",
  });
}

export function applyCoupon(code: string) {
  return request<{ success: boolean; message: string; data: Cart }>("/me/cart/coupon", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}

export function removeCoupon() {
  return request<{ success: boolean; message: string; data: Cart }>("/me/cart/coupon", {
    method: "DELETE",
  });
}

// ── Addresses ────────────────────────────────────────────────────────────────

export interface UserAddress {
  id: number;
  name: string;
  address_line1: string;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  mobile: string | null;
  is_default: boolean;
}

export function getAddresses() {
  return request<{ success: boolean; data: UserAddress[] }>("/me/addresses");
}

export function createAddress(payload: {
  name: string;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  mobile: string;
  is_default?: boolean;
}) {
  return request<{ success: boolean; data: UserAddress }>("/me/addresses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ── Orders ───────────────────────────────────────────────────────────────────

export interface OrderPayload {
  delivery_address_line1: string;
  delivery_address_line2?: string | null;
  delivery_city: string;
  delivery_state: string;
  delivery_postal_code: string;
  delivery_phone: string;
  payment_method: "cod" | "online" | "upi" | "card";
  notes?: string;
  order_type?: "b2c" | "b2b";
  buyer_gstin?: string;
  source?: "app" | "website";
}

export function placeOrder(payload: OrderPayload) {
  return request<{ success: boolean; data: any }>("/me/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ── Product Image URL Resolver ───────────────────────────────────────────────

export function getProductImageUrl(url: string | null | undefined, productName?: string): string {
  if (!url) return "/images/decor/product_stack.webp";
  
  if (url.includes("laravel.cloud")) {
    const name = productName?.toLowerCase() || "";
    if (name.includes("large") || name.includes("plates large")) {
      return "/images/product/product-01.png";
    }
    if (name.includes("plates")) {
      return "/images/product/product-01.png";
    }
    if (name.includes("platter")) {
      return "/images/product/product-02.png";
    }
    if (name.includes("cutlery")) {
      return "/images/product/product-03.png";
    }
    if (name.includes("bowl")) {
      return "/images/product/product-04.png";
    }
    
    // Fallback based on filename signatures
    if (url.includes("1craTqQwaGKbMjlcG9HZUYAwF6dD6BNKLs1VLCRC")) {
      return "/images/product/product-01.png";
    }
    if (url.includes("PUniHjDQnOQpjd2cswk7zalQpPk9MGq6PaGqbemj")) {
      return "/images/product/product-02.png";
    }
    if (url.includes("bsUTtj6q5vhLUanJfXRSPzjs860PaO2NodMMWbet")) {
      return "/images/product/product-03.png";
    }
    if (url.includes("EAJOnPRpnAgBoKY7cjlkuS2lt7FufJC9kQdt1njP")) {
      return "/images/product/product-04.png";
    }
    if (url.includes("fuhB1ZrAmW9gGUw0FPGM1IS470l2dSU8Sb9tJZvC")) {
      return "/images/product/product-01.png";
    }
  }
  
  return url;
}

export function uploadKycDocumentFileApi(
  vendorId: number,
  documentType: string,
  documentFile: File
) {
  const formData = new FormData();
  formData.append("vendor_id", String(vendorId));
  formData.append("document_type", documentType);
  formData.append("document", documentFile);

  const token = getToken();
  return fetch(`${API_BASE}/vendors/kyc/upload-file`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  }).then(async (res) => {
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw { status: res.status, message: body?.message ?? res.statusText, body };
    }
    return res.json() as Promise<{ success: boolean; data: any }>;
  });
}

export interface ProductReview {
  id: number;
  ratable_type: string;
  ratable_id: number;
  reviewer_id: number;
  rating: number;
  review: string | null;
  review_photos: string[] | null;
  created_at: string;
  reviewer?: {
    id: number;
    name: string;
  };
}

export function getProductRatings(productIdOrSku: number | string) {
  return request<{ success: boolean; data: ProductReview[] }>(`/products/${productIdOrSku}/ratings`);
}

export function submitProductRating(productId: number, rating: number, review?: string) {
  return request<{ success: boolean; data: ProductReview }>("/me/ratings", {
    method: "POST",
    body: JSON.stringify({
      ratable_type: "product",
      ratable_id: productId,
      rating,
      review,
    }),
  });
}

export function getProfileApi() {
  return request<{ success: boolean; data: any }>("/me/profile");
}

export function updateProfileApi(data: any) {
  return request<{ success: boolean; data: any }>("/me/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function getConsumerOrdersApi() {
  return request<{ success: boolean; data: any[] }>("/me/orders");
}

export function getConsumerWishlistApi() {
  return request<{ success: boolean; data: any[] }>("/me/wishlist");
}

export function addToWishlistApi(productId: number) {
  return request<{ success: boolean; message: string }>("/me/wishlist", {
    method: "POST",
    body: JSON.stringify({ product_id: productId }),
  });
}

export function removeFromWishlistApi(productId: number) {
  return request<{ success: boolean; message: string }>(`/me/wishlist/${productId}`, {
    method: "DELETE",
  });
}

// ── Payments ─────────────────────────────────────────────────────────────────

export function initiateRazorpayPayment(orderId: number) {
  return request<{
    success: boolean;
    data: {
      razorpay_order_id: string;
      amount: number;
      currency: string;
      key: string;
    }
  }>(`/me/orders/${orderId}/payments/razorpay/initiate`, {
    method: "POST",
  });
}

export function verifyRazorpayPayment(orderId: number, data: { razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string }) {
  return request<{ success: boolean; message: string }>(`/me/orders/${orderId}/payments/razorpay/verify`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
