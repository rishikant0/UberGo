import React, { useState } from "react";
import { Power, AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";

const OnlineToggleHeader = ({ isOnline, toggleOnline, isToggling, activeRide }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleToggleClick = () => {
    // If going offline while active ride exists, trigger modal warning
    if (isOnline && activeRide) {
      setShowConfirmModal(true);
    } else {
      toggleOnline();
    }
  };

  const confirmOffline = () => {
    setShowConfirmModal(false);
    toggleOnline();
  };

  return (
    <>
      <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-xl flex items-center justify-between gap-3">
        {/* Status Indicator */}
        <div className="flex items-center gap-3">
          <div
            className={`w-3.5 h-3.5 rounded-full ${
              isOnline ? "bg-emerald-400 animate-pulse glow-online" : "bg-slate-500"
            }`}
          ></div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Current Availability</p>
            <h4 className="text-sm sm:text-base font-extrabold text-white">
              {isOnline ? "🟢 You're Online" : "⚫ You're Offline"}
            </h4>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={handleToggleClick}
          disabled={isToggling}
          className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all shadow-lg active:scale-95 ${
            isOnline
              ? "bg-slate-800 hover:bg-rose-950/40 text-rose-400 border border-slate-700 hover:border-rose-800"
              : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/40 glow-online"
          }`}
        >
          <Power className={`w-4 h-4 ${isToggling ? "animate-spin" : ""}`} />
          <span>{isToggling ? "Updating..." : isOnline ? "Go Offline" : "Go Online"}</span>
        </button>
      </div>

      {/* CONFIRMATION MODAL FOR ACTIVE RIDE */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 bg-rose-950/80 border border-rose-800/60 rounded-2xl flex items-center justify-center text-rose-400 mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-white mb-1">Active Ride in Progress</h3>
              <p className="text-xs text-slate-300">
                You currently have an active ride request. Going offline may affect your passenger experience. Are you sure you want to proceed?
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmOffline}
                className="flex-1 py-3 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-500 transition shadow-lg shadow-rose-600/30"
              >
                Confirm Offline
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OnlineToggleHeader;
