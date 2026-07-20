export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  API_BASE_URL.replace(/\/api\/?$/, "");

export const API_ENDPOINTS = {
  auth: "/auth",
  menu: "/menu",
  order: "/order",
  table: "/table",
  staff: "/staff",
  review: "/reviews",
  analytics: "/menu/stats",
};