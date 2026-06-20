// ─────────────────────────────────────────────
// KARD — Auth Configuration (NextAuth v4)
// LinkedIn, GitHub, Google, Twitter OAuth
// Email verification built in
// ─────────────────────────────────────────────

import { type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import LinkedInProvider from "next-auth/providers/linkedin";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify",
    error: "/auth/error",
    newUser: "/onboarding",
  },
  providers: [
    // ── Email (primary signup method) ──────────
    EmailProvider({
      from: process.env.RESEND_FROM_EMAIL,
      sendVerificationRequest: async ({ identifier, url }) => {
        await sendVerificationEmail({ to: identifier, url });
      },
    }),

    // ── LinkedIn (primary verification) ────────
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      authorization: {
        params: { scope: "openid profile email" },
      },
    }),

    // ── GitHub ──────────────────────────────────
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),

    // ── Google ──────────────────────────────────
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ── Twitter / X ─────────────────────────────
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0",
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.plan = (user as any).plan ?? "FREE";
      }
      // When a new OAuth account is connected, mark as verified
      if (account?.provider && user?.id) {
        await updateVerification(user.id, account.provider);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).plan = token.plan as string;
      }
      return session;
    },
    async signIn({ user, account }) {
      // Block sign-in if email is not verified for email provider
      if (account?.provider === "email") {
        return true; // NextAuth handles this
      }
      // Always allow OAuth sign-ins
      return true;
    },
  },
  events: {
    async createUser({ user }) {
      // Create verification record for new user
      await prisma.verification.create({
        data: { userId: user.id!, level: 0 },
      });
    },
    async linkAccount({ user, account }) {
      // Update verification when account is linked
      await updateVerification(user.id!, account.provider);
    },
  },
};

// ── Helpers ───────────────────────────────────
async function updateVerification(userId: string, provider: string) {
  const update: Record<string, boolean> = {};

  if (provider === "linkedin") update.linkedinVerified = true;
  if (provider === "github") update.githubVerified = true;
  if (provider === "google") update.googleVerified = true;
  if (provider === "twitter") update.twitterVerified = true;

  if (Object.keys(update).length === 0) return;

  const verification = await prisma.verification.upsert({
    where: { userId },
    update,
    create: { userId, ...update },
  });

  // Calculate level
  const verified = [
    verification.linkedinVerified,
    verification.githubVerified,
    verification.googleVerified,
    verification.twitterVerified,
  ].filter(Boolean).length;

  const level = verified === 0 ? 0 : verified === 1 ? 1 : verified >= 2 ? (verification.linkedinVerified ? 3 : 2) : 1;

  await prisma.verification.update({
    where: { userId },
    data: { level },
  });
}
