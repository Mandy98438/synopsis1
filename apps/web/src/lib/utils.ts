// ─────────────────────────────────────────────
// KARD — Utility Functions
// ─────────────────────────────────────────────

import { customAlphabet } from "nanoid";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { prisma } from "@/lib/db";

// ── Tailwind class merge ──────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Short code generator ──────────────────────
// Generates KRD-XXXX style codes
const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const generateId = customAlphabet(alphabet, 4);

export async function generateShortCode(): Promise<string> {
  let code: string;
  let exists = true;

  do {
    code = `KRD-${generateId()}`;
    const found = await prisma.kard.findUnique({ where: { shortCode: code } });
    exists = !!found;
  } while (exists);

  return code;
}

// ── Card URL helpers ──────────────────────────
export function getCardUrl(username: string, mode?: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://kard.io";
  if (mode && mode !== "professional") {
    return `${base}/${username}/${mode}`;
  }
  return `${base}/${username}`;
}

// ── Verification level label ──────────────────
export function getVerificationLabel(level: number): string {
  switch (level) {
    case 1: return "Verified";
    case 2: return "Verified";
    case 3: return "LinkedIn Verified";
    default: return "Unverified";
  }
}

// ── Platform URL validator ────────────────────
export function isPlatformUrl(url: string, platform: string): boolean {
  const patterns: Record<string, RegExp> = {
    linkedin: /^https:\/\/(www\.)?linkedin\.com\//,
    github: /^https:\/\/(www\.)?github\.com\//,
    twitter: /^https:\/\/(www\.)?(twitter|x)\.com\//,
    instagram: /^https:\/\/(www\.)?instagram\.com\//,
  };
  return patterns[platform]?.test(url) ?? true;
}

// ── Truncate text ─────────────────────────────
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - 3)}...`;
}

// ── Format date ───────────────────────────────
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}
