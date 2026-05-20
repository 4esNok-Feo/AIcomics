import { prisma } from "@/lib/db";
import { deepseekChat } from "@/lib/ai/deepseek";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { characterId, worldId, newEvent } = await req.json();

  const state = await prisma.characterState.findUnique({
    where: {
      characterId_worldId: { characterId, worldId },
    },
    include: { character: true },
  });

  if (!state) {
    return NextResponse.json({ error: "State not found" }, { status: 404 });
  }

  const prompt = `
Ты — система долговременной памяти персонажа.

ЗАДАЧА:
Сжать историю персонажа в краткую, но насыщенную память.

ПРАВИЛА:
- Не перечисляй сцены.
- Оставляй только важные изменения личности.
- Учитывай психологические последствия.
- Пиши кратко, но содержательно.

ТЕКУЩАЯ ПАМЯТЬ:
${state.memorySummary ?? "Память отсутствует"}

НОВОЕ СОБЫТИЕ:
${newEvent}

Верни ТОЛЬКО обновлённую память персонажа.
`;

  const compressed = await deepseekChat(prompt);

  const updated = await prisma.characterState.update({
    where: {
      characterId_worldId: { characterId, worldId },
    },
    data: {
      memorySummary: compressed.trim(),
      memoryVersion: { increment: 1 },
    },
  });

  return NextResponse.json(updated);
}