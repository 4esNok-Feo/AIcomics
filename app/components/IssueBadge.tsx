import { Issue } from "@/app/lib/api";
export default function IssueBadge({ issue }: { issue: Issue }) {
  const color =
    issue.severity === "high"
      ? "red"
      : issue.severity === "medium"
      ? "yellow"
      : "gray";

  return (
    <div className={`border-l-4 border-${color}-500 pl-2 my-1`}>
      <strong>{issue.type}</strong>: {issue.message}
    </div>
  );
}
