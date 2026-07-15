"use client";

import { usePathname, useRouter } from "next/navigation";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { Header } from "@/components/Layouts/header";
import { Sidebar } from "@/components/Layouts/sidebar";
import { useAuth } from "@/contexts/auth-context";
import Navbar from "@/app/(website)/_components/Navbar";
import Footer from "@/app/(website)/_components/Footer";

function isAuthRoute(pathname: string): boolean {
  const normalized = pathname.toLowerCase().replace(/\/$/, "");
  return (
    normalized === "/login" ||
    normalized.startsWith("/login/") ||
    normalized === "/register" ||
    normalized === "/forgot-password" ||
    normalized === "/reset-password" ||
    normalized === "/complete-profile" ||
    normalized === "/client/login" ||
    normalized === "/client/register"
  );
}

function isPublicRoute(pathname: string): boolean {
  const normalized = pathname.toLowerCase().replace(/\/$/, "");
  return (
    normalized === "" ||
    normalized === "/know-us" ||
    normalized.startsWith("/know-us/") ||
    normalized === "/products" ||
    normalized.startsWith("/products/") ||
    normalized === "/contact" ||
    normalized === "/campaigns" ||
    normalized === "/privacy-policy" ||
    normalized === "/refund" ||
    normalized === "/terms" ||
    normalized === "/cart" ||
    normalized === "/client/dashboard"
  );
}

function getPublicRouteBg(pathname: string): string {
  const normalized = pathname.toLowerCase().replace(/\/$/, "");
  if (normalized === "/know-us" || normalized.startsWith("/know-us/") || normalized === "/terms" || normalized === "/privacy-policy") return "bg-[#FAF8F3]";
  if (normalized === "/cart") return "bg-[#FBEFC9]";
  if (normalized === "/products") return "bg-[#E8F0D8]";
  if (normalized.startsWith("/products/") || normalized === "/client/dashboard") return "bg-[#DCEEFB]";
  if (normalized === "/contact") return "bg-[#9BDFF2]";
  if (normalized === "/campaigns") return "bg-[#FAF8F3]";
  return "bg-[#D8EFE0]"; // Default landing page bg
}

export function AppShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user && !isAuthRoute(pathname) && !isPublicRoute(pathname)) {
      router.replace("/login");
    }
  }, [user, isLoading, pathname, router]);

  if (isPublicRoute(pathname)) {
    const bgClass = getPublicRouteBg(pathname);
    return (
      <div className={`flex flex-col min-h-screen ${bgClass}`}>
        <Navbar />
        <div className="flex-grow">{children}</div>
        <Footer />
      </div>
    );
  }

  if (isAuthRoute(pathname)) {
    return <>{children}</>;
  }

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-2 dark:bg-[#020d1a]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
        <Header />

        <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
