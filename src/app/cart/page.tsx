"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/app/(website)/_components/Navbar";
import Footer from "@/app/(website)/_components/Footer";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import {
  getAddresses,
  createAddress,
  placeOrder,
  registerApi,
  setToken,
  getProductImageUrl,
  type UserAddress,
} from "@/lib/api";

export default function CartPage() {
  const router = useRouter();
  const { user, login } = useAuth();
  const { cart, loading, fetchCart, updateQty, removeFromCart, clearCart } = useCart();

  // Auth Form states
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Address states
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addrName, setAddrName] = useState("");
  const [addrLine1, setAddrLine1] = useState("");
  const [addrLine2, setAddrLine2] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrState, setAddrState] = useState("");
  const [addrPostalCode, setAddrPostalCode] = useState("");
  const [addrMobile, setAddrMobile] = useState("");
  const [addressSubmitting, setAddressSubmitting] = useState(false);

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [checkoutSubmitting, setCheckoutSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  // Load addresses when user logs in
  const loadAddresses = useCallback(async () => {
    if (!user) return;
    try {
      const res = await getAddresses();
      setAddresses(res.data);
      if (res.data.length > 0) {
        const defaultAddr = res.data.find((a) => a.is_default);
        setSelectedAddressId(defaultAddr ? defaultAddr.id : res.data[0].id);
      }
    } catch {
      setAddresses([]);
    }
  }, [user]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  // Auth Submit Handler
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSubmitting(true);

    try {
      if (authMode === "login") {
        await login(email.trim(), password);
      } else {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }
        if (password.length < 8) {
          throw new Error("Password must be at least 8 characters.");
        }
        const res = await registerApi(name.trim(), email.trim(), password, confirmPassword, phone.trim() || undefined);
        setToken(res.data.token);
        localStorage.setItem("ourth_auth_user", JSON.stringify({ ...res.data.user }));
        // Refresh auth state by reloading window or setting manually
        window.location.reload();
      }
    } catch (err: any) {
      setAuthError(err?.message ?? "Authentication failed.");
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Add Address Handler
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressSubmitting(true);
    try {
      const res = await createAddress({
        name: addrName.trim(),
        address_line1: addrLine1.trim(),
        address_line2: addrLine2.trim() || null,
        city: addrCity.trim(),
        state: addrState.trim(),
        postal_code: addrPostalCode.trim(),
        mobile: addrMobile.trim(),
        is_default: addresses.length === 0, // make default if first address
      });
      setAddresses((prev) => [...prev, res.data]);
      setSelectedAddressId(res.data.id);
      setShowAddressForm(false);
      // Reset form
      setAddrName("");
      setAddrLine1("");
      setAddrLine2("");
      setAddrCity("");
      setAddrState("");
      setAddrPostalCode("");
      setAddrMobile("");
    } catch (err: any) {
      alert(err?.message ?? "Failed to add address.");
    } finally {
      setAddressSubmitting(false);
    }
  };

  // Checkout Handler
  const handleCheckout = async () => {
    const activeAddress = addresses.find((a) => a.id === selectedAddressId);
    if (!activeAddress) {
      alert("Please select a delivery address.");
      return;
    }

    setCheckoutSubmitting(true);
    setCheckoutError("");
    try {
      await placeOrder({
        delivery_address_line1: activeAddress.address_line1,
        delivery_address_line2: activeAddress.address_line2,
        delivery_city: activeAddress.city ?? "",
        delivery_state: activeAddress.state ?? "",
        delivery_postal_code: activeAddress.postal_code ?? "",
        delivery_phone: activeAddress.mobile ?? "",
        payment_method: paymentMethod === "cod" ? "cod" : "upi",
      });
      await clearCart();
      alert("Order placed successfully!");
      router.replace("/dashboards/consumer/orders");
    } catch (err: any) {
      setCheckoutError(err?.message ?? "Checkout failed.");
    } finally {
      setCheckoutSubmitting(false);
    }
  };

  const items = cart?.items ?? [];
  const total = cart?.total_amount ?? "0.00";

  return (
    <main className="min-h-screen bg-[#F5F8F3]">
      <Navbar />

      <div className="mx-auto max-w-[1440px] px-8 pt-36 pb-24">
        <h1 className="text-4xl font-extrabold text-[#0D3A27] mb-8">Checkout</h1>

        {items.length === 0 ? (
          <div className="rounded-[36px] bg-[#FAF7F2] border border-white/40 p-16 text-center space-y-6 max-w-xl mx-auto shadow-[0_15px_35px_rgba(44,74,26,0.06)]">
            <span className="text-6xl block">🛒</span>
            <h2 className="text-2xl font-bold text-[#2C1F13]">Your cart is empty</h2>
            <p className="text-sm text-[#2C1F13]/70">
              Browse our tableware products and add items to your cart to purchase them.
            </p>
            <Link
              href="/products"
              className="inline-block bg-[#25784C] text-[#D8EFE0] px-8 py-3 rounded-2xl font-bold hover:bg-[#1a5b36] transition duration-200"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Cart Items & Quantity */}
            <div className="lg:col-span-7 space-y-6">
              <div className="rounded-[36px] bg-white border border-white/40 p-8 shadow-[0_15px_35px_rgba(44,74,26,0.06)] space-y-6">
                <h2 className="text-2xl font-extrabold text-[#0D3A27] border-b border-gray-100 pb-4">
                  Shopping Cart ({items.length} items)
                </h2>

                <div className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <div key={item.id} className="py-6 flex gap-6 items-center">
                      <div className="h-20 w-20 bg-[#FAF7F2] rounded-2xl flex items-center justify-center p-2 border border-gray-100 relative">
                        {getProductImageUrl(item.product?.primary_image_url, item.product?.name) ? (
                          <img
                            src={getProductImageUrl(item.product?.primary_image_url, item.product?.name)}
                            alt={item.product?.name ?? "Product"}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <span className="text-3xl">🌿</span>
                        )}
                      </div>

                      <div className="flex-1 space-y-1">
                        <h3 className="font-bold text-[#2C1F13] text-lg">
                          {item.product?.name ?? "Product"}
                        </h3>
                        {item.productPack && (
                          <span className="inline-block bg-[#E2EFE0] text-[#0D3A27] text-xs font-bold px-2.5 py-1 rounded-lg">
                            {item.productPack.name}
                          </span>
                        )}
                        <span className="block text-sm font-semibold text-[#0D3A27]">
                          ₹{parseFloat(item.unit_price).toFixed(2)} each
                        </span>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-2.5 py-1.5 bg-white">
                          <button
                            onClick={() => updateQty(item.id, Math.max(1, item.quantity - 1))}
                            className="text-[#2C1F13] hover:text-[#25784C] font-bold px-1"
                          >
                            −
                          </button>
                          <span className="font-bold text-[#2C1F13] min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            className="text-[#2C1F13] hover:text-[#25784C] font-bold px-1"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs font-semibold text-red-500 hover:text-red-700 transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Checkout details or Auth */}
            <div className="lg:col-span-5 space-y-6">
              {!user ? (
                // Authentication Section (if not logged in)
                <div className="rounded-[36px] bg-[#FAF7F2] border border-white/40 p-8 shadow-[0_15px_35px_rgba(44,74,26,0.06)] space-y-6">
                  <div className="flex border-b border-gray-200">
                    <button
                      onClick={() => { setAuthMode("login"); setAuthError(""); }}
                      className={`flex-1 pb-4 text-center font-bold border-b-2 text-sm transition duration-200 ${
                        authMode === "login"
                          ? "border-[#25784C] text-[#0D3A27]"
                          : "border-transparent text-gray-400"
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => { setAuthMode("register"); setAuthError(""); }}
                      className={`flex-1 pb-4 text-center font-bold border-b-2 text-sm transition duration-200 ${
                        authMode === "register"
                          ? "border-[#25784C] text-[#0D3A27]"
                          : "border-transparent text-gray-400"
                      }`}
                    >
                      Sign Up
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-[#0D3A27]">
                    {authMode === "login" ? "Sign in to place order" : "Create a consumer account"}
                  </h3>

                  {authError && (
                    <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                      {authError}
                    </div>
                  )}

                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    {authMode === "register" && (
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-gray-500 uppercase">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Asteria Xing"
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary transition"
                        />
                      </div>
                    )}

                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-gray-500 uppercase">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary transition"
                      />
                    </div>

                    {authMode === "register" && (
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-gray-500 uppercase">
                          Mobile Number (optional)
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 9876543210"
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary transition"
                        />
                      </div>
                    )}

                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-gray-500 uppercase">
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 8 characters"
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary transition"
                      />
                    </div>

                    {authMode === "register" && (
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-gray-500 uppercase">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repeat password"
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary transition"
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={authSubmitting}
                      className="w-full rounded-2xl bg-[#25784C] px-6 py-3.5 font-bold text-[#D8EFE0] hover:opacity-90 disabled:opacity-60 transition"
                    >
                      {authSubmitting
                        ? "Please wait..."
                        : authMode === "login"
                        ? "Sign In"
                        : "Create Account"}
                    </button>
                  </form>
                </div>
              ) : (
                // Checkout Panel (if logged in)
                <div className="space-y-6">
                  {/* Shipping Addresses card */}
                  <div className="rounded-[36px] bg-white border border-white/40 p-8 shadow-[0_15px_35px_rgba(44,74,26,0.06)] space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-extrabold text-[#0D3A27]">Delivery Address</h3>
                      {!showAddressForm && (
                        <button
                          onClick={() => setShowAddressForm(true)}
                          className="text-xs font-bold text-[#25784C] hover:underline"
                        >
                          + Add Address
                        </button>
                      )}
                    </div>

                    {showAddressForm ? (
                      <form onSubmit={handleAddAddress} className="space-y-3 pt-2">
                        <input
                          required
                          value={addrName}
                          onChange={(e) => setAddrName(e.target.value)}
                          placeholder="Recipient Name (e.g. Sahil)"
                          className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm"
                        />
                        <input
                          required
                          value={addrLine1}
                          onChange={(e) => setAddrLine1(e.target.value)}
                          placeholder="Address Line 1"
                          className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm"
                        />
                        <input
                          value={addrLine2}
                          onChange={(e) => setAddrLine2(e.target.value)}
                          placeholder="Address Line 2 (Optional)"
                          className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            required
                            value={addrCity}
                            onChange={(e) => setAddrCity(e.target.value)}
                            placeholder="City"
                            className="rounded-xl border border-gray-200 px-3.5 py-2 text-sm"
                          />
                          <input
                            required
                            value={addrState}
                            onChange={(e) => setAddrState(e.target.value)}
                            placeholder="State"
                            className="rounded-xl border border-gray-200 px-3.5 py-2 text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            required
                            value={addrPostalCode}
                            onChange={(e) => setAddrPostalCode(e.target.value)}
                            placeholder="Pincode"
                            className="rounded-xl border border-gray-200 px-3.5 py-2 text-sm"
                          />
                          <input
                            required
                            value={addrMobile}
                            onChange={(e) => setAddrMobile(e.target.value)}
                            placeholder="Mobile (10 digits)"
                            className="rounded-xl border border-gray-200 px-3.5 py-2 text-sm"
                          />
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setShowAddressForm(false)}
                            className="flex-1 border border-gray-200 py-2.5 rounded-xl text-xs font-bold text-gray-500"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={addressSubmitting}
                            className="flex-1 bg-[#25784C] text-[#D8EFE0] py-2.5 rounded-xl text-xs font-bold"
                          >
                            Save Address
                          </button>
                        </div>
                      </form>
                    ) : addresses.length === 0 ? (
                      <p className="text-sm text-gray-400 py-4 text-center">
                        No delivery addresses found. Add one to complete checkout.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {addresses.map((addr) => (
                          <label
                            key={addr.id}
                            className={`flex items-start gap-3 p-3.5 rounded-2xl border transition duration-200 cursor-pointer ${
                              selectedAddressId === addr.id
                                ? "bg-[#FAF7F2] border-[#25784C] shadow-sm"
                                : "bg-white border-gray-100 hover:border-gray-300"
                            }`}
                          >
                            <input
                              type="radio"
                              name="address"
                              checked={selectedAddressId === addr.id}
                              onChange={() => setSelectedAddressId(addr.id)}
                              className="mt-1 accent-[#25784C]"
                            />
                            <div className="text-xs space-y-0.5 text-gray-600">
                              <span className="font-bold text-[#2C1F13] text-sm block">
                                {addr.name}
                              </span>
                              <span>{addr.address_line1}</span>
                              {addr.address_line2 && <span>, {addr.address_line2}</span>}
                              <span className="block">
                                {addr.city}, {addr.state} - {addr.postal_code}
                              </span>
                              <span className="block font-semibold">Mobile: {addr.mobile}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Payment Method Selector */}
                  <div className="rounded-[36px] bg-white border border-white/40 p-8 shadow-[0_15px_35px_rgba(44,74,26,0.06)] space-y-4">
                    <h3 className="text-xl font-extrabold text-[#0D3A27]">Payment Method</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setPaymentMethod("cod")}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition duration-200 ${
                          paymentMethod === "cod"
                            ? "bg-[#FAF7F2] border-[#25784C] text-[#0D3A27] font-bold"
                            : "bg-white border-gray-100 text-gray-500 hover:border-gray-300"
                        }`}
                      >
                        <span className="text-2xl mb-1">💵</span>
                        <span className="text-xs">Cash on Delivery</span>
                      </button>
                      <button
                        onClick={() => setPaymentMethod("online")}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition duration-200 ${
                          paymentMethod === "online"
                            ? "bg-[#FAF7F2] border-[#25784C] text-[#0D3A27] font-bold"
                            : "bg-white border-gray-100 text-gray-500 hover:border-gray-300"
                        }`}
                      >
                        <span className="text-2xl mb-1">💳</span>
                        <span className="text-xs">UPI / Paytm</span>
                      </button>
                    </div>
                  </div>

                  {/* Order Summary & Place Order */}
                  <div className="rounded-[36px] bg-[#FAF7F2] border border-white/40 p-8 shadow-[0_15px_35px_rgba(44,74,26,0.06)] space-y-4">
                    <h3 className="text-xl font-extrabold text-[#0D3A27] border-b border-gray-200 pb-2">
                      Order Summary
                    </h3>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Items Total</span>
                        <span className="font-semibold text-[#2C1F13]">₹{total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery</span>
                        <span className="font-bold text-green-600">FREE</span>
                      </div>
                      <div className="flex justify-between text-lg font-black text-[#0D3A27] pt-2 border-t border-gray-200">
                        <span>Total Amount</span>
                        <span>₹{total}</span>
                      </div>
                    </div>

                    {checkoutError && (
                      <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                        {checkoutError}
                      </div>
                    )}

                    <button
                      onClick={handleCheckout}
                      disabled={checkoutSubmitting || addresses.length === 0}
                      className="w-full rounded-2xl bg-[#25784C] py-4 text-[#D8EFE0] font-bold shadow-sm hover:bg-[#1a5b36] transition disabled:opacity-50"
                    >
                      {checkoutSubmitting ? "Placing Order..." : "Confirm & Place Order"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
