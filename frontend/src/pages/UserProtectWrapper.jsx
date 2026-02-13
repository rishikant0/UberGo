import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/usercontext";

const UserProtectWrapper = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const { user, setUser } = useContext(UserDataContext);

  useEffect(() => {
    // Normalize token: can be stored as plain token or JSON with { token }
    let raw = localStorage.getItem("token");
    let token = null;

    if (!raw) {
      navigate("/login");
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        // If stored a wrapper like { token: '...' }
        if (parsed.token) {
          token = parsed.token;
        } else {
          // Likely a stored user object (old bug) — remove and redirect
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
      } else if (typeof parsed === "string") {
        token = parsed;
      }
    } catch (e) {
      // raw wasn't JSON — assume it's the token string
      token = raw;
    }

    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setUser(res.data.user || res.data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log("Profile fetch failed:", err.response?.status || err.message);
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate, setUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default UserProtectWrapper;
