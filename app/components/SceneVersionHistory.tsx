"use client";

import { useState } from "react";
import { DiffViewer } from "@/components/DiffViewer";
import { buildDiff } from "@/lib/diff";

type Version = {
  id: string;
  text: string;
  createdAt?: string;
  source?: string;
};

type Props = {
  sceneId: string;
  versions: Version[];
  currentText?: string;
  onReload?: () => void;
  onRestore: (text: string) => void;
};

export default function SceneVersionHistory({
  sceneId,
  versions,
  currentText = "",
  onReload,
  onRestore,
}: Props) {

  const [diffText, setDiffText] = useState<string | null>(null);

  return (
    <aside className="w-80 border-l p-4 overflow-y-auto">
      <h2 className="font-bold mb-2">
        Version History
      </h2>

      {versions.length === 0 && (
        <div className="text-gray-500 text-sm">
          История пуста
        </div>
      )}

      {versions.map((v) => (
        <div
          key={v.id}
          className="border p-2 mb-3 text-sm rounded"
        >
          <button
            className="text-red-500 text-xs"
            onClick={async () => {
              await fetch(
                `/api/scenes/${sceneId}/versions/${v.id}`,
                {
                  method: "DELETE",
                }
              );

              onReload?.();
            }}
          >
            Удалить
          </button>

          <div className="text-gray-500 mb-1">
            {v.createdAt
              ? new Date(
                  v.createdAt
                ).toLocaleString()
              : "Unknown date"}{" "}
            ·{" "}
            {v.source === "ai"
              ? "🤖 AI"
              : "✍️ Manual"}
          </div>

          <div className="flex gap-3 mt-2">

            <button
              className="text-blue-600 underline"
              onClick={() =>
                onRestore(v.text ?? "")
              }
            >
              Restore
            </button>

            <button
              className="text-green-600 underline"
              onClick={() =>
                setDiffText(v.text)
              }
            >
              View Diff
            </button>

          </div>
        </div>
      ))}

      {diffText && (
        <div className="mt-4 border-t pt-3">
          <h3 className="font-bold mb-2">
            Diff vs current
          </h3>

          <DiffViewer
            diff={buildDiff(
              diffText,
              currentText
            )}
          />

          <button
            className="mt-2 text-sm underline"
            onClick={() =>
              setDiffText(null)
            }
          >
            Close diff
          </button>
        </div>
      )}
    </aside>
  );
}