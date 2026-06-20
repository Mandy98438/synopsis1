// ─────────────────────────────────────────────
// KARD — Phase 10: Privacy Policy Page
// Route: /privacy
// ─────────────────────────────────────────────

import { type Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy · KARD",
  description: "How KARD collects, uses, and protects your data.",
};

const LAST_UPDATED = "June 2026";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-[#555] hover:text-white transition-colors mb-12"
        >
          ← Back
        </Link>

        <div className="mb-10">
          <p className="text-[11px] text-[#E07020] uppercase tracking-widest font-medium mb-3">
            Legal
          </p>
          <h1 className="text-2xl font-semibold text-white mb-2">
            Privacy Policy
          </h1>
          <p className="text-xs text-[#555]">Last updated {LAST_UPDATED}</p>
        </div>

        <div className="prose prose-sm prose-invert max-w-none space-y-8 text-[#888] leading-relaxed">
          <Section title="1. What we collect">
            <p>When you use KARD, we collect:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>
                <strong className="text-white">Account info</strong> — email
                address, name, and OAuth profile data when you sign in
              </li>
              <li>
                <strong className="text-white">Card content</strong> — what
                you add to your Kard (name, headline, links, photo)
              </li>
              <li>
                <strong className="text-white">Analytics</strong> — anonymous
                view counts and link click counts on your card. We do not
                store visitor IP addresses or personal data.
              </li>
              <li>
                <strong className="text-white">Usage data</strong> — standard
                server logs for debugging and abuse prevention
              </li>
            </ul>
          </Section>

          <Section title="2. What we do not collect">
            <ul className="list-disc pl-5 space-y-1">
              <li>We do not sell your data to advertisers</li>
              <li>We do not build advertising profiles</li>
              <li>We do not track visitors to your card beyond anonymous counts</li>
              <li>We do not share your data with third parties except as described below</li>
            </ul>
          </Section>

          <Section title="3. How we use your data">
            <p>We use your data to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Display your public Kard to visitors</li>
              <li>Send transactional emails (sign-in links, notifications)</li>
              <li>Show you analytics on your own card</li>
              <li>Prevent abuse and enforce our terms</li>
            </ul>
          </Section>

          <Section title="4. Third-party services">
            <p>We use the following sub-processors:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>
                <strong className="text-white">Supabase</strong> — database
                hosting (EU/US)
              </li>
              <li>
                <strong className="text-white">Cloudinary</strong> — photo
                storage and delivery
              </li>
              <li>
                <strong className="text-white">Resend</strong> — transactional
                email delivery
              </li>
              <li>
                <strong className="text-white">Upstash</strong> — rate limiting
                cache (no personal data stored)
              </li>
              <li>
                <strong className="text-white">Vercel</strong> — hosting and
                edge delivery
              </li>
            </ul>
            <p className="mt-3">
              OAuth providers (LinkedIn, GitHub, Google, Twitter) receive only
              the data necessary to verify your identity. We store only your
              verified status, not your full OAuth token.
            </p>
          </Section>

          <Section title="5. Your rights">
            <p>You can at any time:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Edit or delete your Kard from your dashboard</li>
              <li>Delete your account and all associated data from settings</li>
              <li>Request an export of your data by emailing us</li>
            </ul>
          </Section>

          <Section title="6. Cookies">
            <p>
              We use session cookies only for authentication. We do not use
              advertising or tracking cookies.
            </p>
          </Section>

          <Section title="7. Data retention">
            <p>
              We retain your data for as long as your account is active. When
              you delete your account, your data is permanently removed within
              30 days.
            </p>
          </Section>

          <Section title="8. Security">
            <p>
              We use industry-standard encryption in transit (TLS) and at rest.
              OAuth tokens are never stored. Passwords are not used — we use
              magic links and OAuth only.
            </p>
          </Section>

          <Section title="9. Contact">
            <p>
              For privacy questions or data requests, email{" "}
              <a
                href="mailto:privacy@kard.io"
                className="text-[#E07020] hover:underline"
              >
                privacy@kard.io
              </a>
            </p>
          </Section>
        </div>

        <div className="mt-12 pt-8 border-t border-[#1a1a1a] flex gap-4 text-xs text-[#444]">
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
          <Link href="/" className="hover:text-white transition-colors">
            Back to KARD
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-white mb-3">{title}</h2>
      {children}
    </div>
  );
}
