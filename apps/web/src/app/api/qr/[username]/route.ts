import { type NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
  const kard = await prisma.kard.findUnique({ where: { username: params.username.toLowerCase(), active: true }, select: { id: true } });
  if (!kard) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const url = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/${params.username}`;
  try {
    const buf = await QRCode.toBuffer(url, { errorCorrectionLevel: "M", type: "png", width: 400, margin: 2, color: { dark: "#000000", light: "#FFFFFF" } });
    return new NextResponse(new Uint8Array(buf), {
      headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400", "Content-Disposition": `inline; filename="${params.username}-qr.png"` },
    });
  } catch { return NextResponse.json({ error: "QR generation failed" }, { status: 500 }); }
}
