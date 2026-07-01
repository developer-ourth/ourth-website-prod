"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  getProfileApi, 
  updateProfileApi, 
  getConsumerOrdersApi,
  getConsumerWishlistApi
} from "@/lib/api";

type Tab = "profile" | "orders" | "history" | "address" | "support";

export default function ClientDashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [profileData, setProfileData] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loadingContent, setLoadingContent] = useState(false);
  
  // Profile update form state
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updateMsg, setUpdateMsg] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Expanded subtabs inside Profile
  const [activeSubTab, setActiveSubTab] = useState<string>("login_security");

  // History tab sub-filters
  const [historyFilter, setHistoryFilter] = useState<"successful" | "canceled">("successful");

  // Address Modal state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/client/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      // Fetch profile data
      getProfileApi()
        .then((res) => {
          setProfileData(res.data);
          setEmail(res.data?.email || user.email || "");
          setName(res.data?.name || user.name || "");
          setPhone(res.data?.phone || "");
        })
        .catch(err => console.error("Error fetching profile:", err));

      // Fetch orders data
      getConsumerOrdersApi()
        .then((res) => {
          setOrders(res.data || []);
        })
        .catch(err => console.error("Error fetching orders:", err));

      // Fetch wishlist
      getConsumerWishlistApi()
        .then((res) => {
          setWishlist(res.data || []);
        })
        .catch(err => console.error("Error fetching wishlist:", err));
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF8F3]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#76A52E] border-t-transparent" />
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateMsg("");
    setUpdateError("");
    setSubmitting(true);

    try {
      const payload: any = {
        name,
        email,
        phone,
      };
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        payload.current_password = currentPassword;
        payload.password = newPassword;
        payload.password_confirmation = confirmPassword;
      }

      await updateProfileApi(payload);
      setUpdateMsg("Profile updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setUpdateError(err?.message || "Failed to update profile settings.");
    } finally {
      setSubmitting(false);
    }
  };

  const activeOrders = orders.filter(o => o.status !== "delivered" && o.status !== "cancelled");
  const completedOrders = orders.filter(o => o.status === "delivered");
  const canceledOrders = orders.filter(o => o.status === "cancelled");

  return (
    <>
    <main className="min-h-screen pt-36 pb-24 px-4 lg:px-[146px] bg-[#FAF8F3]">
      <div className="max-w-[1625px] mx-auto">
        
        {/* Title */}
        <div className="flex justify-between items-center mb-8">
          <h1 
            className="text-5xl font-semibold text-[#5E3A16]"
            style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
          >
            Account
          </h1>
          <button
            onClick={() => logout().then(() => router.push("/"))}
            className="px-6 py-2 rounded-[5px] bg-[#FAF8F3] hover:bg-red-50 text-sm font-bold hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000000] transition-all"
          >
            Sign Out
          </button>
        </div>

        {/* Tab Row (Neo-brutalist custom tab buttons) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-6 mb-12">
          {[
            { id: "profile", label: "Profile" },
            { id: "orders", label: "Orders" },
            { id: "history", label: "History" },
            { id: "address", label: "Address Book" },
            { id: "support", label: "Support" }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`w-full lg:w-[252px] h-[84px] text-xl lg:text-2xl font-normal text-black rounded-[5px] flex items-center justify-center transition-all backdrop-blur-md ${
                  isActive 
                    ? "bg-white shadow-md text-[#2B4D0E] font-medium" 
                    : "bg-white/60 shadow-sm hover:bg-white/80"
                }`}
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dashboard Content Container */}
        <div className="space-y-6">
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column Stacked Menu Items */}
              <div className="lg:col-span-6 space-y-6 w-full">
                
                {/* Login & Security Accordion/Selector */}
                <button
                  onClick={() => setActiveSubTab("login_security")}
                  className={`w-full h-[84px] text-[24px] font-normal text-black text-left px-8 rounded-[5px] flex items-center justify-between transition-all backdrop-blur-md ${
                    activeSubTab === "login_security"
                      ? "bg-white shadow-md text-[#2B4D0E] font-medium"
                      : "bg-white/60 shadow-sm hover:bg-white/80"
                  }`}
                  style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                >
                  <span>Login & Security</span>
                  <span>{activeSubTab === "login_security" ? "▼" : "▶"}</span>
                </button>

                {/* Payment Options Selector */}
                <button
                  onClick={() => setActiveSubTab("payment_options")}
                  className={`w-full h-[84px] text-[24px] font-normal text-black text-left px-8 rounded-[5px] flex items-center justify-between transition-all backdrop-blur-md ${
                    activeSubTab === "payment_options"
                      ? "bg-white shadow-md text-[#2B4D0E] font-medium"
                      : "bg-white/60 shadow-sm hover:bg-white/80"
                  }`}
                  style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                >
                  <span>Payment Options</span>
                  <span>{activeSubTab === "payment_options" ? "▼" : "▶"}</span>
                </button>

                {/* Your Wishlist Selector */}
                <button
                  onClick={() => setActiveSubTab("wishlist")}
                  className={`w-full h-[84px] text-[24px] font-normal text-black text-left px-8 rounded-[5px] flex items-center justify-between transition-all backdrop-blur-md ${
                    activeSubTab === "wishlist"
                      ? "bg-white shadow-md text-[#2B4D0E] font-medium"
                      : "bg-white/60 shadow-sm hover:bg-white/80"
                  }`}
                  style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                >
                  <span>Your Wishlist</span>
                  <span>{activeSubTab === "wishlist" ? "▼" : "▶"}</span>
                </button>
              </div>

              {/* Right Column Contextual Form Card */}
              <div className="lg:col-span-6 w-full">
                
                {activeSubTab === "login_security" && (
                  <div className="rounded-[5px] bg-white/85 backdrop-blur-xl p-8 shadow-lg">
                    <h3 className="text-2xl font-bold text-black mb-6" style={{ fontFamily: "var(--font-poppins), Poppins" }}>
                      Security Settings
                    </h3>
                    
                    {updateMsg && (
                      <div className="mb-4 p-3 bg-green-100 border border-green-500 text-green-700 font-bold rounded">
                        {updateMsg}
                      </div>
                    )}
                    {updateError && (
                      <div className="mb-4 p-3 bg-red-100 border border-red-500 text-red-700 font-bold rounded">
                        {updateError}
                      </div>
                    )}

                    <form onSubmit={handleUpdateProfile} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-black mb-1">Email ID</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-[5px] bg-white px-4 py-2.5 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-black mb-1">Number</label>
                          <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Add phone number"
                            className="w-full rounded-[5px] bg-white px-4 py-2.5 text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-black mb-1">Full Name</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full rounded-[5px] bg-white px-4 py-2.5 text-sm"
                        />
                      </div>

                      <div className="border-t border-black/10 pt-4 mt-4 space-y-4">
                        <h4 className="text-lg font-bold text-black">Update Password (Optional)</h4>
                        <div>
                          <label className="block text-sm font-bold text-black mb-1">Current Password</label>
                          <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full rounded-[5px] bg-white px-4 py-2.5 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-black mb-1">New Password</label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New password"
                            className="w-full rounded-[5px] bg-white px-4 py-2.5 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-black mb-1">Re-enter New Password</label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            className="w-full rounded-[5px] bg-white px-4 py-2.5 text-sm"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-[200px] h-[50px] rounded-[30px] bg-[#E8A33A] text-black font-bold text-lg flex items-center justify-center hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000000]"
                        >
                          {submitting ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {activeSubTab === "payment_options" && (
                  <div className="rounded-[5px] bg-white/85 backdrop-blur-xl p-8 shadow-lg space-y-4">
                    <h3 className="text-2xl font-bold text-black" style={{ fontFamily: "var(--font-poppins), Poppins" }}>
                      Payment Methods
                    </h3>
                    <p className="text-gray-600">Saved credit cards and UPI options appear here.</p>
                    <div className="p-4 rounded-[5px] bg-[#E8F0D8] font-bold text-sm">
                      🔒 Secured Payments by Razorpay
                    </div>
                  </div>
                )}

                {activeSubTab === "wishlist" && (
                  <div className="rounded-[5px] bg-white/85 backdrop-blur-xl p-8 shadow-lg space-y-4">
                    <h3 className="text-2xl font-bold text-black" style={{ fontFamily: "var(--font-poppins), Poppins" }}>
                      Your Wishlist ({wishlist.length})
                    </h3>
                    {wishlist.length === 0 ? (
                      <p className="text-gray-600">You haven't bookmarked any products yet.</p>
                    ) : (
                      <div className="space-y-4">
                        {wishlist.map((item) => (
                          <div key={item.id} className="flex justify-between items-center p-4 border border-black/10 rounded bg-white">
                            <div>
                              <p className="font-bold text-black">{item.product?.name || "Leaf Product"}</p>
                              <p className="text-sm text-[#4C7A1A]">₹{item.product?.price ?? "99"}</p>
                            </div>
                            <button 
                              onClick={() => router.push(`/products/${item.product_id}`)}
                              className="px-4 py-1.5 bg-[#76A52E] text-white text-xs font-bold rounded border border-black"
                            >
                              View Item
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === "orders" && (
            <div className="rounded-[5px] bg-white/85 backdrop-blur-xl p-8 shadow-lg space-y-6">
              <h2 className="text-3xl font-bold text-black" style={{ fontFamily: "var(--font-poppins)" }}>
                Active Orders ({activeOrders.length})
              </h2>

              {activeOrders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 font-semibold mb-4">No active orders right now.</p>
                  <button 
                    onClick={() => router.push("/products")}
                    className="px-6 py-2.5 bg-[#76A52E] text-white font-bold rounded-[30px] "
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {activeOrders.map((order) => (
                    <div key={order.id} className="p-6 rounded-[5px] bg-[#E8F0D8] space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between border-b border-black/10 pb-4">
                        <div>
                          <p className="text-xs text-gray-700 font-bold uppercase">Order Reference</p>
                          <p className="font-mono text-lg font-bold text-black">#{order.order_code || `ORD-${order.id}`}</p>
                        </div>
                        <div className="mt-2 sm:mt-0 text-left sm:text-right">
                          <p className="text-xs text-gray-700 font-bold uppercase">Status</p>
                          <span className="inline-block px-3 py-1 bg-yellow-100 border border-yellow-500 text-yellow-800 text-xs font-bold rounded-full uppercase mt-1">
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {order.items?.map((item: any) => (
                          <div key={item.id} className="flex justify-between items-center text-sm">
                            <span className="text-gray-800 font-semibold">{item.product?.name} x {item.quantity}</span>
                            <span className="font-bold">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between border-t border-black/10 pt-4 font-bold text-lg text-black">
                        <span>Total Paid</span>
                        <span>₹{order.total_amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* HISTORY TAB */}
          {activeTab === "history" && (
            <div className="rounded-[5px] bg-white/85 backdrop-blur-xl p-8 shadow-lg space-y-6">
              <h2 className="text-3xl font-bold text-black" style={{ fontFamily: "var(--font-poppins)" }}>
                Order History
              </h2>

              {/* History Sub-tabs (Frame 56) */}
              <div className="flex gap-4 border-b border-black/10 pb-4">
                <button
                  onClick={() => setHistoryFilter("successful")}
                  className={`px-6 py-2 rounded-[30px] font-bold text-sm ${
                    historyFilter === "successful" 
                      ? "bg-[#A4CC55] " 
                      : "bg-white hover:bg-gray-100 "
                  }`}
                >
                  Successful
                </button>
                <button
                  onClick={() => setHistoryFilter("canceled")}
                  className={`px-6 py-2 rounded-[30px] font-bold text-sm ${
                    historyFilter === "canceled" 
                      ? "bg-[#A4CC55] " 
                      : "bg-white hover:bg-gray-100 "
                  }`}
                >
                  Canceled
                </button>
              </div>

              {historyFilter === "successful" ? (
                completedOrders.length === 0 ? (
                  <p className="text-gray-500 py-6 text-center font-medium">No past successful transactions found.</p>
                ) : (
                  <div className="space-y-4">
                    {completedOrders.map((order) => (
                      <div key={order.id} className="p-4 border border-black/10 rounded bg-white flex justify-between items-center">
                        <div>
                          <p className="font-bold text-black font-mono">#{order.order_code || `ORD-${order.id}`}</p>
                          <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <span className="text-[#4C7A1A] font-bold">₹{order.total_amount}</span>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                canceledOrders.length === 0 ? (
                  <p className="text-gray-500 py-6 text-center font-medium">No canceled orders found.</p>
                ) : (
                  <div className="space-y-4">
                    {canceledOrders.map((order) => (
                      <div key={order.id} className="p-4 border border-black/10 rounded bg-white flex justify-between items-center">
                        <div>
                          <p className="font-bold text-black font-mono">#{order.order_code || `ORD-${order.id}`}</p>
                          <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <span className="text-red-500 font-bold">Canceled</span>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          )}

          {/* ADDRESS TAB */}
          {activeTab === "address" && (
            <div className="rounded-[5px] bg-white/85 backdrop-blur-xl p-8 shadow-lg space-y-6">
              <h2 className="text-3xl font-bold text-black" style={{ fontFamily: "var(--font-poppins)" }}>
                Address Book
              </h2>
              <p className="text-gray-600">Manage your shipping and billing addresses for quick ordering.</p>
              <div className="p-6 border border-dashed border-black/30 rounded-lg flex flex-col items-center justify-center text-center py-10 bg-white">
                <span className="text-3xl mb-2">📍</span>
                <p className="font-bold text-black mb-4">No addresses saved yet</p>
                <button 
                  onClick={() => setIsAddressModalOpen(true)}
                  className="px-6 py-2 bg-[#76A52E] text-white font-bold rounded-[30px] text-sm"
                >
                  Add New Address
                </button>
              </div>
            </div>
          )}

          {/* SUPPORT TAB */}
          {activeTab === "support" && (
            <div className="rounded-[5px] bg-white/85 backdrop-blur-xl p-8 shadow-lg space-y-6">
              <h2 className="text-3xl font-bold text-black" style={{ fontFamily: "var(--font-poppins)" }}>
                Customer Support
              </h2>
              <p className="text-[#4C7A1A] font-bold">We're here to help you heal the earth, one plate at a time!</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="p-6 rounded-[5px] bg-[#E8F0D8]">
                  <h4 className="font-bold text-black text-lg mb-2">📧 Email Support</h4>
                  <p className="text-sm text-gray-700">Send us a message and we'll reply within 24 hours.</p>
                  <p className="font-bold mt-2 text-black">support@healingourth.com</p>
                </div>
                <div className="p-6 rounded-[5px] bg-[#E8F0D8]">
                  <h4 className="font-bold text-black text-lg mb-2">📞 Phone Support</h4>
                  <p className="text-sm text-gray-700">Talk to our customer care team (9 AM - 6 PM).</p>
                  <p className="font-bold mt-2 text-black">+91 1800-OURTH-CARE</p>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </main>

      {/* ADDRESS MODAL */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-white rounded-[5px] p-8 shadow-xl relative animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-black" style={{ fontFamily: "var(--font-poppins)" }}>Add New Address</h3>
              <button 
                onClick={() => setIsAddressModalOpen(false)} 
                className="text-2xl text-gray-500 hover:text-black absolute right-6 top-6"
              >
                &times;
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setIsAddressModalOpen(false); /* Mock save for now */ }} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-black mb-1">Street Address</label>
                <input type="text" required value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} className="w-full rounded-[5px] bg-gray-50 border border-gray-300 px-4 py-2.5 text-sm" placeholder="123 Green Way" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-black mb-1">City</label>
                  <input type="text" required value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="w-full rounded-[5px] bg-gray-50 border border-gray-300 px-4 py-2.5 text-sm" placeholder="Mumbai" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-1">State</label>
                  <input type="text" required value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} className="w-full rounded-[5px] bg-gray-50 border border-gray-300 px-4 py-2.5 text-sm" placeholder="MH" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-black mb-1">PIN / ZIP</label>
                  <input type="text" required value={newAddress.zip} onChange={e => setNewAddress({...newAddress, zip: e.target.value})} className="w-full rounded-[5px] bg-gray-50 border border-gray-300 px-4 py-2.5 text-sm" placeholder="400001" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-1">Country</label>
                  <input type="text" required value={newAddress.country} onChange={e => setNewAddress({...newAddress, country: e.target.value})} className="w-full rounded-[5px] bg-gray-50 border border-gray-300 px-4 py-2.5 text-sm" />
                </div>
              </div>
              <button type="submit" className="w-full py-3 mt-4 bg-[#76A52E] text-white font-bold rounded-[30px] hover:opacity-90 transition">
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
