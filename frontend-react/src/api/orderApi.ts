import axiosClient from './axiosClient';

// ── Types matching actual Java backend ──────────────────
export interface OrderItem {
  id?: number;
  productId: number;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  userId: number;
  sellerId?: number;
  totalAmount: number;
  status: string; // PENDING, APPROVED, REJECTED
  orderDate: string; // LocalDateTime serialized as ISO string
  items: OrderItem[];
}

export interface CreateOrderPayload {
  userId: number;
  sellerId?: number;
  totalAmount: number;
  status?: string;
  items: { productId: number; quantity: number; price: number }[];
}

const orderApi = {
  // Get orders for a specific user
  getByUserId: (userId: number) =>
    axiosClient.get<Order[]>(`/api/orders/user/${userId}`),

  // Get orders for a specific seller
  getBySellerId: (sellerId: number) =>
    axiosClient.get<Order[]>(`/api/orders/seller/${sellerId}`),

  // Admin: get all orders
  getAll: () =>
    axiosClient.get<Order[]>('/api/orders'),

  // Create a new order
  create: (order: CreateOrderPayload) =>
    axiosClient.post<Order>('/api/orders', order),

  // Update order status (admin/seller)
  updateStatus: (id: number, status: string) =>
    axiosClient.put<Order>(`/api/orders/${id}/status`, null, { params: { status } }),

  // Delete an order
  delete: (id: number) =>
    axiosClient.delete(`/api/orders/${id}`),
};

export default orderApi;
