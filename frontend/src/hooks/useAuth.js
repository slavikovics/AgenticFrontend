import { useState, useEffect } from "react";
import { isTokenExpiredOrExpiring, getValidToken } from "../utils/tokenUtils";
import { refreshToken } from "../api/authFetch";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("jwt_token");
      const savedUser = localStorage.getItem("user_data");

      if (!token || !savedUser) {
        setIsLoading(false);
        return;
      }

      if (!isTokenExpiredOrExpiring(token)) {
        setUser(JSON.parse(savedUser));
        setIsLoading(false);
        return;
      }

      try {
        await refreshToken();
        const refreshedUser = localStorage.getItem("user_data");
        if (refreshedUser) setUser(JSON.parse(refreshedUser));
      } catch {
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("user_data");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    getToken: getValidToken,
  };
};
