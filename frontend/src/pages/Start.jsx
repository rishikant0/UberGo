import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Clock, MapPin, Navigation, Car, UserCheck, Shield } from "lucide-react";

const Start = () => {
  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center font-['Plus_Jakarta_Sans',sans-serif] selection:bg-indigo-500 selection:text-white p-4 sm:p-6 lg:p-12 overflow-x-hidden">
      
      {/* BACKGROUND GLOW ACCENTS */}
      <div className="fixed top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* CARD CONTAINER */}
      <div className="w-full max-w-6xl bg-slate-900/80 border border-slate-800 rounded-[32px] shadow-2xl backdrop-blur-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* LEFT COLUMN: HERO VISUAL (DESKTOP SPLIT SCREEN / TABLET TOP) */}
        <div className="lg:col-span-7 relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 p-8 sm:p-12 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800/80">
          
          {/* Subtle Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

          {/* BRAND HEADER */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-emerald-500/20">
              U
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white">UBER</span>
              <span className="ml-1 text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40">
                Mobility
              </span>
            </div>
          </div>

          {/* HERO GRAPHIC ART / FLOATING GLASS CARDS */}
          <div className="relative z-10 my-10 lg:my-16 space-y-4">
            
            {/* Floating Card 1 */}
            <div className="bg-slate-950/70 border border-slate-800/90 p-4.5 rounded-2xl shadow-2xl backdrop-blur-md max-w-sm ml-auto animate-pulse flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800/60 flex items-center justify-center text-emerald-400 shrink-0">
                <Navigation className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-300">Live GPS Route Optimization</p>
                <p className="text-[11px] text-slate-400">Fastest pickup matches in 2 min</p>
              </div>
            </div>

            {/* Floating Card 2 */}
            <div className="bg-slate-950/90 border border-slate-800 p-5 rounded-2xl shadow-2xl backdrop-blur-md max-w-md">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>Downtown Airport Terminal 1</span>
                </div>
                <span className="text-xs font-extrabold text-emerald-400">₹340.00</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full w-4/5 rounded-full"></div>
              </div>
            </div>

          </div>

          {/* BOTTOM BADGES */}
          <div className="relative z-10 flex flex-wrap items-center gap-6 pt-4 border-t border-slate-800/60 text-xs text-slate-400 font-semibold">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Captains</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>24/7 Availability</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: WELCOME & ACTION PANEL */}
        <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between bg-slate-900/60">
          
          <div className="space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/50 text-indigo-300 text-xs font-bold">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span>Next-Gen Ride Booking</span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Go anywhere. <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                  Move freely.
                </span>
              </h1>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Book premium rides, track your journey in real time with high-accuracy GPS, and reach your destination comfortably and safely.
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-3 pt-2">
              <Link
                to="/login"
                className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold rounded-2xl text-base transition-all duration-200 flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/25 active:scale-[0.98]"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/user-signup"
                className="w-full py-3.5 px-6 bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-bold rounded-2xl text-sm transition-all duration-200 flex items-center justify-center gap-2 border border-slate-700/80"
              >
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>Create Rider Account</span>
              </Link>
            </div>

          </div>

          {/* CAPTAIN PARTNER PORTAL FOOTER */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Are you a driver?</span>
            <Link
              to="/captain-login"
              className="font-extrabold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 bg-indigo-950/60 border border-indigo-800/40 px-3 py-1.5 rounded-xl transition"
            >
              <Car className="w-3.5 h-3.5 text-indigo-400" />
              <span>Captain Sign In</span>
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Start;
