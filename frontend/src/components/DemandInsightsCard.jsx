import React from "react";
import { Flame, Sparkles, Compass } from "lucide-react";

const DemandInsightsCard = ({ demandInfo }) => {
  const isAvailable = demandInfo?.available || false;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
      <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
        <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
        <span>Demand Radar</span>
      </div>

      <h3 className="text-lg font-bold text-white mb-2">Nearby Opportunities</h3>

      {isAvailable && demandInfo?.hotspots ? (
        <div className="space-y-3 mt-3">
          {demandInfo.hotspots.map((spot, idx) => (
            <div
              key={idx}
              className="bg-slate-950/80 border border-amber-500/30 p-3.5 rounded-2xl flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-bold text-white">{spot.area}</p>
                <p className="text-xs text-amber-400 font-semibold">{spot.surge} estimated demand</p>
              </div>
              <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded-lg text-xs font-bold">
                HIGH DEMAND
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 text-center flex flex-col items-center justify-center">
          <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-amber-400 mb-2">
            <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '10s' }} />
          </div>
          <p className="text-sm font-bold text-slate-200">Demand insights coming soon</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Live surge heatmap and high-rider concentration alerts will be activated for your current zone shortly.
          </p>
        </div>
      )}
    </div>
  );
};

export default DemandInsightsCard;
