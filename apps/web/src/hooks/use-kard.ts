// ─────────────────────────────────────────────
// KARD — useKard hook
// All card CRUD via tRPC, typed + cached
// ─────────────────────────────────────────────

"use client";

import { trpc } from "@/lib/trpc";
import { useToast } from "@/components/ui";
import { useRouter } from "next/navigation";

// ── Get a public card by username ─────────────
export function usePublicKard(username: string) {
  return trpc.kard.getByUsername.useQuery(
    { username },
    { enabled: !!username, retry: false }
  );
}

// ── Get all cards for logged-in user ──────────
export function useMyCards() {
  return trpc.kard.myCards.useQuery(undefined, { retry: 1 });
}

// ── Create card mutation ──────────────────────
export function useCreateKard(options?: { onSuccess?: (data: any) => void; onError?: (err: any) => void }) {
  const { toast } = useToast();
  const router = useRouter();
  const utils = trpc.useContext();

  return trpc.kard.create.useMutation({
    onSuccess: (data) => {
      toast("Kard created successfully!");
      void utils.kard.myCards.invalidate();
      if (options?.onSuccess) {
        options.onSuccess(data);
      } else {
        router.push("/dashboard");
      }
    },
    onError: (err) => {
      if (options?.onError) {
        options.onError(err);
      } else {
        toast(err.message || "Failed to create Kard", "error");
      }
    },
  });
}

// ── Update card mutation ──────────────────────
export function useUpdateKard(options?: { onSuccess?: (data: any) => void; onError?: (err: any) => void }) {
  const { toast } = useToast();
  const utils = trpc.useContext();

  return trpc.kard.update.useMutation({
    onSuccess: (data) => {
      toast("Changes saved");
      void utils.kard.myCards.invalidate();
      if (options?.onSuccess) options.onSuccess(data);
    },
    onError: (err) => {
      if (options?.onError) {
        options.onError(err);
      } else {
        toast(err.message || "Failed to save changes", "error");
      }
    },
  });
}

// ── Track link click (anonymous) ─────────────
export function useTrackClick() {
  return trpc.kard.trackClick.useMutation();
}

// ── Get analytics for a card ─────────────────
export function useKardAnalytics(kardId: string) {
  return trpc.kard.analytics.useQuery(
    { kardId },
    { enabled: !!kardId }
  );
}

// ── Report a card ─────────────────────────────
export function useReportKard() {
  const { toast } = useToast();
  return trpc.kard.report.useMutation({
    onSuccess: () => toast("Report submitted. We'll review within 24h."),
    onError: () => toast("Failed to submit report", "error"),
  });
}
