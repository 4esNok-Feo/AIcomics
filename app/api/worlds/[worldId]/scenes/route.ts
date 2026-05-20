import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ worldId: string }> }
) {
  const { worldId } = await params;

  const scenes = await prisma.scene.findMany({
    where: { worldId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(scenes);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ worldId: string }> }
) {
  try {
    const { worldId } = await params;
    const body = await req.json();

    const scene = await prisma.scene.create({
      data: {
        title: body.title,
        content: "",
        worldId,
      },
    });

    return NextResponse.json(scene);
  } catch (e: any) {
    console.error("CREATE SCENE ERROR:", e);
    return NextResponse.json(
      { error: "Create failed", details: e.message },
      { status: 500 }
    );
  }
}
