"use client";

import { AuthProvider } from "@/contexts/auth-context";
import { CartProvider } from "@/contexts/cart-context";
import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("OURTH PWA Service Worker registered with scope:", reg.scope);
        })
        .catch((err) => {
          console.error("OURTH PWA Service Worker registration failed:", err);
        });
    }
  }, []);

  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <AuthProvider>
        <CartProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

