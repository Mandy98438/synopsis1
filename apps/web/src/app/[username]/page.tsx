// ─────────────────────────────────────────────
// KARD — Public Card Viewer
// Route: /[username]
// FIX: View count now correctly writes DailyView row
//      so 30-day analytics chart actually populates
// ─────────────────────────────────────────────

import { type Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { generateCardMetadata } from "@/lib/metadata";
import { KardLogo } from "@/components/kard/kard-logo";
import { VerifiedBadge } from "@/components/kard/verified-badge";
import { SaveContactButton } from "@/components/kard/save-contact-button";
import { ReportButton } from "@/components/kard/report-button";
import { LinkButton } from "@/components/kard/link-button";
import { getDemoKard, isDemoUsername } from "@/lib/demo-kard";

interface Props { params: { username: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return generateCardMetadata(params.username);
}

async function getKard(username: string) {
  const normalized = username.toLowerCase();

  if (isDemoUsername(normalized)) {
    return getDemoKard();
  }

  const kard = await prisma.kard.findUnique({
    where: { username: normalized, active: true },
    include: {
      links: { orderBy: { order: "asc" } },
      user: { include: { verification: true } },
    },
  });

  if (!kard) return null;

  // FIX: Full view count — total + daily (was missing DailyView write)
  void incrementViewCount(kard.id).catch(() => {});

  return kard;
}

// FIX: Properly writes both KardAnalytics total + DailyView row
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

export default async function KardViewerPage({ params }: Props) {
  const kard = await getKard(params.username);
  if (!kard) notFound();

  const isDark = kard.theme === "DARK";
  const verification = kard.user?.verification ?? null;

  const bg = isDark ? "bg-[#0a0a0a]" : "bg-[#F2EDE4]";
  const cardBg = isDark ? "bg-[#141414]" : "bg-[#FAF6EF] border border-[#ddd8ce]";
  const photoBg = isDark ? "bg-[#1c1c1c]" : "bg-[#E8E0D4]";
  const nameColor = isDark ? "text-[#f0f0f0]" : "text-[#111]";
  const roleColor = isDark ? "text-[#555]" : "text-[#aaa]";
  const divider = isDark ? "bg-[#1e1e1e]" : "bg-[#E4DDD4]";
  const privacyText = isDark ? "text-[#2a2a2a]" : "text-[#ccc]";
  const overlayGrad = isDark ? "from-black/65" : "from-[#FAF6EF]/80";
  const initColor = isDark ? "text-[#252525]" : "text-[#C4B9AA]";

  return (
    <main className={`min-h-screen ${bg} flex items-center justify-center p-4`}>
      <div className={`w-full max-w-[360px] rounded-[22px] overflow-hidden ${cardBg} shadow-2xl animate-fade-up`}>
        {/* Accent bar */}
        <div className="h-1 w-full bg-[#E07020]" />

        {/* Photo */}
        <div className={`relative w-full aspect-square ${photoBg}`}>
          {kard.avatarUrl ? (
            <Image
              src={kard.avatarUrl}
              alt={`${kard.firstName} ${kard.lastName}`}
              fill
              className="object-cover"
              priority
              sizes="360px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-7xl font-medium select-none ${initColor}`}>
                {kard.firstName[0]}{kard.lastName?.[0] ?? ""}
              </span>
            </div>
          )}
          {/* Overlay */}
          <div className={`absolute bottom-0 left-0 right-0 p-3 flex justify-between items-end bg-gradient-to-t ${overlayGrad} to-transparent`}>
            <KardLogo size="sm" isDark={isDark} muted />
            {kard.company && (
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${isDark ? "bg-white/8 text-white/35" : "bg-black/6 text-black/30"}`}>
                {kard.company}
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="px-5 pt-4 pb-2">
          <h1 className={`text-xl font-medium leading-tight ${nameColor}`}>
            {kard.firstName} {kard.lastName}
          </h1>
          <p className={`text-xs mt-0.5 mb-4 ${roleColor}`}>
            {kard.headline}{kard.company ? ` · ${kard.company}` : ""}
          </p>

          {/* Links */}
          <div className="flex flex-col gap-2 mb-4 stagger-children">
            {kard.links.map((link) => (
              <div key={link.id} className="stagger-child animate-fade-up">
                <LinkButton link={link as any} isDark={isDark} kardId={kard.id} />
              </div>
            ))}
          </div>

          {/* Verified */}
          {verification && verification.level > 0 && (
            <div className="mb-4">
              <VerifiedBadge level={verification.level} isDark={isDark} />
            </div>
          )}
        </div>

        {/* Divider */}
        <div className={`mx-5 h-px ${divider}`} />

        {/* Footer */}
        <div className="px-5 pb-5 pt-3 flex flex-col gap-3">
          <SaveContactButton kard={kard as any} isDark={isDark} />
          <div className="flex justify-between items-center">
            <p className={`text-[9px] ${privacyText}`}>No data collected about you</p>
            <ReportButton kardId={kard.id} isDark={isDark} />
          </div>
        </div>
      </div>
    </main>
  );
}
