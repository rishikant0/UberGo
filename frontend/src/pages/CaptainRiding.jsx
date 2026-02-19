import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ConfirmedRide = (props) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const verifyOtpAndStartRide = async () => {

    if (otp.length !== 4) {
      alert("Enter valid 4-digit OTP");
      return;
    }

    const token = localStorage.getItem("captainToken");
    if (!token) return alert("Please login again");

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_URL}/rides/start`,
        {
          rideId: props.rideId,
          otp: otp,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        alert("Ride Started 🚗");

        // 🔥 CLOSE POPUP
        props.setconfirmRidePanel?.(false);

        // 🔥 OPEN RIDING SCREEN
        navigate("/captain-riding", {
          state: { ride: res.data.ride },
        });
      }

    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5">

      <h3 className="text-center font-semibold mb-4">
        Enter Ride OTP
      </h3>

      <input
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter 4-digit OTP"
        maxLength={4}
        className="w-full text-center text-xl py-3 border rounded-xl"
      />

      <button
        onClick={verifyOtpAndStartRide}
        disabled={loading}
        className="mt-4 w-full bg-green-600 text-white py-3 rounded-xl"
      >
        {loading ? "Starting..." : "Start Ride"}
      </button>

    </div>
  );
};

export default ConfirmedRide;
