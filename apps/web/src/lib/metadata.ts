// ─────────────────────────────────────────────
// KARD — Phase 10: Dynamic SEO Metadata
// For the public card viewer: /[username]
// Generates OG tags for WhatsApp, Twitter, iMessage
// ─────────────────────────────────────────────

import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://kard.io";

// ── generateMetadata — called by Next.js at build/request time ──
export async function generateCardMetadata(username: string): Promise<Metadata> {
  const kard = await prisma.kard.findUnique({
    where: { username: username.toLowerCase(), active: true },
    select: {
      firstName: true,
      lastName: true,
      headline: true,
      avatarUrl: true,
      username: true,
      user: { include: { verification: true } },
    },
  });

  if (!kard) return { title: "Not found · KARD" };

  const name = `${kard.firstName} ${kard.lastName}`;
  const level = kard.user?.verification?.level ?? 0;
  const verifiedSuffix =
    level === 3
      ? " · LinkedIn Verified"
      : level >= 1
      ? " · Verified"
      : "";

  const title = `${name}${verifiedSuffix} · KARD`;
  const description = kard.headline
    ? `${kard.headline} — View ${kard.firstName}'s digital identity card on KARD`
    : `View ${name}'s digital identity card on KARD`;

  const ogImageUrl = `${APP_URL}/api/og/${kard.username}`;
  const cardUrl = `${APP_URL}/${kard.username}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: cardUrl,
      siteName: "KARD",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${name}'s KARD`,
        },
      ],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
      creator: "@kard_io",
    },
    alternates: {
      canonical: cardUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// ── Landing page metadata ─────────────────────
export const landingMetadata: Metadata = {
  title: "KARD — Your Digital Identity Card",
  description:
    "Create a verified digital identity card. Share it via QR or link. Works everywhere — WhatsApp, email, LinkedIn.",
  openGraph: {
    title: "KARD — Your Digital Identity Card",
    description:
      "Create a verified digital identity card. Share it via QR or link. Works everywhere.",
    url: APP_URL,
    siteName: "KARD",
    images: [
      {
        url: `${APP_URL}/og-default.png`,
        width: 1200,
        height: 630,
        alt: "KARD — Digital Identity Cards",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KARD — Your Digital Identity Card",
    description:
      "Create a verified digital identity card. Share it via QR or link.",
    images: [`${APP_URL}/og-default.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};
