import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ worldId: string }> }
) {
  const { worldId } = await params;

  const characters = await prisma.character.findMany({
    where: { worldId },
  });

  const states = await Promise.all(
    characters.map(async (c) => {
      const state = await prisma.characterState.findFirst({
        where: { characterId: c.id },
        orderBy: { createdAt: "desc" },
      });

      return {
        character: c,
        state,
      };
    })
  );

  return NextResponse.json(states);
}