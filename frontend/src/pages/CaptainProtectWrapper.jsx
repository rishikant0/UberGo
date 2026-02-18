import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CaptainDataContext } from "../context/captaincontext";
import axios from "axios";

const CaptainProtectWrapper = ({ children }) => {
  const navigate = useNavigate();
  const { setCaptain } = useContext(CaptainDataContext);
  const [isLoading, setIsLoading] = useState(true);

  // 🔥 Simple token retrieval
  const token = localStorage.getItem("captainToken");

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
        console.log(
          "Profile fetch failed:",
          err.response?.status || err.message
        );

        // 🔥 Only logout on 401
        if (err.response?.status === 401) {
          localStorage.removeItem("captainToken");
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
