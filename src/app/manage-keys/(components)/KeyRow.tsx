import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { Ban, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import type { KeyRowProps } from "../types";

export function KeyRow({ apiKey, onRevoke, onDelete }: KeyRowProps) {
  const [actionInProgress, setActionInProgress] = useState(false);

  const handleRevoke = async () => {
    if (
      window.confirm(
        "Are you sure you want to revoke this API key? This action cannot be undone.",
      )
    ) {
      setActionInProgress(true);
      try {
        await onRevoke(apiKey.id);
      } finally {
        setActionInProgress(false);
      }
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this API key? This action cannot be undone.",
      )
    ) {
      setActionInProgress(true);
      try {
        await onDelete(apiKey.id);
      } finally {
        setActionInProgress(false);
      }
    }
  };

  return (
    <Card className={apiKey.isRevoked ? "opacity-75" : ""}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{apiKey.name}</h3>
              {apiKey.isRevoked && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  Revoked
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Created: {new Date(apiKey.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-muted-foreground">
              Expires:{" "}
              {apiKey.expiresAt
                ? new Date(apiKey.expiresAt).toLocaleDateString()
                : "Never"}
            </p>
          </div>
          {!apiKey.isRevoked ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={actionInProgress}>
                  {actionInProgress ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Actions"
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={handleRevoke}
                  className="text-orange-600"
                >
                  <Ban className="h-4 w-4 mr-2" />
                  Revoke
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={actionInProgress}
            >
              {actionInProgress ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
