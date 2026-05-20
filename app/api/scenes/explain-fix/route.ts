export async function POST(req: Request) {
  const { before, after } = await req.json();

  const prompt = `
Explain in Russian why the new version is better.
Focus on clarity, style, historical accuracy.

BEFORE:
${before}

AFTER:
${after}
`;

  const explanation = await deepseekChat(prompt);

  return NextResponse.json({ explanation });
}
