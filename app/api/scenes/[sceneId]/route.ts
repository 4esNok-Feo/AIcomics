import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ sceneId: string }> }
) {
  const { sceneId } = await params;

  try {
    const scene = await prisma.scene.findUnique({
      where: { id: sceneId },
    });

    if (!scene) {
      return NextResponse.json(
        { error: "Scene not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(scene);
  } catch (e: any) {
    console.error("GET SCENE ERROR:", e);
    return NextResponse.json(
      { error: "Fetch failed", details: e.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ sceneId: string }> }
) {
  const { sceneId } = await params;
  const body = await req.json();

  const scene = await prisma.scene.update({
    where: { id: sceneId },
    data: {
      content: body.content,
      goal: body.goal,
      conflict: body.conflict,
      emotional_tone: body.emotional_tone,
      outcome: body.outcome,
    },
  });

  return NextResponse.json(scene);
}