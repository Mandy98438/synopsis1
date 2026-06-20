// ─────────────────────────────────────────────
// KARD — Email Utilities (Resend)
// Transactional emails only
// ─────────────────────────────────────────────

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key_for_local_dev");
const FROM = process.env.RESEND_FROM_EMAIL ?? "noreply@kard.io";

// ── Verification email ────────────────────────
export async function sendVerificationEmail({
  to,
  url,
}: {
  to: string;
  url: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log("\n=============================================");
    console.log(`[MOCK EMAIL] Verification to: ${to}`);
    console.log(`[MOCK EMAIL] Click here to verify: ${url}`);
    console.log("=============================================\n");
    return;
  }
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Verify your Kard account",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:32px">
          <span style="font-size:20px;font-weight:500;letter-spacing:0.08em">kard</span>
        </div>
        <h1 style="font-size:24px;font-weight:500;margin-bottom:8px;color:#111">
          Verify your email
        </h1>
        <p style="color:#666;margin-bottom:24px;line-height:1.6">
          Click the button below to verify your email and activate your Kard account.
          This link expires in 24 hours.
        </p>
        <a href="${url}"
           style="display:inline-block;background:#E07020;color:#fff;padding:12px 24px;
                  border-radius:8px;text-decoration:none;font-weight:500;font-size:14px">
          Verify email
        </a>
        <p style="color:#aaa;font-size:12px;margin-top:32px">
          If you didn't create a Kard account, you can ignore this email.
        </p>
      </div>
    `,
  });
}

// ── Abuse report notification ─────────────────
export async function sendAbuseReportNotification({
  kardUsername,
  reason,
  reportId,
}: {
  kardUsername: string;
  reason: string;
  reportId: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[MOCK EMAIL] Abuse report notification for kard.io/${kardUsername} (Reason: ${reason})`);
    return;
  }
  await resend.emails.send({
    from: FROM,
    to: "reports@kard.io",
    subject: `[Report] Card reported: ${kardUsername}`,
    html: `
      <p><strong>Card:</strong> kard.io/${kardUsername}</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p><strong>Report ID:</strong> ${reportId}</p>
    `,
  });
}
