"use client";

type TimelineEvent = {
  id: string;
  type: "create" | "edit" | "rewrite" | "restore";
  label: string;
  timestamp: number;
  snapshot: string;
};

type Props = {
  events?: TimelineEvent[]; // ← может быть undefined
  onSelect: (text: string) => void;
};

export default function SceneTimeline({
  events = [], // ← защита по умолчанию
  onSelect,
}: Props) {
  return (
    <aside className="w-72 border-l p-4 overflow-y-auto text-sm">
      <h2 className="font-bold mb-3">Timeline</h2>

      <ul className="space-y-3">
  {events.length === 0 && (
    <li className="text-sm text-gray-400">
      Timeline is empty
    </li>
  )}

  {events.map((e) => (
    <li key={e.id} className="border-l-2 pl-3">
      ...
    </li>
  ))}
</ul>

    </aside>
  );
}

function icon(type: string) {
  switch (type) {
    case "create":
      return "🟢";
    case "edit":
      return "✏️";
    case "rewrite":
      return "🤖";
    case "restore":
      return "⏪";
    default:
      return "•";
  }
}
