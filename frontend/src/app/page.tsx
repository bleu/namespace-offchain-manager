"use client";

import { useSubnames } from "@/hooks/useSubnames";
import type { CreateSubnameDTO, UpdateSubnameDTO } from "@/types/subname.types";
import { useState } from "react";
import { ManageSubnames } from "./(components)/ManageSubnames";

export default function Page() {
  const [selectedSubnameId, setSelectedSubnameId] = useState<string | null>(
    null,
  );

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
      isSubmitting={isSubmitting}
      pagination={pagination}
      onChangePage={onChangePage}
      onBack={handleBack}
      onEdit={setSelectedSubnameId}
      onDelete={deleteSubname}
      onUpdate={handleUpdate}
      onCreate={handleCreate}
    />
  );
}
