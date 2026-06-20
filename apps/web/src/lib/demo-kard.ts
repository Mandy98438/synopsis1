// ─────────────────────────────────────────────
// KARD — Demo Kard
// Static demo card — no DB call needed
// Shown at kard.io/demo
// ─────────────────────────────────────────────

export function isDemoUsername(username: string): boolean {
  return username === "demo";
}

export function getDemoKard() {
  return {
    id: "demo",
    username: "demo",
    shortCode: "DEMO",
    firstName: "Mayank",
    lastName: "",
    headline: "Software Engineer",
    bio: "Building the future of digital identity.",
    company: "Kard",
    theme: "DARK" as const,
    mode: "PROFESSIONAL" as const,
    avatarUrl: null,
    email: "mayank@kard.io",
    phone: null,
    location: "India",
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "demo",
    links: [
      { id: "demo-1", kardId: "demo", type: "GITHUB", label: "GitHub", url: "https://github.com", verified: true, order: 1, createdAt: new Date() },
      { id: "demo-2", kardId: "demo", type: "LINKEDIN", label: "LinkedIn", url: "https://linkedin.com", verified: true, order: 2, createdAt: new Date() },
      { id: "demo-3", kardId: "demo", type: "TWITTER", label: "Twitter", url: "https://x.com", verified: true, order: 3, createdAt: new Date() },
    ],
    user: {
      id: "demo",
      name: "Mayank",
      email: "mayank@kard.io",
      plan: "PRO",
      verification: {
        id: "demo-v",
        userId: "demo",
        level: 3,
        linkedinVerified: true,
        githubVerified: true,
        googleVerified: true,
        twitterVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  };
}
