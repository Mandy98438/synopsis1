// ─────────────────────────────────────────────
// KARD — Shared TypeScript Types
// Used across web app and API
// ─────────────────────────────────────────────

// ── Card Modes ────────────────────────────────
export type CardMode = "minimal" | "professional" | "personal";

// ── Verification Tiers ────────────────────────
export type VerificationLevel = 0 | 1 | 2 | 3;

export interface VerificationStatus {
  level: VerificationLevel;
  linkedinVerified: boolean;
  githubVerified: boolean;
  googleVerified: boolean;
  twitterVerified: boolean;
}

// ── Platform Links ────────────────────────────
export type PlatformType =
  | "linkedin"
  | "github"
  | "twitter"
  | "instagram"
  | "custom";

export interface PlatformLink {
  id: string;
  type: PlatformType;
  label: string;
  url: string;
  verified: boolean;
}

// ── Kard (Public-facing card data) ────────────
export interface KardPublic {
  id: string;
  username: string;          // kard.io/username
  shortCode: string;         // KRD-XXXX
  mode: CardMode;
  theme: "dark" | "light";
  // Identity
  firstName: string;
  lastName: string;
  headline: string;
  bio: string | null;
  avatarUrl: string | null;
  // Work
  company: string | null;
  // Contact (shown only in personal mode)
  email: string | null;
  phone: string | null;
  location: string | null;
  // Links
  links: PlatformLink[];
  // Verification
  verification: VerificationStatus;
  // Meta
  createdAt: string;
  updatedAt: string;
}

// ── User ──────────────────────────────────────
export interface UserProfile {
  id: string;
  email: string;
  emailVerified: boolean;
  plan: "free" | "pro";
  cards: KardPublic[];
  verification: VerificationStatus;
  createdAt: string;
}

// ── API Responses ─────────────────────────────
export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ── Card Analytics (owner only) ───────────────
export interface KardAnalytics {
  kardId: string;
  totalViews: number;
  linkClicks: Record<string, number>; // linkId → click count
  last30Days: {
    date: string;
    views: number;
  }[];
}

// ── Zod-validated inputs (shared with server) ─
export interface CreateKardInput {
  username: string;
  mode: CardMode;
  theme: "dark" | "light";
  firstName: string;
  lastName: string;
  headline: string;
  bio?: string;
  company?: string;
  email?: string;
  phone?: string;
  location?: string;
  links: Omit<PlatformLink, "id" | "verified">[];
}

export interface UpdateKardInput extends Partial<CreateKardInput> {
  kardId: string;
}
