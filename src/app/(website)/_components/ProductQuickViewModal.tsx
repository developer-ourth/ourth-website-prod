"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useCart } from "@/contexts/cart-context";
import { getProductImageUrl, type ProductPack } from "@/lib/api";

export default function ProductQuickViewModal() {
  const { quickViewProduct, closeQuickView, addToCart } = useCart();
  const [selectedPack, setSelectedPack] = useState<ProductPack | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [inWishlist, setInWishlist] = useState<boolean>(false);

  // Reset states whenever product changes
  useEffect(() => {
    if (quickViewProduct) {
      setActiveImageIdx(0);
      setQuantity(1);
      setInWishlist(false);
      if (quickViewProduct.packs && quickViewProduct.packs.length > 0) {
        setSelectedPack(quickViewProduct.packs[0]);
      } else {
        setSelectedPack(null);
      }
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  // Build image list
  const primaryImg = getProductImageUrl(quickViewProduct.primary_image_url, quickViewProduct.name);
  const allImages = [primaryImg];
  if (quickViewProduct.secondary_images && Array.isArray(quickViewProduct.secondary_images)) {
    quickViewProduct.secondary_images.forEach((img) => {
      const url = getProductImageUrl(img, quickViewProduct.name);
      if (!allImages.includes(url)) {
        allImages.push(url);
      }
    });
  }

  const currentImgUrl = allImages[activeImageIdx] || primaryImg;

  // Compute displayed prices
  let basePrice = Number(quickViewProduct.base_price) || 0;
  let finalPrice = Number(quickViewProduct.discounted_price || quickViewProduct.base_price) || 0;

  if (selectedPack) {
    basePrice = Number(selectedPack.base_price) || basePrice;
    finalPrice = Number(selectedPack.discounted_price || selectedPack.base_price) || finalPrice;
  }

  const discountPercent = basePrice > finalPrice ? Math.round(((basePrice - finalPrice) / basePrice) * 100) : 0;

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart(quickViewProduct.id, quantity, selectedPack ? selectedPack.id : null);
      toast.success(`Added "${quickViewProduct.name}" to cart!`);
      closeQuickView();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add product to cart.";
      toast.error(msg);
    } finally {
      setIsAdding(false);
    }
  };

  const toggleWishlist = () => {
    setInWishlist(!inWishlist);
    toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8 font-['IBM_Plex_Sans']">
        {/* Frosted Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeQuickView}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal Content Box - Clean, Seamless, No Borders or Harsh Shadows */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative z-10 w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-[#FAF8F3] rounded-2xl shadow-2xl flex flex-col lg:flex-row no-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={closeQuickView}
            aria-label="Close Quick View"
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-black flex items-center justify-center text-lg font-bold transition-all cursor-pointer"
          >
            ✕
          </button>

          {/* Left Column: Main Image & Thumbnails Below (Clean without borders) */}
          <div className="w-full lg:w-1/2 p-6 sm:p-8 bg-white flex flex-col justify-between rounded-t-2xl lg:rounded-tr-none lg:rounded-l-2xl">
            <div>
              <div className="w-full flex justify-between items-center mb-4 pr-10 lg:pr-0">
                <span className="px-3.5 py-1 rounded-full bg-[#FAF8F3] text-xs font-bold text-gray-800 uppercase tracking-wider">
                  ⚡ Quick View
                </span>
                {discountPercent > 0 && (
                  <span className="px-3.5 py-1 rounded-full bg-[#D9381E] text-white font-extrabold text-xs">
                    Save {discountPercent}%
                  </span>
                )}
              </div>

              {/* Main Image Frame - With Clean Architectural Border & Shadow matching product box */}
              <div className="relative w-full h-[280px] sm:h-[360px] rounded-xl overflow-hidden bg-white border-[1.5px] border-black shadow-md flex items-center justify-center p-6">
                <Image
                  src={currentImgUrl}
                  alt={quickViewProduct.name}
                  fill
                  className="object-contain transition-all duration-300 p-4"
                  sizes="(max-width: 768px) 100vw, 450px"
                />
              </div>
            </div>

            {/* Thumbnail Row Right Underneath */}
            <div className="mt-5 w-full">
              {allImages.length > 1 ? (
                <div className="flex items-center gap-3 overflow-x-auto py-1">
                  {allImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border-[1.5px] transition-all cursor-pointer flex-shrink-0 ${
                        activeImageIdx === idx
                          ? "border-black ring-2 ring-[#76A52E] scale-105 bg-white"
                          : "border-black/60 opacity-80 hover:opacity-100 hover:border-black bg-white"
                      }`}
                    >
                      <Image src={imgUrl} alt={`Angle ${idx + 1}`} fill className="object-contain p-2" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF8F3]">
                  <span className="text-xs text-gray-700 font-semibold">
                    🌱 100% Chemical-Free Sun-Dried Areca Palm Leaf
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Product Details & Action Layout */}
          <div className="w-full lg:w-1/2 p-6 sm:p-8 flex flex-col justify-between bg-[#FAF8F3] rounded-b-2xl lg:rounded-bl-none lg:rounded-r-2xl">
            <div>
              {/* Top Meta Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-xs text-gray-500 font-medium pb-0.5">
                  0 Reviews - Be the first to review
                </span>
                <span className="bg-[#E8F0D8] text-[#2B4D0E] rounded-full px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider">
                  DECOMPOSEABLE AND ECO-FRIENDLY
                </span>
              </div>

              {/* Title - Poppins Deep Earth Brown */}
              <h3
                className="text-3xl sm:text-4xl font-bold text-[#5E3A16] tracking-tight leading-tight mb-3"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {quickViewProduct.name}
              </h3>

              {/* Description Paragraph */}
              <p className="text-base sm:text-lg text-[#2B4D0E] font-medium leading-relaxed my-4 line-clamp-3">
                {quickViewProduct.description ||
                  "These large disposable plates and bowls are perfect for serving larger portions of food at events, parties, and catering services. They are strong, durable, and safe for hot and cold foods. Their leak-resistant design ensures clean and easy serving."}
              </p>

              {/* Price Display Row */}
              <div className="flex items-baseline gap-3 my-5">
                <span className="text-3xl sm:text-4xl font-bold text-black font-['IBM_Plex_Sans']">
                  ₹{finalPrice.toLocaleString()}
                </span>
                <span className="text-lg sm:text-xl font-normal text-black ml-2">
                  Pack of {selectedPack ? selectedPack.name.replace(/\D/g, "") || "10" : "10"}
                </span>
                {basePrice > finalPrice && (
                  <span className="text-base font-normal text-gray-500 line-through ml-auto">
                    ₹{basePrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Pack Variant Selector */}
              {quickViewProduct.packs && quickViewProduct.packs.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-3">
                    {quickViewProduct.packs.map((pack) => {
                      const isSelected = selectedPack?.id === pack.id;
                      return (
                        <button
                          key={pack.id}
                          type="button"
                          onClick={() => setSelectedPack(pack)}
                          className={`px-6 py-2.5 rounded-lg text-base font-bold transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#9FD4F2] text-black"
                              : "bg-white text-gray-700 hover:bg-gray-100 font-normal"
                          }`}
                        >
                          {pack.name || `Pack of 10`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Actions Footer Section (Quantity Stepper + Add to Cart + Heart Button + View Full Details) */}
            <div className="space-y-3 pt-4 border-t border-gray-200/60">
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center justify-between w-[130px] h-[48px] rounded-full bg-white px-3 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="text-2xl font-normal text-black pb-1 active:scale-90 transition-transform cursor-pointer px-2"
                  >
                    -
                  </button>
                  <span className="text-xl font-bold text-black">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="text-2xl font-normal text-black pb-1 active:scale-90 transition-transform cursor-pointer px-2"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="flex-grow h-[48px] rounded-full bg-[#9FD4F2] hover:bg-[#8BC6E8] text-[#103F5E] font-bold text-lg hover:translate-y-[-1px] active:translate-y-[0px] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center"
                >
                  {isAdding ? "Adding..." : "Add to Cart"}
                </button>

                {/* Wishlist Heart Button */}
                <button
                  type="button"
                  onClick={toggleWishlist}
                  className="w-[48px] h-[48px] rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-transform active:scale-95 flex-shrink-0"
                  aria-label="Add to wishlist"
                >
                  <svg className="w-6 h-6" fill={inWishlist ? "#D9381E" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              {/* View Full Details & Bulk Pricing link */}
              <Link
                href={`/products/${quickViewProduct.id}`}
                onClick={closeQuickView}
                className="w-full h-[48px] rounded-full bg-[#9FD4F2]/30 hover:bg-[#9FD4F2]/50 text-[#103F5E] font-bold text-lg text-center flex items-center justify-center transition-all"
              >
                View Full Product Details &amp; Bulk Pricing ↗
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
