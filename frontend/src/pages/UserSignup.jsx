import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/usercontext";
import { ArrowRight, Eye, EyeOff, UserCheck } from "lucide-react";

const UserSignup = () => {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      fullname: {
        firstname,
        lastname,
      },
      email,
      password,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/users/register`,
        newUser
      );

      if (response.status === 201) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem("token", data.token);
        navigate("/home");
      }
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      alert(error.response?.data?.errors?.[0]?.msg || error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 px-4 py-8 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* BRAND */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-xl">
          U
        </div>
        <span className="text-2xl font-black tracking-tight text-white">UBER</span>
      </div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-white">Create Rider Account</h2>
          <p className="text-xs text-slate-400">Join to book fast, reliable rides anytime</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                First Name
              </label>
              <input
                type="text"
                placeholder="John"
                value={firstname}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full px-3.5 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold text-sm placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Doe"
                value={lastname}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full px-3.5 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold text-sm placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold text-sm placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="relative">
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 pr-11 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold text-sm placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-8 text-slate-400 hover:text-slate-200"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold rounded-xl text-sm transition shadow-lg shadow-emerald-600/25 active:scale-95 flex items-center justify-center gap-2 mt-2"
          >
            <span>Register Rider Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800/80 text-center">
          <p className="text-xs text-slate-400">
            Already registered?{" "}
            <Link to="/login" className="text-emerald-400 font-bold hover:underline">
              Sign In here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
