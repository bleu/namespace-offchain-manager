import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tab";
import { ArrowLeft } from "lucide-react";
import type { ManageSubnamesProps } from "../types";
import { CreateSubnameForm } from "./CreateSubnameForm";
import { Pagination } from "./Pagination";
import { SubnameList } from "./SubnameList";

export const ManageSubnames = ({
  isLoading,
  subnames,
  selectedSubname,
  isCreating,
  pagination,
  onChangePage,
  onBack,
  onEdit,
  onDelete,
  onUpdate,
  onCreate,
}: ManageSubnamesProps) => {
  if (isLoading) return <Loading />;

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            {selectedSubname ? (
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onBack}>
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
              onSubmit={async (data) => {
                await onUpdate(selectedSubname.id, data);
              }}
              onCancel={onBack}
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
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
                <Pagination
                  pagination={pagination}
                  isLoading={isLoading}
                  onPageChange={onChangePage}
                />
              </TabsContent>

              <TabsContent value="create" className="mt-6">
                <CreateSubnameForm
                  onSubmit={onCreate}
                  isSubmitting={isCreating}
                />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
