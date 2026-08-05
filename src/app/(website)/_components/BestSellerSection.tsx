"use client";
import Image from "next/image";
import toast from "react-hot-toast";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { getMarketplaceProducts, getProductImageUrl, type MarketProduct } from "@/lib/api";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

export default function BestSellerSection() {
  const { user } = useAuth();
  const { addToCart, openQuickView } = useCart();
  const router = useRouter();

  const [bestSeller, setBestSeller] = useState<MarketProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackId, setSelectedPackId] = useState<number | null>(null);

  useEffect(() => {
    getMarketplaceProducts({ per_page: 20 })
      .then((res) => {
        const prods = res.data || [];
        // Robust fallback: by ID, then by name, then first available
        const targetProduct = prods.find((p) => p.id === 23) || prods.find((p) => p.name.includes("Dinner Party")) || prods[0];
        
        if (targetProduct) {
          setBestSeller(targetProduct);
          const activePacks = targetProduct.packs?.filter(pack => pack.is_active) || [];
          if (activePacks.length > 0) {
            setSelectedPackId(activePacks[0].id);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load best seller:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading || !bestSeller) {
    return null;
  }

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add items to your cart.");
      router.push("/login");
      return;
    }
    const packId = selectedPackId;
    if (bestSeller.packs && bestSeller.packs.length > 0 && !packId) {
      toast.error("Please select a pack.");
      return;
    }
    addToCart(bestSeller.id, packId || undefined, 1);
  };

  const image = getProductImageUrl(bestSeller.primary_image_url, bestSeller.name);
  const activePacks = bestSeller.packs?.filter(pack => pack.is_active) || [];
  const selPack = activePacks.find(p => p.id === selectedPackId);
  const basePriceNum = Math.round(parseFloat(selPack ? selPack.base_price : bestSeller.base_price));
  const price = selPack
    ? Math.round(parseFloat(selPack.discounted_price ?? selPack.base_price))
    : Math.round(parseFloat(bestSeller.discounted_price ?? bestSeller.base_price));

  return (
    <section className="relative w-full py-16 sm:py-24 bg-[#FAF8F3] overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <Image src="/images/home/texture.webp" alt="texture" fill className="object-cover mix-blend-multiply" />
      </div>

      <div className="mx-auto max-w-[1200px] px-6 sm:px-12 relative z-10 flex flex-col md:flex-row items-center gap-12 lg:gap-20">
        
        {/* Left Side: Image Presentation */}
        <div className="w-full md:w-1/2 flex justify-center relative">
          <div className="relative w-full max-w-[400px] aspect-square rounded-[3rem] sm:rounded-[4rem] overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500 cursor-pointer" onClick={() => openQuickView(bestSeller)}>
            <Image 
              src={image} 
              alt={bestSeller.name} 
              fill 
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-cover"
            />
            {/* Overlay Badge */}
            <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FF7A00] to-[#FF9900] text-white text-xs sm:text-sm font-black uppercase tracking-widest shadow-lg">
                🔥 Best Seller
              </div>
            </div>
          </div>
          
          {/* Decorative background leaf/blob */}
          <div className="absolute -z-10 -bottom-8 -right-8 w-64 h-64 bg-[#76A52E]/20 rounded-full blur-3xl"></div>
          <div className="absolute -z-10 -top-8 -left-8 w-64 h-64 bg-[#C98A2E]/20 rounded-full blur-3xl"></div>
        </div>

        {/* Right Side: Product Details */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left space-y-6 sm:space-y-8">
          <div className="space-y-4">
            <h2 className="text-[32px] sm:text-[40px] lg:text-[48px] font-black text-[#0D3A27] leading-tight font-serif">
              {bestSeller.name}
            </h2>
            <p className="text-[#0D3A27]/70 text-sm sm:text-base font-medium max-w-md">
              Our most loved collection! Elevate your next gathering with our 100% organic, biodegradable dinner party pack. Good for you, great for the planet.
            </p>
          </div>

          <div className="text-[28px] sm:text-[36px] font-black text-[#0D3A27] flex items-center gap-2">
            ₹{price}
            {basePriceNum > price && (
              <span className="text-[20px] sm:text-[24px] font-medium text-gray-500 line-through">₹{basePriceNum}</span>
            )}
          </div>

          {/* Pack Selection */}
          {activePacks.length > 0 && (
            <div className="space-y-3 w-full">
              <label className="text-sm font-bold text-[#0D3A27]/80 uppercase tracking-wider block">Choose Pack Size</label>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                {activePacks.map((pk) => {
                  const isSelected = selectedPackId === pk.id;
                  return (
                    <button
                      key={pk.id}
                      onClick={() => setSelectedPackId(pk.id)}
                      className={`px-5 py-2.5 rounded-full text-sm font-extrabold transition-all duration-300 border-2 ${
                        isSelected 
                          ? 'border-[#76A52E] bg-[#76A52E] text-white shadow-md transform scale-105' 
                          : 'border-[#76A52E]/30 text-[#76A52E] hover:border-[#76A52E] bg-white'
                      }`}
                    >
                      {pk.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
            <button
              onClick={handleAddToCart}
              className="w-full sm:w-auto px-10 py-4 bg-[#0D3A27] text-white rounded-full font-bold text-[15px] sm:text-[17px] hover:bg-[#76A52E] transition-colors shadow-xl hover:shadow-2xl active:scale-95"
            >
              Add To Cart
            </button>
            <NextLink href={`/products/${bestSeller.id}`} className="w-full sm:w-auto text-center px-10 py-4 bg-white text-[#0D3A27] border-2 border-[#0D3A27] rounded-full font-bold text-[15px] sm:text-[17px] hover:bg-[#EBF2E4] transition-colors shadow-md hover:shadow-lg active:scale-95">
              View Details
            </NextLink>
          </div>
        </div>
      </div>
    </section>
  );
}
