import React, { useState } from "react";
import { Link } from "react-router-dom";

const RideCompleted = () => {
  const [rating, setRating] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 px-5 pt-14 pb-8 flex flex-col justify-between">

      {/* SUCCESS SECTION */}
      <div className="flex flex-col items-center">

        <div className="relative">
          <div className="absolute inset-0 bg-green-400 blur-xl opacity-40 rounded-full"></div>

          <div className="relative w-24 h-24 rounded-full bg-green-500 flex items-center justify-center shadow-2xl animate-bounce">
            <i className="ri-check-line text-white text-5xl"></i>
          </div>
        </div>

        <h2 className="mt-5 text-2xl font-bold text-gray-900">
          Ride Completed 🎉
        </h2>

        <p className="text-sm text-gray-500 mt-1 text-center">
          Great work captain! The trip has been successfully finished.
        </p>
      </div>

      {/* EARNINGS CARD */}
      <div className="mt-8 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white rounded-3xl p-6 shadow-[0_20px_40px_rgba(16,185,129,0.4)]">

        <p className="text-sm opacity-90">Trip Earnings</p>

        <h1 className="text-4xl font-bold mt-1">₹185.05</h1>

        <div className="flex justify-between mt-5 text-sm opacity-90">

          <div className="flex items-center gap-2">
            <i className="ri-wallet-3-line"></i>
            Cash Payment
          </div>

          <div className="flex items-center gap-2">
            <i className="ri-route-line"></i>
            2.5 km
          </div>

        </div>
      </div>

      {/* RATING SECTION */}
      <div className="mt-10 text-center">

        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          Rate your Rider
        </h3>

        <div className="flex justify-center gap-3">

          {[1, 2, 3, 4, 5].map((star) => (
            <i
              key={star}
              onClick={() => setRating(star)}
              className={`ri-star-fill text-4xl cursor-pointer transition transform duration-200 ${
                star <= rating
                  ? "text-yellow-400 scale-110"
                  : "text-gray-300 hover:text-yellow-300"
              }`}
            ></i>
          ))}

        </div>

        <p className="text-xs text-gray-500 mt-2">
          Tap the stars to rate the rider
        </p>
      </div>

      {/* CTA BUTTONS */}
      <div className="mt-10 flex flex-col gap-4">

        <Link
          to="/captain-home"
          className="
          w-full
          bg-black
          text-white
          py-4
          rounded-2xl
          font-semibold
          text-center
          shadow-lg
          hover:bg-gray-900
          active:scale-95
          transition
          "
        >
          Go Online
        </Link>

        <Link
          to="/captain-home"
          className="
          w-full
          bg-white
          text-gray-800
          py-4
          rounded-2xl
          font-semibold
          text-center
          shadow-md
          border
          hover:bg-gray-100
          active:scale-95
          transition
          "
        >
          Back to Home
        </Link>

      </div>

    </div>
  );
};

export default RideCompleted;