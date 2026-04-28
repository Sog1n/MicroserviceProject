import axiosClient from './axiosClient';

// ── Types matching actual Java backend entities ──────────────────
export interface Product {
  id: number;
  name: string;
  shortName: string;
  description: string;
  price: number;
  discount: number;
  category: string;
  img: string;
  addedDate: string;
  stockQuantity: number;
  otherImages: string[];
  colors: { id: number; colorName: string; colorCode: string }[];
  sizes: string[];
  rate: number;
  sold: number;
  votes: number;
  quantity: number;
  status: string;
  sellerId: number;
}

export interface ProductListParams {
  page?: number;
  size?: number;
  search?: string;
  category?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
}

export interface Category {
  id: number;
  name: string;
  displayName: string;
}

// Backend returns plain List<Product>, NOT paginated
const productApi = {
  getAll: () =>
    axiosClient.get<Product[]>('/api/products'),

  getById: (id: string | number) =>
    axiosClient.get<Product>(`/api/products/${id}`),

  getByCategory: (category: string) =>
    axiosClient.get<Product[]>(`/api/products/category/${category}`),

  getBySeller: (sellerId: number) =>
    axiosClient.get<Product[]>(`/api/products/seller/${sellerId}`),

  getByStatus: (status: string) =>
    axiosClient.get<Product[]>(`/api/products/status/${status}`),

  getCategories: () =>
    axiosClient.get<Category[]>('/api/products/categories'),

  createCategory: (category: Partial<Category>) =>
    axiosClient.post<Category>('/api/products/categories', category),

  updateCategory: (id: number, category: Partial<Category>) =>
    axiosClient.put<Category>(`/api/products/categories/${id}`, category),

  deleteCategory: (id: number) =>
    axiosClient.delete(`/api/products/categories/${id}`),

  create: (product: Partial<Product>) =>
    axiosClient.post<Product>('/api/products', product),

  update: (id: number, product: Partial<Product>) =>
    axiosClient.put<Product>(`/api/products/${id}`, product),

  delete: (id: number) =>
    axiosClient.delete(`/api/products/${id}`),

  updateStatus: (id: number, status: string) =>
    axiosClient.patch(`/api/products/${id}/status`, { status }),
};

export default productApi;
