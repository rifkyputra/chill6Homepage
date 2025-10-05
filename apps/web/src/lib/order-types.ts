export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface CreateOrderData {
  items: OrderItem[];
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface UpdateOrderStatusData {
  status: OrderStatus;
}

export interface OrderResponse {
  order: Order;
  success: boolean;
  message?: string;
}

export interface OrdersListResponse {
  orders: Order[];
  success: boolean;
  message?: string;
}

export interface OrderError {
  error: string;
  message: string;
  details?: Record<string, any>;
}

export interface ValidateTokenResponse {
  valid: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  message?: string;
}
