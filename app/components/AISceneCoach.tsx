"use client";

import { useState } from "react";
import { coachScene } from "@/lib/api";

type Props = {
  scene: {
    text: string;
    goal?: string;
    conflict?: string;
    emotional_tone?: string;
  };
};

export default function AISceneCoach({ scene }: Props) {
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);

  async function handleCoach() {
    setLoading(true);
    try {
      const res = await coachScene(scene);
      setAdvice(res.advice);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border-t p-4">
      <button
        onClick={handleCoach}
        className="underline text-sm"
        disabled={loading}
      >
        {loading ? "Coaching..." : "AI Scene Coach"}
      </button>

      {advice && (
        <div className="mt-2 text-sm whitespace-pre-wrap">
          {advice}
        </div>
      )}
    </div>
  );
}
