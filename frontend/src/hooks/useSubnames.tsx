import { useToast } from "@/components/ui/hooks/use-toast";
import { subnameClient } from "@/services/subname-client";
import type {
  CreateSubnameDTO,
  SubnameResponseDTO,
  UpdateSubnameDTO,
} from "@/types/subname.types";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export const useSubnames = () => {
  const [subnames, setSubnames] = useState<SubnameResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.error || "An unexpected error occurred";
    }
    return error instanceof Error
      ? error.message
      : "An unexpected error occurred";
  };

  const fetchSubnames = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await subnameClient.getAll();
      setSubnames(data);
      setError(null);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const createSubname = async (data: CreateSubnameDTO) => {
    try {
      setIsCreating(true);
      const result = await subnameClient.create(data);
      await fetchSubnames();
      toast({
        title: "Success",
        description: `Subname ${data.label}.${data.parentName} created successfully`,
      });
      return result;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  const updateSubname = async (id: string, data: UpdateSubnameDTO) => {
    try {
      const result = await subnameClient.update(id, data);
      await fetchSubnames();
      toast({
        title: "Success",
        description: "Subname updated successfully",
      });
      return result;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
      throw err;
    }
  };

  const deleteSubname = async (id: string) => {
    try {
      await subnameClient.delete(id);
      await fetchSubnames();
      toast({
        title: "Success",
        description: "Subname deleted successfully",
      });
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
      throw err;
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
    updateSubname,
    deleteSubname,
  };
};
