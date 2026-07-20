import { useCallback, useEffect, useRef, useState } from "react";

import { connectSocket } from "../api/socket";
import { orderService } from "../features/orders/services/orderService";
import { normalizeOrder } from "../api/normalizers";
import { playChime } from "../utils/dashboardHelpers";

export function useDashboardOrders() {
  const [orders, setOrdersState] = useState([]);
  const [soundOn, setSoundOn] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const knownOrderIds = useRef(new Set());
  const notifiedEvents = useRef(new Set());

  const pushNotification = useCallback(
    (order) => {
      const token = order._ts || `${order.id}-${Date.now()}`;

      if (notifiedEvents.current.has(token)) return;

      notifiedEvents.current.add(token);

      setNotifications((current) => [
        ...current,
        {
          id: `${order.id}-${Date.now()}`,
          order,
        },
      ]);

      playChime(soundOn);
    },
    [soundOn]
  );

  const loadOrders = useCallback(async () => {
    try {
      const response = await orderService.getAll();

      const nextOrders = Array.isArray(response)
        ? response
        : response?.data || [];

      knownOrderIds.current = new Set(nextOrders.map((o) => o.id));

      setOrdersState(nextOrders);
    } catch (error) {
      console.error("Failed to load orders", error);
    }
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      await loadOrders();
    };

    fetchOrders();
  }, [loadOrders]);

  useEffect(() => {
    const socket = connectSocket();

    const handleNewOrder = (order) => {
      const normalized = normalizeOrder(order);

      const eventOrder = {
        ...normalized,
        _ts: `new-${normalized.id}-${Date.now()}`,
      };

      setOrdersState((current) => {
        if (current.some((item) => item.id === eventOrder.id)) {
          return current;
        }

        knownOrderIds.current.add(eventOrder.id);

        return [eventOrder, ...current];
      });

      pushNotification(eventOrder);
    };

    const handleOrderUpdated = (order) => {
      const normalized = normalizeOrder(order);

      setOrdersState((current) =>
        current.map((item) =>
          item.id === normalized.id ? normalized : item
        )
      );
    };

    const handleOrderDeleted = ({ id }) => {
      knownOrderIds.current.delete(id);

      setOrdersState((current) =>
        current.filter((order) => order.id !== id)
      );
    };

    socket.emit("joinAdmin");

    socket.off("newOrder");
    socket.off("orderUpdated");
    socket.off("orderDeleted");

    socket.on("newOrder", handleNewOrder);
    socket.on("orderUpdated", handleOrderUpdated);
    socket.on("orderDeleted", handleOrderDeleted);

    return () => {
      socket.off("newOrder", handleNewOrder);
      socket.off("orderUpdated", handleOrderUpdated);
      socket.off("orderDeleted", handleOrderDeleted);
    };
  }, [pushNotification]);

  useEffect(() => {
    if (!notifications.length) return;

    const timeout = setTimeout(() => {
      setNotifications((current) => current.slice(1));
    }, 7000);

    return () => clearTimeout(timeout);
  }, [notifications]);

  async function updateStatus(orderId, status) {
    const updated = await orderService.updateStatus(orderId, status);

    const normalized = normalizeOrder(updated);

    setOrdersState((current) =>
      current.map((order) =>
        order.id === normalized.id ? normalized : order
      )
    );
  }

  function deleteOrder(orderId) {
    knownOrderIds.current.delete(orderId);

    setOrdersState((current) =>
      current.filter((order) => order.id !== orderId)
    );
  }

  function clearServed() {
    setOrdersState((current) =>
      current.filter((order) => order.status !== "served")
    );
  }

  function dismissNotification(notificationId) {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== notificationId)
    );
  }

  function setOrders(nextOrders) {
    if (!Array.isArray(nextOrders)) {
      console.warn("setOrders expected an array:", nextOrders);
      return;
    }

    knownOrderIds.current = new Set(
      nextOrders.map((order) => order.id)
    );

    setOrdersState(nextOrders);
  }

  return {
    orders,
    notifications,
    soundOn,
    setSoundOn,
    updateStatus,
    deleteOrder,
    clearServed,
    dismissNotification,
    setOrders,
    reloadOrders: loadOrders,
    pushNotification,
  };
}