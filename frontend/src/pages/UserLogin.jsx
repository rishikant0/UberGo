import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/usercontext";
import { ArrowRight, UserCheck, ShieldCheck, Car } from "lucide-react";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/users/login`,
        { email, password }
      );

      if (response.status === 200) {
        setUser(response.data.user);
        localStorage.setItem("token", response.data.token);
        navigate("/home");
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.message || "Invalid credentials. Please try again.");
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
        <span className="text-2xl font-black tracking-tight text-white">UBER</span>
      </div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-white">Welcome Back</h2>
          <p className="text-xs text-slate-400">Sign in to book rides and track your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Email Address
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
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
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold rounded-xl text-sm transition shadow-lg shadow-emerald-600/25 active:scale-95 flex items-center justify-center gap-2 mt-2"
          >
            <span>Sign In to Rider Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800/80 text-center space-y-3">
          <p className="text-xs text-slate-400">
            Don't have a rider account?{" "}
            <Link to="/usersignup" className="text-emerald-400 font-bold hover:underline">
              Create account
            </Link>
          </p>

          <Link
            to="/captain-login"
            className="w-full inline-flex items-center justify-center gap-2 py-3 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-indigo-400 font-bold rounded-xl text-xs transition"
          >
            <Car className="w-4 h-4 text-indigo-400" />
            <span>Sign in as Captain Partner</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
