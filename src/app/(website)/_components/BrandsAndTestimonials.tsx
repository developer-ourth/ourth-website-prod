"use client";
 

 
const TESTIMONIALS = [
  {
    quote: "We replaced single-use plastic bowls with Ourth tableware for our bulk delivery orders. Our clients were absolutely thrilled with the eco-friendly touch!",
    author: "Ramesh Mehta",
    role: "Green Catering Co."
  },
  {
    quote: "The palm leaf platters are sturdy enough for hot biryani and gravies. They don't leak or sag at all. Truly the best alternative to plastic.",
    author: "Suresh Nair",
    role: "Dhaba Owner"
  },
  {
    quote: "Timely delivery and bulk discounts made it incredibly easy for our street food venture to go green. Highly recommended for small food businesses!",
    author: "Ananya Rao",
    role: "Organic Bites"
  },
  {
    quote: "Elegant look combined with solid durability. These leaf-made plates have elevated our wedding buffet presentation while keeping it sustainable.",
    author: "Priya Sharma",
    role: "Eco Weddings"
  }
];
 
export default function BrandsAndTestimonials() {
  return (
    <section className="bg-transparent py-16 overflow-hidden">
      
      {/* Products Available On Section */}
      <div className="mx-auto max-w-[1625px] px-4 lg:px-[52px] mb-12">
        <h2 
          className="text-4xl lg:text-[56px] lg:leading-[62px] font-semibold text-[#2B4D0E] text-left mb-8 tracking-tight"
          style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
        >
          Products available on:
        </h2>
      </div>
 
      {/* Brand Logos Display Grid */}
      <div className="mx-auto max-w-[1625px] px-6 lg:px-[52px] mb-20">
        <div className="flex flex-col gap-12 lg:gap-20 items-center justify-center w-full mt-6 select-none">
          {/* Row 1: Blinkit, Zomato, Swiggy */}
          <div className="flex flex-wrap gap-16 sm:gap-20 lg:gap-36 justify-center items-center w-full">
            {/* Blinkit */}
            <div className="flex items-center text-5xl sm:text-[60px] font-black tracking-tight" style={{ fontFamily: "system-ui, sans-serif" }}>
              <span className="text-[#ECDB1D]">blink</span>
              <span className="text-[#0D5B28]">it</span>
            </div>

            {/* Zomato */}
            <div className="bg-[#CB202D] text-white font-extrabold px-8 py-3 text-4xl sm:text-[46px] tracking-tighter lowercase rounded-[5px] leading-none" style={{ fontFamily: "system-ui, sans-serif" }}>
              zomato
            </div>

            {/* Swiggy */}
            <div className="flex items-center">
              <svg className="w-10 h-10 sm:w-14 sm:h-14 text-[#FC8019] fill-current" viewBox="0 0 24 24">
                <path d="M12 2c-4.136 0-7.5 3.364-7.5 7.5 0 5.378 6.786 11.966 7.076 12.24l.424.402.424-.402c.29-.274 7.076-6.862 7.076-12.24 0-4.136-3.364-7.5-7.5-7.5zm.04 12.355c-1.848 0-3.348-1.501-3.348-3.349 0-1.848 1.5-3.348 3.348-3.348 1.849 0 3.349 1.5 3.349 3.348 0 1.848-1.5 3.349-3.349 3.349z"/>
              </svg>
              <span className="text-[#FC8019] font-black text-3xl sm:text-[38px] tracking-widest ml-3" style={{ fontFamily: "system-ui, sans-serif" }}>
                SWIGGY
              </span>
            </div>
          </div>

          {/* Row 2: Amazon, Zepto */}
          <div className="flex flex-wrap gap-16 sm:gap-20 lg:gap-36 justify-center items-center w-full">
            {/* Amazon */}
            <div className="flex flex-col items-center select-none">
              <span className="text-[#000000] font-bold text-4xl sm:text-[46px] tracking-tight lowercase leading-none" style={{ fontFamily: "system-ui, sans-serif" }}>
                amazon
              </span>
              <svg className="w-32 h-5 sm:w-[130px] sm:h-6 text-[#FF9900]" viewBox="0 0 100 15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M10 5 C 30 14, 70 14, 90 5" />
                <path d="M85 8 L 92 5 L 89 12" fill="currentColor" />
              </svg>
            </div>

            {/* Zepto */}
            <span className="text-[#7B2CBF] font-black italic text-5xl sm:text-[60px] tracking-tight lowercase" style={{ fontFamily: "system-ui, sans-serif" }}>
              zepto
            </span>
          </div>
        </div>
      </div>
 
      {/* Testimonials Quote Cards */}
      <div className="mx-auto max-w-[1625px] px-6 lg:px-[52px]">
        
        {/* Desktop Layout: Aligned row */}
        <div className="hidden lg:flex gap-6 lg:gap-[46px] justify-between items-center mt-12 select-none">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="w-[350px] h-[490px] bg-[#C7E08E] border-[1.5px] border-black rounded-[5px] shadow-[4px_4px_0px_#000000] p-8 flex flex-col justify-center items-center text-center hover:translate-y-[-2px] transition-all"
            >
              <h3 className="text-[20px] font-bold text-black mb-6" style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}>
                {t.author}
              </h3>
              <p className="text-[18px] font-medium text-black leading-relaxed" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                "{t.quote}"
              </p>
            </div>
          ))}
        </div>

        {/* Mobile/Tablet Layout: Horizontal Scroll Carousel */}
        <div className="lg:hidden flex overflow-x-auto gap-6 snap-x snap-mandatory pb-8 pt-4 w-full scrollbar-none mt-8 px-2">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="w-[85vw] max-w-[320px] h-[380px] bg-[#C7E08E] border-[1.5px] border-black rounded-[5px] shadow-[4px_4px_0px_#000000] p-6 flex flex-col justify-center items-center text-center flex-shrink-0 snap-center"
            >
              <h3 className="text-[18px] font-bold text-black mb-4" style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}>
                {t.author}
              </h3>
              <p className="text-[16px] font-medium text-black leading-relaxed" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                "{t.quote}"
              </p>
            </div>
          ))}
        </div>

        {/* Local styles injection to hide scrollbars on carousel */}
        <style jsx>{`
          .scrollbar-none::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-none {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>

      </div>
    </section>
  );
}
