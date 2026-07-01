"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMarketplaceProducts, getCategories, getProductImageUrl, type MarketProduct } from "@/lib/api";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();

  const [products, setProducts] = useState<MarketProduct[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
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
      alert("Added to cart!");
    } catch (err: any) {
      alert(err?.message ?? "Failed to add product to cart.");
    }
  };

  // Filtered products for "All Products" section based on category selection
  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category_id === selectedCategory)
    : products;

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

  const arrival1Name = arrival1?.name ?? "National Flag";
  const arrival2Name = arrival2?.name ?? "National Flag";

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
        <div className="flex h-96 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#76A52E] border-t-transparent" />
        </div>
      ) : (
        <>
          {/* 2. Our Best selling Products */}
          <section className="py-20 max-w-[1400px] mx-auto px-6">
            <h2
              className="text-center text-3xl lg:text-[40px] font-bold text-[#2B4D0E] mb-12"
              style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
              Our Best selling Products
            </h2>
            <div className="border border-black flex flex-col md:flex-row bg-[#FAF8F3] max-w-[1580px] mx-auto overflow-hidden rounded-[5px]">
              {bestSellers.map((product) => {
                const image = getProductImageUrl(product.primary_image_url, product.name);
                const packs = product.packs?.filter((p: any) => p.is_active) ?? [];
                const selPackId = product ? selectedPacks[product.id] : undefined;
                const selPack = selPackId ? packs.find((p: any) => p.id === selPackId) : undefined;
                const price = selPack
                  ? Math.round(parseFloat(selPack.discounted_price ?? selPack.base_price))
                  : Math.round(parseFloat(product.discounted_price ?? product.base_price));

                return (
                  <div key={product.id} className="flex-1 border-b md:border-b-0 md:border-r border-black last:border-0 flex flex-col justify-between p-8 h-[430px] bg-[#FAF8F3]">
                    {/* Centered rounded-rect product image container */}
                    <Link href={`/products/${product.id}`} className="w-[171px] h-[154px] bg-white border-[1.5px] border-black rounded-[5px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex items-center justify-center overflow-hidden mx-auto flex-shrink-0 hover:opacity-90 transition-opacity block">
                      <img src={image} alt={product.name} className="max-w-[140px] max-h-[130px] object-contain p-2" />
                    </Link>

                    {/* Product details */}
                    <div className="space-y-1 text-left w-full mt-4" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                      <Link href={`/products/${product.id}`} className="hover:underline block">
                        <h3 className="text-[20px] font-medium text-black line-clamp-1">{product.name}</h3>
                      </Link>
                      <p className="text-[20px] font-semibold text-black">₹{price}</p>

                      <div className="flex items-end justify-between pt-2">
                        <div className="text-[14px] text-black font-semibold space-y-1">
                          {packs.length > 0 && packs.slice(0, 2).map((pack: any) => {
                            const isSelected = selPackId === pack.id;
                            return (
                              <button
                                key={pack.id}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setSelectedPacks(prev => ({
                                    ...prev,
                                    [product.id]: prev[product.id] === pack.id ? undefined! : pack.id
                                  }));
                                }}
                                className={`block text-left px-2 py-0.5 rounded-md transition-all ${
                                  isSelected
                                    ? "bg-[#76A52E]/15 text-[#2B4D0E] ring-1 ring-[#76A52E]/40"
                                    : "text-gray-700 hover:bg-gray-100/50"
                                }`}
                              >
                                {pack.name}
                              </button>
                            );
                          })}
                        </div>
                        <button
                          onClick={() => handleAdd(product.id)}
                          className="w-[125px] h-[36px] bg-[#FAF8F3] border-[1.5px] border-black rounded-[5px] text-[16px] font-normal text-black hover:bg-neutral-100 active:scale-95 transition-all flex items-center justify-center"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 3. Different Types of Categories */}
          <section className="py-16 bg-[#FAF8F3] border-t border-b border-gray-100">
            <div className="max-w-[1400px] mx-auto px-6">
              <h2
                className="text-center text-3xl lg:text-[40px] font-bold text-black mb-12"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
              >
                Different Types of Categories
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
                      onClick={() => setSelectedCategory(selectedCategory === id ? null : id)}
                      className={`flex flex-col items-center justify-between p-6 rounded-2xl border transition-all ${color.bg} ${selectedCategory === id ? "border-black ring-2 ring-black/10 scale-95" : "border-transparent hover:scale-102"}`}
                    >
                      <span className={`font-bold text-lg ${color.text} mb-4`}>{name}</span>
                      <div className="w-[120px] h-[80px] flex items-center justify-center">
                        <img src={catImage} alt={name} className="max-h-full max-w-full object-contain" />
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
              <div className="w-full max-w-[776px] min-h-[450px] bg-[#FAF8F3] border-4 border-[#103F5E] rounded-[30px] p-8 sm:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-8 hover:shadow-lg transition-shadow">
                <Link href={arrival1 ? `/products/${arrival1.id}` : "#"} className="w-[240px] h-[220px] sm:w-[280px] sm:h-[250px] rounded-[30px] border-[1.5px] border-black bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex items-center justify-center overflow-hidden flex-shrink-0 hover:opacity-90 transition-opacity block">
                  <img src={arrival1Img} alt={arrival1Name} className="max-w-[200px] max-h-[190px] sm:max-w-[240px] sm:max-h-[220px] object-contain p-4" />
                </Link>
                <div className="flex-1 space-y-3 text-left w-full" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                  <Link href={arrival1 ? `/products/${arrival1.id}` : "#"} className="hover:underline block">
                    <h3 className="text-[28px] sm:text-[32px] font-bold text-[#103F5E] leading-tight">{arrival1Name}</h3>
                  </Link>
                  <p className="text-[#103F5E] text-[16px] sm:text-[18px] font-normal leading-relaxed">
                    {arrival1?.description || "If you want Healing OURTH to be perceived like Apple, Nike, or Tesla rather than a traditional eco brand."}
                  </p>
                </div>
              </div>

              {/* Card 2: Dark Blue Background */}
              <div className="w-full max-w-[776px] min-h-[450px] bg-[#103F5E] rounded-[30px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] p-8 sm:p-10 flex flex-col md:flex-row-reverse items-center gap-6 md:gap-8 hover:shadow-lg transition-shadow">
                <Link href={arrival2 ? `/products/${arrival2.id}` : "#"} className="w-[240px] h-[220px] sm:w-[280px] sm:h-[250px] rounded-[30px] border-[1.5px] border-black bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex items-center justify-center overflow-hidden flex-shrink-0 hover:opacity-90 transition-opacity block">
                  <img src={arrival2Img} alt={arrival2Name} className="max-w-[200px] max-h-[190px] sm:max-w-[240px] sm:max-h-[220px] object-contain p-4" />
                </Link>
                <div className="flex-1 space-y-3 text-left w-full" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                  <Link href={arrival2 ? `/products/${arrival2.id}` : "#"} className="hover:underline block">
                    <h3 className="text-[28px] sm:text-[32px] font-bold text-[#EDE8DC] leading-tight">{arrival2Name}</h3>
                  </Link>
                  <p className="text-[#FAF8F3] text-[16px] sm:text-[18px] font-normal leading-relaxed">
                    {arrival2?.description || "If you want Healing OURTH to be perceived like Apple, Nike, or Tesla rather than a traditional eco brand."}
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* 5. All Products */}
          <section className="py-20 max-w-[1400px] mx-auto px-6 border-t border-gray-100">
            <h2
              className="text-center text-3xl lg:text-[40px] font-bold text-[#5E3A16] mb-12"
              style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
              All Products
            </h2>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 border border-gray-100 rounded-2xl">
                <p className="text-gray-500 font-semibold">No products found in this category.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {(() => {
                  const chunkProducts = (arr: any[], size: number) => {
                    const chunks = [];
                    for (let i = 0; i < arr.length; i += size) {
                      chunks.push(arr.slice(i, i + size));
                    }
                    return chunks;
                  };

                  const rows = chunkProducts(filteredProducts, 4);

                  return rows.map((row, rowIndex) => {
                    return (
                      <div key={rowIndex} className="border border-black flex flex-col md:flex-row bg-[#FAF8F3] max-w-[1580px] mx-auto overflow-hidden rounded-[5px]">
                        {row.map((product) => {
                          const image = getProductImageUrl(product.primary_image_url, product.name);
                          const packs = product.packs?.filter((p: any) => p.is_active) ?? [];
                          const selPackId = product ? selectedPacks[product.id] : undefined;
                          const selPack = selPackId ? packs.find((p: any) => p.id === selPackId) : undefined;
                          const price = selPack
                            ? Math.round(parseFloat(selPack.discounted_price ?? selPack.base_price))
                            : Math.round(parseFloat(product.discounted_price ?? product.base_price));

                          return (
                            <div key={product.id} className="flex-1 border-b md:border-b-0 md:border-r border-black last:border-0 flex flex-col justify-between p-8 h-[430px] bg-[#FAF8F3]">
                              {/* Centered rounded-rect product image container */}
                              <Link href={`/products/${product.id}`} className="w-[171px] h-[154px] bg-white border-[1.5px] border-black rounded-[5px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex items-center justify-center overflow-hidden mx-auto flex-shrink-0 hover:opacity-90 transition-opacity block">
                                <img src={image} alt={product.name} className="max-w-[140px] max-h-[130px] object-contain p-2" />
                              </Link>

                              {/* Product details */}
                              <div className="space-y-1 text-left w-full mt-4" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                                <Link href={`/products/${product.id}`} className="hover:underline block">
                                  <h3 className="text-[20px] font-medium text-black line-clamp-1">{product.name}</h3>
                                </Link>
                                <p className="text-[20px] font-semibold text-black">₹{price}</p>

                                <div className="flex items-end justify-between pt-2">
                                  <div className="text-[14px] text-black font-semibold space-y-1">
                                    {packs.length > 0 && packs.slice(0, 2).map((pack: any) => {
                                      const isSelected = selPackId === pack.id;
                                      return (
                                        <button
                                          key={pack.id}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            setSelectedPacks(prev => ({
                                              ...prev,
                                              [product.id]: prev[product.id] === pack.id ? undefined! : pack.id
                                            }));
                                          }}
                                          className={`block text-left px-2 py-0.5 rounded-md transition-all ${
                                            isSelected
                                              ? "bg-[#76A52E]/15 text-[#2B4D0E] ring-1 ring-[#76A52E]/40"
                                              : "text-gray-700 hover:bg-gray-100/50"
                                          }`}
                                        >
                                          {pack.name}
                                        </button>
                                      );
                                    })}
                                  </div>
                                  <button
                                    onClick={() => handleAdd(product.id)}
                                    className="w-[125px] h-[36px] bg-[#FAF8F3] border-[1.5px] border-black rounded-[5px] text-[16px] font-normal text-black hover:bg-neutral-100 active:scale-95 transition-all flex items-center justify-center"
                                  >
                                    Add
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  });
                })()}
              </div>
            )}
          </section>
        </>
      )}

    </main>
  );
}
