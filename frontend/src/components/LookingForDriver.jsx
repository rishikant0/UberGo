import React, { useEffect, useState } from "react";
import { MapPin, Flag, CreditCard, X, RefreshCw } from "lucide-react";
import { getVehicleDetails } from "../utils/vehicleUtils";

const LookingForDriver = (props) => {
  const [animationIndex, setAnimationIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationIndex((prev) => (prev + 1) % 3);
    }, 600);

    return () => clearInterval(interval);
  }, []);

  const dots = [".", "..", "..."][animationIndex];

  // Dynamic vehicle info single source of truth
  const vehicle = getVehicleDetails(props.vehicalType);

  // Safe fare display
  let displayFare = 0;
  if (props.fare) {
    if (typeof props.fare === "object") {
      const typeKey = vehicle.key;
      displayFare = props.fare[typeKey] || props.fare[props.vehicalType] || props.fare.car || 0;
    } else {
      displayFare = props.fare;
    }
  }

  return (
    <div className="relative text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] max-w-lg mx-auto pb-4">

      {/* CLOSE HANDLE */}
      <div
        onClick={() => props.setvehicalFound(false)}
        className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4 cursor-pointer hover:bg-slate-400 transition"
      ></div>

      {/* TITLE */}
      <div className="text-center mb-4 space-y-1">
        <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
          <span>Searching for nearby {vehicle.label} Captains</span>
          <span className="text-xl">{vehicle.icon}</span>
        </h3>

        <p className="text-xs font-semibold text-slate-500">
          Broadcasting request to online {vehicle.name} drivers{dots}
        </p>
      </div>

      {/* SEARCHING ANIMATION & VEHICLE IMAGE */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 mb-4 shadow-xl flex flex-col items-center justify-center relative overflow-hidden border border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-emerald-500/10 animate-pulse"></div>

        {/* DYNAMIC VEHICLE IMAGE MATCHING USER SELECTION */}
        <div className="relative z-10 my-2 flex flex-col items-center">
          <img
            className="h-24 object-contain drop-shadow-2xl transition-all duration-300"
            src={vehicle.image}
            alt={vehicle.name}
          />
          <div className="mt-2 flex items-center gap-2 px-3 py-1 bg-slate-950/80 border border-slate-800 rounded-full text-xs font-bold text-emerald-400">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            <span>Matching {vehicle.name}...</span>
          </div>
        </div>
      </div>

      {/* RIDE DETAILS CARD */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3.5 mb-4 shadow-sm">

        {/* PICKUP */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pickup Location</h4>
            <p className="text-sm font-extrabold text-slate-900 leading-snug mt-0.5">
              {props.pickup || "Pickup address..."}
            </p>
          </div>
        </div>

        {/* DESTINATION */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
            <Flag className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Destination Address</h4>
            <p className="text-sm font-extrabold text-slate-900 leading-snug mt-0.5">
              {props.destination || "Destination address..."}
            </p>
          </div>
        </div>

        {/* FARE */}
        <div className="flex items-start gap-3 pt-3 border-t border-slate-200">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
            <CreditCard className="w-4 h-4" />
          </div>
          <div className="flex-1 flex justify-between items-center">
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estimated Fare ({vehicle.name})</h4>
              <p className="text-xs font-semibold text-slate-600">Cash Payment at Destination</p>
            </div>
            <span className="text-2xl font-black text-emerald-600">
              ₹{displayFare}
            </span>
          </div>
        </div>
      </div>

      {/* CANCEL BUTTON */}
      <button
        onClick={() => props.setvehicalFound(false)}
        className="w-full h-12 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl shadow-lg transition active:scale-95 text-sm"
      >
        Cancel Search
      </button>

    </div>
  );
};

export default LookingForDriver;
