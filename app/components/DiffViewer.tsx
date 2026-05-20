"use client";

import { DiffLine } from "@/lib/diff";

export function DiffViewer({ lines }: { lines: DiffLine[] }) {
  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      {lines.map((line) => {
        const base =
          "flex gap-3 px-3 py-1 font-mono text-sm whitespace-pre-wrap transition";

        const style =
          line.type === "add"
            ? "bg-green-50 text-green-900"
            : line.type === "remove"
            ? "bg-red-50 text-red-900 line-through"
            : "bg-white text-gray-800";

        return (
          <div
            key={line.id}
            className={`${base} ${style} hover:bg-opacity-70`}
          >
            <span className="w-5 text-right select-none opacity-60">
              {line.type === "add"
                ? "+"
                : line.type === "remove"
                ? "−"
                : ""}
            </span>

            <span className="flex-1">{line.value}</span>
          </div>
        );
      })}
    </div>
  );
}
