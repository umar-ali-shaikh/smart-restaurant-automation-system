import NotificationStack from "../../../components/common/NotificationStack";
import Toast from "../../../components/ui/Toast";
import { useDashboardOrders } from "../../../hooks/useDashboardOrders";
import KitchenOrderBoard from "../components/KitchenOrderBoard";

export default function KitchenDashboard() {
  const {
    orders,
    notifications,
    updateStatus,
    deleteOrder,
    dismissNotification,
  } = useDashboardOrders();

  return (
    <div className="min-h-screen bg-[#0a0906] text-[#e8dcc8]">
      <NotificationStack
        notifications={notifications}
        onDismiss={dismissNotification}
      />
      <Toast toast={null} />
      <KitchenOrderBoard
        orders={orders}
        onUpdateStatus={updateStatus}
        onDelete={deleteOrder}
      />
    </div>
  );
}
