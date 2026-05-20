export default function CharactersPage() {
  const characters = [
    { id: "1", name: "Mira", fear: 80, aggression: 20 },
    { id: "2", name: "Alex", fear: 30, aggression: 60 },
  ];

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Персонажи</h1>

      <div className="space-y-4">
        {characters.map((c) => (
          <div key={c.id} className="border p-4 rounded">
            <h2 className="font-semibold">{c.name}</h2>

            <div className="text-sm text-gray-600">
              Страх: {c.fear} / Агрессия: {c.aggression}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
