import type {
  CreateOrderData,
  Order,
  OrdersListResponse,
  OrderResponse,
  UpdateOrderStatusData,
  ValidateTokenResponse,
} from "./order-types";

const ORDER_BASE_URL = import.meta.env.VITE_ORDER_SERVICE_URL;

export class OrderService {
  private static async getAuthToken(): Promise<string | null> {
    try {
      // Try to get session to extract token
      const { authClient } = await import("./auth-client");
      const sessionResponse = await authClient.getSession();

      console.log("Order Service - Session response:", sessionResponse);

      if (sessionResponse.data?.session?.token) {
        console.log(
          "Order Service - Found token in session:",
          sessionResponse.data.session.token.substring(0, 10) + "..."
        );
        return sessionResponse.data.session.token;
      }

      // Try to get token from localStorage as fallback
      if (typeof window !== "undefined") {
        const token =
          localStorage.getItem("auth-token") ||
          localStorage.getItem("session-token") ||
          localStorage.getItem("access-token");
        if (token) {
          console.log("Order Service - Found token in localStorage");
          return token;
        }
      }

      console.log("Order Service - No token found");
      return null;
    } catch (error) {
      console.log("Order Service - Could not get auth token:", error);
      return null;
    }
  }

  private static async getAuthHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Origin: "https://chill6.space",
    };

    // Try to get authentication token
    const token = await this.getAuthToken();
    console.log(
      "Order Service - Token for headers:",
      token ? token.substring(0, 10) + "..." : "None"
    );

    if (token) {
      headers.Authorization = `Bearer ${token}`;
      console.log("Order Service - Added Authorization header");
    } else {
      console.log("Order Service - No Authorization header added");
    }

    console.log("Order Service - Final headers:", headers);
    return headers;
  }

  private static async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = await this.getAuthHeaders();

    const response = await fetch(`${ORDER_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
      credentials: "include", // Important for HttpOnly cookies
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized - Please sign in");
      }
      if (response.status === 404) {
        throw new Error("Resource not found");
      }
      if (response.status === 400) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Bad request" }));
        throw new Error(errorData.message || "Bad request");
      }
      if (response.status === 405) {
        throw new Error("Method not allowed");
      }
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json();
  }

  /**
   * Health check endpoint
   */
  static async checkHealth(): Promise<string> {
    try {
      const response = await fetch(`${ORDER_BASE_URL}/`, {
        credentials: "include",
      });
      return response.text();
    } catch (error) {
      console.error("Order service health check failed:", error);
      throw error;
    }
  }

  /**
   * Get all orders for the authenticated user
   */
  static async getOrders(): Promise<Order[]> {
    try {
      const response = await this.makeRequest<OrdersListResponse>("/orders");
      return response.orders || [];
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      throw error;
    }
  }

  /**
   * Create a new order
   */
  static async createOrder(data: CreateOrderData): Promise<Order> {
    try {
      const response = await this.makeRequest<OrderResponse>("/orders", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response.order;
    } catch (error) {
      console.error("Failed to create order:", error);
      throw error;
    }
  }

  /**
   * Get a specific order by ID
   */
  static async getOrderById(id: string): Promise<Order> {
    try {
      const response = await this.makeRequest<OrderResponse>(`/orders/${id}`);
      return response.order;
    } catch (error) {
      console.error(`Failed to fetch order ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update order status
   */
  static async updateOrderStatus(
    id: string,
    data: UpdateOrderStatusData
  ): Promise<Order> {
    try {
      const response = await this.makeRequest<OrderResponse>(`/orders/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      return response.order;
    } catch (error) {
      console.error(`Failed to update order ${id}:`, error);
      throw error;
    }
  }

  /**
   * Validate token manually
   */
  static async validateToken(): Promise<ValidateTokenResponse> {
    try {
      const response = await this.makeRequest<ValidateTokenResponse>(
        "/orders/validate-manually",
        {
          method: "POST",
        }
      );
      return response;
    } catch (error) {
      console.error("Failed to validate token:", error);
      throw error;
    }
  }

  /**
   * Admin: Get user by ID (admin only)
   */
  static async getUserById(userId: string): Promise<any> {
    try {
      const response = await this.makeRequest<any>(`/admin/users/${userId}`);
      return response;
    } catch (error) {
      console.error(`Failed to fetch user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Debug method to test authentication headers
   */
  static async debugAuth(): Promise<any> {
    try {
      const headers = await this.getAuthHeaders();
      const token = await this.getAuthToken();

      // Get detailed session info
      const { authClient } = await import("./auth-client");
      const sessionResponse = await authClient.getSession();

      return {
        headers: headers,
        hasToken: !!token,
        token: token ? `${token.substring(0, 10)}...` : null,
        fullToken: token, // Include full token for debugging
        sessionResponse: {
          hasData: !!sessionResponse.data,
          hasSession: !!sessionResponse.data?.session,
          hasSessionToken: !!sessionResponse.data?.session?.token,
          sessionToken: sessionResponse.data?.session?.token
            ? `${sessionResponse.data.session.token.substring(0, 10)}...`
            : null,
          error: sessionResponse.error,
        },
        localStorage:
          typeof window !== "undefined"
            ? {
                authToken: localStorage.getItem("auth-token"),
                sessionToken: localStorage.getItem("session-token"),
                accessToken: localStorage.getItem("access-token"),
              }
            : "Not available",
        cookies:
          typeof document !== "undefined" ? document.cookie : "Not available",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Debug auth failed:", error);
      throw error;
    }
  }
}
