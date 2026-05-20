const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

const apiKey = process.env.DEEPSEEK_API_KEY;
if (!apiKey) {
  throw new Error("DEEPSEEK_API_KEY is not set");
}

export async function deepseekChat(prompt: string): Promise<string> {
  const res = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.DEEPSEEK_MODEL ?? "deepseek-chat",
      messages: [
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 800,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("DeepSeek error:", text);
    throw new Error("LLM request failed");
  }

  const json = await res.json();
  return json.choices?.[0]?.message?.content ?? "";
}
