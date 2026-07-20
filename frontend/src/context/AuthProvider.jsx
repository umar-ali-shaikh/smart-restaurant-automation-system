import { useMemo, useState } from "react";
import { setAuthToken } from "../api/client";
import { authService } from "../features/auth/services/authService";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("auth_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = (nextUser, token) => {
    setUser(nextUser);
    localStorage.setItem("auth_user", JSON.stringify(nextUser));
    if (token) setAuthToken(token);
  };

  const logout = async () => {
    try {
      if (localStorage.getItem("auth_token")) {
        await authService.logout();
      }
    } catch {
      // Local logout should still complete if the server session already expired.
    }

    setUser(null);
    localStorage.removeItem("auth_user");
    setAuthToken(null);
  };

  const value = useMemo(
    () => ({ user, login, logout, isAuthenticated: Boolean(user) }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
