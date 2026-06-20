// ─────────────────────────────────────────────
// KARD — Demo Card Page
// Route: /demo
// FIX: Was referenced on landing page but missing
//      Now shows a static demo card
// ─────────────────────────────────────────────

import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getDemoKard } from "@/lib/demo-kard";
import { KardLogo } from "@/components/kard/kard-logo";
import { VerifiedBadge } from "@/components/kard/verified-badge";
import { LinkButton } from "@/components/kard/link-button";
import { SaveContactButton } from "@/components/kard/save-contact-button";

export const metadata: Metadata = {
  title: "Demo Kard — See how it works",
  description: "See a live example of a Kard — your digital identity card for everywhere.",
};

export default function DemoPage() {
  const kard = getDemoKard();
  const isDark = kard.theme === "DARK";

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
      {/* Back to home */}
      <Link
        href="/"
        className="text-[#444] text-xs hover:text-[#666] transition-colors mb-8 flex items-center gap-1.5"
      >
        ← Back to Kard
      </Link>

      <p className="text-[10px] text-[#333] uppercase tracking-widest mb-6">
        Live demo
      </p>

      {/* The card */}
      <div className="w-full max-w-[360px] rounded-[22px] overflow-hidden bg-[#141414] shadow-2xl">
        {/* Accent bar */}
        <div className="h-1 w-full bg-[#E07020]" />

        {/* Photo area */}
        <div className="relative w-full aspect-square bg-[#1c1c1c]">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl font-medium select-none text-[#252525]">
              {kard.firstName[0]}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-end bg-gradient-to-t from-black/65 to-transparent">
            <KardLogo size="sm" isDark muted />
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/8 text-white/35">
              {kard.company}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="px-5 pt-4 pb-2">
          <h1 className="text-xl font-medium leading-tight text-[#f0f0f0]">
            {kard.firstName} {kard.lastName}
          </h1>
          <p className="text-xs mt-0.5 mb-4 text-[#555]">
            {kard.headline} · {kard.company}
          </p>

          <div className="flex flex-col gap-2 mb-4">
            {kard.links.map((link) => (
              <LinkButton key={link.id} link={link as any} isDark={isDark} kardId={kard.id} />
            ))}
          </div>

          <div className="mb-4">
            <VerifiedBadge level={kard.user.verification.level} isDark={isDark} />
          </div>
        </div>

        <div className="mx-5 h-px bg-[#1e1e1e]" />

        <div className="px-5 pb-5 pt-3 flex flex-col gap-3">
          <SaveContactButton kard={kard as any} isDark={isDark} />
          <p className="text-[9px] text-[#2a2a2a]">No data collected about you</p>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 text-center">
        <p className="text-[#444] text-sm mb-4">Like what you see?</p>
        <Link
          href="/auth/signin"
          className="inline-block bg-[#E07020] hover:bg-[#c85e18] text-white font-medium px-6 py-3 rounded-xl transition-colors text-sm"
        >
          Create your Kard — free
        </Link>
      </div>
    </main>
  );
}
