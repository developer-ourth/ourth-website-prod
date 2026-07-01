import { Metadata } from "next";
import type { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Basic Chart",
};

export default function Layout({ children }: PropsWithChildren) {
  return children;
}
