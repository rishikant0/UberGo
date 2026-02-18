import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CaptainDataContext = createContext(null);

const CaptainContextProvider = ({ children }) => {
  const [captain, setCaptain] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const restoreCaptain = async () => {
      try {
        // Use a dedicated 'captainToken' key for captain authentication
        const token = localStorage.getItem("captainToken");

        if (!token) {
          setIsLoading(false);
          return;
        }

        console.log("📋 Restoring captain from token...");

        const response = await axios.get(
          `${import.meta.env.VITE_URL}/captains/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setCaptain(response.data.captain || response.data);
        setError(null);

      } catch (err) {
        console.error("❌ Failed to restore captain:", err.response?.data || err.message);

        setError(err.message);

        // Remove token only when unauthorized
        if (err.response?.status === 401) {
          localStorage.removeItem("captainToken");
          setCaptain(null);
        }

      } finally {
        setIsLoading(false);
      }
    };

    restoreCaptain();
  }, []);

  return (
    <CaptainDataContext.Provider
      value={{
        captain,
        setCaptain,
        isLoading,
        error,
      }}
    >
      {children}
    </CaptainDataContext.Provider>
  );
};

export default CaptainContextProvider;
