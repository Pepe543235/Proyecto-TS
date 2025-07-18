import { createContext, useEffect, useState, useContext } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  userId: string;
  roles: string[];
  exp: number;
  iat: number;
}

interface AuthContextType {
  token: string | null;
  userId: string | null;
  roles: string[];
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const decoded = jwtDecode<DecodedToken>(storedToken);
      setToken(storedToken);
      setRoles(decoded.roles);
      setUserId(decoded.userId);
    }
  }, []);

  const login = (token: string) => {
    const decoded = jwtDecode<DecodedToken>(token);
    setToken(token);
    setRoles(decoded.roles);
    setUserId(decoded.userId);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUserId(null);
    setRoles([]);
  };

  return (
    <AuthContext.Provider value={{ token, userId, roles, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}
