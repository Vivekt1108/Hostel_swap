import { QueryClient } from "@tanstack/react-query";

const defaultFetcher = async (url: string, options?: RequestInit) => {
  const sessionId = localStorage.getItem("sessionId");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options?.headers || {}),
  };

  if (sessionId) {
    headers.Authorization = `Bearer ${sessionId}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("sessionId");
      localStorage.removeItem("student");
      window.location.href = "/";
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: ({ queryKey }) => {
        const [url] = queryKey as [string];
        return defaultFetcher(url);
      },
      retry: (failureCount, error) => {
        if (error instanceof Error && error.message.includes("401")) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

export const apiRequest = async (
  url: string,
  options: RequestInit = {}
): Promise<any> => {
  return defaultFetcher(url, options);
};