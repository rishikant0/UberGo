import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CheckCircle2, Star, Home, ArrowRight, Wallet } from "lucide-react";

const FinishRide = () => {
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  
  const role = location.state?.role || "user";
  const ride = location.state?.ride;
  const fareAmount = ride?.fare || 0;

  const handleRating = (star) => {
    setRating(star);

    setTimeout(() => {
      if (role === "captain") navigate("/captain-home");
      else navigate("/home");
    }, 700);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] px-5 pt-12 pb-8 flex flex-col justify-between max-w-lg mx-auto">
      
      {/* SUCCESS ANIMATION HEADER */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-40 rounded-full"></div>
          <div className="relative w-22 h-22 rounded-3xl bg-emerald-500 flex items-center justify-center shadow-2xl animate-bounce border-2 border-emerald-300">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-black text-white tracking-tight pt-2">
          Trip Completed 🎉
        </h2>

        <p className="text-xs font-semibold text-slate-400 max-w-xs">
          {role === "captain"
            ? "Great job Captain! You have safely completed this trip."
            : "Thank you for riding with us. Hope you had a comfortable trip!"}
        </p>
      </div>

      {/* DYNAMIC FARE RECEIPT CARD */}
      <div className="my-6 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-800 text-white rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {role === "captain" ? "Trip Earnings" : "Final Ride Fare"}
            </p>
            <h1 className="text-3xl font-black text-emerald-400 mt-0.5">
              ₹{fareAmount}
            </h1>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <div className="space-y-2 text-xs font-semibold text-slate-300">
          <div className="flex justify-between">
            <span className="text-slate-400">Pickup:</span>
            <span className="font-extrabold text-white text-right max-w-[200px] truncate">{ride?.pickup || "Pickup Location"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Destination:</span>
            <span className="font-extrabold text-white text-right max-w-[200px] truncate">{ride?.destination || "Destination"}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-800/80">
            <span className="text-slate-400">Payment Status:</span>
            <span className="text-emerald-400 font-extrabold">Paid / Cash Collected</span>
          </div>
        </div>
      </div>

      {/* RATING SECTION */}
      <div className="text-center space-y-3">
        <h3 className="text-sm font-extrabold text-white">
          {role === "captain" ? "Rate your Passenger" : "Rate your Captain"}
        </h3>

        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRating(star)}
              className="p-2 transition transform active:scale-125 focus:outline-none"
            >
              <Star
                className={`w-9 h-9 transition-colors ${
                  star <= rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-700 hover:text-amber-300"
                }`}
              />
            </button>
          ))}
        </div>

        <p className="text-[11px] font-semibold text-slate-500">
          Tap stars to submit feedback
        </p>
      </div>

      {/* HOME LINK BUTTONS */}
      <div className="mt-8 space-y-3">
        <Link
          to={role === "captain" ? "/captain-home" : "/home"}
          className="w-full h-13 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl shadow-xl transition active:scale-95 flex items-center justify-center gap-2 text-sm"
        >
          <span>{role === "captain" ? "Go Back Online" : "Book Another Ride"}</span>
          <ArrowRight className="w-4.5 h-4.5" />
        </Link>
      </div>
    </div>
  );
};

export default FinishRide;