"use client";
import { useState } from "react";

export default function CharacterForm({
  worldId,
  onCreated,
}: {
  worldId: string;
  onCreated?: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    age: "",
    personality: "",
    behavior: "",
    traits: "",
  });

  async function createCharacter() {
    const res = await fetch(`/api/worlds/${worldId}/characters`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        age: Number(form.age),
      }),
    });

    if (!res.ok) return;

    setForm({
      name: "",
      age: "",
      personality: "",
      behavior: "",
      traits: "",
    });

    onCreated?.();
  }

  return (
    <div className="space-y-2 border p-3">
      <input placeholder="Имя"
        value={form.name}
        onChange={e => setForm({...form,name:e.target.value})}
      />

      <input placeholder="Возраст"
        value={form.age}
        onChange={e => setForm({...form,age:e.target.value})}
      />

      <textarea placeholder="Характер"
        value={form.personality}
        onChange={e => setForm({...form,personality:e.target.value})}
      />

      <textarea placeholder="Поведение"
        value={form.behavior}
        onChange={e => setForm({...form,behavior:e.target.value})}
      />

      <textarea placeholder="Особенности"
        value={form.traits}
        onChange={e => setForm({...form,traits:e.target.value})}
      />

      <button onClick={createCharacter}>
        Создать персонажа
      </button>
    </div>
  );
}
