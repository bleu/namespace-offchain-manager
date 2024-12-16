import type { KeysListProps } from "../types";
import { KeyRow } from "./KeyRow";

export function KeysList({ keys, onRevoke, onDelete }: KeysListProps) {
  if (keys.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No API keys found. Create one to get started.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {keys.map((key) => (
        <KeyRow
          key={key.id}
          apiKey={key}
          onRevoke={onRevoke}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
