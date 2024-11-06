import type { SubnameResponseDTO } from "@/types/subname.types";
import { useState, useCallback, useEffect } from "react";

export const useSubnames = () => {
  const [subnames, setSubnames] = useState<SubnameResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const fetchSubnames = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/subnames");
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch subnames");
      }

      setSubnames(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createSubname = async (data: any) => {
    try {
      setIsCreating(true);
      const response = await fetch("/api/subnames/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create subname");
      }

      await fetchSubnames();
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const deleteSubname = async (id: string) => {
    try {
      const response = await fetch(`/api/subnames/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete subname");
      }

      await fetchSubnames();
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      throw error;
    }
  };

  const updateSubname = async (id: string, data: any) => {
    try {
      const response = await fetch(`/api/subnames/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update subname");
      }

      await fetchSubnames();
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      throw error;
    }
  };

  useEffect(() => {
    fetchSubnames();
  }, [fetchSubnames]);

  return {
    subnames,
    isLoading,
    error,
    isCreating,
    createSubname,
    deleteSubname,
    updateSubname,
  };
};