  import axios from "axios";
  import { API_BASE_URL } from "./apiConfig";

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

  axiosClient.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(normalizeError(error)),
  );

  export const apiClient = {
    get: (path, config) => axiosClient.get(path, config),
    post: (path, body, config) => axiosClient.post(path, body, config),
    put: (path, body, config) => axiosClient.put(path, body, config),
    patch: (path, body, config) => axiosClient.patch(path, body, config),
    delete: (path, config) => axiosClient.delete(path, config),
  };
