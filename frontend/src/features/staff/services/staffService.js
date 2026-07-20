import { API_ENDPOINTS } from "../../../api/apiConfig";
import { apiClient } from "../../../api/client";
import { normalizeStaff, normalizeStaffUser, unwrapData } from "../../../api/normalizers";

export const staffService = {
  getAll: async () => normalizeStaff(await apiClient.get(API_ENDPOINTS.staff)),
  create: async (payload) => normalizeStaffUser(unwrapData(await apiClient.post(API_ENDPOINTS.staff, payload))),
  update: async (id, payload) => normalizeStaffUser(unwrapData(await apiClient.put(`${API_ENDPOINTS.staff}/${id}`, payload))),
  updateStatus: async (id, online) => normalizeStaffUser(unwrapData(await apiClient.patch(`${API_ENDPOINTS.staff}/${id}/status`, { online }))),
  delete: (id) => apiClient.delete(`${API_ENDPOINTS.staff}/${id}`),
};
