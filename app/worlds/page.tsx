"use client";

import { useEffect, useState } from "react";

type World = {
  id: string;
  name: string;
  description: string;
};

export default function WorldsPage() {
  const [worlds, setWorlds] = useState<World[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadWorlds() {
    const res = await fetch("/api/worlds");
    const data = await res.json();
    setWorlds(data);
  }

  useEffect(() => {
    loadWorlds();
  }, []);

  async function createWorld() {
    if (!name.trim()) return;

    setLoading(true);

    await fetch("/api/worlds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });

    setName("");
    setDescription("");

    await loadWorlds();
    setLoading(false);
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">🌍 Миры</h1>

      {/* CREATE WORLD */}
      <div className="border p-4 rounded space-y-2">
        <input
          className="border p-2 w-full"
          placeholder="Название мира"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="border p-2 w-full"
          placeholder="Описание мира"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          onClick={createWorld}
          disabled={loading}
          className="border px-4 py-2 rounded"
        >
          {loading ? "Создание..." : "Создать мир"}
        </button>
      </div>

      {/* WORLDS LIST */}
      <div className="space-y-2">
        {worlds.length === 0 && (
          <div className="text-gray-500">Пока миров нет</div>
        )}

        {worlds.map((world) => (
          <a
            key={world.id}
            href={`/worlds/${world.id}`}
            className="block border p-3 rounded hover:bg-gray-50"
          >
            <div className="font-semibold">{world.name}</div>
            <div className="text-sm text-gray-600">
              {world.description}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
