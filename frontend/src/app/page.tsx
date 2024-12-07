"use client";

import { useAuth } from "@/hooks/useAuth";
import { useSubnames } from "@/hooks/useSubnames";
import type { CreateSubnameDTO, UpdateSubnameDTO } from "@/types/subname.types";
import { useState } from "react";
import { useAccount } from "wagmi";
import { ManageSubnames } from "./(components)/ManageSubnames";

export default function Page() {
  const [selectedSubnameId, setSelectedSubnameId] = useState<string | null>(
    null,
  );
  const [activeTab, onTabChange] = useState("list");
  const { isAuthenticated } = useAuth();
  const { isConnected } = useAccount();

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
      activeTab={activeTab}
      isConnected={isConnected}
      isAuthenticated={isAuthenticated}
      onTabChange={onTabChange}
      onChangePage={onChangePage}
      onBack={handleBack}
      onEdit={setSelectedSubnameId}
      onDelete={deleteSubname}
      onUpdate={handleUpdate}
      onCreate={handleCreate}
    />
  );
}
