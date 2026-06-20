// ─────────────────────────────────────────────
// KARD — Onboarding Page
// Route: /onboarding
// Step 1: LinkedIn verify (unavoidable, skippable)
// Step 2: Ready to build
// ─────────────────────────────────────────────

"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { KardLogo } from "@/components/kard/kard-logo";
import { cn } from "@/lib/utils";

type Step = "verify" | "ready";

const PLATFORM_BADGES = [
  { label: "LinkedIn", bg: "#0077B5", short: "in" },
  { label: "GitHub", bg: "#161b22", short: "gh" },
  { label: "Google", bg: "#333", short: "G" },
];

export default function OnboardingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>(
    searchParams.get("step") === "ready" ? "ready" : "verify"
  );
  const [connecting, setConnecting] = useState(false);

  // Redirect if not signed in
  useEffect(() => {
    if (session === null) router.push("/auth/signin");
  }, [session, router]);

  const handleLinkedIn = async () => {
    setConnecting(true);
    await signIn("linkedin", { callbackUrl: "/onboarding?step=ready" });
  };

  const handleSkip = () => setStep("ready");

  const handleBuild = () => router.push("/dashboard/new");

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Subtle grain */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-[#1a1a1a] z-10">
        <div
          className="h-full bg-[#E07020] transition-all duration-500"
          style={{ width: step === "verify" ? "50%" : "100%" }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <KardLogo size="md" isDark className="mb-14" />

        {step === "verify" ? (
          <VerifyStep
            connecting={connecting}
            onConnect={handleLinkedIn}
            onSkip={handleSkip}
          />
        ) : (
          <ReadyStep onBuild={handleBuild} />
        )}
      </div>
    </main>
  );
}

// ── Step 1: Verify identity ────────────────────
function VerifyStep({
  connecting,
  onConnect,
  onSkip,
}: {
  connecting: boolean;
  onConnect: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="w-full max-w-[400px]">
      {/* Step indicator */}
      <p className="text-[#333] text-xs tracking-widest uppercase text-center mb-8">
        Step 1 of 2
      </p>

      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-[#141414] border border-[#222] flex items-center justify-center">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <circle cx="13" cy="13" r="11.5" stroke="#E07020" strokeWidth="1.3" />
              <path d="M8 13l3.5 3.5L18 9" stroke="#E07020" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {/* Platform dots */}
          <div className="absolute -bottom-1 -right-1 flex gap-1">
            {PLATFORM_BADGES.map((p) => (
              <div
                key={p.label}
                className="w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold text-white border border-[#0a0a0a]"
                style={{ background: p.bg }}
              >
                {p.short}
              </div>
            ))}
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-medium text-white text-center mb-3">
        Verify your identity
      </h1>
      <p className="text-[#555] text-sm text-center leading-relaxed mb-8 max-w-xs mx-auto">
        Connect LinkedIn to get your verified badge. It proves this Kard is really you — building trust with everyone you share it with.
      </p>

      {/* What you get */}
      <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-4 mb-6">
        {[
          "Verified badge on your card",
          "Higher trust with people you share with",
          "Protection against impersonation",
        ].map((item) => (
          <div key={item} className="flex items-center gap-3 py-2">
            <div className="w-4 h-4 rounded-full bg-[#0f2a0f] border border-[#1a3a1a] flex items-center justify-center flex-shrink-0">
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M1.5 4l1.5 1.5L6.5 2" stroke="#4CAF50" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[#666] text-xs">{item}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={onConnect}
        disabled={connecting}
        className="w-full py-3.5 rounded-xl bg-[#0077B5] hover:bg-[#006097] text-white text-sm font-medium transition-colors disabled:opacity-50 mb-3 flex items-center justify-center gap-2"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        {connecting ? "Connecting to LinkedIn..." : "Connect LinkedIn"}
      </button>

      <button
        onClick={onSkip}
        className="w-full py-2.5 text-[#333] text-xs hover:text-[#555] transition-colors"
      >
        Skip for now — I'll verify later
      </button>

      <p className="text-[#252525] text-[10px] text-center mt-4 leading-relaxed">
        We only read your public profile to confirm ownership.<br />
        Nothing is ever posted on your behalf.
      </p>
    </div>
  );
}

// ── Step 2: Ready to build ─────────────────────
function ReadyStep({ onBuild }: { onBuild: () => void }) {
  return (
    <div className="w-full max-w-[400px] text-center">
      <p className="text-[#333] text-xs tracking-widest uppercase mb-8">
        Step 2 of 2
      </p>

      {/* Animated check */}
      <div className="w-16 h-16 rounded-2xl bg-[#0f2a0f] border border-[#1a4a1a] flex items-center justify-center mx-auto mb-6">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M6 14l5.5 5.5L22 8" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h1 className="text-2xl font-medium text-white mb-3">
        You're all set
      </h1>
      <p className="text-[#555] text-sm leading-relaxed mb-10 max-w-xs mx-auto">
        Now let's build your Kard. Add your photo, links, and choose how you want to show up in the world.
      </p>

      {/* Card preview hint */}
      <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 mb-8 text-left">
        <p className="text-[#333] text-xs uppercase tracking-widest mb-4">What you'll create</p>
        <div className="flex flex-col gap-3">
          {[
            { icon: "📷", label: "Photo", desc: "Your face on the card" },
            { icon: "🔗", label: "Links", desc: "LinkedIn, GitHub, Instagram…" },
            { icon: "🪪", label: "Card mode", desc: "Minimal, Professional, Personal" },
            { icon: "📲", label: "QR code", desc: "Share in person instantly" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-base">{item.icon}</span>
              <div>
                <span className="text-[#777] text-xs font-medium">{item.label}</span>
                <span className="text-[#333] text-xs"> — {item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onBuild}
        className="w-full py-3.5 rounded-xl bg-[#E07020] hover:bg-[#c85e18] text-white text-sm font-medium transition-colors"
      >
        Build my Kard →
      </button>
    </div>
  );
}
