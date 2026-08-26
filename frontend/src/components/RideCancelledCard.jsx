import React from "react";
import { XCircle, ArrowRight } from "lucide-react";

const RideCancelledCard = ({ cancelledBy, cancelReason, onGoHome }) => {
  const byText = cancelledBy === "user" ? "Passenger" : cancelledBy === "captain" ? "Captain" : "System";

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
        
        <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto shadow-lg animate-pulse">
          <XCircle className="w-10 h-10" />
        </div>

        <div>
          <h3 className="text-xl font-black text-white">Ride Cancelled</h3>
          <p className="text-xs font-semibold text-rose-400 mt-1">
            This trip was cancelled by the {byText}.
          </p>
        </div>

        {cancelReason && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-slate-300">
            <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px] mb-1">
              Cancellation Reason
            </span>
            <p className="font-semibold italic">"{cancelReason}"</p>
          </div>
        )}

        <button
          onClick={onGoHome}
          className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-xl shadow-xl transition active:scale-95 flex items-center justify-center gap-2 text-sm"
        >
          <span>Go to Home</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};

export default RideCancelledCard;
