import React from "react";
import { Home, IndianRupee, History, User, LogOut, Power } from "lucide-react";

const CaptainNavbar = ({ activeTab, setActiveTab, onLogout, isOnline, toggleOnline, isTogglingOnline }) => {
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "earnings", label: "Earnings", icon: IndianRupee },
    { id: "trips", label: "Trips", icon: History },
    { id: "account", label: "Account", icon: User },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col justify-between w-64 bg-slate-900 border-r border-slate-800 p-6 h-screen sticky top-0 shrink-0 z-30">
        <div>
          {/* Brand */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
              U
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white">UBER DRIVE</h1>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Captain Partner</p>
            </div>
          </div>

          {/* Online Toggle Button in Sidebar */}
          <div className="mb-6 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400">STATUS</span>
              <span
                className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md ${
                  isOnline ? "bg-emerald-950 text-emerald-400" : "bg-slate-800 text-slate-400"
                }`}
              >
                {isOnline ? "ONLINE" : "OFFLINE"}
              </span>
            </div>

            <button
              onClick={toggleOnline}
              disabled={isTogglingOnline}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                isOnline
                  ? "bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 glow-online"
              }`}
            >
              <Power className="w-4 h-4" />
              <span>{isTogglingOnline ? "Updating..." : isOnline ? "Go Offline" : "Go Online"}</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer / Logout */}
        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-3 py-2 shadow-2xl">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all ${
                  isActive ? "text-indigo-400 font-bold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-all ${
                    isActive ? "bg-indigo-600/20 text-indigo-400" : "bg-transparent"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CaptainNavbar;
