// ─────────────────────────────────────────────
// KARD — New Card Page
// Route: /dashboard/new
// Onboarding routes here after step 2.
// NEW FILE — was missing, caused onboarding to 404
// ─────────────────────────────────────────────

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/shell";
import { CardBuilder } from "@/components/dashboard/card-builder";

export default async function NewKardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/signin");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      kards: { select: { id: true } },
      verification: true,
    },
  });

  if (!user) redirect("/auth/signin");

  // Free tier check — redirect to dashboard if already at limit
  if (user.plan === "FREE" && user.kards.length >= 2) {
    redirect("/dashboard?limit=true");
  }

  return (
    <DashboardShell user={{ name: user.name, email: user.email, plan: user.plan }}>
      <CardBuilder
        kard={null}
        verification={user.verification}
        isNew={true}
      />
    </DashboardShell>
  );
}
