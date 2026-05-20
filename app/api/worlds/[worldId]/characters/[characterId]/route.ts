import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ worldId: string; characterId: string }> }
) {
  try {
    const { characterId } = await params;

    console.log("PATCH characterId:", characterId);

    const body = await req.json();

    const updated = await prisma.character.update({
      where: {
        id: characterId,
      },
      data: {
        name: body.name,
        age: body.age,
        personality: body.personality,
        behavior: body.behavior,
        traits: body.traits,
      },
    });

    return NextResponse.json(updated);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: "Update failed", message: e.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ worldId: string; characterId: string }> }
) {
  try {
    const { characterId } = await params;

    console.log("DELETE characterId:", characterId);

    // ✅ сначала удаляем связи со сценами
    await prisma.sceneCharacter.deleteMany({
      where: { characterId },
    });

    await prisma.character.delete({
      where: { id: characterId },
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: "Delete failed", message: e.message },
      { status: 500 }
    );
  }
}