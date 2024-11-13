import { useToast } from "@/components/ui/hooks/use-toast";
import {
  type ActionType,
  TOAST_MESSAGES,
  type ToastType,
} from "@/constants/toastMessages";
import { subnameClient } from "@/services/subname-client";
import { useEnsStore } from "@/states/useEnsStore";
import type {
  CreateSubnameDTO,
  PaginatedResponse,
  SubnameResponseDTO,
  UpdateSubnameDTO,
} from "@/types/subname.types";
import { useCallback, useMemo, useState } from "react";
import useSWR from "swr";
import { useAccount } from "wagmi";

export const useSubnames = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { ensNames } = useEnsStore();
  const { toast } = useToast();
  const { isConnected } = useAccount();

  const names = useMemo(
    () =>
      ensNames
        ?.filter((name) => name.name != null)
        .map((name) => name.name as string) || [],
    [ensNames],
  );

  const shouldFetch = isConnected && names.length > 0;

  const {
    data: subnames,
    error: subNamesError,
    isLoading,
    mutate,
  } = useSWR<PaginatedResponse<SubnameResponseDTO>>(
    shouldFetch ? ["subnames", names] : null,
    () => subnameClient.getAll(isConnected, 1, 10, names),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 5000,
    },
  );

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    return "An unexpected error occurred";
  };

  const showToast = useCallback(
    (
      type: ToastType,
      action: ActionType,
      data?: { label?: string; parentName?: string },
    ) => {
      const message =
        type === "success"
          ? TOAST_MESSAGES.success[action]
          : TOAST_MESSAGES.error[action];

      if (!message) return;

      toast({
        variant: type === "error" ? "destructive" : "default",
        ...(typeof message === "function" && data
          ? message(data.label ?? "", data.parentName ?? "")
          : message),
      });
    },
    [toast],
  );

  const changePage = useCallback(
    async (newPage: number) => {
      if (!shouldFetch) return;

      if (newPage >= 1 && newPage <= (subnames?.meta.totalPages || 0)) {
        try {
          const response = await subnameClient.getAll(
            isConnected,
            newPage,
            subnames?.meta.pageSize || 10,
            names,
          );
          await mutate(response, false);
        } catch (error) {
          console.error("Error changing page:", error);
          showToast("error", "fetch");
        }
      }
    },
    [shouldFetch, isConnected, names, subnames?.meta, mutate, showToast],
  );

  const createSubname = async (data: CreateSubnameDTO) => {
    try {
      setIsCreating(true);
      const result = await subnameClient.create(data);
      await mutate();
      showToast("success", "create", {
        label: data.label,
        parentName: data.parentName,
      });
      return result;
    } catch (err) {
      showToast("error", "create");
      throw getErrorMessage(err);
    } finally {
      setIsCreating(false);
    }
  };

  const updateSubname = async (id: string, data: UpdateSubnameDTO) => {
    try {
      setIsUpdating(true);
      const result = await subnameClient.update(id, data);
      console.log(result, "result");
      await mutate();
      showToast("success", "update");
      return result;
    } catch (err) {
      showToast("error", "update");
      throw getErrorMessage(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteSubname = async (id: string) => {
    try {
      await subnameClient.delete(id);
      await mutate();
      showToast("success", "delete");
    } catch (err) {
      showToast("error", "delete");
      throw getErrorMessage(err);
    }
  };

  return {
    subnames: subnames?.data || [],
    isLoading,
    error: subNamesError,
    isSubmitting: isCreating || isUpdating,
    pagination: {
      page: subnames?.meta.page,
      pageSize: subnames?.meta.pageSize,
      total: subnames?.meta.total,
      totalPages: subnames?.meta.totalPages,
      hasMore: subnames?.meta.hasMore,
    },
    onChangePage: changePage,
    createSubname,
    updateSubname,
    deleteSubname,
  };
};
