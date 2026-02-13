import React, { useState } from "react";
import { Link } from "react-router-dom";

const ConfirmedRide = (props) => {
  const [otp, setotp] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <div className="h-screen relative px-5 pt-10 pb-6 bg-[#f9fafb]">

      {/* HANDLE */}
      <div className="absolute top-2 left-0 right-0 flex justify-center">
        <i className="ri-arrow-down-wide-line text-3xl text-gray-400"></i>
      </div>

      {/* STATUS */}
      <div className="mx-auto mb-4 w-fit px-6 py-2 rounded-full bg-red-100 text-red-600 font-semibold text-sm shadow">
        Ride Accepted
      </div>

      {/* RIDER CARD */}
      <div className="flex items-center justify-between bg-gradient-to-r from-orange-400 to-amber-500 rounded-2xl p-4 mb-5 shadow-lg text-white">
        <div className="flex items-center gap-3">
          <img
            src="https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e"
            className="h-14 w-14 rounded-full object-cover border-2 border-white"
          />
          <div>
            <h3 className="text-base font-semibold">RK</h3>
            <p className="text-xs opacity-90">Rider</p>
          </div>
        </div>

        <div className="text-right">
          <h3 className="text-lg font-bold">2.5 km</h3>
          <p className="text-xs opacity-90">away</p>
        </div>
      </div>

      {/* TRIP DETAILS */}
      <div className="bg-white rounded-2xl p-5 space-y-4 shadow-sm">

        <div className="flex gap-3">
          <i className="ri-map-pin-line text-xl text-gray-700"></i>
          <div>
            <h4 className="font-medium">151/12-B</h4>
            <p className="text-xs text-gray-500">{props.pickup}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <i className="ri-map-pin-fill text-xl text-gray-700"></i>
          <div>
            <h4 className="font-medium">151/12</h4>
            <p className="text-xs text-gray-500">{props.destination}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <i className="ri-bank-card-line text-xl text-gray-700"></i>
          <div>
            {props.fare && props.vehicalType && (
  <h4 className="font-medium">
    ₹{props.fare[props.vehicalType]}
  </h4>
)}

            <p className="text-xs text-gray-500">Cash payment</p>
          </div>
        </div>
      </div>

      {/* OTP + ACTION */}
      <form onSubmit={submitHandler} className="mt-6">

        {/* OTP INPUT */}
        <input
          value={otp}
          onChange={(e) => setotp(e.target.value)}
          placeholder="Enter 4-digit OTP"
          maxLength={4}
          className="
            w-full
            text-center
            text-2xl
            tracking-widest
            font-semibold
            py-4
            border-amber-950
            rounded-2xl
            bg-white
            shadow-inner
            focus:outline-none
            focus:ring-2
            focus:ring-green-400
          "
        />

        {/* CONFIRM */}
        <button
          type="button"
          onClick={() => {
            const setter = props.setconfirmRidePanel || props.setconfirmridePopUpPanel;
            if (typeof setter === "function") setter(false);
          }}
          className="
            mt-6
            w-full
            flex
            items-center
            justify-center
            gap-2
            py-4
            rounded-2xl
            bg-gradient-to-r from-green-500 to-emerald-600
            text-white
            font-semibold
            shadow-[0_12px_30px_rgba(16,185,129,0.45)]
            active:scale-95
            transition-all
          "
        >
          <i className="ri-check-double-line text-lg"></i>
          Confirm Ride
        </button>

        {/* CANCEL */}
        <button
          type="button"
          onClick={() => {
            const setter = props.setconfirmRidePanel || props.setconfirmridePopUpPanel;
            if (typeof setter === "function") setter(false);
          }}
          className="
            mt-4
            w-full
            py-4
            rounded-2xl
            bg-gradient-to-r from-red-500 to-red-600
            text-white
            font-semibold
            shadow-md
            active:scale-95
            transition
          "
        >
          Cancel Ride
        </button>
      </form>
    </div>
  );
};

export default ConfirmedRide;
