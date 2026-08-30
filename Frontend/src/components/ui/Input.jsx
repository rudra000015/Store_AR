import React from "react";

export default function Input({
  label,
  id,
  type = "text",
  className = "",
  error,
  ...props
}) {
  return (
    <div className="w-full text-left font-sans">
      {label && (
        <label
          htmlFor={id}
          className="block text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#716B63] dark:text-[#9A948B] mb-1.5"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`h-10 w-full rounded-lg border border-[#E5DCCB] dark:border-[#333333] bg-[#FFFDF8] dark:bg-[#0D0D0D] px-3 text-[11px] text-[#171513] dark:text-[#FBF9F4] placeholder-[#9A948B] dark:placeholder-[#716B63] outline-none transition duration-200 focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A] ${
          error ? "border-[#A65D52]/50 focus:border-[#A65D52]" : ""
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-[9px] font-sans font-bold uppercase tracking-wider text-[#A65D52]">
          {error}
        </p>
      )}
    </div>
  );
}
