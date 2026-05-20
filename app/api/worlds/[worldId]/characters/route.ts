import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ worldId: string }> }
) {
  const { worldId } = await ctx.params;

  try {
    const characters = await prisma.character.findMany({
      where: { worldId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(characters);
  } catch (e: any) {
    console.error("GET CHARACTERS ERROR:", e);
    return NextResponse.json(
      { error: "Fetch failed", details: e.message },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ worldId: string }> }
) {
  const { worldId } = await ctx.params;

  try {
    const body = await req.json();

    const character = await prisma.character.create({
      data: {
        name: body.name,
        age: body.age,
        personality: body.personality,
        behavior: body.behavior,
        traits: body.traits,
        worldId, // ✅ теперь НЕ undefined
      },
    });

    return NextResponse.json(character);
  } catch (e: any) {
    console.error("CREATE CHARACTER ERROR:", e);
    return NextResponse.json(
      { error: "Create failed", details: e.message },
      { status: 500 }
    );
  }
}
