import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { orderService } from "../../orders/services/orderService";
import FeedbackScreen from "../components/screens/FeedbackScreen";

const reviewKey = (id) => `mesa_reviewed_${id}`;

export default function ReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    orderService
      .getById(id)
      .then(setOrder)
      .catch((err) => setError(err.message || "Unable to load this order."));
  }, [id]);

  if (error)
    return (
      <main className="min-h-screen bg-black p-8 text-red-200">{error}</main>
    );
  if (!order)
    return (
      <main className="min-h-screen bg-black p-8 text-[#d4aa5a]">
        Loading your order…
      </main>
    );
  if (order.status !== "served")
    return (
      <main className="min-h-screen bg-black p-8 text-[#e8dcc8]">
        Reviews become available once your order has been served.
      </main>
    );
  if (localStorage.getItem(reviewKey(id)))
    return (
      <main className="min-h-screen bg-black p-8 text-[#e8dcc8]">
        <FeedbackScreen
          cart={{}}
          orderId={id}
          tableNo={order.tableNo}
          onDone={() => {
            localStorage.setItem(reviewKey(id), "true");
            navigate("/my-orders");
          }}
          initialStep="done"
        />
      </main>
    );

  return (
    <FeedbackScreen
      cart={Object.fromEntries(order.items.map((item) => [item.id, item]))}
      orderId={id}
      tableNo={order.tableNo}
      onDone={() => {
        localStorage.setItem(reviewKey(id), "true");
        navigate("/my-orders");
      }}
    />
  );
}
