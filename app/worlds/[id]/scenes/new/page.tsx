"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createScene } from "@/lib/api";

export default function NewScenePage() {
  const router = useRouter();
  const params = useParams();
  const worldId = params.id as string;

  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!title) return;

    setLoading(true);
    const scene = await createScene(worldId, title, goal);
    router.push(`/worlds/${worldId}/scenes/${scene.id}`);
  }

  return (
    <div style={{ padding: 24, maxWidth: 600 }}>
      <h1>Create Scene</h1>

      <label>
        Scene title
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", marginBottom: 12 }}
        />
      </label>

      <label>
        Scene goal
        <textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          style={{ width: "100%", marginBottom: 12 }}
        />
      </label>

      <button onClick={handleCreate} disabled={loading}>
        {loading ? "Creating..." : "Create Scene"}
      </button>
    </div>
  );
}
