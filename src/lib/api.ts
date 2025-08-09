import axios from "axios";
import { Product } from "./types";




/*
  GROK uchun prompt

  client uchun tanstack react query ishlat ya'ni axios orqali interceptors yaratib olib keyin esa client qismida ushbu metodlarni chaqirib ishlatayotganda useQuery orqali request yoki post qilinsin
*/


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export const fetchProducts = async () => {
  const response = await api.get("/Product");
  return response.data;
};

export const fetchProductById = async (id: string) => {
  const response = await api.get(`/Product/${id}`);
  return response.data;
};

export const createProduct = async (data: Product) => {
  const response = await api.post("/Product", data);
  return response.data;
};

export const updateProduct = async (id: string, data: Product) => {
  const response = await api.put(`/Product/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: string) => {
  await api.delete(`/Product/${id}`);
};

export const fetchBlogs = async () => {
  const response = await api.get("/Blog");
  return response.data;
};

export const createBlog = async (data: Product) => {
  const response = await api.post("/Blog", data);
  return response.data;
};

export const fetchSalesData = async () => {
  const response = await api.get("/monitoring/sales");
  return response.data;
};

export const fetchVisitorsData = async () => {
  const response = await api.get("/monitoring/visitors");
  return response.data;
};

export const fetchDashboardStats = async () => {
  const response = await api.get("/dashboard/stats");
  return response.data;
};