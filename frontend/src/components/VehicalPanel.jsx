import React from "react";
import { Users, Car, Bike, ShieldCheck, ChevronDown, Check } from "lucide-react";

const VehicalPanel = ({
  setvehicalPanel,
  setvehicalType,
  setconfirmRidepopUp,
  pickup,
  destination,
  fares,
}) => {

  if (!pickup || !destination) {
    return (
      <div className="p-6 text-center text-slate-500 font-semibold text-sm">
        Please select pickup & destination locations first.
      </div>
    );
  }

  if (!fares) {
    return (
      <div className="p-8 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-600 font-bold text-sm">Calculating best fares & route...</p>
      </div>
    );
  }

  const selectVehicle = (type) => {
    setvehicalType(type);
    setvehicalPanel(false);
    setconfirmRidepopUp(true);
  };

  return (
    <div className="text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] max-w-lg mx-auto pb-4">
      {/* DRAG HANDLE */}
      <div
        onClick={() => setvehicalPanel(false)}
        className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4 cursor-pointer hover:bg-slate-400 transition"
      ></div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Choose a Ride</h3>
          <p className="text-xs font-semibold text-slate-500">Fast pickup • Real-time tracking</p>
        </div>
        <button
          onClick={() => setvehicalPanel(false)}
          className="p-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        {/* CAR */}
        <div
          onClick={() => selectVehicle("car")}
          className="flex items-center gap-3.5 border-2 border-slate-200 hover:border-slate-900 bg-white hover:bg-slate-50 rounded-2xl p-3.5 cursor-pointer transition shadow-sm group"
        >
          <img
            className="h-12 w-20 object-contain group-hover:scale-105 transition-transform"
            src="https://tb-static.uber.com/prod/vehicles-importer/2024/maruti-suzuki/dzire/high_res/1813669578094.png"
            alt="car"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-extrabold text-slate-900">UberGo</h4>
              <span className="flex items-center text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                <Users className="w-3 h-3 mr-1" /> 4
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 mt-0.5">2–4 min away • Affordable sedan</p>
          </div>

          <div className="text-right">
            <span className="text-base font-black text-slate-900">
              ₹{fares?.car ?? 0}
            </span>
          </div>
        </div>

        {/* BIKE */}
        <div
          onClick={() => selectVehicle("motorcycle")}
          className="flex items-center gap-3.5 border-2 border-slate-200 hover:border-slate-900 bg-white hover:bg-slate-50 rounded-2xl p-3.5 cursor-pointer transition shadow-sm group"
        >
          <img
            className="h-12 w-20 object-contain group-hover:scale-105 transition-transform"
            src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy85MjAwMTg5YS03MWMwLTRmNmQtYTlkZS0xYjZhODUyMzkwNzkucG5n"
            alt="bike"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-extrabold text-slate-900">Moto</h4>
              <span className="flex items-center text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                <Users className="w-3 h-3 mr-1" /> 1
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 mt-0.5">1–3 min away • Speedy solo ride</p>
          </div>

          <div className="text-right">
            <span className="text-base font-black text-slate-900">
              ₹{fares?.motorcycle ?? 0}
            </span>
          </div>
        </div>

        {/* AUTO */}
        <div
          onClick={() => selectVehicle("auto")}
          className="flex items-center gap-3.5 border-2 border-slate-200 hover:border-slate-900 bg-white hover:bg-slate-50 rounded-2xl p-3.5 cursor-pointer transition shadow-sm group"
        >
          <img
            className="h-12 w-20 object-contain group-hover:scale-105 transition-transform"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCbJM0-gQ837Dz0sT-JfKtAiiBL0biDx7vcQ&s"
            alt="auto"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-extrabold text-slate-900">Uber Auto</h4>
              <span className="flex items-center text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                <Users className="w-3 h-3 mr-1" /> 3
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 mt-0.5">2–5 min away • No haggling</p>
          </div>

          <div className="text-right">
            <span className="text-base font-black text-slate-900">
              ₹{fares?.auto ?? 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicalPanel;
