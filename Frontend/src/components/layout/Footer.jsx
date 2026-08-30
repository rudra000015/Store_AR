import { Link } from "react-router";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#F7F3EB] dark:bg-[#0D0D0D] text-[#171513] dark:text-[#FBF9F4] border-t border-[#E5DCCB] dark:border-[#333333] pt-16 pb-12 px-6 sm:px-12 text-left relative z-30 font-sans transition-colors duration-300">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-[#E5DCCB] dark:border-[#333333]">
        
        {/* Brand Column */}
        <div className="lg:col-span-5 space-y-4">
          <span className="font-brand text-lg font-bold tracking-[0.25em] text-[#C8A96A] block">
            THE A&R STORE
          </span>
          <p className="text-[11px] text-[#716B63] dark:text-[#9A948B] max-w-xs leading-relaxed font-light tracking-wider">
            An exclusive fashion studio and e-commerce experience showcasing tailored boutique drops, curated signature editions, and limited custom-made items.
          </p>
        </div>

        {/* Links Column */}
        <div className="lg:col-span-3 space-y-4">
          <h4 className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-[#886D3B] dark:text-[#C8A96A]">
            Studio Links
          </h4>
          <ul className="space-y-2 text-[10px] uppercase tracking-wider font-semibold text-[#716B63] dark:text-[#9A948B]">
            <li>
              <Link to="/buyer" className="hover:text-[#C8A96A] transition">Collection</Link>
            </li>
            <li>
              <Link to="/buyer/cart" className="hover:text-[#C8A96A] transition">Your Vault</Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-[#C8A96A] transition">Customer Care</Link>
            </li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div className="lg:col-span-4 space-y-4">
          <h4 className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-[#886D3B] dark:text-[#C8A96A]">
            Boutique Updates
          </h4>
          <p className="text-[11px] text-[#716B63] dark:text-[#9A948B] font-light leading-relaxed">
            Subscribe to receive private notification logs for upcoming exclusive drops.
          </p>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              alert("Subscribed! You will be notified of our next signature drop.");
              e.target.reset();
            }}
            className="flex w-full"
          >
            <input
              type="email"
              required
              placeholder="email@example.com"
              className="flex-1 h-9 bg-white dark:bg-[#1A1A1A] border border-[#E5DCCB] dark:border-[#333333] px-4 text-[11px] text-[#171513] dark:text-[#FBF9F4] placeholder-[#9A948B] focus:border-[#C8A96A] outline-none transition rounded-l-full"
            />
            <button
              type="submit"
              className="h-9 px-6 bg-[#C8A96A] text-[#0D0D0D] text-[9px] font-sans font-bold uppercase tracking-widest hover:bg-[#D8B77A] transition cursor-pointer rounded-r-full"
            >
              Join
            </button>
          </form>
        </div>

      </div>

      <div className="mx-auto max-w-7xl pt-8 flex flex-col sm:flex-row items-center justify-between text-[9px] font-sans font-bold uppercase tracking-wider text-[#9A948B] dark:text-[#716B63] gap-4">
        <span>
          © {currentYear} THE A&R STORE. ALL RIGHTS PRESERVED.
        </span>
        <div className="flex gap-6">
          <span>🔒 SECURE 256-BIT SSL</span>
          <span>🚚 INSURED DELIVERY</span>
        </div>
      </div>
    </footer>
  );
}
