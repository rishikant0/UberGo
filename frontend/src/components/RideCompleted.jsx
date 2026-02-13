import React, { useState } from "react";
import { Link } from "react-router-dom";

const RideCompleted = () => {
  const [rating, setRating] = useState(0);

  return (
    <div className="h-screen bg-white px-5 pt-14 pb-8 flex flex-col justify-between">

      {/* SUCCESS ICON */}
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-xl animate-bounce">
          <i className="ri-check-line text-white text-4xl"></i>
        </div>

        <h2 className="mt-4 text-xl font-bold text-gray-900">
          Ride Completed
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Great job! You’ve completed the ride.
        </p>
      </div>

      {/* EARNINGS */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-3xl p-6 shadow-[0_15px_35px_rgba(16,185,129,0.45)] mt-8">
        <p className="text-sm opacity-90">Trip Earnings</p>
        <h1 className="text-4xl font-bold mt-2">₹185.05</h1>

        <div className="flex justify-between mt-4 text-xs opacity-90">
          <span>Cash Payment</span>
          <span>2.5 km</span>
        </div>
      </div>

      {/* RATING */}
      <div className="mt-10 text-center">
        <h3 className="text-base font-semibold mb-3">
          Rate your Rider
        </h3>

        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <i
              key={star}
              onClick={() => setRating(star)}
              className={`ri-star-fill text-3xl cursor-pointer transition ${
                star <= rating ? "text-yellow-400 scale-110" : "text-gray-300"
              }`}
            ></i>
          ))}
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Tap to rate
        </p>
      </div>

      {/* CTA */}
      <div className="mt-10 flex flex-col gap-3">
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
            bg-gray-100
            text-gray-800
            py-4
            rounded-2xl
            font-semibold
            text-center
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
