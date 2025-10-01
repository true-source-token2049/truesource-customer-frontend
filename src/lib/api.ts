const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export interface ProductBatch {
  id: number;
  available_units: number;
  status: string;
}

export interface Product {
  id: number;
  title: string;
  brand: string;
  category?: string;
  sub_category?: string;
  description: string;
  plain_description: string;
  price: number;
  product_attrs?: Array<{
    name: string;
    value: string;
    type: string;
  }>;
  product_assets?: Array<{
    url: string;
    view: string;
    type: string;
  }>;
  batches?: ProductBatch[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: number;
  user_id: string;
  product_id: number;
  product_batch_id: number;
  quantity: number;
  product?: Product;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface Order {
  id: number;
  user_id: string;
  total_amount: number;
  shipping_address: string;
  status: string;
  order_items: Array<{
    id: number;
    product_id: number;
    product_batch_id: number;
    quantity: number;
    price: number;
    product?: Product;
  }>;
  created_at: string;
  updatedAt: string;
}

// Helper to get JWT token from localStorage
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
};

// Helper to determine if running on server-side
const isServerSide = () => typeof window === "undefined";

// Products API
export const getAllProducts = async (
  limit?: number,
  offset?: number,
): Promise<Product[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (limit) queryParams.append("limit", limit.toString());
    if (offset) queryParams.append("offset", offset.toString());

    const response = await fetch(
      `${API_BASE_URL}/api/v1/products${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(isServerSide() && { Origin: API_BASE_URL }),
        },
      },
    );
    console.log(response);

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    throw error;
  }
};

export const getProductById = async (productId: number): Promise<Product> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/product/${productId}`, {
      headers: {
        "Content-Type": "application/json",
        ...(isServerSide() && { Origin: API_BASE_URL }),
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error in getProductById:", error);
    throw error;
  }
};

// Cart API
export const addToCart = async (
  productId: number,
  productBatchId: number,
  quantity: number = 1,
): Promise<CartItem> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/user/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(isServerSide() && { Origin: API_BASE_URL }),
      },
      body: JSON.stringify({
        payload: {
          product_id: productId,
          product_batch_id: productBatchId,
          quantity,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to add to cart");
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error in addToCart:", error);
    throw error;
  }
};

export const getCart = async (): Promise<Cart> => {
  try {
    const token = getAuthToken();

    const response = await fetch(`${API_BASE_URL}/api/v1/user/cart`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(isServerSide() && { Origin: API_BASE_URL }),
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch cart");
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error in getCart:", error);
    throw error;
  }
};

// Order API
export interface CreateOrderItem {
  product_id: number;
  quantity: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  postal_code: string;
  country: string;
  unit?: string;
  name?: string;
  phone?: string;
}

export interface CreateOrderPayload {
  items: CreateOrderItem[];
  shipping_address?: ShippingAddress;
}

export const createOrder = async (payload: CreateOrderPayload): Promise<Order> => {
  try {
    const token = getAuthToken();

    const response = await fetch(`${API_BASE_URL}/api/v1/user/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(isServerSide() && { Origin: API_BASE_URL }),
      },
      body: JSON.stringify({ payload }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create order");
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error in createOrder:", error);
    throw error;
  }
};

export const getOrder = async (orderId: number): Promise<Order> => {
  try {
    const token = getAuthToken();

    const response = await fetch(`${API_BASE_URL}/api/v1/user/order/${orderId}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(isServerSide() && { Origin: API_BASE_URL }),
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch order");
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error in getOrder:", error);
    throw error;
  }
};

// Auth API
export interface LoginPayload {
  userId: string;
  address?: string;
  email: string;
  clientAddress: string;
  solanaAddress?: string;
  orgId: string;
  type: string;
}

export interface LoginResponse {
  message: string;
  token: {
    access_token: string;
    refresh_token: string;
  };
}

export const loginCustomer = async (payload: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(isServerSide() && { Origin: API_BASE_URL }),
      },
      body: JSON.stringify({ payload }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to login");
    }

    const data = await response.json();

    // Store tokens in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", data.result.token.access_token);
      localStorage.setItem("refresh_token", data.result.token.refresh_token);
    }

    return data.result;
  } catch (error) {
    console.error("Error in loginCustomer:", error);
    throw error;
  }
};
