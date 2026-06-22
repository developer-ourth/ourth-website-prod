"use client";
 
export default function BuiltForVendors() {
  return (
    <section className="bg-transparent py-16">
      <div className="mx-auto max-w-[1625px] px-4 lg:px-[52px]">
        
        {/* Desktop Custom Grid (2 columns: left and right) */}
        <div className="hidden lg:flex gap-[40px] items-stretch justify-center select-none mt-12 w-full">
          {/* Left Column */}
          <div className="w-full lg:w-[42%] max-w-[620px] flex flex-col gap-[40px] justify-between">
            {/* Card 1: Intro */}
            <div className="w-full h-[340px] bg-[#F5D679] border-[1.5px] border-black rounded-[5px] shadow-[4px_4px_0px_#000000] p-8 flex flex-col justify-center hover:translate-y-[-2px] transition-all">
              <h2 className="text-[36px] lg:text-[56px] font-black lg:leading-[58px] leading-[42px]" style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}>
                <span className="text-[#5E3A16]">Built for vendors</span> <br />
                <span className="text-[#2B4D0E] italic">who care</span>
              </h2>
            </div>
            
            {/* Pills container */}
            <div className="w-full h-[200px] flex flex-col justify-center gap-4">
              <div className="flex gap-[18px]">
                <span className="h-[42px] px-5 inline-flex items-center justify-center rounded-full border-[1.5px] border-black bg-[#DCEEFB] text-[16px] font-bold text-[#103F5E]" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                  Zero Plastic
                </span>
                <span className="h-[42px] px-5 inline-flex items-center justify-center rounded-full border-[1.5px] border-black bg-[#DCEEFB] text-[16px] font-bold text-[#103F5E]" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                  Premium
                </span>
              </div>
              <div className="flex">
                <span className="h-[42px] px-5 inline-flex items-center justify-center rounded-full border-[1.5px] border-black bg-[#DCEEFB] text-[16px] font-bold text-[#103F5E]" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                  Bulk Supply
                </span>
              </div>
            </div>
          </div>

          {/* Right Column Group */}
          <div className="w-full lg:w-[58%] max-w-[860px] flex flex-col gap-[40px] justify-between">
            {/* Top row of right group: Card 2 and Card 3 */}
            <div className="flex flex-col sm:flex-row gap-[40px] w-full">
              {/* Card 2 */}
              <div className="w-full sm:w-1/2 h-[340px] bg-[#F5D679] border-[1.5px] border-black rounded-[5px] shadow-[4px_4px_0px_#000000] p-8 flex flex-col justify-start hover:translate-y-[-2px] transition-all">
                <h3 className="text-[30px] lg:text-[40px] font-bold text-[#5E3A16] mb-4 lg:leading-[46px] leading-[36px]" style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}>
                  Completely <br /> Plastic-Free
                </h3>
                <p className="text-[22px] lg:text-[32px] font-medium text-[#2B4D0E] lg:leading-[38px] leading-[28px]" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                  From raw leaf to finished tableware-no plastic enters our process.
                </p>
              </div>

              {/* Card 3 */}
              <div className="w-full sm:w-1/2 h-[340px] bg-[#F5D679] border-[1.5px] border-black rounded-[5px] shadow-[4px_4px_0px_#000000] p-8 flex flex-col justify-start hover:translate-y-[-2px] transition-all">
                <h3 className="text-[30px] lg:text-[40px] font-bold text-[#5E3A16] mb-4 lg:leading-[46px] leading-[36px]" style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}>
                  Vendor-First <br /> Logistics
                </h3>
                <p className="text-[22px] lg:text-[32px] font-medium text-[#2B4D0E] lg:leading-[38px] leading-[28px]" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                  Order in bulk, timely delivery anywhere in India.
                </p>
              </div>
            </div>

            {/* Bottom row of right group: Card 4 */}
            <div className="w-full h-[200px] bg-[#F5D679] border-[1.5px] border-black rounded-[5px] shadow-[4px_4px_0px_#000000] p-8 flex flex-col justify-center hover:translate-y-[-2px] transition-all">
              <h3 className="text-[30px] lg:text-[40px] font-bold text-[#5E3A16] mb-2 lg:leading-[46px] leading-[36px]" style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}>
                Food-Safe, Heat-Resistant
              </h3>
              <p className="text-[22px] lg:text-[32px] font-medium text-[#2B4D0E] lg:leading-[38px] leading-[28px]" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                Holds hot curries, biryanis and gravies. Trusted at weddings, dhabas and events.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Layout (vertical stack) */}
        <div className="lg:hidden flex flex-col gap-6 mt-8">
          {/* Card 1 */}
          <div className="w-full bg-[#F5D679] border-[1.5px] border-black rounded-[5px] shadow-[4px_4px_0px_#000000] p-6 flex flex-col justify-center min-h-[140px]">
            <h2 className="text-[30px] lg:text-[56px] font-black lg:leading-[58px] leading-[36px]" style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}>
              <span className="text-[#5E3A16]">Built for vendors</span> <br />
              <span className="text-[#2B4D0E] italic">who care</span>
            </h2>
          </div>

          {/* Pills */}
          <div className="w-full flex flex-wrap gap-3 py-2 justify-center">
            <span className="h-[42px] px-5 inline-flex items-center justify-center rounded-full border-[1.5px] border-black bg-[#DCEEFB] text-[16px] font-bold text-[#103F5E]" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
              Zero Plastic
            </span>
            <span className="h-[42px] px-5 inline-flex items-center justify-center rounded-full border-[1.5px] border-black bg-[#DCEEFB] text-[16px] font-bold text-[#103F5E]" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
              Premium
            </span>
            <span className="h-[42px] px-5 inline-flex items-center justify-center rounded-full border-[1.5px] border-black bg-[#DCEEFB] text-[16px] font-bold text-[#103F5E]" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
              Bulk Supply
            </span>
          </div>

          {/* Card 2 */}
          <div className="w-full bg-[#F5D679] border-[1.5px] border-black rounded-[5px] shadow-[4px_4px_0px_#000000] p-6 flex flex-col justify-start">
            <h3 className="text-[26px] lg:text-[40px] font-bold text-[#5E3A16] mb-2 leading-tight" style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}>
              Completely Plastic-Free
            </h3>
            <p className="text-[18px] lg:text-[32px] font-medium text-[#2B4D0E] leading-relaxed" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
              From raw leaf to finished tableware-no plastic enters our process.
            </p>
          </div>

          {/* Card 3 */}
          <div className="w-full bg-[#F5D679] border-[1.5px] border-black rounded-[5px] shadow-[4px_4px_0px_#000000] p-6 flex flex-col justify-start">
            <h3 className="text-[26px] lg:text-[40px] font-bold text-[#5E3A16] mb-2 leading-tight" style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}>
              Vendor-First Logistics
            </h3>
            <p className="text-[18px] lg:text-[32px] font-medium text-[#2B4D0E] leading-relaxed" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
              Order in bulk, timely delivery anywhere in India.
            </p>
          </div>

          {/* Card 4 */}
          <div className="w-full bg-[#F5D679] border-[1.5px] border-black rounded-[5px] shadow-[4px_4px_0px_#000000] p-6 flex flex-col justify-start">
            <h3 className="text-[26px] lg:text-[40px] font-bold text-[#5E3A16] mb-2 leading-tight" style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}>
              Food-Safe, Heat-Resistant
            </h3>
            <p className="text-[18px] lg:text-[32px] font-medium text-[#2B4D0E] leading-relaxed" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
              Holds hot curries, biryanis and gravies. Trusted at weddings, dhabas and events.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
