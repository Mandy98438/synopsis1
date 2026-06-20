// ─────────────────────────────────────────────
// KARD — useAuth hook
// Typed session access + redirect helper
// ─────────────────────────────────────────────

"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth(requireAuth = false) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (requireAuth && status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [requireAuth, status, router]);

  return {
    session,
    user: session?.user,
    userId: session?.user?.id as string | undefined,
    isLoading: status === "loading",
    isAuthed: status === "authenticated",
    signIn,
    signOut: () => signOut({ callbackUrl: "/" }),
  };
}
