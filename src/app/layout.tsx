import "@/css/satoshi.css";
import "@/css/style.css";

import { AppShell } from "@/components/Layouts/app-shell";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import type { Metadata } from "next";
import { IBM_Plex_Sans, Poppins } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | OURTH-Dashboard",
    default: "OURTH-Dashboard",
  },
  description:
    "Next.js admin dashboard toolkit with 200+ templates, UI components, and integrations for fast dashboard development.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${ibmPlexSans.variable} ${poppins.variable}`}>
        <Providers>
          <NextTopLoader color="#5750F1" showSpinner={false} />
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
