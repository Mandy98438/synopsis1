const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  PageBreak, LevelFormat, ExternalHyperlink
} = require("docx");
const fs = require("fs");

const ORANGE = "E07020";
const BLACK = "111111";
const GRAY = "666666";
const LIGHT_GRAY = "F5F5F5";
const BORDER_GRAY = "E0E0E0";

const border = { style: BorderStyle.SINGLE, size: 1, color: BORDER_GRAY };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text, bold: true, size: 36, color: BLACK, font: "Arial" })],
    spacing: { before: 480, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: ORANGE, space: 4 } },
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, bold: true, size: 28, color: BLACK, font: "Arial" })],
    spacing: { before: 360, after: 160 },
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun({ text, bold: true, size: 24, color: ORANGE, font: "Arial" })],
    spacing: { before: 280, after: 120 },
  });
}

function p(text, options = {}) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22, color: options.color ?? BLACK, font: "Arial", ...options })],
    spacing: { before: 80, after: 80 },
    ...(options.indent && { indent: { left: 720 } }),
  });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    children: [new TextRun({ text, size: 22, color: BLACK, font: "Arial" })],
    spacing: { before: 60, after: 60 },
  });
}

function callout(text, color = LIGHT_GRAY) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({
      children: [new TableCell({
        borders,
        width: { size: 9360, type: WidthType.DXA },
        shading: { fill: color, type: ShadingType.CLEAR },
        margins: { top: 160, bottom: 160, left: 240, right: 240 },
        children: [new Paragraph({
          children: [new TextRun({ text, size: 21, color: "333333", font: "Arial", italics: true })],
        })],
      })],
    })],
    margins: { top: 200, bottom: 200 },
  });
}

function twoColTable(rows) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [3120, 6240],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders,
            width: { size: 3120, type: WidthType.DXA },
            shading: { fill: "F0F0F0", type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 160, right: 160 },
            children: [new Paragraph({ children: [new TextRun({ text: "Category", bold: true, size: 20, font: "Arial" })] })],
          }),
          new TableCell({
            borders,
            width: { size: 6240, type: WidthType.DXA },
            shading: { fill: "F0F0F0", type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 160, right: 160 },
            children: [new Paragraph({ children: [new TextRun({ text: "Detail", bold: true, size: 20, font: "Arial" })] })],
          }),
        ],
      }),
      ...rows.map(([left, right]) => new TableRow({
        children: [
          new TableCell({
            borders,
            width: { size: 3120, type: WidthType.DXA },
            margins: { top: 100, bottom: 100, left: 160, right: 160 },
            children: [new Paragraph({ children: [new TextRun({ text: left, bold: true, size: 20, font: "Arial", color: ORANGE })] })],
          }),
          new TableCell({
            borders,
            width: { size: 6240, type: WidthType.DXA },
            margins: { top: 100, bottom: 100, left: 160, right: 160 },
            children: [new Paragraph({ children: [new TextRun({ text: right, size: 20, font: "Arial" })] })],
          }),
        ],
      })),
    ],
  });
}

