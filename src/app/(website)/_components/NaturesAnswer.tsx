"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCategories, type MarketCategory } from "@/lib/api";

function getCategoryEmoji(slug: string): string {
  switch (slug.toLowerCase()) {
    case "plates": return "🍽️";
    case "bowls": return "🥣";
    case "platters": return "🍹";
    case "cutlery": return "🍴";
    default: return "🌿";
  }
}

export default function ShopByCategory() {
  const [categories, setCategories] = useState<MarketCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then((res) => {
        setCategories(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section className="bg-transparent py-16">
      <div className="mx-auto max-w-[1625px] px-4 lg:px-[52px]">



        {/* Highlight Banner Photos */}
        <div className="flex flex-col lg:flex-row gap-8 justify-between mt-12">
          <div className="w-full lg:w-[711px] h-[280px] lg:h-[448px] overflow-hidden rounded-[5px] border-[1.5px] border-black shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
            <img
              src="/images/home/1.png"
              alt="Delicious organic meal in leaf bowl"
              className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="w-full lg:w-[711px] h-[280px] lg:h-[448px] overflow-hidden rounded-[5px] border-[1.5px] border-black shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
            <img
              src="/images/home/2.png"
              alt="Traditional food served in leaf bowl"
              className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
