import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${import.meta.env.VITE_API_URL}/users/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch(() => {
        // ignore error
      })
      .finally(() => {
        localStorage.removeItem("token");
        navigate("/login"); // ✅ correct redirect
      });
  }, [navigate]);

  return <div>Logging out...</div>;
};

export default UserLogout;
