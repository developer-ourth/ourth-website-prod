"use client";
import toast from "react-hot-toast";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./auth-context";
import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart as clearCartApi,
  type Cart,
} from "@/lib/api";

interface CartContextValue {
  cart: Cart | null;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity?: number, packId?: number | null) => Promise<void>;
  updateQty: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (authLoading) return;
    if (!user) {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      const res = await getCart();
      setCart(res.data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (!authLoading) {
      fetchCart();
    }
  }, [authLoading, fetchCart]);

  const addToCart = useCallback(
    async (productId: number, quantity = 1, packId: number | null = null) => {
      if (!user) {
        throw new Error("Please log in to add items to cart.");
      }
      if (user.role === "vendor" && user.kyc_status !== "verified" && user.kyc_status !== "approved") {
        throw new Error("Your Business KYC is currently pending review. You cannot place B2B wholesale orders until verified. Please upload documents in your Business KYC dashboard.");
      }
      setLoading(true);
      try {
        const res = await addCartItem(productId, quantity, packId);
        setCart(res.data);
        toast.success("Added to cart! 🌿");
      } catch (err: any) {
        toast.error(err.message || "Failed to add to cart");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const updateQty = useCallback(
    async (itemId: number, quantity: number) => {
      const item = cart?.items.find((i) => i.id === itemId);
      if (item && user?.role === "vendor") {
        const minQty = item.product?.min_order_quantity ?? 1;
        if (quantity < minQty) {
          toast.error(`Minimum order quantity for "${item.product?.name}" is ${minQty} units.`);
          return;
        }
      }

      const prevCart = cart;
      if (cart) {
        setCart({
          ...cart,
          items: cart.items.map(i => i.id === itemId ? { ...i, quantity } : i)
        });
      }

      try {
        const res = await updateCartItem(itemId, quantity);
        setCart(res.data);
      } catch (err: any) {
        setCart(prevCart);
        toast.error(err.message || "Failed to update quantity");
      }
    },
    [cart, user]
  );

  const removeFromCart = useCallback(
    async (itemId: number) => {
      const prevCart = cart;
      if (cart) {
        setCart({
          ...cart,
          items: cart.items.filter(i => i.id !== itemId)
        });
      }
      
      try {
        await removeCartItem(itemId);
        await fetchCart();
        toast.success("Removed from cart");
      } catch (err: any) {
        setCart(prevCart);
        toast.error("Failed to remove item");
      }
    },
    [cart, fetchCart]
  );

  const clearCart = useCallback(async () => {
    setLoading(true);
    try {
      await clearCartApi();
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
}
