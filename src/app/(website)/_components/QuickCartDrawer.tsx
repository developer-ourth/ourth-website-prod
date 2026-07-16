"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/cart-context";
import { getProductImageUrl } from "@/lib/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

const FREE_SHIPPING_THRESHOLD = 1500;

export default function QuickCartDrawer() {
  const { cart, isDrawerOpen, closeDrawer, updateQty, removeFromCart } = useCart();
  const router = useRouter();

  const totalAmount = parseFloat(cart?.total_amount ?? "0");
  const itemsCount = cart?.total_items ?? 0;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - totalAmount);
  const progressPercent = Math.min(100, Math.max(0, Math.round((totalAmount / FREE_SHIPPING_THRESHOLD) * 100)));

  const estimatedShipping = totalAmount >= FREE_SHIPPING_THRESHOLD ? 0 : (totalAmount > 0 ? 99 : 0);
  const finalTotal = totalAmount + estimatedShipping;

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100000] overflow-hidden font-['IBM_Plex_Sans']">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeDrawer}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            {/* Slide-over panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="w-screen max-w-md bg-[#FAF8F3] shadow-2xl border-l border-black/10 flex flex-col justify-between overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-black/10 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-[#0D3A27]">Your Eco-Cart</h2>
                  <span className="bg-[#25784C] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {itemsCount} {itemsCount === 1 ? "item" : "items"}
                  </span>
                </div>
                <button
                  onClick={closeDrawer}
                  aria-label="Close cart"
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Free Shipping & Tree Planted Progress Bar - Commented out for now */}
              {/* <div className="bg-[#FAF8F3] px-6 py-4 border-b border-black/10">
                <div className="p-3.5 rounded-xl bg-white border border-black/10 shadow-xs">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#0D3A27] mb-2">
                    <span className="text-lg">🌱</span>
                    {totalAmount >= FREE_SHIPPING_THRESHOLD ? (
                      <span className="text-[#25784C]">
                        🎉 Unlocked! Free Carbon-Neutral Shipping & 1 Tree Planted!
                      </span>
                    ) : (
                      <span>
                        Add <strong className="text-[#25784C]">₹{remainingForFreeShipping.toFixed(0)} more</strong> for Free Carbon-Neutral Shipping & 1 Tree Planted!
                      </span>
                    )}
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-[#76A52E] to-[#25784C] rounded-full"
                    />
                  </div>
                </div>
              </div> */}

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {!cart || cart.items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-[#E8F0D8]/50 flex items-center justify-center text-4xl mb-4 border border-[#25784C]/20">
                      🍃
                    </div>
                    <h3 className="text-lg font-bold text-[#0D3A27] mb-1">Your eco-cart is empty</h3>
                    <p className="text-sm text-gray-600 mb-6 max-w-[240px]">
                      Explore our 100% natural, leak-proof Areca palm leaf tableware collection.
                    </p>
                    <button
                      onClick={() => {
                        closeDrawer();
                        router.push("/products");
                      }}
                      className="rounded-[30px] bg-[#25784C] border-[1.5px] border-black px-6 py-3 text-sm font-bold text-white hover:opacity-90 transition shadow-sm"
                    >
                      Browse Tableware →
                    </button>
                  </div>
                ) : (
                  cart.items.map((item) => {
                    const imageUrl = getProductImageUrl(
                      item.product?.primary_image_url,
                      item.product?.name
                    );
                    const packText = item.productPack?.name
                      ? item.productPack.name
                      : "Standard Pack";

                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-xl border border-black/10 p-4 shadow-xs flex gap-4 items-center"
                      >
                        {/* Image Thumbnail */}
                        <div className="w-16 h-16 rounded-lg bg-[#FAF8F3] border border-black/10 p-1 flex items-center justify-center shrink-0">
                          <Image
                            src={imageUrl}
                            alt={item.product?.name ?? "Tableware"}
                            width={56}
                            height={56}
                            className="object-contain max-h-full"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-[#0D3A27] truncate">
                            {item.product?.name}
                          </h4>
                          <span className="inline-block text-xs font-semibold text-gray-500 mt-0.5">
                            {packText}
                          </span>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-sm font-bold text-[#25784C]">
                              ₹{parseFloat(item.unit_price).toFixed(0)}
                            </span>

                            {/* Quantity Stepper */}
                            <div className="flex items-center border border-black/20 rounded-lg bg-[#FAF8F3] overflow-hidden">
                              <button
                                type="button"
                                onClick={() => {
                                  if (item.quantity > 1) {
                                    updateQty(item.id, item.quantity - 1);
                                  } else {
                                    removeFromCart(item.id);
                                  }
                                }}
                                className="w-7 h-7 flex items-center justify-center text-gray-700 hover:bg-black/10 font-bold transition-colors"
                              >
                                {item.quantity === 1 ? "🗑️" : "−"}
                              </button>
                              <span className="px-2 text-xs font-bold text-black min-w-[24px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQty(item.id, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center text-gray-700 hover:bg-black/10 font-bold transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Remove item button */}
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Remove item"
                          className="text-gray-400 hover:text-red-500 p-1.5 transition-colors shrink-0"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer Checkout Summary */}
              {cart && cart.items.length > 0 && (
                <div className="p-6 bg-white border-t border-black/15 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between text-sm text-gray-600 font-medium">
                    <span>Subtotal</span>
                    <span className="font-bold text-black">₹{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 font-medium">
                    <span>Carbon-Neutral Shipping</span>
                    <span className="font-bold text-[#25784C]">
                      {estimatedShipping === 0 ? "FREE" : `₹${estimatedShipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-base font-bold text-black">
                    <span>Total Amount</span>
                    <span className="text-xl text-[#0D3A27]">₹{finalTotal.toFixed(2)}</span>
                  </div>

                  <div className="pt-3">
                    <button
                      onClick={() => {
                        closeDrawer();
                        router.push("/cart");
                      }}
                      className="w-full rounded-[30px] bg-[#25784C] border-[1.5px] border-black px-6 py-3.5 font-bold text-white text-lg hover:opacity-90 active:translate-y-[1px] transition shadow-md flex items-center justify-center gap-2"
                    >
                      <span>Proceed to Checkout</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
