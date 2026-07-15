import "@/css/satoshi.css";
import "@/css/style.css";

import { AppShell } from "@/components/Layouts/app-shell";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, Poppins } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";

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

export const viewport: Viewport = {
  themeColor: "#FAF8F3",
};

export const metadata: Metadata = {
  title: {
    template: "%s | Healing OURTH",
    default: "Healing OURTH — Sustainable Leaf Tableware for a Plastic-Free Future",
  },
  description:
    "OURTH crafts bowls, plates and takeaway tableware entirely from natural leaves — giving vendors a beautiful, compostable alternative to plastic.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Healing OURTH",
  },
  icons: {
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" as="image" href="/images/hero/hero.gif" />
      </head>
      <body className={`${ibmPlexSans.variable} ${poppins.variable}`}>
        {/* Meta Pixel Code */}
        {process.env.NEXT_PUBLIC_META_PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
        <Providers>
          <NextTopLoader color="#1A5C2E" showSpinner={false} />
          <AppShell>{children}</AppShell>
        </Providers>
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
      </body>
    </html>
  );
}
