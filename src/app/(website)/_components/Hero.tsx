"use client";

import { motion } from "framer-motion";

const Bubble = ({ children, className, delay, mobTail, deskTail }: { children: React.ReactNode, className: string, delay: number, mobTail: string, deskTail: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay, duration: 0.5, type: "spring", bounce: 0.4 }}
    className={`absolute bg-white/90 border-[2px] md:border-[4px] border-black/70 rounded-2xl md:rounded-3xl p-2 md:p-6 text-center font-medium text-[10px] sm:text-sm md:text-lg text-black shadow-md max-w-[140px] sm:max-w-[240px] md:max-w-[380px] z-10 ${className}`}
  >
    {children}
    {/* Mobile Tail */}
    <div className={`absolute w-0 h-0 border-solid md:hidden ${mobTail}`} />
    {/* Desktop Tail */}
    <div className={`absolute w-0 h-0 border-solid hidden md:block ${deskTail}`} />
  </motion.div>
);

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden border-b-[1.5px] border-black mt-[70px] lg:mt-[80px] xl:mt-[95px]">
      {/* Background street scene */}
      <div
        className="relative w-full h-[260px] sm:h-[500px] md:h-[700px] lg:h-[980px] bg-cover bg-[center] sm:bg-center flex flex-col justify-end"
        style={{
          backgroundImage: "url('/images/hero/hero.gif')",
          backgroundColor: "#7c5835"
        }}
      >
        {/* Dialogue 1: Top Right (Man) */}
        <Bubble
          className="md:top-[15%] md:right-[15%]"
          style={{ top: "5%", right: "2%" }}
          delay={0.5}
          mobTail="border-t-[15px] border-t-black border-x-[10px] border-x-transparent bottom-[-15px] right-6"
          deskTail="border-t-[20px] border-t-black border-x-[10px] border-x-transparent bottom-[-20px] right-8"
        >
          Because this thele wala, the whole street is filled with these disgusting aluminium-coated paper donas.
        </Bubble>

        {/* Dialogue 2: Top Left (Vendor) */}
        <Bubble
          className="md:top-[20%] md:left-[15%]"
          style={{ top: "5%", left: "2%" }}
          delay={2.5}
          mobTail="border-t-[15px] border-t-black border-x-[10px] border-x-transparent bottom-[-15px] left-6"
          deskTail="border-t-[20px] border-t-black border-x-[10px] border-x-transparent bottom-[-20px] right-12"
        >
          Areeee bhaisahab! Yeh toh vohi donas hai, which you also sell at your stores.
        </Bubble>

        {/* Dialogue 3: Bottom Right (Man) */}
        <Bubble
          className="md:bottom-[35%] md:right-[20%] md:top-auto"
          style={{ bottom: "22%", right: "2%" }}
          delay={4.5}
          mobTail="border-b-[15px] border-b-black border-x-[10px] border-x-transparent top-[-15px] right-6"
          deskTail="border-l-[20px] border-l-black border-y-[10px] border-y-transparent right-[-20px] top-1/2 -translate-y-1/2"
        >
          Toh kuch karo eska!?
        </Bubble>

        {/* Dialogue 4: Bottom Left (Vendor) */}
        <Bubble
          className="md:bottom-[30%] md:left-[20%] md:top-auto"
          style={{ bottom: "22%", left: "2%" }}
          delay={6.5}
          mobTail="border-b-[15px] border-b-black border-x-[10px] border-x-transparent top-[-15px] left-6"
          deskTail="border-r-[20px] border-r-black border-y-[10px] border-y-transparent left-[-20px] top-1/2 -translate-y-1/2"
        >
          But what to do? What is the <span className="text-red-600 font-bold">solution</span>?
        </Bubble>

        {/* Purpose Banner overlayed inside the background container at the bottom */}
        <div
          className="w-full py-3 sm:py-4 md:py-5 lg:py-6 px-4 border-t-[1.5px] border-black flex items-center justify-center text-center backdrop-blur-[2px] z-20 relative"
          style={{
            backgroundColor: "rgba(27, 106, 158, 0.5)", // #1B6A9E on 50% opacity
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)" // Safari support
          }}
        >
          <h2
            className="text-base sm:text-xl md:text-3xl lg:text-5xl xl:text-6xl 2xl:text-[80px] leading-tight font-bold tracking-tight drop-shadow-[0px_4px_4px_rgba(0,0,0,0.15)] text-white/95"
            style={{
              fontFamily: "'IBM Plex Sans', sans-serif"
            }}
          >
            We don&apos;t make platters, we serve our purpose
          </h2>
        </div>
      </div>
    </section>
  );
}

