export type ToastType = "error" | "success";

export type ActionType =
  | keyof typeof TOAST_MESSAGES.success
  | keyof typeof TOAST_MESSAGES.error;

export const TOAST_MESSAGES = {
  success: {
    fetch: null,
    create: (label: string, parentName: string) => ({
      title: "Success",
      description: `Subname ${label}.${parentName} created successfully`,
    }),
    update: {
      title: "Success",
      description: "Subname updated successfully",
    },
    delete: {
      title: "Success",
      description: "Subname deleted successfully",
    },
    siwe: {
      title: "Success",
      description: "Successfully signed in with Ethereum",
    },
    authentication: {
      title: "Success",
      description: "Authentication successful",
    },
    apiKey: {
      title: "Success",
      description: "API key created successfully",
    },
    deleteApiKey: {
      title: "Success",
      description: "API key deleted successfully",
    },
    revokeApiKey: {
      title: "Success",
      description: "API key revoked successfully",
    },
  },
  error: {
    fetch: {
      title: "Error",
      description: "Failed to fetch subnames",
    },
    create: {
      title: "Error",
      description: "Failed to create subname",
    },
    update: {
      title: "Error",
      description: "Failed to update subname",
    },
    delete: {
      title: "Error",
      description: "Failed to delete subname",
    },
    siwe: {
      title: "Error",
      description: "Failed to sign in with Ethereum",
    },
    authentication: {
      title: "Error",
      description: "Please sign in with Ethereum to manage subnames",
    },
    apiKey: {
      title: "Error",
      description: "Failed to create API key",
    },
    deleteApiKey: {
      title: "Error",
      description: "Failed to delete API key",
    },
    revokeApiKey: {
      title: "Error",
      description: "Failed to revoke API key",
    },
  },
} as const;

export type ToastMessage =
  | {
      title: string;
      description: string;
    }
  | null
  | ((
      label: string,
      parentName: string,
    ) => { title: string; description: string });
