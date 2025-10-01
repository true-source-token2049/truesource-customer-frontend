// components/Spinner.tsx
import React from "react";

export function Spinner({
  size = 4,
  label = "Loading...",
}: {
  size?: number;
  label?: string;
}) {
  // size is in Tailwind width/height units (e.g. 4 => w-4 h-4)
  const s = `w-${size} h-${size}`;
  return (
    <span role="status" aria-live="polite" className="inline-flex items-center">
      <svg
        className={`${s} animate-spin`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          className="opacity-20"
        />
        <path
          d="M22 12a10 10 0 00-10-10"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}