function spacer() {
  return new Paragraph({ children: [new TextRun("")], spacing: { before: 120, after: 120 } });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

const doc = new Document({
  numbering: {
    config: [{
      reference: "bullets",
      levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
    }],
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: BLACK }, paragraph: { spacing: { before: 480, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: BLACK }, paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: ORANGE }, paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 2 } },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    children: [

      // ── COVER ──────────────────────────────────────────────────────────
      new Paragraph({
        children: [new TextRun({ text: "KARD", bold: true, size: 96, color: BLACK, font: "Arial" })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 1440, after: 240 },
      }),
      new Paragraph({
        children: [new TextRun({ text: "One card. Every connection.", size: 36, color: ORANGE, font: "Arial", italics: true })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 480 },
      }),
      new Paragraph({
        children: [new TextRun({ text: "Product Design & Engineering Document", size: 24, color: GRAY, font: "Arial" })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 160 },
      }),
      new Paragraph({
        children: [new TextRun({ text: "Version 1.0  ·  Confidential", size: 22, color: GRAY, font: "Arial" })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 1440 },
      }),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [9360],
        rows: [new TableRow({ children: [new TableCell({
          borders: { top: border, bottom: border, left: noBorder, right: noBorder },
          width: { size: 9360, type: WidthType.DXA },
          shading: { fill: "FFFFFF", type: ShadingType.CLEAR },
          margins: { top: 240, bottom: 240, left: 0, right: 0 },
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "Digital identity cards for the real world", size: 26, color: GRAY, font: "Arial", italics: true })],
          })],
        })] })],
      }),

      pageBreak(),

      // ── SECTION 1: ORIGIN ──────────────────────────────────────────────
      h1("1. The Origin — How This Idea Was Born"),
      p("This document captures the full journey of Kard — from a rough idea shared in a conversation to a production-ready architecture. Everything in here is real: the thinking, the pivots, the decisions made and the ones ruled out."),
      spacer(),
      h2("The Initial Idea"),
      p("The concept started simply: what if there was a single digital card that held everything about a person — their name, their job, their social profiles — and could be shared with anyone, instantly?"),
      p("The original framing was a visitors card or identity card, something that works like a digital ID card for everywhere. Not just for one context, but for all contexts — professional networking, personal introductions, creative portfolios, and everything in between."),
      spacer(),
      callout("\"Think of it as an ID card for everywhere. You just need one card, one link, and you have everything of theirs. You're connected from every angle.\""),
      spacer(),
      h2("The Core Problem Being Solved"),
      p("Today when you meet someone, the exchange is fragmented:"),
      bullet("LinkedIn profile shared on one platform"),
      bullet("Business card that goes out of date"),
      bullet("Instagram handle remembered wrong"),
      bullet("Email typed incorrectly"),
      bullet("GitHub link sent separately"),
      p("Kard collapses all of this into one thing. One card. One URL. One QR code. Everything the person has chosen to share, available instantly, always up to date."),

      pageBreak(),

      // ── SECTION 2: PRODUCT DECISIONS ──────────────────────────────────
      h1("2. Product Decisions — What We Took and What We Left"),

      h2("Target Audience"),
      p("From the start, the decision was to target everyone — not just professionals, not just students. The product needed to serve:"),
      bullet("Professionals and networkers replacing business cards"),
      bullet("Students and freshers making first impressions"),
      bullet("Creators and freelancers sharing their work"),
      bullet("Anyone who meets people and wants a clean way to share who they are"),

      spacer(),
      h2("Card Modes — The Privacy Layer"),
      p("One of the most important early decisions was introducing three card modes. The insight was that the same person shows different versions of themselves in different contexts:"),
      spacer(),
      twoColTable([
        ["Minimal", "Name + one chosen link. Maximum privacy. For casual encounters."],
        ["Professional", "Work info, professional links. LinkedIn, GitHub, email. For networking."],
        ["Personal", "Full identity. All links, contact info, bio. For people you actually know."],
      ]),
      spacer(),
      p("Each mode has its own URL. Sharing kard.io/john gives the professional card by default. kard.io/john/personal reveals more. This lets users be deliberate about context."),

      spacer(),
      h2("In-Person First — A Deliberate Constraint"),
      p("A critical product decision: Kard v1 is in-person only. No search, no discovery, no online browsing of other people's cards. Every connection must be a deliberate, physical-world act:"),
      bullet("Scan the QR code"),
      bullet("Enter the short code (KRD-XXXX)"),
      bullet("Tap the NFC tag (future)"),
      spacer(),
      callout("This prevents spam, makes every connection intentional, protects privacy, and makes the card feel premium — like handing someone your business card. It's a moment, not a mass broadcast."),
      spacer(),
      p("Teams are an exception — companies already know who their employees are, so online directory-style connection makes sense there. This is a v3 feature."),

      spacer(),
      h2("Zero Tracking — A Brand Decision"),
      p("The original architecture included viewer analytics — location, referrer, device data. This was removed entirely. Kard collects zero data about viewers."),
      p("The reasoning: this is a trust product. The moment someone suspects they're being tracked when they open a card, the trust is broken. And GDPR compliance for viewer data adds unnecessary complexity."),
      p("Instead, analytics are owner-only and completely anonymous:"),
      bullet("Total view count (server-side counter, no cookies)"),
      bullet("Link click counts (no personal data)"),
      bullet("Referrer source (anonymised)"),
      spacer(),
      callout("\"This page collects no personal data about you.\" — This one line, shown at the bottom of every public card, becomes Kard's strongest trust signal."),

      pageBreak(),

      // ── SECTION 3: VERIFICATION ────────────────────────────────────────
      h1("3. Verification System — How We Solved Impersonation"),

      h2("The Problem"),
      p("Any open digital identity system faces the same problem: nothing stops someone from creating a card pretending to be Elon Musk, your company's CEO, or your colleague. Without a verification layer, the product can't be trusted."),

      h2("The Solution: OAuth-Based Verification"),
      p("Instead of Kard verifying users manually (slow, doesn't scale), we delegate trust to platforms the user is already trusted on. LinkedIn, GitHub, Google, and Twitter all use OAuth — when a user connects an account, the platform cryptographically confirms ownership."),
      spacer(),
      twoColTable([
        ["Level 0", "Unverified. No connected accounts. Self-reported info only."],
        ["Level 1", "One OAuth account connected. Low bar but better than nothing."],
        ["Level 2", "LinkedIn + one more platform. Hard to fake at this level."],
        ["Level 3", "LinkedIn + two more platforms. Gold badge. Extremely trustworthy."],
      ]),
      spacer(),
      p("LinkedIn is the primary anchor because it's the only major platform where real names are socially enforced, work history is attached, and account age/connections signal legitimacy. It's globally accepted as professional identity."),

      spacer(),
      h2("Verification-First Onboarding"),
      p("Verification is built into the onboarding flow, not hidden in settings:"),
      bullet("Signup"),
      bullet("Email verification"),
      bullet("LinkedIn connect prompt (full screen, unavoidable — can be skipped but must be seen)"),
      bullet("Card builder"),
      spacer(),
      callout("This turns spam prevention into a growth mechanic. By the time someone shares their Kard, the vast majority of cards in the wild are already verified — which protects the platform's reputation from day one."),

      spacer(),
      h2("Additional Safeguards"),
      bullet("Reserved usernames: brands, public figures, internal routes seeded before launch"),
      bullet("Rate limiting: max 3 cards per account on free tier, hard cap on creation speed"),
      bullet("Email verification: no card goes live until email is confirmed"),
      bullet("Report button: on every public card, routes to a manual review queue"),

      pageBreak(),

      // ── SECTION 4: NAME & DESIGN ───────────────────────────────────────
      h1("4. Name & Design Identity"),

      h2("The Name: Kard"),
      p("Several names were considered during the process:"),
      spacer(),
      twoColTable([
        ["Nexcard", "Original concept name. Rejected — 'nex' prefix is overused in tech, feels generic."],
        ["Helo", "Warm, first-impression feel. Strong contender."],
        ["Tapa", "Tap + connect. Short and memorable."],
        ["Cardly", "Clean and obvious. Too generic."],
        ["Kard", "Selected. Dead simple, instantly understood, K makes it distinctive and ownable."],
      ]),
      spacer(),
      p("Kard wins because it's the word you already know, spelled in a way that's ownable as a brand. No explanation needed. Every language on earth recognises it."),

      spacer(),
      h2("Logo"),
      p("The logo is a layered triangle — two overlapping triangles with horizontal stripe cuts through the top one. Geometric, structured, architectural. It conveys layers of identity, precision, and permanence."),
      p("The mark adapts to each card theme: white on dark backgrounds, dark on light backgrounds. The word 'kard' in lowercase sits alongside it with generous letter-spacing."),

      spacer(),
      h2("Design System"),
      spacer(),
      twoColTable([
        ["Primary color", "#E07020 — orange. Used as the accent bar on every card, primary buttons, and brand touchpoints."],
        ["Dark theme", "#141414 background, #F0F0F0 text, #1c1c1c photo area."],
        ["Light theme", "#FAF6EF background (warm off-white), #111 text, #E8E0D4 photo area."],
        ["Typography", "System sans-serif. Clean, legible, no web font dependency for fast loads."],
        ["Border radius", "22px cards, 12px photo areas, 8px inputs — generous curves throughout."],
        ["Accent bar", "4px orange stripe at top of every card. The one consistent brand element."],
      ]),
      spacer(),
      h2("Card Layout"),
      p("The card is deliberately designed to feel like a physical ID card rendered digitally. Key layout decisions:"),
      bullet("Photo takes the top half — it's the hero, not a thumbnail"),
      bullet("Logo and org tag float over the photo as an overlay"),
      bullet("Name is the largest text element below the photo"),
      bullet("Links as labeled pills rather than icon-only"),
      bullet("Barcode + KRD code at the bottom — functional, not decorative"),
      bullet("Verified badge sits quietly under the links"),

      pageBreak(),

      // ── SECTION 5: TECH STACK ──────────────────────────────────────────
      h1("5. Tech Stack — Built for Scale from Day One"),

      h2("The Philosophy"),
      p("The stack is chosen to get to market fast without rewriting anything at 100,000 users. Every technology chosen is production-proven, has a strong ecosystem, and is maintained by teams with strong track records."),

      spacer(),
      h2("Full Stack Breakdown"),
      spacer(),
      twoColTable([
        ["Frontend", "Next.js 14 with App Router. Server-side rendering for public card pages — instant load times, SEO-ready."],
        ["Styling", "Tailwind CSS. Utility-first, fast to build, scales cleanly."],
        ["Language", "TypeScript end to end. Frontend, backend, database queries, API contracts — everything typed."],
        ["API layer", "tRPC. Type-safe API calls with no code generation. Frontend and backend share types automatically."],
        ["Database", "PostgreSQL via Supabase. Battle-tested, relational, handles millions of rows easily."],
        ["ORM", "Prisma. Schema-as-code, type-safe queries, version-controlled migrations."],
        ["Auth", "NextAuth (Auth.js). LinkedIn, GitHub, Google, Twitter OAuth. Email verification built in."],
        ["File storage", "Cloudinary. Profile photos — automatic compression, CDN delivery globally."],
        ["Email", "Resend. Transactional emails — verification, abuse reports. Simple API, great deliverability."],
        ["Caching", "Upstash Redis. Serverless, edge-compatible. Used for rate limiting and card page caching."],
        ["Security", "Arcjet. Bot detection, rate limiting, shield (SQLi/XSS protection) — all in one SDK."],
        ["Monorepo", "Turborepo. Frontend, backend, shared types in one repo. Builds independently, scales cleanly."],
        ["Hosting", "Vercel. Zero-config Next.js deployment. Global CDN. Scales automatically."],
        ["QR codes", "qrcode npm package. Client-side, no external API, free."],
        ["Payments (future)", "Razorpay (India) + Stripe (international). Added when Pro tier launches."],
      ]),

      spacer(),
      h2("Big League Additions (Phase 2+)"),
      bullet("Edge Functions via Vercel Edge — card pages served from the nearest region globally. Sub-100ms loads."),
      bullet("React Native + Expo — native mobile app for the core in-person scanning experience."),
      bullet("Zod everywhere — runtime validation on every input, no corrupted data ever reaches the database."),
      bullet("Anthropic Claude API — bio writer in v2, smart card suggestions in v3."),
      bullet("Ably/Pusher — real-time view count updates on dashboard in v3."),

      pageBreak(),

      // ── SECTION 6: REPO STRUCTURE ──────────────────────────────────────
      h1("6. Repository Structure"),

      h2("Monorepo Layout (Turborepo)"),
      spacer(),
      callout(
        "kard/\n" +
        "├── apps/\n" +
        "│   └── web/                    Next.js app\n" +
        "│       ├── prisma/             Database schema + seed\n" +
        "│       ├── src/\n" +
        "│       │   ├── app/            Next.js App Router pages\n" +
        "│       │   │   ├── [username]/ Public card viewer page\n" +
        "│       │   │   ├── k/[code]/   Short code redirect\n" +
        "│       │   │   ├── dashboard/  Card builder dashboard\n" +
        "│       │   │   ├── onboarding/ Post-signup flow\n" +
        "│       │   │   ├── auth/       Auth pages\n" +
        "│       │   │   └── api/        API routes (tRPC, QR, auth)\n" +
        "│       │   ├── components/     UI components\n" +
        "│       │   ├── lib/            Core utilities (db, auth, email)\n" +
        "│       │   ├── server/         tRPC router\n" +
        "│       │   └── middleware.ts   Arcjet security middleware\n" +
        "│       └── next.config.js\n" +
        "├── packages/\n" +
        "│   └── types/                  Shared TypeScript types\n" +
        "├── turbo.json\n" +
        "├── package.json\n" +
        "├── tsconfig.json\n" +
        "├── .env.example\n" +
        "└── .gitignore"
      ),

      spacer(),
      h2("Key Files & Their Roles"),
      spacer(),
      twoColTable([
        ["prisma/schema.prisma", "Full database schema. Every table, relation, and enum defined here."],
        ["src/lib/auth.ts", "NextAuth config with all OAuth providers and verification logic."],
        ["src/lib/db.ts", "Prisma singleton. Prevents multiple DB connections in development."],
        ["src/lib/validations.ts", "Zod schemas. Every input validated before touching the database."],
        ["src/lib/utils.ts", "Short code generation, URL helpers, class name utilities."],
        ["src/lib/email.ts", "Transactional email templates via Resend."],
        ["src/server/router.ts", "tRPC router with all API procedures."],
        ["src/middleware.ts", "Arcjet security middleware applied to all API routes."],
        ["src/app/[username]/page.tsx", "Public card viewer — what people see when they scan a QR."],
        ["src/app/dashboard/page.tsx", "Card builder dashboard for authenticated users."],
        ["src/app/onboarding/page.tsx", "Post-signup flow with LinkedIn verification prompt."],
        ["src/app/api/qr/[username]/route.ts", "QR code generation endpoint."],
        ["src/app/k/[code]/page.tsx", "Short code redirect (KRD-XXXX → /username)."],
        ["prisma/seed.ts", "Reserved username seeding. Run before launch."],
        [".env.example", "All environment variables documented. Never commit .env.local."],
      ]),

      pageBreak(),

      // ── SECTION 7: SECURITY ────────────────────────────────────────────
      h1("7. Security Architecture"),

      h2("Security from Day One"),
      p("Security is not an afterthought on Kard. Every layer of the stack has security built in:"),
      spacer(),
      twoColTable([
        ["Arcjet Shield", "Blocks SQL injection, XSS, path traversal on every API request."],
        ["Bot detection", "Automated card creation blocked. Search engine crawlers allowed."],
        ["Rate limiting", "Per-user on authenticated routes. Per-IP on public routes."],
        ["Card creation limit", "3 creates per hour per user. Free tier max 2 cards total."],
        ["Email verification", "No card goes live without verified email."],
        ["Username reservation", "Brands and internal routes reserved before launch."],
        ["Report system", "Every public card has a report button. Manual review queue."],
        ["HTTP security headers", "X-Frame-Options, CSP, X-Content-Type-Options set in next.config.js."],
        ["Zero viewer tracking", "No cookies, no fingerprinting, no personal data on viewers."],
        ["Env variables", ".env.example documents all secrets. .gitignore prevents commits."],
        ["Cascade deletes", "Prisma schema uses onDelete: Cascade — no orphaned data."],
        ["Input validation", "Zod validates every input before it touches the database."],
      ]),

      pageBreak(),

      // ── SECTION 8: ROADMAP ─────────────────────────────────────────────
      h1("8. Product Roadmap"),

      h2("Version 1 — Foundation (Current)"),
      bullet("Card creation with three modes"),
      bullet("Photo upload via Cloudinary"),
      bullet("LinkedIn OAuth verification"),
      bullet("QR code + KRD short code generation"),
      bullet("Email verification on signup"),
      bullet("Report button on all public cards"),
      bullet("Owner-only analytics (views + link clicks)"),
      bullet("Dark and light card themes"),
      bullet("Reserved username protection"),
      bullet("In-person sharing only"),

      spacer(),
      h2("Version 2 — Polish"),
      bullet("Bio writer (Claude API — one call, fills bio from name + role)"),
      bullet("GitHub and Google OAuth verification"),
      bullet("Real-time view count on dashboard"),
      bullet("Card theme customisation beyond dark/light"),
      bullet("Multiple cards per user"),
      bullet("Pro tier launch (Razorpay + Stripe)"),

      spacer(),
      h2("Version 3 — Expand"),
      bullet("Teams and company cards"),
      bullet("Online connection for teams (directory mode)"),
      bullet("Smart card mode selector (context-aware)"),
      bullet("Mobile app (React Native + Expo)"),
      bullet("Edge delivery for card pages (Vercel Edge Functions)"),
      bullet("Full B2B product with HR system integration"),

      spacer(),
      h2("Version 4+"),
      bullet("NFC physical card (tap to share)"),
      bullet("Public API for third-party integrations"),
      bullet("Enterprise SSO and admin controls"),
      bullet("Custom domains (john.me pointing to Kard)"),

      pageBreak(),

      // ── SECTION 9: GETTING STARTED ─────────────────────────────────────
      h1("9. Getting Started — Running the Project"),

      h2("Prerequisites"),
      bullet("Node.js 18 or higher"),
      bullet("npm 9 or higher"),
      bullet("PostgreSQL database (Supabase recommended)"),
      bullet("Accounts: Cloudinary, Resend, Upstash, Arcjet"),
      bullet("OAuth apps: LinkedIn, GitHub, Google, Twitter"),

      spacer(),
      h2("Setup Steps"),
      spacer(),
      callout(
        "1. Clone the repo\n" +
        "   git clone https://github.com/yourusername/kard\n" +
        "   cd kard\n\n" +
        "2. Install dependencies\n" +
        "   npm install\n\n" +
        "3. Set up environment\n" +
        "   cp .env.example apps/web/.env.local\n" +
        "   # Fill in all values\n\n" +
        "4. Push database schema\n" +
        "   cd apps/web\n" +
        "   npm run db:push\n\n" +
        "5. Seed reserved usernames\n" +
        "   npm run db:seed\n\n" +
        "6. Start development\n" +
        "   cd ../..\n" +
        "   npm run dev"
      ),

      spacer(),
      h2("Environment Variables Required for v1"),
      bullet("DATABASE_URL — Supabase PostgreSQL connection string"),
      bullet("NEXTAUTH_SECRET — generate with: openssl rand -base64 32"),
      bullet("LINKEDIN_CLIENT_ID + SECRET — from LinkedIn Developer Portal"),
      bullet("CLOUDINARY_* — from Cloudinary dashboard"),
      bullet("RESEND_API_KEY — from Resend dashboard"),
      bullet("UPSTASH_REDIS_* — from Upstash console"),
      bullet("ARCJET_KEY — from Arcjet dashboard"),

      spacer(),
      h2("Before Going Live"),
      bullet("Run db:seed to reserve all brand usernames"),
      bullet("Set NEXTAUTH_URL to your production domain"),
      bullet("Configure all OAuth redirect URIs to production domain"),
      bullet("Set up reports@kard.io email to receive abuse reports"),
      bullet("Test the report flow end to end"),
      bullet("Verify Arcjet Shield is in LIVE mode (not DRY_RUN)"),

      pageBreak(),

      // ── CLOSING ────────────────────────────────────────────────────────
      new Paragraph({
        children: [new TextRun({ text: "Built with intent. Shipped with care.", size: 28, color: ORANGE, font: "Arial", italics: true })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 480, after: 160 },
      }),
      new Paragraph({
        children: [new TextRun({ text: "kard.io", size: 24, color: GRAY, font: "Arial" })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 0 },
      }),
    ],
  }],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("/mnt/user-data/outputs/Kard_Product_Document.docx", buffer);
  console.log("Done: Kard_Product_Document.docx");
});
