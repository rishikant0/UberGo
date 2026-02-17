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

    const token = localStorage.getItem("token");
    if (!token) return alert("Please login again");

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_URL}/rides/start`,
        {
          rideId: props.ride?._id,
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

        // Close panel
        if (props.setconfirmRidePanel)
          props.setconfirmRidePanel(false);

        if (props.setconfirmridePopUpPanel)
          props.setconfirmridePopUpPanel(false);
      }

    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen relative px-5 pt-10 pb-6 bg-[#f9fafb] overflow-y-auto">

      {/* HANDLE */}
      <div className="absolute top-2 left-0 right-0 flex justify-center">
        <i className="ri-arrow-down-wide-line text-3xl text-gray-400"></i>
      </div>

      {/* STATUS */}
      <div className="mx-auto mb-4 w-fit px-6 py-2 rounded-full bg-green-100 text-green-600 font-semibold text-sm shadow flex items-center gap-2">
        <i className="ri-check-fill"></i> Driver Arriving
      </div>

      {/* DRIVER CARD */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl p-4 mb-5 shadow-lg text-white">

        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={props.ride?.captain?.photo || `https://ui-avatars.com/api/?name=${props.ride?.captain?.fullname?.firstname}+${props.ride?.captain?.fullname?.lastname}&background=random`}
              className="h-14 w-14 rounded-full object-cover border-2 border-white"
              alt={props.ride?.captain?.fullname?.firstname}
              onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=Driver&background=random`}
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h3 className="text-base font-semibold">
              {props.ride?.captain?.fullname?.firstname} {props.ride?.captain?.fullname?.lastname}
            </h3>
            <p className="text-xs opacity-90 flex items-center gap-1">
              <i className="ri-star-fill text-yellow-300"></i> 
              {props.ride?.captain?.rating || 4.8} ({props.ride?.captain?.totalRides || 234} rides)
            </p>
          </div>
        </div>

        <div className="text-right">
          <h3 className="text-lg font-bold bg-white bg-opacity-20 px-3 py-1 rounded-lg">
            {props.ride?.captain?.vehicle?.plateNumber || "N/A"}
          </h3>
          <p className="text-xs opacity-90 mt-1">{props.ride?.captain?.vehicle?.model}</p>
        </div>
      </div>

      {/* VEHICLE DETAILS */}
      <div className="bg-white rounded-2xl p-4 mb-5 shadow-sm">
        <h4 className="font-semibold text-gray-900 mb-3 text-sm">Vehicle Details</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">Model</p>
            <p className="text-sm font-semibold text-gray-900">
              {props.ride?.captain?.vehicle?.model || "N/A"}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">Color</p>
            <p className="text-sm font-semibold text-gray-900">
              {props.ride?.captain?.vehicle?.color || "N/A"}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">Type</p>
            <p className="text-sm font-semibold text-gray-900">
              {props.ride?.captain?.vehicle?.type || "Car"}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">Capacity</p>
            <p className="text-sm font-semibold text-gray-900">
              {props.ride?.captain?.vehicle?.capacity || "4"} seat
            </p>
          </div>
        </div>
      </div>

      {/* TRIP DETAILS */}
      <div className="bg-white rounded-2xl p-5 space-y-4 shadow-sm mb-5">

        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center flex-shrink-0">
            <i className="ri-map-pin-line text-green-700"></i>
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 text-sm">Pickup</h4>
            <p className="text-xs text-gray-500 mt-1">
              {props.ride?.pickup}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-red-200 flex items-center justify-center flex-shrink-0">
            <i className="ri-map-pin-fill text-red-700"></i>
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 text-sm">Destination</h4>
            <p className="text-xs text-gray-500 mt-1">
              {props.ride?.destination}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0">
            <i className="ri-bank-card-line text-blue-700"></i>
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 text-sm">Fare</h4>
            <p className="text-xs text-gray-500 mt-1">
              ₹{props.ride?.fare} • Cash payment
            </p>
          </div>
        </div>
      </div>

      {/* OTP SECTION */}
      <div className="bg-white rounded-2xl p-5 mb-5 shadow-sm">
        <h4 className="font-semibold text-gray-900 mb-3 text-sm flex items-center gap-2">
          <i className="ri-lock-line text-red-500"></i> Share OTP with Driver
        </h4>
        
        <div className="flex justify-center gap-2 mb-4">
          {otp && otp.split("").map((digit, idx) => (
            <div
              key={idx}
              className="w-12 h-12 bg-red-500 text-white rounded-lg flex items-center justify-center text-xl font-bold shadow-md"
            >
              {digit}
            </div>
          ))}
        </div>
        
        <p className="text-xs text-gray-500 text-center">
          This OTP confirms your identity. Do not share with anyone else.
        </p>
      </div>

      {/* LIVE STATUS */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-3 mb-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <p className="text-sm font-semibold text-green-700">Live Tracking</p>
        </div>
        <p className="text-xs text-green-600">Your driver is on the way to pick you up</p>
      </div>

      {/* OTP INPUT SECTION */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-5">

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 4-digit OTP"
          maxLength={4}
          className="
            w-full
            text-center
            text-2xl
            tracking-widest
            font-semibold
            py-4
            rounded-2xl
            bg-gray-50
            shadow-inner
            focus:outline-none
            focus:ring-2
            focus:ring-green-400
            border border-gray-200
          "
        />

        {/* START RIDE BUTTON */}
        <button
          onClick={verifyOtpAndStartRide}
          disabled={loading}
          className="
            mt-4
            w-full
            py-4
            rounded-2xl
            bg-gradient-to-r from-green-500 to-emerald-600
            text-white
            font-semibold
            shadow-[0_12px_30px_rgba(16,185,129,0.45)]
            active:scale-95
            transition-all
            disabled:opacity-50
          "
        >
          {loading ? "Starting..." : "Start Ride"}
        </button>

        {/* CANCEL */}
        <button
          onClick={() => {
            const setter =
              props.setconfirmRidePanel ||
              props.setconfirmridePopUpPanel;

            if (typeof setter === "function") setter(false);
          }}
          className="
            mt-3
            w-full
            py-4
            rounded-2xl
            bg-gradient-to-r from-red-500 to-red-600
            text-white
            font-semibold
            shadow-md
            hover:shadow-lg
            transition-all
          "
        >
          Cancel Ride
        </button>
      </div>
    </div>
  );
};

export default ConfirmedRide;
