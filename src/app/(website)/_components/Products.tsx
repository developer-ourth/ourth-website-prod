"use client";
 
import Link from "next/link";
import { useEffect, useState } from "react";
import { getMarketplaceProducts, getProductImageUrl, getCategories, type MarketProduct } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
 
const capitalize = (str: string) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};
 
export default function Products() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const isVendor = user?.role === "vendor";
 
  const [products, setProducts] = useState<MarketProduct[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
 
  useEffect(() => {
    // Fetch categories and products in parallel
    Promise.all([
      getCategories(),
      getMarketplaceProducts({ per_page: 24 })
    ])
      .then(([catRes, prodRes]) => {
        setCategories(catRes.data || []);
        setProducts(prodRes.data || []);
      })
      .catch((err) => {
        console.error("Failed to load products/categories:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
 
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim()) {
      alert(`Coupon "${couponCode.trim().toUpperCase()}" applied successfully!`);
    }
  };
 
  const tabs = ["All", ...categories.map((c) => c.name), "Others"];

  const filteredProducts = products.filter((p) => {
    if (activeTab === "All") return true;
    if (activeTab === "Others") {
      return !p.category_id || !categories.some(c => c.id === p.category_id);
    }
    const matchedCategory = categories.find(c => c.name.toLowerCase() === activeTab.toLowerCase());
    return matchedCategory ? p.category_id === matchedCategory.id : false;
  });
 
  return (
    <section className="bg-transparent py-16">
      <div className="mx-auto max-w-[1625px] px-4 lg:px-[52px]">
        
        {/* Title */}
        <h2 
          className="text-4xl lg:text-[56px] lg:leading-[62px] font-semibold text-[#2B4D0E] text-left mb-10 tracking-tight"
          style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
        >
          Our All Products
        </h2>
 
        {/* Tab Pills */}
        <div className="flex flex-wrap gap-4 justify-start mb-12">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`h-[47px] px-6 inline-flex items-center justify-center rounded-[30px] border-[1.5px] border-black text-[20px] lg:text-[24px] font-normal leading-[34px] transition-all active:translate-y-[2px] ${
                  isActive
                    ? "bg-[#EBB339] text-black"
                    : "bg-[#FBEFC9] text-black hover:bg-[#FAF8F3]"
                }`}
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
              >
                {tab === "All" || tab === "Others" ? tab : capitalize(tab)}
              </button>
            );
          })}
        </div>
 
        {/* Product Grid / Carousel */}
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500 font-bold text-2xl">
            No products found in this category.
          </div>
        ) : (
          <>
            {/* Desktop View: Grid */}
            <div className="hidden lg:flex flex-wrap gap-[52px] justify-start">
              {filteredProducts.map((p) => {
                const displayPrice = isVendor && p.wholesale_price
                  ? parseFloat(p.wholesale_price)
                  : parseFloat(p.discounted_price ?? p.base_price);

                return (
                  <div
                    key={p.id}
                    className="w-[294px] h-[433px] bg-[#FBEFC9] border-[1.5px] border-black rounded-[5px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex flex-col justify-between p-4 relative hover:translate-y-[-2px] transition-all"
                    style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                  >
                    {/* Image (198px x 198px centered) */}
                    <div className="w-full h-[198px] bg-transparent flex items-center justify-center overflow-hidden">
                      <img
                        src={getProductImageUrl(p.primary_image_url, p.name)}
                        alt={p.name}
                        className="w-[198px] h-[198px] object-contain"
                      />
                    </div>

                    {/* Title & Details */}
                    <div className="flex flex-col mt-2">
                      <span className="text-black text-[24px] font-medium leading-[34px] truncate">
                        {p.name}
                      </span>
                      <span className="text-black text-[24px] font-normal leading-[34px]">
                        Pack of {p.min_order_quantity > 1 ? p.min_order_quantity : 10}
                      </span>
                    </div>

                    {/* Divider line */}
                    <div className="w-full border-t border-black my-1" />

                    {/* Bottom: Price and Add button */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[24px] font-semibold text-black leading-[34px]">
                          ₹{Math.round(displayPrice)}
                        </span>
                        {isVendor && p.wholesale_price && (
                          <span className="text-[10px] text-[#1A5C2E] font-black uppercase">
                            B2B Min: {p.min_order_quantity}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={async () => {
                          try {
                            const minQty = isVendor ? (p.min_order_quantity ?? 1) : 1;
                            await addToCart(p.id, minQty);
                            alert(`Added "${p.name}" to cart!`);
                          } catch (e: any) {
                            alert(e.message || "Failed to add product to cart.");
                          }
                        }}
                        className="w-[165px] h-[47px] bg-[#FAF8F3] border-[1.5px] border-black rounded-[30px] text-[24px] font-normal text-black hover:bg-neutral-100 flex items-center justify-center transition-all active:scale-95"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile View: Swipeable Carousel showing 2 products at a time */}
            <div className="lg:hidden flex overflow-x-auto gap-4 snap-x snap-mandatory pb-4 w-full scrollbar-none">
              {filteredProducts.map((p) => {
                const displayPrice = isVendor && p.wholesale_price
                  ? parseFloat(p.wholesale_price)
                  : parseFloat(p.discounted_price ?? p.base_price);

                return (
                  <div
                    key={p.id}
                    className="w-[calc(50%-8px)] sm:w-[calc(50%-12px)] h-[320px] bg-[#FBEFC9] border-[1.5px] border-black rounded-[5px] shadow-[2px_2px_0px_#000000] flex flex-col justify-between p-3 relative flex-shrink-0 snap-start"
                    style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                  >
                    {/* Image (Centered, max 100px height for mobile cards) */}
                    <div className="w-full h-[110px] bg-transparent flex items-center justify-center overflow-hidden">
                      <img
                        src={getProductImageUrl(p.primary_image_url, p.name)}
                        alt={p.name}
                        className="w-[100px] h-[100px] object-contain"
                      />
                    </div>

                    {/* Title & Details */}
                    <div className="flex flex-col mt-1">
                      <span className="text-black text-base md:text-lg font-bold truncate">
                        {p.name}
                      </span>
                      <span className="text-black text-xs md:text-sm opacity-80">
                        Pack of {p.min_order_quantity > 1 ? p.min_order_quantity : 10}
                      </span>
                    </div>

                    {/* Divider line */}
                    <div className="w-full border-t border-black my-1" />

                    {/* Bottom: Price and Add button */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-base md:text-lg font-semibold text-black leading-tight">
                          ₹{Math.round(displayPrice)}
                        </span>
                        {isVendor && p.wholesale_price && (
                          <span className="text-[8px] text-[#1A5C2E] font-black uppercase">
                            B2B: {p.min_order_quantity}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={async () => {
                          try {
                            const minQty = isVendor ? (p.min_order_quantity ?? 1) : 1;
                            await addToCart(p.id, minQty);
                            alert(`Added "${p.name}" to cart!`);
                          } catch (e: any) {
                            alert(e.message || "Failed to add product to cart.");
                          }
                        }}
                        className="w-full h-[36px] bg-[#FAF8F3] border-[1.5px] border-black rounded-[30px] text-sm md:text-base font-semibold text-black hover:bg-neutral-100 flex items-center justify-center transition-all active:scale-95"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom local CSS injection to hide scrollbars */}
            <style jsx>{`
              .scrollbar-none::-webkit-scrollbar {
                display: none;
              }
              .scrollbar-none {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>
          </>
        )}
 
        {/* Coupon Code Banner (Rectangle 175) */}
        <div className="mt-20 mx-auto max-w-[1546px] h-auto lg:h-[210px] rounded-[5px] border-[1.5px] border-black bg-[#DCEEFB] px-6 lg:px-12 py-6 lg:py-0 shadow-[4px_4px_0px_#000000] flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-col justify-center">
            <h3 
              className="text-3xl lg:text-[40px] font-medium text-[#103F5E] leading-[34px] lg:leading-[50px]"
              style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
              Got a coupon code?
            </h3>
            <p 
              className="text-lg lg:text-[28px] font-medium text-[#1B6A9E] leading-[34px] mt-2"
              style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
              Apply it below before you checkout.
            </p>
          </div>
          <form onSubmit={handleApplyCoupon} className="flex flex-col sm:flex-row w-full lg:w-auto gap-4 items-center">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="w-full sm:w-[337px] h-[77px] rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] px-6 text-xl lg:text-[24px] text-black focus:outline-none"
              style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
            />
            <button
              type="submit"
              className="w-full sm:w-[151px] h-[77px] rounded-[5px] bg-[#103F5E] border-[1.5px] border-black text-[24px] font-semibold text-[#FAF8F3] hover:opacity-90 flex items-center justify-center transition-all active:scale-95"
              style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
              Apply
            </button>
          </form>
        </div>
 
      </div>
    </section>
  );
}
