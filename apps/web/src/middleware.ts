// ─────────────────────────────────────────────
// KARD — Security Middleware (Arcjet)
// Protects all routes from day 1:
//   - Bot detection
//   - Rate limiting
//   - Shield (attack protection)
// ─────────────────────────────────────────────

import arcjet, { shield, tokenBucket, detectBot } from "@arcjet/next";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ── Base Arcjet instance ──────────────────────
const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    // Shield: blocks SQLi, XSS, path traversal, etc.
    shield({ mode: "LIVE" }),
  ],
});

// ── API rate limiter ──────────────────────────
export const apiLimiter = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["userId"], // per-user limiting
  rules: [
    shield({ mode: "LIVE" }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 20,    // 20 requests
      interval: 60,     // per minute
      capacity: 40,
    }),
  ],
});

// ── Card creation limiter (stricter) ─────────
export const cardCreateLimiter = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["userId"],
  rules: [
    shield({ mode: "LIVE" }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 3,     // 3 card creates
      interval: 3600,   // per hour
      capacity: 3,
    }),
  ],
});

// ── Public card viewer limiter ────────────────
export const viewerLimiter = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"], // allow Google, Bing indexing
    }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 60,
      interval: 60,
      capacity: 120,
    }),
  ],
});

// ── Auth limiter ──────────────────────────────
export const authLimiter = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: "LIVE" }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 60,
      capacity: 10,
    }),
  ],
});

// ── Middleware export ─────────────────────────
export async function middleware(request: NextRequest) {
  if (!process.env.ARCJET_KEY || process.env.ARCJET_KEY.includes("placeholder")) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  let decision;

  // Dynamically select and protect using the defined rate limiters per route
  if (pathname.startsWith("/api/auth")) {
    decision = await (authLimiter as any).protect(request);
  } else if (pathname.startsWith("/api/trpc/kard.create")) {
    decision = await (cardCreateLimiter as any).protect(request);
  } else if (pathname.startsWith("/api/trpc/kard.getByUsername") || pathname.startsWith("/api/qr")) {
    decision = await (viewerLimiter as any).protect(request);
  } else if (pathname.startsWith("/api")) {
    decision = await (apiLimiter as any).protect(request);
  } else {
    decision = await aj.protect(request);
  }

  if (decision && decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return NextResponse.json(
        { success: false, error: { code: "RATE_LIMITED", message: "Too many requests" } },
        { status: 429 }
      );
    }
    if (decision.reason.isBot()) {
      return NextResponse.json(
        { success: false, error: { code: "BOT_DETECTED", message: "Automated requests not allowed" } },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: "Request blocked" } },
      { status: 403 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
