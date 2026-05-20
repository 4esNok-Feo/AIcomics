import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

/* ================= GET CHARACTERS OF SCENE ================= */

export async function GET(
  req: Request,
  { params }: { params: Promise<{ sceneId: string }> }
) {
  const { sceneId } = await params;

  const chars = await prisma.sceneCharacter.findMany({
    where: { sceneId },
    include: { character: true },
  });

  return NextResponse.json(chars.map((c) => c.character));
}

/* ================= SAVE SCENE CHARACTERS ================= */

export async function POST(
  req: Request,
  { params }: { params: Promise<{ sceneId: string }> }
) {
  const { sceneId } = await params;
  const { characterIds } = await req.json();

  // удаляем старые связи
  await prisma.sceneCharacter.deleteMany({
    where: { sceneId },
  });

  // создаём новые
  await prisma.sceneCharacter.createMany({
    data: characterIds.map((id: string) => ({
      sceneId,
      characterId: id,
    })),
  });

  return NextResponse.json({ ok: true });
}
