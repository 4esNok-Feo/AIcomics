"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Scene = {
  id: string;
  title: string;
};

type Character = {
  id: string;
  name: string;
  age: number;
  personality: string;
  behavior: string;
  traits: string;
};

export default function WorldPage() {
  const params = useParams();
  const worldId = params.id as string;

  const [scenes, setScenes] = useState<Scene[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [editingCharacterId, setEditingCharacterId] = useState<string | null>(null);
const [editingForm, setEditingForm] = useState({
  name: "",
  age: "",
  personality: "",
  behavior: "",
  traits: "",
});

  const [newSceneTitle, setNewSceneTitle] = useState("");

  const [characterForm, setCharacterForm] = useState({
    name: "",
    age: "",
    personality: "",
    behavior: "",
    traits: "",
  });

async function load(id: string) {
  const scenesRes = await fetch(`/api/worlds/${id}/scenes`);
  const charsRes = await fetch(`/api/worlds/${id}/characters`);

  const scenesData = await scenesRes.json();
  const charsData = await charsRes.json();

  setScenes(Array.isArray(scenesData) ? scenesData : scenesData.scenes || []);
  setCharacters(Array.isArray(charsData) ? charsData : charsData.characters || []);
}


  useEffect(() => {
    if (!worldId) return;
    load(worldId);
  }, [worldId]);

  async function createCharacter() {
    const res = await fetch(`/api/worlds/${worldId}/characters`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: characterForm.name,
        age: Number(characterForm.age),
        personality: characterForm.personality,
        behavior: characterForm.behavior,
        traits: characterForm.traits,
      }),
    });

    if (!res.ok) {
      console.error("Create character failed");
      return;
    }

    setCharacterForm({
      name: "",
      age: "",
      personality: "",
      behavior: "",
      traits: "",
    });

    load(worldId);
  }
  
  async function deleteCharacter(characterId: string) {
  const res = await fetch(
    `/api/worlds/${worldId}/characters/${characterId}`,
    { method: "DELETE" }
  );

  if (!res.ok) {
    console.error("Delete character failed");
    return;
  }

  load(worldId);
}

function startEdit(character: Character) {
  setEditingCharacterId(character.id);
  setEditingForm({
    name: character.name,
    age: String(character.age),
    personality: character.personality,
    behavior: character.behavior,
    traits: character.traits,
  });
}

async function saveEdit() {
  if (!editingCharacterId) return;

  const res = await fetch(
    `/api/worlds/${worldId}/characters/${editingCharacterId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editingForm.name,
        age:
  editingForm.age.trim() === ""
    ? null
    : Number(editingForm.age),
        personality: editingForm.personality,
        behavior: editingForm.behavior,
        traits: editingForm.traits,
      }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
console.error("Update character failed:", text);

    return;
  }

  setEditingCharacterId(null);
  load(worldId);
}


  async function createScene() {
    if (!newSceneTitle.trim()) return;

    const res = await fetch(`/api/worlds/${worldId}/scenes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newSceneTitle }),
    });

    if (!res.ok) {
      const t = await res.text();
      console.error("Create scene failed:", t);
      return;
    }

    const scene = await res.json();

    window.location.href = `/worlds/${worldId}/scenes/${scene.id}`;
  }

  return (
    <div className="p-6 space-y-8">

      {/* ===== Персонажи ===== */}
      <section>
        <h2 className="text-xl font-bold mb-2">Персонажи</h2>

        <div className="space-y-2 mb-4">
          <input
            placeholder="Имя"
            value={characterForm.name}
            onChange={e =>
              setCharacterForm({ ...characterForm, name: e.target.value })
            }
          />

          <input
            placeholder="Возраст"
            value={characterForm.age}
            onChange={e =>
              setCharacterForm({ ...characterForm, age: e.target.value })
            }
          />

          <textarea
            placeholder="Характер"
            value={characterForm.personality}
            onChange={e =>
              setCharacterForm({ ...characterForm, personality: e.target.value })
            }
          />

          <textarea
            placeholder="Поведение"
            value={characterForm.behavior}
            onChange={e =>
              setCharacterForm({ ...characterForm, behavior: e.target.value })
            }
          />

          <textarea
            placeholder="Особенности"
            value={characterForm.traits}
            onChange={e =>
              setCharacterForm({ ...characterForm, traits: e.target.value })
            }
          />

          <button onClick={createCharacter}>
            Создать персонажа
          </button>
        </div>

        {characters.map(c => (
  <div key={c.id} className="mb-4 border p-3 rounded">

    {editingCharacterId === c.id ? (
      <div className="space-y-2">
        <input
          value={editingForm.name}
          onChange={e => setEditingForm({ ...editingForm, name: e.target.value })}
        />

        <input
          value={editingForm.age}
          onChange={e => setEditingForm({ ...editingForm, age: e.target.value })}
        />

        <textarea
          value={editingForm.personality}
          onChange={e =>
            setEditingForm({ ...editingForm, personality: e.target.value })
          }
        />

        <textarea
          value={editingForm.behavior}
          onChange={e =>
            setEditingForm({ ...editingForm, behavior: e.target.value })
          }
        />

        <textarea
          value={editingForm.traits}
          onChange={e =>
            setEditingForm({ ...editingForm, traits: e.target.value })
          }
        />

        <div className="flex gap-2">
          <button onClick={saveEdit}>Сохранить</button>
          <button onClick={() => setEditingCharacterId(null)}>
            Отмена
          </button>
        </div>
      </div>
    ) : (
      <>
        <b>{c.name}</b>, {c.age} лет
        <div>Характер: {c.personality}</div>
        <div>Поведение: {c.behavior}</div>
        <div>Особенности: {c.traits}</div>

        <div className="flex gap-3 mt-2">
          <button
            className="underline text-sm"
            onClick={() => startEdit(c)}
          >
            Редактировать
          </button>

          <button
            className="underline text-sm text-red-600"
            onClick={() => deleteCharacter(c.id)}
          >
            Удалить
          </button>
        </div>
      </>
    )}

  </div>
))}

      </section>

      {/* ===== Сцены ===== */}
      <section>
        <h2 className="text-xl font-bold mb-2">Сцены</h2>

        <div className="flex gap-2 mb-3">
          <input
            placeholder="Название сцены"
            value={newSceneTitle}
            onChange={e => setNewSceneTitle(e.target.value)}
            className="border px-2 py-1"
          />

          <button onClick={createScene}>Создать</button>
        </div>

        {scenes.map(s => (
          <div
            key={s.id}
            className="cursor-pointer underline"
            onClick={() =>
              window.location.href = `/worlds/${worldId}/scenes/${s.id}`
            }
          >
            {s.title}
          </div>
        ))}
      </section>

    </div>
  );
}
