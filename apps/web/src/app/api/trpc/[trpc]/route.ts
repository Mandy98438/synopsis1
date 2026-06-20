// ─────────────────────────────────────────────
// KARD — tRPC API Route Handler
// FIX: Pass both req + res to createContext so
//      getServerSession works correctly
// ─────────────────────────────────────────────

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest, NextResponse } from "next/server";
import { appRouter, createContext } from "@/server/router";

const handler = async (req: NextRequest) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () => {
      // The fetch adapter doesn't have a res object like the express adapter.
      // We create a mock res so getServerSession doesn't throw.
      const mockRes = new NextResponse();
      return createContext({ req, res: mockRes } as any);
    },
    onError:
      process.env.NODE_ENV === "development"
        ? ({ path, error }) =>
            console.error(`[tRPC] error on ${path}:`, error)
        : undefined,
  });
};

export { handler as GET, handler as POST };
