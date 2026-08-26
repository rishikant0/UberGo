import React from "react";
import { TrendingUp, BarChart3, Calendar, FileText } from "lucide-react";

const EarningsChart = ({ analyticsData, timeframe, setTimeframe, isLoading }) => {
  const { chartData = [], hasData = false } = analyticsData || {};

  // Find max value to normalize bar heights
  const maxEarnings = Math.max(...chartData.map((item) => item.earnings || 0), 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold tracking-wider uppercase mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Earnings Analytics</span>
          </div>
          <h3 className="text-xl font-extrabold text-white">Revenue Performance</h3>
        </div>

        {/* Timeframe Filters */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start sm:self-auto">
          {["today", "week", "month"].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                timeframe === tf
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              {tf === "today" ? "Today" : tf === "week" ? "This Week" : "This Month"}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="h-64 w-full flex items-end justify-between gap-3 pt-8 pb-4 animate-pulse">
          {[40, 65, 30, 80, 55, 90, 45].map((h, idx) => (
            <div key={idx} className="flex-1 bg-slate-800/60 rounded-t-xl" style={{ height: `${h}%` }}></div>
          ))}
        </div>
      ) : !hasData || chartData.length === 0 ? (
        /* Empty State */
        <div className="h-64 w-full border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center bg-slate-950/40">
          <div className="w-14 h-14 bg-indigo-950/50 border border-indigo-800/30 rounded-2xl flex items-center justify-center mb-3">
            <FileText className="w-7 h-7 text-indigo-400" />
          </div>
          <h4 className="text-base font-bold text-white mb-1">No earnings data yet</h4>
          <p className="text-xs text-slate-400 max-w-xs">
            Completed trip payments for {timeframe === "today" ? "today" : timeframe === "week" ? "this week" : "this month"} will be reflected here automatically.
          </p>
        </div>
      ) : (
        /* Chart Visualization */
        <div className="space-y-4">
          <div className="h-56 w-full flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 px-2 border-b border-slate-800/80">
            {chartData.map((item, idx) => {
              const heightPercent = maxEarnings > 0 ? Math.round((item.earnings / maxEarnings) * 100) : 0;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip on Hover */}
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all bg-slate-950 border border-slate-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-xl pointer-events-none whitespace-nowrap z-20">
                    ₹{item.earnings.toLocaleString("en-IN")} • {item.trips} trip{item.trips === 1 ? "" : "s"}
                  </div>

                  {/* Bar */}
                  <div className="w-full max-w-[40px] bg-slate-800/50 rounded-t-xl overflow-hidden flex items-end h-full">
                    <div
                      className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-xl group-hover:from-emerald-500 group-hover:to-emerald-300 transition-all duration-500 shadow-md"
                      style={{ height: `${Math.max(heightPercent, 6)}%` }}
                    ></div>
                  </div>

                  {/* Label */}
                  <span className="text-[11px] font-semibold text-slate-400 mt-2 truncate w-full text-center">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-indigo-500 rounded-sm"></span>
              <span>Calculated from verified trip receipts</span>
            </div>
            <div className="font-semibold text-slate-300">
              Total: ₹{chartData.reduce((acc, curr) => acc + curr.earnings, 0).toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EarningsChart;
