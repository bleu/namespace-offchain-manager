import type { SubnameResponseDTO } from "@/types/subname.types";
import { SubnameRow } from "./SubnameRow";

interface SubnameListProps {
  subnames: SubnameResponseDTO[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
}

export const SubnameList = ({
  subnames,
  onEdit,
  onDelete,
}: SubnameListProps) => {
  if (!subnames.length) {
    return (
      <div className="text-center text-muted-foreground p-6">
        No subnames found. Create one to get started.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {subnames.map((subname) => (
        <SubnameRow
          key={subname.id}
          subname={subname}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};