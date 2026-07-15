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
        setProducts(prodRes.data || []);
        setCategories(catRes.data || []);
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

  // Background style matching homepage hero
  const heroBgStyle = {
    backgroundImage: "url('/images/hero/marketbanner.webp')",
    backgroundColor: "#7c5835",
  };

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
      <section
        className="relative w-full h-[220px] sm:h-[400px] md:h-[550px] lg:h-[650px] bg-cover bg-center mt-[70px] lg:mt-[95px]"
        style={heroBgStyle}
      />

      {/* Loading state indicator */}
      {loading ? (
        <div className="py-20 max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 bg-[#FAF8F3] max-w-[1580px] mx-auto overflow-hidden rounded-[5px] border-t border-l border-black">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border-b border-r border-black flex flex-col justify-between p-8 h-[430px] bg-[#FAF8F3]">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-[1580px] mx-auto">
              {bestSellers.length === 0 ? (
                <div className="col-span-full text-center py-12 bg-white/70 rounded-2xl border border-[#2B4D0E]/20 p-8 max-w-xl mx-auto shadow-sm">
                  <p className="text-gray-700 text-lg font-bold mb-2">No products loaded right now</p>
                  <p className="text-gray-500 text-sm">Please ensure the local API server (<code className="bg-gray-100 px-1.5 py-0.5 rounded">php artisan serve</code>) is active on port 8000.</p>
                </div>
              ) : (
                bestSellers.map((product) => {
                  const image = getProductImageUrl(product.primary_image_url, product.name);
                  const packs = product.packs?.filter((p: any) => p.is_active) ?? [];
                const selPackId = product ? selectedPacks[product.id] : undefined;
                const selPack = selPackId ? packs.find((p: any) => p.id === selPackId) : undefined;
                const price = selPack
                  ? Math.round(parseFloat(selPack.discounted_price ?? selPack.base_price))
                  : Math.round(parseFloat(product.discounted_price ?? product.base_price));

                return (
                  <div
                    key={product.id}
                    className="group bg-white rounded-[20px] border border-[#2B4D0E]/15 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between p-6 relative overflow-hidden"
                  >
                    {/* Bestseller badge */}
                    <div className="absolute top-4 left-4 z-10 bg-[#E8F0D8] text-[#2B4D0E] font-bold text-xs px-3 py-1 rounded-full border border-[#2B4D0E]/20 shadow-sm flex items-center gap-1">
                      <span>🔥</span>
                      <span>Bestseller</span>
                    </div>

                    {/* Product image box */}
                    <Link
                      href={`/products/${product.id}`}
                      className="w-full h-[190px] bg-[#FAF8F3] rounded-[14px] flex items-center justify-center overflow-hidden mb-5 group-hover:bg-[#F5F2EA] transition-colors relative"
                    >
                      <Image
                        src={image}
                        alt={product.name}
                        width={160}
                        height={150}
                        className="max-w-[160px] max-h-[150px] object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    {/* Product details */}
                    <div className="space-y-2 text-left w-full flex-1 flex flex-col justify-between" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                      <div>
                        <Link href={`/products/${product.id}`} className="hover:text-[#0D3A27] transition-colors block">
                          <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-[#0D3A27] transition-colors">{product.name}</h3>
                        </Link>
                        <p className="text-2xl font-black text-[#0D3A27] mt-1">₹{price}</p>
                      </div>

                      {/* Pack Selection & Add CTA */}
                      <div className="pt-4 border-t border-gray-100 mt-3 space-y-3">
                        {packs.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5">
                            {packs.slice(0, 3).map((pack: any) => {
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
                                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                                    isSelected
                                      ? "bg-[#0D3A27] text-white shadow-sm ring-1 ring-[#0D3A27]"
                                      : "bg-[#FAF8F3] text-gray-700 border border-gray-200 hover:border-[#0D3A27]/40 hover:bg-gray-100"
                                  }`}
                                >
                                  {pack.name}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        <button
                          onClick={() => handleAdd(product.id)}
                          className="w-full h-[44px] bg-[#0D3A27] hover:bg-[#155338] active:scale-[0.98] rounded-full text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group/btn"
                        >
                          <svg className="w-4 h-4 transition-transform group-hover/btn:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
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

              {/* Card 1: White Background with Blue Border */}
              <div className="w-full max-w-[776px] min-h-[450px] bg-white border-2 border-[#103F5E]/20 rounded-[30px] p-8 sm:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <Link href={arrival1 ? `/products/${arrival1.id}` : "#"} className="w-[240px] h-[220px] sm:w-[260px] sm:h-[240px] rounded-[24px] bg-[#FAF8F3] flex items-center justify-center overflow-hidden flex-shrink-0 hover:scale-105 transition-transform duration-300 block p-4">
                  <Image src={arrival1Img} alt={arrival1Name} width={220} height={200} className="max-w-[200px] max-h-[190px] object-contain drop-shadow-md" />
                </Link>
                <div className="flex-1 space-y-4 text-left w-full flex flex-col justify-between" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                  <div>
                    <Link href={arrival1 ? `/products/${arrival1.id}` : "#"} className="hover:text-[#0D3A27] transition-colors block">
                      <h3 className="text-[26px] sm:text-[30px] font-bold text-[#103F5E] leading-tight">{arrival1Name}</h3>
                    </Link>
                    <p className="text-gray-600 text-[16px] sm:text-[17px] font-normal leading-relaxed mt-2 line-clamp-3">
                      {arrival1?.description || "Heavy-duty organic leaf tableware crafted for weddings, catering, and large feasts without environmental footprint."}
                    </p>
                  </div>
                  {arrival1 && (
                    <div className="pt-3">
                      <Link
                        href={`/products/${arrival1.id}`}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm bg-[#103F5E] text-white hover:bg-[#0c2f47] transition-all shadow-md hover:shadow-lg"
                      >
                        <span>View Product</span>
                        <span>→</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Card 2: Dark Blue Background */}
              <div className="w-full max-w-[776px] min-h-[450px] bg-[#103F5E] rounded-[30px] shadow-xl p-8 sm:p-10 flex flex-col md:flex-row-reverse items-center gap-6 md:gap-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <Link href={arrival2 ? `/products/${arrival2.id}` : "#"} className="w-[240px] h-[220px] sm:w-[260px] sm:h-[240px] rounded-[24px] bg-white/10 backdrop-blur-md flex items-center justify-center overflow-hidden flex-shrink-0 hover:scale-105 transition-transform duration-300 block p-4">
                  <Image src={arrival2Img} alt={arrival2Name} width={220} height={200} className="max-w-[200px] max-h-[190px] object-contain drop-shadow-md" />
                </Link>
                <div className="flex-1 space-y-4 text-left w-full flex flex-col justify-between" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                  <div>
                    <Link href={arrival2 ? `/products/${arrival2.id}` : "#"} className="hover:text-[#E8F0D8] transition-colors block">
                      <h3 className="text-[26px] sm:text-[30px] font-bold text-[#EDE8DC] leading-tight">{arrival2Name}</h3>
                    </Link>
                    <p className="text-blue-100/90 text-[16px] sm:text-[17px] font-normal leading-relaxed mt-2 line-clamp-3">
                      {arrival2?.description || "Leak-resistant, natural insulation bowls perfect for hot gravies, curries, and street food delights."}
                    </p>
                  </div>
                  {arrival2 && (
                    <div className="pt-3">
                      <Link
                        href={`/products/${arrival2.id}`}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm bg-[#E8F0D8] text-[#2B4D0E] hover:bg-white transition-all shadow-md hover:shadow-lg"
                      >
                        <span>View Product</span>
                        <span>→</span>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 max-w-[1580px] mx-auto">
                {filteredProducts.map((product) => {
                  const image = getProductImageUrl(product.primary_image_url, product.name);
                  const packs = product.packs?.filter((p: any) => p.is_active) ?? [];
                  const selPackId = product ? selectedPacks[product.id] : undefined;
                  const selPack = selPackId ? packs.find((p: any) => p.id === selPackId) : undefined;
                  const price = selPack
                    ? Math.round(parseFloat(selPack.discounted_price ?? selPack.base_price))
                    : Math.round(parseFloat(product.discounted_price ?? product.base_price));

                  return (
                    <div
                      key={product.id}
                      className="group bg-white rounded-[20px] border border-[#2B4D0E]/15 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between p-6 relative overflow-hidden"
                    >
                      {/* Product image box */}
                      <Link
                        href={`/products/${product.id}`}
                        className="w-full h-[190px] bg-[#FAF8F3] rounded-[14px] flex items-center justify-center overflow-hidden mb-5 group-hover:bg-[#F5F2EA] transition-colors relative"
                      >
                        <Image
                          src={image}
                          alt={product.name}
                          width={160}
                          height={150}
                          className="max-w-[160px] max-h-[150px] object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>

                      {/* Product details */}
                      <div className="space-y-2 text-left w-full flex-1 flex flex-col justify-between" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                        <div>
                          <Link href={`/products/${product.id}`} className="hover:text-[#0D3A27] transition-colors block">
                            <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-[#0D3A27] transition-colors">{product.name}</h3>
                          </Link>
                          <p className="text-2xl font-black text-[#0D3A27] mt-1">₹{price}</p>
                        </div>

                        {/* Pack Selection & Add CTA */}
                        <div className="pt-4 border-t border-gray-100 mt-3 space-y-3">
                          {packs.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5">
                              {packs.slice(0, 3).map((pack: any) => {
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
                                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                                      isSelected
                                        ? "bg-[#0D3A27] text-white shadow-sm ring-1 ring-[#0D3A27]"
                                        : "bg-[#FAF8F3] text-gray-700 border border-gray-200 hover:border-[#0D3A27]/40 hover:bg-gray-100"
                                    }`}
                                  >
                                    {pack.name}
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          <button
                            onClick={() => handleAdd(product.id)}
                            className="w-full h-[44px] bg-[#0D3A27] hover:bg-[#155338] active:scale-[0.98] rounded-full text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group/btn"
                          >
                            <svg className="w-4 h-4 transition-transform group-hover/btn:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
