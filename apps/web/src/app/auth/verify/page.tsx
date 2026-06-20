// ─────────────────────────────────────────────
// KARD — Verify Request Page
// Route: /auth/verify
// Shown after magic link email is sent
// ─────────────────────────────────────────────

import Link from "next/link";
import { KardLogo } from "@/components/kard/kard-logo";

export default function VerifyPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <KardLogo size="md" isDark className="mb-12" />

      <div className="w-full max-w-[380px] text-center">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#141414] border border-[#222] flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M3 8l11 7.5L25 8" stroke="#E07020" strokeWidth="1.5" strokeLinecap="round" />
            <rect x="3" y="5" width="22" height="18" rx="2.5" stroke="#E07020" strokeWidth="1.5" />
          </svg>
        </div>

        <h1 className="text-2xl font-medium text-white mb-3">
          Check your inbox
        </h1>
        <p className="text-[#555] text-sm leading-relaxed mb-2">
          A magic link is on its way to your email.
          Click it to sign in — no password needed.
        </p>
        <p className="text-[#333] text-xs mb-8">
          Link expires in 24 hours. Check your spam folder if you don't see it.
        </p>

        {/* Divider */}
        <div className="h-px bg-[#1a1a1a] mb-6" />

        <Link
          href="/auth/signin"
          className="text-[#444] text-sm hover:text-[#666] transition-colors"
        >
          ← Back to sign in
        </Link>
      </div>
    </div>
  );
}
