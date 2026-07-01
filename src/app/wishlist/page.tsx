"use client";

import { useEffect, useCallback } from "react";
import useSWR from "swr";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import {
  getConsumerWishlistApi,
  removeFromWishlistApi,
  getProductImageUrl,
} from "@/lib/api";
import Navbar from "@/app/(website)/_components/Navbar";
import Footer from "@/app/(website)/_components/Footer";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function WishlistPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { addToCart } = useCart();
  const { data: wishlist = [], error, mutate, isLoading: isWishlistLoading } = useSWR(
    user ? "/me/wishlist" : null,
    () => getConsumerWishlistApi().then((res) => res.data || [])
  );

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/client/login");
    }
  }, [user, isLoading, router]);

  const handleRemove = async (productId: number) => {
    // Optimistic UI Update
    mutate(wishlist.filter((w: any) => w.product_id !== productId), false);
    
    try {
      await removeFromWishlistApi(productId);
      mutate(); // Revalidate with server
      toast.success("Removed from wishlist");
    } catch (error: any) {
      mutate(); // Revert on failure
      toast.error(error.message || "Failed to remove from wishlist");
    }
  };

  const handleAddToCart = async (product: any) => {
    try {
      await addToCart(product.id, 1);
      router.push("/cart");
    } catch (error) {
      console.error("Failed to add to cart", error);
    }
  };

  if (isLoading || isWishlistLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-32 pb-24 px-4 lg:px-[146px] bg-[#FAF8F3] font-sans">
          <div className="max-w-[1200px] mx-auto">
            <div className="mb-8">
              <Skeleton className="h-12 w-64 mb-4 bg-gray-200" />
              <Skeleton className="h-6 w-96 bg-gray-200" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-[5px] bg-white/85 p-4 shadow-lg flex flex-col h-[400px]">
                  <Skeleton className="w-full aspect-square rounded-[5px] bg-gray-200 mb-4" />
                  <Skeleton className="h-6 w-3/4 bg-gray-200 mb-4" />
                  <Skeleton className="h-8 w-1/4 bg-gray-200 mb-6" />
                  <Skeleton className="h-12 w-full mt-auto rounded-[30px] bg-gray-200" />
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 px-4 lg:px-[146px] bg-[#FAF8F3] font-sans">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-[#5E3A16] mb-2" style={{ fontFamily: "var(--font-poppins)" }}>
              Your Wishlist
            </h1>
            <p className="text-gray-600 font-medium">Keep track of your favorite items for later.</p>
          </div>

          {wishlist.length === 0 ? (
            <div className="rounded-[5px] bg-white/85 backdrop-blur-xl p-12 shadow-lg text-center flex flex-col items-center">
              <div className="w-24 h-24 mb-6 rounded-full bg-[#E8F0D8] flex items-center justify-center text-4xl">
                🤍
              </div>
              <h2 className="text-2xl font-bold text-black mb-4">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Looks like you haven't added anything to your wishlist yet. Explore our marketplace to find products you'll love!
              </p>
              <Link 
                href="/products"
                className="px-8 py-3.5 bg-[#76A52E] text-white font-bold rounded-[30px] hover:opacity-90 transition shadow-md"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((item) => {
                const product = item.product;
                if (!product) return null;
                const imageUrl = getProductImageUrl(product.primary_image_url, product.name);
                
                return (
                  <div key={item.id} className="rounded-[5px] bg-white/85 backdrop-blur-xl p-4 shadow-lg flex flex-col transition hover:-translate-y-1 duration-200">
                    <div className="relative w-full aspect-square rounded-[5px] bg-[#FAF8F3] mb-4 overflow-hidden group">
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-contain p-4 group-hover:scale-105 transition duration-300"
                      />
                      <button
                        onClick={() => handleRemove(product.id)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white text-red-500 shadow-md flex items-center justify-center hover:bg-red-50 transition"
                        title="Remove from wishlist"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                      <Link href={`/products/${product.id}`} className="block">
                        <h3 className="font-bold text-black text-lg line-clamp-1 hover:text-[#76A52E] transition">
                          {product.name}
                        </h3>
                      </Link>
                      
                      <div className="flex items-end gap-2 mt-2 mb-4">
                        <span className="font-bold text-xl text-black">
                          ₹{product.discounted_price ?? product.base_price}
                        </span>
                        {product.discounted_price && (
                          <span className="text-sm text-gray-500 line-through mb-0.5">
                            ₹{product.base_price}
                          </span>
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full py-2.5 mt-auto bg-[#25784C] text-white font-bold rounded-[30px] hover:opacity-90 transition shadow-md"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
