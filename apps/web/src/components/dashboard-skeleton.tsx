"use client";

// ─────────────────────────────────────────────
// KARD — Phase 9: Loading Skeletons + Empty States
// ─────────────────────────────────────────────

import { cn } from "@/lib/utils";

// ── Skeleton primitive ────────────────────────
function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-[#1a1a1a]",
        className
      )}
    />
  );
}

// ── Dashboard card skeleton ───────────────────
export function KardCardSkeleton() {
  return (
    <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-2.5 w-20" />
        </div>
        <Skeleton className="h-6 w-16 rounded-lg" />
      </div>
      <Skeleton className="h-px w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-7 flex-1 rounded-lg" />
        <Skeleton className="h-7 flex-1 rounded-lg" />
        <Skeleton className="h-7 w-7 rounded-lg" />
      </div>
    </div>
  );
}

// ── Dashboard page skeleton ───────────────────
export function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-28" />
        </div>
        <Skeleton className="h-9 w-32 rounded-xl" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4 space-y-2"
          >
            <Skeleton className="h-2.5 w-16" />
            <Skeleton className="h-6 w-12" />
          </div>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-3">
        <KardCardSkeleton />
        <KardCardSkeleton />
      </div>
    </div>
  );
}

// ── Analytics skeleton ────────────────────────
export function AnalyticsSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-4 w-48 mb-6" />
      <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-5">
        <Skeleton className="h-3 w-24 mb-4" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4 space-y-2"
          >
            <Skeleton className="h-2.5 w-20" />
            <Skeleton className="h-6 w-10" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Empty states ──────────────────────────────

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#111] border border-[#1e1e1e] flex items-center justify-center text-2xl mb-4">
        {icon}
      </div>
      <p className="text-sm font-medium text-white mb-1">{title}</p>
      <p className="text-xs text-[#555] max-w-xs mb-5">{description}</p>
      {action}
    </div>
  );
}

// ── No cards empty state ──────────────────────
export function NoKardsEmpty({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <EmptyState
      icon="✦"
      title="No Kards yet"
      description="Create your first digital identity card and start sharing it instantly."
      action={
        <button
          onClick={onCreateClick}
          className="px-4 py-2 bg-[#E07020] text-white text-xs font-medium rounded-xl hover:bg-[#c8601a] transition-colors"
        >
          Create your first Kard
        </button>
      }
    />
  );
}

// ── No analytics empty state ──────────────────
export function NoAnalyticsEmpty() {
  return (
    <EmptyState
      icon="📊"
      title="No views yet"
      description="Share your Kard and analytics will appear here once people start viewing it."
    />
  );
}

// ── No links empty state (inline in card viewer) ──
export function NoLinksEmpty() {
  return (
    <div className="text-center py-6">
      <p className="text-xs text-[#444]">No links added yet</p>
    </div>
  );
}

// ── Server-safe empty state (uses Link not onClick) ──
import Link from "next/link";

export function NoKardsEmptyServer() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#111] border border-[#1e1e1e] flex items-center justify-center text-2xl mb-4">
        ✦
      </div>
      <p className="text-sm font-medium text-white mb-1">No Kards yet</p>
      <p className="text-xs text-[#555] max-w-xs mb-5">
        Create your first digital identity card and start sharing it instantly.
      </p>
      <Link
        href="/dashboard/new"
        className="px-4 py-2 bg-[#E07020] text-white text-xs font-medium rounded-xl hover:bg-[#c8601a] transition-colors"
      >
        Create your first Kard
      </Link>
    </div>
  );
}
