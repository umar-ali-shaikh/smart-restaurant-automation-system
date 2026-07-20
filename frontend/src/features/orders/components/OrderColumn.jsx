import OrderCard from "./OrderCard";

function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-[rgba(212,170,90,0.15)] px-6 py-10 text-center text-[#8a7d6a]">
      <div className="text-4xl opacity-50">{icon}</div>
      <p className="mt-3 text-sm leading-6">
        {title}
        <br />
        {subtitle}
      </p>
    </div>
  );
}

export default function OrderColumn({
  title,
  count,
  orders,
  emptyIcon,
  emptyTitle,
  emptySubtitle,
  onUpdateStatus,
  onDelete,
}) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-['Cormorant_Garamond'] text-3xl text-[#f5ede0]">{title}</h2>
        <div className="rounded-full border border-[rgba(212,170,90,0.15)] bg-[rgba(212,170,90,0.08)] px-3 py-1 text-xs text-[#d4aa5a]">
          {count}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {orders.length ? (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onUpdateStatus={onUpdateStatus}
              onDelete={onDelete}
            />
          ))
        ) : (
          <EmptyState icon={emptyIcon} title={emptyTitle} subtitle={emptySubtitle} />
        )}
      </div>
    </section>
  );
}
