"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { getRoleConfig } from "@/lib/roles";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { cart } = useCart();
  const { user } = useAuth();
  const cartCount = cart?.total_items ?? 0;

  return (
    <div className="w-full bg-transparent lg:sticky lg:top-0 z-50 px-4 lg:px-8">
      <header className="mx-auto flex h-[70px] lg:h-[95px] max-w-[1625px] items-center justify-between bg-[#FAF8F3] border-[1.5px] border-black shadow-[4px_4px_0px_#000000] px-4 lg:px-8 mt-[18px] box-sizing-border-box">
        {/* Left: Brand Identity */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
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

        {/* Center: Category Navigation Pills */}
        <nav className="hidden items-center gap-4 lg:flex">
          <Link
            href="/products?category=plates"
            className="inline-flex w-[165px] h-[47px] items-center justify-center rounded-[30px] border-[1.5px] border-black text-[24px] font-normal text-black bg-transparent hover:bg-[#E8F0D8] transition-all"
            style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
          >
            Shop
          </Link>
          <Link
            href="/products?category=bowls"
            className="inline-flex w-[165px] h-[47px] items-center justify-center rounded-[30px] border-[1.5px] border-black text-[24px] font-normal text-black bg-transparent hover:bg-[#E8F0D8] transition-all"
            style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
          >
            About
          </Link>
          <Link
            href="/products?category=platters"
            className="inline-flex w-[165px] h-[47px] items-center justify-center rounded-[30px] border-[1.5px] border-black text-[24px] font-normal text-black bg-transparent hover:bg-[#E8F0D8] transition-all"
            style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
          >
            Products
          </Link>
          <Link
            href="/products?category=cutlery"
            className="inline-flex w-[181px] h-[47px] items-center justify-center rounded-[30px] border-[1.5px] border-black text-[24px] font-normal text-black bg-transparent hover:bg-[#E8F0D8] transition-all"
            style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
          >
            Get in touch
          </Link>
        </nav>

        {/* Right: Cart & Portal CTAs */}
        <div className="hidden items-center gap-6 lg:flex">
          {/* Cart Icon (w: 40px, h: 44px) */}
          <Link
            href="/cart"
            className="relative flex items-center justify-center w-[40px] h-[44px] text-[#2C1F13] hover:opacity-80 transition-all"
          >
            <svg
              className="w-8 h-8"
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

          {/* Sign in Button */}
          <Link
            href={user ? (user.role === "consumer" ? "/products" : (getRoleConfig(user.role)?.dashboardPath ?? "/dashboards/admin")) : "/client/login"}
            className="inline-flex w-[146px] h-[47px] items-center justify-center rounded-[30px] border-[1.5px] border-black bg-[#76A52E] text-[24px] font-normal text-[#FAF8F3] hover:opacity-90 transition-all"
            style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
          >
            {user ? "Dashboard" : "Sign in"}
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg border-2 border-black p-1.5 lg:hidden bg-white"
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
        <div className="mt-4 flex flex-col gap-3 rounded-2xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000000] lg:hidden">
          <nav className="flex flex-col gap-2.5">
            <Link
              href="/products?category=plates"
              className="text-sm font-bold text-black hover:underline"
              onClick={() => setOpen(false)}
            >
              ✦ Shop
            </Link>
            <Link
              href="/products?category=bowls"
              className="text-sm font-bold text-black hover:underline"
              onClick={() => setOpen(false)}
            >
              ✦ About
            </Link>
            <Link
              href="/products?category=platters"
              className="text-sm font-bold text-black hover:underline"
              onClick={() => setOpen(false)}
            >
              ✦ Products
            </Link>
            <Link
              href="/products?category=cutlery"
              className="text-sm font-bold text-black hover:underline"
              onClick={() => setOpen(false)}
            >
              ✦ Get in touch
            </Link>
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
              href={user ? (user.role === "consumer" ? "/products" : (getRoleConfig(user.role)?.dashboardPath ?? "/dashboards/admin")) : "/client/login"}
              onClick={() => setOpen(false)}
              className="flex-1 flex items-center justify-center rounded-xl bg-[#76A52E] py-2 text-sm font-bold text-white border border-black"
            >
              {user ? "Dashboard" : "Sign in"}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
