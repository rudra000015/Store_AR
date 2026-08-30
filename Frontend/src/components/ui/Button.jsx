import React from "react";

export default function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`h-11 w-full bg-[#C8A96A] text-[#0D0D0D] hover:bg-[#D8B77A] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(20,17,12,0.06)] text-[10px] font-sans font-semibold uppercase tracking-[0.12em] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed rounded-full ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
