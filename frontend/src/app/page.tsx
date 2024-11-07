"use client";

import { useState } from "react";
import { useSubnames } from "@/hooks/useSubnames";
import { ManageSubnames } from "./(components)/ManageSubnames";
import type { CreateSubnameDTO, UpdateSubnameDTO } from "@/types/subname.types";

export default function Page() {
  const [selectedSubnameId, setSelectedSubnameId] = useState<string | null>(null);
  
  const {
    subnames,
    isLoading,
    isCreating,
    createSubname,
    deleteSubname,
    updateSubname,
  } = useSubnames();

  const selectedSubname = selectedSubnameId
    ? subnames.find((s) => s.id === selectedSubnameId) || null
    : null;

  const handleBack = () => {
    setSelectedSubnameId(null);
  };

  const handleCreate = async (data: CreateSubnameDTO) => {
    await createSubname(data);
  };

  const handleUpdate = async (id: string, data: UpdateSubnameDTO) => {
    await updateSubname(id, data);
    setSelectedSubnameId(null);
  };

  return (
    <ManageSubnames
      isLoading={isLoading}
      subnames={subnames}
      selectedSubname={selectedSubname}
      isCreating={isCreating}
      onBack={handleBack}
      onEdit={setSelectedSubnameId}
      onDelete={deleteSubname}
      onUpdate={handleUpdate}
      onCreate={handleCreate}
    />
  );
}