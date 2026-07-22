import { lazy } from "react";
import { Navigate, Route } from "react-router-dom";
import { STAFF_PATHS } from "@/app/routes/paths";
import LoginPage from "@/features/auth/pages/LoginPage";
import StaffAuthBoundary from "@/routes/StaffAuthBoundary";
import ProtectedRoutes from "@/routes/ProtectedRoutes";

const AdminDashboardPage = lazy(() => import("@/features/dashboard/pages/AdminPanel"));
const KitchenDashboardPage = lazy(() => import("@/features/kitchen/pages/KitchenDashboard"));

export const staffRouteTree = (
  <Route element={<StaffAuthBoundary />}>
    <Route path={STAFF_PATHS.adminLogin} element={<LoginPage initialRole="admin" />} />
    <Route path={STAFF_PATHS.kitchenLogin} element={<LoginPage initialRole="kitchen" />} />
    <Route path={STAFF_PATHS.legacyLogin} element={<Navigate to={STAFF_PATHS.adminLogin} replace />} />

    <Route element={<ProtectedRoutes allowedRoles={["admin"]} />}>
      <Route path={STAFF_PATHS.adminDashboard} element={<AdminDashboardPage />} />
    </Route>
    <Route element={<ProtectedRoutes allowedRoles={["admin", "kitchen"]} />}>
      <Route path={STAFF_PATHS.kitchenDashboard} element={<KitchenDashboardPage />} />
    </Route>
  </Route>
);
