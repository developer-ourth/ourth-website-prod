import Link from "next/link";
import Image from "next/image";
import fs from "fs";
import path from "path";

export default function Footer() {
  // Read config dynamically at request time
  let config = {
    contactEmail: "support@healingourth.com",
    footerTagline: "for a plastic-free future."
  };
  try {
    const configPath = path.join(process.cwd(), "src/data/website-config.json");
    config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch (e) {
    console.error("Failed to read dynamic website config in Footer", e);
  }

  return (
    <footer className="relative overflow-hidden bg-[#B8DEC4] text-[#2C1F13]">
      {/* Decorative background shapes for elegance */}
      <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#A2CCA1] opacity-45 blur-3xl" />
      <div className="absolute -left-24 -bottom-24 h-96 w-96 rounded-full bg-[#A2CCA1] opacity-45 blur-3xl" />

      <div className="relative mx-auto max-w-[1580px] px-8 py-16 md:py-24">
        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand Identity Column */}
          <div className="space-y-6 lg:col-span-5">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white p-2 shadow-sm">
                <Image 
                  src="/logo.png" 
                  alt="Healing Ourth Logo" 
                  width={40} 
                  height={40} 
                  className="object-contain" 
                />
              </div>
              <span
                style={{
                  fontSize: "32px",
                  fontFamily: "var(--font-ibm-plex-sans), 'IBM Plex Sans', sans-serif",
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                }}
                className="text-[#0D3A27]"
              >
                Healing Ourth
              </span>
            </Link>
            
            <p className="max-w-md text-base leading-relaxed text-[#2C1F13]/90">
              Crafting beautiful, 100% natural leaf tableware to replace single-use plastics. 
              Together, let's cultivate a sustainable, plastic-free future for our planet.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-2">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0D3A27] text-white hover:bg-[#25784C] transition-all duration-300"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0D3A27] text-white hover:bg-[#25784C] transition-all duration-300"
                aria-label="Facebook"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0D3A27] text-white hover:bg-[#25784C] transition-all duration-300"
                aria-label="LinkedIn"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-6 lg:col-span-2 lg:col-start-7">
            <h3 className="text-sm font-bold tracking-wider text-[#0D3A27] uppercase">Explore</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-base text-[#2C1F13]/85 hover:text-[#0D3A27] font-medium transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-base text-[#2C1F13]/85 hover:text-[#0D3A27] font-medium transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-base text-[#2C1F13]/85 hover:text-[#0D3A27] font-medium transition-colors duration-200">
                  Our Products
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-base text-[#2C1F13]/85 hover:text-[#0D3A27] font-medium transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="space-y-6 lg:col-span-2">
            <h3 className="text-sm font-bold tracking-wider text-[#0D3A27] uppercase">Legal</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/privacy-policy" className="text-base text-[#2C1F13]/85 hover:text-[#0D3A27] font-medium transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-base text-[#2C1F13]/85 hover:text-[#0D3A27] font-medium transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-base text-[#2C1F13]/85 hover:text-[#0D3A27] font-medium transition-colors duration-200">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Info Column */}
          <div className="space-y-6 lg:col-span-3">
            <h3 className="text-sm font-bold tracking-wider text-[#0D3A27] uppercase">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <svg className="mt-1 h-5 w-5 shrink-0 text-[#0D3A27]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <a href={`mailto:${config.contactEmail}`} className="text-base text-[#2C1F13]/85 hover:text-[#0D3A27] font-medium transition-colors duration-200 break-all">
                  {config.contactEmail}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <svg className="mt-1 h-5 w-5 shrink-0 text-[#0D3A27]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span className="text-base text-[#2C1F13]/85">
                  India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 border-t border-[#0D3A27]/20" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-sm text-[#2C1F13]/70 text-center sm:text-left">
            © {new Date().getFullYear()} Healing Ourth. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-sm text-[#2C1F13]/70">
            <span>Crafted with</span>
            <span className="text-[#0D3A27] animate-pulse">💚</span>
            <span>{config.footerTagline}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
