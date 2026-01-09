import { createContext, useContext, useEffect, useMemo, useState } from "react";
import LoginModal from "@/components/LoginModal";
import { TOKEN_STORAGE_KEY } from "@/constants/auth";

const AuthContext = createContext({
  isAuthenticated: false,
});

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCheckedToken, setHasCheckedToken] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    if (storedToken && storedToken.startsWith("Bearer ")) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setHasCheckedToken(true);
  }, []);

  const handleLoginSuccess = (token) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    }
    setIsAuthenticated(true);
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
    }),
    [isAuthenticated],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      {hasCheckedToken && !isAuthenticated && (
        <LoginModal onSuccess={handleLoginSuccess} />
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
