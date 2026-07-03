"use client";
import Image from "next/image";

import { useEffect, useState, useRef, useCallback } from "react";
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
  // Track selected pack per product: { [productId]: packId }
  const [selectedPacks, setSelectedPacks] = useState<Record<number, number>>({});

  // Carousel state for small screens
  const carouselRef = useRef<HTMLDivElement>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const totalCards = 4;
  const visibleCards = 2;
  const maxIndex = Math.max(0, totalCards - visibleCards);

  const scrollToIndex = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(idx, maxIndex));
    setCarouselIndex(clamped);
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.scrollWidth / totalCards;
      carouselRef.current.scrollTo({ left: cardWidth * clamped, behavior: "smooth" });
    }
  }, [maxIndex]);

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
      const packId = selectedPacks[productId] ?? null;
      await addToCart(productId, 1, packId);
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

        {/* Product Cards */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#76A52E] border-t-transparent" />
          </div>
        ) : (
          <>
          {/* Desktop: 4-col grid */}
          <div className="hidden lg:grid grid-cols-4 gap-8 justify-items-center">
            {/* Render 4 cards, fill in with mocks if database has less than 4 */}
            {Array.from({ length: 4 }).map((_, index) => {
              const product = products[index];

              // Mock details if no database product is found at this slot
              const id = product?.id ?? 999 + index;
              const name = product?.name ?? "6N Panipuri Bowls";
              const isReal = !!product;
              const activePacks = product?.packs?.filter(p => p.is_active) ?? [];
              const selPackId = product ? selectedPacks[product.id] : undefined;
              const selPack = selPackId ? activePacks.find(p => p.id === selPackId) : undefined;
              // Show selected pack price, fallback to product price
              const price = selPack
                ? Math.round(parseFloat(selPack.discounted_price ?? selPack.base_price))
                : product ? Math.round(parseFloat(product.discounted_price ?? product.base_price)) : 500;
              const image = product ? getProductImageUrl(product.primary_image_url, product.name) : "/images/decor/product_stack.webp";

              return (
                <div key={id} className="relative w-[280px] h-[480px] flex-shrink-0 select-none group">
                  {/* Figma Card Image Backdrop */}
                      <Image
                        src="/images/home/productcard.webp"
                        alt="Card Background"
                        fill
                        sizes="280px"
                        className="object-contain drop-shadow-[0px_4px_4px_rgba(0,0,0,0.15)] group-hover:drop-shadow-[0px_8px_8px_rgba(0,0,0,0.2)] transition-all duration-300 pointer-events-none"
                      />

                  {/* Card Content overlay */}
                  <div className="relative z-10 w-full h-full p-6 flex flex-col justify-between items-start">
                    {/* Top Leaf Image Container (Clickable link to details page) */}
                    <NextLink href={`/products/${id}`} className="relative w-full h-[180px] mt-2 flex items-center justify-center hover:opacity-90 block">
                      {/* Product Image */}
                      <div className="relative z-10 w-[140px] h-[110px] flex items-center justify-center">
                        <Image 
                          src={image} 
                          alt={name}
                          width={140}
                          height={110} 
                          className="max-w-full max-h-full object-contain transform group-hover:scale-105 transition-all duration-300"
                        />
                      </div>
                    </NextLink>
 
                    {/* Product Metadata (Clickable link to details page) */}
                    <div className="w-full px-4 space-y-2 mt-4 flex-grow flex flex-col justify-start">
                      <NextLink href={`/products/${id}`} className="hover:underline block">
                        <h3 className="text-[20px] font-bold text-black leading-tight line-clamp-2">
                          {name}
                        </h3>
                      </NextLink>
                      <p className="text-[18px] font-black text-black leading-none">
                        ₹{price}
                      </p>
                      
                      {/* Selectable Packs list – linked from backend */}
                      {activePacks.length > 0 && (
                        <div className="text-[14px] font-semibold space-y-1 pt-1">
                          {activePacks.map((pk) => {
                            const isSelected = selPackId === pk.id;
                            return (
                              <button
                                key={pk.id}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setSelectedPacks(prev => ({
                                    ...prev,
                                    [product!.id]: prev[product!.id] === pk.id ? undefined! : pk.id
                                  }));
                                }}
                                className={`block w-full text-left px-2 py-0.5 rounded-md transition-all ${
                                  isSelected
                                    ? "bg-[#76A52E]/15 text-[#2B4D0E] ring-1 ring-[#76A52E]/40"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`}
                              >
                                {pk.name}
                              </button>
                            );
                          })}
                        </div>
                      )}
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

          {/* Mobile/Tablet: Carousel showing 2 at a time */}
          <div className="lg:hidden relative">
            {/* Left Arrow */}
            {carouselIndex > 0 && (
              <button
                onClick={() => scrollToIndex(carouselIndex - 1)}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all -ml-2"
                aria-label="Previous products"
              >
                <svg className="w-5 h-5 text-[#0D3A27]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Right Arrow */}
            {carouselIndex < maxIndex && (
              <button
                onClick={() => scrollToIndex(carouselIndex + 1)}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all -mr-2"
                aria-label="Next products"
              >
                <svg className="w-5 h-5 text-[#0D3A27]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Scrollable Container */}
            <div
              ref={carouselRef}
              className="flex gap-4 overflow-x-hidden scroll-smooth px-2"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {Array.from({ length: 4 }).map((_, index) => {
                const product = products[index];
                const id = product?.id ?? 999 + index;
                const name = product?.name ?? "6N Panipuri Bowls";
                const isReal = !!product;
                const activePacks = product?.packs?.filter(p => p.is_active) ?? [];
                const selPackId = product ? selectedPacks[product.id] : undefined;
                const selPack = selPackId ? activePacks.find(p => p.id === selPackId) : undefined;
                const price = selPack
                  ? Math.round(parseFloat(selPack.discounted_price ?? selPack.base_price))
                  : product ? Math.round(parseFloat(product.discounted_price ?? product.base_price)) : 500;
                const image = product ? getProductImageUrl(product.primary_image_url, product.name) : "/images/decor/product_stack.webp";

                return (
                  <div
                    key={id}
                    className="relative flex-shrink-0 select-none group"
                    style={{ width: "calc(50% - 8px)", scrollSnapAlign: "start" }}
                  >
                    <div className="relative w-full aspect-[280/480]">
                      <Image
                        src="/images/home/productcard.webp"
                        alt="Card Background"
                        fill
                        sizes="(max-width: 1024px) 50vw, 280px"
                        className="object-contain drop-shadow-[0px_4px_4px_rgba(0,0,0,0.15)] pointer-events-none"
                      />
                      <div className="relative z-10 w-full h-full p-3 sm:p-5 flex flex-col justify-between items-start">
                        <NextLink href={`/products/${id}`} className="relative w-full h-[40%] mt-1 flex items-center justify-center hover:opacity-90 block">
                          <div className="relative z-10 w-[100px] sm:w-[130px] h-[80px] sm:h-[100px] flex items-center justify-center">
                            <Image src={image} alt={name} width={130} height={100} className="max-w-full max-h-full object-contain" />
                          </div>
                        </NextLink>
                        <div className="w-full px-2 sm:px-3 space-y-1 flex-grow flex flex-col justify-start">
                          <NextLink href={`/products/${id}`} className="hover:underline block">
                            <h3 className="text-[14px] sm:text-[17px] font-bold text-black leading-tight line-clamp-2">{name}</h3>
                          </NextLink>
                          <p className="text-[14px] sm:text-[16px] font-black text-black leading-none">₹{price}</p>
                          {activePacks.length > 0 && (
                            <div className="text-[11px] sm:text-[13px] font-semibold space-y-0.5 pt-0.5">
                              {activePacks.map((pk) => {
                                const isSelected = selPackId === pk.id;
                                return (
                                  <button
                                    key={pk.id}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setSelectedPacks(prev => ({ ...prev, [product!.id]: prev[product!.id] === pk.id ? undefined! : pk.id }));
                                    }}
                                    className={`block w-full text-left px-1.5 py-0.5 rounded-md transition-all ${isSelected ? "bg-[#76A52E]/15 text-[#2B4D0E] ring-1 ring-[#76A52E]/40" : "text-gray-700 hover:bg-gray-100"}`}
                                  >
                                    {pk.name}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        <div className="w-full flex justify-center pb-3 sm:pb-5">
                          <button
                            onClick={() => isReal ? handleAdd(product.id) : router.push("/client/login")}
                            className="w-[100px] sm:w-[115px] h-[30px] sm:h-[34px] bg-white border-[1.5px] border-black rounded-[30px] text-[13px] sm:text-[15px] font-semibold text-black hover:bg-neutral-100 active:scale-95 transition-all flex items-center justify-center"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dot Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === carouselIndex ? "bg-[#76A52E] scale-110" : "bg-black/20 hover:bg-black/40"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
          </>
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
