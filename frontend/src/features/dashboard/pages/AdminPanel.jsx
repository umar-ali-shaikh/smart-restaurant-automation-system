import { lazy, useEffect, useMemo, useState, memo, useCallback } from "react";

import NotificationStack from "../../../components/common/NotificationStack";
import Navbar from "../../../components/layout/Navbar";
import Toast from "../../../components/ui/Toast";
const AnalyticsPage = lazy(() => import("../../analytics/pages/AnalyticsPage"));
const BillingPage = lazy(() => import("../../billing/pages/BillingPage"));
const MenuPage = lazy(() => import("../../menu/pages/MenuPage"));
const CategoryPage = lazy(() => import("../../category/pages/CategoryPage"));
const OrdersPage = lazy(() => import("../../orders/pages/OrdersPage"));
const ReviewsPage = lazy(() => import("../../reviews/pages/ReviewsPage"));
const StaffPage = lazy(() => import("../../staff/pages/StaffPage"));
const TablesPage = lazy(() => import("../../tables/pages/TablesPage"));
import AdminTabs from "../components/AdminTabs";
import DashboardOverview from "../components/DashboardOverview";
import SummarySidebar from "../components/SummarySidebar";
import { categoryService } from "../../category/services/categoryService";
import { reviewService } from "../../reviews/services/reviewService"; // reviewService इम्पोर्ट सुनिश्चित करें

import { useDashboardOrders } from "../../../hooks/useDashboardOrders";
import { useMesaStore } from "../../../hooks/useMesaStore";
import { useAuth } from "../../../context/authContext";
import { getOrderSummary } from "../../../utils/dashboardHelpers";

const MobilePanelSwitch = memo(function MobilePanelSwitch({
  activeTab,
  open,
  onClose,
  onChange,
}) {
  return (
    <>
      <aside
        className={`fixed left-0 top-0 z-[9999] flex h-full w-[260px] flex-col border-r border-[#1f1a14] bg-[#0f0c08]/95 p-6 backdrop-blur-xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#1a1510] text-[#d4aa5a] transition hover:bg-[#d4aa5a] hover:text-black"
        >
          ×
        </button>

        <h2 className="mb-8 text-xs font-bold uppercase tracking-[0.2em] text-[#d4aa5a]/60">
          Navigation
        </h2>

        <div className="flex flex-col gap-2">
          {[
            ["admin", "⚙   Admin Panel"],
            ["kitchen", "🍽   Kitchen Panel"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => {
                onChange("admin");
                onClose();
              }}
              className={`rounded-xl px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${
                activeTab === id
                  ? "bg-[#d4aa5a] font-semibold text-[#0a0906] shadow-lg shadow-[#d4aa5a]/10"
                  : "text-[#e8dcc8]/70 hover:bg-[#1a1510] hover:text-[#e8dcc8]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </aside>

      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-[998] bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        />
      )}
    </>
  );
});

