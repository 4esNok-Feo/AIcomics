import { NextResponse } from "next/server";
import { deepseekChat } from "@/app/lib/ai/deepseek";

export async function POST(req: Request) {
  try {
    const { old_text, new_text } = await req.json();

    const prompt = `
Ты — литературный редактор и соавтор писателя.

Объясни НА РУССКОМ ЯЗЫКЕ, почему изменения во втором тексте
улучшают сцену по сравнению с первым.

❗ Не переписывай текст
❗ Не давай общих советов
❗ Объясняй конкретные правки

СТАРЫЙ ТЕКСТ:
${old_text}

НОВЫЙ ТЕКСТ:
${new_text}
`;

    const explanation = await deepseekChat(prompt);

    return NextResponse.json({ explanation });
  } catch (e: any) {
    console.error("Explain diff error:", e);
    return NextResponse.json(
      { error: "Explain diff failed" },
      { status: 500 }
    );
  }
}
