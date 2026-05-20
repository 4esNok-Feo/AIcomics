import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ characterId: string }> }
) {
  const { characterId } = await params;
  const body = await req.json();

  const state = await prisma.characterState.create({
    data: {
      characterId,
      sceneId: body.sceneId ?? null,
      emotion: body.emotion ?? "нейтральное",
      goal: body.goal ?? "",
      stressLevel: body.stressLevel ?? 0,
      relationships: body.relationships ?? {},
    },
  });

  return NextResponse.json(state);
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ characterId: string }> }
) {
  const { characterId } = await params;

  const state = await prisma.characterState.findFirst({
    where: { characterId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(state);
}