import { API_ENDPOINTS } from "../../../api/apiConfig";
import { apiClient } from "../../../api/client";
import { unwrapData } from "../../../api/normalizers";

export const analyticsService = {
  getSummary: async (params = {}) => {
    const search = new URLSearchParams(params).toString();
    return unwrapData(await apiClient.get(`${API_ENDPOINTS.analytics}${search ? `?${search}` : ""}`));
  },
};
