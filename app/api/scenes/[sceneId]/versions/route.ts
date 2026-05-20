import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

/* ===== GET VERSIONS ===== */

export async function GET(
  req: Request,
  { params }: { params: Promise<{ sceneId: string }> }
) {
  const { sceneId } = await params;

  const versions = await prisma.sceneVersion.findMany({
    where: { sceneId },
    orderBy: { createdAt: "desc" },
    take: 5, // ✅ только последние 5
  });

  return NextResponse.json(versions);
}

/* ===== CREATE VERSION ===== */

export async function POST(
  req: Request,
  { params }: { params: Promise<{ sceneId: string }> }
) {
  const { sceneId } = await params;
  const body = await req.json();

  await prisma.sceneVersion.create({
    data: {
      sceneId,
      content: body.content,
      type: body.type,
      label: body.label,
    },
  });

  // ✅ авто очистка старых
  const old = await prisma.sceneVersion.findMany({
    where: { sceneId },
    orderBy: { createdAt: "desc" },
    skip: 5,
  });

  if (old.length) {
    await prisma.sceneVersion.deleteMany({
      where: { id: { in: old.map(v => v.id) } },
    });
  }

  return NextResponse.json({ ok: true });
}