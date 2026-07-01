import { Metadata } from "next";
import type { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Calender Page",
  // other metadata
};

export default function Layout({ children }: PropsWithChildren) {
  return children;
}
