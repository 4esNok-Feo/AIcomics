"use client";

import { useEffect, useState } from "react";
import SceneEditor from "@/components/SceneEditor";
import SceneTimeline from "@/components/SceneTimeline";
import SceneVersionHistory from "@/components/SceneVersionHistory";
import AIInsightsPanel from "@/components/AIInsightsPanel";
import { AnalyzeResult } from "@/lib/api";

type Props = {
  sceneId: string;
  worldId: string;
  initialScene: {
    goal?: string;
    conflict?: string;
    emotional_tone?: string;
    text?: string;
    outcome?: string;
  };
  versions: {
    id: string;
    text: string;
    created_at: string;
  }[];
};

type Character = {
  id: string;
  name: string;
  personality: string;
  behavior: string;
  traits: string;
};

export default function SceneWorkspace({
  sceneId,
  worldId,
  initialScene,
  versions: initialVersions,
}: Props) {
  const [analysis, setAnalysis] = useState<AnalyzeResult | null>(null);
  const [currentText,setCurrentText]= useState(initialScene.text || "");
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [sceneCharacters, setSceneCharacters] = useState<string[]>([]);

  // ✅ локальное состояние версий (ВАЖНО)
  const [versions, setVersions] = useState(initialVersions || []);

  // ===============================
  // CHARACTERS
  // ===============================
  async function loadCharacters() {
    const [allRes, sceneRes] = await Promise.all([
      fetch(`/api/worlds/${worldId}/characters`).then(r => r.json()),
      fetch(`/api/scenes/${sceneId}/characters`).then(r => r.json()),
    ]);

    setAllCharacters(Array.isArray(allRes) ? allRes : []);
    setSceneCharacters(
      Array.isArray(sceneRes) ? sceneRes.map((c: any) => c.id) : []
    );
  }

  useEffect(() => {
    if (!sceneId) return;
    loadCharacters();
  }, [sceneId]);

  // ===============================
  // ✅ VERSIONS LOADER (FIX)
  // ===============================
  async function loadVersions() {
    try {
      const res = await fetch(`/api/scenes/${sceneId}/versions`);
      const data = await res.json();

      setVersions(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to load versions", e);
    }
  }

  // загрузка при открытии сцены
  useEffect(() => {
    if (!sceneId) return;
    loadVersions();
  }, [sceneId]);

  // ===============================
  // UI
  // ===============================
  return (
    <div className="flex flex-col h-screen">

      {/* ===== CHARACTERS ===== */}
      <div className="p-4 border-b bg-gray-50 space-y-2">
        <h2 className="font-bold">Персонажи в сцене</h2>

        {allCharacters.map(c => (
          <label key={c.id} className="flex gap-2 items-center">
            <input
              type="checkbox"
              checked={sceneCharacters.includes(c.id)}
              onChange={async () => {
                await fetch(`/api/scenes/${sceneId}/characters`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ characterId: c.id }),
                });

                loadCharacters();
              }}
            />
            <span>{c.name}</span>
          </label>
        ))}

        <button
          className="underline text-sm mt-2"
          onClick={() => window.history.back()}
        >
          ← Назад к сценам
        </button>
      </div>

      {/* ===== WORKSPACE ===== */}
      <div className="flex flex-1">

        <SceneEditor
		sceneId={sceneId}
		worldId={worldId}
		initialScene={initialScene}
		onAnalysis={setAnalysis}
		onSceneChange={(scene)=>
		setCurrentText(scene.text)
		}
		/>

        <SceneTimeline sceneId={sceneId} />

        <SceneVersionHistory
          sceneId={sceneId}
          versions={versions}
		  currentText={currentText}
          onReload={loadVersions}
          onRestore={(text) => {
            window.dispatchEvent(
              new CustomEvent("restore-scene", { detail: text })
            );

            // ✅ сразу обновляем историю
            loadVersions();
          }}
        />

        <AIInsightsPanel analysis={analysis} />
      </div>
    </div>
  );
}