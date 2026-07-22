import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { userService } from "../services/userService";

export default function GuestSessionProvider() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    userService.createSession()
      .catch(() => null)
      .finally(() => setIsReady(true));
  }, []);

  if (!isReady) {
    return <div className="flex min-h-screen items-center justify-center bg-mesa-bg text-mesa-gold">Loading...</div>;
  }

  return <Outlet />;
}
