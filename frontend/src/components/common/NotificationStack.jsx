import { formatCurrency } from "../../utils/dashboardHelpers";

export default function NotificationStack({ notifications, onDismiss }) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-40 flex w-[min(340px,calc(100vw-2rem))] flex-col gap-3">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="pointer-events-auto relative rounded-2xl border border-[rgba(232,136,58,0.4)] bg-gradient-to-br from-[rgba(232,136,58,0.96)] to-[rgba(180,80,20,0.96)] p-4 pr-10 text-white shadow-[0_8px_32px_rgba(232,136,58,0.3)]"
        >
          <button
            type="button"
            onClick={() => onDismiss(notification.id)}
            className="absolute right-3 top-2 text-lg text-white/70 transition hover:text-white"
          >
            ×
          </button>
          <div className="flex items-start gap-3">
            <span className="text-3xl">🔔</span>
            <div>
              <div className="text-sm font-semibold">
                New Order #{notification.order.id} · Table {notification.order.tableNo}
              </div>
              <div className="mt-1 text-xs leading-5 text-white/85">
                {notification.order.items?.map((item) => `${item.emoji} ${item.name} ×${item.qty}`).join(" · ")}
              </div>
              <div className="mt-1 text-xs text-white/85">
                Total: {formatCurrency(notification.order.total)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
