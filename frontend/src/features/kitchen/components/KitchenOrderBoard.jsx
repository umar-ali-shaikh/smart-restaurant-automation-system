import OrderColumn from "../../orders/components/OrderColumn";

const KITCHEN_COLUMNS = [
  {
    key: "new",
    title: "🔴 New Orders",
    emptyIcon: "📭",
    emptyTitle: "No New Orders",
    emptySubtitle: "Incoming orders will appear here instantly.",
  },
  {
    key: "preparing",
    title: "🔵 Preparing",
    emptyIcon: "👨‍🍳",
    emptyTitle: "No Orders Being Prepared",
    emptySubtitle: "Orders currently being cooked will appear here.",
  },
  {
    key: "ready",
    title: "🟢 Ready to Serve",
    emptyIcon: "🛎️",
    emptyTitle: "No Ready Orders",
    emptySubtitle: "Completed orders waiting to be served will appear here.",
  },
];

export default function KitchenOrderBoard({
  orders,
  onUpdateStatus,
  onDelete,
}) {
  return (
    <section className="min-h-screen bg-[#0a0906] px-6 py-8 xl:px-10">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-[#d4aa5a]">
          🍽️ Kitchen Dashboard
        </h1>

        <p className="text-sm text-[#8a7d6a]">
          Monitor live restaurant orders and manage kitchen workflow in real
          time.
        </p>
      </div>

      {/* Statistics */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[rgba(212,170,90,0.15)] bg-[#161411] p-5">
          <p className="text-sm text-[#8a7d6a]">New Orders</p>
          <h2 className="mt-2 text-3xl font-bold text-[#d4aa5a]">
            {orders.filter((o) => o.status === "new").length}
          </h2>
        </div>

        <div className="rounded-2xl border border-[rgba(90,132,232,0.2)] bg-[#161411] p-5">
          <p className="text-sm text-[#8a7d6a]">Preparing</p>
          <h2 className="mt-2 text-3xl font-bold text-[#8aaaf8]">
            {orders.filter((o) => o.status === "preparing").length}
          </h2>
        </div>

        <div className="rounded-2xl border border-[rgba(74,154,111,0.2)] bg-[#161411] p-5">
          <p className="text-sm text-[#8a7d6a]">Ready to Serve</p>
          <h2 className="mt-2 text-3xl font-bold text-[#6dcc96]">
            {orders.filter((o) => o.status === "ready").length}
          </h2>
        </div>
      </div>

      {/* Order Columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {KITCHEN_COLUMNS.map((column) => {
          const columnOrders = orders.filter(
            (order) => order.status === column.key
          );

          return (
            <OrderColumn
              key={column.key}
              title={column.title}
              count={columnOrders.length}
              orders={columnOrders}
              emptyIcon={column.emptyIcon}
              emptyTitle={column.emptyTitle}
              emptySubtitle={column.emptySubtitle}
              onUpdateStatus={onUpdateStatus}
              onDelete={onDelete}
            />
          );
        })}
      </div>
    </section>
  );
}