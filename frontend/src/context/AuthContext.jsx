import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);
const SESSION_KEY = "glamspot-session";
const LEGACY_SESSION_KEY = "glamspot-admin-session";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const saved =
      localStorage.getItem(SESSION_KEY) || localStorage.getItem(LEGACY_SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const login = (payload) => {
    setSession(payload);
    localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
    localStorage.removeItem(LEGACY_SESSION_KEY);
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(LEGACY_SESSION_KEY);
  };

  const value = useMemo(
    () => ({
      session,
      token: session?.token || null,
      user: session?.user || null,
      isAuthenticated: Boolean(session?.token),
      isAdmin: session?.user?.role === "admin",
      login,
      logout
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
