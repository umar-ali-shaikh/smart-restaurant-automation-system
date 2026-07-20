  import axios from "axios";
  import { API_BASE_URL } from "./apiConfig";

  const TOKEN_KEYS = ["auth_token", "token"];

  export function getAuthToken() {
    return TOKEN_KEYS.map((key) => localStorage.getItem(key)).find(Boolean);
  }

  export function setAuthToken(token) {
    if (token) {
      localStorage.setItem("auth_token", token);
    } else {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("token");
    }
  }

  function normalizeError(error) {
    const response = error.response;
    const payload = response?.data;
    const message =
      payload?.message ||
      payload?.error ||
      error.message ||
      "Something went wrong";

    const normalized = new Error(message);
    normalized.status = response?.status;
    normalized.data = payload;
    return normalized;
  }

  export const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
  });

  axiosClient.interceptors.request.use((config) => {
    const token = getAuthToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  axiosClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
      if (error.response?.status === 401) {
        setAuthToken(null);
        localStorage.removeItem("auth_user");
      }

      return Promise.reject(normalizeError(error));
    },
  );

  export const apiClient = {
    get: (path, config) => axiosClient.get(path, config),
    post: (path, body, config) => axiosClient.post(path, body, config),
    put: (path, body, config) => axiosClient.put(path, body, config),
    patch: (path, body, config) => axiosClient.patch(path, body, config),
    delete: (path, config) => axiosClient.delete(path, config),
  };
