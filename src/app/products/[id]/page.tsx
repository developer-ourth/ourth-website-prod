"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/(website)/_components/Navbar";
import Footer from "@/app/(website)/_components/Footer";
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
  const [activeTab, setActiveTab] = useState<"description" | "info" | "reviews">("info");
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
    <main className="min-h-screen bg-[#DCEEFB] flex flex-col justify-between">

      <div className="flex-grow max-w-[1625px] mx-auto px-4 lg:px-[146px] pt-36 pb-20 w-full">
        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-transparent mt-10">

          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 flex flex-col items-center">
            {/* Main Preview */}
            <div className="w-full max-w-[795px] h-[450px] md:h-[717px] relative bg-white border-[1.5px] border-black rounded-[5px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] overflow-hidden flex items-center justify-center p-4">
              <img
                src={getProductImageUrl(selectedImage || product.primary_image_url, product.name)}
                alt={product.name}
                className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Thumbnails Row */}
            <div className="flex gap-4 mt-6 w-full max-w-[795px] justify-start overflow-x-auto py-1">
              {[product.primary_image_url, ...(product.secondary_images ?? [])].filter(Boolean).map((imgUrl, idx) => {
                const isActive = selectedImage === imgUrl;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl!)}
                    className={`w-[120px] md:w-[247px] h-[100px] md:h-[222px] relative bg-white border-[1.5px] border-black rounded-[5px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] overflow-hidden flex items-center justify-center p-2 transition-all ${isActive ? "ring-2 ring-[#103F5E]" : "hover:opacity-90"
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
              <div className="flex text-[#C7E08E] text-2xl">
                {[1, 2, 3, 4, 5].map((star) => {
                  const avgRound = reviews.length > 0
                    ? Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)
                    : 0;
                  return (
                    <span key={star} className={star <= avgRound ? "text-[#C7E08E]" : "text-gray-300"}>
                      ★
                    </span>
                  );
                })}
              </div>
              <span className="text-[20px] font-normal text-black" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                {reviews.length > 0
                  ? `${(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}/5`
                  : "0/5"}
              </span>
              <span className="text-[20px] text-black font-normal border-b border-dashed border-black pb-0.5" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
              </span>
            </div>

            {/* Badge capsule */}
            <div
              className="inline-flex w-[395px] max-w-full h-[47px] items-center justify-center rounded-[30px] border-[1.5px] border-black bg-[#FAF8F3] text-[24px] font-normal text-black"
              style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
              Decomposeable and Eco-friendly
            </div>

            {/* Title */}
            <h1
              className="text-4xl lg:text-[48px] font-bold text-black leading-tight"
              style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
            >
              {product.name}
            </h1>

            {/* Description list / details */}
            <div className="space-y-3 text-[24px] text-black leading-relaxed max-w-2xl font-normal" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
              <p>{product.description || "Pressed entirely from natural leaves, this organic tableware is heat-treated for strength and certified food-safe. A beautiful, compostable alternative to paper and plastic."}</p>
            </div>

            {/* Price Display */}
            <div className="pt-4 flex items-center gap-3">
              <div className="flex items-center gap-2">
                {activeSalePrice ? (
                  <>
                    <span className="text-[36px] font-semibold text-black" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                      ₹{activeSalePrice.toFixed(2)}
                    </span>
                    <span className="text-xl text-gray-500 line-through font-bold">
                      ₹{activeBasePrice.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-[36px] font-semibold text-black" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                    ₹{activeBasePrice.toFixed(2)}
                  </span>
                )}
                <span className="text-[24px] text-black" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                  {selectedPack ? `per ${selectedPack.name}` : `per ${product.unit}`}
                </span>
              </div>
            </div>

            {/* Pack Size Selector */}
            {product.packs && product.packs.length > 0 && (
              <div className="space-y-3 pt-2">
                <label className="text-[24px] font-normal text-black block" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                  Select Pack Size:
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.packs.map((pack) => {
                    const isSelected = pack.id === selectedPackId;
                    return (
                      <button
                        key={pack.id}
                        onClick={() => setSelectedPackId(pack.id)}
                        className={`w-[233px] h-[60px] rounded-[5px] text-[24px] font-normal border-[1.5px] border-black shadow-[0px_4px_4px_rgba(0,0,0,0.25)] transition duration-200 ${isSelected
                          ? "bg-[#9FD4F2] text-black"
                          : "bg-[#FAF8F3] text-black hover:bg-[#FAF8F3]/90"
                          }`}
                        style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                      >
                        {pack.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions: Qty + Cart + Buy */}
            <div className="pt-4 space-y-4 w-full">
              <div className="flex flex-wrap gap-4 items-center">
                {/* Quantity selector */}
                <div className="flex items-center justify-between w-[176px] h-[47px] border-[1.5px] border-black rounded-[30px] bg-[#FAF8F3] px-4">
                  <button
                    onClick={() => setQuantity(q => Math.max(minQty, q - 1))}
                    className="text-[40px] font-normal text-black pb-1 hover:scale-110 active:scale-95 transition"
                    style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                  >
                    -
                  </button>
                  <span className="text-[30px] font-normal text-black" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="text-[40px] font-normal text-black pb-1 hover:scale-110 active:scale-95 transition"
                    style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className={`w-[319px] lg:w-[445px] h-[47px] rounded-[30px] font-semibold border-[1.5px] border-black text-[24px] text-white flex items-center justify-center shadow-[0px_4px_4px_rgba(0,0,0,0.25)] bg-[#103F5E] hover:opacity-95 transition`}
                  style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                >
                  {adding ? "Adding..." : success ? "✓ Added!" : "Add to Cart"}
                </button>
              </div>

              {/* Buy Now */}
              <button
                onClick={handleBuyNow}
                className="w-full lg:w-[640px] h-[47px] rounded-[30px] bg-[#5CB6E8] text-white font-semibold border-[1.5px] border-black shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:opacity-95 transition text-[24px] flex items-center justify-center"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
              >
                Buy Now
              </button>

              {isB2B && minQty > 1 && (
                <p className="text-sm text-[#103F5E] font-semibold mt-1">
                  * Note: As a B2B vendor, a minimum order quantity of {minQty} applies.
                </p>
              )}
            </div>

          </div>

        </div>

        {/* Tab Selection Section */}
        <div className="mt-16 border-b border-[#444444] relative">
          <div className="flex gap-16 justify-center text-[24px] text-[#444444] font-normal" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
            <button
              onClick={() => setActiveTab("description")}
              className={`pb-3 relative transition-all ${activeTab === "description" ? "text-black font-semibold" : "hover:text-black/70"
                }`}
            >
              Description
              {activeTab === "description" && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("info")}
              className={`pb-3 relative transition-all ${activeTab === "info" ? "text-black font-semibold" : "hover:text-black/70"
                }`}
            >
              Additional Information
              {activeTab === "info" && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-3 relative transition-all ${activeTab === "reviews" ? "text-black font-semibold" : "hover:text-black/70"
                }`}
            >
              Reviews
              {activeTab === "reviews" && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black" />
              )}
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="py-8">
          {activeTab === "description" && (
            <div className="text-black text-[24px] leading-relaxed max-w-4xl mx-auto text-center" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
              <p>{product.description || "This product is made from 100% natural dried fallen leaves. Chemical-free, compostable, microwave safe, and extremely durable. Perfect for serving hot and cold food at events, caterings, and fast food joints."}</p>
            </div>
          )}

          {activeTab === "info" && (
            <div className="w-full max-w-[1251px] h-auto border-[1.5px] border-black rounded-[5px] overflow-hidden bg-transparent mx-auto">
              <div className="grid grid-cols-2 border-b border-black">
                <div className="p-6 font-normal text-[24px] text-black border-r border-black" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                  Dimensions
                </div>
                <div className="p-6 text-[24px] text-black font-normal" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                  {product.dimensions_cm ? `${product.dimensions_cm.length ?? 23}x${product.dimensions_cm.width ?? 23}` : "23x23"}
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="p-6 font-normal text-[24px] text-black border-r border-black" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                  Weight
                </div>
                <div className="p-6 text-[24px] text-black font-normal" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                  {product.weight_grams ? `${product.weight_grams}g` : "23g"}
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-10 max-w-[1251px] mx-auto w-full">
              {/* Reviews List */}
              <div className="space-y-6">
                {reviewsLoading ? (
                  <div className="flex justify-center py-10">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#76A52E] border-t-transparent" />
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="border-[1.5px] border-black rounded-[5px] p-10 bg-[#FAF8F3] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] text-center">
                    <p className="text-black text-[24px] font-normal" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                      No reviews yet for this product. Be the first to share your experience!
                    </p>
                  </div>
                ) : (
                  reviews.map((r) => (
                    <div
                      key={r.id}
                      className="border-[1.5px] border-black rounded-[5px] p-6 bg-[#FAF8F3] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] w-full flex flex-col justify-start gap-4"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-4">
                          <span
                            className="font-semibold text-black text-[24px]"
                            style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                          >
                            {r.reviewer?.name || "Verified Customer"}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <div className="flex text-[#C7E08E] text-[28px] leading-none">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span key={star} className={star <= r.rating ? "text-[#C7E08E]" : "text-gray-300"}>
                                  ★
                                </span>
                              ))}
                            </div>
                            <span
                              className="text-[20px] text-gray-500 font-normal mt-1"
                              style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                            >
                              {r.rating}/5
                            </span>
                          </div>
                        </div>
                        <span className="text-[18px] text-gray-500" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                          {new Date(r.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      {r.review && (
                        <p
                          className="text-black text-[24px] leading-[34px] font-normal"
                          style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                        >
                          "{r.review}"
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Review Submission Form */}
              <div className="border-[1.5px] border-black rounded-[5px] p-8 bg-[#FAF8F3] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] w-full">
                <h3
                  className="text-[32px] font-bold text-black mb-6"
                  style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
                >
                  Write a Review
                </h3>

                {user ? (
                  <form onSubmit={handleSubmitReview} className="space-y-6">
                    <div>
                      <label className="block text-[22px] font-medium text-black mb-2" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                        Your Rating
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewRating(star)}
                            className="text-[40px] leading-none transition-transform hover:scale-110 active:scale-95"
                          >
                            <span className={star <= newRating ? "text-[#C7E08E]" : "text-gray-300"}>
                              ★
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[22px] font-medium text-black mb-2" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                        Your Review
                      </label>
                      <textarea
                        value={newReviewText}
                        onChange={(e) => setNewReviewText(e.target.value)}
                        placeholder="Share your thoughts about this product..."
                        rows={4}
                        className="w-full p-4 border-[1.5px] border-black rounded-[5px] bg-[#FAF8F3] text-black text-[20px] focus:outline-none focus:ring-2 focus:ring-[#103F5E] shadow-inner"
                        style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="w-full md:w-[240px] h-[54px] rounded-[30px] bg-[#103F5E] text-white font-semibold border-[1.5px] border-black shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:opacity-95 transition text-[22px] flex items-center justify-center"
                      style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                    >
                      {submittingReview ? "Submitting..." : "Submit Review"}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-[22px] text-gray-700 mb-4" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                      You must be logged in to post a review.
                    </p>
                    <Link
                      href="/client/login"
                      className="inline-flex items-center justify-center px-8 py-3 rounded-[30px] bg-[#5CB6E8] text-white font-semibold border-[1.5px] border-black shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:opacity-95 transition text-[20px]"
                      style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                    >
                      Log In
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}


        </div>

        {/* Trending Products Section */}
        {trending.length > 0 && (
          <div className="mt-16 pt-12 border-t border-black/10">
            <h2
              className="text-[48px] font-semibold text-[#103F5E] mb-8"
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
                    className="w-full max-w-[294px] min-h-[433px] rounded-[5px] border-[1.5px] border-black bg-[#C7E08E] p-6 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex flex-col justify-between hover:translate-y-[-2px] transition-all select-none"
                  >
                    <div>
                      {/* Product Thumbnail */}
                      <div className="w-[198px] h-[179px] mx-auto relative bg-white border border-black rounded-[5px] overflow-hidden mb-4 flex items-center justify-center p-2 shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                        <img
                          src={getProductImageUrl(p.primary_image_url, p.name)}
                          alt={p.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <h3 className="font-medium text-black text-[24px] leading-[34px] line-clamp-1" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>{p.name}</h3>
                      <p className="text-[24px] text-black font-normal mt-1" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>Pack of 10</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-black">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-black text-[24px]" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>₹{pPrice.toFixed(2)}</span>
                        <span className="w-[122px] h-[32px] rounded-[30px] bg-[#FAF8F3] border-[1.5px] border-black text-black font-normal text-[24px] flex items-center justify-center shadow-[2px_2px_0px_#000000]">
                          Add
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Decorative Snack Banner */}
        <div className="mt-16 w-full max-w-[960px] mx-auto h-[338px] rounded-[5px] border-[1.5px] border-black overflow-hidden relative select-none shadow-[4px_4px_0px_#000000]">
          <img
            src="/images/Healing_ourth_advertisment.png"
            alt="Healing Ourth Advertisement"
            className="w-full h-full object-cover"
          />
        </div>

      </div>

    </main>
  );
}

