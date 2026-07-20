import { lazy } from "react";

export const ROUTES = {
  customerHome: "/",
  admin: "/admin",
  kitchen: "/kitchen",
  cart: "/cart",
  orderStatus: "/order/:id",
  payment: "/payment",
  customerOrders: "/my-orders",
  review: "/review/:id",
};

export const routeComponents = {
  FrontPage: lazy(() => import("../features/customer/pages/FrontPage")),
  AdminPanel: lazy(() => import("../features/dashboard/pages/AdminPanel")),
  KitchenDashboard: lazy(() => import("../features/kitchen/pages/KitchenDashboard")),
  CartPage: lazy(() => import("../features/customer/pages/CartPage")),
  OrderStatus: lazy(() => import("../features/customer/pages/OrderStatus")),
  PaymentPage: lazy(() => import("../features/customer/pages/PaymentPage")),
  CustomerOrdersPage: lazy(() => import("../features/customer/pages/CustomerOrdersPage")),
  ReviewPage: lazy(() => import("../features/customer/pages/ReviewPage")),
};
