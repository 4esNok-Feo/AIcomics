import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ versionId: string }> }
) {
  const { versionId } = await params;

  await prisma.sceneVersion.delete({
    where: { id: versionId },
  });

  return NextResponse.json({ ok: true });
}