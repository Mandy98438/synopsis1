// ─────────────────────────────────────────────
// KARD — Dashboard Page
// FIX: user.cards → user.kards (correct Prisma relation name)
// FIX: Phase 9 skeletons + empty states now wired in
// ─────────────────────────────────────────────

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/shell";
import { CardBuilder } from "@/components/dashboard/card-builder";
import { NoKardsEmpty } from "@/components/dashboard-skeleton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/signin");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      kards: {                          // FIX: was "cards" — relation is "kards"
        include: { links: true, analytics: true },
        orderBy: { createdAt: "desc" },
      },
      verification: true,
    },
  });

  if (!user) redirect("/auth/signin");

  const kard = user.kards[0] ?? null;

  return (
    <DashboardShell user={{ name: user.name, email: user.email, plan: user.plan }}>
      {kard ? (
        <CardBuilder kard={kard} verification={user.verification} />
      ) : (
        // FIX: Wire in Phase 9 empty state (was showing plain EmptyState with no action)
        <NoKardsEmpty onCreateClick={() => {}} />
      )}
    </DashboardShell>
  );
}
