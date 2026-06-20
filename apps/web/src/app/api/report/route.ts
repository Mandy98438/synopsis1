import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { reportKardSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = reportKardSchema.parse(body);

    await prisma.report.create({
      data: {
        kardId: input.kardId,
        reason: input.reason.toUpperCase() as
          | "IMPERSONATION"
          | "FAKE_IDENTITY"
          | "SPAM"
          | "INAPPROPRIATE"
          | "OTHER",
        details: input.details,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "INVALID_REQUEST", message: "Invalid report" } },
      { status: 400 }
    );
  }
}
