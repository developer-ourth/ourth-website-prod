import { Metadata } from "next";
import type { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Form Layout",
};

export default function Layout({ children }: PropsWithChildren) {
  return children;
}
