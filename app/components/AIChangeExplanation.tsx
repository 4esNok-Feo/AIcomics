"use client";

import { useState } from "react";
import { explainDiff } from "@/lib/api";

type Props = {
  oldText: string;
  newText: string;
};

export default function AIChangeExplanation({
  oldText,
  newText,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);

  async function handleExplain() {
    setLoading(true);
    try {
      const res = await explainDiff(oldText, newText);
      setExplanation(res.explanation);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 border p-3 bg-white">
      <button
        className="text-sm underline"
        onClick={handleExplain}
        disabled={loading}
      >
        {loading ? "Explaining..." : "Explain AI changes"}
      </button>

      {explanation && (
        <div className="mt-2 text-sm whitespace-pre-wrap">
          {explanation}
        </div>
      )}
    </div>
  );
}
