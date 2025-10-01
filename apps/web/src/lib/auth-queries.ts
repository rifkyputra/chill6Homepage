import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "./auth-service";
import type { SignInData, SignUpData, AuthResponse } from "./auth-types";

// Query keys for consistent caching
export const authKeys = {
  all: ["auth"] as const,
  session: () => [...authKeys.all, "session"] as const,
  user: () => [...authKeys.all, "user"] as const,
};

/**
 * Hook for managing session state with TanStack Query
 * TanStack Query automatically handles request deduplication, caching, and background refetching
 */
export function useSession(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: () => AuthService.getSession(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error && typeof error === "object" && "status" in error) {
        const status = error.status as number;
        if (status === 401 || status === 403) {
          return false;
        }
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: "always", // Always check session on mount for security
    enabled: options?.enabled !== false,
  });
}

/**
 * Hook for signing in users
 */
export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignInData) => AuthService.signIn(data),
    onSuccess: (data: AuthResponse) => {
      // Update the session cache with the new user data
      queryClient.setQueryData(authKeys.session(), data);

      // Invalidate and refetch any related queries if needed
      queryClient.invalidateQueries({
        queryKey: authKeys.all,
        exact: false,
      });
    },
    onError: () => {
      // Clear session data on sign-in error
      queryClient.removeQueries({
        queryKey: authKeys.session(),
      });
    },
  });
}

/**
 * Hook for signing up users
 */
export function useSignUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignUpData) => AuthService.signUp(data),
    onSuccess: (data: AuthResponse) => {
      // Update the session cache with the new user data
      queryClient.setQueryData(authKeys.session(), data);

      // Invalidate and refetch any related queries if needed
      queryClient.invalidateQueries({
        queryKey: authKeys.all,
        exact: false,
      });
    },
    onError: () => {
      // Clear session data on sign-up error
      queryClient.removeQueries({
        queryKey: authKeys.session(),
      });
    },
  });
}

/**
 * Hook for signing out users
 */
export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => AuthService.signOut(),
    onSuccess: () => {
      // Clear all auth-related queries
      queryClient.removeQueries({
        queryKey: authKeys.all,
      });

      // Optionally, you can also clear all queries if needed
      // queryClient.clear();
    },
    onError: () => {
      // Even if the server request fails, clear local cache
      queryClient.removeQueries({
        queryKey: authKeys.all,
      });
    },
  });
}

/**
 * Hook for manually refreshing the session
 */
export function useRefreshSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => AuthService.getSession(),
    onSuccess: (data: AuthResponse) => {
      // Update the session cache
      queryClient.setQueryData(authKeys.session(), data);
    },
    onError: () => {
      // Clear session data on refresh error
      queryClient.removeQueries({
        queryKey: authKeys.session(),
      });
    },
  });
}

/**
 * Utility hook to get current auth state from query cache
 */
export function useAuthState() {
  const queryClient = useQueryClient();
  const sessionData = queryClient.getQueryData(authKeys.session()) as
    | AuthResponse
    | undefined;

  return {
    user: sessionData?.user || null,
    session: sessionData?.session || null,
    isAuthenticated: !!sessionData?.user,
  };
}
