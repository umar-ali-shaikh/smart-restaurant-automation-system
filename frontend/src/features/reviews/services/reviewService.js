import { API_ENDPOINTS } from "../../../api/apiConfig";
import { apiClient } from "../../../api/client";
import { normalizeReview, normalizeReviews, unwrapData } from "../../../api/normalizers";

export const reviewService = {
  getAll: async () => normalizeReviews(await apiClient.get(API_ENDPOINTS.review)),
  getAnalytics: async (params) => unwrapData(await apiClient.get(`${API_ENDPOINTS.review}/analytics`, { params })),
  create: async (payload) => normalizeReview(unwrapData(await apiClient.post(API_ENDPOINTS.review, payload))),
  createWithImage: async (formData) =>
    normalizeReview(
      unwrapData(
        await apiClient.post(API_ENDPOINTS.review, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      )
    ),
  update: async (id, payload) => normalizeReview(unwrapData(await apiClient.put(`${API_ENDPOINTS.review}/${id}`, payload))),
  updateStatus: async (id, status) =>
    normalizeReview(unwrapData(await apiClient.patch(`${API_ENDPOINTS.review}/${id}/status`, { status }))),
  reply: async (id, text) =>
    normalizeReview(unwrapData(await apiClient.patch(`${API_ENDPOINTS.review}/${id}/reply`, { text }))),
  delete: (id) => apiClient.delete(`${API_ENDPOINTS.review}/${id}`),
};
