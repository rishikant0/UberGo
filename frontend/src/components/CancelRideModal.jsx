import React, { useState } from "react";
import { X, AlertTriangle } from "lucide-react";

const USER_REASONS = [
  "Driver is taking too long",
  "Changed my plans",
  "Wrong pickup location",
  "Found another ride",
  "Other",
];

const CAPTAIN_REASONS = [
  "Passenger unavailable",
  "Wrong pickup location",
  "Too far away",
  "Vehicle issue",
  "Emergency",
  "Other",
];

const CancelRideModal = ({ isOpen, onClose, onConfirmCancel, role = "user", loading }) => {
  const reasons = role === "captain" ? CAPTAIN_REASONS : USER_REASONS;
  const [selectedReason, setSelectedReason] = useState(reasons[0]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onConfirmCancel(selectedReason);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 font-['Plus_Jakarta_Sans',sans-serif] relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-white">Cancel Ride?</h3>
          <p className="text-xs font-semibold text-slate-400">
            Are you sure you want to cancel this ride? Select a reason:
          </p>
        </div>

        <div className="space-y-2 py-1 max-h-56 overflow-y-auto pr-1">
          {reasons.map((reason, idx) => (
            <label
              key={idx}
              onClick={() => setSelectedReason(reason)}
              className={`flex items-center justify-between p-3 rounded-xl border text-xs font-bold cursor-pointer transition ${
                selectedReason === reason
                  ? "bg-rose-950/50 border-rose-500 text-rose-300"
                  : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700"
              }`}
            >
              <span>{reason}</span>
              <input
                type="radio"
                name="cancelReason"
                checked={selectedReason === reason}
                onChange={() => setSelectedReason(reason)}
                className="accent-rose-500 w-4 h-4"
              />
            </label>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold rounded-xl text-xs transition"
          >
            Keep Ride
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-extrabold rounded-xl text-xs shadow-lg transition"
          >
            {loading ? "Cancelling..." : "Cancel Ride"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CancelRideModal;
