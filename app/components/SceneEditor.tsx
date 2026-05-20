"use client";

import { useEffect, useRef, useState } from "react";
import {
  analyzeScene,
  AnalyzeResult,
  rewriteScene,
  updateScene,
  fixSceneIssue,
  explainDiff,
} from "@/lib/api";
import { buildDiff } from "@/lib/diff";
import { DiffViewer } from "@/components/DiffViewer";
import CharacterForm from "@/components/CharacterForm";


/* ===================== TYPES ===================== */

type SceneData = {
  goal: string;
  conflict: string;
  emotional_tone: string;
  text: string;
  outcome: string;
};

type Props = {
  worldId: string;
  sceneId: string;
  initialScene?: Partial<SceneData>;
  onAnalysis?: (result: AnalyzeResult) => void;
  onSceneChange?: (scene: SceneData) => void;
};

type TimelineEvent = {
  id: string;
  type: "create" | "edit" | "rewrite" | "restore";
  label: string;
  timestamp: number;
  snapshot: string;
};

/* ===================== COMPONENT ===================== */

export default function SceneEditor({
  worldId,
  sceneId,
  initialScene = {},
  onAnalysis,
  onSceneChange,
}: Props) {

  /* ===================== STATE ===================== */

  const [scene, setScene] = useState<SceneData>({
    goal: initialScene.goal || "",
    conflict: initialScene.conflict || "",
    emotional_tone: initialScene.emotional_tone || "",
    text: initialScene.text || "",
    outcome: initialScene.outcome || "",
  });
  
/* ===================== CHARACTERS ===================== */

	const [allCharacters, setAllCharacters] = useState<any[]>([]);
	const [sceneCharacters, setSceneCharacters] = useState<string[]>([]);
  
  /* ===================== STATE ===================== */
  
  const [analysis, setAnalysis] = useState<AnalyzeResult | null>(null);
  const [fixing, setFixing] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const [loading, setLoading] = useState(false);
  const [rewrite, setRewrite] = useState<string | null>(null);
  const [rewriting, setRewriting] = useState(false);

  const [diff, setDiff] = useState<ReturnType<typeof buildDiff> | null>(null);
  const [showDiff, setShowDiff] = useState<{
    before: string;
    after: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [diffExplanation, setDiffExplanation] = useState<string | null>(null);
  const [explaining, setExplaining] = useState(false);

  /* ===================== SYNC ===================== */

  useEffect(() => {
    onSceneChange?.(scene);
  }, [scene, onSceneChange]);

  /* ===================== TIMELINE ===================== */

  const [timeline, setTimeline] = useState<any[]>([]);

async function loadTimeline() {
  const res = await fetch(`/api/scenes/${sceneId}/versions`);
  const data = await res.json();
  setTimeline(data);
}

useEffect(() => {
  if (sceneId) loadTimeline();
}, [sceneId]);

async function loadScene() {
  const res = await fetch(`/api/scenes/${sceneId}`);
  const data = await res.json();

  setScene({
    goal: data.goal ?? "",
    conflict: data.conflict ?? "",
    emotional_tone: data.emotional_tone ?? "",
    text: data.content ?? "",   // ⚠️ важно
    outcome: data.outcome ?? "",
  });
}

useEffect(() => {
  if (sceneId) {
    loadScene();
  }
}, [sceneId]);


async function pushEvent(type: string, label: string, snapshot: string) {
  await fetch(`/api/scenes/${sceneId}/versions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type,
      label,
      content: snapshot,
    }),
  });

  loadTimeline();
}

  /* ===================== RESTORE ===================== */

  useEffect(() => {
    const handler = (e: any) => {
      setScene((s) => ({ ...s, text: e.detail }));
      pushEvent("restore", "Восстановление версии", e.detail);
    };

    window.addEventListener("restore-scene", handler);
    return () => window.removeEventListener("restore-scene", handler);
  }, []);

  useEffect(() => {
    const handler = (e: any) => setAnalysis(e.detail);
    window.addEventListener("ai-analysis", handler);
    return () => window.removeEventListener("ai-analysis", handler);
  }, []);


async function loadCharacters() {
  const sceneRes = await fetch(`/api/scenes/${sceneId}`);
  const scene = await sceneRes.json();

  if (!scene?.worldId) return;

  const charsRes = await fetch(
    `/api/worlds/${scene.worldId}/characters`
  );

  const chars = await charsRes.json();

  setAllCharacters(
    Array.isArray(chars) ? chars : chars.characters || []
  );

  const linkedRes = await fetch(
    `/api/scenes/${sceneId}/characters`
  );

  const linked = await linkedRes.json();

  setSceneCharacters(linked.map((c: any) => c.id));
}
 
useEffect(() => {
  if (sceneId) loadCharacters();
}, [sceneId]);




  /* ===================== ANALYZE ===================== */
	async function saveSceneCharacters(ids: string[]) {
	  await fetch(`/api/scenes/${sceneId}/characters`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ characterIds: ids }),
	  });
	}

  async function handleAnalyze() {
	  if (sceneCharacters.length === 0) {
	  alert("Выберите персонажа для сцены");
	  return;
	}
  
    if (!scene.text.trim()) {
      alert("Текст сцены пуст");
      return;
    }

    setLoading(true);
    try {
      const result = await analyzeScene({
        text: scene.text,
        goal: scene.goal,
      });

      onAnalysis?.(result);
      window.dispatchEvent(
        new CustomEvent("ai-analysis", { detail: result })
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleFixIssue(issue: {
    type: string;
    message: string;
  }) {
    setFixing(issue.message);
    try {
      const res = await fixSceneIssue(scene.text, issue);
      setScene((s) => ({ ...s, text: res.fixed_text }));
      pushEvent("rewrite", `AI исправление: ${issue.type}`, res.fixed_text);
    } finally {
      setFixing(null);
    }
  }

  /* ===================== REWRITE ===================== */

const selectedCharacters = allCharacters.filter(c =>
  sceneCharacters.includes(c.id)
);

async function handleSave() {
  setSaving(true);

  try {

    const res = await fetch(
      `/api/scenes/${sceneId}`,
      {
        method:"PATCH",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          text:scene.text,
          goal:scene.goal,
          conflict:scene.conflict,
          emotional_tone:scene.emotional_tone,
          outcome:scene.outcome,
        })
      }
    );

    if(!res.ok){

      const t=await res.text();

      console.error(
        "Save failed:",
        t
      );

      return;
    }

    window.dispatchEvent(
      new CustomEvent(
        "scene-saved"
      )
    );

  } finally{
    setSaving(false);
  }
}

  async function handleRewrite() {
	  if (sceneCharacters.length === 0) {
	  alert("Не выбран ни один персонаж");
	  return;
	}

    if (!scene.text.trim()) {
      alert("Текст сцены пуст");
      return;
    }

    setRewriting(true);
    try {
      const result = await rewriteScene(
  sceneId,
  selectedCharacters
);
      setRewrite(result.rewritten_text);
      pushEvent("rewrite", "AI переписал сцену", result.rewritten_text);
    } finally {
      setRewriting(false);
    }
  }

  /* ===================== DIFF ===================== */

  function handleShowDiff() {
    if (!rewrite) return;

    setShowDiff({
      before: scene.text,
      after: rewrite,
    });

    setDiff(buildDiff(scene.text, rewrite)); // ✅ FIX
  }

  /* ===================== RENDER ===================== */

  return (
    <div className="flex-1 p-6 overflow-y-auto">

      <h1 className="text-xl font-bold mb-4">Редактор сцены</h1>

      <textarea
  className="w-full border p-2 h-64 mb-2"
  value={scene.text || ""}
  onChange={(e) =>
    setScene({ ...scene, text: e.target.value })
  }
/>
	  {/* ===================== CHARACTERS UI ===================== */}

<div className="border p-3 mb-4">
  <div className="font-semibold mb-2">Персонажи в сцене</div>

  <div className="flex flex-wrap gap-3">
    {allCharacters
  .filter((c) => c?.id)
  .map((c) => (
      <label
  key={c.id ?? `char-${Math.random()}`}
  className="flex items-center gap-1 text-sm">
        <input
          type="checkbox"
          checked={sceneCharacters.includes(c.id)}
          onChange={async (e) => {
            const updated = e.target.checked
              ? [...sceneCharacters, c.id]
              : sceneCharacters.filter((id) => id !== c.id);

            setSceneCharacters(updated);
            await saveSceneCharacters(updated);
          }}
        />
        {c.name}
      </label>
    ))}
  </div>

  <button
  className="mt-3 text-sm underline"
  onClick={() => setShowCreate(v => !v)}
>
  + Создать персонажа
</button>
</div>


      <div className="flex gap-2 mb-4">
        <button onClick={handleAnalyze} disabled={loading}>
          {loading ? "Анализ..." : "Проанализировать сцену"}
        </button>
		<button onClick={handleSave} disabled={saving}>
  {saving ? "Сохранение..." : "Сохранить сцену"}
</button>

        <button onClick={handleRewrite} disabled={rewriting}>
          {rewriting ? "ИИ переписывает..." : "Переписать с ИИ"}
        </button>
      </div>

      {rewrite && (
        <div className="mt-4 border p-3">
          <textarea
            className="w-full border p-2 h-40"
            value={rewrite}
            readOnly
          />

          <div className="flex gap-3 mt-2">
            <button
              className="underline"
              onClick={() => {
                setScene({ ...scene, text: rewrite });
                setRewrite(null);
              }}
            >
              Принять версию ИИ
            </button>

            <button
              className="underline"
              onClick={handleShowDiff}
            >
              Показать различия
            </button>
          </div>
        </div>
      )}

	{showCreate && (
	  <CharacterForm
		worldId={worldId}
		onCreated={loadCharacters}
	  />
	)}


      {showDiff && (
        <>
          <div className="flex gap-4 text-xs my-2">
            <span className="text-green-700">+ Добавлено</span>
            <span className="text-red-700">− Удалено</span>
          </div>

          <DiffViewer diff={diff!} />

          <button
            className="underline text-sm mt-2"
            onClick={() => setShowDiff(null)}
          >
            Скрыть различия
          </button>
        </>
      )}

      {showDiff && (
        <div className="mt-4">
          <button
            className="underline text-sm"
            disabled={explaining}
            onClick={async () => {
              setExplaining(true);
              try {
                const res = await explainDiff(
                  showDiff.before,
                  showDiff.after
                );
                setDiffExplanation(res.explanation);
              } finally {
                setExplaining(false);
              }
            }}
          >
            {explaining ? "ИИ объясняет..." : "Объяснить изменения"}
          </button>
        </div>
      )}

      {diffExplanation && (
        <div className="mt-3 border p-3 bg-gray-50 whitespace-pre-wrap text-sm">
          {diffExplanation}
        </div>
      )}

      {analysis && analysis.issues.length > 0 && (
        <div className="mt-6 border p-4">
          <h2 className="font-bold mb-2">AI-анализ</h2>

          <ul className="space-y-3">
            {analysis.issues.map((issue, i) => (
              <li
                key={i}
                className="border p-3 rounded flex justify-between gap-4"
              >
                <div>
                  <div className="font-semibold">
                    {issue.type} ({issue.severity})
                  </div>
                  <div className="text-sm text-gray-700">
                    {issue.message}
                  </div>
                </div>

                <button
                  disabled={fixing === issue.message}
                  onClick={() => handleFixIssue(issue)}
                  className="underline text-sm"
                >
                  {fixing === issue.message
                    ? "Исправляется..."
                    : "Исправить"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}



