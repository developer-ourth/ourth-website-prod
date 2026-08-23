"use client";
import toast from "react-hot-toast";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { getProductImageUrl } from "@/lib/api";

export default function ProductCard({ product, index }: { product: any; index: number }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [selectedPackId, setSelectedPackId] = useState<number | null>(() => {
    if (product.packs && product.packs.length > 0) {
      const activePacks = product.packs.filter((p: any) => p.is_active);
      return activePacks.length > 0 ? activePacks[0].id : product.packs[0].id;
    }
    return null;
  });

  const [adding, setAdding] = useState(false);
  const [success, setSuccess] = useState(false);

  const isEvenRow = index % 2 === 1;

  const isB2B = user?.role === "vendor";
  const selectedPack = product.packs?.find((p: any) => p.id === selectedPackId);
  const price = selectedPack
    ? (selectedPack.discounted_price ?? selectedPack.base_price)
    : (isB2B && product.wholesale_price !== null && product.wholesale_price !== undefined
        ? product.wholesale_price
        : (product.discounted_price ?? product.base_price ?? 0));

  const basePriceNum = parseFloat(selectedPack ? selectedPack.base_price : (product.base_price ?? "0"));
  const finalPriceNum = parseFloat(price);
  const minQty = isB2B ? (product.min_order_quantity ?? 1) : 1;

  const handleAdd = async () => {
    if (!user) {
      // Redirect to login if not logged in
      router.push("/client/login");
      return;
    }
    setAdding(true);
    setSuccess(false);
    try {
      await addToCart(product.id, minQty, selectedPackId);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      // Context handles error
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="relative max-w-[1580px] mx-auto px-4 sm:px-8 py-8">
      {/* Product Card Container */}
      <div
        className={`flex flex-col lg:flex-row items-center justify-between gap-12 rounded-[5px] border-[1.5px] border-black p-8 md:p-10 lg:p-12 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] overflow-hidden bg-[#FBEFC9] relative z-20 ${
          isEvenRow ? "lg:flex-row-reverse" : ""
        }`}
      >
        {/* Left Column Content card (Text panel) */}
        <div className="w-full lg:w-[560px] bg-[#FAF8F3] border-[1.5px] border-black rounded-[5px] p-6 sm:p-8 lg:p-10 shadow-[4px_4px_0px_#000000] flex flex-col justify-center min-h-[480px] space-y-6">
          <div>
            {/* Category Title */}
            <h2 
              className="text-[56px] font-bold text-[#2C1F13] tracking-tight leading-none mb-4" 
              style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
            >
              {product.category?.name || "Bowls"}
            </h2>
            {/* Product Name Link */}
            <Link href={`/products/${product.sku || product.id}`} className="hover:underline">
              <h3 className="text-[32px] font-medium text-[#2C1F13] leading-tight" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                {product.name}
              </h3>
            </Link>
          </div>
          
          <p className="text-[16px] leading-[34px] text-[#2C1F13] font-medium" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
            {product.description ||
              "Deep, sturdy bowl ideal for curries, dal and rice. Heat-resistant up to 90°C."}
          </p>

          {/* Pack Size Selector */}
          {product.packs && product.packs.length > 0 && (
            <div className="space-y-3">
              <label className="text-[18px] font-bold text-[#2C1F13] uppercase tracking-wider block">
                Select Pack Size:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.packs.map((pack: any) => {
                  const isSelected = pack.id === selectedPackId;
                  return (
                    <button
                      key={pack.id}
                      onClick={() => setSelectedPackId(pack.id)}
                      className={`px-4 py-2 rounded-[30px] text-[16px] font-medium border-[1.5px] border-black transition duration-200 ${
                        isSelected
                          ? "bg-[#C7E08E] text-black"
                          : "bg-white text-black hover:bg-gray-50"
                      }`}
                    >
                      {pack.name} (₹{pack.discounted_price ?? pack.base_price} {pack.discounted_price && pack.discounted_price !== pack.base_price && <span className="line-through text-xs ml-1 opacity-70">₹{pack.base_price}</span>})
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Price and Add-to-cart action */}
          <div className="flex items-center justify-between pt-6 border-t border-black/10">
            <div>
              <span className="text-[14px] font-semibold text-gray-500 block">
                {isB2B && !selectedPack ? "Wholesale Price" : "Price"}
              </span>
              <span className="text-[32px] font-black text-black flex items-center gap-2 leading-none mt-1">
                ₹{finalPriceNum.toFixed(0)}
                {basePriceNum > finalPriceNum && !isB2B && (
                  <span className="text-[20px] font-medium text-gray-500 line-through">
                    ₹{basePriceNum.toFixed(0)}
                  </span>
                )}
                {isB2B && !selectedPack && (
                  <span className="text-[12px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ml-1">
                    B2B
                  </span>
                )}
              </span>
              {isB2B && minQty > 1 && !selectedPack && (
                <span className="text-[12px] text-gray-500 block mt-1">
                  Min. Order: {minQty} units
                </span>
              )}
            </div>
            <button
              onClick={handleAdd}
              disabled={adding}
              className={`rounded-[30px] px-8 py-3 text-[18px] font-bold border-[1.5px] border-black transition duration-200 ${
                success
                  ? "bg-green-600 text-white"
                  : "bg-[#103F5E] text-white hover:opacity-90"
              } disabled:opacity-50`}
            >
              {adding ? "Adding..." : success ? "✓ Added!" : "Add to Cart"}
            </button>
          </div>
        </div>

        {/* Right Column Image */}
        <div className="w-full lg:w-[718px] h-[574px] flex justify-center items-center relative z-10">
          <Link href={`/products/${product.sku || product.id}`} className="relative w-full h-full max-w-[620px]">
            <img
              src={getProductImageUrl(product.primary_image_url, product.name)}
              alt={product.name}
              className="h-full w-full object-contain transform hover:scale-105 transition duration-500"
              style={{ filter: "drop-shadow(0px 16px 32px rgba(44, 74, 26, 0.12))" }}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
