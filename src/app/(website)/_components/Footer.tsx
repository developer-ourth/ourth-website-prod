export default function Footer() {
  return (
    <footer style={{ background: "#B8DEC4" }} className="py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="space-y-6">
          {/* Top Row */}
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#25784C]">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-white" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
                  <path d="M8 14s1.5-2 4-2 4 2 4 2" strokeLinecap="round" />
                  <path d="M12 8v4" strokeLinecap="round" />
                </svg>
              </span>
              <span className="text-sm font-semibold text-[#0D3A27]">Healing Ourth</span>
            </div>
            <p className="text-xs text-center text-[#2C1F13]">
              © {new Date().getFullYear()} Healing Ourth. All rights reserved.
            </p>
          </div>

          {/* Links Section */}
          <div className="flex flex-col gap-6 md:flex-row md:justify-center">
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold uppercase text-[#0D3A27]">Company</h3>
              <div className="flex flex-col gap-2 text-xs text-[#2C1F13]">
                <a href="/about" className="hover:text-[#0D3A27] transition-colors">About</a>
                <a href="/products" className="hover:text-[#0D3A27] transition-colors">Products</a>
                <a href="/contact" className="hover:text-[#0D3A27] transition-colors">Contact</a>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold uppercase text-[#0D3A27]">Legal</h3>
              <div className="flex flex-col gap-2 text-xs text-[#2C1F13]">
                <a href="/terms" className="hover:text-[#0D3A27] transition-colors">Terms of Service</a>
                <a href="/privacy-policy" className="hover:text-[#0D3A27] transition-colors">Privacy Policy</a>
                <a href="/refund" className="hover:text-[#0D3A27] transition-colors">Refund Policy</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
