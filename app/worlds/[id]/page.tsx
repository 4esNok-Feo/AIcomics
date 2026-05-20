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
          age: editingForm.age.trim() === "" ? null : Number(editingForm.age),
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Заголовок */}
        <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Управление миром
        </h1>

        {/* ===== Блок Персонажи ===== */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-blue-400 border-b-2 border-blue-400/30 pb-2">
            👥 Персонажи
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Левая колонка - форма создания */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-purple-400">Создание нового персонажа</h3>
              
              <div className="space-y-4 max-w-md mx-auto">
                <input
                  placeholder="Имя персонажа"
                  value={characterForm.name}
                  onChange={e => setCharacterForm({ ...characterForm, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400"
                />

                <input
                  placeholder="Возраст"
                  value={characterForm.age}
                  onChange={e => setCharacterForm({ ...characterForm, age: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400"
                />

                <textarea
                  placeholder="Характер"
                  value={characterForm.personality}
                  onChange={e => setCharacterForm({ ...characterForm, personality: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400 resize-none"
                />

                <textarea
                  placeholder="Поведение"
                  value={characterForm.behavior}
                  onChange={e => setCharacterForm({ ...characterForm, behavior: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400 resize-none"
                />

                <textarea
                  placeholder="Особенности"
                  value={characterForm.traits}
                  onChange={e => setCharacterForm({ ...characterForm, traits: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400 resize-none"
                />

                <button 
                  onClick={createCharacter}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 transform hover:scale-[1.02]"
                >
                  ✨ Создать персонажа
                </button>
              </div>
            </div>

            {/* Правая колонка - список персонажей */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-purple-400">Созданные персонажи</h3>
              
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {characters.map(c => (
                  <div key={c.id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 hover:border-blue-500 transition duration-200">
                    
                    {editingCharacterId === c.id ? (
                      <div className="space-y-3">
                        <input
                          value={editingForm.name}
                          onChange={e => setEditingForm({ ...editingForm, name: e.target.value })}
                          className="w-full px-3 py-1 bg-gray-600 border border-gray-500 rounded text-gray-100"
                          placeholder="Имя"
                        />

                        <input
                          value={editingForm.age}
                          onChange={e => setEditingForm({ ...editingForm, age: e.target.value })}
                          className="w-full px-3 py-1 bg-gray-600 border border-gray-500 rounded text-gray-100"
                          placeholder="Возраст"
                        />

                        <textarea
                          value={editingForm.personality}
                          onChange={e => setEditingForm({ ...editingForm, personality: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-1 bg-gray-600 border border-gray-500 rounded text-gray-100 resize-none"
                          placeholder="Характер"
                        />

                        <textarea
                          value={editingForm.behavior}
                          onChange={e => setEditingForm({ ...editingForm, behavior: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-1 bg-gray-600 border border-gray-500 rounded text-gray-100 resize-none"
                          placeholder="Поведение"
                        />

                        <textarea
                          value={editingForm.traits}
                          onChange={e => setEditingForm({ ...editingForm, traits: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-1 bg-gray-600 border border-gray-500 rounded text-gray-100 resize-none"
                          placeholder="Особенности"
                        />

                        <div className="flex gap-2 pt-2">
                          <button 
                            onClick={saveEdit}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded transition"
                          >
                            Сохранить
                          </button>
                          <button 
                            onClick={() => setEditingCharacterId(null)}
                            className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-1 px-3 rounded transition"
                          >
                            Отмена
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-lg text-blue-400">{c.name}</h4>
                            <span className="text-sm text-gray-400">{c.age} лет</span>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(c)}
                              className="text-sm text-blue-400 hover:text-blue-300 transition"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => deleteCharacter(c.id)}
                              className="text-sm text-red-400 hover:text-red-300 transition"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>

                        <div className="mt-3 space-y-2 text-sm">
                          <div>
                            <span className="font-semibold text-purple-400">Характер:</span>
                            <p className="text-gray-300 mt-1">{c.personality}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-purple-400">Поведение:</span>
                            <p className="text-gray-300 mt-1">{c.behavior}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-purple-400">Особенности:</span>
                            <p className="text-gray-300 mt-1">{c.traits}</p>
                          </div>
                        </div>
                      </>
                    )}

                  </div>
                ))}

                {characters.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Пока нет созданных персонажей
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ===== Блок Сцены ===== */}
        <section className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-green-400 border-b-2 border-green-400/30 pb-2">
            🎬 Сцены
          </h2>

          <div className="max-w-2xl mx-auto">
            {/* Форма создания сцены */}
            <div className="flex gap-3 mb-6">
              <input
                placeholder="Введите название новой сцены"
                value={newSceneTitle}
                onChange={e => setNewSceneTitle(e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-100 placeholder-gray-400"
              />

              <button 
                onClick={createScene}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 transform hover:scale-[1.02]"
              >
                Создать
              </button>
            </div>

            {/* Список сцен */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {scenes.map(s => (
                <div
                  key={s.id}
                  onClick={() => window.location.href = `/worlds/${worldId}/scenes/${s.id}`}
                  className="group bg-gray-700/50 hover:bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-green-500 cursor-pointer transition duration-200 transform hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl group-hover:rotate-12 transition">🎬</span>
                    <span className="font-medium text-gray-200 group-hover:text-green-400 transition">
                      {s.title}
                    </span>
                  </div>
                </div>
              ))}

              {scenes.length === 0 && (
                <div className="col-span-2 text-center py-8 text-gray-500">
                  Создайте первую сцену
                </div>
              )}
            </div>
          </div>
        </section>

      </div>

      {/* Стили для скроллбара */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.8);
        }
      `}</style>
    </div>
  );
}