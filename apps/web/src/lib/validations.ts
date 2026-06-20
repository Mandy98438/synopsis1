// ─────────────────────────────────────────────
// KARD — Zod Validation Schemas
// Every input validated before touching the DB
// ─────────────────────────────────────────────

import { z } from "zod";

// ── Username rules ────────────────────────────
const USERNAME_REGEX = /^[a-z0-9_-]{3,30}$/;
const RESERVED_WORDS = [
  "admin", "api", "app", "auth", "blog", "dashboard", "dev",
  "help", "home", "kard", "login", "me", "new", "onboarding",
  "pro", "pricing", "profile", "report", "settings", "signup",
  "support", "terms", "privacy", "verify", "www",
];

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be at most 30 characters")
  .regex(USERNAME_REGEX, "Only lowercase letters, numbers, underscores and hyphens")
  .refine(
    (val) => !RESERVED_WORDS.includes(val.toLowerCase()),
    "This username is reserved"
  );

// ── Platform link ─────────────────────────────
export const platformLinkSchema = z.object({
  type: z.enum(["linkedin", "github", "twitter", "instagram", "custom"]),
  label: z.string().min(1).max(50),
  url: z.string().url("Invalid URL"),
});

// ── Create kard ───────────────────────────────
export const createKardSchema = z.object({
  username: usernameSchema,
  mode: z.enum(["minimal", "professional", "personal"]),
  theme: z.enum(["dark", "light"]),
  firstName: z.string().min(1).max(50).trim(),
  lastName: z.string().min(1).max(50).trim(),
  headline: z.string().min(1).max(100).trim(),
  bio: z.string().max(300).trim().optional(),
  company: z.string().max(100).trim().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(20).trim().optional(),
  location: z.string().max(100).trim().optional(),
  links: z.array(platformLinkSchema).max(10),
});

// ── Update kard ───────────────────────────────
export const updateKardSchema = createKardSchema
  .partial()
  .extend({ kardId: z.string().cuid() });

// ── Report card ───────────────────────────────
export const reportKardSchema = z.object({
  kardId: z.string().cuid(),
  reason: z.enum([
    "impersonation",
    "fake_identity",
    "spam",
    "inappropriate",
    "other",
  ]),
  details: z.string().max(500).optional(),
});

// ── Upload avatar ─────────────────────────────
export const uploadAvatarSchema = z.object({
  kardId: z.string().cuid(),
  // file validated separately via FormData
});

// ── Types inferred from schemas ───────────────
export type CreateKardInput = z.infer<typeof createKardSchema>;
export type UpdateKardInput = z.infer<typeof updateKardSchema>;
export type ReportKardInput = z.infer<typeof reportKardSchema>;
