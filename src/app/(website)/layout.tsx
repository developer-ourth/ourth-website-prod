import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import "@/css/satoshi.css";
import "@/css/style.css";
import { IBM_Plex_Sans, Poppins } from "next/font/google";

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
  title: "Healing OURTH",
  description:
    "OURTH crafts bowls, plates and takeaway tableware entirely from natural leaves — giving vendors a beautiful, compostable alternative to plastic.",
};

export default function WebsiteLayout({ children }: PropsWithChildren) {
  return <div className={`${ibmPlexSans.variable} ${poppins.variable}`}>{children}</div>;
}
