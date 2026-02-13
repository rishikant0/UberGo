import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CaptainDataContext } from "../context/captaincontext";
import axios from "axios";

const CaptainProtectWrapper = ({ children }) => {
  const navigate = useNavigate();
  // Normalize token like UserProtectWrapper to handle string or JSON storage
  let raw = localStorage.getItem("token");
  let token = null;

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        token = parsed.token || null;
      } else if (typeof parsed === "string") {
        token = parsed;
      }
    } catch (e) {
      token = raw;
    }
  }

  const { captain, setCaptain } = useContext(CaptainDataContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/captain-login");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_URL}/captains/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setCaptain(response.data.captain);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log("Profile fetch failed:", err.response?.status || err.message);
        // Only remove token and redirect on 401 Unauthorized
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/captain-login");
        }
      });
  }, [token, navigate, setCaptain]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default CaptainProtectWrapper;
