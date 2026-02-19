import React, { useState } from "react";
import axios from "axios";

const ConfirmedRide = (props) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

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
          rideId: props.rideId, // 🔥 FIX HERE
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

        if (props.setconfirmRidePanel)
          props.setconfirmRidePanel(false);

        if (props.setconfirmridePopUpPanel)
          props.setconfirmridePopUpPanel(false);
      }

    } catch (err) {
      alert(err.response?.data?.message || "Error starting ride");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen relative px-5 pt-10 pb-6 bg-[#f9fafb] overflow-y-auto">

      {/* STATUS */}
      <div className="mx-auto mb-4 w-fit px-6 py-2 rounded-full bg-green-100 text-green-600 font-semibold text-sm shadow">
        Driver Arriving
      </div>

      {/* OTP DISPLAY */}
      <div className="bg-white rounded-2xl p-5 mb-5 shadow-sm text-center">
        <h4 className="font-semibold mb-3">Share OTP with Driver</h4>

        <div className="flex justify-center gap-2 mb-3">
          {otp.split("").map((digit, i) => (
            <div
              key={i}
              className="w-12 h-12 bg-red-500 text-white rounded-lg flex items-center justify-center text-xl font-bold"
            >
              {digit}
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-500">
          Do not share OTP with anyone else
        </p>
      </div>

      {/* OTP INPUT */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">

        <input
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value.replace(/\D/g, "")) // numbers only
          }
          placeholder="Enter 4-digit OTP"
          maxLength={4}
          className="w-full text-center text-2xl font-semibold py-4 rounded-xl border"
        />

        {/* START BUTTON */}
        <button
          onClick={verifyOtpAndStartRide}
          disabled={loading}
          className="mt-4 w-full py-4 rounded-xl bg-green-600 text-white font-semibold"
        >
          {loading ? "Starting..." : "Start Ride"}
        </button>

        {/* CANCEL */}
        <button
          onClick={() => {
            if (props.setconfirmRidePanel)
              props.setconfirmRidePanel(false);
          }}
          className="mt-3 w-full py-4 rounded-xl bg-red-600 text-white font-semibold"
        >
          Cancel Ride
        </button>

      </div>
    </div>
  );
};

export default ConfirmedRide;
