const BASE =
  typeof window === "undefined"
    ? "http://localhost:3000"
    : "";

/* ========= TYPES ========= */

export type World = {
  id: string;
  name: string;
  description?: string;
};

export type Scene = {
  id: string;
  worldId: string;
  title: string;
  text: string;
  createdAt: string;
};

export type Issue = {
  type: string;
  message: string;
  severity: "low" | "medium" | "high";
};

export type AnalyzeResult = {
  issues: Issue[];
  insights: string[];
};

/* ========= WORLDS ========= */

export async function getWorlds(): Promise<World[]> {
  const res = await fetch(`${BASE}/api/worlds`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch worlds");

  return res.json();
}

export async function createWorld(data: {
  name: string;
  description?: string;
}) {
  const res = await fetch(`${BASE}/api/worlds`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Create world failed");

  return res.json();
}

/* ========= SCENES ========= */

export async function getScenes(worldId: string): Promise<Scene[]> {
  const res = await fetch(`${BASE}/api/worlds/${worldId}/scenes`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch scenes");

  return res.json();
}

export async function getScene(sceneId: string): Promise<Scene> {
  const res = await fetch(`${BASE}/api/scenes/${sceneId}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch scene");

  return res.json();
}

export async function createScene(worldId: string, title = "New Scene") {
  const res = await fetch(`${BASE}/api/worlds/${worldId}/scenes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });

  if (!res.ok) {
    const t = await res.text();
    console.error("Create scene failed:", t);
    throw new Error("Create scene failed");
  }

  return res.json();
}

export async function updateScene(
  sceneId: string,
  data: Partial<Pick<Scene, "title" | "text">>
) {
  const res = await fetch(`${BASE}/api/scenes/${sceneId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const t = await res.text();
    console.error("Failed to save scene:", t);
    throw new Error("Failed to save scene");
  }

  return res.json();
}

/* ========= AI ========= */

export async function rewriteScene(
  sceneId: string,
  text: string,
  characters: any[]
) {
  const res = await fetch("/api/ai/rewrite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sceneId,
      text,
      characters,
    }),
  });

  return res.json();
}


export async function analyzeScene(data: {
  text: string;
  goal?: string;
}): Promise<AnalyzeResult> {
  if (!data.text.trim()) {
    return { issues: [], insights: [] };
  }

  const res = await fetch(`${BASE}/api/scenes/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const t = await res.text();
    console.error("Analyze failed:", t);
    throw new Error("Analyze failed");
  }

  return res.json();
}

export async function fixSceneIssue(
  text: string,
  issue: {
    type: string;
    message: string;
  }
): Promise<{ fixed_text: string }> {
  const res = await fetch(`${BASE}/api/scenes/fix-issue`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, issue }),
  });

  if (!res.ok) throw new Error("Fix issue failed");

  return res.json();
}

export async function explainDiff(
  oldText: string,
  newText: string
): Promise<{ explanation: string }> {
  const res = await fetch(`${BASE}/api/scenes/explain-diff`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      old_text: oldText,
      new_text: newText,
    }),
  });

  if (!res.ok) throw new Error("Explain diff failed");

  return res.json();
}

export async function coachScene(data: {
  text: string;
  goal?: string;
  conflict?: string;
  emotional_tone?: string;
}): Promise<{ advice: string }> {
  const res = await fetch(`${BASE}/api/scenes/coach`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Scene coach failed");

  return res.json();
}

/* ========= VERSIONS ========= */

export async function getSceneVersions(sceneId: string) {
  const res = await fetch(`${BASE}/api/scenes/${sceneId}/versions`);

  if (!res.ok) return [];

  return res.json();
}
