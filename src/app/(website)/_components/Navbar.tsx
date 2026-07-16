"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { getRoleConfig } from "@/lib/roles";
import { getMarketplaceProducts, getProductImageUrl, type MarketProduct } from "@/lib/api";
import QuickCartDrawer from "@/app/(website)/_components/QuickCartDrawer";
import ProductQuickViewModal from "@/app/(website)/_components/ProductQuickViewModal";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<MarketProduct[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRefDesktop = useRef<HTMLDivElement>(null);
  const searchRefMobile = useRef<HTMLDivElement>(null);
  
  const router = useRouter();
  const { cart, openDrawer } = useCart();
  const { user } = useAuth();
  const cartCount = cart?.total_items ?? 0;

  useEffect(() => {
    getMarketplaceProducts({ per_page: 40 })
      .then(res => setProducts(res.data || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRefDesktop.current && !searchRefDesktop.current.contains(event.target as Node) &&
          searchRefMobile.current && !searchRefMobile.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredProducts = searchQuery.trim() === "" 
    ? [] 
    : products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))).slice(0, 5);

  return (
    <div className="w-full bg-transparent fixed top-0 left-0 right-0 z-[9999]">
      {/* Header Container with Glassmorphism Effect */}
      <header
        className="w-full flex h-[70px] lg:h-[80px] xl:h-[95px] items-center justify-between px-4 lg:px-6 xl:px-12 box-sizing-border-box backdrop-blur-[12px]"
        style={{
          backgroundColor: "rgba(250, 248, 243, 0.55)", // translucent cream background
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)"
        }}
      >
        {/* Left: Brand Identity */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo/HOIPL_3DIndia.webp"
            alt="Healing OURTH"
            width={79}
            height={79}
            className="w-10 h-10 lg:w-[60px] lg:h-[60px] xl:w-[79px] xl:h-[79px] object-contain drop-shadow-[0px_4px_4px_rgba(250,248,243,0.25)]"
          />
          <span
            className="text-2xl lg:text-[24px] xl:text-[32px] 2xl:text-[40px] font-bold text-[#0D3A27] tracking-tight leading-[1.1] flex items-center whitespace-nowrap"
            style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
          >
            Healing OURTH
          </span>
        </Link>

        {/* Center: Simplified Text Links (No pill borders, bold) */}
        <nav className="hidden items-center gap-3 lg:gap-5 xl:gap-8 2xl:gap-12 xl:flex">
          <Link
            href="/know-us"
            className="text-[16px] lg:text-[17px] xl:text-[20px] 2xl:text-[24px] font-bold text-[#0D3A27] hover:text-[#76A52E] transition-all whitespace-nowrap"
            style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
          >
            Know Us
          </Link>
          <Link
            href="/products"
            className="text-[16px] lg:text-[17px] xl:text-[20px] 2xl:text-[24px] font-bold text-[#0D3A27] hover:text-[#76A52E] transition-all whitespace-nowrap"
            style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
          >
            Marketplace
          </Link>
          <Link
            href="/campaigns"
            className="text-[16px] lg:text-[17px] xl:text-[20px] 2xl:text-[24px] font-bold text-[#0D3A27] hover:text-[#76A52E] transition-all whitespace-nowrap"
            style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
          >
            Campaigns
          </Link>
        </nav>

        {/* Right: Cart & Sign In CTAs */}
        <div className="hidden items-center gap-2 lg:gap-3 xl:gap-4 2xl:gap-6 xl:flex">
          {/* Search Bar */}
          <div ref={searchRefDesktop} className="relative flex items-center">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
                  setShowDropdown(false);
                }
              }} 
              className="relative flex items-center"
            >
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onFocus={() => setShowDropdown(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                className="bg-[#FAF8F3]/80 border-[1.5px] border-black rounded-[30px] px-3 xl:px-4 py-[10px] min-h-[44px] text-[14px] xl:text-[16px] outline-none focus:ring-1 focus:ring-[#76A52E] transition-all w-[140px] xl:w-[220px]"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
              />
              <button 
                type="submit" 
                aria-label="Search"
                className="absolute right-1 top-1/2 -translate-y-1/2 w-[44px] h-[44px] flex items-center justify-center text-black hover:text-[#25784C] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            {/* Dropdown */}
            {showDropdown && searchQuery.trim() !== "" && (
              <div className="absolute top-full mt-2 w-[300px] right-0 bg-white border-[1.5px] border-black rounded-xl shadow-lg overflow-hidden z-[10000]">
                {filteredProducts.length > 0 ? (
                  <div className="flex flex-col">
                    {filteredProducts.map(p => (
                      <Link 
                        href={`/products/${p.id}`} 
                        key={p.id}
                        onClick={() => {
                          setShowDropdown(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-3 p-3 hover:bg-[#F5F8F3] border-b border-black/10 last:border-0 transition-colors"
                      >
                        <div className="w-10 h-10 bg-white border border-black/10 rounded flex items-center justify-center p-1 shrink-0">
                          <Image src={getProductImageUrl(p.primary_image_url, p.name)} alt={p.name} width={40} height={40} className="object-contain max-h-full" />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-bold text-[#0D3A27] truncate" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>{p.name}</span>
                          <span className="text-xs font-semibold text-[#25784C]">₹{p.base_price}</span>
                        </div>
                      </Link>
                    ))}
                    <button 
                      onClick={() => {
                        router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
                        setShowDropdown(false);
                      }}
                      className="w-full text-center p-3 text-sm font-bold text-[#25784C] hover:bg-[#E8F0D8] transition-colors bg-[#FAF8F3]"
                      style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                    >
                      View all results
                    </button>
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm font-semibold text-gray-500" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                    No products found
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Wishlist Icon */}
          <Link
            href="/wishlist"
            className="relative flex items-center justify-center w-[40px] h-[44px] text-[#2C1F13] hover:opacity-85 transition-all"
            title="Wishlist"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </Link>

          {/* Cart Icon */}
          <button
            type="button"
            onClick={openDrawer}
            className="relative flex items-center justify-center w-[40px] h-[44px] text-[#2C1F13] hover:opacity-85 transition-all cursor-pointer"
            aria-label="View Eco-Cart"
          >
            <svg
              className="w-9 h-9"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
              {cartCount}
            </span>
          </button>

          {/* Sign In Solid Green Capsule Button */}
          <Link
            href={user ? (user.role === "consumer" ? "/client/dashboard" : (getRoleConfig(user.role)?.dashboardPath ?? "/dashboards/admin")) : "/client/login"}
            className="inline-flex w-[110px] xl:w-[146px] h-[36px] xl:h-[47px] items-center justify-center rounded-[30px] bg-[#25784C] text-[16px] xl:text-[24px] font-bold text-white hover:opacity-90 transition-all whitespace-nowrap"
            style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
          >
            {user ? (user.role === "admin" ? "Admin Panel" : "Dashboard") : "Sign in"}
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg border-2 border-black p-1.5 xl:hidden bg-white/80"
        >
          <svg
            className="h-6 w-6 text-black"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </header>

      {/* Mobile Menu dropdown */}
      {open && (
        <div className="mt-4 flex flex-col gap-3 rounded-2xl border-2 border-black bg-white/95 p-4 shadow-[4px_4px_0px_0px_#000000] xl:hidden backdrop-blur-md">
          <nav className="flex flex-col gap-2.5">
            <Link
              href="/know-us"
              className="text-base font-bold text-[#0D3A27] hover:underline"
              onClick={() => setOpen(false)}
            >
              ✦ Know Us
            </Link>
            <Link
              href="/products"
              className="text-base font-bold text-[#0D3A27] hover:underline"
              onClick={() => setOpen(false)}
            >
              ✦ Marketplace
            </Link>
            <Link
              href="/campaigns"
              className="text-base font-bold text-[#0D3A27] hover:underline"
              onClick={() => setOpen(false)}
            >
              ✦ Campaigns
            </Link>
            <Link
              href="/wishlist"
              className="text-base font-bold text-[#0D3A27] hover:underline"
              onClick={() => setOpen(false)}
            >
              ✦ Wishlist
            </Link>
            <div ref={searchRefMobile} className="relative mt-2">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
                    setSearchQuery("");
                    setOpen(false);
                    setShowDropdown(false);
                  }
                }} 
                className="relative"
              >
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchQuery}
                  onFocus={() => setShowDropdown(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  className="bg-[#FAF8F3] border-[1.5px] border-black rounded-[30px] px-4 py-[10px] min-h-[44px] w-full text-[16px] outline-none focus:ring-1 focus:ring-[#76A52E]"
                  style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                />
                <button 
                  type="submit" 
                  aria-label="Search"
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-[44px] h-[44px] flex items-center justify-center text-black"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
              
              {/* Mobile Dropdown */}
              {showDropdown && searchQuery.trim() !== "" && (
                <div className="absolute top-full mt-2 w-full left-0 bg-white border-[1.5px] border-black rounded-xl shadow-lg overflow-hidden z-[10000]">
                  {filteredProducts.length > 0 ? (
                    <div className="flex flex-col">
                      {filteredProducts.map(p => (
                        <Link 
                          href={`/products/${p.id}`} 
                          key={p.id}
                          onClick={() => {
                            setShowDropdown(false);
                            setSearchQuery("");
                            setOpen(false);
                          }}
                          className="flex items-center gap-3 p-3 hover:bg-[#F5F8F3] border-b border-black/10 last:border-0 transition-colors"
                        >
                          <div className="w-10 h-10 bg-white border border-black/10 rounded flex items-center justify-center p-1 shrink-0">
                            <Image src={getProductImageUrl(p.primary_image_url, p.name)} alt={p.name} width={40} height={40} className="object-contain max-h-full" />
                          </div>
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold text-[#0D3A27] truncate" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>{p.name}</span>
                            <span className="text-xs font-semibold text-[#25784C]">₹{p.base_price}</span>
                          </div>
                        </Link>
                      ))}
                      <button 
                        onClick={() => {
                          router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
                          setShowDropdown(false);
                          setOpen(false);
                        }}
                        className="w-full text-center p-3 text-sm font-bold text-[#25784C] hover:bg-[#E8F0D8] transition-colors bg-[#FAF8F3]"
                        style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                      >
                        View all results
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm font-semibold text-gray-500" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                      No products found
                    </div>
                  )}
                </div>
              )}
            </div>
          </nav>
          <div className="my-2 border-t border-black/10" />
          <div className="my-2 border-t border-black/10" />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openDrawer();
              }}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-black py-2 text-sm font-bold text-black hover:bg-[#E8F0D8] transition-all cursor-pointer"
            >
              Cart ({cartCount})
            </button>
            <Link
              href={user ? (user.role === "consumer" ? "/client/dashboard" : (getRoleConfig(user.role)?.dashboardPath ?? "/dashboards/admin")) : "/client/login"}
              onClick={() => setOpen(false)}
              className="flex-1 flex items-center justify-center rounded-xl bg-[#1A5C2E] py-2 text-sm font-bold text-white border border-black"
            >
              {user ? (user.role === "admin" ? "Admin Panel" : "Dashboard") : "Sign in"}
            </Link>
          </div>
        </div>
      )}

      <QuickCartDrawer />
      <ProductQuickViewModal />
    </div>
  );
}
