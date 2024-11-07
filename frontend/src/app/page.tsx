"use client";

import { Loading } from "@/components/ui/loading";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useSubnames } from "@/hooks/useSubnames";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tab";
import { CreateSubnameForm } from "./(components)/CreateSubnameForm";
import { SubnameList } from "./(components)/SubnameList";

export default function Home() {
  const [selectedSubnameId, setSelectedSubnameId] = useState<string | null>(null);
  const {
    subnames,
    isLoading,
    error,
    isCreating,
    createSubname,
    deleteSubname,
    updateSubname,
  } = useSubnames();

  const selectedSubname = selectedSubnameId 
    ? subnames.find(s => s.id === selectedSubnameId)
    : null;

  const handleBack = () => {
    setSelectedSubnameId(null);
  };

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <Card className="p-4 bg-destructive/10 text-destructive">
        {error}
      </Card>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            {selectedSubnameId ? (
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <CardTitle>
                  {selectedSubname ? `Edit ${selectedSubname.name}` : 'Edit Subname'}
                </CardTitle>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <CardTitle>Manage Subnames</CardTitle>  
                <span className="text-sm font-medium text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
                  {subnames.length} subname{subnames.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {selectedSubnameId ? (
            <CreateSubnameForm
              subname={selectedSubname}
              onSubmit={async (data) => {
                await updateSubname(selectedSubnameId, data);
                setSelectedSubnameId(null);
              }}
              onCancel={handleBack}
              isSubmitting={isCreating}
            />
          ) : (
            <Tabs defaultValue="list">
              <TabsList>
                <TabsTrigger value="list">Subname List</TabsTrigger>
                <TabsTrigger value="create">Create Subname</TabsTrigger>
              </TabsList>

              <TabsContent value="list" className="mt-6">
                <SubnameList
                  subnames={subnames}
                  onEdit={setSelectedSubnameId}
                  onDelete={deleteSubname}
                />
              </TabsContent>

              <TabsContent value="create" className="mt-6">
                <CreateSubnameForm
                  onSubmit={createSubname}
                  isSubmitting={isCreating}
                />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}