"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import { useApiKeys } from "@/hooks/useApiKeys";
import { useAuth } from "@/hooks/useAuth";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useAccount } from "wagmi";
import { CreateKeyDialog } from "./(components)/CreateKeyDialog";
import { KeysList } from "./(components)/KeyList";

export default function ManageKeysPage() {
  const { isAuthenticated } = useAuth();
  const { isConnected } = useAccount();
  const {
    apiKeys,
    isLoading,
    isSubmitting,
    createApiKey,
    revokeApiKey,
    deleteApiKey,
  } = useApiKeys();

  const [showCreateDialog, setShowCreateDialog] = useState(false);

  if (isLoading) return <Loading />;

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
          <KeysList
            keys={apiKeys}
            onRevoke={revokeApiKey}
            onDelete={deleteApiKey}
          />
        </CardContent>
      </Card>

      <CreateKeyDialog
        isOpen={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={createApiKey}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
