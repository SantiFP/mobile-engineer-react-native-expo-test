import { useEffect, useState } from "react";
import { authService } from "../services/authService";

export const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const t = await authService.getToken();
      setToken(t);
      setIsAuthenticated(!!t);
      setLoading(false);
    };

    checkAuth();
  }, []);

  return { loading, isAuthenticated, token };
};
