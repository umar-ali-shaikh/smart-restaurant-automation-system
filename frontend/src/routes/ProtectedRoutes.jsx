import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function ProtectedRoutes({ allowedRoles }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;
  if (!user) {
    const loginPath = location.pathname === "/kitchen" ? "/kitchen/login" : "/admin/login";
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }
  if (allowedRoles?.length && !allowedRoles.includes(user.role))
    return <Navigate to={user.role === "kitchen" ? "/kitchen" : "/admin"} replace />;

  return <Outlet />;
}
