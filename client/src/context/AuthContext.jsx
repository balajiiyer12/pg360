import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function: LocalStorage se Authorization Header generate karne ke liye
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  // User auth status check karne ke liye helper function
  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    
    // Agar local storage me token hi nahi hai toh API call waste mat karo
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        localStorage.removeItem("token");
        setUser(null);
        return;
      }

      const data = await response.json();
      if (data?.success && data?.user) {
        setUser(data.user);
      } else {
        localStorage.removeItem("token");
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

  // Login Function
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.msg || errorData?.message || "Login failed");
      }

      const data = await response.json();

      // 1. Token Ko LocalStorage me Save Karo
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }

      if (data?.user) {
        setUser(data.user);

        // 2. Extra details (/auth/me) fetch karne ke liye call
        try {
          const fullRes = await fetch(`${API_BASE_URL}/auth/me`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${data.token}`,
            },
          });

          if (fullRes.ok) {
            const fullData = await fullRes.json();
            if (fullData?.user) {
              setUser(fullData.user);
              return fullData.user;
            }
          }
        } catch {
          // Extra fetch fail hone par fallback
        }

        return data.user;
      }
      return null;
    } catch (error) {
      throw error;
    }
  };

  // Signup Function
  const signup = async (name, email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.message || data?.msg || "Signup failed";
      throw new Error(errorMessage);
    }

    return data;
  };

  // Logout Function
  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST", // HTTP standard ke mutabiq POST rakha hai
        headers: getAuthHeaders(),
      });
    } catch {
      // Ignore network errors on logout
    } finally {
      // Local token aur state dono clean kar do
      localStorage.removeItem("token");
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