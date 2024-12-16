import { useToast } from "@/components/ui/hooks/use-toast";
import { TOAST_MESSAGES } from "@/constants/toastMessages";
import { apiKeyClient } from "@/services/api-key/client";
import type {
  ApiKeyResponse,
  PaginatedApiKeyResponse,
} from "@/types/api-keys.type";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { useAuth } from "./useAuth";

const API_KEYS_KEY = "/api/keys";

export function useApiKeys(initialPage = 1, initialPageSize = 10) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const {
    data: paginatedResponse,
    isLoading,
    error,
  } = useSWR<PaginatedApiKeyResponse>(
    isAuthenticated
      ? `${API_KEYS_KEY}?page=${page}&pageSize=${pageSize}`
      : null,
    () => apiKeyClient.getAll(page, pageSize),
    {
      revalidateOnFocus: false,
      dedupingInterval: 2000,
    }
  );

  const createApiKey = async (name: string): Promise<ApiKeyResponse | null> => {
    try {
      setIsSubmitting(true);
      const response = await apiKeyClient.create(name);
      await mutate(`${API_KEYS_KEY}?page=1&pageSize=${pageSize}`);
      if (page !== 1) {
        setPage(1);
      }
      toast(TOAST_MESSAGES.success.apiKey);
      return response;
    } catch (error) {
      toast(TOAST_MESSAGES.error.apiKey);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const revokeApiKey = async (id: string): Promise<void> => {
    try {
      await apiKeyClient.revoke(id);
      await mutate(`${API_KEYS_KEY}?page=${page}&pageSize=${pageSize}`);
      toast(TOAST_MESSAGES.success.revokeApiKey);
    } catch (error) {
      toast(TOAST_MESSAGES.error.revokeApiKey);
      throw error;
    }
  };

  const deleteApiKey = async (id: string): Promise<void> => {
    try {
      await apiKeyClient.delete(id);
      if (paginatedResponse?.data.length === 1 && page > 1) {
        setPage(page - 1);
      }
      await mutate(`${API_KEYS_KEY}?page=${page}&pageSize=${pageSize}`);
      toast(TOAST_MESSAGES.success.deleteApiKey);
    } catch (error) {
      toast(TOAST_MESSAGES.error.deleteApiKey);
      throw error;
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  return {
    apiKeys: paginatedResponse?.data ?? [],
    meta: paginatedResponse?.meta,
    page,
    pageSize,
    isLoading,
    isError: !!error,
    isSubmitting,
    createApiKey,
    revokeApiKey,
    deleteApiKey,
    handlePageChange,
    handlePageSizeChange,
  };
}
