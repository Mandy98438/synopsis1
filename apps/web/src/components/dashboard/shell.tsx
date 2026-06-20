"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { KardLogo } from "@/components/kard/kard-logo";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  children: React.ReactNode;
  user: { name?: string | null; email?: string | null; plan?: string };
}

const NAV = [
  { href: "/dashboard", label: "My Kard", icon: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1" y="3" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M1 6h13" stroke="currentColor" strokeWidth="1.3"/></svg>
  )},
  { href: "/dashboard/new", label: "New Card", icon: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 2v11M2 7.5h11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
  )},
  { href: "/dashboard/settings", label: "Settings", icon: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.3"/><path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
  )},
];

export function DashboardShell({ children, user }: DashboardShellProps) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const initials = user.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">

      {/* ── Desktop sidebar ──────────────────── */}
      <aside className="hidden md:flex w-[200px] flex-shrink-0 flex-col bg-[#0d0d0d] border-r border-[#1a1a1a]">
        <div className="px-5 py-5 border-b border-[#1a1a1a]">
          <KardLogo size="md" isDark />
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                className={cn("flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all",
                  active ? "bg-[#1a1a1a] text-white" : "text-[#444] hover:text-[#888] hover:bg-[#141414]")}>
                <span className={active ? "text-[#E07020]" : ""}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-[#1a1a1a]">
          <div className="flex items-center gap-2.5 px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-[#1e1e1e] border border-[#2a2a2a] flex items-center justify-center text-[11px] font-medium text-[#666] flex-shrink-0">{initials}</div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-[#888] truncate">{user.name ?? user.email?.split("@")[0]}</p>
              <p className="text-[10px] text-[#333] capitalize">{(user.plan ?? "free").toLowerCase()} plan</p>
            </div>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full mt-1 px-3 py-2 text-[11px] text-[#333] hover:text-[#555] transition-colors text-left rounded-xl hover:bg-[#141414]">
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Mobile topbar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a] bg-[#0d0d0d] flex-shrink-0">
          <KardLogo size="sm" isDark />
          <button onClick={() => setMobileNavOpen(!mobileNavOpen)} className="text-[#555] p-1">
            {mobileNavOpen ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            )}
          </button>
        </div>

        {/* Mobile nav drawer */}
        {mobileNavOpen && (
          <div className="md:hidden absolute inset-0 z-50 bg-[#0a0a0a] flex flex-col pt-16">
            <nav className="px-4 py-4 flex flex-col gap-1">
              {NAV.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileNavOpen(false)}
                    className={cn("flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all",
                      active ? "bg-[#1a1a1a] text-white" : "text-[#444] hover:text-[#888]")}>
                    <span className={active ? "text-[#E07020]" : ""}>{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto px-4 py-6 border-t border-[#1a1a1a]">
              <p className="text-sm text-[#555] mb-3">{user.email}</p>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="text-sm text-red-400 hover:text-red-300">Sign out</button>
            </div>
          </div>
        )}

        <main className="flex-1 flex flex-col overflow-hidden">{children}</main>

        {/* Mobile bottom nav */}
        <div className="md:hidden flex border-t border-[#1a1a1a] bg-[#0d0d0d] flex-shrink-0">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                className={cn("flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors",
                  active ? "text-[#E07020]" : "text-[#333] hover:text-[#555]")}>
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
