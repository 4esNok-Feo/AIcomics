import { NextResponse } from "next/server";
import { grokChat } from "@/lib/ai/deepseek";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const advice = await grokChat([
      {
        role: "system",
        content:
          "You are a story writing coach helping improve scenes.",
      },
      {
        role: "user",
        content: `
Scene:
${data.text}

Goal: ${data.goal || "—"}
Conflict: ${data.conflict || "—"}
Emotional tone: ${data.emotional_tone || "—"}

Give concise, actionable advice.
        `,
      },
    ]);

    return NextResponse.json({ advice });
  } catch (e) {
    console.error("Coach error:", e);
    return NextResponse.json(
      { error: "Scene coach failed" },
      { status: 500 }
    );
  }
}
