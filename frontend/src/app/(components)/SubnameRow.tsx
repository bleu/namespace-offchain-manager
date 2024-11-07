import { CopyableField } from "@/components/copyableField";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SubnameResponseDTO } from "@/types/subname.types";
import { ChevronDown, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";

interface SubnameRowProps {
  subname: SubnameResponseDTO;
  onEdit: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
}

export const SubnameRow = ({ subname, onEdit, onDelete }: SubnameRowProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this subname?")) {
      setIsDeleting(true);
      try {
        await onDelete(subname.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Card className="overflow-hidden">
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 cursor-pointer hover:bg-accent/50 transition-colors flex items-center justify-between"
      >
        <div className="flex-1">
          <h3 className="font-medium">{subname.name}</h3>
          <p className="text-sm text-muted-foreground">
            {subname.texts.length} tex ts · {subname.addresses.length} addresses
          </p>
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-muted-foreground transition-transform duration-200",
            isExpanded ? "transform rotate-180" : "",
          )}
        />
      </div>

      <div
        className={cn(
          "grid transition-all duration-200 ease-in-out",
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <CardContent className="p-6 border-t bg-accent/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <CopyableField label="Parent" value={subname.parentName} />
                <CopyableField label="Subname " value={subname.label} />
                {subname.contenthash && (
                  <CopyableField
                    label="Content Hash"
                    value={subname.contenthash}
                  />
                )}
              </div>
              <div className="space-y-4">
                {subname.texts.length > 0 && (
                  <div>
                    <span className="text-sm font-medium">Texts</span>
                    {subname.texts.map((text) => (
                      <div key={text.id} className="mt-2">
                        <CopyableField label={text.key} value={text.value} />
                      </div>
                    ))}
                  </div>
                )}
                {subname.addresses.length > 0 && (
                  <div>
                    <span className="text-sm font-medium">Addresses</span>
                    {subname.addresses.map((address) => (
                      <div key={address.id} className="mt-2">
                        <CopyableField
                          label={`Coin ${address.coin}`}
                          value={address.value}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(subname.id);
                }}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
};
