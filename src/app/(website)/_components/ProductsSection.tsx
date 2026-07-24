"use client";
import Image from "next/image";
import toast from "react-hot-toast";

import { useEffect, useState, useRef, useCallback } from "react";
import NextLink from "next/link";
import { getMarketplaceProducts, getProductImageUrl, type MarketProduct } from "@/lib/api";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

export default function ProductsSection() {
  const { user } = useAuth();
  const { addToCart, openQuickView } = useCart();
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
    } catch (err: any) {
      // Context handles error
    }
  };

  // Pre-calculated paths for the Leaf Card and Inner Leaf Image Container
  const leafOuterPath = "M 265,15 C 180,15 15,80 15,180 L 15,230 L 25,235 L 15,240 C 15,340 30,450 15,465 C 80,465 265,400 265,300 L 265,250 L 255,245 L 265,240 C 265,180 265,30 265,15 Z";
  const leafInnerPath = "M 225,10 C 150,10 10,40 10,100 C 10,130 18,155 10,160 C 50,160 225,130 225,80 C 225,50 225,20 225,10 Z";

  return (
    <section className="bg-[#FAF8F3] pt-4 pb-10 sm:pb-20 relative overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        
        {/* Section Heading */}
        <h2 
          className="text-center text-2xl sm:text-4xl lg:text-[48px] font-bold text-[#0D3A27] mb-8 sm:mb-16 tracking-tight"
          style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
        >
          Our Products
        </h2>

        {/* Product Cards */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#76A52E] border-t-transparent" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-white/60 rounded-2xl border border-[#0D3A27]/10 max-w-md mx-auto p-6">
            <p className="text-gray-600 font-medium font-['IBM_Plex_Sans'] mb-4">
              Our latest products are currently being updated. Visit our marketplace or check back shortly!
            </p>
            <NextLink
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0D3A27] text-white font-bold text-sm hover:bg-[#155338] transition"
            >
              Go to Marketplace →
            </NextLink>
          </div>
        ) : (
          <>
          {/* Desktop: 4-col grid */}
          <div className="hidden xl:grid grid-cols-4 gap-8 justify-items-center">
            {products.slice(0, 4).map((product) => {
              const id = product.id;
              const name = product.name;
              const activePacks = product?.packs?.filter(p => p.is_active) ?? [];
              const selPackId = selectedPacks[product.id];
              const selPack = selPackId ? activePacks.find(p => p.id === selPackId) : undefined;
              const price = selPack
                ? Math.round(parseFloat(selPack.discounted_price ?? selPack.base_price))
                : Math.round(parseFloat(product.discounted_price ?? product.base_price));
              const image = getProductImageUrl(product.primary_image_url, product.name);

              return (
                <div key={id} className="relative w-[280px] h-[480px] flex-shrink-0 select-none group">
                  {/* Figma Card Image Backdrop */}
                      <Image
                        src="/images/home/productcard.webp"
                        alt="Card Background"
                        fill
                        sizes="280px"
                        className="object-contain drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300 pointer-events-none"
                      />

                  {/* Card Content overlay */}
                  <div className="relative z-10 w-full h-full p-6 flex flex-col justify-between items-start">
                    {/* Top Leaf Image Container with Quick View Trigger */}
                    <div
                      onClick={() => openQuickView(product)}
                      className="relative w-full h-[180px] mt-2 flex items-center justify-center cursor-pointer group/img block"
                    >
                      <div className="relative z-10 w-[190px] h-[150px] flex items-center justify-center">
                        <Image 
                          src={image} 
                          alt={name}
                          width={190}
                          height={150} 
                          className="max-w-full max-h-full object-contain transform group-hover/img:scale-105 transition-all duration-300"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-xl z-20">
                        <span className="px-3.5 py-1.5 rounded-full bg-white text-[#0D3A27] font-extrabold text-xs shadow-lg flex items-center gap-1 scale-90 group-hover/img:scale-100 transition-transform">
                          ⚡ Quick View
                        </span>
                      </div>
                    </div>
 
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
                                    [product.id]: prev[product.id] === pk.id ? undefined! : pk.id
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


                    {/* Action Button: White pill button with black border matching Figma */}
                    <div className="w-full flex justify-center pb-6">
                      <button
                        onClick={() => handleAdd(product.id)}
                        className="w-[115px] h-[34px] bg-white border border-black/15 rounded-[30px] text-[15px] font-semibold text-black hover:bg-neutral-50 active:scale-95 transition-all flex items-center justify-center shadow-sm"
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
          <div className="xl:hidden relative">
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
              {products.slice(0, 4).map((product) => {
                const id = product.id;
                const name = product.name;
                const activePacks = product?.packs?.filter(p => p.is_active) ?? [];
                const selPackId = selectedPacks[product.id];
                const selPack = selPackId ? activePacks.find(p => p.id === selPackId) : undefined;
                const price = selPack
                  ? Math.round(parseFloat(selPack.discounted_price ?? selPack.base_price))
                  : Math.round(parseFloat(product.discounted_price ?? product.base_price));
                const image = getProductImageUrl(product.primary_image_url, product.name);

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
                        className="object-contain drop-shadow-sm pointer-events-none"
                      />
                      <div className="relative z-10 w-full h-full p-3 sm:p-5 flex flex-col justify-between items-start">
                        <div
                          onClick={() => openQuickView(product)}
                          className="relative w-full h-[40%] mt-1 flex items-center justify-center cursor-pointer group/img block"
                        >
                          <div className="relative z-10 w-[100px] sm:w-[170px] h-[80px] sm:h-[130px] flex items-center justify-center">
                            <Image src={image} alt={name} width={170} height={130} className="max-w-full max-h-full object-contain" />
                          </div>
                          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-xl z-20">
                            <span className="px-3 py-1 rounded-full bg-white text-[#0D3A27] font-extrabold text-[11px] shadow-md flex items-center gap-1 scale-90 group-hover/img:scale-100 transition-transform">
                              ⚡ Quick View
                            </span>
                          </div>
                        </div>
                        <div className="w-full px-2 sm:px-3 space-y-1 flex-grow flex flex-col justify-start">
                          <NextLink href={`/products/${id}`} className="hover:underline block">
                            <h3 className="text-[12px] sm:text-[17px] font-bold text-black leading-tight line-clamp-2">{name}</h3>
                          </NextLink>
                          <p className="text-[12px] sm:text-[16px] font-black text-black leading-none">₹{price}</p>
                          {activePacks.length > 0 && (
                            <div className="text-[10px] sm:text-[13px] font-semibold space-y-0.5 pt-0.5">
                              {activePacks.map((pk) => {
                                const isSelected = selPackId === pk.id;
                                return (
                                  <button
                                    key={pk.id}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setSelectedPacks(prev => ({ ...prev, [product.id]: prev[product.id] === pk.id ? undefined! : pk.id }));
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
                            onClick={() => handleAdd(product.id)}
                            className="w-[100px] sm:w-[115px] h-[30px] sm:h-[34px] bg-white border border-black/15 rounded-[30px] text-[13px] sm:text-[15px] font-semibold text-black hover:bg-neutral-50 active:scale-95 transition-all flex items-center justify-center shadow-sm"
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
        <div className="flex justify-center sm:justify-end mt-8 sm:mt-16 max-w-[1200px] mx-auto">
          <NextLink
            href="/products"
            className="flex items-center justify-between px-5 sm:px-6 w-[180px] sm:w-[200px] h-[42px] sm:h-[48px] bg-[#9BDFF2] rounded-[30px] text-[16px] sm:text-[18px] font-bold text-black hover:opacity-90 transition-all"
          >
            <span>Marketplace</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#EBF4FC] flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </NextLink>
        </div>

      </div>
    </section>
  );
}
