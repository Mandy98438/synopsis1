// ─────────────────────────────────────────────
// KARD — Database Seed
// FIX: Added missing reserved usernames:
//      login, signup, null, undefined, test,
//      root, status, about, contact, legal
// Run: npm run db:seed
// ─────────────────────────────────────────────

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const RESERVED_USERNAMES = [
  // ── Internal routes ───────────────────────
  { username: "admin", reason: "internal" },
  { username: "api", reason: "internal" },
  { username: "app", reason: "internal" },
  { username: "auth", reason: "internal" },
  { username: "dashboard", reason: "internal" },
  { username: "onboarding", reason: "internal" },
  { username: "settings", reason: "internal" },
  { username: "profile", reason: "internal" },
  { username: "pricing", reason: "internal" },
  { username: "support", reason: "internal" },
  { username: "terms", reason: "internal" },
  { username: "privacy", reason: "internal" },
  { username: "verify", reason: "internal" },
  { username: "k", reason: "internal" },
  { username: "new", reason: "internal" },
  { username: "me", reason: "internal" },
  { username: "help", reason: "internal" },
  { username: "blog", reason: "internal" },
  { username: "dev", reason: "internal" },
  { username: "www", reason: "internal" },
  { username: "home", reason: "internal" },
  { username: "about", reason: "internal" },       // FIX: was missing
  { username: "contact", reason: "internal" },     // FIX: was missing
  { username: "legal", reason: "internal" },       // FIX: was missing
  { username: "status", reason: "internal" },      // FIX: was missing
  { username: "login", reason: "internal" },       // FIX: was missing
  { username: "signup", reason: "internal" },      // FIX: was missing
  { username: "root", reason: "internal" },        // FIX: was missing
  { username: "test", reason: "internal" },        // FIX: was missing
  { username: "null", reason: "internal" },        // FIX: was missing — breaks DB queries
  { username: "undefined", reason: "internal" },   // FIX: was missing — breaks JS
  { username: "demo", reason: "internal" },        // reserved for demo card
  { username: "pro", reason: "internal" },
  { username: "docs", reason: "internal" },
  { username: "mail", reason: "internal" },
  { username: "cdn", reason: "internal" },
  { username: "static", reason: "internal" },

  // ── Brand ─────────────────────────────────
  { username: "kard", reason: "brand" },

  // ── Impersonation risk ────────────────────
  { username: "security", reason: "impersonation_risk" },
  { username: "official", reason: "impersonation_risk" },
  { username: "verified", reason: "impersonation_risk" },
  { username: "support", reason: "impersonation_risk" },
  { username: "team", reason: "impersonation_risk" },
  { username: "staff", reason: "impersonation_risk" },

  // ── Brand protection ──────────────────────
  { username: "apple", reason: "brand_protection" },
  { username: "google", reason: "brand_protection" },
  { username: "microsoft", reason: "brand_protection" },
  { username: "amazon", reason: "brand_protection" },
  { username: "meta", reason: "brand_protection" },
  { username: "netflix", reason: "brand_protection" },
  { username: "twitter", reason: "brand_protection" },
  { username: "instagram", reason: "brand_protection" },
  { username: "linkedin", reason: "brand_protection" },
  { username: "github", reason: "brand_protection" },
  { username: "openai", reason: "brand_protection" },
  { username: "anthropic", reason: "brand_protection" },
  { username: "tesla", reason: "brand_protection" },
  { username: "stripe", reason: "brand_protection" },
  { username: "vercel", reason: "brand_protection" },
  { username: "notion", reason: "brand_protection" },
  { username: "slack", reason: "brand_protection" },
  { username: "figma", reason: "brand_protection" },
  { username: "spotify", reason: "brand_protection" },
  { username: "youtube", reason: "brand_protection" },
  { username: "tiktok", reason: "brand_protection" },
  { username: "shopify", reason: "brand_protection" },
  { username: "discord", reason: "brand_protection" },
  { username: "reddit", reason: "brand_protection" },
];

async function main() {
  console.log("Seeding reserved usernames...");

  for (const entry of RESERVED_USERNAMES) {
    await prisma.reservedUsername.upsert({
      where: { username: entry.username },
      update: {},
      create: entry,
    });
  }

  console.log(`✓ Seeded ${RESERVED_USERNAMES.length} reserved usernames`);

  // ── Demo user ──────────────────────────────
  console.log("Seeding demo user and kard...");

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@kard.io" },
    update: { name: "Mayank" },
    create: {
      email: "demo@kard.io",
      name: "Mayank",
      plan: "PRO",
    },
  });

  await prisma.verification.upsert({
    where: { userId: demoUser.id },
    update: { level: 3, linkedinVerified: true, githubVerified: true, googleVerified: true },
    create: {
      userId: demoUser.id,
      level: 3,
      linkedinVerified: true,
      githubVerified: true,
      googleVerified: true,
    },
  });

  const demoKard = await prisma.kard.upsert({
    where: { username: "demo" },
    update: {
      firstName: "Mayank",
      lastName: "",
      headline: "Software Engineer",
      bio: "Building the future of digital identity.",
      company: "Kard",
      theme: "DARK",
      mode: "PROFESSIONAL",
      email: "mayank@kard.io",
      location: "India",
    },
    create: {
      userId: demoUser.id,
      username: "demo",
      shortCode: "DEMO",
      firstName: "Mayank",
      lastName: "",
      headline: "Software Engineer",
      bio: "Building the future of digital identity.",
      company: "Kard",
      theme: "DARK",
      mode: "PROFESSIONAL",
      email: "mayank@kard.io",
      location: "India",
    },
  });

  // Recreate links cleanly
  await prisma.kardLink.deleteMany({ where: { kardId: demoKard.id } });
  await prisma.kardLink.createMany({
    data: [
      { kardId: demoKard.id, type: "GITHUB", label: "GitHub", url: "https://github.com", verified: true, order: 1 },
      { kardId: demoKard.id, type: "LINKEDIN", label: "LinkedIn", url: "https://linkedin.com", verified: true, order: 2 },
      { kardId: demoKard.id, type: "TWITTER", label: "Twitter", url: "https://x.com", verified: true, order: 3 },
    ],
  });

  // Ensure analytics row exists for demo kard
  await prisma.kardAnalytics.upsert({
    where: { kardId: demoKard.id },
    update: {},
    create: { kardId: demoKard.id, totalViews: 0 },
  });

  console.log("✓ Demo user, verification, kard, links and analytics seeded.");
  console.log("\nDone! Run npm run dev to start.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
