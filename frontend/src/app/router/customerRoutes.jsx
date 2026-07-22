import { lazy } from "react";
import { Route } from "react-router-dom";
import { CUSTOMER_PATHS } from "@/app/routes/paths";
import GuestSessionProvider from "@/features/customer/context/GuestSessionProvider";

const CustomerRestaurantPage = lazy(() => import("@/features/customer/pages/FrontPage"));
const CustomerCartPage = lazy(() => import("@/features/customer/pages/CartPage"));
const CustomerOrderStatusPage = lazy(() => import("@/features/customer/pages/OrderStatus"));
const CustomerPaymentPage = lazy(() => import("@/features/customer/pages/PaymentPage"));
const CustomerOrdersPage = lazy(() => import("@/features/customer/pages/CustomerOrdersPage"));
const CustomerReviewPage = lazy(() => import("@/features/customer/pages/ReviewPage"));

export const customerRouteTree = (
  <Route element={<GuestSessionProvider />}>
    <Route path={CUSTOMER_PATHS.home} element={<CustomerRestaurantPage />} />
    <Route path={CUSTOMER_PATHS.cart} element={<CustomerCartPage />} />
    <Route path={CUSTOMER_PATHS.orderStatus} element={<CustomerOrderStatusPage />} />
    <Route path={CUSTOMER_PATHS.payment} element={<CustomerPaymentPage />} />
    <Route path={CUSTOMER_PATHS.orders} element={<CustomerOrdersPage />} />
    <Route path={CUSTOMER_PATHS.review} element={<CustomerReviewPage />} />
  </Route>
);
