import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserDataContext = createContext(null);

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 Restore user from token on page load
  useEffect(() => {
    const restoreUser = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          setIsLoading(false);
          return;
        }

        console.log("📋 Restoring user from token...");

        const response = await axios.get(
          `${import.meta.env.VITE_URL}/users/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("✅ User restored:", response.data);
        setUser(response.data);
        setError(null);
      } catch (err) {
        console.error("❌ Failed to restore user:", err.message);
        setError(err.message);
        // Clear invalid token
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreUser();
  }, []);

  return (
    <UserDataContext.Provider value={{ user, setUser, isLoading, error }}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContextProvider;
