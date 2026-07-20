import { formatCurrency, getTimeAgo } from "../../../utils/dashboardHelpers";

const STATUS_META = {
  new: {
    label: "New",
    badge:
      "bg-[rgba(232,136,58,0.12)] text-[#e8883a] border border-[rgba(232,136,58,0.3)]",
    border: "border-l-[#e8883a]",
    icon: "🔴",
  },
  preparing: {
    label: "Preparing",
    badge:
      "bg-[rgba(90,132,232,0.12)] text-[#8aaaf8] border border-[rgba(90,132,232,0.3)]",
    border: "border-l-[#5a84e8]",
    icon: "🔵",
  },
  ready: {
    label: "Ready",
    badge:
      "bg-[rgba(74,154,111,0.12)] text-[#6dcc96] border border-[rgba(74,154,111,0.3)]",
    border: "border-l-[#4a9a6f]",
    icon: "🟢",
  },
  served: {
    label: "Served",
    badge:
      "bg-[rgba(138,125,106,0.1)] text-[#8a7d6a] border border-[rgba(138,125,106,0.2)]",
    border: "border-l-[#8a7d6a]",
    icon: "✓",
  },
};

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.new;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${meta.badge}`}
    >
      <span>{meta.icon}</span>
      <span>{meta.label}</span>
    </span>
  );
}

function ActionButtons({ order, onUpdateStatus, onDelete }) {
  if (order.status === "new") {
    return (
      <>
        <button
          type="button"
          onClick={() => onUpdateStatus(order.id, "preparing")}
          className="flex-1 rounded-xl border border-[rgba(90,132,232,0.3)] bg-[rgba(90,132,232,0.15)] px-3 py-2 text-xs font-medium text-[#8aaaf8] transition hover:bg-[rgba(90,132,232,0.22)]"
        >
          👨‍🍳 Start Preparing
        </button>
        <button
          type="button"
          onClick={() => onDelete(order.id)}
          className="flex-1 rounded-xl border border-[rgba(201,64,64,0.2)] bg-[rgba(201,64,64,0.1)] px-3 py-2 text-xs font-medium text-[#e88888] transition hover:bg-[rgba(201,64,64,0.18)]"
        >
          ✕ Cancel
        </button>
      </>
    );
  }

  if (order.status === "preparing") {
    return (
      <button
        type="button"
        onClick={() => onUpdateStatus(order.id, "ready")}
        className="flex-1 rounded-xl border border-[rgba(74,154,111,0.3)] bg-[rgba(74,154,111,0.15)] px-3 py-2 text-xs font-medium text-[#6dcc96] transition hover:bg-[rgba(74,154,111,0.22)]"
      >
        ✅ Mark Ready
      </button>
    );
  }

  if (order.status === "ready") {
    return (
      <button
        type="button"
        onClick={() => onUpdateStatus(order.id, "served")}
        className="flex-1 rounded-xl border border-[rgba(138,125,106,0.2)] bg-[rgba(138,125,106,0.1)] px-3 py-2 text-xs font-medium text-[#8a7d6a] transition hover:bg-[rgba(138,125,106,0.18)]"
      >
        🛎️ Mark Served
      </button>
    );
  }
  return <div className="text-xs text-[#8a7d6a]">✓ Completed</div>;
}

export default function OrderCard({ order, onUpdateStatus, onDelete }) {
  const meta = STATUS_META[order.status] || STATUS_META.new;

  return (
    <article
      className={`overflow-hidden rounded-2xl border border-[rgba(212,170,90,0.15)] border-l-4 bg-[#161411] shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition hover:border-[rgba(212,170,90,0.28)] ${meta.border} ${order.status === "served" ? "opacity-70" : ""}`}
    >
      <div className="flex items-start justify-between border-b border-[rgba(255,255,255,0.05)] px-4 py-3">
        <div>
          <div className="font-['DM_Sans'] text-3xl font-semibold leading-none tabular-nums text-[#d4aa5a]">
            #
            {String(order._id || order.id)
              .slice(-4)
              .toUpperCase()}
          </div>
          <div className="mt-1 text-[11px] text-[#8a7d6a]">
            Table {order.tableNo}
          </div>
        </div>

        <div className="text-right">
          <StatusBadge status={order.status} />
          <div className="mt-2 font-['DM_Sans'] text-sm font-medium tabular-nums text-[#f5ede0]">
            {order.time}
          </div>
          <div className="mt-1 font-['DM_Sans'] text-[10px] tabular-nums text-[#8a7d6a]">
            {getTimeAgo(order.timestamp)}
          </div>
        </div>
      </div>

      <div className="px-4 py-3">
        {order.items?.map((item, index) => (
          <div
            key={`${order.id}-${item.name}-${index}`}
            className={`flex items-center gap-2 py-2 ${index < order.items.length - 1 ? "border-b border-[rgba(255,255,255,0.04)]" : ""}`}
          >
            <span className="w-7 text-center text-lg">{item.emoji}</span>
            <span className="flex-1 text-sm text-[#e8dcc8]">{item.name}</span>
            <span className="rounded-full bg-[rgba(255,255,255,0.05)] px-2 py-1 text-xs text-[#8a7d6a]">
              ×{item.qty}
            </span>
            <span className="font-['DM_Sans'] text-base font-semibold tabular-nums text-[#d4aa5a]">
              {formatCurrency(item.total)}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between bg-[rgba(0,0,0,0.15)] px-4 py-3">
        <div>
          <div className="text-[10px] text-[#8a7d6a]">Order Total</div>
          <div className="font-['DM_Sans'] text-2xl font-semibold leading-none tabular-nums text-[#d4aa5a]">
            {formatCurrency(order.total)}
          </div>
        </div>

        {order.note ? (
          <div className="max-w-[12rem] truncate text-right text-xs italic text-[#8a7d6a]">
            📝 {order.note}
          </div>
        ) : null}
      </div>

      <div className="flex gap-2 px-4 py-3">
        <ActionButtons
          order={order}
          onUpdateStatus={onUpdateStatus}
          onDelete={onDelete}
        />
      </div>
    </article>
  );
}
