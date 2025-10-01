// src/lib/TrueSourceAPI.ts

import APISDK from "./APISDK";
import store from "store";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  sku?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortType?: string;
  sortItem?: string;
}

export default class TrueSourceAPI extends APISDK {
  // ==================== AUTH ENDPOINTS ====================

  /**
   * Login admin user
   */
  static login = async (payload: LoginPayload, headers = {}) => {
    const result = await this.postWithApiKey(
      `${this.API_BASE_URL}/admin/login`,
      payload,
      headers,
      true
    );

    if (result.success && result.token) {
      store.set("token", result.token);
      cookieStore.set("token", result.token);
      store.set("user", result.user);
    }

    return result;
  };

  /**
   * Logout admin user
   */
  static logout = async (headers = {}) => {
    const result = await this.postWithAuth(
      `${this.API_BASE_URL}/auth/logout`,
      {},
      headers
    );

    // Clear store
    store.remove("token");
    store.remove("user");

    return result;
  };

  /**
   * Get current admin user details
   */
  static getCurrentUser = async (headers = {}) => {
    return this.getWithAuth(`${this.API_BASE_URL}/admin`, headers, true);
  };

  /**
   * Refresh token
   */
  static refreshToken = async (headers = {}) => {
    return this.postWithAuth(
      `${this.API_BASE_URL}/auth/refresh`,
      {},
      headers,
      true
    );
  };

  // ==================== PRODUCT ENDPOINTS ====================

  /**
   * Get all products with filters
   */
  static getAllProducts = async (filters?: ProductFilters, headers = {}) => {
    let query = new URLSearchParams();

    if (filters?.search) query.append("search", filters.search);
    if (filters?.category) query.append("category", filters.category);
    if (filters?.minPrice)
      query.append("minPrice", filters.minPrice.toString());
    if (filters?.maxPrice)
      query.append("maxPrice", filters.maxPrice.toString());
    if (filters?.page) query.append("page", filters.page.toString());
    if (filters?.limit) query.append("limit", filters.limit.toString());
    if (filters?.sortType && filters?.sortItem) {
      query.append("sortType", filters.sortType);
      query.append("sortItem", filters.sortItem);
    }

    return this.getWithAuth(
      `${this.API_BASE_URL}/admin/products?${query.toString()}`,
      headers,
      true
    );
  };

  static getAuthProduct = async (authcode: string, headers = {}) => {
    return this.getWithAuth(
      `${this.API_BASE_URL}/api/v1/user/verify/${authcode}`,
      headers,
      true
    );
  };

  static getAllBatchesByProduct = async (productId: string, headers = {}) => {
    let query = new URLSearchParams();

    return this.getWithAuth(
      `${this.API_BASE_URL}/admin/batches/${productId}`,
      headers,
      true
    );
  };

  /**
   * Get product by ID
   */
  static getProductById = async (id: string, headers = {}) => {
    return this.getWithAuth(
      `${this.API_BASE_URL}/admin/product/${id}`,
      headers,
      true
    );
  };

  /**
   * Get product by SKU
   */
  static getProductBySku = async (sku: string, headers = {}) => {
    return this.getWithAuth(
      `${this.API_BASE_URL}/products/sku/${sku}`,
      headers,
      true
    );
  };

  /**
   * Create new product
   */
  static createProduct = async (
    payload: Omit<Product, "id" | "createdAt" | "updatedAt">,
    headers = {}
  ) => {
    return this.postWithAuth(
      `${this.API_BASE_URL}/admin/product`,
      payload,
      headers,
      true
    );
  };

  static createBatches = async (payload: any, headers = {}) => {
    return this.postWithAuth(
      `${this.API_BASE_URL}/admin/batches`,
      payload,
      headers,
      true
    );
  };

  /**
   * Update product
   */
  static updateProduct = async (
    id: string,
    payload: Partial<Product>,
    headers = {}
  ) => {
    return this.putWithAuth(
      `${this.API_BASE_URL}/products/${id}`,
      payload,
      headers,
      true
    );
  };

  /**
   * Delete product
   */
  static deleteProduct = async (id: string, headers = {}) => {
    return this.DeleteWithAuth(
      `${this.API_BASE_URL}/products/${id}`,
      {},
      headers
    );
  };

  /**
   * Bulk delete products
   */
  static bulkDeleteProducts = async (ids: string[], headers = {}) => {
    return this.postWithAuth(
      `${this.API_BASE_URL}/products/bulk-delete`,
      { ids },
      headers,
      true
    );
  };

  /**
   * Upload product image
   */
  static uploadProductImage = async (
    productId: string,
    file: File[],
    headers = {}
  ) => {
    return this.fileUploadWithAuth(
      `${this.API_BASE_URL}/products/${productId}/image`,
      file,
      "image"
    );
  };
}
