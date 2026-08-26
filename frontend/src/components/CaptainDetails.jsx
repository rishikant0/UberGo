import React from "react";
import { IndianRupee, Clock, Route, Car, TrendingUp, TrendingDown, Minus, Star, Award, ShieldCheck } from "lucide-react";

const CaptainDetails = ({ dashboardData, isLoading, isOnline }) => {
  const captain = dashboardData?.captain;
  const today = dashboardData?.today || { earnings: 0, trips: 0, distance: 0, onlineHours: 0 };
  const yesterday = dashboardData?.yesterday || { earnings: 0, trendPercentage: null };

  const firstName = captain?.fullname?.firstname || "Captain";
  const lastName = captain?.fullname?.lastname || "";
  const fullName = `${firstName} ${lastName}`.trim();

  const vehicleInfo = captain?.vehicle
    ? `${captain.vehicle.model || "Vehicle"} • ${captain.vehicle.plateNumber || "N/A"}`
    : "Registered Captain";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6">
      {/* CAPTAIN PROFILE HEADER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                className="h-16 w-16 rounded-2xl object-cover border-2 border-slate-700 shadow-md bg-slate-800"
                src={
                  captain?.photo ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=0D9488&color=fff&bold=true&size=128`
                }
                alt={fullName}
              />
              <span
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                  isOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-500"
                }`}
              ></span>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400">{getGreeting()},</p>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                {fullName} 👋
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                <span className="flex items-center gap-1 font-medium text-slate-300">
                  <Car className="w-3.5 h-3.5 text-emerald-400" />
                  {vehicleInfo}
                </span>
                <span className="flex items-center gap-1 font-bold text-amber-400 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded-md">
                  <Star className="w-3 h-3 fill-amber-400" />
                  {captain?.rating || 4.8}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border ${
                isOnline
                  ? "bg-emerald-950/80 text-emerald-300 border-emerald-800/80"
                  : "bg-slate-800/80 text-slate-400 border-slate-700/80"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-emerald-400" : "bg-slate-500"}`}></span>
              {isOnline ? "Active Captain" : "Offline"}
            </div>
          </div>
        </div>
      </div>

      {/* EARNINGS CARD */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Verified Earnings
          </span>
          <span className="text-xs text-slate-400 font-medium">Today</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mt-1">
          <div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              ₹{today.earnings.toLocaleString("en-IN")}
            </h3>
          </div>

          {/* Trend Indicator */}
          <div className="text-xs font-semibold">
            {yesterday.trendPercentage !== null ? (
              <div
                className={`flex items-center gap-1 px-3 py-1 rounded-full border ${
                  yesterday.trendPercentage >= 0
                    ? "bg-emerald-950/90 text-emerald-400 border-emerald-800/60"
                    : "bg-rose-950/90 text-rose-400 border-rose-800/60"
                }`}
              >
                {yesterday.trendPercentage >= 0 ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                <span>
                  {yesterday.trendPercentage >= 0 ? "+" : ""}
                  {yesterday.trendPercentage}% vs yesterday
                </span>
              </div>
            ) : (
              <span className="text-slate-400 text-xs bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/60">
                Start completing trips to see your trend
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 4 PERFORMANCE CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Earnings */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5 shadow-lg hover:border-slate-700 transition">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400 mb-3">
            <IndianRupee className="w-5 h-5" />
          </div>
          <h4 className="text-xl font-black text-white">₹{today.earnings.toLocaleString("en-IN")}</h4>
          <p className="text-xs font-medium text-slate-400 mt-0.5">Today's Earnings</p>
        </div>

        {/* Trips */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5 shadow-lg hover:border-slate-700 transition">
          <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center text-indigo-400 mb-3">
            <Car className="w-5 h-5" />
          </div>
          <h4 className="text-xl font-black text-white">{today.trips}</h4>
          <p className="text-xs font-medium text-slate-400 mt-0.5">Trips Completed</p>
        </div>

        {/* Distance */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5 shadow-lg hover:border-slate-700 transition">
          <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-800/40 flex items-center justify-center text-amber-400 mb-3">
            <Route className="w-5 h-5" />
          </div>
          <h4 className="text-xl font-black text-white">{today.distance} km</h4>
          <p className="text-xs font-medium text-slate-400 mt-0.5">Distance Covered</p>
        </div>

        {/* Online Hours */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5 shadow-lg hover:border-slate-700 transition">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center text-cyan-400 mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <h4 className="text-xl font-black text-white">{today.onlineHours} h</h4>
          <p className="text-xs font-medium text-slate-400 mt-0.5">Online Duration</p>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails;
