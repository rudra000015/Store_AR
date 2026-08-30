import React from "react";

export default function Card({ children, className = "", hover = false, ...props }) {
  return (
    <div
      className={`bg-[#FFFDF8] dark:bg-[#1A1A1A] border border-[#E5DCCB] dark:border-[#333333] p-6 rounded-[18px] transition-all duration-300 shadow-[0_10px_30px_rgba(20,17,12,0.04)] dark:shadow-none ${
        hover ? "hover:shadow-[0_10px_30px_rgba(20,17,12,0.08)] hover:-translate-y-0.5" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
