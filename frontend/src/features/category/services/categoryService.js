import { apiClient } from "../../../api/client";
import { unwrapData } from "../../../api/normalizers";

export const categoryService = {
  getAll: () => apiClient.get("/categories"),

  create: async (payload) =>
    unwrapData(
      await apiClient.post("/categories", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ),

  update: async (id, payload) =>
    unwrapData(
      await apiClient.put(`/categories/${id}`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ),

  delete: (id) => apiClient.delete(`/categories/${id}`),

  toggle: (id) => apiClient.patch(`/categories/${id}/toggle`, {}),
};