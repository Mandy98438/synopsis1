// ─────────────────────────────────────────────
// KARD — Verified Badge Component
// Shows verification level with tooltip
// ─────────────────────────────────────────────

"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface VerifiedBadgeProps {
  level: number;
  isDark?: boolean;
  showLabel?: boolean;
  className?: string;
}

const levelConfig = {
  1: {
    label: "Verified",
    detail: "Identity confirmed via OAuth",
    color: { dark: "bg-[#0f2a0f] border-[#1a3a1a] text-[#4CAF50]", light: "bg-[#e4f0dc] border-[#b0d0a0] text-[#3a7a28]" },
  },
  2: {
    label: "Verified",
    detail: "Multi-platform identity confirmed",
    color: { dark: "bg-[#0f2a0f] border-[#1a3a1a] text-[#4CAF50]", light: "bg-[#e4f0dc] border-[#b0d0a0] text-[#3a7a28]" },
  },
  3: {
    label: "LinkedIn Verified",
    detail: "LinkedIn + multi-platform confirmed",
    color: { dark: "bg-[#0f2a0f] border-[#1a4a1a] text-[#5CBF60]", light: "bg-[#d8eccc] border-[#90c080] text-[#2a6a18]" },
  },
};

export function VerifiedBadge({
  level,
  isDark = true,
  showLabel = true,
  className,
}: VerifiedBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const config = levelConfig[level as keyof typeof levelConfig];
  if (!config) return null;

  const theme = isDark ? config.color.dark : config.color.light;

  return (
    <div
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-medium cursor-default select-none",
          theme
        )}
      >
        {/* Check icon */}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <circle cx="5" cy="5" r="4.5" fill="currentColor" fillOpacity="0.2" />
          <path d="M3 5l1.5 1.5L7 3.5" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {showLabel && <span>{config.label}</span>}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className={cn(
            "absolute bottom-full left-0 mb-2 px-2.5 py-1.5 rounded-lg text-[10px] whitespace-nowrap z-10 pointer-events-none",
            isDark
              ? "bg-[#222] text-[#aaa] border border-[#333]"
              : "bg-white text-[#666] border border-[#ddd] shadow-sm"
          )}
        >
          {config.detail}
          {/* Arrow */}
          <div
            className={cn(
              "absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent",
              isDark ? "border-t-[#333]" : "border-t-[#ddd]"
            )}
          />
        </div>
      )}
    </div>
  );
}
