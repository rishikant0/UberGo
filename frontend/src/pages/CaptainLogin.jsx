import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/captaincontext";
import { Car, ArrowRight, ShieldCheck } from "lucide-react";

const CaptainLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setCaptain } = useContext(CaptainDataContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const captainData = { email, password };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/captains/login`,
        captainData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        setCaptain(response.data.captain);
        localStorage.setItem("captainToken", response.data.token);
        localStorage.setItem("token", response.data.token);
        navigate("/captain-home");
      }
    } catch (error) {
      console.log("Login error:", error.response?.data);
      alert(error.response?.data?.message || "Captain login failed");
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 px-4 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* BRAND */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-xl">
          U
        </div>
        <div>
          <span className="text-2xl font-black tracking-tight text-white">UBER</span>
          <span className="ml-2 text-xs font-bold text-indigo-400 bg-indigo-950/80 border border-indigo-800/60 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
            Captain Partner
          </span>
        </div>
      </div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-white">Captain Portal</h2>
          <p className="text-xs text-slate-400">Sign in to go online and accept ride requests</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Captain Email Address
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="captain@example.com"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold text-sm placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Password
            </label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold text-sm placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl text-sm transition shadow-lg shadow-indigo-600/30 active:scale-95 flex items-center justify-center gap-2 mt-2"
          >
            <span>Sign In to Captain Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800/80 text-center space-y-3">
          <p className="text-xs text-slate-400">
            Want to become a captain?{" "}
            <Link to="/signup" className="text-indigo-400 font-bold hover:underline">
              Register here
            </Link>
          </p>

          <Link
            to="/login"
            className="w-full inline-flex items-center justify-center gap-2 py-3 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold rounded-xl text-xs transition"
          >
            <span>Sign in as Rider</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CaptainLogin;
