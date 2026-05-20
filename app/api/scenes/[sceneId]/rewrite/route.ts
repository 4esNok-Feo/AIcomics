import { prisma } from "@/lib/db";
import { deepseekChat } from "@/lib/ai/deepseek";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ sceneId: string }> }
) {
  const { sceneId } = await params;

  const scene = await prisma.scene.findUnique({
    where: { id: sceneId },
  });

  if (!scene) {
    return new Response("Scene not found", { status: 404 });
  }

  // ✅ получаем персонажей сцены
  const sceneCharacters = await prisma.sceneCharacter.findMany({
    where: { sceneId },
    include: { character: true },
  });

  let characterContext = "";

  if (sceneCharacters.length > 0) {
    const charactersText = sceneCharacters
      .map(({ character }) => {
        return `
Персонаж: ${character.name}
Возраст: ${character.age ?? "не указан"}
Характер: ${character.personality ?? "не указан"}
Поведение: ${character.behavior ?? "не указано"}
Особенности: ${character.traits ?? "не указаны"}
`;
      })
      .join("\n");

    characterContext = `
УЧАСТНИКИ СЦЕНЫ:
${charactersText}

ОБЯЗАТЕЛЬНЫЕ ПРАВИЛА:
- каждый персонаж должен действовать согласно характеру
- стиль речи должен отражать личность
- персонажи должны отличаться друг от друга
`;
  } else {
    characterContext = `
В сцене не выбраны персонажи.
Перепиши сцену как нейтральное повествование.
`;
  }

  const prompt = `
Ты — профессиональный сценарист и редактор высокого уровня.

${characterContext}

СЦЕНА:
${scene.content}

ЗАДАЧА:
Перепиши сцену, улучшив:
— драму
— диалоги
— логичность действий персонажей
— эмоциональное напряжение
— индивидуальность речи персонажей

ПРАВИЛА:
- не сокращай текст без причины
- сохраняй смысл сцены
- усиливай конфликт
`;

  const rewritten = await deepseekChat(prompt);

  return Response.json({
    rewritten_text: rewritten,
  });
}

await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/scenes/analyze-state`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    sceneId,
    text: rewritten,
  }),
});