import useSWR from 'swr';
import { subnameClient } from '@/services/subname-client';
import type { CreateSubnameDTO, PaginatedResponse, SubnameResponseDTO, UpdateSubnameDTO } from '@/types/subname.types';
import { useToast } from '@/components/ui/hooks/use-toast';
import { type ActionType, TOAST_MESSAGES, type ToastType } from '@/constants/toastMessages';
import { useCallback, useState } from 'react';

export const useSubnames = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unexpected error occurred';
  };

  const showToast = useCallback(
    (
      type: ToastType,
      action: ActionType,
      data?: { label?: string; parentName?: string },
    ) => {
      const message =
        type === 'success'
          ? TOAST_MESSAGES.success[action]
          : TOAST_MESSAGES.error[action];

      if (!message) return;

      if (typeof message === 'function' && data) {
        toast({
          variant: type === 'error' ? 'destructive' : 'default',
          ...message(data.label ?? '', data.parentName ?? ''),
        });
      } else if (typeof message === 'object') {
        toast({
          variant: type === 'error' ? 'destructive' : 'default',
          ...message,
        });
      }
    },
    [toast],
  );

  const { data: subnames, error: subNamesError, isLoading, mutate } =
    useSWR<PaginatedResponse<SubnameResponseDTO>>(
      '/api/subnames?page=1&pageSize=10',
      () => subnameClient.getAll(),
    );

    const changePage = async (newPage: number) => {
      if (newPage >= 1 && newPage <= (subnames?.meta.totalPages || 0)) {
        const response = await subnameClient.getAll(newPage, subnames?.meta.pageSize);
        await mutate((prev: PaginatedResponse<SubnameResponseDTO> | undefined) => {
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
        }, false);
      }
    };

  const createSubname = async (data: CreateSubnameDTO) => {
    try {
      setIsCreating(true);
      const result = await subnameClient.create(data);
      await mutate();
      showToast('success', 'create', {
        label: data.label,
        parentName: data.parentName,
      });
      return result;
    } catch (err) {
      showToast('error', 'create');
      throw getErrorMessage(err);
    } finally {
      setIsCreating(false);
    }
  };

  const updateSubname = async (id: string, data: UpdateSubnameDTO) => {
    try {
      const result = await subnameClient.update(id, data);
      await mutate();
      showToast('success', 'update');
      return result;
    } catch (err) {
      showToast('error', 'update');
      throw getErrorMessage(err);
    }
  };

  const deleteSubname = async (id: string) => {
    try {
      await subnameClient.delete(id);
      await mutate();
      showToast('success', 'delete');
    } catch (err) {
      console.log('err:', err);
      showToast('error', 'delete');
      throw getErrorMessage(err);
    }
  };

  return {
    subnames: subnames?.data || [],
    isLoading,
    error: subNamesError,
    isCreating,
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