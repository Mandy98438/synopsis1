import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db";
export default async function ShortCodePage({ params }: { params: { code: string } }) {
  const kard = await prisma.kard.findUnique({ where: { shortCode: params.code.toUpperCase(), active: true }, select: { username: true } });
  if (!kard) notFound();
  redirect(`/${kard.username}`);
}
