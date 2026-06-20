// ─────────────────────────────────────────────
// KARD — Card Component
// The actual card UI — used in:
//   - Public viewer page
//   - Dashboard live preview (mini variant)
//   - Share screen
// ─────────────────────────────────────────────

import Image from "next/image";
import { cn } from "@/lib/utils";
import { KardLogo } from "./kard-logo";
import { VerifiedBadge } from "./verified-badge";
import { LinkButton } from "./link-button";
import { SaveContactButton } from "./save-contact-button";
import { ReportButton } from "./report-button";

interface KardCardProps {
  kard: {
    id: string;
    username: string;
    shortCode: string;
    theme: string;
    firstName: string;
    lastName: string;
    headline: string;
    bio: string | null;
    avatarUrl: string | null;
    company: string | null;
    email: string | null;
    phone: string | null;
    links: { id: string; type: string; label: string; url: string; verified: boolean }[];
  };
  verification?: { level: number } | null;
  variant?: "full" | "preview";
  className?: string;
}

export function KardCard({
  kard,
  verification,
  variant = "full",
  className,
}: KardCardProps) {
  const isDark = kard.theme === "DARK";
  const isPreview = variant === "preview";

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden",
        isPreview ? "rounded-[14px] w-[148px]" : "rounded-[22px] w-full max-w-sm",
        isDark
          ? "bg-[#141414]"
          : "bg-[#FAF6EF] border border-[#ddd8ce]",
        className
      )}
    >
      {/* Orange accent bar */}
      <div className={cn("w-full flex-shrink-0", isPreview ? "h-[3px]" : "h-1")} style={{ background: "#E07020" }} />

      {/* Photo */}
      <div className="relative w-full" style={{ aspectRatio: "1/1" }}>
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            isDark ? "bg-[#1c1c1c]" : "bg-[#E8E0D4]"
          )}
        >
          {kard.avatarUrl ? (
            <Image
              src={kard.avatarUrl}
              alt={`${kard.firstName} ${kard.lastName}`}
              fill
              className="object-cover"
              priority={!isPreview}
              sizes={isPreview ? "148px" : "384px"}
            />
          ) : (
            <span
              className={cn(
                "font-medium select-none",
                isPreview ? "text-[40px]" : "text-[72px]",
                isDark ? "text-[#252525]" : "text-[#C4B9AA]"
              )}
            >
              {kard.firstName[0]}{kard.lastName[0]}
            </span>
          )}
        </div>

        {/* Logo + org overlay */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 flex justify-between items-end",
            isPreview ? "p-2" : "p-3",
            isDark
              ? "bg-gradient-to-t from-black/65 to-transparent"
              : "bg-gradient-to-t from-[#FAF6EF]/80 to-transparent"
          )}
        >
          <KardLogo size="sm" isDark={isDark} muted showWordmark={!isPreview} />
          {kard.company && !isPreview && (
            <span
              className={cn(
                "text-[10px] font-medium px-2 py-0.5 rounded-full",
                isDark ? "bg-white/8 text-white/35" : "bg-black/6 text-black/30"
              )}
            >
              {kard.company}
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className={cn(isPreview ? "px-3 pt-2.5 pb-2" : "px-5 pt-4 pb-2")}>
        <h1
          className={cn(
            "font-medium leading-tight",
            isPreview ? "text-[13px]" : "text-[20px]",
            isDark ? "text-[#f0f0f0]" : "text-[#111]"
          )}
        >
          {kard.firstName} {kard.lastName}
        </h1>
        <p
          className={cn(
            isPreview ? "text-[9px] mt-0.5 mb-2" : "text-xs mt-0.5 mb-4",
            isDark ? "text-[#444]" : "text-[#aaa]"
          )}
        >
          {kard.headline}
        </p>

        {/* Links */}
        {!isPreview && (
          <div className="flex flex-col gap-2 mb-4">
            {kard.links.map((link) => (
              <LinkButton key={link.id} link={link} isDark={isDark} kardId={kard.id} />
            ))}
          </div>
        )}

        {/* Preview: pill links */}
        {isPreview && (
          <div className="flex gap-1 flex-wrap mb-2">
            {kard.links.slice(0, 3).map((link) => (
              <span
                key={link.id}
                className={cn(
                  "text-[8px] px-1.5 py-0.5 rounded-full border",
                  isDark ? "bg-[#1e1e1e] text-[#555] border-[#2a2a2a]" : "bg-[#EDE7DC] text-[#999] border-[#DDD6CC]"
                )}
              >
                {link.label}
              </span>
            ))}
          </div>
        )}

        {/* Verified badge */}
        {verification && verification.level > 0 && !isPreview && (
          <VerifiedBadge level={verification.level} isDark={isDark} className="mb-4" />
        )}
      </div>

      {/* Divider */}
      <div
        className={cn("mx-5 h-px flex-shrink-0", isDark ? "bg-[#1e1e1e]" : "bg-[#E4DDD4]")}
      />

      {/* Footer */}
      {!isPreview ? (
        <div className="px-5 pb-5 pt-3 flex flex-col gap-3">
          <SaveContactButton kard={kard} isDark={isDark} />
          <div className="flex justify-between items-center">
            <p className={cn("text-[9px]", isDark ? "text-[#2a2a2a]" : "text-[#ccc]")}>
              No data collected about you
            </p>
            <ReportButton kardId={kard.id} isDark={isDark} />
          </div>
        </div>
      ) : (
        <div className={cn("px-3 py-2 flex justify-between items-center")}>
          {/* Mini barcode */}
          <div className="flex gap-[1.5px] items-end h-4">
            {[10, 16, 8, 14, 16, 10, 12, 16, 8, 14].map((h, i) => (
              <div
                key={i}
                className={cn("rounded-[1px]", isDark ? "bg-[#242424]" : "bg-[#D4CCC0]")}
                style={{ width: i % 3 === 0 ? "2px" : "1.5px", height: `${h}px` }}
              />
            ))}
          </div>
          <span
            className={cn("text-[7px] font-mono tracking-wider", isDark ? "text-[#2e2e2e]" : "text-[#c8c0b4]")}
          >
            {kard.shortCode}
          </span>
        </div>
      )}
    </div>
  );
}
