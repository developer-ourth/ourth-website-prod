"use client";

import { useEffect, useState } from "react";
import Link from "next/image";
import NextLink from "next/link";
import { getMarketplaceProducts, getProductImageUrl, type MarketProduct } from "@/lib/api";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

export default function ProductsSection() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();

  const [products, setProducts] = useState<MarketProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMarketplaceProducts({ per_page: 4 })
      .then((res) => {
        setProducts(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to load products for homepage section:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAdd = async (productId: number) => {
    if (!user) {
      router.push("/client/login");
      return;
    }
    try {
      await addToCart(productId, 1);
      alert("Added to cart!");
    } catch (err: any) {
      alert(err?.message ?? "Failed to add product to cart.");
    }
  };

  // Pre-calculated paths for the Leaf Card and Inner Leaf Image Container
  const leafOuterPath = "M 265,15 C 180,15 15,80 15,180 L 15,230 L 25,235 L 15,240 C 15,340 30,450 15,465 C 80,465 265,400 265,300 L 265,250 L 255,245 L 265,240 C 265,180 265,30 265,15 Z";
  const leafInnerPath = "M 225,10 C 150,10 10,40 10,100 C 10,130 18,155 10,160 C 50,160 225,130 225,80 C 225,50 225,20 225,10 Z";

  return (
    <section className="bg-[#FAF8F3] py-20 relative overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6">
        
        {/* Section Heading */}
        <h2 
          className="text-center text-4xl lg:text-[48px] font-bold text-[#0D3A27] mb-16 tracking-tight"
          style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
        >
          Our Products
        </h2>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#76A52E] border-t-transparent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
            {/* Render 4 cards, fill in with mocks if database has less than 4 */}
            {Array.from({ length: 4 }).map((_, index) => {
              const product = products[index];

              // Mock details if no database product is found at this slot
              const id = product?.id ?? 999 + index;
              const name = product?.name ?? "6N Panipuri Bowls";
              const price = product ? Math.round(parseFloat(product.discounted_price ?? product.base_price)) : 500;
              const image = product ? getProductImageUrl(product.primary_image_url, product.name) : "/images/decor/product_stack.webp";
              const isReal = !!product;

              return (
                <div key={id} className="relative w-[280px] h-[480px] flex-shrink-0 select-none group">
                  {/* Figma Card Image Backdrop */}
                  <img
                    src="/images/home/productcard.png"
                    alt="Card Background"
                    className="absolute inset-0 w-full h-full object-contain drop-shadow-[0px_4px_4px_rgba(0,0,0,0.15)] group-hover:drop-shadow-[0px_8px_8px_rgba(0,0,0,0.2)] transition-all duration-300 pointer-events-none"
                  />

                  {/* Card Content overlay */}
                  <div className="relative z-10 w-full h-full p-6 flex flex-col justify-between items-start">
                    {/* Top Leaf Image Container */}
                    <div className="relative w-full h-[180px] mt-2 flex items-center justify-center">
                      {/* Product Image */}
                      <div className="relative z-10 w-[140px] h-[110px] flex items-center justify-center">
                        <img 
                          src={image} 
                          alt={name} 
                          className="max-w-full max-h-full object-contain transform group-hover:scale-105 transition-all duration-300"
                        />
                      </div>
                    </div>

                    {/* Product Metadata */}
                    <div className="w-full px-4 space-y-2 mt-4 flex-grow flex flex-col justify-start">
                      <h3 className="text-[20px] font-bold text-black leading-tight line-clamp-2">
                        {name}
                      </h3>
                      <p className="text-[18px] font-black text-black leading-none">
                        ₹{price}
                      </p>
                      
                      {/* Packs list */}
                      <div className="text-[14px] text-gray-700 font-semibold space-y-0.5 pt-1">
                        <p>Pack of 50</p>
                        <p>Pack of 100</p>
                      </div>
                    </div>

                    {/* Centered Add Button */}
                    <div className="w-full flex justify-center pb-6">
                      <button
                        onClick={() => isReal ? handleAdd(product.id) : router.push("/client/login")}
                        className="w-[125px] h-[36px] bg-white border-[1.5px] border-black rounded-[30px] text-[16px] font-semibold text-black hover:bg-neutral-100 active:scale-95 transition-all flex items-center justify-center"
                      >
                        Add
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Marketplace Navigation Link */}
        <div className="flex justify-end mt-16 max-w-[1200px] mx-auto">
          <NextLink
            href="/products"
            className="flex items-center justify-between px-6 w-[200px] h-[48px] bg-[#9BDFF2] rounded-[30px] text-[18px] font-bold text-black hover:opacity-90 transition-all"
          >
            <span>Marketplace</span>
            <div className="w-8 h-8 rounded-full bg-[#EBF4FC] flex items-center justify-center">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </NextLink>
        </div>

      </div>
    </section>
  );
}
