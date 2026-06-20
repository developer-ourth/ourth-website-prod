"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/contexts/cart-context";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { cart } = useCart();
  const cartCount = cart?.total_items ?? 0;

  return (
    <div className="absolute top-5 left-0 right-0 z-50 px-6">
      {/* Floating pill navbar */}
      <header
        className="mx-auto flex h-[75px] max-w-[1580px] items-center justify-between rounded-[22px] px-8 md:px-12"
        style={{
          background: "rgba(237, 232, 220, 0.70)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: "0 8px 32px 0 rgba(44, 74, 26, 0.12), 0 2px 8px 0 rgba(44, 74, 26, 0.08)",
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Healing Ourth" width={38} height={38} className="object-contain" style={{ width: "auto", height: "48px" }} />
          <span
            style={{
              fontSize: "28px",
              fontFamily: "var(--font-ibm-plex-sans), 'IBM Plex Sans', sans-serif",
              fontWeight: 700,
              color: "#0D3A27",
              letterSpacing: "-0.01em",
            }}
          >
            Healing Ourth
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-20 md:flex">
          <Link href="/" style={{ fontFamily: "var(--font-ibm-plex-sans), 'IBM Plex Sans', sans-serif", fontSize: "18px", fontWeight: 600, color: "#0D3A27" }} className="hover:opacity-80 transition-opacity">Home</Link>
          <Link href="/about" style={{ fontFamily: "var(--font-ibm-plex-sans), 'IBM Plex Sans', sans-serif", fontSize: "18px", fontWeight: 600, color: "#2C1F13" }} className="hover:opacity-80 transition-opacity">About</Link>
          <Link href="/products" style={{ fontFamily: "var(--font-ibm-plex-sans), 'IBM Plex Sans', sans-serif", fontSize: "18px", fontWeight: 600, color: "#2C1F13" }} className="hover:opacity-80 transition-opacity">Products</Link>
          <Link href="/cart" style={{ fontFamily: "var(--font-ibm-plex-sans), 'IBM Plex Sans', sans-serif", fontSize: "18px", fontWeight: 600, color: "#2C1F13" }} className="hover:opacity-80 transition-opacity flex items-center gap-1.5">
            Cart
            {cartCount > 0 && (
              <span className="inline-flex items-center justify-center bg-[#25784C] text-[#D8EFE0] text-xs font-extrabold rounded-full h-5 w-5">
                {cartCount}
              </span>
            )}
          </Link>
        </nav>

        {/* CTA */}
        <div className="hidden md:block">
          <Link
            href="/contact"
            className="flex items-center justify-center rounded-[20px] px-6 py-2.5 hover:opacity-90 transition-opacity"
            style={{
              background: "#25784C",
              boxShadow: "0px 4px 4px rgba(0,0,0,0.25)",
              fontFamily: "var(--font-ibm-plex-sans), 'IBM Plex Sans', sans-serif",
              fontSize: "18px",
              fontWeight: 600,
              color: "#D8EFE0",
              minWidth: "160px",
              height: "44px",
            }}
          >
            Get in touch
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[#2C4A1A]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </header>

      {/* Mobile dropdown */}
      {open && (
        <div
          className="mx-auto mt-2 max-w-[1580px] rounded-[20px] px-8 py-5 md:hidden"
          style={{
            background: "rgba(237, 232, 220, 0.92)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            boxShadow: "0 8px 32px 0 rgba(44, 74, 26, 0.12)",
          }}
        >
          <nav className="flex flex-col gap-4">
            <Link href="/" className="text-sm font-medium text-[#2C4A1A]" onClick={() => setOpen(false)}>Home</Link>
            <Link href="/about" className="text-sm font-medium text-[#2C4A1A]/70" onClick={() => setOpen(false)}>About</Link>
            <Link href="/products" className="text-sm font-medium text-[#2C4A1A]/70" onClick={() => setOpen(false)}>Products</Link>
            <Link href="/cart" className="text-sm font-medium text-[#2C4A1A]/70 flex items-center gap-1.5" onClick={() => setOpen(false)}>
              Cart
              {cartCount > 0 && (
                <span className="inline-flex items-center justify-center bg-[#25784C] text-[#D8EFE0] text-xs font-extrabold rounded-full h-4 w-4">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              href="/contact"
              className="w-fit rounded-full bg-[#2C4A1A] px-5 py-2 text-sm font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              Get in touch
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
