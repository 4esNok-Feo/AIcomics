"use client";

import { useRouter } from "next/navigation";
import { createScene } from "@/lib/api";

export default function CreateSceneButton({
  worldId,
}: {
  worldId: string;
}) {
  const router = useRouter();

  async function handleClick() {
    try {
      const scene = await createScene(worldId);
      router.push(`/worlds/${worldId}/scenes/${scene.id}`);
    } catch (e) {
      alert("Failed to create scene. Check backend logs.");
    }
  }

  return (
    <button style={{ marginTop: 16 }} onClick={handleClick}>
      + Create Scene
    </button>
  );
}
