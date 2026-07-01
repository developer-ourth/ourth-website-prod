"use client";

export const dynamic = "force-dynamic";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getProduct, getMarketplaceProducts, getProductImageUrl, type MarketProduct, getProductRatings, submitProductRating, type ProductReview } from "@/lib/api";
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
  const [activeTab, setActiveTab] = useState<"description" | "info" | "reviews">("reviews");
  const [adding, setAdding] = useState(false);
  const [success, setSuccess] = useState(false);

  // Reviews State
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const loadReviews = useCallback(() => {
    if (!productId) return;
    setReviewsLoading(true);
    getProductRatings(productId)
      .then((res) => {
        setReviews(res.data ?? []);
      })
      .catch((err) => console.error("Failed to load reviews:", err))
      .finally(() => setReviewsLoading(false));
  }, [productId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/client/login");
      return;
    }
    if (newRating < 1 || newRating > 5) {
      alert("Please select a rating between 1 and 5 stars.");
      return;
    }
    setSubmittingReview(true);
    try {
      await submitProductRating(productId, newRating, newReviewText);
      setNewReviewText("");
      setNewRating(5);
      loadReviews();
      alert("Review submitted successfully!");
    } catch (err: any) {
      alert(err?.message ?? "Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

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

    loadReviews();
  }, [productId, loadReviews]);

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
      <div className="flex min-h-screen items-center justify-center bg-[#FAF8F3]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#76A52E] border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#FAF8F3] flex flex-col justify-between pt-24">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center p-8 bg-white border-[1.5px] border-black shadow-[4px_4px_0px_#000000] rounded-[5px] max-w-md">
            <h2 className="text-2xl font-bold text-[#5E3A16]">Product Not Found</h2>
            <p className="mt-2 text-sm text-[#103F5E]">The product you are looking for does not exist or has been removed.</p>
            <Link href="/products" className="mt-6 inline-block bg-[#76A52E] text-white border-[1.5px] border-black px-6 py-2.5 rounded-[30px] font-bold text-sm">
              Back to Shop
            </Link>
          </div>
        </div>
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

  const displayPrice = activeSalePrice ?? activeBasePrice;

  // Mock reviews content for display matching figma specs
  const mockReviews = [
    {
      id: 1,
      title: "Generic Hype",
      rating: 4,
      text: "Wow, this is truly the best product ever! It changed my life completely from day one. I cannot imagine living without it now. Everyone needs to buy this right now!"
    },
    {
      id: 2,
      title: "Generic Hype",
      rating: 4,
      text: "Wow, this is truly the best product ever! It changed my life completely from day one. I cannot imagine living without it now. Everyone needs to buy this right now!"
    },
    {
      id: 3,
      title: "Generic Hype",
      rating: 4,
      text: "Wow, this is truly the best product ever! It changed my life completely from day one. I cannot imagine living without it now. Everyone needs to buy this right now!"
    },
    {
      id: 4,
      title: "Generic Hype",
      rating: 4,
      text: "Wow, this is truly the best product ever! It changed my life completely from day one. I cannot imagine living without it now. Everyone needs to buy this right now!"
    }
  ];

  return (
    <main className="min-h-screen bg-[#FAF8F3] w-full pt-28 pb-16">
      <div className="max-w-[1625px] mx-auto px-4 lg:px-[158px]">
        
        {/* Main Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start mt-6">
          
          {/* Left Column: Image Grid */}
          <div className="lg:col-span-6 flex flex-col items-center w-full">
            {/* Big Main Image Container */}
            <div 
              className="w-full relative bg-white border-[1.5px] border-black rounded-[5px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] overflow-hidden flex items-center justify-center p-6"
              style={{ height: "min(709px, 50vw)", minHeight: "350px" }}
            >
              <img
                src={getProductImageUrl(selectedImage || product.primary_image_url, product.name)}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Thumbnails Row */}
            <div className="grid grid-cols-3 gap-4 mt-6 w-full">
              {[product.primary_image_url, ...(product.secondary_images ?? [])].slice(0, 3).map((imgUrl, idx) => {
                const isActive = selectedImage === imgUrl;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl!)}
                    className={`aspect-[1.1] relative bg-white border-[1.5px] border-black rounded-[5px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] overflow-hidden flex items-center justify-center p-2 transition-all ${
                      isActive ? "ring-2 ring-[#76A52E]" : "hover:opacity-90"
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

          {/* Right Column: Spec Sheet */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Rating Stars and Count */}
            <div className="flex items-center gap-2">
              <div className="flex text-[#76A52E] text-xl gap-0.5">
                ★ ★ ★ ★ ★
              </div>
              <span className="text-sm font-normal text-black font-['IBM_Plex_Sans']">4/5</span>
              <span className="text-sm text-black font-normal font-['IBM_Plex_Sans'] border-b border-dashed border-black pb-0.5 cursor-pointer">
                1,999 Reviews
              </span>
            </div>

            {/* Eco Badge */}
            <div className="inline-flex h-[47px] items-center justify-center rounded-[30px] border-[1.5px] border-black bg-[#FAF8F3] px-6">
              <span className="text-sm font-normal text-black font-['IBM_Plex_Sans'] uppercase tracking-wider">
                Decomposeable and Eco-friendly
              </span>
            </div>

            {/* Product Title */}
            <h1 
              className="text-4xl lg:text-[48px] font-bold leading-tight text-[#5E3A16]"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {product.name}
            </h1>

            {/* Description list */}
            <div className="text-lg lg:text-[24px] text-[#2B4D0E] font-normal leading-[34px] font-['IBM_Plex_Sans'] space-y-4">
              <p>
                1. {product.description || "Pressed entirely from natural leaves, this organic tableware is heat-treated for strength and certified food-safe. A beautiful, compostable alternative to paper and plastic."}
              </p>
              <p>
                2. Made from eco-friendly sugarcane fiber , Paper Disposable , Microwave Safe | Leak Proof
              </p>
            </div>

            {/* Price tag */}
            <div className="flex items-baseline gap-4">
              <span className="text-3xl lg:text-[36px] font-semibold text-black font-['IBM_Plex_Sans']">
                ₹{Math.round(displayPrice)}
              </span>
              <span className="text-lg lg:text-[24px] font-normal text-black font-['IBM_Plex_Sans']">
                Pack of {selectedPack ? selectedPack.name.replace(/\D/g, "") || "10" : "10"}
              </span>
            </div>

            {/* Pack Size Selectors */}
            {product.packs && product.packs.length > 0 && (
              <div className="grid grid-cols-3 gap-4 pt-2">
                {product.packs.map((pack) => {
                  const isSelected = pack.id === selectedPackId;
                  return (
                    <button
                      key={pack.id}
                      onClick={() => setSelectedPackId(pack.id)}
                      className={`h-[60px] rounded-[5px] text-[20px] lg:text-[24px] font-normal shadow-[0px_4px_4px_rgba(0,0,0,0.25)] transition duration-150 ${
                        isSelected ? "bg-[#9FD4F2]/50 text-black" : "bg-[#FAF8F3] text-black hover:bg-neutral-100"
                      }`}
                      style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                    >
                      {pack.name}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Add to Cart Actions row */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              {/* Quantity selector */}
              <div className="flex items-center justify-between w-[172px] h-[47px] border-[1.5px] border-black rounded-[30px] bg-[#FAF8F3] px-4">
                <button
                  onClick={() => setQuantity((q) => Math.max(minQty, q - 1))}
                  className="text-[40px] font-normal text-black pb-1 active:scale-90 transition-transform"
                >
                  -
                </button>
                <span className="text-[30px] font-normal text-black">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="text-[40px] font-normal text-black pb-1 active:scale-90 transition-transform"
                >
                  +
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="flex-grow max-w-[342px] h-[47px] rounded-[30px] text-[24px] font-semibold text-[#103F5E] bg-[#103F5E]/20 hover:opacity-95 transition flex items-center justify-center"
              >
                {adding ? "Adding..." : success ? "✓ Added!" : "Add to Cart"}
              </button>

              {/* Wishlist Heart Icon button */}
              <button 
                onClick={() => alert("Added to Wishlist!")}
                className="w-[66px] h-[47px] rounded-[30px] bg-[#103F5E]/20 flex items-center justify-center text-[#103F5E] hover:opacity-90 active:scale-95 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Buy Now action */}
            <div className="pt-2">
              <button
                onClick={handleBuyNow}
                className="w-full max-w-[679px] h-[47px] rounded-[30px] text-[24px] font-semibold text-[#103F5E] bg-[#9FD4F2]/30 hover:opacity-95 transition flex items-center justify-center"
              >
                Buy Now
              </button>
            </div>

          </div>
        </div>

        {/* Tab Selection Section */}
        <div className="mt-20 border-b border-[#444444] relative flex justify-center gap-16">
          {["Description", "Additional Information", "Reviews"].map((tabName) => {
            const tabId = tabName.toLowerCase() === "description" ? "description" : tabName.toLowerCase() === "additional information" ? "info" : "reviews";
            const isActive = activeTab === tabId;
            return (
              <button
                key={tabName}
                onClick={() => setActiveTab(tabId as any)}
                className={`pb-3 text-[24px] font-normal font-['IBM_Plex_Sans'] transition-all relative ${
                  isActive ? "text-black font-semibold" : "text-[#444444] hover:text-black"
                }`}
              >
                {tabName}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-black" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="py-12 max-w-[1580px] mx-auto">
          {activeTab === "description" && (
            <div className="text-black text-xl leading-relaxed text-center font-['IBM_Plex_Sans']">
              <p>{product.description || "This product is made from 100% natural dried fallen leaves. Chemical-free, compostable, microwave safe, and extremely durable. Perfect for serving hot and cold food at events, caterings, and fast food joints."}</p>
            </div>
          )}

          {activeTab === "info" && (
            <div className="w-full border-[1.5px] border-black rounded-[5px] overflow-hidden bg-white">
              <div className="grid grid-cols-2 border-b border-black">
                <div className="p-6 font-bold text-lg text-black border-r border-black font-['IBM_Plex_Sans']">Dimensions</div>
                <div className="p-6 text-lg text-black font-['IBM_Plex_Sans']">
                  {product.dimensions_cm ? `${product.dimensions_cm.length ?? 23}x${product.dimensions_cm.width ?? 23} cm` : "23x23 cm"}
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="p-6 font-bold text-lg text-black border-r border-black font-['IBM_Plex_Sans']">Weight</div>
                <div className="p-6 text-lg text-black font-['IBM_Plex_Sans']">
                  {product.weight_grams ? `${product.weight_grams}g` : "23g"}
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-10">
              {/* Reviews List */}
              <div className="space-y-6">
                {reviewsLoading ? (
                  <div className="flex justify-center py-6">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#76A52E] border-t-transparent" />
                  </div>
                ) : reviews.length === 0 ? (
                  // Fall back to mock reviews if no reviews are in the database yet
                  mockReviews.map((r) => (
                    <div
                      key={r.id}
                      className="border-[1.5px] border-black rounded-[5px] p-8 bg-[#FAF8F3] shadow-sm flex flex-col justify-start gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-black text-[24px] font-['IBM_Plex_Sans']">{r.title}</span>
                        <div className="flex text-[#76A52E] text-[20px] gap-0.5">
                          ★ ★ ★ ★ ★
                        </div>
                        <span className="text-[20px] text-black font-normal font-['IBM_Plex_Sans']">4/5</span>
                      </div>
                      <p className="text-black text-[24px] font-medium leading-[34px] font-['IBM_Plex_Sans']">
                        "{r.text}"
                      </p>
                    </div>
                  ))
                ) : (
                  reviews.map((r) => (
                    <div
                      key={r.id}
                      className="border-[1.5px] border-black rounded-[5px] p-8 bg-[#FAF8F3] shadow-sm flex flex-col justify-start gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-black text-[24px] font-['IBM_Plex_Sans']">
                          {r.reviewer?.name || "Verified Customer"}
                        </span>
                        <div className="flex text-[#76A52E] text-[20px] gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className={star <= r.rating ? "text-[#76A52E]" : "text-gray-300"}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-[20px] text-black font-normal font-['IBM_Plex_Sans']">{r.rating}/5</span>
                      </div>
                      <p className="text-black text-[24px] font-medium leading-[34px] font-['IBM_Plex_Sans']">
                        "{r.review || "No review content provided."}"
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Review Submission Form */}
              <div className="border-[1.5px] border-black rounded-[5px] p-8 bg-[#FAF8F3] shadow-sm w-full">
                <h3 className="text-[24px] font-bold text-black mb-4 font-['IBM_Plex_Sans']">Write a Review</h3>
                {user ? (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-lg font-bold text-gray-700 mb-1 font-['IBM_Plex_Sans']">Your Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewRating(star)}
                            className="text-4xl transition-transform hover:scale-105 active:scale-95"
                          >
                            <span className={star <= newRating ? "text-[#76A52E]" : "text-gray-300"}>★</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-lg font-bold text-gray-700 mb-1 font-['IBM_Plex_Sans']">Your Review</label>
                      <textarea
                        value={newReviewText}
                        onChange={(e) => setNewReviewText(e.target.value)}
                        placeholder="Write your review here..."
                        rows={4}
                        className="w-full p-4 border border-black rounded-[5px] bg-[#FAF8F3] text-black text-[20px] focus:outline-none focus:ring-2 focus:ring-[#76A52E]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="px-8 py-3 rounded-full border border-black bg-[#9FD4F2]/50 text-xl font-bold hover:bg-[#9FD4F2] transition active:scale-95"
                    >
                      {submittingReview ? "Submitting..." : "Submit Review"}
                    </button>
                  </form>
                ) : (
                  <p className="text-lg text-gray-500 font-semibold font-['IBM_Plex_Sans']">
                    Please{" "}
                    <Link href="/client/login" className="text-[#103F5E] underline">
                      log in
                    </Link>{" "}
                    to leave a review.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Trending Products */}
        <div className="mt-20 pt-12 border-t border-[#444444]">
          <h2 
            className="text-[48px] font-semibold text-[#103F5E] mb-8"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Trending Products
          </h2>
          <div className="border border-black flex flex-col lg:flex-row bg-[#FAF8F3] max-w-[1580px] mx-auto overflow-hidden rounded-[5px]">
            {(trending.length > 0 ? trending : [1, 2, 3, 4]).map((p: any, idx) => {
              const isMock = typeof p === "number";
              const id = isMock ? p : p.id;
              const name = isMock ? "6N Panipuri Bowls" : p.name;
              const price = isMock ? 500 : Math.round(parseFloat(p.discounted_price ?? p.base_price));
              const image = isMock ? "" : getProductImageUrl(p.primary_image_url, p.name);

              return (
                <div 
                  key={id} 
                  className={`flex-1 p-8 h-[395px] bg-[#FAF8F3] flex flex-col justify-between ${
                    idx !== 3 ? "border-b lg:border-b-0 lg:border-r border-black" : ""
                  }`}
                >
                  <div>
                    {/* Thumbnail Image Container */}
                    <Link href={isMock ? "#" : `/products/${p.id}`} className="w-[171px] h-[154px] bg-white border-[1.5px] border-black rounded-[5px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex items-center justify-center overflow-hidden mx-auto flex-shrink-0 hover:opacity-90 block">
                      <img
                        src={isMock ? "/images/home/productcard.webp" : image}
                        alt={name}
                        className="max-h-[130px] max-w-[140px] object-contain p-2"
                      />
                    </Link>
                    <Link href={isMock ? "#" : `/products/${p.id}`} className="hover:underline block mt-4">
                      <h3 className="font-medium text-black text-[24px] truncate font-['IBM_Plex_Sans']">{name}</h3>
                    </Link>
                    <p className="text-[24px] font-semibold text-black font-['IBM_Plex_Sans'] mt-1">₹{price}</p>
                  </div>

                  <div className="flex items-end justify-between pt-2">
                    <div className="text-[24px] text-black font-normal font-['IBM_Plex_Sans'] leading-none">
                      <p>Pack of 100</p>
                      <p className="mt-1">Pack of 50</p>
                    </div>
                    <button
                      onClick={async () => {
                        if (isMock) return;
                        try {
                          await addToCart(p.id, 1);
                          alert("Added to cart!");
                        } catch (e: any) {
                          alert(e.message || "Failed to add product to cart.");
                        }
                      }}
                      className="w-[155px] h-[58px] rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] text-[24px] text-black font-normal flex items-center justify-center shadow-sm hover:bg-neutral-100 active:scale-95 transition-all"
                      style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Explore More bottom action bar */}
        <div className="w-full flex justify-end mt-12">
          <Link
            href="/products"
            className="inline-flex h-[70px] px-8 items-center justify-between gap-6 rounded-full border border-black bg-[#9FD4F2] text-[24px] font-bold text-[#1B6A9E] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:translate-y-[-2px] transition-all"
            style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
          >
            <span>Explore More</span>
            <span className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-white text-xl font-bold border border-black">
              <svg className="w-6 h-6 text-[#76A52E]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        </div>

      </div>
    </main>
  );
}
