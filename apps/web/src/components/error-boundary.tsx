"use client";

// ─────────────────────────────────────────────
// KARD — Phase 9: Error Boundary
// Catches React render errors gracefully
// ─────────────────────────────────────────────

import React from "react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // In production, send to your error tracking service (e.g. Sentry)
    console.error("[ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <DefaultErrorFallback
            error={this.state.error}
            reset={() => this.setState({ hasError: false })}
          />
        )
      );
    }
    return this.props.children;
  }
}

// ── Default fallback UI ───────────────────────
function DefaultErrorFallback({
  error,
  reset,
}: {
  error?: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
      <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-xl mb-4">
        ⚠
      </div>
      <p className="text-sm font-medium text-white mb-1">Something went wrong</p>
      <p className="text-xs text-[#555] mb-5 max-w-xs">
        {process.env.NODE_ENV === "development"
          ? error?.message ?? "An unexpected error occurred"
          : "An unexpected error occurred. Please try again."}
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-[#1a1a1a] text-white text-xs font-medium rounded-xl hover:bg-[#222] transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

// ── tRPC error display ────────────────────────
// Use this wherever you call trpc queries
export function TRPCErrorDisplay({
  error,
  onRetry,
}: {
  error: { message: string } | null | undefined;
  onRetry?: () => void;
}) {
  if (!error) return null;

  const isNotFound = error.message?.includes("NOT_FOUND");
  const isUnauthorized = error.message?.includes("UNAUTHORIZED");
  const isNetwork =
    error.message?.includes("fetch") ||
    error.message?.includes("network") ||
    error.message?.toLowerCase().includes("failed to fetch");

  const message = isNotFound
    ? "Not found"
    : isUnauthorized
    ? "You need to be signed in"
    : isNetwork
    ? "Network error — check your connection"
    : error.message ?? "Something went wrong";

  return (
    <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
      <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-lg mb-3">
        {isNetwork ? "📡" : "⚠"}
      </div>
      <p className="text-sm text-[#888] mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs text-[#E07020] hover:underline"
        >
          Try again
        </button>
      )}
    </div>
  );
}
