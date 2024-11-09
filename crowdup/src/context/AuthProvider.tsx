import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (role: string) => void; // Update to accept a role
  logout: () => void;
  setUserRole: (role: string) => void;
}

const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  isAdmin: false,
  login: () => {},
  logout: () => {},
  setUserRole: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const savedAuthStatus = localStorage.getItem("isAuthenticated");
    const savedUserRole = localStorage.getItem("userRole");
    if (savedAuthStatus === "true") {
      setIsAuthenticated(true);
      setIsAdmin(savedUserRole === "admin");
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const login = (role: string) => {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userRole", role);
    setIsAuthenticated(true);
    setIsAdmin(role === "admin");
  };

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userCity");
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  const setUserRole = (role: string) => {
    localStorage.setItem("userRole", role);
    setIsAdmin(role === "admin");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isAdmin, login, logout, setUserRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
