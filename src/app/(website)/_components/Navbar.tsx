"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { getRoleConfig } from "@/lib/roles";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { cart } = useCart();
  const { user } = useAuth();
  const cartCount = cart?.total_items ?? 0;

  return (
    <div className="w-full bg-transparent fixed top-0 left-0 right-0 z-[9999]">
      {/* Header Container with Glassmorphism Effect */}
      <header
        className="w-full flex h-[70px] lg:h-[95px] items-center justify-between px-6 lg:px-12 box-sizing-border-box backdrop-blur-[12px]"
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
            alt="Healing Ourth"
            width={79}
            height={79}
            className="w-10 h-10 lg:w-[79px] lg:h-[79px] object-contain drop-shadow-[0px_4px_4px_rgba(250,248,243,0.25)]"
          />
          <span
            className="text-2xl lg:text-[40px] font-bold text-[#0D3A27] tracking-tight leading-[34px] flex items-center"
            style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
          >
            Healing Ourth
          </span>
        </Link>

        {/* Center: Simplified Text Links (No pill borders, bold) */}
        <nav className="hidden items-center gap-12 lg:flex">
          <Link
            href="/know-us"
            className="text-[24px] font-bold text-[#0D3A27] hover:text-[#76A52E] transition-all"
            style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
          >
            Know Us
          </Link>
          <Link
            href="/products"
            className="text-[24px] font-bold text-[#0D3A27] hover:text-[#76A52E] transition-all"
            style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
          >
            Marketplace
          </Link>
          <Link
            href="/campaigns"
            className="text-[24px] font-bold text-[#0D3A27] hover:text-[#76A52E] transition-all"
            style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
          >
            Campaigns
          </Link>
        </nav>

        {/* Right: Cart & Sign In CTAs */}
        <div className="hidden items-center gap-6 lg:flex">
          {/* Search Bar */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
                setSearchQuery("");
              }
            }} 
            className="relative hidden xl:block"
          >
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#FAF8F3]/80 border-[1.5px] border-black rounded-[30px] px-4 py-2 text-[16px] outline-none focus:ring-1 focus:ring-[#76A52E] transition-all w-[220px]"
              style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-[#25784C] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
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
          <Link
            href="/cart"
            className="relative flex items-center justify-center w-[40px] h-[44px] text-[#2C1F13] hover:opacity-85 transition-all"
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
          </Link>

          {/* Sign In Solid Green Capsule Button */}
          <Link
            href={user ? (user.role === "consumer" ? "/client/dashboard" : (getRoleConfig(user.role)?.dashboardPath ?? "/dashboards/admin")) : "/client/login"}
            className="inline-flex w-[146px] h-[47px] items-center justify-center rounded-[30px] bg-[#25784C] text-[24px] font-bold text-white hover:opacity-90 transition-all"
            style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
          >
            {user ? "Dashboard" : "Sign in"}
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg border-2 border-black p-1.5 lg:hidden bg-white/80"
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
        <div className="mt-4 flex flex-col gap-3 rounded-2xl border-2 border-black bg-white/95 p-4 shadow-[4px_4px_0px_0px_#000000] lg:hidden backdrop-blur-md">
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
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
                  setSearchQuery("");
                  setOpen(false);
                }
              }} 
              className="relative mt-2"
            >
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#FAF8F3] border-[1.5px] border-black rounded-[30px] px-4 py-2 w-full text-[16px] outline-none focus:ring-1 focus:ring-[#76A52E]"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-black">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </nav>
          <div className="my-2 border-t border-black/10" />
          <div className="flex gap-3">
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-black py-2 text-sm font-bold text-black hover:bg-[#E8F0D8] transition-all"
            >
              Cart ({cartCount})
            </Link>
            <Link
              href={user ? (user.role === "consumer" ? "/client/dashboard" : (getRoleConfig(user.role)?.dashboardPath ?? "/dashboards/admin")) : "/client/login"}
              onClick={() => setOpen(false)}
              className="flex-1 flex items-center justify-center rounded-xl bg-[#1A5C2E] py-2 text-sm font-bold text-white border border-black"
            >
              {user ? "Dashboard" : "Sign in"}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
