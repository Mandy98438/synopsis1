// ─────────────────────────────────────────────
// KARD — Phase 10: OG Image Generation
// Route: /api/og/[username]
// Returns a 1200×630 PNG for WhatsApp/Twitter/iMessage previews
// Uses @vercel/og (built into Next.js 13+, no extra install needed)
// ─────────────────────────────────────────────

import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "edge"; // edge runtime for speed

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  const kard = await prisma.kard.findUnique({
    where: { username: params.username.toLowerCase(), active: true },
    select: {
      firstName: true,
      lastName: true,
      headline: true,
      avatarUrl: true,
      theme: true,
      user: { include: { verification: true } },
    },
  });

  if (!kard) {
    // Return a generic KARD OG image if card not found
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0a0a0a",
          }}
        >
          <span style={{ color: "#E07020", fontSize: 64, fontWeight: 700 }}>
            KARD
          </span>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  const isDark = kard.theme !== "LIGHT";
  const bg = isDark ? "#0a0a0a" : "#FAF6EF";
  const fg = isDark ? "#ffffff" : "#0a0a0a";
  const sub = isDark ? "#888888" : "#666666";
  const border = isDark ? "#1a1a1a" : "#e8e0d4";
  const accent = "#E07020";

  const name = `${kard.firstName} ${kard.lastName}`;
  const level = kard.user?.verification?.level ?? 0;

  const verifiedLabel =
    level === 3
      ? "LinkedIn Verified"
      : level >= 1
      ? "Verified"
      : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: bg,
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: accent,
          }}
        />

        {/* Card container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "56px 80px",
            border: `1px solid ${border}`,
            borderRadius: 32,
            maxWidth: 700,
            width: "100%",
          }}
        >
          {/* Avatar */}
          {kard.avatarUrl ? (
            <img
              src={kard.avatarUrl}
              width={100}
              height={100}
              style={{
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: 24,
                border: `2px solid ${border}`,
              }}
            />
          ) : (
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: isDark ? "#1a1a1a" : "#e8e0d4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 40,
                color: accent,
                marginBottom: 24,
                fontWeight: 700,
              }}
            >
              {kard.firstName?.[0] ?? "K"}
            </div>
          )}

          {/* Name */}
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: fg,
              letterSpacing: "-1px",
              textAlign: "center",
            }}
          >
            {name}
          </div>

          {/* Headline */}
          {kard.headline && (
            <div
              style={{
                fontSize: 22,
                color: sub,
                marginTop: 10,
                textAlign: "center",
                maxWidth: 500,
              }}
            >
              {kard.headline}
            </div>
          )}

          {/* Verified badge */}
          {verifiedLabel && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginTop: 20,
                padding: "6px 16px",
                background: `${accent}15`,
                border: `1px solid ${accent}30`,
                borderRadius: 99,
              }}
            >
              <span style={{ color: accent, fontSize: 14 }}>✓</span>
              <span style={{ color: accent, fontSize: 14, fontWeight: 600 }}>
                {verifiedLabel}
              </span>
            </div>
          )}
        </div>

        {/* Bottom KARD brand */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ color: accent, fontSize: 18, fontWeight: 700 }}>
            KARD
          </span>
          <span style={{ color: sub, fontSize: 16 }}>
            · kard.io/{params.username}
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
