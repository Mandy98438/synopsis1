// ─────────────────────────────────────────────
// KARD — Phase 10: Terms of Service Page
// Route: /terms
// ─────────────────────────────────────────────

import { type Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service · KARD",
  description: "KARD terms of service and usage policy.",
};

const LAST_UPDATED = "June 2026";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Back */}
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
            Terms of Service
          </h1>
          <p className="text-xs text-[#555]">Last updated {LAST_UPDATED}</p>
        </div>

        <div className="prose prose-sm prose-invert max-w-none space-y-8 text-[#888] leading-relaxed">
          <Section title="1. Acceptance">
            <p>
              By creating an account or using KARD, you agree to these terms.
              If you do not agree, do not use the service.
            </p>
          </Section>

          <Section title="2. Your account">
            <p>
              You are responsible for keeping your account credentials secure.
              You may not share, sell, or transfer your account. You must be at
              least 13 years old to use KARD.
            </p>
          </Section>

          <Section title="3. Acceptable use">
            <p>You agree not to use KARD to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Impersonate another person or entity</li>
              <li>Post false, misleading, or fraudulent information</li>
              <li>Distribute spam or unsolicited messages</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Attempt to reverse-engineer or compromise the platform</li>
            </ul>
          </Section>

          <Section title="4. Your content">
            <p>
              You own your content. By uploading it to KARD, you grant us a
              limited licence to display it on your public card. We do not
              sell your content to third parties.
            </p>
          </Section>

          <Section title="5. Free and Pro plans">
            <p>
              Free accounts may create up to 2 Kards. Pro accounts have
              higher limits and additional features. We reserve the right to
              change plan features with reasonable notice.
            </p>
          </Section>

          <Section title="6. Termination">
            <p>
              We may suspend or terminate accounts that violate these terms.
              You may delete your account at any time from your settings.
            </p>
          </Section>

          <Section title="7. Disclaimers">
            <p>
              KARD is provided &ldquo;as is&rdquo; without warranties of any kind. We do
              not guarantee uptime or that the service will be error-free.
            </p>
          </Section>

          <Section title="8. Limitation of liability">
            <p>
              To the maximum extent permitted by law, KARD shall not be liable
              for any indirect, incidental, or consequential damages arising
              from your use of the service.
            </p>
          </Section>

          <Section title="9. Changes">
            <p>
              We may update these terms. Continued use after changes
              constitutes acceptance of the updated terms.
            </p>
          </Section>

          <Section title="10. Contact">
            <p>
              Questions? Email us at{" "}
              <a
                href="mailto:legal@kard.io"
                className="text-[#E07020] hover:underline"
              >
                legal@kard.io
              </a>
            </p>
          </Section>
        </div>

        <div className="mt-12 pt-8 border-t border-[#1a1a1a] flex gap-4 text-xs text-[#444]">
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
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
