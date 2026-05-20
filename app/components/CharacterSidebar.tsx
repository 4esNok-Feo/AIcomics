export default function CharacterSidebar() {
  const characters = ["Mira", "Alex"];

  return (
    <aside className="w-60 border-r p-4">
      <h2 className="font-bold mb-4">Персонажи</h2>

      <ul className="space-y-2">
        {characters.map((name) => (
          <li key={name} className="text-sm">
            • {name}
          </li>
        ))}
      </ul>
    </aside>
  );
}
