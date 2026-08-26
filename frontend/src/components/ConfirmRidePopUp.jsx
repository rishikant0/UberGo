import React from "react";
import { MapPin, Flag, CreditCard, ChevronDown, ArrowRight } from "lucide-react";
import { getVehicleDetails } from "../utils/vehicleUtils";

const ConfirmRidePopUp = (props) => {
  const vehicle = getVehicleDetails(props.vehicalType);

  let selectedFare = 0;
  if (props.fare) {
    if (typeof props.fare === "object") {
      selectedFare = props.fare[vehicle.key] || props.fare[props.vehicalType] || props.fare.car || 0;
    } else {
      selectedFare = props.fare;
    }
  }

  return (
    <div className="relative text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] max-w-lg mx-auto pb-4">
      {/* DRAG HANDLE */}
      <div
        onClick={() => props.setconfirmRidepopUp(false)}
        className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4 cursor-pointer hover:bg-slate-400 transition"
      ></div>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Confirm {vehicle.name}</span>
            <span className="text-xl">{vehicle.icon}</span>
          </h3>
          <p className="text-xs font-semibold text-slate-500">Review route & fare before requesting</p>
        </div>
        <button
          onClick={() => props.setconfirmRidepopUp(false)}
          className="p-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* VEHICLE PREVIEW CARD */}
      <div className="bg-slate-900 text-white rounded-2xl p-3.5 mb-4 shadow-xl flex items-center justify-between border border-slate-800">
        <div className="flex items-center gap-3">
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="h-12 w-20 object-contain"
          />
          <div>
            <h4 className="text-base font-extrabold text-white">{vehicle.name} ({vehicle.label})</h4>
            <p className="text-xs font-semibold text-emerald-400">{vehicle.tag}</p>
          </div>
        </div>
        <span className="text-2xl font-black text-emerald-400">₹{selectedFare}</span>
      </div>

      {/* DETAILS CARD */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3.5 mb-5 shadow-sm">
        {/* PICKUP */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pickup Location</h4>
            <p className="text-sm font-extrabold text-slate-900 leading-snug mt-0.5">{props.pickup}</p>
          </div>
        </div>

        {/* DESTINATION */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
            <Flag className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Destination Address</h4>
            <p className="text-sm font-extrabold text-slate-900 leading-snug mt-0.5">{props.destination}</p>
          </div>
        </div>

        {/* PAYMENT */}
        <div className="flex items-start gap-3 pt-3 border-t border-slate-200">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
            <CreditCard className="w-4 h-4" />
          </div>
          <div className="flex-1 flex justify-between items-center">
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Payment Method</h4>
              <p className="text-xs font-semibold text-slate-600">Cash / Online at Destination</p>
            </div>
            <span className="text-xl font-black text-emerald-600">
              ₹{selectedFare}
            </span>
          </div>
        </div>
      </div>

      {/* CONFIRM BUTTON */}
      <button
        onClick={() => {
          props.createRide?.();
          props.setconfirmRidepopUp(false);
        }}
        className="w-full h-13 bg-slate-950 hover:bg-slate-800 text-white font-extrabold rounded-xl shadow-xl transition active:scale-95 flex items-center justify-center gap-2 text-base"
      >
        <span>Request {vehicle.name} Now</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ConfirmRidePopUp;
