"use client";

import { usePathname, useRouter } from "next/navigation";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { Header } from "@/components/Layouts/header";
import { Sidebar } from "@/components/Layouts/sidebar";
import { useAuth } from "@/contexts/auth-context";

function isAuthRoute(pathname: string): boolean {
  return (
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname === "/client/login" ||
    pathname === "/client/register"
  );
}

function isPublicRoute(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname === "/about" ||
    pathname === "/products" ||
    pathname.startsWith("/products/") ||
    pathname === "/contact" ||
    pathname === "/privacy-policy" ||
    pathname === "/refund" ||
    pathname === "/terms" ||
    pathname === "/cart"
  );
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

  if (isAuthRoute(pathname) || isPublicRoute(pathname)) {
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
