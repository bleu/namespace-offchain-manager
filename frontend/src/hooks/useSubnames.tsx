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
import { useCallback, useState } from "react";
import useSWR from "swr";

export const useSubnames = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { ensNames } = useEnsStore();
  const { toast } = useToast();

  const names = ensNames?.map((name) => name.name) || [];

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

      if (typeof message === "function" && data) {
        toast({
          variant: type === "error" ? "destructive" : "default",
          ...message(data.label ?? "", data.parentName ?? ""),
        });
      } else if (typeof message === "object") {
        toast({
          variant: type === "error" ? "destructive" : "default",
          ...message,
        });
      }
    },
    [toast],
  );
  const {
    data: subnames,
    error: subNamesError,
    isLoading,
    mutate,
  } = useSWR<PaginatedResponse<SubnameResponseDTO>>(
    "/api/subnames?page=1&pageSize=10",
    () => subnameClient.getAll(1, 10, names),
  );

  const changePage = async (newPage: number) => {
    if (newPage >= 1 && newPage <= (subnames?.meta.totalPages || 0)) {
      const response = await subnameClient.getAll(
        newPage,
        subnames?.meta.pageSize,
      );
      await mutate(
        (prev: PaginatedResponse<SubnameResponseDTO> | undefined) => {
          if (prev) {
            return {
              ...prev,
              data: response.data,
              meta: {
                ...prev.meta,
                page: newPage,
              },
            };
          }
          return prev;
        },
        false,
      );
    }
  };

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
