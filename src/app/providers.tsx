"use client";

import { AuthProvider } from "@/contexts/auth-context";
import { CartProvider } from "@/contexts/cart-context";
import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import { GoogleOAuthProvider } from "@react-oauth/google";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

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

  // Only wrap with GoogleOAuthProvider if we have a real client ID to avoid crashing the app
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const appContent = (
    <ThemeProvider defaultTheme="light" attribute="class">
      <AuthProvider>
        <CartProvider>
          <SidebarProvider>
            <SmoothScrollProvider>
              {children}
            </SmoothScrollProvider>
            <Toaster position="bottom-right" toastOptions={{ style: { background: '#FAF8F3', color: '#000', border: '1px solid #76A52E' } }} />
          </SidebarProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );

  if (googleClientId && googleClientId !== "MOCK_CLIENT_ID") {
    return (
      <GoogleOAuthProvider clientId={googleClientId}>
        {appContent}
      </GoogleOAuthProvider>
    );
  }

  return appContent;
}

