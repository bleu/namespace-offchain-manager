"use client";

import { CopyableField } from "@/components/copyableField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { Input } from "@/components/ui/input";
import { useApiKeys } from "@/hooks/useApiKeys";
import { useAuth } from "@/hooks/useAuth";
import { Ban, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAccount } from "wagmi";

export default function ManageKeysPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { isConnected } = useAccount();
  const {
    apiKeys,
    isLoading,
    isError,
    isSubmitting,
    createApiKey,
    revokeApiKey,
    deleteApiKey,
  } = useApiKeys();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newApiKey, setNewApiKey] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return;

    const response = await createApiKey(newKeyName);
    if (response?.apiKey) {
      setNewApiKey(response.apiKey);
    }
  };

  const handleDone = () => {
    setShowCreateDialog(false);
    setNewApiKey(null);
    setNewKeyName("");
  };

  const handleRevoke = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to revoke this API key? This action cannot be undone.",
      )
    ) {
      setActionInProgress(id);
      try {
        await revokeApiKey(id);
      } finally {
        setActionInProgress(null);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this API key? This action cannot be undone.",
      )
    ) {
      setActionInProgress(id);
      try {
        await deleteApiKey(id);
      } finally {
        setActionInProgress(null);
      }
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="text-center mt-8">
        Please connect your wallet to manage API keys.
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center mt-8">
        Please authenticate to manage API keys.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>API Keys</CardTitle>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create API Key
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : isError ? (
            <div className="text-center py-8 text-destructive">
              Error loading API keys. Please try again later.
            </div>
          ) : apiKeys.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No API keys found. Create one to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((key) => (
                <Card
                  key={key.id}
                  className={key.isRevoked ? "opacity-75" : ""}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{key.name}</h3>
                          {key.isRevoked && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                              Revoked
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Created:{" "}
                          {new Date(key.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Expires:{" "}
                          {key.expiresAt
                            ? new Date(key.expiresAt).toLocaleDateString()
                            : "Never"}
                        </p>
                      </div>
                      {!key.isRevoked ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={actionInProgress === key.id}
                            >
                              {actionInProgress === key.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Actions"
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleRevoke(key.id)}
                              className="text-orange-600"
                            >
                              <Ban className="h-4 w-4 mr-2" />
                              Revoke
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(key.id)}
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
                          onClick={() => handleDelete(key.id)}
                          disabled={actionInProgress === key.id}
                        >
                          {actionInProgress === key.id ? (
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
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create API Key</DialogTitle>
          </DialogHeader>
          {newApiKey ? (
            <div className="space-y-4">
              <div className="rounded-md bg-yellow-50 p-4">
                <p className="text-sm text-yellow-700">
                  Make sure to copy your API key now. You won't be able to see
                  it again!
                </p>
              </div>
              <CopyableField
                label="API Key"
                value={newApiKey}
                className="font-mono"
              />
              <DialogFooter>
                <Button onClick={handleDone}>Done</Button>
              </DialogFooter>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div>
                  <label htmlFor="keyName" className="text-sm font-medium">
                    Key Name
                  </label>
                  <Input
                    id="keyName"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="Enter a name for your API key"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateKey}
                  disabled={isSubmitting || !newKeyName.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create"
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
