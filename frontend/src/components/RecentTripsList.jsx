import React from "react";
import { MapPin, Navigation, Clock, CheckCircle2, AlertCircle, Car, ArrowRight } from "lucide-react";

const RecentTripsList = ({ trips = [], isLoading = false }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-xl font-extrabold text-white">Recent Trips</h3>
          <p className="text-xs text-slate-400">Activity log & fare receipts</p>
        </div>
        <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs font-bold border border-slate-700">
          {trips.length} Total
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-20 bg-slate-800/50 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : trips.length === 0 ? (
        <div className="border border-dashed border-slate-800 rounded-2xl p-8 text-center bg-slate-950/40">
          <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Car className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-white mb-1">No trips completed yet</h4>
          <p className="text-xs text-slate-400">
            Complete your first ride to see your detailed trip history and payment breakdowns here.
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {trips.map((trip) => {
            const formattedDate = new Date(trip.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={trip._id}
                className="bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 p-4 rounded-2xl transition-all duration-200 hover:bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-slate-700/60 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <Car className="w-5 h-5" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                      <span className="truncate max-w-[140px] sm:max-w-[200px]" title={trip.pickup}>
                        {trip.pickup}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate max-w-[140px] sm:max-w-[200px]" title={trip.destination}>
                        {trip.destination}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {formattedDate}
                      </span>
                      {trip.distance > 0 && (
                        <span>• {trip.distance} km</span>
                      )}
                      {trip.user?.fullname && (
                        <span>• Rider: {trip.user.fullname.firstname}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-1 border-t sm:border-t-0 border-slate-800/60 pt-2 sm:pt-0 mt-1 sm:mt-0">
                  <span className="text-base font-extrabold text-white">
                    ₹{trip.fare?.toLocaleString("en-IN") || 0}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md ${
                      trip.status === "completed"
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800/60"
                        : trip.status === "ongoing" || trip.status === "accepted"
                        ? "bg-blue-950 text-blue-400 border border-blue-800/60"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {trip.status === "completed" && <CheckCircle2 className="w-3 h-3" />}
                    {trip.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentTripsList;
