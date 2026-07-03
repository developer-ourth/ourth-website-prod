"use client";

import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
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
  const [isBusiness, setIsBusiness] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [gstin, setGstin] = useState("");

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
        const res = await registerApi(
          name.trim(),
          email.trim(),
          password,
          confirmPassword,
          phone.trim() || undefined,
          isBusiness ? "vendor" : "consumer",
          isBusiness ? (gstin.trim() || undefined) : undefined,
          isBusiness ? (businessName.trim() || undefined) : undefined
        );
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
      toast.error(err?.message ?? "Failed to add address.");
    } finally {
      setAddressSubmitting(false);
    }
  };

  // Checkout Handler
  const handleCheckout = async () => {
    const activeAddress = addresses.find((a) => a.id === selectedAddressId);
    if (!activeAddress) {
      toast.error("Please select a delivery address.");
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
        order_type: user?.role === "vendor" ? "b2b" : "b2c",
      });
      await clearCart();
      toast.success("Order placed successfully!");
      router.replace("/client/dashboard");
    } catch (err: any) {
      setCheckoutError(err?.message ?? "Checkout failed.");
    } finally {
      setCheckoutSubmitting(false);
    }
  };

  const items = cart?.items ?? [];
  const total = cart?.total_amount ?? "0.00";

  return (
    <main className="min-h-screen bg-[#FAF8F3] pt-36 pb-24 font-['IBM_Plex_Sans']">
      <div className="mx-auto max-w-[1625px] px-4 lg:px-[146px] w-full">
        {/* Title */}
        <h1 
          className="font-semibold text-[48px] leading-[62px] mb-10 text-left"
          style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "#2B4D0E" }}
        >
          Cart
        </h1>

        {items.length === 0 ? (
          <div className="w-full max-w-[1039px] bg-white/85 backdrop-blur-xl border border-white/40 shadow-lg rounded-[5px] p-10 text-center space-y-6 mx-auto">
            <span className="text-6xl block">🛒</span>
            <h2 className="text-[32px] font-bold text-[#2C1F13]" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>Your cart is empty</h2>
            <p className="text-[20px] text-gray-600" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
              Browse our tableware products and add items to your cart to purchase them.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-[30px] bg-[#25784C] text-white font-semibold border-[1.5px] border-black hover:scale-105 transition text-[24px]"
              style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start w-full">
            {/* Left Column: Cart Items & Addresses */}
            <div className="lg:col-span-7 space-y-8 w-full">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="w-full bg-white/85 backdrop-blur-xl border border-white/40 shadow-lg rounded-[5px] p-4 flex flex-col md:flex-row gap-4 items-center relative"
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-4 right-4 text-xs font-semibold text-red-500 hover:text-red-700 transition"
                  >
                    Remove
                  </button>

                  {/* Image */}
                  <div className="w-[120px] h-[120px] border-[1.5px] border-black rounded-[5px] bg-white flex items-center justify-center p-2 shadow-[0px_4px_4px_rgba(0,0,0,0.1)] flex-shrink-0">
                    <img
                      src={getProductImageUrl(item.product?.primary_image_url, item.product?.name)}
                      alt={item.product?.name ?? "Product"}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-grow space-y-3 flex flex-col justify-between h-full py-1 w-full text-center md:text-left">
                    <div>
                      {/* Category Badge */}
                      <span 
                        className="inline-flex px-4 py-1 bg-[#C7E08E] border border-black rounded-[30px] items-center justify-center text-[14px] font-medium text-black"
                        style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                      >
                        {item.product?.category?.name || "Bowls"}
                      </span>
                      {/* Name */}
                      <h3 
                        className="text-black font-semibold text-[20px] leading-[24px] mt-2"
                        style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                      >
                        {item.product?.name ?? "6N Panipuri Bowls"}
                      </h3>
                    </div>
                    {/* Pack Info */}
                    <p 
                      className="text-[16px] text-[#444444] font-normal"
                      style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                    >
                      {item.productPack?.name || "Pack of 10"}
                    </p>
                  </div>

                  {/* Quantity & Price */}
                  <div className="flex flex-col items-center md:items-end justify-between h-full py-1 flex-shrink-0 gap-4 w-full md:w-auto">
                    <span 
                      className="text-black font-semibold text-[24px] leading-[28px]"
                      style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                    >
                      ₹{(parseFloat(item.unit_price) * item.quantity).toFixed(0)}
                    </span>
                    {/* Qty Selector */}
                    <div className="flex items-center justify-between w-[110px] h-[36px] border-[1.5px] border-black rounded-[30px] bg-[#FAF8F3] px-3 ">
                      <button
                        onClick={() => updateQty(item.id, Math.max(1, item.quantity - 1))}
                        className="text-[24px] font-normal text-black pb-0.5 hover:scale-110 active:scale-95 transition flex items-center justify-center"
                        style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                      >
                        -
                      </button>
                      <span className="text-[16px] font-medium text-black" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="text-[24px] font-normal text-black pb-0.5 hover:scale-110 active:scale-95 transition flex items-center justify-center"
                        style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Delivery Addresses & Payment section (if user logged in) */}
              {user && (
                <div className="space-y-6">
                  {/* Address Section */}
                  <div className="w-full bg-white/85 backdrop-blur-xl border border-white/40 shadow-lg rounded-[5px] p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-[32px] font-bold text-[#2B4D0E]" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                        Delivery Address
                      </h3>
                      {!showAddressForm && (
                        <button
                          onClick={() => setShowAddressForm(true)}
                          className="px-4 py-2 bg-[#C7E08E] border-[1.5px] border-black rounded-[30px] text-black font-semibold text-[18px] hover:scale-105 transition"
                        >
                          + Add Address
                        </button>
                      )}
                    </div>

                    {showAddressForm ? (
                      <form onSubmit={handleAddAddress} className="space-y-4 pt-2">
                        <input
                          required
                          value={addrName}
                          onChange={(e) => setAddrName(e.target.value)}
                          placeholder="Recipient Name (e.g. Sahil)"
                          className="w-full rounded-[5px] border-[1.5px] border-black px-4 py-3 text-[18px] bg-[#FAF8F3] outline-none focus:ring-2 focus:ring-[#25784C]"
                        />
                        <input
                          required
                          value={addrLine1}
                          onChange={(e) => setAddrLine1(e.target.value)}
                          placeholder="Address Line 1"
                          className="w-full rounded-[5px] border-[1.5px] border-black px-4 py-3 text-[18px] bg-[#FAF8F3] outline-none focus:ring-2 focus:ring-[#25784C]"
                        />
                        <input
                          value={addrLine2}
                          onChange={(e) => setAddrLine2(e.target.value)}
                          placeholder="Address Line 2 (Optional)"
                          className="w-full rounded-[5px] border-[1.5px] border-black px-4 py-3 text-[18px] bg-[#FAF8F3] outline-none focus:ring-2 focus:ring-[#25784C]"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            required
                            value={addrCity}
                            onChange={(e) => setAddrCity(e.target.value)}
                            placeholder="City"
                            className="rounded-[5px] border-[1.5px] border-black px-4 py-3 text-[18px] bg-[#FAF8F3] outline-none focus:ring-2 focus:ring-[#25784C]"
                          />
                          <input
                            required
                            value={addrState}
                            onChange={(e) => setAddrState(e.target.value)}
                            placeholder="State"
                            className="rounded-[5px] border-[1.5px] border-black px-4 py-3 text-[18px] bg-[#FAF8F3] outline-none focus:ring-2 focus:ring-[#25784C]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            required
                            value={addrPostalCode}
                            onChange={(e) => setAddrPostalCode(e.target.value)}
                            placeholder="Pincode"
                            className="rounded-[5px] border-[1.5px] border-black px-4 py-3 text-[18px] bg-[#FAF8F3] outline-none focus:ring-2 focus:ring-[#25784C]"
                          />
                          <input
                            required
                            value={addrMobile}
                            onChange={(e) => setAddrMobile(e.target.value)}
                            placeholder="Mobile (10 digits)"
                            className="rounded-[5px] border-[1.5px] border-black px-4 py-3 text-[18px] bg-[#FAF8F3] outline-none focus:ring-2 focus:ring-[#25784C]"
                          />
                        </div>

                        <div className="flex gap-4 pt-2">
                          <button
                            type="button"
                            onClick={() => setShowAddressForm(false)}
                            className="flex-1 border-[1.5px] border-black py-3 rounded-[30px] text-[18px] font-semibold text-black bg-[#FAF8F3] "
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={addressSubmitting}
                            className="flex-1 bg-[#25784C] text-white py-3 rounded-[30px] text-[18px] font-semibold border-[1.5px] border-black "
                          >
                            Save Address
                          </button>
                        </div>
                      </form>
                    ) : addresses.length === 0 ? (
                      <p className="text-gray-500 py-4 text-center text-[20px]" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                        No delivery addresses found. Add one to complete checkout.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {addresses.map((addr) => (
                          <label
                            key={addr.id}
                            className={`flex items-start gap-4 p-4 rounded-[5px] border-[1.5px] border-black transition duration-200 cursor-pointer ${
                              selectedAddressId === addr.id
                                ? "bg-[#C7E08E]"
                                : "bg-[#FAF8F3]"
                            }`}
                          >
                            <input
                              type="radio"
                              name="address"
                              checked={selectedAddressId === addr.id}
                              onChange={() => setSelectedAddressId(addr.id)}
                              className="mt-1.5 h-5 w-5 accent-black"
                            />
                            <div className="text-[18px] space-y-1 text-black" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                              <span className="font-bold text-[22px] block">
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

                  {/* Payment Method Section */}
                  <div className="w-full bg-white/85 backdrop-blur-xl border border-white/40 shadow-lg rounded-[5px] p-6">
                    <h3 className="text-[32px] font-bold text-[#2B4D0E] mb-6" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                      Payment Method
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setPaymentMethod("cod")}
                        className={`flex flex-col items-center justify-center p-4 rounded-[5px] transition duration-200 ${
                          paymentMethod === "cod"
                            ? "bg-[#C7E08E] text-black font-semibold"
                            : "bg-[#FAF8F3] text-gray-700"
                        }`}
                        style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "20px" }}
                      >
                        <span className="text-3xl mb-1">💵</span>
                        <span>Cash on Delivery</span>
                      </button>
                      <button
                        onClick={() => setPaymentMethod("online")}
                        className={`flex flex-col items-center justify-center p-4 rounded-[5px] transition duration-200 ${
                          paymentMethod === "online"
                            ? "bg-[#C7E08E] text-black font-semibold"
                            : "bg-[#FAF8F3] text-gray-700"
                        }`}
                        style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "20px" }}
                      >
                        <span className="text-3xl mb-1">💳</span>
                        <span>UPI / Paytm</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Summary Card or Auth Panel */}
            <div className="lg:col-span-5 space-y-8 w-full">
              {!user ? (
                /* Auth Form (if not logged in) */
                <div className="w-full bg-white/85 backdrop-blur-xl border border-white/40 shadow-lg rounded-[5px] p-6">
                  <div className="flex border-b border-black mb-6">
                    <button
                      onClick={() => { setAuthMode("login"); setAuthError(""); }}
                      className={`flex-1 pb-4 text-center font-bold border-b-[3px] text-[20px] transition duration-200 ${
                        authMode === "login"
                          ? "border-black text-black"
                          : "border-transparent text-gray-400"
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => { setAuthMode("register"); setAuthError(""); }}
                      className={`flex-1 pb-4 text-center font-bold border-b-[3px] text-[20px] transition duration-200 ${
                        authMode === "register"
                          ? "border-black text-black"
                          : "border-transparent text-gray-400"
                      }`}
                    >
                      Sign Up
                    </button>
                  </div>

                  <h3 className="text-[24px] font-bold text-[#2B4D0E] mb-6" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                    {authMode === "login" ? "Sign in to place order" : "Create a consumer account"}
                  </h3>

                  {authError && (
                    <div className="rounded-[5px] bg-red-50 border border-red-500 px-4 py-3 text-sm text-red-600 mb-6">
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
                          className="w-full rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#25784C] transition"
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
                        className="w-full rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#25784C] transition"
                      />
                    </div>

                    {authMode === "register" && (
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-gray-500 uppercase">
                          Mobile Number (optional)
                        </label>
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 9876543210"
                          className="w-full rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#25784C] transition"
                        />
                      </div>
                    )}

                    {authMode === "register" && (
                      <div className="flex items-center gap-2 py-1">
                        <input
                          type="checkbox"
                          id="isBusiness"
                          checked={isBusiness}
                          onChange={(e) => setIsBusiness(e.target.checked)}
                          className="h-4 w-4 rounded border-black text-black focus:ring-black accent-black cursor-pointer"
                        />
                        <label htmlFor="isBusiness" className="text-sm font-semibold text-gray-700 cursor-pointer select-none">
                          I am registering as a business
                        </label>
                      </div>
                    )}

                    {authMode === "register" && isBusiness && (
                      <>
                        <div>
                          <label className="mb-1.5 block text-xs font-bold text-gray-500 uppercase">
                            Business Name
                          </label>
                          <input
                            type="text"
                            required
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            placeholder="Acme Corp"
                            className="w-full rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#25784C] transition"
                          />
                        </div>

                        <div>
                          <label className="mb-1.5 block text-xs font-bold text-gray-500 uppercase">
                            GSTIN (optional)
                          </label>
                          <input
                            type="text"
                            value={gstin}
                            onChange={(e) => setGstin(e.target.value)}
                            placeholder="22AAAAA0000A1Z5"
                            className="w-full rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#25784C] transition"
                          />
                        </div>
                      </>
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
                        className="w-full rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#25784C] transition"
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
                          className="w-full rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#25784C] transition"
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={authSubmitting}
                      className="w-full rounded-[30px] bg-[#25784C] px-6 py-3.5 font-bold text-white border-[1.5px] border-black hover:opacity-90 active:translate-y-[1px] disabled:opacity-60 transition text-[18px]"
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
                /* Checkout Summary Card (if logged in) */
                <div className="w-full max-w-[546px] bg-white/85 backdrop-blur-xl border border-white/40 shadow-lg rounded-[5px] p-6 space-y-6 ml-auto">
                  {/* Title */}
                  <h2 
                    className="text-[40px] font-semibold text-[#2B4D0E] leading-none mb-2"
                    style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                  >
                    Summary
                  </h2>

                  {/* Total Items pill */}
                  <div className="w-full h-[47px] rounded-[30px] bg-[#FAF8F3] px-6 flex items-center justify-between ">
                    <span className="text-[24px] text-[#444444]" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>Total Items</span>
                    <span className="text-[24px] font-semibold text-black" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                      {items.reduce((sum, item) => sum + item.quantity, 0) < 10 ? `0${items.reduce((sum, item) => sum + item.quantity, 0)}` : items.reduce((sum, item) => sum + item.quantity, 0)} items
                    </span>
                  </div>

                  {/* Sub Total pill */}
                  <div className="w-full h-[47px] rounded-[30px] bg-[#FAF8F3] px-6 flex items-center justify-between ">
                    <span className="text-[24px] text-[#444444]" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>Sub Total</span>
                    <span className="text-[24px] font-semibold text-black" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>₹{parseFloat(total).toFixed(0)}</span>
                  </div>

                  {/* Est Delivery pill */}
                  <div className="w-full h-[47px] rounded-[30px] bg-[#FAF8F3] px-6 flex items-center justify-between ">
                    <span className="text-[24px] text-[#444444]" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>Est. Delivery</span>
                    <span className="text-[24px] font-semibold text-black" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>₹30</span>
                  </div>

                  {/* Taxes pill */}
                  <div className="w-full h-[47px] rounded-[30px] bg-[#FAF8F3] px-6 flex items-center justify-between ">
                    <span className="text-[24px] text-[#444444]" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>Taxes</span>
                    <span className="text-[24px] font-semibold text-black" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>₹15</span>
                  </div>

                  {/* Discount pill */}
                  <div className="w-full h-[47px] rounded-[30px] bg-[#FAF8F3] px-6 flex items-center justify-between ">
                    <span className="text-[24px] text-[#444444]" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>Discount</span>
                    <span className="text-[24px] font-semibold text-black" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>-0.00</span>
                  </div>

                  {/* Dashed Line */}
                  <div className="border-t-[1.5px] border-dashed border-black my-4" />

                  {/* Final Payment pill */}
                  <div className="w-full h-[47px] rounded-[30px] bg-[#FAF8F3] px-6 flex items-center justify-between ">
                    <span className="text-[24px] text-[#444444]" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>Final Payment</span>
                    <span className="text-[24px] font-semibold text-black" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                      ₹{(parseFloat(total) + 30 + 15).toFixed(0)}
                    </span>
                  </div>

                  {/* Promo Code Input */}
                  <div className="w-full h-[64px] rounded-[30px] bg-[#FAF8F3] pl-6 pr-2 flex items-center justify-between ">
                    <input
                      type="text"
                      placeholder="Enter Promo Code"
                      className="bg-transparent border-none outline-none text-[24px] text-black placeholder-gray-400 w-[60%]"
                      style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                    />
                    <button 
                      type="button"
                      className="w-[111px] h-[48px] rounded-[30px] bg-[#C7E08E] text-black font-semibold text-[24px] flex items-center justify-center hover:scale-105 active:scale-95 transition"
                      style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                    >
                      Apply
                    </button>
                  </div>

                  {/* Dashed Line */}
                  <div className="border-t-[1.5px] border-dashed border-black my-4" />

                  {checkoutError && (
                    <div className="rounded-[5px] bg-red-50 border border-red-500 px-4 py-3 text-sm text-red-600">
                      {checkoutError}
                    </div>
                  )}

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={checkoutSubmitting || addresses.length === 0}
                    className="w-full h-[47px] rounded-[30px] bg-[#25784C] text-white font-semibold text-[24px] flex items-center justify-center hover:opacity-95 transition disabled:opacity-50 active:translate-y-[1px] "
                    style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                  >
                    {checkoutSubmitting ? "Placing Order..." : "CHECKOUT"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
