import { useToast } from "@/components/ui/hooks/use-toast";
import { TOAST_MESSAGES } from "@/constants/toastMessages";
import { apiKeyClient } from "@/services/api-key/api-key-client";
import type { ApiKey, ApiKeyResponse } from "@/types/api-keys.type";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { useAuth } from "./useAuth";

const API_KEYS_KEY = "/api/keys";

export function useApiKeys() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();

  const {
    data: apiKeys = [],
    isLoading,
    error,
  } = useSWR<ApiKey[]>(
    isAuthenticated ? API_KEYS_KEY : null,
    () => apiKeyClient.getAll(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 2000,
    },
  );

  const createApiKey = async (name: string): Promise<ApiKeyResponse | null> => {
    try {
      setIsSubmitting(true);
      const response = await apiKeyClient.create(name);
      await mutate(API_KEYS_KEY);
      toast(TOAST_MESSAGES.success.key);
      return response;
    } catch (error) {
      toast(TOAST_MESSAGES.error.key);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const revokeApiKey = async (id: string): Promise<void> => {
    try {
      await apiKeyClient.revoke(id);
      await mutate(API_KEYS_KEY);
      toast(TOAST_MESSAGES.success.revoke);
    } catch (error) {
      toast(TOAST_MESSAGES.error.revoke);
      throw error;
    }
  };

  const deleteApiKey = async (id: string): Promise<void> => {
    try {
      await apiKeyClient.delete(id);
      await mutate(API_KEYS_KEY);
      toast(TOAST_MESSAGES.success.deleteKey);
    } catch (error) {
      toast(TOAST_MESSAGES.error.deleteKey);
      throw error;
    }
  };

  return {
    apiKeys,
    isLoading,
    isError: !!error,
    isSubmitting,
    createApiKey,
    revokeApiKey,
    deleteApiKey,
  };
}
