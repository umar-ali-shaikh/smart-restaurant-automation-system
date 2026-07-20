import { API_ENDPOINTS } from "../../../api/apiConfig";
import { apiClient } from "../../../api/client";

export const analyticsService = {
  getSummary: (params = {}) => {
    const search = new URLSearchParams(params).toString();
    return apiClient.get(`${API_ENDPOINTS.analytics}${search ? `?${search}` : ""}`);
  },
};
