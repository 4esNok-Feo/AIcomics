import { prisma } from "@/lib/db";

export async function GET() {
  const world = await prisma.world.create({
    data: {
      name: "Тестовый мир",
      description: "Мир для проверки БД",
    },
  });

  const scene = await prisma.scene.create({
    data: {
      title: "Тестовая сцена",
      text: "Привет, сцена",
      worldId: world.id,
    },
  });

  return Response.json({ world, scene });
}
