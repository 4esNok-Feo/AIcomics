import { NextResponse } from "next/server";
import { deepseekChat } from "@/lib/ai/deepseek";

export async function POST(req: Request) {
  try {
    const { text, issue } = await req.json();

    const prompt = `
SYSTEM RULES:
- You are a professional Russian literary editor.
- Respond ONLY in Russian.
- Do NOT explain your reasoning.
- Return ONLY the corrected scene text.
- Do NOT use markdown or backticks.

TASK:
Fix ONLY the following issue in the scene.
Do NOT rewrite the entire scene stylistically.
Preserve tone, style, characters, and structure.

ISSUE:
Тип: ${issue.type}
Описание: ${issue.message}

SCENE TEXT:
${text}
`;

    const fixedText = await deepseekChat(prompt);

    return NextResponse.json({
      fixed_text: fixedText.trim(),
    });
  } catch (e: any) {
    console.error("Fix issue error:", e);
    return NextResponse.json(
      { error: "Fix issue failed" },
      { status: 500 }
    );
  }
}
