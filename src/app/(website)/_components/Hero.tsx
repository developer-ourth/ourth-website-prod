"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden border-b-[1.5px] border-black mt-[70px] lg:mt-[80px] xl:mt-[95px]">
      {/* Background street scene */}
      <div
        className="relative w-full h-[260px] sm:h-[500px] md:h-[700px] lg:h-[980px] bg-cover bg-center flex flex-col justify-end"
        style={{
          backgroundImage: "url('/images/hero/HOME.png')",
          backgroundColor: "#7c5835"
        }}
      </div>
    </section>
  );
}

