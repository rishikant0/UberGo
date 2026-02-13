import React from "react";
import Home from "./Home";

import { Link } from "react-router-dom";

const Riding = () => {
  return (
    <div className="h-screen w-full flex flex-col bg-gray-100">
<Link
  to="/home"
  className="fixed top-4 left-4 z-50 h-10 w-10 bg-white shadow-md flex items-center justify-center rounded-full active:scale-95 transition"
>
  <i className="ri-home-5-line text-lg font-bold"></i>
</Link>

      {/* MAP — TOP HALF */}
      <div className="h-1/2 w-full">
        <img
          className="w-full h-full object-cover"
          src="https://cdn.theatlantic.com/thumbor/BlEOtTo9L9mjMLuyCcjG3xYr4qE=/0x48:1231x740/960x540/media/img/mt/2017/04/IMG_7105/original.png"
          alt="map"
        />
      </div>

      {/* BOTTOM PANEL */}
      <div className="h-1/2 w-full overflow-y-auto bg-white rounded-t-3xl px-4 pt-4">

        {/* DRIVER + VEHICLE CARD */}
        <div className="flex items-center gap-4 bg-white rounded-xl shadow-sm p-4 mb-4">
          <img
            className="h-16 w-24 object-contain"
            src="https://tb-static.uber.com/prod/vehicles-importer/2024/maruti-suzuki/dzire/high_res/1813669578094.png"
            alt="vehicle"
          />

          <div className="flex-1 text-right">
            <h4 className="text-sm font-semibold text-gray-900">
              RK <span className="text-xs font-normal text-gray-500">• Driver</span>
            </h4>
            <p className="text-xs text-gray-600 font-bold text-gray-900">MP-01-SR-2012</p>
            <p className="text-xs text-gray-500">Maruti Suzuki Dzire</p>
          </div>

          
            
          </div>
       

        {/* TRIP DETAILS */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-4">

          

          {/* DESTINATION */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <i className="ri-map-pin-fill text-gray-700"></i>
            </div>
            <div>
              <h4 className="text-sm font-medium">151/12</h4>
              <p className="text-xs text-gray-500">Lalpur Chowk</p>
            </div>
          </div>

          {/* PAYMENT */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <i className="ri-bank-card-line text-gray-700"></i>
            </div>
            <div>
              <h4 className="text-sm font-medium">₹185.05</h4>
              <p className="text-xs text-gray-500">Cash payment</p>
            </div>
          </div>
        </div>

        {/* Make payment button */}
       <button
  className="
    w-full
    mt-5
    bg-gradient-to-r from-green-500 to-green-600
    text-white
    py-4
    rounded-2xl
    font-semibold
    text-base
    shadow-lg
    active:scale-95
    transition
    duration-200
    flex
    items-center
    justify-center
    gap-2
  "
>
  <i className="ri-bank-card-line text-lg"></i>
  Make Payment
</button>

      </div>
    </div>
  );
};

export default Riding;
