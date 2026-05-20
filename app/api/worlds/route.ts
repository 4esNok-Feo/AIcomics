import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const worlds = await prisma.world.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(worlds);
}

export async function POST(req: Request) {
  const body = await req.json();

  const world = await prisma.world.create({
    data: {
      name: body.name,
      description: body.description || "",
    },
  });

  return NextResponse.json(world);
}
