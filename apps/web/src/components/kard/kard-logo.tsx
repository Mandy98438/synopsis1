// ─────────────────────────────────────────────
// KARD — Logo Component
// The layered triangle mark + wordmark
// ─────────────────────────────────────────────

import { cn } from "@/lib/utils";

interface KardLogoProps {
  size?: "sm" | "md" | "lg";
  isDark?: boolean;
  muted?: boolean;
  showWordmark?: boolean;
  className?: string;
}

const sizes = {
  sm: { mark: 14, text: "text-[11px]", gap: "gap-[6px]" },
  md: { mark: 22, text: "text-[14px]", gap: "gap-[8px]" },
  lg: { mark: 36, text: "text-[22px]", gap: "gap-[12px]" },
};

export function KardLogo({
  size = "md",
  isDark = true,
  muted = false,
  showWordmark = true,
  className,
}: KardLogoProps) {
  const { mark, text, gap } = sizes[size];
  const markColor = isDark
    ? muted ? "rgba(255,255,255,0.35)" : "#ffffff"
    : muted ? "rgba(0,0,0,0.25)" : "#111111";
  const bgColor = isDark
    ? muted ? "rgba(0,0,0,0)" : "#141414"
    : muted ? "rgba(255,255,255,0)" : "#FAF6EF";
  const textColor = isDark
    ? muted ? "text-white/35" : "text-white"
    : muted ? "text-black/25" : "text-[#111]";

  return (
    <div className={cn("flex items-center", gap, className)}>
      {/* Triangle mark */}
      <svg
        width={mark}
        height={mark}
        viewBox="0 0 36 36"
        fill="none"
        aria-hidden="true"
      >
        <clipPath id={`kard-clip-${size}`}>
          <polygon points="18,1 35,35 1,35" />
        </clipPath>
        <polygon points="18,1 35,35 1,35" fill={markColor} />
        <rect x="1" y="11" width="34" height="3.5" fill={bgColor} clipPath={`url(#kard-clip-${size})`} />
        <rect x="1" y="18" width="34" height="3.5" fill={bgColor} clipPath={`url(#kard-clip-${size})`} />
        <rect x="1" y="25" width="34" height="3.5" fill={bgColor} clipPath={`url(#kard-clip-${size})`} />
      </svg>

      {/* Wordmark */}
      {showWordmark && (
        <span
          className={cn(
            "font-medium tracking-[0.08em] leading-none select-none",
            text,
            textColor
          )}
        >
          kard
        </span>
      )}
    </div>
  );
}
