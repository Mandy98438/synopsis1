// ─────────────────────────────────────────────
// KARD — Auth Error Page
// Route: /auth/error
// ─────────────────────────────────────────────

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { KardLogo } from "@/components/kard/kard-logo";

const ERROR_MESSAGES: Record<string, { title: string; detail: string }> = {
  Configuration: {
    title: "Configuration error",
    detail: "There's an issue with the auth setup. Please try again later.",
  },
  AccessDenied: {
    title: "Access denied",
    detail: "You don't have permission to sign in.",
  },
  Verification: {
    title: "Link expired",
    detail: "This magic link has expired or already been used. Request a new one.",
  },
  Default: {
    title: "Something went wrong",
    detail: "An unexpected error occurred. Please try signing in again.",
  },
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") ?? "Default";
  const { title, detail } = ERROR_MESSAGES[error] ?? ERROR_MESSAGES.Default!;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <KardLogo size="md" isDark className="mb-12" />

      <div className="w-full max-w-[380px] text-center">
        <div className="w-14 h-14 rounded-full bg-[#2a0f0f] border border-[#3a1a1a] flex items-center justify-center mx-auto mb-5">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 6v5M10 14h.01" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="10" cy="10" r="8.5" stroke="#ef4444" strokeWidth="1.3" />
          </svg>
        </div>

        <h1 className="text-xl font-medium text-white mb-2">{title}</h1>
        <p className="text-[#555] text-sm leading-relaxed mb-8">{detail}</p>

        <Link
          href="/auth/signin"
          className="inline-block px-6 py-3 rounded-xl bg-[#E07020] text-white text-sm font-medium hover:bg-[#c85e18] transition-colors"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
