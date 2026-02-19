import React from "react";
import { Link, useLocation } from "react-router-dom";

const Riding = () => {
  const location = useLocation();
  const ride = location.state?.ride;

  return (
    <div className="h-screen w-full flex flex-col bg-gray-100">

      {/* HOME BUTTON */}
      <Link
        to="/home"
        className="fixed top-4 left-4 z-50 h-10 w-10 bg-white shadow-md flex items-center justify-center rounded-full"
      >
        <i className="ri-home-5-line text-lg"></i>
      </Link>

      {/* MAP */}
      <div className="h-1/2 w-full">
        <img
          className="w-full h-full object-cover"
          src="https://cdn.theatlantic.com/thumbor/BlEOtTo9L9mjMLuyCcjG3xYr4qE=/0x48:1231x740/960x540/media/img/mt/2017/04/IMG_7105/original.png"
          alt="map"
        />
      </div>

      {/* DETAILS */}
      <div className="h-1/2 bg-white rounded-t-3xl px-4 pt-4">

        {/* DRIVER CARD */}
        <div className="flex items-center gap-4 bg-white rounded-xl shadow-sm p-4 mb-4">

          <img
            className="h-16 w-24 object-contain"
            src="https://tb-static.uber.com/prod/vehicles-importer/2024/maruti-suzuki/dzire/high_res/1813669578094.png"
            alt="vehicle"
          />

          <div className="flex-1 text-right">
            <h4 className="text-sm font-semibold">
              {ride?.captain?.fullname?.firstname || "Driver"}
            </h4>

            <p className="text-xs font-bold">
              {ride?.captain?.vehicle?.plateNumber || "N/A"}
            </p>

            <p className="text-xs text-gray-500">
              {ride?.captain?.vehicle?.type || "Car"}
            </p>
          </div>

        </div>

        {/* TRIP DETAILS */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-4">

          <p><b>Pickup:</b> {ride?.pickup}</p>
          <p><b>Destination:</b> {ride?.destination}</p>
          <p><b>Fare:</b> ₹{ride?.fare}</p>

        </div>

        {/* PAY BUTTON */}
        <button className="w-full mt-5 bg-green-600 text-white py-4 rounded-2xl">
          Pay ₹{ride?.fare}
        </button>

      </div>
    </div>
  );
};

export default Riding;
