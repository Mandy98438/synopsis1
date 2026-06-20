// ─────────────────────────────────────────────
// KARD — Report Button + Modal
// Appears on every public card
// No auth required to file a report
// ─────────────────────────────────────────────

"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ReportButtonProps {
  kardId: string;
  isDark?: boolean;
}

const REASONS = [
  { value: "impersonation", label: "Impersonating someone" },
  { value: "fake_identity", label: "Fake identity" },
  { value: "spam", label: "Spam or scam" },
  { value: "inappropriate", label: "Inappropriate content" },
  { value: "other", label: "Other" },
] as const;

type ReportState = "idle" | "open" | "submitting" | "done" | "error";

export function ReportButton({ kardId, isDark = true }: ReportButtonProps) {
  const [state, setState] = useState<ReportState>("idle");
  const [reason, setReason] = useState<string>("");
  const [details, setDetails] = useState("");

  const handleSubmit = async () => {
    if (!reason) return;
    setState("submitting");

    try {
      const res = await fetch("/api/trpc/kard.report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: { kardId, reason, details } }),
      });

      if (res.ok) {
        setState("done");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  };

  const handleClose = () => {
    setState("idle");
    setReason("");
    setDetails("");
  };

  const overlayBase = "fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4";
  const modalBase = cn(
    "w-full max-w-sm rounded-2xl p-5 relative",
    isDark ? "bg-[#1a1a1a] border border-[#2a2a2a]" : "bg-white border border-[#e8e0d4] shadow-xl"
  );

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setState("open")}
        className={cn(
          "text-[9px] font-medium transition-colors",
          isDark ? "text-[#2a2a2a] hover:text-[#444]" : "text-[#ccc] hover:text-[#aaa]"
        )}
        aria-label="Report this card"
      >
        Report
      </button>

      {/* Modal */}
      {state !== "idle" && (
        <div className={overlayBase} onClick={handleClose}>
          <div className={modalBase} onClick={(e) => e.stopPropagation()}>

            {state === "done" ? (
              <div className="text-center py-4">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3",
                  isDark ? "bg-[#0f2a0f]" : "bg-[#e4f0dc]")}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M4 9l3.5 3.5L14 5" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className={cn("text-sm font-medium mb-1", isDark ? "text-white" : "text-[#111]")}>
                  Report submitted
                </p>
                <p className={cn("text-xs mb-4", isDark ? "text-[#555]" : "text-[#aaa]")}>
                  We'll review this card within 24 hours.
                </p>
                <button onClick={handleClose} className="text-xs text-[#E07020] font-medium">
                  Close
                </button>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-[#111]")}>
                    Report this card
                  </p>
                  <button onClick={handleClose} className={cn("text-lg leading-none", isDark ? "text-[#444]" : "text-[#ccc]")}>
                    ✕
                  </button>
                </div>

                {/* Reasons */}
                <div className="flex flex-col gap-2 mb-4">
                  {REASONS.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setReason(r.value)}
                      className={cn(
                        "w-full text-left px-3 py-2.5 rounded-lg border text-xs font-medium transition-colors",
                        reason === r.value
                          ? "border-[#E07020] bg-[#E07020]/10 text-[#E07020]"
                          : isDark
                            ? "border-[#222] bg-[#111] text-[#666] hover:border-[#333]"
                            : "border-[#eee] bg-[#f9f9f9] text-[#888] hover:border-[#ddd]"
                      )}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>

                {/* Optional details */}
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Additional details (optional)"
                  maxLength={500}
                  rows={2}
                  className={cn(
                    "w-full text-xs px-3 py-2 rounded-lg border resize-none outline-none mb-4",
                    isDark
                      ? "bg-[#111] border-[#222] text-[#aaa] placeholder:text-[#333]"
                      : "bg-[#f9f9f9] border-[#eee] text-[#666] placeholder:text-[#ccc]"
                  )}
                />

                {state === "error" && (
                  <p className="text-[10px] text-red-400 mb-3">
                    Something went wrong. Please try again.
                  </p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={!reason || state === "submitting"}
                  className="w-full py-2.5 rounded-lg bg-[#E07020] text-white text-xs font-medium disabled:opacity-40 hover:bg-[#c85e18] transition-colors"
                >
                  {state === "submitting" ? "Submitting..." : "Submit report"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
