import { diffLines } from "diff";

export type DiffLine = {
  type: "add" | "remove" | "same";
  value: string;
  id: string;
};

export function buildDiff(before: string, after: string): DiffLine[] {
  const parts = diffLines(before, after);

  return parts.flatMap((part) =>
    part.value.split("\n").map((line) => ({
      id: crypto.randomUUID(),
      type: part.added
        ? "add"
        : part.removed
        ? "remove"
        : "same",
      value: line,
    }))
  );
}
