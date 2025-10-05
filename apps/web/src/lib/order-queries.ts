import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OrderService } from "./order-service";
import type {
  CreateOrderData,
  Order,
  UpdateOrderStatusData,
  ValidateTokenResponse,
} from "./order-types";

// Query keys for consistent caching
export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (filters: string) => [...orderKeys.lists(), { filters }] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  validation: () => [...orderKeys.all, "validation"] as const,
};

/**
 * Hook for fetching all orders for the authenticated user
 */
export function useOrders(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: orderKeys.lists(),
    queryFn: () => OrderService.getOrders(),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error && typeof error === "object" && "message" in error) {
        const message = error.message as string;
        if (message.includes("Unauthorized") || message.includes("401")) {
          return false;
        }
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    enabled: options?.enabled !== false,
  });
}

/**
 * Hook for fetching a specific order by ID
 */
export function useOrder(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => OrderService.getOrderById(id),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error) => {
      // Don't retry on auth errors or not found errors
      if (error && typeof error === "object" && "message" in error) {
        const message = error.message as string;
        if (
          message.includes("Unauthorized") ||
          message.includes("401") ||
          message.includes("not found") ||
          message.includes("404")
        ) {
          return false;
        }
      }
      return failureCount < 2;
    },
    enabled: !!id && options?.enabled !== false,
  });
}

/**
 * Hook for creating a new order
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderData) => OrderService.createOrder(data),
    onSuccess: (newOrder) => {
      // Invalidate and refetch orders list
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });

      // Add the new order to the cache
      queryClient.setQueryData(orderKeys.detail(newOrder.id), newOrder);
    },
    onError: (error) => {
      console.error("Create order mutation failed:", error);
    },
  });
}

/**
 * Hook for updating order status
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderStatusData }) =>
      OrderService.updateOrderStatus(id, data),
    onSuccess: (updatedOrder) => {
      // Update the specific order in cache
      queryClient.setQueryData(orderKeys.detail(updatedOrder.id), updatedOrder);

      // Invalidate orders list to refresh the list view
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
    onError: (error) => {
      console.error("Update order status mutation failed:", error);
    },
  });
}

/**
 * Hook for validating token manually
 */
export function useValidateToken(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: orderKeys.validation(),
    queryFn: () => OrderService.validateToken(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: false, // Don't retry token validation
    refetchOnWindowFocus: false,
    enabled: options?.enabled !== false,
  });
}

/**
 * Hook for checking order service health
 */
export function useOrderServiceHealth(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...orderKeys.all, "health"],
    queryFn: () => OrderService.checkHealth(),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 1 * 60 * 1000, // 1 minute
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: options?.enabled !== false,
  });
}

/**
 * Hook for admin: getting user by ID
 */
export function useUserById(userId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["admin", "users", userId],
    queryFn: () => OrderService.getUserById(userId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error && typeof error === "object" && "message" in error) {
        const message = error.message as string;
        if (message.includes("Unauthorized") || message.includes("401")) {
          return false;
        }
      }
      return failureCount < 2;
    },
    enabled: !!userId && options?.enabled !== false,
  });
}
