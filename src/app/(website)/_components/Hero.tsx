"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getWebsiteSettingsApi } from "@/lib/api";

const DEFAULT_HERO_BANNER = "/images/hero/Freedom isn’t just a celebration. It’s a responsibility..gif";

export default function Hero() {
  const [heroBannerUrl, setHeroBannerUrl] = useState<string>(DEFAULT_HERO_BANNER);

  useEffect(() => {
    getWebsiteSettingsApi()
      .then((res) => {
        if (res?.data?.website_home_banner_url) {
          setHeroBannerUrl(res.data.website_home_banner_url);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative w-full overflow-hidden border-b-[1.5px] border-black mt-[70px] lg:mt-[80px] xl:mt-[95px] bg-[#7c5835]">
      {/* Background street scene */}
      <div className="relative w-full h-[260px] sm:h-[500px] md:h-[700px] lg:h-[980px]">
        <Image
          src={heroBannerUrl}
          alt="Freedom isn’t just a celebration. It’s a responsibility."
          fill
          priority
          unoptimized
          className="object-cover object-center"
        />
      </div>
    </section>
  );
}

