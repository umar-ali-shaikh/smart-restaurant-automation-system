import { useCallback, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import CartSheet from "../components/shared/CartSheet";
import KitchenToast from "../components/shared/KitchenToast";

import LoadingScreen from "../components/screens/LoadingScreen";
import CuisineScreen from "../components/screens/CuisineScreen";
import FeedbackScreen from "../components/screens/FeedbackScreen";
import MenuScreen from "./MenuPage";
import SuccessScreen from "../components/screens/SuccessScreen";
import WelcomeScreen from "../components/screens/WelcomeScreen";
import WorkflowScreen from "../components/screens/WorkflowScreen";

import { reviewService } from "../../reviews/services/reviewService";
import { orderService } from "../../orders/services/orderService";
import { menuService } from "../../menu/services/menuService";
import { tableService } from "../../tables/services/tableService";
import { getSocket } from "../../../api/socket";

export default function FrontPage() {
  const [screen, setScreen] = useState("welcome");
  const [loading, setLoading] = useState(false);

  const [selectedCuisine, setSelectedCuisine] = useState(null);
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("mesa_cart") || "{}");
    } catch {
      return {};
    }
  });
  const [reviews, setReviews] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [orderNum, setOrderNum] = useState("");
  const [orders, setOrders] = useState([]);
  const [tableDetails, setTableDetails] = useState(null);
  const navigate = useNavigate();

  // Parse table parameter from search URL
  const queryParams = new URLSearchParams(window.location.search);
  const tableNo = Number(queryParams.get("table")) || null;

  /* ======================================
      DATA FETCHING (MEMOIZED & ACCURATE)
  ====================================== */
  const loadOrders = useCallback(async () => {
    try {
      const data = await orderService.getMy();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Order Load Error:", err);
    }
  }, []);

  const loadReviews = useCallback(async () => {
    try {
      const data = await reviewService.getAll();
      // FIX: Ensure data falling boundary array fallback
      setReviews(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.log("Review Load Error:", error);
    }
  }, []);

  const loadMenu = useCallback(async () => {
    try {
      const data = await menuService.getAll();
      setMenu(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Menu Load Error:", error);
    }
  }, []);

  const verifyAndLoadTableInfo = useCallback(async () => {
    if (!tableNo) return;
    try {
      console.log(
        `Triggering auto-book verification layer for Table #${tableNo}...`,
      );
      const res = await tableService.bookTableOnScan(tableNo);
      const tableData = res?.data || res;

      if (tableData) {
        setTableDetails(tableData);

        // SOCKET CONNECTION
        const socket = getSocket();
        if (socket) {
          socket.emit("joinTable", { tableNumber: tableNo });
        }

        if (tableData.status === "Occupied") {
          setScreen("cuisines");
        }
      }
    } catch (error) {
      console.log("Error loading scanned table properties:", error);
    }
  }, [tableNo]);

  // INITIAL LOAD WITH ROBUST ERROR HANDLING
  useEffect(() => {
    const loadAllInitialData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          loadMenu(),
          loadReviews(),
          loadOrders(),
          verifyAndLoadTableInfo(),
        ]);
      } catch (error) {
        console.log("Initial Load Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAllInitialData();
  }, [loadMenu, loadReviews, loadOrders, verifyAndLoadTableInfo]);

  // REAL-TIME UPDATES VIA SOCKET TO REFRESH REVIEWS & ORDERS INSTANTLY
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleRealTimeReview = () => {
      loadReviews(); // Refresh review array instantly when a new review comes
    };

    const handleRealTimeOrder = () => {
      loadOrders(); // Refresh user orders data listing status
    };

    socket.on("review-added", handleRealTimeReview);
    socket.on("order-status-changed", handleRealTimeOrder);

    return () => {
      socket.off("review-added", handleRealTimeReview);
      socket.off("order-status-changed", handleRealTimeOrder);
    };
  }, [loadReviews, loadOrders]);

  // Save Cart state to localStorage
  useEffect(() => {
    localStorage.setItem("mesa_cart", JSON.stringify(cart));
  }, [cart]);

  /* ======================================
      CORE ACTION PIPELINES (MEMOIZED)
  ====================================== */
  const goto = useCallback((nextScreen, delay = 0) => {
    if (delay > 0) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setScreen(nextScreen);
      }, delay);
      return;
    }
    setScreen(nextScreen);
  }, []);

  const addItem = useCallback((dish) => {
    setCart((previous) => ({
      ...previous,
      [dish._id]: previous[dish._id]
        ? { ...previous[dish._id], qty: previous[dish._id].qty + 1 }
        : { ...dish, qty: 1 },
    }));
  }, []);

  const removeItem = useCallback((id) => {
    setCart((previous) => {
      const nextCart = { ...previous };
      if (nextCart[id]?.qty > 1) {
        nextCart[id] = { ...nextCart[id], qty: nextCart[id].qty - 1 };
      } else {
        delete nextCart[id];
      }
      return nextCart;
    });
  }, []);

  const placeOrder = useCallback(
    async (note) => {
      try {
        const items = Object.values(cart);
        if (!items.length) return;

        const subtotal = items.reduce(
          (sum, item) => sum + item.qty * item.price,
          0,
        );
        const activeTable =
          tableNo || tableDetails?.tableNumber || tableDetails?.tableNo || 1;

        const orderData = {
          tableNo: Number(activeTable),
          items: items.map((item) => ({
            productId: item._id,
            name: item.name,
            qty: item.qty,
            price: item.price,
          })),
          subtotal,
          total: Math.round(subtotal * 1.23),
          note,
        };

        const response = await orderService.create(orderData);
        const generatedId = response?.id || response?._id || "";

        setOrderNum(generatedId);
        setShowCart(false);
        setShowToast(true);
        setCart({});
        localStorage.removeItem("mesa_cart");

        if (generatedId) {
          navigate(`/order/${generatedId}`);
        }
      } catch (error) {
        console.log("Order Submission Error:", error);
      }
    },
    [cart, navigate, tableNo, tableDetails],
  );

  const handleFeedbackDone = useCallback(async () => {
    setCart({});
    await loadReviews();
    goto("welcome");
  }, [goto, loadReviews]);

  // Stable references for UI Arrays
  const stableMenu = useMemo(() => menu, [menu]);
  const stableReviews = useMemo(() => reviews, [reviews]);
  const stableOrdersCount = useMemo(() => orders.length, [orders.length]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-black relative overflow-hidden">
      {/* Glow Visual Overlay */}
      <div className="absolute -top-[120px] left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(212,170,90,0.12)_0%,transparent_70%)] pointer-events-none z-0" />

      {/* TOP FLOATING HEADER BADGE FOR SCANNED ACTIVE TABLES */}
      {tableDetails && (
        <div className="fixed top-5 left-6 z-[999] px-4 py-2 rounded-full border border-green-500/30 bg-black/80 backdrop-blur-md text-green-400 text-xs font-mono tracking-wider shadow-md">
          🟢 Table #{tableDetails.tableNumber}
          {tableDetails.capacity ? ` (${tableDetails.capacity} Seats)` : ""}
        </div>
      )}

      {/* ADMIN PORTAL TRIGGER */}
      <button
        onClick={() => navigate("/login")}
        className="fixed top-5 right-6 z-[999] px-5 py-2.5 rounded-full bg-gradient-to-r from-[#d4aa5a] to-[#b8923f] text-black text-sm font-semibold shadow-xl cursor-pointer"
      >
        Admin Portal
      </button>

      {/* TOAST POPUPS */}
      {showToast && (
        <KitchenToast orderNo={orderNum} onDone={() => setShowToast(false)} />
      )}

      {/* SHOPPING CART SHEETS */}
      {showCart && (
        <CartSheet
          cart={cart}
          onClose={() => setShowCart(false)}
          onAdd={addItem}
          onRemove={removeItem}
          onPlaceOrder={placeOrder}
        />
      )}

      {/* WELCOME LANDING WINDOW */}
      {screen === "welcome" && (
        <WelcomeScreen
          onExplore={() => goto("cuisines", 1000)}
          onWorkflow={() => goto("workflow")}
        />
      )}

      {/* CUISINE TILES SCREEN */}
      {screen === "cuisines" && (
        <CuisineScreen
          reviews={stableReviews}
          menu={stableMenu}
          cart={cart}
          onSelectCuisine={(cuisine) => {
            setSelectedCuisine(cuisine);
            goto("menu", 700);
          }}
          onOrdersClick={() => navigate("/my-orders")}
          orderCount={stableOrdersCount}
          onCartClick={() => setShowCart(true)}
        />
      )}

      {/* DETAILED CATEGORIES MENU SCREEN */}
      {screen === "menu" && selectedCuisine && (
        <MenuScreen
          cuisine={selectedCuisine}
          reviews={stableReviews}
          menu={stableMenu}
          cart={cart}
          onBack={() => goto("cuisines")}
          onOrdersClick={() => navigate("/my-orders")}
          orderCount={stableOrdersCount}
          onCartClick={() => setShowCart(true)}
          onAddItem={addItem}
          onRemoveItem={removeItem}
        />
      )}

      {/* SUCCESS CONFIRMED LAYER */}
      {screen === "success" && (
        <SuccessScreen
          cart={cart}
          orderNum={orderNum}
          onFeedback={() => goto("feedback")}
        />
      )}

      {/* FEEDBACK SURVEY LAYER */}
      {screen === "feedback" && (
        <FeedbackScreen
          cart={cart}
          orderId={orderNum}
          tableNo={
            tableNo || tableDetails?.tableNumber || tableDetails?.tableNo
          }
          onDone={handleFeedbackDone}
        />
      )}

      {/* WORKFLOW GUIDE */}
      {screen === "workflow" && (
        <WorkflowScreen onBack={() => goto("welcome")} />
      )}
    </div>
  );
}
