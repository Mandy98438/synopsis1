"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { KardLogo } from "@/components/kard/kard-logo";
import { cn } from "@/lib/utils";

type State = "idle" | "loading" | "sent" | "error";

const OAUTH = [
  { id: "linkedin", label: "Continue with LinkedIn", bg: "bg-[#0077B5] hover:bg-[#006097]" },
  { id: "github", label: "Continue with GitHub", bg: "bg-[#161b22] hover:bg-[#1c2128] border border-[#2a2a2a]" },
  { id: "google", label: "Continue with Google", bg: "bg-[#141414] hover:bg-[#1a1a1a] border border-[#222]" },
];

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setState("loading");
    try {
      const res = await signIn("email", { email: email.trim(), callbackUrl, redirect: false });
      setState(res?.error ? "error" : "sent");
    } catch { setState("error"); }
  };

  const handleOAuth = async (provider: string) => {
    setOauthLoading(provider);
    await signIn(provider, { callbackUrl });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4 py-12">
      <KardLogo size="md" isDark className="mb-10 md:mb-12" />
      <div className="w-full max-w-[360px]">
        {state === "sent" ? (
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-[#0f1f0f] border border-[#1a3a1a] flex items-center justify-center mx-auto mb-5">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M2 6l9 6 9-6" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round"/><rect x="2" y="4" width="18" height="14" rx="2" stroke="#4CAF50" strokeWidth="1.5"/></svg>
            </div>
            <h1 className="text-xl font-medium text-white mb-2">Check your email</h1>
            <p className="text-[#555] text-sm leading-relaxed mb-6">We sent a magic link to<br /><span className="text-[#888]">{email}</span></p>
            <button onClick={() => setState("idle")} className="text-[#E07020] text-sm hover:underline">Try a different email</button>
          </div>
        ) : (
          <>
            <div className="text-center mb-7">
              <h1 className="text-2xl font-medium text-white mb-2">Sign in to Kard</h1>
              <p className="text-[#555] text-sm">Enter your email for a magic link.</p>
            </div>
            <form onSubmit={handleEmail} className="mb-5">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required autoFocus
                className={cn("w-full px-4 py-3.5 rounded-xl bg-[#141414] border text-white text-sm placeholder:text-[#333] outline-none transition-colors mb-3",
                  state === "error" ? "border-red-500/50" : "border-[#222] focus:border-[#444]")} />
              {state === "error" && <p className="text-red-400 text-xs mb-3">Something went wrong. Please try again.</p>}
              <button type="submit" disabled={state === "loading" || !email.trim()}
                className="w-full py-3.5 rounded-xl bg-[#E07020] hover:bg-[#c85e18] text-white text-sm font-medium transition-colors disabled:opacity-50">
                {state === "loading" ? "Sending..." : "Continue with email"}
              </button>
            </form>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-[#1a1a1a]" /><span className="text-[#333] text-xs">or</span><div className="flex-1 h-px bg-[#1a1a1a]" />
            </div>
            <div className="flex flex-col gap-2.5">
              {OAUTH.map(p => (
                <button key={p.id} onClick={() => handleOAuth(p.id)} disabled={oauthLoading !== null}
                  className={cn("w-full py-3 rounded-xl text-white text-sm font-medium transition-all disabled:opacity-50", p.bg)}>
                  {oauthLoading === p.id ? "Connecting..." : p.label}
                </button>
              ))}
            </div>
            <p className="text-center text-[#2a2a2a] text-xs mt-7 leading-relaxed">
              By continuing you agree to our <a href="/terms" className="text-[#333] hover:text-[#555]">Terms</a> and <a href="/privacy" className="text-[#333] hover:text-[#555]">Privacy Policy</a>.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
