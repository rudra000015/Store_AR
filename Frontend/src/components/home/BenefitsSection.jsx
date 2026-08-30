export default function BenefitsSection() {
  const benefits = [
    {
      icon: (
        <svg className="w-6 h-6 text-[#C8A96A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4v16m8-8H4" />
        </svg>
      ),
      title: "Bespoke Tailoring",
      desc: "Every garment in our drop features options for tailored custom sizing to ensure premium silhouette fit."
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#C8A96A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      title: "Insured Vault Delivery",
      desc: "All packages are dispatched via trackable, insured luxury couriers to preserve drop contents intact."
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#C8A96A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Encrypted Checkout",
      desc: "Secure 256-bit SSL encryption safeguards checkout credentials, payments, and private account data."
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#C8A96A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      title: "Drop Membership",
      desc: "Members unlock early-access windows, private boutique drops, and complimentary vault shipping services."
    }
  ];

  return (
    <section className="bg-[#FBF9F4] dark:bg-[#0D0D0D] text-[#171513] dark:text-[#FBF9F4] py-16 sm:py-24 px-6 sm:px-12 border-t border-[#E5DCCB] dark:border-[#333333] transition-colors duration-300 font-sans">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((b, idx) => (
            <div 
              key={idx} 
              className="space-y-4 text-left p-6 border border-[#E5DCCB] dark:border-[#333333] bg-[#FFFDF8] dark:bg-[#1A1A1A] rounded-[18px] shadow-[0_10px_30px_rgba(20,17,12,0.04)] dark:shadow-none"
            >
              {/* Icon Container: Warm Cream/Gold tint background */}
              <div className="p-3 bg-[#F7F3EB] dark:bg-[#0D0D0D] border border-[#E5DCCB]/40 dark:border-[#333333]/40 w-fit rounded-xl">
                {b.icon}
              </div>
              <h3 className="font-brand text-base font-light text-[#171513] dark:text-[#FBF9F4] uppercase tracking-wide">
                {b.title}
              </h3>
              <p className="text-xs text-[#716B63] dark:text-[#9A948B] leading-relaxed font-light font-sans">
                {b.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
