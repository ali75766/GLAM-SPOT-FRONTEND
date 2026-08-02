import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5050/api"
});

const getAuthHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const fetchCategories = async () => {
  const { data } = await api.get("/categories");
  return data;
};

export const fetchCategoryById = async (id) => {
  const { data } = await api.get(`/categories/${id}`);
  return data;
};

export const fetchProducts = async (params = {}) => {
  const { data } = await api.get("/products", { params });
  return data;
};

export const fetchProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

export const loginAdmin = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return data;
};

export const loginUser = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return data;
};

export const registerUser = async (payload) => {
  const { data } = await api.post("/auth/register", payload);
  return data;
};

export const createCategory = async (payload, token) => {
  const { data } = await api.post("/categories", payload, getAuthHeaders(token));
  return data;
};

export const updateCategory = async (id, payload, token) => {
  const { data } = await api.put(`/categories/${id}`, payload, getAuthHeaders(token));
  return data;
};

export const deleteCategory = async (id, token) => {
  const { data } = await api.delete(`/categories/${id}`, getAuthHeaders(token));
  return data;
};

export const createProduct = async (payload, token) => {
  const { data } = await api.post("/products", payload, getAuthHeaders(token));
  return data;
};

export const updateProduct = async (id, payload, token) => {
  const { data } = await api.put(`/products/${id}`, payload, getAuthHeaders(token));
  return data;
};

export const deleteProduct = async (id, token) => {
  const { data } = await api.delete(`/products/${id}`, getAuthHeaders(token));
  return data;
};

export const fetchOrders = async (token) => {
  const { data } = await api.get("/orders", getAuthHeaders(token));
  return data;
};

export const fetchMyOrders = async (token, status) => {
  const { data } = await api.get("/orders/my", {
    ...getAuthHeaders(token),
    params: status ? { status } : undefined
  });
  return data;
};

export const createOrder = async (payload, token) => {
  const { data } = await api.post("/orders", payload, getAuthHeaders(token));
  return data;
};

export const createBooking = async (payload) => {
  const { data } = await api.post("/bookings", payload);
  return data;
};

export const fetchBookings = async (token, status) => {
  const { data } = await api.get("/bookings", {
    ...getAuthHeaders(token),
    params: status ? { status } : undefined
  });
  return data;
};

export const uploadImages = async (files, token) => {
  const formData = new FormData();
  Array.from(files).forEach((file) => {
    formData.append("images", file);
  });

  const { data } = await api.post("/uploads", formData, {
    ...getAuthHeaders(token),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    }
  });

  return data.files;
};

export const applyDiscountToProduct = async (id, discountPercentage, token) => {
  const { data } = await api.patch(
    `/products/${id}/discount`,
    { discountPercentage },
    getAuthHeaders(token)
  );
  return data;
};

export const applyDiscountToAllProducts = async (discountPercentage, token) => {
  const { data } = await api.patch(
    "/products/discounts/bulk",
    { discountPercentage },
    getAuthHeaders(token)
  );
  return data;
};
