import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connectSocket } from "../../../api/socket";
import { orderService } from "../../orders/services/orderService";

const activeStatuses = new Set(["new", "pending", "preparing", "ready"]);

const labels = {
  new: "Order Received",
  pending: "Order Received",
  preparing: "Preparing",
  ready: "Ready",
  served: "Served",
  completed: "Completed",
  cancelled: "Cancelled",
};

function OrderCard({ order, onTrack, onReview }) {
  const isServed = order.status === "served" || order.status === "completed";

  return (
    <article className="rounded-[28px] border border-[#2d2418] bg-[#0f0c08] p-5 shadow-2xl transition-all">
      <div className="flex items-start justify-between gap-4 border-b border-[#2d2418] pb-4">
        <div>
          <p className="text-xs uppercase tracking-[.2em] text-[#8a7d6a]">
            Table {order.tableNo}
          </p>

          <h2 className="mt-1 font-mono text-xl text-[#d4aa5a]">
            #{String(order.id).slice(-5).toUpperCase()}
          </h2>
        </div>

        <span className="rounded-full border border-[#d4aa5a]/30 bg-[#d4aa5a]/10 px-3 py-1 text-xs font-semibold text-[#d4aa5a]">
          {labels[order.status] || order.status}
        </span>
      </div>

      <div className="space-y-2 py-4">
        {order.items.map((item, index) => (
          <div key={item.id || index} className="flex justify-between text-sm">
            <span>
              {item.qty}× {item.name}
            </span>

            <span className="text-[#8a7d6a]">
              ₹{item.total || item.price * item.qty}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-[#2d2418] pt-4">
        <strong className="font-serif text-xl text-[#d4aa5a]">
          ₹{order.total}
        </strong>

        <button
          onClick={() => (isServed ? onReview(order.id) : onTrack(order.id))}
          className="rounded-xl bg-[#d4aa5a] px-4 py-2 text-xs font-bold text-black transition hover:scale-105"
        >
          {isServed ? "Leave Review" : "Track Order"}
        </button>
      </div>
    </article>
  );
}

export default function CustomerOrdersPage() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    try {
      setError("");

      const data = await orderService.getMy();

      setOrders(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to load your orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await orderService.getMy();

        if (!ignore) {
          setOrders(data);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Unable to load your orders.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      ignore = true;
    };
  }, []);

  /*
   =====================================
   SOCKET LIVE UPDATES
   =====================================
  */

  useEffect(() => {
    const socket = connectSocket();

    if (!socket) return;

    const refreshOrders = async () => {
      await loadOrders();
    };

    socket.on("connect", refreshOrders);

    socket.on("orderCreated", refreshOrders);

    socket.on("orderUpdated", refreshOrders);

    socket.on("orderDeleted", refreshOrders);

    socket.on("orderReady", refreshOrders);

    socket.on("orderServed", refreshOrders);

    socket.on("paymentCompleted", refreshOrders);

    return () => {
      socket.off("connect", refreshOrders);

      socket.off("orderCreated", refreshOrders);

      socket.off("orderUpdated", refreshOrders);

      socket.off("orderDeleted", refreshOrders);

      socket.off("orderReady", refreshOrders);

      socket.off("orderServed", refreshOrders);

      socket.off("paymentCompleted", refreshOrders);
    };
  }, [loadOrders]);

  const [active, completed] = useMemo(
    () => [
      orders.filter((o) => activeStatuses.has(o.status)),
      orders.filter((o) => !activeStatuses.has(o.status)),
    ],
    [orders],
  );

  const renderSection = (title, list) => {
    if (!list.length) return null;

    return (
      <section>
        <h2 className="mb-3 text-xs font-bold uppercase tracking-[.25em] text-[#8a7d6a]">
          {title}
        </h2>

        <div className="space-y-4">
          {list.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onTrack={(id) => navigate(`/order/${id}`)}
              onReview={(id) => navigate(`/review/${id}`)}
            />
          ))}
        </div>
      </section>
    );
  };

  return (
    <main className="min-h-screen bg-[#0a0906] px-5 pb-16 text-[#e8dcc8]">
      <header className="mx-auto max-w-xl py-8 text-center">
        <button
          onClick={() => {
            const tableNo = localStorage.getItem("tableNumber");

            navigate(`/?table=${tableNo}`);
          }}
          className="float-left text-sm text-[#d4aa5a]"
        >
          ← Menu
        </button>

        <p className="text-xs uppercase tracking-[.35em] text-[#c17a3a]">
          THE GRAND MESA
        </p>

        <h1 className="mt-2 font-serif text-4xl text-[#d4aa5a]">My Orders</h1>

        <p className="mt-2 text-sm text-[#8a7d6a]">
          Live kitchen updates for this guest session
        </p>
      </header>

      <div className="mx-auto max-w-xl space-y-8">
        {loading && (
          <p className="py-20 text-center text-[#8a7d6a]">
            Loading your orders...
          </p>
        )}

        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="rounded-[28px] border border-dashed border-[#2d2418] p-12 text-center text-[#8a7d6a]">
            No orders yet. Your placed orders will appear here.
          </div>
        )}

        {renderSection("Active Orders", active)}

        {renderSection("Completed Orders", completed)}
      </div>
    </main>
  );
}
