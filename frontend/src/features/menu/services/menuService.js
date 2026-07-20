import { API_ENDPOINTS } from "../../../api/apiConfig";
import { apiClient } from "../../../api/client";
import {
  normalizeMenu,
  normalizeMenuItem,
  unwrapData,
} from "../../../api/normalizers";

function toBackendPayload(payload) {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("price", payload.price);

  formData.append(
    "category",
    payload.category || payload.cuisine
  );

  formData.append(
    "description",
    payload.description || payload.desc || ""
  );

  formData.append(
    "type",
    payload.type || payload.tags?.[0] || "veg"
  );

  formData.append(
    "isChefSpecial",
    Boolean(payload.chef)
  );

  formData.append(
    "isAvailable",
    payload.active !== false
  );

  if (payload.image) {
    formData.append("image", payload.image);
  }

  return formData;
}

export const menuService = {
  getAll: async () =>
    normalizeMenu(
      await apiClient.get(API_ENDPOINTS.menu)
    ),

  getById: async (id) =>
    normalizeMenuItem(
      await apiClient.get(
        `${API_ENDPOINTS.menu}/item/${id}`
      )
    ),

  search: async (query) =>
    normalizeMenu(
      await apiClient.get(
        `${API_ENDPOINTS.menu}/search?q=${encodeURIComponent(
          query
        )}`
      )
    ),

  createItem: async (payload) =>
    normalizeMenuItem(
      unwrapData(
        await apiClient.post(
          `${API_ENDPOINTS.menu}/item`,
          toBackendPayload(payload),
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        )
      )
    ),

  updateItem: async (id, payload) =>
    normalizeMenuItem(
      unwrapData(
        await apiClient.put(
          `${API_ENDPOINTS.menu}/item/${id}`,
          toBackendPayload(payload),
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        )
      )
    ),

  toggleItem: async (id) =>
    normalizeMenuItem(
      unwrapData(
        await apiClient.patch(
          `${API_ENDPOINTS.menu}/item/${id}/toggle`,
          {}
        )
      )
    ),

  deleteItem: (id) =>
    apiClient.delete(
      `${API_ENDPOINTS.menu}/item/${id}`
    ),

  getStats: () =>
    apiClient.get(
      `${API_ENDPOINTS.menu}/stats`
    ),
};
