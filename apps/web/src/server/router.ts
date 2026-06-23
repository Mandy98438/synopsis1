// ─────────────────────────────────────────────
// KARD — tRPC Router
// Type-safe API layer end to end
// ─────────────────────────────────────────────

import { initTRPC, TRPCError } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getServerSession } from "next-auth";
import superjson from "superjson";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import {
  createKardSchema,
  updateKardSchema,
  reportKardSchema,
} from "@/lib/validations";
import { generateShortCode } from "@/lib/utils";
import { z } from "zod";
import { sendAbuseReportNotification } from "@/lib/email";

// ── Context ───────────────────────────────────
export async function createContext(opts: CreateNextContextOptions) {
  const session = await getServerSession(opts.req, opts.res, authOptions);
  return { session, prisma, req: opts.req };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

// ── tRPC init ─────────────────────────────────
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

// ── Middleware ────────────────────────────────
const isAuthed = t.middleware(({ ctx, next }) => {
  const user = ctx.session?.user as any;
  if (!user?.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      session: {
        ...ctx.session!,
        user: user as { id: string; name?: string | null; email?: string | null; image?: string | null; plan: string },
      },
    },
  });
});

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);

// ── Routers ───────────────────────────────────

// Card router
const kardRouter = t.router({
  // Get a public card by username (no auth required)
  getByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const kard = await ctx.prisma.kard.findUnique({
        where: { username: input.username, active: true },
        include: {
          links: { orderBy: { order: "asc" } },
          user: { include: { verification: true } },
        },
      });

      if (!kard) throw new TRPCError({ code: "NOT_FOUND" });

      // Increment view count (fire and forget)
      void incrementViewCount(kard.id);

      return kard;
    }),

  // Get card by short code
  getByShortCode: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ ctx, input }) => {
      const kard = await ctx.prisma.kard.findUnique({
        where: { shortCode: input.code, active: true },
        select: { username: true },
      });
      if (!kard) throw new TRPCError({ code: "NOT_FOUND" });
      return kard;
    }),

  // Get all user's cards (auth required)
  myCards: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.kard.findMany({
      where: { userId: ctx.session.user.id },
      include: { links: true },
      orderBy: { createdAt: "desc" },
    });
  }),

  // Create new card
  create: protectedProcedure
    .input(createKardSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Enforce free tier limit (max 2 cards)
      const user = await ctx.prisma.user.findUnique({ where: { id: userId } });
      if (user?.plan === "FREE") {
        const count = await ctx.prisma.kard.count({ where: { userId } });
        if (count >= 2) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Free plan limited to 2 cards. Upgrade to Pro.",
          });
        }
      }

      // Check username availability
      const exists = await ctx.prisma.kard.findUnique({
        where: { username: input.username },
      });
      if (exists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username already taken",
        });
      }

      // Check reserved usernames
      const reserved = await ctx.prisma.reservedUsername.findUnique({
        where: { username: input.username.toLowerCase() },
      });
      if (reserved) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "This username is not available",
        });
      }

      const shortCode = await generateShortCode();
      const { links, ...kardData } = input;

      const { links, username, firstName, lastName, headline, bio, company, email, phone, location, mode, theme } = input;

return ctx.prisma.kard.create({
  data: {
    user: { connect: { id: userId } },
    username,            
    firstName, lastName, headline, bio, company, email, phone, location,
    shortCode,
    mode: mode.toUpperCase() as any,
    theme: theme.toUpperCase() as any,
    links: { create: links.map((link, i) => ({ ... })) },
    analytics: { create: {} },
  },
  include: { links: true },
});

  // Update card
  update: protectedProcedure
    .input(updateKardSchema)
    .mutation(async ({ ctx, input }) => {
      const { kardId, links, ...data } = input;

      // Verify ownership
      const kard = await ctx.prisma.kard.findFirst({
        where: { id: kardId, userId: ctx.session.user.id },
      });
      if (!kard) throw new TRPCError({ code: "NOT_FOUND" });

      return ctx.prisma.kard.update({
        where: { id: kardId },
        data: {
          ...data,
          ...(links && {
            links: {
              deleteMany: {},
              create: links.map((link, i) => ({
                label: link.label as string,
                url: link.url as string,
                type: link.type.toUpperCase() as any,
                order: i,
              })),
            },
          }),
        },
        include: { links: true },
      });
    }),

  // Report a card
  report: publicProcedure
    .input(reportKardSchema)
    .mutation(async ({ ctx, input }) => {
      const kard = await ctx.prisma.kard.findUnique({
        where: { id: input.kardId },
        select: { username: true },
      });

      const report = await ctx.prisma.report.create({
        data: {
          kardId: input.kardId,
          reason: input.reason.toUpperCase() as any,
          details: input.details,
        },
      });

      if (kard) {
        // Send email notification (fire and forget / async)
        sendAbuseReportNotification({
          kardUsername: kard.username,
          reason: input.reason,
          reportId: report.id,
        }).catch((err) => {
          console.error("Failed to send abuse report email:", err);
        });
      }

      return report;
    }),

  // Get analytics (owner only)
  analytics: protectedProcedure
    .input(z.object({ kardId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const kard = await ctx.prisma.kard.findFirst({
        where: { id: input.kardId, userId: ctx.session.user.id },
        include: {
          analytics: {
            include: {
              dailyViews: {
                orderBy: { date: "desc" },
                take: 30,
              },
            },
          },
          links: { include: { analytics: true } },
        },
      });
      if (!kard) throw new TRPCError({ code: "NOT_FOUND" });
      return kard;
    }),

  // Track link click (anonymous, no personal data)
  trackClick: publicProcedure
    .input(z.object({ linkId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.linkAnalytics.upsert({
        where: { linkId: input.linkId },
        update: { totalClicks: { increment: 1 } },
        create: { linkId: input.linkId, totalClicks: 1 },
      });
      return { success: true };
    }),
});

// User router
const userRouter = t.router({
  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      include: { verification: true },
    });
  }),
});

// Root router
export const appRouter = t.router({
  kard: kardRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;

// ── Helpers ───────────────────────────────────
async function incrementViewCount(kardId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Upsert total views and get the analytics record id
  const analytics = await prisma.kardAnalytics.upsert({
    where: { kardId },
    update: { totalViews: { increment: 1 } },
    create: { kardId, totalViews: 1 },
  });

  // Write daily view using analytics.id (not kardId)
  await prisma.dailyView.upsert({
    where: {
      analyticsId_date: {
        analyticsId: analytics.id,
        date: today,
      },
    },
    update: { views: { increment: 1 } },
    create: {
      analyticsId: analytics.id,
      date: today,
      views: 1,
    },
  });
}
