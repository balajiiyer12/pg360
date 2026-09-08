import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/apiClient.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const data = await api.get("/auth/me");
      if (data?.success && data?.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const data = await api.post("/auth/login", { email, password });
    if (data?.user) {
      setUser(data.user);
      // Also fetch full user details including room if tenant
      try {
        const fullData = await api.get("/auth/me");
        if (fullData?.user) {
          setUser(fullData.user);
          return fullData.user;
        }
      } catch {
        // ignore and return basic user
      }
      return data.user;
    }
    return null;
  };

  const signup = async (name, email, password) => {
    return await api.post("/auth/signup", { name, email, password });
  };

  const logout = async () => {
    try {
      await api.get("/auth/logout");
    } catch {
      // ignore
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        refreshUser: checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
