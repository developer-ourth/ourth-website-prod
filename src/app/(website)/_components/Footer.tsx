export default function Footer() {
  return (
    <footer style={{ background: "#B8DEC4" }} className="py-10">
      <div className="mx-auto max-w-6xl px-6">
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
          <div className="flex gap-6 text-xs text-[#2C1F13]">
            <a href="/about" className="hover:text-[#0D3A27] transition-colors">About</a>
            <a href="/products" className="hover:text-[#0D3A27] transition-colors">Products</a>
            <a href="/contact" className="hover:text-[#0D3A27] transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
