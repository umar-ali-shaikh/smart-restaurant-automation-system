import { API_ENDPOINTS } from "../../../api/apiConfig";
import { apiClient } from "../../../api/client";
import { normalizeOrder, normalizeOrders, STATUS_TO_API, unwrapData } from "../../../api/normalizers";

const GUEST_ORDER_IDS_KEY = "mesa_guest_order_ids";

function getGuestOrderIds() {
  try { return JSON.parse(localStorage.getItem(GUEST_ORDER_IDS_KEY) || "[]"); } catch { return []; }
}

function rememberGuestOrder(id) {
  if (!id) return;
  const ids = getGuestOrderIds().filter((savedId) => savedId !== id);
  localStorage.setItem(GUEST_ORDER_IDS_KEY, JSON.stringify([id, ...ids].slice(0, 50)));
}

function toBackendOrder(payload) {
  return {
    ...payload,
    items: payload.items?.map((item) => ({
      menuItem: item.menuItem || item.productId || item.id || item._id,
      quantity: item.quantity || item.qty,
    })),
    status: STATUS_TO_API[payload.status] || payload.status,
  };
}

export const orderService = {
  getAll: async () => normalizeOrders(await apiClient.get(API_ENDPOINTS.order)),
  getMy: async () => normalizeOrders(await apiClient.get(`${API_ENDPOINTS.order}/my`)),
  create: async (payload) => {
    const order = normalizeOrder(unwrapData(await apiClient.post(API_ENDPOINTS.order, toBackendOrder(payload))));
    rememberGuestOrder(order.id);
    return order;
  },
  updateStatus: async (id, status) => {
    const response = await apiClient.put(`${API_ENDPOINTS.order}/${id}`, {
      status: STATUS_TO_API[status] || status,
    });
    return normalizeOrder(unwrapData(response));
  },
  getById: async (id) => normalizeOrder(unwrapData(await apiClient.get(`${API_ENDPOINTS.order}/${id}`))),
  getBill: async (id) => unwrapData(await apiClient.get(`${API_ENDPOINTS.order}/${id}/bill`)),
  delete: (id) => apiClient.delete(`${API_ENDPOINTS.order}/${id}`),
};

export const broadcastOrder = (orderData) => orderService.create(orderData);
