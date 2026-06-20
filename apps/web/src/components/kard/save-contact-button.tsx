// ─────────────────────────────────────────────
// KARD — Save Contact Button
// Generates a .vcf vCard and triggers download
// Works on iOS, Android, and desktop
// No server call needed — pure client-side
// ─────────────────────────────────────────────

"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface SaveContactButtonProps {
  kard: {
    firstName: string;
    lastName: string;
    headline: string;
    company: string | null;
    email: string | null;
    phone: string | null;
    avatarUrl: string | null;
    links: { type: string; url: string; label: string }[];
  };
  isDark?: boolean;
  className?: string;
}

function buildVCard(kard: SaveContactButtonProps["kard"]): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${kard.lastName};${kard.firstName};;;`,
    `FN:${kard.firstName} ${kard.lastName}`,
    kard.headline ? `TITLE:${kard.headline}` : null,
    kard.company ? `ORG:${kard.company}` : null,
    kard.email ? `EMAIL;TYPE=INTERNET:${kard.email}` : null,
    kard.phone ? `TEL;TYPE=CELL:${kard.phone}` : null,
    // Add social links as URLs
    ...kard.links.map((l) => `URL;TYPE=${l.label}:${l.url}`),
    "END:VCARD",
  ].filter(Boolean);

  return lines.join("\r\n");
}

export function SaveContactButton({
  kard,
  isDark = true,
  className,
}: SaveContactButtonProps) {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const vcf = buildVCard(kard);
    const blob = new Blob([vcf], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${kard.firstName}_${kard.lastName}_kard.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <button
      onClick={handleSave}
      className={cn(
        "w-full py-3 rounded-xl font-medium text-[13px] tracking-wide transition-all duration-200",
        saved
          ? isDark
            ? "bg-[#1a3a1a] text-[#4CAF50] border border-[#2a4a2a]"
            : "bg-[#e4f0dc] text-[#3a7a28] border border-[#b0d0a0]"
          : "bg-[#E07020] hover:bg-[#c85e18] text-white",
        className
      )}
      aria-label="Save contact to phone"
    >
      {saved ? (
        <span className="flex items-center justify-center gap-2">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Saved to contacts
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <rect x="2" y="1" width="10" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
            <circle cx="7" cy="6" r="2" stroke="currentColor" strokeWidth="1.2" />
            <path d="M3.5 12c0-1.93 1.57-3 3.5-3s3.5 1.07 3.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          Save contact
        </span>
      )}
    </button>
  );
}
