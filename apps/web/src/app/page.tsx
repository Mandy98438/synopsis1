import { type Metadata } from "next";
import Link from "next/link";
import { landingMetadata } from "@/lib/metadata";
import { KardLogo } from "@/components/kard/kard-logo";

export const metadata = landingMetadata;

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col">

      {/* Nav */}
      <nav className="flex items-center justify-between px-5 md:px-8 py-4 md:py-5 border-b border-[#1a1a1a]">
        <KardLogo size="md" isDark />
        <div className="flex items-center gap-4 md:gap-5">
          <Link href="/demo" className="text-sm text-[#555] hover:text-[#888] transition-colors hidden sm:block">Demo</Link>
          <Link href="/auth/signin" className="text-sm text-[#555] hover:text-[#888] transition-colors hidden sm:block">Sign in</Link>
          <Link href="/auth/signin" className="bg-[#E07020] hover:bg-[#c85e18] text-white text-xs md:text-sm font-medium px-3 md:px-4 py-2 md:py-2.5 rounded-xl transition-colors">
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-5 py-16 md:py-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#141414] border border-[#222] text-[10px] md:text-[11px] text-[#555] mb-6 md:mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-[#E07020]" />
          Digital identity cards for the real world
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white leading-tight mb-4 md:mb-5 max-w-2xl">
          One card.<br />Every connection.
        </h1>
        <p className="text-[#555] text-base md:text-lg leading-relaxed max-w-md mb-8 md:mb-10 px-4">
          Share your complete identity instantly with a single link or QR code. No app needed.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link href="/auth/signin" className="w-full sm:w-auto bg-[#E07020] hover:bg-[#c85e18] text-white font-medium px-8 py-3.5 rounded-xl transition-colors text-sm text-center">
            Create your Kard — free
          </Link>
          <Link href="/demo" className="w-full sm:w-auto bg-[#141414] hover:bg-[#1a1a1a] border border-[#222] text-[#888] hover:text-white font-medium px-8 py-3.5 rounded-xl transition-colors text-sm text-center">
            View Demo
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-[#1a1a1a] px-5 md:px-8 py-14 md:py-20">
        <p className="text-[10px] md:text-[11px] text-[#333] uppercase tracking-widest text-center mb-8 md:mb-12">How it works</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {[
            { step: "01", title: "Build your Kard", desc: "Add your photo, links, and choose what to show. Takes 2 minutes." },
            { step: "02", title: "Share instantly", desc: "Get a unique URL and QR code. Share in person — scan and done." },
            { step: "03", title: "Always up to date", desc: "Update once, reflects everywhere your card has been shared." },
          ].map((item) => (
            <div key={item.step} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-5 md:p-6">
              <p className="text-[#E07020] text-xs font-mono mb-3 md:mb-4">{item.step}</p>
              <h3 className="text-white font-medium mb-2 text-sm md:text-base">{item.title}</h3>
              <p className="text-[#444] text-xs md:text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-[#1a1a1a] px-5 md:px-8 py-14 md:py-20">
        <p className="text-[10px] md:text-[11px] text-[#333] uppercase tracking-widest text-center mb-8 md:mb-12">Everything you need</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
          {[
            { icon: "🪪", title: "3 card modes", desc: "Minimal, Professional, Personal" },
            { icon: "✓", title: "Verified identity", desc: "LinkedIn OAuth verification" },
            { icon: "📲", title: "QR + short code", desc: "Share in-person instantly" },
            { icon: "🔒", title: "Zero tracking", desc: "No data collected on viewers" },
          ].map((f) => (
            <div key={f.title} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-4">
              <p className="text-xl mb-2">{f.icon}</p>
              <p className="text-white text-xs font-medium mb-1">{f.title}</p>
              <p className="text-[#444] text-[10px] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy */}
      <section className="border-t border-[#1a1a1a] px-5 md:px-8 py-14 md:py-16 text-center">
        <div className="max-w-lg mx-auto">
          <p className="text-[10px] md:text-[11px] text-[#333] uppercase tracking-widest mb-4">Privacy first</p>
          <p className="text-white text-lg md:text-xl font-medium mb-3">We collect zero data about your viewers.</p>
          <p className="text-[#444] text-sm leading-relaxed">No cookies. No tracking. No fingerprinting. When someone views your Kard, nothing is collected about them. Ever.</p>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-[#1a1a1a] px-5 md:px-8 py-14 md:py-20">
        <p className="text-[10px] md:text-[11px] text-[#333] uppercase tracking-widest text-center mb-8 md:mb-12">Pricing</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-5 md:p-6">
            <p className="text-white font-medium mb-1">Free</p>
            <p className="text-3xl font-medium text-white mb-4">₹0</p>
            <div className="space-y-2 mb-6">
              {["1 Kard", "QR + short code", "LinkedIn verification", "3 card modes", "Save contact"].map(f => (
                <div key={f} className="flex items-center gap-2 text-sm text-[#555]">
                  <div className="w-1 h-1 rounded-full bg-[#333]" />{f}
                </div>
              ))}
            </div>
            <Link href="/auth/signin" className="block text-center border border-[#222] hover:border-[#333] text-[#666] hover:text-white py-2.5 rounded-xl text-sm font-medium transition-colors">
              Get started free
            </Link>
          </div>
          <div className="bg-[#0d0d0d] border border-[#E07020]/30 rounded-2xl p-5 md:p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#E07020]" />
            <p className="text-white font-medium mb-1">Pro</p>
            <p className="text-3xl font-medium text-white mb-4">Soon</p>
            <div className="space-y-2 mb-6">
              {["Everything in Free", "Multiple Kards", "Full analytics", "Custom themes", "Priority support"].map(f => (
                <div key={f} className="flex items-center gap-2 text-sm text-[#666]">
                  <div className="w-1 h-1 rounded-full bg-[#E07020]" />{f}
                </div>
              ))}
            </div>
            <div className="block text-center bg-[#E07020]/10 border border-[#E07020]/20 text-[#E07020] py-2.5 rounded-xl text-sm font-medium">
              Coming soon
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#1a1a1a] px-5 md:px-8 py-14 md:py-20 text-center">
        <h2 className="text-2xl md:text-3xl font-medium text-white mb-3 md:mb-4">Ready to build your Kard?</h2>
        <p className="text-[#444] text-sm mb-6 md:mb-8">Takes 2 minutes. No credit card needed.</p>
        <Link href="/auth/signin" className="inline-block bg-[#E07020] hover:bg-[#c85e18] text-white font-medium px-8 py-3.5 rounded-xl transition-colors text-sm">
          Create your Kard — it's free
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] px-5 md:px-8 py-6 md:py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <KardLogo size="sm" isDark muted />
        <div className="flex items-center gap-4 md:gap-5 text-xs text-[#333]">
          <Link href="/terms" className="hover:text-[#555] transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-[#555] transition-colors">Privacy</Link>
          <span>© 2025 Kard</span>
        </div>
      </footer>
    </main>
  );
}
