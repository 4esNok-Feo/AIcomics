import { prisma } from "@/lib/db";

export async function buildCharacterContext(worldId: string) {

  const characters = await prisma.character.findMany({
    where: { worldId },
  });

  let context = `
ТЕКУЩИЕ СОСТОЯНИЯ ПЕРСОНАЖЕЙ:
`;

  for (const c of characters) {

    const state = await prisma.characterState.findFirst({
      where: { characterId: c.id },
      orderBy: { createdAt: "desc" },
    });

    context += `
Имя: ${c.name}
Характер: ${c.personality}
Поведение: ${c.behavior}
Особенности: ${c.traits}
ПАМЯТЬ ПЕРСОНАЖА: ${state.memorySummary ?? "нет значимых воспоминаний"}

Текущее состояние:
Эмоция: ${state?.emotion ?? "неизвестно"}
Цель: ${state?.goal ?? "не определена"}
Стресс: ${state?.stressLevel ?? 0}
Отношения: ${state?.relationships ?? "{}"}


---
`;
  }

  return context;
}