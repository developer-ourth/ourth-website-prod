"use client";

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
      alert(err?.message ?? "Failed to add item to cart.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="relative max-w-[1580px] mx-auto px-4 sm:px-8 py-8">
      {/* Product Card Container */}
      <div
        className={`flex flex-col lg:flex-row items-center justify-between gap-12 rounded-[50px] border border-white/40 p-12 md:p-16 lg:p-20 shadow-[0_24px_70px_rgba(44,74,26,0.08)] overflow-hidden relative z-20 ${
          isEvenRow ? "lg:flex-row-reverse" : ""
        }`}
        style={
          isEvenRow
            ? {
                background: "rgba(226, 239, 220, 0.45)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }
            : {
                backgroundImage: "url('/images/decor/background.webp')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
              }
        }
      >
        {/* Flanking Palm/Monstera Leaves Overlay inside the card container */}
        {isEvenRow && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-[360px] pointer-events-none z-0 select-none">
              <Image
                src="/images/decor/leaf_left.webp"
                alt=""
                fill
                className="object-contain object-left opacity-90"
              />
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-[360px] pointer-events-none z-0 select-none">
              <Image
                src="/images/decor/leaf_right.webp"
                alt=""
                fill
                className="object-contain object-right opacity-90"
              />
            </div>
          </>
        )}

        {/* Left Column Content card */}
        <div className="w-full lg:w-[45%] flex justify-center relative z-10">
          <div className="w-full max-w-[440px] bg-[#FAF7F2] rounded-[36px] p-10 sm:p-12 lg:p-14 shadow-[0_15px_35px_rgba(44,74,26,0.06)] space-y-6 flex flex-col justify-center min-h-[380px]">
            <div>
              <h2 className="text-4xl sm:text-5xl font-black text-[#2C1F13] tracking-tight">
                {product.category?.name || "Bowls"}
              </h2>
              <Link href={`/products/${product.id}`} className="hover:opacity-85 transition-opacity">
                <h3 className="text-xl sm:text-2xl font-bold text-[#2C1F13] opacity-90 mt-1">
                  {product.name}
                </h3>
              </Link>
            </div>
            
            <p className="text-sm leading-relaxed text-[#2C1F13]/75 max-w-sm">
              {product.description ||
                "Every bowl, plate and tray is pressed from natural leaves, heat-treated for strength, and certified food-safe."}
            </p>

            {/* Pack Size Selector */}
            {product.packs && product.packs.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0D3A27] uppercase tracking-wider block">
                  Select Pack Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.packs.map((pack: any) => {
                    const isSelected = pack.id === selectedPackId;
                    return (
                      <button
                        key={pack.id}
                        onClick={() => setSelectedPackId(pack.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition duration-200 ${
                          isSelected
                            ? "bg-[#0D3A27] text-white border-[#0D3A27] shadow-sm"
                            : "bg-white/70 text-[#2C1F13] border-gray-200 hover:bg-white"
                        }`}
                      >
                        {pack.name} (₹{pack.discounted_price ?? pack.base_price})
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Price and Add-to-cart action */}
            <div className="flex items-center justify-between pt-4 border-t border-[#0D3A27]/10">
              <div>
                <span className="text-xs font-semibold text-gray-500 block">
                  {isB2B && !selectedPack ? "Wholesale Price" : "Price"}
                </span>
                <span className="text-2xl font-black text-[#0D3A27] flex items-center gap-1.5">
                  ₹{parseFloat(price).toFixed(2)}
                  {isB2B && !selectedPack && (
                    <span className="text-[10px] bg-[#25784C]/10 text-[#25784C] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                      B2B
                    </span>
                  )}
                </span>
                {isB2B && minQty > 1 && !selectedPack && (
                  <span className="text-[10px] text-gray-400 block mt-0.5">
                    Min. Qty: {minQty} units
                  </span>
                )}
              </div>
              <button
                onClick={handleAdd}
                disabled={adding}
                className={`rounded-2xl px-6 py-3 text-sm font-bold shadow-sm transition duration-200 ${
                  success
                    ? "bg-green-600 text-white"
                    : "bg-[#25784C] text-[#D8EFE0] hover:bg-[#1a5b36]"
                } disabled:opacity-50`}
              >
                {adding ? "Adding..." : success ? "✓ Added!" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[50%] flex justify-center relative z-10">
          <Link href={`/products/${product.id}`} className="relative h-[360px] w-full max-w-[560px] sm:h-[440px] lg:h-[500px]">
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
