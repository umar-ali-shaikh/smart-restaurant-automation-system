import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { customerRouteTree } from "./customerRoutes";
import { staffRouteTree } from "./staffRoutes";

function RouteFallback() {
  return <div className="flex min-h-screen items-center justify-center bg-mesa-bg text-mesa-gold">Loading...</div>;
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

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {customerRouteTree}
          {staffRouteTree}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
