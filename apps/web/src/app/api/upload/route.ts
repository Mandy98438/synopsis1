// ─────────────────────────────────────────────
// KARD — Upload API Route
// Route: /api/upload
// Uploads avatar to Cloudinary, updates DB
// ─────────────────────────────────────────────

import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const kardId = formData.get("kardId") as string | null;

    if (!file || !kardId) {
      return NextResponse.json({ error: "Missing file or kardId" }, { status: 400 });
    }

    // Verify ownership
    const kard = await prisma.kard.findFirst({
      where: { id: kardId, userId: session.user.id },
    });
    if (!kard) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Validate file type
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      return NextResponse.json({ error: "Only JPG and PNG allowed" }, { status: 400 });
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    // Convert to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "kard/avatars",
            public_id: `kard_${kardId}`,
            overwrite: true,
            transformation: [
              { width: 400, height: 400, crop: "fill", gravity: "face" },
              { quality: "auto", fetch_format: "auto" },
            ],
          },
          (error, result) => {
            if (error || !result) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    // Update DB
    await prisma.kard.update({
      where: { id: kardId },
      data: { avatarUrl: result.secure_url },
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
