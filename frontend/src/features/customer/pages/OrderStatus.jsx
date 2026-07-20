import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { connectSocket } from "../../../api/socket";
import { normalizeOrder } from "../../../api/normalizers";
import { orderService } from "../../orders/services/orderService";

const steps = ["new", "preparing", "ready", "served"];

const labels = {
  new: "Order Received",
  pending: "Order Received",
  preparing: "Preparing",
  ready: "Ready for Pickup",
  served: "Served",
};

const statusColor = {
  new: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  pending: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  preparing: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  ready: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  served: "bg-green-500/15 text-green-300 border-green-500/30",
};

export default function OrderStatus() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const activeIndex = useMemo(
    () => Math.max(0, steps.indexOf(order?.status || "pending")),
    [order],
  );

  const shortId = useMemo(() => {
    return String(order?._id || order?.id || id)
      .slice(-4)
      .toUpperCase();
  }, [order, id]);

  useEffect(() => {
    let mounted = true;

    const loadOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await orderService.getById(id);

        if (!mounted) return;

        setOrder(data);
      } catch (err) {
        if (!mounted) return;

        setError(
          err?.message || "Unable to load your order. Please try again later.",
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadOrder();

    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    const socket = connectSocket();

    const handleOrderUpdated = (payload) => {
      try {
        const updated = normalizeOrder(payload);

        if (updated?.id === id) {
          setOrder(updated);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const handleOrderDeleted = (payload) => {
      if (payload?.id === id) {
        setOrder(null);
        setError("This order has been cancelled.");
      }
    };

    socket.emit("joinOrder", id);

    socket.on("orderUpdated", handleOrderUpdated);
    socket.on("orderDeleted", handleOrderDeleted);

    return () => {
      socket.emit("leaveOrder", id);
      socket.off("orderUpdated", handleOrderUpdated);
      socket.off("orderDeleted", handleOrderDeleted);
    };
  }, [id]);

  return (
    <div className="min-h-screen bg-black text-[#e8dcc8] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-40 left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,170,90,.12),transparent_70%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col px-6 py-8">
        {/* Header */}
        <button
          onClick={() => navigate(`/?table=${order?.tableNo || 1}&screen=menu`)}
          className="mb-10 w-fit text-sm text-[#d4aa5a] transition hover:opacity-80"
        >
          ← Back to Menu
        </button>

        <div className="text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-[#d4aa5a]/40 bg-[#d4aa5a]/10 text-4xl">
            🍽️
          </div>

          <p className="text-xs uppercase tracking-[4px] text-[#8a7d6a]">
            THE GRAND MESA HOTEL
          </p>

          <h1 className="serif mt-4 text-4xl font-light text-[#d4aa5a]">
            Order Status
          </h1>

          <p className="mt-3 text-sm text-[#8a7d6a]">
            Track your live order progress
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-20 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#d4aa5a]/20 border-t-[#d4aa5a]" />
            <p className="mt-5 text-sm text-[#8a7d6a]">Loading your order...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-10 rounded-3xl border border-red-500/20 bg-red-500/10 p-6">
            <h3 className="text-lg font-semibold text-red-300">
              Something went wrong
            </h3>

            <p className="mt-3 text-sm text-red-200">{error}</p>
          </div>
        )}

        {/* Order */}
        {!loading && order && !error && (
          <>
            {/* Order Info */}
            <div className="mt-10 rounded-3xl border border-[#1d1812] bg-[#0f0c08] p-6 shadow-2xl">
              <div className="flex justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#8a7d6a]">
                    Order ID
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-[#d4aa5a]">
                    #{shortId}
                  </h2>
                </div>

                <div className="text-right">
                  <p className="text-xs uppercase tracking-widest text-[#8a7d6a]">
                    Table
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold">
                    #{order.tableNo}
                  </h2>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <span
                  className={`rounded-full border px-5 py-2 text-sm font-semibold ${
                    statusColor[order.status]
                  }`}
                >
                  {labels[order.status]}
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div className="mt-10 rounded-3xl border border-[#1d1812] bg-[#0f0c08] p-6">
              <h3 className="mb-8 text-lg font-semibold text-[#d4aa5a]">
                Live Progress
              </h3>

              {steps.map((step, index) => (
                <div key={step} className="relative flex gap-5 pb-8 last:pb-0">
                  {index !== steps.length - 1 && (
                    <div
                      className={`absolute left-[17px] top-9 h-full w-[2px] ${
                        index < activeIndex ? "bg-[#d4aa5a]" : "bg-[#2a2218]"
                      }`}
                    />
                  )}

                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-bold ${
                      index <= activeIndex
                        ? "border-[#d4aa5a] bg-[#d4aa5a] text-black"
                        : "border-[#2a2218] bg-[#14110c] text-[#8a7d6a]"
                    }`}
                  >
                    {index + 1}
                  </div>

                  <div>
                    <h4
                      className={`font-semibold ${
                        index <= activeIndex
                          ? "text-[#e8dcc8]"
                          : "text-[#8a7d6a]"
                      }`}
                    >
                      {labels[step]}
                    </h4>

                    {index === activeIndex && (
                      <p className="mt-1 text-xs text-[#d4aa5a]">
                        Current Status
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-3xl border border-[#1d1812] bg-[#0f0c08] p-6">
              <h3 className="mb-5 text-lg font-semibold text-[#d4aa5a]">
                Order Items
              </h3>

              <div className="space-y-3">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name}</span>

                    <span>× {item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="mt-8 rounded-3xl border border-[#1d1812] bg-[#0f0c08] p-6">
              <p className="text-sm uppercase tracking-widest text-[#8a7d6a]">
                Total Amount
              </p>

              <h2 className="mt-3 text-4xl font-light text-[#d4aa5a]">
                ₹{order.totalPrice}
              </h2>
            </div>

            {order.status === "served" && (
              <button
                onClick={() => navigate(`/review/${order.id}`)}
                className="mt-8 w-full rounded-2xl bg-[#d4aa5a] py-4 text-lg font-semibold text-black transition hover:opacity-90"
              >
                Leave Review
              </button>
            )}

            {/* Footer */}
            <div className="mt-8 rounded-3xl border border-[#1d1812] bg-[#0f0c08] p-5 text-center">
              <p className="text-sm text-[#8a7d6a]">
                🍽️ Your order updates automatically in real-time.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