export default function AdminPanel() {
  const [now, setNow] = useState(() => new Date());
  const [activeTab, setActiveTab] = useState("admin");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminTab, setAdminTab] = useState("dashboard");
  const { user, logout } = useAuth();
  const [activePage, setActivePage] = useState("analytics");
  const [toast, setToast] = useState(null);
  const [categories, setCategories] = useState([]);
  const [reviewAnalytics, setReviewAnalytics] = useState(null); // रिव्यू लाइव डेटा स्टेट

  // श्रेणियों (Categories) को लोड करने का हुक
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoryService.getAll();
        setCategories(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadCategories();
  }, []);

  // लाइव रिव्यू एनालिटिक्स फ़ेच करने का हुक
  useEffect(() => {
    const loadReviewAnalytics = async () => {
      try {
        const data = await reviewService.getAnalytics();
        setReviewAnalytics(data);
      } catch (error) {
        console.error("Failed to load review analytics for dashboard:", error);
      }
    };

    if (user) {
      loadReviewAnalytics();
    }
  }, [user]);

  const { menu, tables, staff, setMenu, setTables, setStaff, refresh } =
    useMesaStore();
  const {
    orders,
    notifications,
    soundOn,
    setSoundOn,
    clearServed,
    reloadOrders,
    dismissNotification,
    setOrders,
  } = useDashboardOrders();

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user) {
      refresh();
      reloadOrders();
    }
  }, [refresh, reloadOrders, user]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const summary = useMemo(() => getOrderSummary(orders), [orders]);

  const activeOrders = useMemo(
    () => orders.filter((order) => order.status !== "served").length,
    [orders],
  );

  const stableOrders = useMemo(
    () => (Array.isArray(orders) ? orders : []),
    [orders],
  );

  if (!user) {
    return null;
  }

  const renderActivePage = () => {
    switch (activePage) {
      case "analytics":
        return <AnalyticsPage menu={menu} orders={stableOrders} />;
      case "category":
        return (
          <CategoryPage
            categories={categories}
            setCategories={setCategories}
            showToast={showToast}
          />
        );
      case "menu":
        return (
          <MenuPage
            menu={menu}
            categories={categories}
            setMenu={setMenu}
            showToast={showToast}
          />
        );
      case "tables":
        return (
          <TablesPage
            tables={tables}
            setTables={setTables}
            showToast={showToast}
          />
        );
      case "orders":
        return (
          <OrdersPage
            orders={stableOrders}
            setOrders={setOrders}
            showToast={showToast}
          />
        );
      case "staff":
        return (
          <StaffPage staff={staff} setStaff={setStaff} showToast={showToast} />
        );
      case "billing":
        return <BillingPage orders={stableOrders} showToast={showToast} />;
      case "reviews":
        return <ReviewsPage showToast={showToast} />;
      default:
        return <AnalyticsPage menu={menu} orders={stableOrders} />;
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#0a0906] text-[#e8dcc8] antialiased">
      <MobilePanelSwitch
        activeTab={activeTab}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onChange={setActiveTab}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Toast toast={toast} />
        <NotificationStack
          notifications={notifications}
          onDismiss={dismissNotification}
        />

        {/* Top Header Sticky Area */}
        <header className="fixed inset-x-0 top-0 z-50 border-b border-[#1f1a14] bg-[#0a0906]/90 backdrop-blur-md">
          <Navbar
            now={now}
            soundOn={soundOn}
            onToggleSound={() => setSoundOn((current) => !current)}
            onAddDemoOrder={reloadOrders}
            onToggleSidebar={() => setSidebarOpen(true)}
            user={user}
            setUser={() => logout()}
          />
        </header>

        {/* Main Content Workspace */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 xl:px-10 pt-24">
          {activeTab === "admin" && (
            <div className="space-y-6">
              {/* Tab Selector Buttons */}
              <div className="max-w-full overflow-x-auto pb-1">
                <AdminTabs
                  activeTab={adminTab}
                  onChange={(tab) => {
                    setAdminTab(tab);
                    setActivePage(tab);
                  }}
                />
              </div>

              {/* Grid System */}
              <div className="grid grid-cols-1 gap-6 items-start lg:grid-cols-4 lg:gap-8">
                {/* Dashboard Main Grid Area */}
                <div
                  className={`min-w-0 transition-all duration-300 ${
                    adminTab === "dashboard" ? "lg:col-span-3" : "lg:col-span-4"
                  }`}
                >
                  {adminTab === "dashboard" && (
                    <DashboardOverview
                      summary={summary}
                      menu={menu}
                      categories={categories}
                      tables={tables}
                      staff={staff}
                      reviewAnalytics={reviewAnalytics} // लाइव रिव्यू डेटा पास किया गया
                      onNavigate={(tab) => {
                        setAdminTab(tab);
                        setActivePage(tab);
                      }}
                    />
                  )}
                  {adminTab !== "dashboard" && renderActivePage()}
                </div>

                {/* Sidebar Column Area */}
                {adminTab === "dashboard" && (
                  <div className="w-full lg:col-span-1 sticky top-24">
                    <SummarySidebar
                      summary={summary}
                      onClearServed={clearServed}
                      activeOrders={activeOrders}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
