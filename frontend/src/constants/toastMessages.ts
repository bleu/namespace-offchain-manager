export type ToastType = "error" | "success";
export type ActionType = "fetch" | "create" | "update" | "delete";

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
      title: "Success",
      description: "Failed to signed in with Ethereum",
    },  
  },
} as const;
