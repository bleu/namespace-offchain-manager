export type ApiError = {
  message: string;
  statusCode: number;
};

export const apiClient = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (response.status === 401) {
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    throw new Error(response.statusText || "An error occurred");
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json();
};
