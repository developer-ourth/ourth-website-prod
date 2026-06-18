import Navbar from "@/app/(website)/_components/Navbar";
import Footer from "@/app/(website)/_components/Footer";

export const metadata = {
  title: "Contact Us | OURTH Tableware",
  description: "Get in touch with OURTH Tableware. We would love to hear from you. Partner with us or enquire about custom orders.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#F5F8F3]">
      <Navbar />

      <section className="relative pt-36 pb-20 overflow-hidden">
        {/* Left Curved Shape Backdrop */}
        <div className="absolute top-0 left-0 h-full w-full lg:w-[45%] bg-[#E2EFE0] rounded-br-[120px] lg:rounded-br-[200px] z-0" />

        <div className="relative z-10 mx-auto max-w-[1280px] px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-8 mt-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#0D3A27]">
              Get in Touch
            </p>
            <h1
              className="text-[#0D3A27] font-extrabold text-5xl sm:text-6xl leading-[1.1] tracking-tight"
              style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
            >
              Let&apos;s start a <br />
              <span className="italic font-serif font-light text-emerald-800">conversation</span>
            </h1>
            <p className="text-[#2C1F13]/85 text-base leading-relaxed max-w-md">
              Whether you are a vendor looking to switch to compostable tableware, a distributor interested in partnership, or just curious about our process, we are here to help.
            </p>

            <div className="space-y-6 pt-6 border-t border-[#0D3A27]/10 max-w-md">
              <div className="flex items-start gap-4">
                <span className="text-2xl mt-1">📍</span>
                <div>
                  <h4 className="font-bold text-[#0D3A27]">Our Office</h4>
                  <p className="text-[#2C1F13]/70 text-sm mt-1">
                    OURTH Tableware Headquarters,<br />
                    123 Green Valley Road,<br />
                    Sector 4, New Delhi - 110001
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-2xl mt-1">✉️</span>
                <div>
                  <h4 className="font-bold text-[#0D3A27]">Email Us</h4>
                  <p className="text-[#2C1F13]/70 text-sm mt-1">
                    enquiry@ourth.in<br />
                    partners@ourth.in
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-2xl mt-1">📞</span>
                <div>
                  <h4 className="font-bold text-[#0D3A27]">Call Us</h4>
                  <p className="text-[#2C1F13]/70 text-sm mt-1">
                    +91 11 4059 3892<br />
                    +91 98123 45678
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7 flex justify-center">
            <div
              className="w-full max-w-[620px] rounded-[40px] border border-white/40 p-8 sm:p-12 shadow-[0_24px_70px_rgba(44,74,26,0.08)]"
              style={{
                background: "rgba(255, 255, 255, 0.55)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            >
              <h2 className="text-2xl font-extrabold text-[#2C1F13] mb-8">Send us a message</h2>
              
              <form className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0D3A27] mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    className="w-full bg-[#FAF7F2] border border-[#DCE9D4] rounded-2xl px-5 py-4 text-sm text-[#2C1F13] placeholder-[#2C1F13]/40 focus:outline-none focus:border-[#0D3A27] focus:ring-1 focus:ring-[#0D3A27] transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0D3A27] mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      className="w-full bg-[#FAF7F2] border border-[#DCE9D4] rounded-2xl px-5 py-4 text-sm text-[#2C1F13] placeholder-[#2C1F13]/40 focus:outline-none focus:border-[#0D3A27] focus:ring-1 focus:ring-[#0D3A27] transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0D3A27] mb-2">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full bg-[#FAF7F2] border border-[#DCE9D4] rounded-2xl px-5 py-4 text-sm text-[#2C1F13] placeholder-[#2C1F13]/40 focus:outline-none focus:border-[#0D3A27] focus:ring-1 focus:ring-[#0D3A27] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0D3A27] mb-2">I am a...</label>
                  <select
                    className="w-full bg-[#FAF7F2] border border-[#DCE9D4] rounded-2xl px-5 py-4 text-sm text-[#2C1F13] focus:outline-none focus:border-[#0D3A27] focus:ring-1 focus:ring-[#0D3A27] transition appearance-none"
                  >
                    <option value="vendor">Vendor / Seller</option>
                    <option value="distributor">Distributor / Retailer</option>
                    <option value="consumer">Individual Customer</option>
                    <option value="other">Other Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0D3A27] mb-2">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us how we can help you..."
                    className="w-full bg-[#FAF7F2] border border-[#DCE9D4] rounded-2xl px-5 py-4 text-sm text-[#2C1F13] placeholder-[#2C1F13]/40 focus:outline-none focus:border-[#0D3A27] focus:ring-1 focus:ring-[#0D3A27] transition resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-[#0D3A27] hover:bg-[#0D3A27]/90 text-white font-bold py-4.5 px-6 shadow-sm transition"
                >
                  Send Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
