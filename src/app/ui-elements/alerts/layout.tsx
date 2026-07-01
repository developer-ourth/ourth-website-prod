import { Metadata } from "next";
import type { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Alerts",
  // other metadata
};

export default function Layout({ children }: PropsWithChildren) {
  return children;
}
