import { NextResponse } from "next/server";
import { deepseekChat } from "@/lib/ai/deepseek";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { text, goal, sceneId } = await req.json();

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "Empty text" },
        { status: 400 }
      );
    }

    let characterContext = "";

    // ✅ получаем ТОЛЬКО персонажей сцены
    if (sceneId) {
      const sceneCharacters = await prisma.sceneCharacter.findMany({
        where: { sceneId },
        include: { character: true },
      });

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
УЧАСТНИКИ СЦЕНЫ (ОБЯЗАТЕЛЬНО УЧИТЫВАТЬ):
${charactersText}

ВАЖНО:
- анализируй сцену с учётом характеров персонажей
- проверяй соответствие действий их личности
- отмечай нелогичное поведение
`;
      } else {
        characterContext = `
В сцене не выбран ни один персонаж.
Если действия выглядят обезличенными — укажи это как проблему.
`;
      }
    }

    const prompt = `
SYSTEM RULES (MANDATORY):
- You are a literary AI assistant.
- You MUST respond ONLY in RUSSIAN.
- ALL text fields MUST be written in Russian.
- Do NOT use English under any circumstances.
- Do NOT explain anything outside JSON.
- Do NOT use markdown.
- Do NOT wrap response in triple backticks.

TASK:
Analyze the scene and identify problems and insights.

RETURN ONLY VALID JSON IN THIS EXACT FORMAT:
{
  "issues": [
    {
      "type": string,
      "message": string,
      "severity": "low" | "medium" | "high"
    }
  ],
  "insights": string[]
}

IMPORTANT:
- "type" MUST be a short Russian noun phrase
- "message" MUST be a full sentence in Russian
- "insights" MUST be written in Russian

${characterContext}

Цель сцены:
${goal ?? "Не указана"}

Текст сцены:
${text}
`;

    const raw = await deepseekChat(prompt);
    console.log("RAW AI RESPONSE:", raw);

    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return NextResponse.json(JSON.parse(cleaned));
  } catch (e: any) {
    console.error("Analyze route error:", e);
    return NextResponse.json(
      { error: "Analyze failed", details: e.message },
      { status: 500 }
    );
  }
}
