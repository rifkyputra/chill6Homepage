import type {
  CreateOrderData,
  Order,
  OrdersListResponse,
  OrderResponse,
  UpdateOrderStatusData,
  ValidateTokenResponse,
} from "./order-types";

const ORDER_BASE_URL = "https://auth-multi-tenants-order-service.rifqempul.workers.dev";

export class OrderService {
  private static async getAuthHeaders(): Promise<HeadersInit> {
    // Get token from cookies (since we're using HttpOnly cookies)
    // The browser will automatically include cookies in requests
    return {
      "Content-Type": "application/json",
      // Authorization header will be handled by cookies
    };
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
        const errorData = await response.json().catch(() => ({ message: "Bad request" }));
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
}