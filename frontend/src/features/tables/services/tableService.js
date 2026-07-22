import { API_ENDPOINTS } from "../../../api/apiConfig";
import { apiClient } from "../../../api/client";
import { normalizeTable, normalizeTables, TABLE_STATUS_TO_API, unwrapData } from "../../../api/normalizers";

function toBackendTable(payload) {
  return {
    tableNumber: payload.tableNumber || payload.tableNo,
    status: TABLE_STATUS_TO_API[payload.status] || payload.status,
    floor: payload.floor,
    capacity: payload.capacity,
  };
}

export const tableService = {
  getAll: async () =>
    normalizeTables(await apiClient.get(API_ENDPOINTS.table)),

  getById: async (id) =>
    normalizeTable(
      unwrapData(await apiClient.get(`${API_ENDPOINTS.table}/${id}`)),
    ),

  create: async (payload) =>
    normalizeTable(
      unwrapData(
        await apiClient.post(API_ENDPOINTS.table, toBackendTable(payload)),
      ),
    ),

  update: async (id, payload) =>
    normalizeTable(
      unwrapData(
        await apiClient.put(
          `${API_ENDPOINTS.table}/${id}`,
          toBackendTable(payload),
        ),
      ),
    ),

  delete: (id) =>
    apiClient.delete(`${API_ENDPOINTS.table}/${id}`),

  getDetailsByNumber: async (tableNumber) =>
    normalizeTable(
      unwrapData(
        await apiClient.get(
          `${API_ENDPOINTS.table}/number/${tableNumber}`,
        ),
      ),
    ),

  bookTableOnScan: async (tableNumber) =>
    normalizeTable(
      unwrapData(
        await apiClient.put(
          `${API_ENDPOINTS.table}/scan-book/${tableNumber}`,
        ),
      ),
    ),

  // 👇 ADD THIS
  leaveTable: async (tableNumber) =>
    normalizeTable(
      unwrapData(
        await apiClient.put(
          `${API_ENDPOINTS.table}/leave/${tableNumber}`,
        ),
      ),
    ),

  release: async (tableNumber) =>
    normalizeTable(
      unwrapData(await apiClient.put(`${API_ENDPOINTS.table}/release/${tableNumber}`)),
    ),

  getHistory: async (tableNumber) =>
    unwrapData(await apiClient.get(`${API_ENDPOINTS.table}/history/${tableNumber}`)),
};
