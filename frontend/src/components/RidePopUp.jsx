import React from "react";
import { MapPin, Flag, CreditCard, ChevronDown, Check, X } from "lucide-react";
import { getVehicleDetails } from "../utils/vehicleUtils";

const RidePopUp = (props) => {
  const ride = props.ride;
  const passenger = ride?.user;
  const passengerName = passenger?.fullname?.firstname
    ? `${passenger.fullname.firstname} ${passenger.fullname.lastname || ""}`.trim()
    : "Rider";

  const vehicleDisplay = getVehicleDetails(ride?.vehicleType);

  return (
    <div className="relative text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] max-w-lg mx-auto pb-2">
      {/* DRAG HANDLE */}
      <div
        onClick={() => props.setridePopUpPanel(false)}
        className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-3 cursor-pointer hover:bg-slate-400 transition"
      ></div>

      {/* HEADER TITLE */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          <h3 className="text-base font-black text-slate-900 tracking-tight">
            New {vehicleDisplay.name} Ride Request ({vehicleDisplay.icon})
          </h3>
        </div>
        <button
          onClick={() => props.setridePopUpPanel(false)}
          className="p-1 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* RIDER & VEHICLE INFO CARD */}
      <div className="bg-slate-900 text-white rounded-2xl p-3.5 mb-3 shadow-xl flex items-center justify-between border border-slate-800">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={
              passenger?.photo ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(passengerName)}&background=4F46E5&color=fff&bold=true`
            }
            alt={passengerName}
            className="h-12 w-12 rounded-xl object-cover border-2 border-emerald-400 shrink-0"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(passengerName || "User")}&background=4F46E5&color=fff&bold=true`;
            }}
          />
          <div className="min-w-0">
            <h4 className="text-sm font-extrabold text-white truncate">{passengerName}</h4>
            <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
              <span>{vehicleDisplay.icon}</span>
              <span>{vehicleDisplay.name} ({vehicleDisplay.label})</span>
            </p>
          </div>
        </div>

        <img
          src={vehicleDisplay.image}
          alt={vehicleDisplay.name}
          className="h-10 w-16 object-contain opacity-90 shrink-0"
        />
      </div>

      {/* TRIP DETAILS CARD */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-3 mb-4 shadow-sm text-xs">
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Pickup Location</h4>
            <p className="font-extrabold text-slate-900 leading-snug mt-0.5">{ride?.pickup || "Pickup"}</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
            <Flag className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Destination Address</h4>
            <p className="font-extrabold text-slate-900 leading-snug mt-0.5">{ride?.destination || "Destination"}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2.5 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-600">Trip Fare</span>
          </div>
          <span className="text-xl font-black text-emerald-600">₹{ride?.fare || 0}</span>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={async () => {
            await props.confirmedRide?.();
          }}
          className="h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2 text-sm"
        >
          <Check className="w-4.5 h-4.5" />
          <span>Accept Ride</span>
        </button>

        <button
          onClick={() => props.setridePopUpPanel(false)}
          className="h-12 bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold rounded-xl transition active:scale-95 flex items-center justify-center gap-2 text-sm"
        >
          <X className="w-4.5 h-4.5" />
          <span>Ignore</span>
        </button>
      </div>
    </div>
  );
};

export default RidePopUp;
