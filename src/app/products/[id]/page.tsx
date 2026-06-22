"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/(website)/_components/Navbar";
import Footer from "@/app/(website)/_components/Footer";
import { getProduct, getMarketplaceProducts, getProductImageUrl, type MarketProduct } from "@/lib/api";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id as string);

  const { addToCart } = useCart();
  const { user } = useAuth();
  const isB2B = user?.role === "vendor";

  const [product, setProduct] = useState<MarketProduct | null>(null);
  const [trending, setTrending] = useState<MarketProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedPackId, setSelectedPackId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "info" | "reviews">("info");
  const [adding, setAdding] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load product and trending products
  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    getProduct(productId)
      .then((res) => {
        const prod = res.data;
        setProduct(prod);
        setSelectedImage(prod.primary_image_url || "");
        
        // Default to first active pack if available
        if (prod.packs && prod.packs.length > 0) {
          const firstPack = prod.packs.find((p) => p.is_active) || prod.packs[0];
          setSelectedPackId(firstPack.id);
        }
      })
      .catch((err) => console.error("Failed to load product details:", err))
      .finally(() => setLoading(false));

    getMarketplaceProducts({ per_page: 4 })
      .then((res) => {
        setTrending((res.data ?? []).filter((p) => p.id !== productId).slice(0, 4));
      })
      .catch((err) => console.error("Failed to load trending products:", err));
  }, [productId]);

  // Adjust quantity based on B2B min order quantity
  const minQty = isB2B ? (product?.min_order_quantity ?? 1) : 1;
  useEffect(() => {
    if (quantity < minQty) {
      setQuantity(minQty);
    }
  }, [minQty, quantity]);

  const handleAddToCart = async () => {
    if (!user) {
      router.push("/client/login");
      return;
    }
    if (!product) return;
    setAdding(true);
    setSuccess(false);
    try {
      await addToCart(product.id, quantity, selectedPackId);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      alert(err?.message ?? "Failed to add item to cart.");
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      router.push("/client/login");
      return;
    }
    if (!product) return;
    try {
      await addToCart(product.id, quantity, selectedPackId);
      router.push("/cart");
    } catch (err: any) {
      alert(err?.message ?? "Failed to proceed to buy.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#EAF3FA]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#76A52E] border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#EAF3FA] flex flex-col justify-between">
        <Navbar />
        <div className="flex-grow flex items-center justify-center pt-36 pb-24">
          <div className="text-center p-8 bg-white border-[1.5px] border-black shadow-[4px_4px_0px_#000000] rounded-[5px] max-w-md">
            <h2 className="text-2xl font-bold text-[#5E3A16]">Product Not Found</h2>
            <p className="mt-2 text-sm text-[#103F5E]">The product you are looking for does not exist or has been removed.</p>
            <Link href="/products" className="mt-6 inline-block bg-[#76A52E] text-white border-[1.5px] border-black px-6 py-2.5 rounded-[30px] shadow-[2px_2px_0px_#000000] font-bold text-sm">
              Back to Shop
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const selectedPack = product.packs?.find((p) => p.id === selectedPackId);

  // Price resolution
  const activeBasePrice = selectedPack 
    ? parseFloat(selectedPack.base_price) 
    : (isB2B && product.wholesale_price ? parseFloat(product.wholesale_price) : parseFloat(product.base_price));

  const activeSalePrice = selectedPack
    ? (selectedPack.discounted_price ? parseFloat(selectedPack.discounted_price) : null)
    : (isB2B && product.wholesale_discounted_price ? parseFloat(product.wholesale_discounted_price) : (product.discounted_price ? parseFloat(product.discounted_price) : null));

  return (
    <main className="min-h-screen bg-[#EAF3FA] flex flex-col justify-between">
      <Navbar />

      <div className="flex-grow max-w-[1625px] mx-auto px-4 lg:px-[52px] pt-36 pb-20 w-full">
        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-transparent">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 flex flex-col items-center">
            {/* Main Preview */}
            <div className="w-full max-w-[580px] aspect-square relative bg-[#FAF8F3] border-[1.5px] border-black rounded-[5px] shadow-[4px_4px_0px_#000000] overflow-hidden flex items-center justify-center p-4">
              <img
                src={getProductImageUrl(selectedImage || product.primary_image_url, product.name)}
                alt={product.name}
                className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* Thumbnails Row */}
            <div className="flex gap-4 mt-6 w-full max-w-[580px] justify-start overflow-x-auto py-1">
              {[product.primary_image_url, ...(product.secondary_images ?? [])].filter(Boolean).map((imgUrl, idx) => {
                const isActive = selectedImage === imgUrl;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl!)}
                    className={`w-[100px] h-[100px] aspect-square relative bg-[#FAF8F3] border-[1.5px] rounded-[5px] overflow-hidden flex items-center justify-center p-2 transition-all ${
                      isActive ? "border-black shadow-[2px_2px_0px_#000000]" : "border-black/35 hover:border-black"
                    }`}
                  >
                    <img
                      src={getProductImageUrl(imgUrl!, product.name)}
                      alt={`Thumbnail ${idx + 1}`}
                      className="max-h-full max-w-full object-contain"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Product Specs & Actions */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-start">
            
            {/* Rating Stars */}
            <div className="flex items-center gap-2">
              <div className="flex text-[#76A52E] text-2xl">
                <span>★</span><span>★</span><span>★</span><span>★</span><span className="text-gray-300">★</span>
              </div>
              <span className="text-sm font-semibold text-[#103F5E]">4/5</span>
              <span className="text-sm text-gray-500 font-medium">(2,999 reviews)</span>
            </div>

            {/* Badge capsule */}
            <div
              className="inline-flex w-fit px-6 h-[38px] items-center justify-center rounded-[30px] border-[1.5px] border-black bg-[#FAF8F3] text-sm font-normal text-black shadow-[1px_1px_0px_0px_#000000]"
              style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
              Decomposeable and Eco-friendly
            </div>

            {/* Title */}
            <h1 
              className="text-4xl lg:text-[48px] font-bold text-[#5E3A16] leading-tight"
              style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
            >
              {product.name}
            </h1>

            {/* Description list / details */}
            <div className="space-y-3 text-sm text-[#103F5E] leading-relaxed max-w-xl font-medium">
              <p>{product.description || "Pressed entirely from natural leaves, this organic tableware is heat-treated for strength and certified food-safe. A beautiful, compostable alternative to paper and plastic."}</p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-[#103F5E]/80">
                <li>Microwave Safe & Leak Proof</li>
                <li>Made from eco-friendly sugarcane/natural fibers</li>
                <li>100% natural, biodegradable, and compostable</li>
              </ul>
            </div>

            {/* Price Display */}
            <div className="pt-4 border-t border-black/10 flex items-baseline gap-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Price:</span>
              <div className="flex items-center gap-2">
                {activeSalePrice ? (
                  <>
                    <span className="text-3xl font-black text-[#0D3A27]">
                      ₹{activeSalePrice.toFixed(2)}
                    </span>
                    <span className="text-lg text-gray-400 line-through font-bold">
                      ₹{activeBasePrice.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-black text-[#0D3A27]">
                    ₹{activeBasePrice.toFixed(2)}
                  </span>
                )}
                <span className="text-sm font-bold text-gray-600">
                  {selectedPack ? `per ${selectedPack.name}` : `per ${product.unit}`}
                </span>
                {isB2B && !selectedPack && (
                  <span className="text-[10px] bg-[#25784C]/10 text-[#25784C] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    B2B Wholesale
                  </span>
                )}
              </div>
            </div>

            {/* Pack Size Selector */}
            {product.packs && product.packs.length > 0 && (
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-black uppercase tracking-wider block">
                  Select Pack Size:
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.packs.map((pack) => {
                    const isSelected = pack.id === selectedPackId;
                    const packPrice = pack.discounted_price ? parseFloat(pack.discounted_price) : parseFloat(pack.base_price);
                    return (
                      <button
                        key={pack.id}
                        onClick={() => setSelectedPackId(pack.id)}
                        className={`px-6 py-2.5 rounded-[5px] text-sm font-bold border-[1.5px] transition duration-200 ${
                          isSelected
                            ? "bg-[#E3F0F9] text-[#0D3A27] border-black shadow-[2px_2px_0px_#000000]"
                            : "bg-[#FAF8F3] text-black border-black/35 hover:border-black hover:bg-[#FAF8F3]/90"
                        }`}
                      >
                        {pack.name} (₹{packPrice.toFixed(2)})
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions: Qty + Cart + Buy */}
            <div className="pt-4 border-t border-black/10 space-y-4 max-w-md">
              <div className="flex gap-4 items-center">
                {/* Quantity selector */}
                <div className="flex items-center border-[1.5px] border-black rounded-[5px] bg-[#FAF8F3] shadow-[2px_2px_0px_#000000] h-[48px] px-3">
                  <button
                    onClick={() => setQuantity(q => Math.max(minQty, q - 1))}
                    className="text-lg font-bold px-2 text-[#0D3A27] hover:scale-110 active:scale-95 transition"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={minQty}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(minQty, parseInt(e.target.value) || minQty))}
                    className="w-12 text-center bg-transparent outline-none font-bold text-sm text-black"
                  />
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="text-lg font-bold px-2 text-[#0D3A27] hover:scale-110 active:scale-95 transition"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className={`flex-grow h-[48px] rounded-[5px] font-bold border-[1.5px] border-black transition shadow-[3px_3px_0px_#000000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000000] ${
                    success
                      ? "bg-green-600 text-white"
                      : "bg-[#103F5E] text-white hover:opacity-95"
                  }`}
                >
                  {adding ? "Adding..." : success ? "✓ Added!" : "Add to Cart"}
                </button>
              </div>

              {/* Buy Now */}
              <button
                onClick={handleBuyNow}
                className="w-full h-[48px] rounded-[5px] bg-[#76A52E] hover:bg-[#659124] text-white font-bold border-[1.5px] border-black shadow-[3px_3px_0px_#000000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000000] transition"
              >
                Buy Now
              </button>

              {isB2B && minQty > 1 && (
                <p className="text-xs text-[#25784C] font-semibold mt-1">
                  * Note: As a B2B vendor, a minimum order quantity of {minQty} applies.
                </p>
              )}
            </div>

          </div>

        </div>

        {/* Tab Selection Section */}
        <div className="mt-16 border-b border-black/10">
          <div className="flex gap-8 justify-start text-lg font-bold text-gray-400">
            <button
              onClick={() => setActiveTab("description")}
              className={`pb-3 relative transition-all ${
                activeTab === "description" ? "text-[#5E3A16]" : "hover:text-[#5E3A16]/70"
              }`}
            >
              Description
              {activeTab === "description" && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#5E3A16] rounded-t" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("info")}
              className={`pb-3 relative transition-all ${
                activeTab === "info" ? "text-[#5E3A16]" : "hover:text-[#5E3A16]/70"
              }`}
            >
              Additional Information
              {activeTab === "info" && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#5E3A16] rounded-t" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-3 relative transition-all ${
                activeTab === "reviews" ? "text-[#5E3A16]" : "hover:text-[#5E3A16]/70"
              }`}
            >
              Reviews
              {activeTab === "reviews" && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#5E3A16] rounded-t" />
              )}
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="py-8">
          {activeTab === "description" && (
            <div className="text-[#103F5E] text-sm leading-relaxed max-w-3xl">
              <p>{product.description || "This product is made from 100% natural dried fallen leaves. Chemical-free, compostable, microwave safe, and extremely durable. Perfect for serving hot and cold food at events, caterings, and fast food joints."}</p>
            </div>
          )}

          {activeTab === "info" && (
            <div className="max-w-[700px] border-[1.5px] border-black rounded-[5px] overflow-hidden shadow-[3px_3px_0px_#000000] bg-[#FAF8F3]">
              <div className="grid grid-cols-3 border-b border-black">
                <div className="col-span-1 bg-[#E3F0F9] border-r border-black p-3 font-bold text-sm text-[#0D3A27]">
                  Dimensions
                </div>
                <div className="col-span-2 p-3 text-sm text-[#103F5E] font-medium">
                  {product.dimensions_cm ? `${product.dimensions_cm.length ?? 23}x${product.dimensions_cm.width ?? 23}` : "23x23 cm"}
                </div>
              </div>
              <div className="grid grid-cols-3">
                <div className="col-span-1 bg-[#E3F0F9] border-r border-black p-3 font-bold text-sm text-[#0D3A27]">
                  Weight
                </div>
                <div className="col-span-2 p-3 text-sm text-[#103F5E] font-medium">
                  {product.weight_grams ? `${product.weight_grams}g` : "23g"}
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4 max-w-xl">
              <div className="border border-black/10 p-4 rounded-lg bg-white/70">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#5E3A16] text-sm">Sahil S.</span>
                  <span className="text-xs text-gray-400">1 day ago</span>
                </div>
                <div className="text-yellow-500 text-xs mt-1">★★★★★</div>
                <p className="text-xs text-[#103F5E] mt-2 font-medium">Extremely high quality bowls! Very study and looked amazing at our garden party.</p>
              </div>
              <div className="border border-black/10 p-4 rounded-lg bg-white/70">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#5E3A16] text-sm">Deepak K.</span>
                  <span className="text-xs text-gray-400">3 days ago</span>
                </div>
                <div className="text-yellow-500 text-xs mt-1">★★★★☆</div>
                <p className="text-xs text-[#103F5E] mt-2 font-medium">Excellent eco-friendly choice. They handled hot food without any issue.</p>
              </div>
            </div>
          )}
        </div>

        {/* Trending Products Section */}
        {trending.length > 0 && (
          <div className="mt-16 pt-12 border-t border-black/10">
            <h2 
              className="text-3xl font-bold text-[#5E3A16] mb-8"
              style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
            >
              Trending Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {trending.map((p) => {
                const pPrice = p.discounted_price ? parseFloat(p.discounted_price) : parseFloat(p.base_price);
                return (
                  <Link 
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] p-4 shadow-[4px_4px_0px_#000000] flex flex-col justify-between hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_#000000] transition-all select-none"
                  >
                    <div>
                      {/* Product Thumbnail */}
                      <div className="w-full aspect-square relative bg-white border border-black/10 rounded-[5px] overflow-hidden mb-4 flex items-center justify-center p-2">
                        <img
                          src={getProductImageUrl(p.primary_image_url, p.name)}
                          alt={p.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <h3 className="font-bold text-[#5E3A16] text-sm line-clamp-1">{p.name}</h3>
                      <p className="text-xs text-gray-500 font-semibold mt-1">Pack of 10</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-black/5">
                      <span className="font-bold text-black text-sm">₹{pPrice.toFixed(2)}</span>
                      <span className="text-xs bg-[#76A52E] text-white px-3 py-1.5 rounded-[30px] border border-black shadow-[1px_1px_0px_#000000] font-bold">
                        Add
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Decorative Snack Banner */}
        <div className="mt-16 w-full h-[180px] sm:h-[240px] rounded-[5px] border-[1.5px] border-black shadow-[4px_4px_0px_#000000] bg-pink-100 overflow-hidden relative select-none">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-pink-300 opacity-60" />
          <div className="relative z-10 flex h-full items-center justify-between px-8 md:px-16">
            <div className="space-y-2">
              <span className="text-xs font-bold text-pink-700 uppercase tracking-widest block">Snack & Dine</span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#5E3A16]">Delicious snacks fit perfectly on leafware!</h3>
              <p className="text-sm text-[#103F5E] max-w-md font-medium">Ourth tablewares are completely food safe, microwaveable, and leak-proof for all foods.</p>
            </div>
            {/* Visual food illustration container */}
            <div className="hidden md:flex gap-4 transform translate-y-6">
              <div className="bg-white/80 p-3 rounded-lg border border-black shadow-[2px_2px_0px_#000000] w-[120px] text-center text-xs font-bold text-[#5E3A16]">
                🍪 Cookies
              </div>
              <div className="bg-white/80 p-3 rounded-lg border border-black shadow-[2px_2px_0px_#000000] w-[120px] text-center text-xs font-bold text-[#5E3A16]">
                🍟 Chips
              </div>
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </main>
  );
}
