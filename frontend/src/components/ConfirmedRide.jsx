import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ConfirmedRide = (props) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🚖 Verify OTP & Start Ride
  const verifyOtpAndStartRide = async () => {

    if (otp.length !== 4) {
      alert("Enter valid 4-digit OTP");
      return;
    }

    const token = localStorage.getItem("captainToken");

    if (!token) {
      alert("Captain not logged in");
      return;
    }

    if (!props.rideId) {
      alert("Ride ID missing");
      return;
    }

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

        alert("Ride Started 🚖");

        // Close panel
        if (props.setconfirmRidePanel) {
          props.setconfirmRidePanel(false);
        }

        // Navigate to riding screen
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
    <div className="h-screen relative px-5 pt-10 pb-6 bg-[#f9fafb] overflow-y-auto">

      {/* STATUS */}
      <div className="mx-auto mb-6 w-fit px-6 py-2 rounded-full bg-green-100 text-green-600 font-semibold text-sm shadow">
        Driver Arrived
      </div>

      {/* OTP INPUT CARD */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">

        <h3 className="text-center font-semibold mb-4 text-lg">
          Enter Ride OTP
        </h3>

        {/* OTP INPUT */}
        <input
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value.replace(/\D/g, ""))
          }
          placeholder="Enter 4-digit OTP"
          maxLength={4}
          inputMode="numeric"
          pattern="[0-9]*"
          className="w-full text-center text-2xl font-semibold py-4 rounded-xl border outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* START RIDE */}
        <button
          onClick={verifyOtpAndStartRide}
          disabled={loading}
          className="mt-4 w-full py-4 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
        >
          {loading ? "Starting..." : "Start Ride"}
        </button>

        {/* CANCEL */}
        <button
          onClick={() => props.setconfirmRidePanel(false)}
          className="mt-3 w-full py-4 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition"
        >
          Cancel Ride
        </button>

      </div>
    </div>
  );
};

export default ConfirmedRide;
