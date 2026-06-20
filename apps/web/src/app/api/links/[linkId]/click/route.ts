import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  _request: Request,
  { params }: { params: { linkId: string } }
) {
  try {
    await prisma.linkAnalytics.upsert({
      where: { linkId: params.linkId },
      update: { totalClicks: { increment: 1 } },
      create: { linkId: params.linkId, totalClicks: 1 },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
