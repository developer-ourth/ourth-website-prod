"use client";
import Image from "next/image";
import toast from "react-hot-toast";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMarketplaceProducts, getCategories, getProductImageUrl, type MarketProduct } from "@/lib/api";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function ProductCardCell({
  product,
  index,
  selectedPacks,
  setSelectedPacks,
  handleAdd,
}: {
  product: MarketProduct;
  index: number;
  selectedPacks: Record<number, number>;
  setSelectedPacks: React.Dispatch<React.SetStateAction<Record<number, number>>>;
  handleAdd: (productId: number) => Promise<void>;
}) {
  const { openQuickView } = useCart();
  const image = getProductImageUrl(product.primary_image_url, product.name);
  const packs = product.packs?.filter((p: any) => p.is_active) ?? [];
  const selPackId = selectedPacks[product.id];
  const selPack = selPackId ? packs.find((p: any) => p.id === selPackId) : undefined;
  const basePriceNum = Math.round(parseFloat(selPack ? selPack.base_price : product.base_price));
  const price = selPack
    ? Math.round(parseFloat(selPack.discounted_price ?? selPack.base_price))
    : Math.round(parseFloat(product.discounted_price ?? product.base_price));

  const categoryColors = [
    "bg-[#DCEEFB]",
    "bg-[#FBEFC9]",
  ];
  const bgColor = categoryColors[index % categoryColors.length];

  return (
    <div className={`flex flex-col justify-between p-6 sm:p-8 transition-colors hover:opacity-90 rounded-2xl ${bgColor}`}>
      {/* Top Image box with Quick View Overlay */}
      <div
        onClick={() => openQuickView(product)}
        className="relative w-[150px] h-[150px] sm:w-[160px] sm:h-[160px] mx-auto flex items-center justify-center group/img transition-all cursor-pointer rounded-2xl overflow-hidden"
      >
        <Image
          src={image}
          alt={product.name}
          width={160}
          height={160}
          className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105"
        />
        <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px] opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="px-3.5 py-1.5 rounded-full bg-white text-[#0D3A27] font-extrabold text-xs shadow-lg flex items-center gap-1 scale-90 group-hover/img:scale-100 transition-transform">
            ⚡ Quick View
          </span>
        </div>
      </div>

      {/* Product Title & Price */}
      <div className="mt-6 text-left" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
        <Link href={`/products/${product.slug || product.sku || product.id}`} className="block">
          <h3 className="font-bold text-base sm:text-lg text-gray-900 leading-snug hover:text-[#0D3A27] transition-colors">{product.name}</h3>
        </Link>
        <p className="font-bold text-base sm:text-lg text-gray-900 mt-1 flex items-center gap-1.5">
          ₹{price}
          {basePriceNum > price && (
            <span className="text-xs sm:text-sm font-medium text-gray-500 line-through">₹{basePriceNum}</span>
          )}
        </p>
      </div>

      {/* Bottom Pack Options & Add Button */}
      <div className="mt-6 flex items-end justify-between gap-4 pt-2" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
        {/* Left: Stacked pack options */}
        <div className="flex flex-col gap-1 text-left text-sm sm:text-base text-gray-800">
          {packs.length > 0 ? (
            packs.map((pack: any) => {
              const isSelected = selPackId === pack.id || (!selPackId && pack === packs[0]);
              return (
                <button
                  key={pack.id}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedPacks(prev => ({
                      ...prev,
                      [product.id]: pack.id
                    }));
                  }}
                  className={`text-left transition-all ${
                    isSelected
                      ? "font-bold text-black underline underline-offset-4 decoration-2 decoration-[#0D3A27]"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  {pack.name}
                </button>
              );
            })
          ) : (
            <span className="text-gray-700">Standard Pack</span>
          )}
        </div>

        {/* Right: Add Button exactly like image */}
        <button
          onClick={() => handleAdd(product.id)}
          className="px-6 py-2 rounded-lg text-sm sm:text-base font-medium text-black bg-white hover:bg-gray-50 shadow-sm hover:shadow active:scale-95 transition-all flex-shrink-0"
        >
          Add
        </button>
      </div>
    </div>
  );
}

function ProductsPageContent() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();


  const searchParams = useSearchParams();
  const searchParam = searchParams.get("search") || "";

  const [products, setProducts] = useState<MarketProduct[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParam);

  useEffect(() => {
    setSearchQuery(searchParam);
  }, [searchParam]);
  // Track selected pack per product ID: { [productId]: packId }
  const [selectedPacks, setSelectedPacks] = useState<Record<number, number>>({});

  useEffect(() => {
    Promise.all([
      getMarketplaceProducts({ per_page: 40 }),
      getCategories()
    ])
      .then(([prodRes, catRes]) => {
        const prods = prodRes.data || [];
        setProducts(prods);
        setCategories(catRes.data || []);

        const initialPacks: Record<number, number> = {};
        prods.forEach(p => {
          const activePacks = p.packs?.filter((pack: any) => pack.is_active) || [];
          if (activePacks.length > 0) {
            const pack50 = activePacks.find((pack: any) => pack.name?.includes('50'));
            initialPacks[p.id] = pack50 ? pack50.id : activePacks[0].id;
          }
        });
        setSelectedPacks(initialPacks);
      })
      .catch((err) => {
        console.error("Failed to load marketplace page data:", err);
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
      // Context already toasts error
    }
  };

  // Filtered products for "All Products" section based on category selection and search
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory ? p.category_id === selectedCategory : true;
    const matchesSearch = searchQuery 
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    return matchesCategory && matchesSearch;
  });

  // Best selling products (top 4)
  const bestSellers = products.slice(0, 4);

  // New Arrivals products (first two)
  const arrival1 = products[0];
  const arrival2 = products[1];

  const arrival1Img = arrival1
    ? getProductImageUrl(arrival1.primary_image_url, arrival1.name)
    : "/images/home/productcard.webp";
  const arrival2Img = arrival2
    ? getProductImageUrl(arrival2.primary_image_url, arrival2.name)
    : "/images/home/productcard.webp";

  const arrival1Name = arrival1?.name ?? "Eco Tableware Set";
  const arrival2Name = arrival2?.name ?? "Compostable Bowl Pack";

  // Category card styles
  const categoryColors = [
    { bg: "bg-[#DCEEFB]", text: "text-[#1B6A9E]" },
    { bg: "bg-[#FBEFC9]", text: "text-[#5E3A16]" },
    { bg: "bg-[#E8F0D8]", text: "text-[#2B4D0E]" },
    { bg: "bg-[#FDE8E8]", text: "text-[#C81E1E]" },
  ];

  return (
    <main className="min-h-screen bg-[#FAF8F3]">

      {/* 1. Header Hero Banner */}
      <section className="relative w-full mt-[70px] lg:mt-[95px] overflow-hidden bg-[#7c5835]">
        <Image
          src="/images/hero/best-value-banner.png"
          alt="Best Value Banner"
          width={1920}
          height={650}
          className="w-full h-auto block object-contain"
          priority
        />
      </section>

      {/* Loading state indicator */}
      {loading ? (
        <div className="py-20 max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 bg-[#FAF8F3] max-w-[1580px] mx-auto overflow-hidden rounded-[5px]">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col justify-between p-8 h-[430px] bg-[#FAF8F3] rounded-2xl">
                <Skeleton className="w-[171px] h-[154px] bg-gray-200 mx-auto" />
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-6 w-3/4 bg-gray-200" />
                  <Skeleton className="h-6 w-1/4 bg-gray-200" />
                </div>
                <Skeleton className="h-8 w-1/2 mt-auto bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* 2. Our Best selling Products */}
          <section className="py-20 max-w-[1400px] mx-auto px-6">
            <div className="text-center mb-12">
              <h2
                className="text-3xl lg:text-[40px] font-bold text-[#2B4D0E] mb-3"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
              >
                Our Best Selling Products
              </h2>
              <p className="text-[#5E3A16] font-medium text-lg max-w-[600px] mx-auto opacity-80">
                Customer favorites across India — 100% natural, leak-proof, and compostable right after your meal.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-[#FAF8F3] max-w-[1580px] mx-auto overflow-hidden gap-4">
              {bestSellers.length === 0 ? (
                <div className="col-span-full text-center py-12 bg-white/70 rounded-2xl border border-[#2B4D0E]/20 p-8 max-w-xl mx-auto shadow-sm">
                  <p className="text-gray-700 text-lg font-bold mb-2">No products loaded right now</p>
                  <p className="text-gray-500 text-sm">Please ensure the local API server (<code className="bg-gray-100 px-1.5 py-0.5 rounded">php artisan serve</code>) is active on port 8000.</p>
                </div>
              ) : (
                bestSellers.map((product, index) => (
                  <ProductCardCell
                    key={product.id}
                    product={product}
                    index={index}
                    selectedPacks={selectedPacks}
                    setSelectedPacks={setSelectedPacks}
                    handleAdd={handleAdd}
                  />
                ))
              )}
            </div>
          </section>

          {/* 3. Different Types of Categories */}
          <section className="py-16 bg-[#FAF8F3] border-t border-b border-gray-200/60">
            <div className="max-w-[1400px] mx-auto px-6">
              <h2
                className="text-center text-3xl lg:text-[40px] font-bold text-gray-900 mb-12"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
              >
                Shop by Category
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {(categories.length > 0 ? categories.slice(0, 4) : ["Dona (Bowls)", "Plates", "Oval Platters", "Sporks"]).map((cat, i) => {
                  const name = typeof cat === "string" ? cat : cat.name;
                  const id = typeof cat === "string" ? null : cat.id;
                  const color = categoryColors[i % categoryColors.length];

                  // Find a product in this category to use as the thumbnail
                  const catProducts = products.filter((p) => p.category_id === id);
                  const catImage = catProducts.length > 0
                    ? getProductImageUrl(catProducts[0].primary_image_url, catProducts[0].name)
                    : "/images/home/productcard.webp";

                  return (
                    <button
                      key={i}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedCategory(selectedCategory === id ? null : id);
                        setTimeout(() => {
                          const el = document.getElementById('all-products');
                          if (el) {
                            const y = el.getBoundingClientRect().top + window.scrollY - 100;
                            window.scrollTo({ top: y, behavior: 'smooth' });
                          }
                        }, 50);
                      }}
                      className={`flex flex-col items-center justify-between p-7 rounded-[22px] border-2 transition-all duration-300 shadow-sm hover:shadow-lg ${color.bg} ${selectedCategory === id ? "border-[#0D3A27] ring-4 ring-[#0D3A27]/15 scale-[1.02] bg-white shadow-md" : "border-transparent hover:-translate-y-1.5"}`}
                    >
                      <span className={`font-bold text-lg sm:text-xl ${color.text} mb-4`}>{name}</span>
                      <div className="w-[130px] h-[95px] flex items-center justify-center">
                        <Image src={catImage} alt={name} width={130} height={95} className="max-h-full max-w-full object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 4. New Arrivals & Trending Products */}
          <section className="py-20 max-w-[1400px] mx-auto px-6">
            <h2
              className="text-center text-3xl lg:text-[40px] font-bold text-[#103F5E] mb-12"
              style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
              New Arrivals & Trending Products
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Card 1: Modern Elegant Light Aura */}
              <div className="relative overflow-hidden w-full max-w-[776px] min-h-[450px] bg-gradient-to-br from-white via-white/95 to-[#FAF8F3] border border-gray-200/80 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-8 sm:p-10 flex flex-col md:flex-row items-center gap-8 group hover:shadow-[0_25px_60px_rgba(16,63,94,0.14)] transition-all duration-500 hover:-translate-y-1">
                {/* Subtle ambient light gradient */}
                <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#E8F0D8]/40 blur-3xl pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-60"></div>
                
                {/* Image Showcase Podium */}
                <Link
                  href={arrival1 ? `/products/${arrival1.slug || arrival1.sku || arrival1.id}` : "#"}
                  className="relative w-[260px] h-[260px] sm:w-[280px] sm:h-[280px] rounded-[26px] bg-gradient-to-b from-[#FAF8F3] to-[#F2EEDD] p-6 flex items-center justify-center flex-shrink-0 shadow-inner overflow-hidden border border-[#E6E0D0]/70 group/img block"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-white opacity-0 group-hover/img:opacity-100 transition-opacity duration-500"></div>
                  <Image
                    src={arrival1Img}
                    alt={arrival1Name}
                    width={240}
                    height={220}
                    className="max-w-[210px] max-h-[200px] object-contain drop-shadow-xl transition-transform duration-500 group-hover/img:scale-110 relative z-10"
                  />
                </Link>

                {/* Typography & CTA */}
                <div className="flex-1 flex flex-col justify-between h-full py-2 text-left relative z-10" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#103F5E]/8 text-[#103F5E] font-bold text-xs tracking-wider uppercase border border-[#103F5E]/15 mb-4 shadow-2xs">
                      <span>✨</span>
                      <span>Featured Arrival</span>
                    </span>
                    <Link href={arrival1 ? `/products/${arrival1.slug || arrival1.sku || arrival1.id}` : "#"} className="block">
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-[#103F5E] tracking-tight group-hover:text-[#0D3A27] transition-colors leading-tight">
                        {arrival1Name}
                      </h3>
                    </Link>
                    <p className="text-gray-600 text-base sm:text-lg font-normal leading-relaxed mt-3.5 line-clamp-3 opacity-90">
                      {arrival1?.description || "If you want Healing OURTH to be perceived like Apple, Nike, or Tesla rather than a traditional eco brand."}
                    </p>
                  </div>

                  {arrival1 && (
                    <div className="pt-6">
                      <Link
                        href={`/products/${arrival1.slug || arrival1.sku || arrival1.id}`}
                        className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full font-bold text-sm sm:text-base bg-[#103F5E] text-white shadow-[0_10px_25px_rgba(16,63,94,0.25)] hover:bg-[#0c2f47] hover:shadow-[0_15px_30px_rgba(16,63,94,0.35)] active:scale-[0.98] transition-all duration-300 w-fit group/btn"
                      >
                        <span>Explore Product</span>
                        <span className="transition-transform duration-300 group-hover/btn:translate-x-1.5">→</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Card 2: Modern Elegant Deep Dark Edition */}
              <div className="relative overflow-hidden w-full max-w-[776px] min-h-[450px] bg-gradient-to-br from-[#103F5E] via-[#0C314A] to-[#082234] border border-white/15 rounded-[32px] shadow-[0_20px_50px_rgba(16,63,94,0.3)] p-8 sm:p-10 flex flex-col md:flex-row-reverse items-center gap-8 group hover:shadow-[0_25px_60px_rgba(16,63,94,0.45)] transition-all duration-500 hover:-translate-y-1">
                {/* Radial luxury ambient glow */}
                <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-[#E8F0D8]/15 blur-3xl pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-60"></div>

                {/* Image Showcase Podium */}
                <Link
                  href={arrival2 ? `/products/${arrival2.slug || arrival2.sku || arrival2.id}` : "#"}
                  className="relative w-[260px] h-[260px] sm:w-[280px] sm:h-[280px] rounded-[26px] bg-gradient-to-b from-white/15 to-white/5 backdrop-blur-xl p-6 flex items-center justify-center flex-shrink-0 shadow-2xl border border-white/20 group/img overflow-hidden block"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-0 group-hover/img:opacity-100 transition-opacity duration-500"></div>
                  <Image
                    src={arrival2Img}
                    alt={arrival2Name}
                    width={240}
                    height={220}
                    className="max-w-[210px] max-h-[200px] object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover/img:scale-110 relative z-10"
                  />
                </Link>

                {/* Typography & CTA */}
                <div className="flex-1 flex flex-col justify-between h-full py-2 text-left relative z-10" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E8F0D8]/15 text-[#E8F0D8] font-bold text-xs tracking-wider uppercase border border-[#E8F0D8]/30 mb-4 shadow-2xs">
                      <span>👑</span>
                      <span>Premium Trending</span>
                    </span>
                    <Link href={arrival2 ? `/products/${arrival2.slug || arrival2.sku || arrival2.id}` : "#"} className="block">
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-[#EDE8DC] tracking-tight group-hover:text-white transition-colors leading-tight">
                        {arrival2Name}
                      </h3>
                    </Link>
                    <p className="text-blue-100/80 text-base sm:text-lg font-normal leading-relaxed mt-3.5 line-clamp-3">
                      {arrival2?.description && arrival2.description !== arrival2.name && !arrival2.description.includes(arrival2.name)
                        ? arrival2.description
                        : "Leak-resistant, natural insulation bowls engineered for hot gravies, curries, and modern culinary presentations."}
                    </p>
                  </div>

                  {arrival2 && (
                    <div className="pt-6">
                      <Link
                        href={`/products/${arrival2.slug || arrival2.sku || arrival2.id}`}
                        className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full font-bold text-sm sm:text-base bg-[#E8F0D8] text-[#103F5E] shadow-[0_10px_25px_rgba(232,240,216,0.2)] hover:bg-white hover:shadow-[0_15px_30px_rgba(255,255,255,0.3)] active:scale-[0.98] transition-all duration-300 w-fit group/btn"
                      >
                        <span>Explore Product</span>
                        <span className="transition-transform duration-300 group-hover/btn:translate-x-1.5">→</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </section>

          {/* 5. All Products */}
          <section className="py-20 max-w-[1400px] mx-auto px-6 border-t border-gray-200/60" id="all-products">
            <div className="flex flex-col md:flex-row items-center justify-center mb-12 gap-6">
              <h2
                className="text-3xl lg:text-[40px] font-bold text-[#5E3A16]"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
              >
                All Products
              </h2>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white border border-gray-200 rounded-3xl shadow-sm">
                <p className="text-gray-500 font-semibold text-lg">No products found matching your selection.</p>
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="mt-4 px-6 py-2 rounded-full bg-[#0D3A27] text-white text-sm font-bold hover:bg-[#155338] transition-all"
                  >
                    View All Categories
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-[#FAF8F3] max-w-[1580px] mx-auto overflow-hidden gap-4">
                {filteredProducts.map((product, index) => (
                  <ProductCardCell
                    key={product.id}
                    product={product}
                    index={index}
                    selectedPacks={selectedPacks}
                    setSelectedPacks={setSelectedPacks}
                    handleAdd={handleAdd}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-[#25784C] border-t-transparent rounded-full"></div>
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}
