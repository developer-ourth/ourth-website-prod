"use client";

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
      await addToCart(productId, 1);
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
    : "/images/home/productcard.png";
  const arrival2Img = arrival2 
    ? getProductImageUrl(arrival2.primary_image_url, arrival2.name) 
    : "/images/home/productcard.png";

  const arrival1Name = arrival1?.name ?? "National Flag";
  const arrival2Name = arrival2?.name ?? "National Flag";

  // Background style matching homepage hero
  const heroBgStyle = {
    backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/images/hero/marketbanner.png')",
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
        className="relative w-full h-[550px] lg:h-[650px] bg-cover bg-center"
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
              {(() => {
                const bestSellersList = [...bestSellers];
                while (bestSellersList.length < 4) {
                  bestSellersList.push({
                    id: -1 - bestSellersList.length,
                    name: "6N Panipuri Bowls",
                    base_price: "500.00",
                    discounted_price: null,
                    primary_image_url: "",
                    packs: []
                  } as any);
                }
                return bestSellersList.map((product) => {
                  const isMock = product.id < 0;
                  const image = isMock ? "/images/home/productcard.png" : getProductImageUrl(product.primary_image_url, product.name);
                  const price = Math.round(parseFloat(product.discounted_price ?? product.base_price));
                  const packs = product.packs?.filter((p: any) => p.is_active) ?? [];
                  return (
                    <div key={product.id} className="flex-1 border-b md:border-b-0 md:border-r border-black last:border-0 flex flex-col justify-between p-8 h-[395px] bg-[#FAF8F3]">
                      {/* Centered rounded-rect product image container */}
                      <div className="w-[171px] h-[154px] bg-white border-[1.5px] border-black rounded-[5px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex items-center justify-center overflow-hidden mx-auto flex-shrink-0">
                        <img src={image} alt={product.name} className="max-w-[140px] max-h-[130px] object-contain p-2" />
                      </div>

                      {/* Product details */}
                      <div className="space-y-1 text-left w-full mt-4" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                        <h3 className="text-[20px] font-medium text-black line-clamp-1">{product.name}</h3>
                        <p className="text-[20px] font-semibold text-black">₹{price}</p>
                        
                        <div className="flex items-end justify-between pt-2">
                          <div className="text-[16px] text-black font-normal space-y-0.5">
                            {packs.length > 0 ? packs.slice(0, 2).map((pack: any) => <p key={pack.id}>{pack.name}</p>) : <><p>Pack of 100</p><p>Pack of 50</p></>}
                          </div>
                          <button 
                            onClick={() => !isMock && handleAdd(product.id)}
                            className="w-[125px] h-[36px] bg-[#FAF8F3] border-[1.5px] border-black rounded-[5px] text-[16px] font-normal text-black hover:bg-neutral-100 active:scale-95 transition-all flex items-center justify-center"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
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
                    : "/images/home/productcard.png";

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
              {/* Card 1: White Background with Blue Border */}
              <div className="w-full max-w-[776px] min-h-[546px] bg-[#FAF8F3] border-4 border-[#103F5E] rounded-[30px] p-10 flex flex-col lg:flex-row items-center gap-8 hover:shadow-lg transition-shadow">
                <div className="w-[330px] h-[298px] rounded-[30px] border-[1.5px] border-black bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img src={arrival1Img} alt={arrival1Name} className="max-w-[280px] max-h-[250px] object-contain p-4" />
                </div>
                <div className="flex-1 space-y-4 text-left" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                  <h3 className="text-[36px] lg:text-[40px] font-bold text-[#103F5E] leading-tight">{arrival1Name}</h3>
                  <p className="text-[#103F5E] text-[20px] lg:text-[24px] font-normal leading-[34px]">
                    {arrival1?.description || "If you want Healing OURTH to be perceived like Apple, Nike, or Tesla rather than a traditional eco brand."}
                  </p>
                </div>
              </div>

              {/* Card 2: Dark Blue Background */}
              <div className="w-full max-w-[776px] min-h-[546px] bg-[#103F5E] rounded-[30px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] p-10 flex flex-col lg:flex-row-reverse items-center gap-8 hover:shadow-lg transition-shadow">
                <div className="w-[330px] h-[298px] rounded-[30px] border-[1.5px] border-black bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img src={arrival2Img} alt={arrival2Name} className="max-w-[280px] max-h-[250px] object-contain p-4" />
                </div>
                <div className="flex-1 space-y-4 text-left lg:text-right" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                  <h3 className="text-[36px] lg:text-[40px] font-bold text-[#EDE8DC] leading-tight">{arrival2Name}</h3>
                  <p className="text-[#FAF8F3] text-[20px] lg:text-[24px] font-normal leading-[34px]">
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
                    // Pad last row to have exactly 4 items
                    const paddedRow = [...row];
                    while (paddedRow.length < 4) {
                      paddedRow.push({
                        id: -100 - rowIndex - paddedRow.length,
                        name: "6N Panipuri Bowls",
                        base_price: "500.00",
                        discounted_price: null,
                        primary_image_url: "",
                        packs: []
                      } as any);
                    }

                    return (
                      <div key={rowIndex} className="border border-black flex flex-col md:flex-row bg-[#FAF8F3] max-w-[1580px] mx-auto overflow-hidden rounded-[5px]">
                        {paddedRow.map((product) => {
                          const isMock = product.id < 0;
                          const image = isMock ? "/images/home/productcard.png" : getProductImageUrl(product.primary_image_url, product.name);
                          const price = Math.round(parseFloat(product.discounted_price ?? product.base_price));
                          const packs = product.packs?.filter((p: any) => p.is_active) ?? [];
                          return (
                            <div key={product.id} className="flex-1 border-b md:border-b-0 md:border-r border-black last:border-0 flex flex-col justify-between p-8 h-[395px] bg-[#FAF8F3]">
                              {/* Centered rounded-rect product image container */}
                              <div className="w-[171px] h-[154px] bg-white border-[1.5px] border-black rounded-[5px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex items-center justify-center overflow-hidden mx-auto flex-shrink-0">
                                <img src={image} alt={product.name} className="max-w-[140px] max-h-[130px] object-contain p-2" />
                              </div>

                              {/* Product details */}
                              <div className="space-y-1 text-left w-full mt-4" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                                <h3 className="text-[20px] font-medium text-black line-clamp-1">{product.name}</h3>
                                <p className="text-[20px] font-semibold text-black">₹{price}</p>
                                
                                <div className="flex items-end justify-between pt-2">
                                  <div className="text-[16px] text-black font-normal space-y-0.5">
                                    {packs.length > 0 ? packs.slice(0, 2).map((pack: any) => <p key={pack.id}>{pack.name}</p>) : <><p>Pack of 100</p><p>Pack of 50</p></>}
                                  </div>
                                  <button 
                                    onClick={() => !isMock && handleAdd(product.id)}
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
