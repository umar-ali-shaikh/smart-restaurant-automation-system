import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import { ROUTES, routeComponents } from "./routeConfig";
import LoginPage from "../features/auth/pages/LoginPage";

const {
  FrontPage,
  AdminPanel,
  KitchenDashboard,
  CartPage,
  OrderStatus,
  PaymentPage,
  CustomerOrdersPage,
  ReviewPage,
} = routeComponents;

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-mesa-bg text-mesa-gold">
      Loading...
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-mesa-bg text-mesa-text">
      <div className="text-center">
        <h1 className="serif text-4xl text-mesa-gold">404</h1>
        <p className="mt-2 text-sm text-mesa-muted">Page not found</p>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path={ROUTES.customerHome} element={<FrontPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoutes allowedRoles={["admin"]} />}>
            <Route path={ROUTES.admin} element={<AdminPanel />} />
          </Route>
          <Route
            element={<ProtectedRoutes allowedRoles={["admin", "kitchen"]} />}
          >
            <Route path={ROUTES.kitchen} element={<KitchenDashboard />} />
          </Route>
          <Route path={ROUTES.cart} element={<CartPage />} />
          <Route path={ROUTES.orderStatus} element={<OrderStatus />} />
          <Route path={ROUTES.payment} element={<PaymentPage />} />
          <Route path={ROUTES.review} element={<ReviewPage />} />
          <Route path="*" element={<NotFound />} />
          <Route
            path={ROUTES.customerOrders}
            element={<CustomerOrdersPage />}
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
