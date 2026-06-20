// ─────────────────────────────────────────────
// KARD — Link Button Component
// Platform link rows on the public card
// Tracks clicks anonymously (no personal data)
// ─────────────────────────────────────────────

"use client";

import { cn } from "@/lib/utils";

interface LinkButtonProps {
  link: {
    id: string;
    type: string;
    label: string;
    url: string;
    verified: boolean;
  };
  isDark?: boolean;
  kardId: string;
}

const platformConfig: Record<string, { bg: string; short: string }> = {
  LINKEDIN:  { bg: "#0077B5", short: "in" },
  GITHUB:    { bg: "#161b22", short: "gh" },
  TWITTER:   { bg: "#000000", short: "𝕏"  },
  INSTAGRAM: { bg: "#E1306C", short: "ig" },
  CUSTOM:    { bg: "#555555", short: "↗"  },
};

async function trackClick(linkId: string) {
  // Fire and forget — no personal data collected
  try {
    await fetch("/api/trpc/kard.trackClick", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ json: { linkId } }),
    });
  } catch {
    // Silent fail — analytics are best-effort
  }
}

export function LinkButton({ link, isDark = true, kardId }: LinkButtonProps) {
  const config = platformConfig[link.type.toUpperCase()] ?? platformConfig.CUSTOM!;

  const handleClick = () => {
    void trackClick(link.id);
    window.open(link.url, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-150 group",
        isDark
          ? "bg-[#161616] border-[#222] hover:bg-[#1e1e1e] hover:border-[#2a2a2a]"
          : "bg-[#F0EAE0] border-[#E8E0D4] hover:bg-[#EAE2D8] hover:border-[#DDD5CB]"
      )}
      aria-label={`Open ${link.label}`}
    >
      {/* Platform icon */}
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
        style={{ backgroundColor: config.bg }}
      >
        {config.short}
      </div>

      {/* Label */}
      <span
        className={cn(
          "flex-1 text-left text-[12px] font-medium",
          isDark ? "text-[#999]" : "text-[#888]"
        )}
      >
        {link.label}
      </span>

      {/* Arrow */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        className={cn(
          "flex-shrink-0 transition-transform duration-150 group-hover:translate-x-0.5",
          isDark ? "text-[#333]" : "text-[#ccc]"
        )}
        aria-hidden="true"
      >
        <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
