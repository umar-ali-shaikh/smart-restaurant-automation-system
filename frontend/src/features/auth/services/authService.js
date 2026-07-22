import { API_ENDPOINTS } from "../../../api/apiConfig";
import { apiClient } from "../../../api/client";

function normalizeCredentials(credentials) {
  return {
    email: credentials.email,
    employeeId: credentials.employeeId,
    password: credentials.password,
  };
}

export const authService = {
  login: async (credentials) => {
    // Role ke hisaab se endpoint choose karo
    const endpoint =
      credentials.role === "admin"
        ? `${API_ENDPOINTS.auth}/admin/login`
        : `${API_ENDPOINTS.auth}/kitchen/login`;

    const response = await apiClient.post(
      endpoint,
      normalizeCredentials(credentials)
    );

    return {
      user: response.user || response.data || response,
    };
  },

  me: async () => {
    const response = await apiClient.get(`${API_ENDPOINTS.auth}/me`);

    return response.user || response.data || response;
  },

  logout: async () => {
    return apiClient.post(`${API_ENDPOINTS.auth}/logout`, {});
  },
};

export const loginUser = (credentials) => authService.login(credentials);
