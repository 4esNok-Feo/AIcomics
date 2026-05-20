import { prisma } from "@/lib/db";
import { deepseekChat } from "@/lib/ai/deepseek";
import { buildCharacterContext } from "@/lib/ai/characterContext";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { sceneId, text } = await req.json();

  const scene = await prisma.scene.findUnique({
    where: { id: sceneId },
  });

  if (!scene) {
    return NextResponse.json({ error: "Scene not found" }, { status: 404 });
  }

  const context = await buildCharacterContext(scene.worldId);

  const prompt = `
Ты анализируешь изменения персонажей после сцены.

${context}

СЦЕНА:
${text}

Верни JSON:

{
  "updates":[
    {
      "characterName": string,
      "emotion": string,
      "goal": string,
      "stressLevel": number,
      "relationships": object
    }
  ]
}
`;

  const raw = await deepseekChat(prompt);
  const json = JSON.parse(raw);

  for (const upd of json.updates) {
    const character = await prisma.character.findFirst({
      where: { name: upd.characterName },
    });

    if (!character) continue;

    await prisma.characterState.create({
      data: {
        characterId: character.id,
        sceneId,
        emotion: upd.emotion,
        goal: upd.goal,
        stressLevel: upd.stressLevel,
        relationships: JSON.stringify(upd.relationships ?? {}),
      },
    });
	await fetch("http://localhost:3000/api/characters/compress-memory", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    characterId: upd.characterId,
    worldId,
    newEvent: upd.eventSummary,
  }),
});
  }

  return NextResponse.json({ ok: true });
}
