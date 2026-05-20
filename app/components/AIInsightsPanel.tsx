"use client";

import { useEffect, useState } from "react";
import IssueBadge from "./IssueBadge";
import { AnalyzeResult } from "@/lib/api";

type Props = {
  analysis: AnalyzeResult | null;
};

export default function AIInsightsPanel({ analysis }: Props) {
  const [data, setData] = useState<AnalyzeResult | null>(analysis);

  useEffect(() => {
    const handler = (e: any) => setData(e.detail);
    window.addEventListener("ai-analysis", handler);
    return () => window.removeEventListener("ai-analysis", handler);
  }, []);

  if (!data) {
    return (
      <aside className="w-80 border-l p-4 text-gray-500">
        ИИ ждёт анализа сцены
      </aside>
    );
  }

  const issues = Array.isArray(data.issues) ? data.issues : [];
  const insights = Array.isArray(data.insights) ? data.insights : [];

  return (
    <aside className="w-80 border-l p-4 overflow-y-auto">
      <h2 className="font-bold mb-2">ИИ-партнёр</h2>

      {issues.length === 0 && (
        <div className="text-green-600">
          No issues detected 🎉
        </div>
      )}

      {issues.length > 0 && (
        <div className="mt-2">
          <h4 className="font-bold">Issues</h4>
          {issues.map((issue, i) => (
            <IssueBadge key={i} issue={issue} />
          ))}
        </div>
      )}

      {insights.length > 0 && (
        <div className="mt-4">
          <h4 className="font-bold">Suggestions</h4>
          <ul className="list-disc pl-4">
            {insights.map((insight, i) => (
              <li key={i}>{insight}</li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
