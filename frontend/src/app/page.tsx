"use client";

import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tab";
import { useAuth } from "@/hooks/useAuth";
import { useSubnames } from "@/hooks/useSubnames";
import type { CreateSubnameDTO, UpdateSubnameDTO } from "@/types/subname.types";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useAccount } from "wagmi";
import { CreateSubnameForm } from "./(components)/CreateSubnameForm";
import { SubnameList } from "./(components)/SubnameList";

export default function Page() {
  const [selectedSubnameId, setSelectedSubnameId] = useState<string | null>(
    null,
  );
  const [activeTab, onTabChange] = useState("list");
  const { isAuthenticated } = useAuth();
  const { isConnected, isConnecting } = useAccount();

  const {
    subnames,
    isLoading,
    isSubmitting,
    createSubname,
    deleteSubname,
    updateSubname,
    pagination,
    onChangePage,
  } = useSubnames();

  const selectedSubname = selectedSubnameId
    ? subnames.find((s) => s.id === selectedSubnameId) || null
    : null;

  const handleBack = () => {
    setSelectedSubnameId(null);
  };

  const handleCreate = async (data: CreateSubnameDTO) => {
    await createSubname(data);
    onTabChange("list");
  };

  const handleUpdate = async (data: UpdateSubnameDTO) => {
    if (!selectedSubname) return;
    await updateSubname(selectedSubname.id, data);
    setSelectedSubnameId(null);
  };

  if (isLoading) return <Loading />;

  if (!isConnected && !isConnecting)
    return <span>Please, connect to you wallet to manage your subnames</span>;

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            {selectedSubname ? (
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <CardTitle>Edit {selectedSubname.name}</CardTitle>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <CardTitle>Manage Subnames</CardTitle>
                <span className="text-sm font-medium text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
                  {pagination.total} subname{pagination.total !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {selectedSubname ? (
            <CreateSubnameForm
              subname={selectedSubname}
              onSubmit={handleUpdate}
              onCancel={handleBack}
              isSubmitting={isSubmitting}
              isAuthenticated={isAuthenticated}
            />
          ) : (
            <Tabs value={activeTab} onValueChange={onTabChange}>
              <TabsList>
                <TabsTrigger value="list">Subname List</TabsTrigger>
                <TabsTrigger value="create">Create Subname</TabsTrigger>
              </TabsList>
              <TabsContent value="list" className="mt-6">
                <SubnameList
                  subnames={subnames}
                  onEdit={setSelectedSubnameId}
                  onDelete={deleteSubname}
                  isAuthenticated={isAuthenticated}
                />
                {pagination && subnames.length > 0 && (
                  <Pagination
                    meta={pagination}
                    onPageChange={onChangePage}
                    isLoading={isLoading}
                    showPageSize={true}
                  />
                )}
              </TabsContent>
              <TabsContent value="create" className="mt-6">
                <CreateSubnameForm
                  onSubmit={handleCreate}
                  isSubmitting={isSubmitting}
                  isAuthenticated={isAuthenticated}
                />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
