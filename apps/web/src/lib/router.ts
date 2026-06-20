// ─────────────────────────────────────────────
// KARD — Router re-export
// FIX: was a full duplicate of server/router.ts
//      now just re-exports from the canonical location
// ─────────────────────────────────────────────
export { appRouter, createContext } from "@/server/router";
export type { AppRouter, Context } from "@/server/router";
