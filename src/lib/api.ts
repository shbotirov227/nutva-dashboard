import axios from "axios";
import { Product } from "./types";
import { getSession } from "next-auth/react";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  const token = session?.accessToken || session?.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;

export const getAllProducts = async () => {
  const response = await api.get("/Product");
  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await api.get(`/Product/${id}`);
  return response.data;
};

export const createProduct = async (data: FormData) => {
  const response = await api.post("/Product", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateProduct = async (id: string, data: FormData) => {
  const response = await api.put(`/Product/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteProduct = async (id: string) => {
  await api.delete(`/Product/${id}`);
};

export const getAllBanners = async () => {
  const response = await api.get("/Banner");
  return response.data;
};

export const getBannerById = async (id: string) => {
  const response = await api.get(`/Banner/${id}`);
  return response.data;
};

export const createBanner = async (data: FormData) => {
  const response = await api.post("/Banner", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateBanner = async (id: string, data: FormData) => {
  const response = await api.put(`/Banner/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteBanner = async (id: string) => {
  await api.delete(`/Banner/${id}`);
};

export const getAllBlogs = async () => {
  const response = await api.get("/BlogPost");
  return response.data;
};

export const getBlogById = async (id: string) => {
  const response = await api.get(`/BlogPost/${id}`);
  return response.data;
};

export const createBlog = async (data: Product) => {
  const response = await api.post("/BlogPost", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateBlog = async (id: string, data: Product) => {
  const response = await api.put(`/BlogPost/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteBlog = async (id: string) => {
  await api.delete(`/BlogPost/${id}`);
};

export const getSalesData = async () => {
  const response = await api.get("/monitoring/sales");
  return response.data;
};

export const getVisitorsData = async () => {
  const response = await api.get("/monitoring/visitors");
  return response.data;
};

export const getPurchaseRequests = async () => {
  const response = await api.get("/statistics/purchase-requests");
  return response.data;
};

export const getVisits = async () => {
  const response = await api.get("/statistics/visits");
  return response.data;
};

export const getTrackingPixels = async () => {
  const response = await api.get("/pixels");
  return response.data;
};
