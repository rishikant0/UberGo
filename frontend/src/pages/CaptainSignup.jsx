import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CaptainDataContext } from "../context/captaincontext";
import axios from "axios";
import { Car, ArrowRight, ShieldCheck } from "lucide-react";

const CaptainSignup = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const { setCaptain } = useContext(CaptainDataContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email,
      password,
      vehicle: {
        color: vehicleColor,
        model: vehicleModel,
        plateNumber: vehiclePlate,
        capacity: Number(vehicleCapacity),
        type: vehicleType,
      },
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/captains/register`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 201) {
        setCaptain(response.data.captain);
        localStorage.setItem("captainToken", response.data.token);
        localStorage.setItem("token", response.data.token);
        navigate("/captain-home");
      }
    } catch (error) {
      console.log("Backend error:", error.response?.data);
      alert(error.response?.data?.errors?.[0]?.msg || error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 px-4 py-8 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* BRAND */}
      <div className="flex items-center gap-3 mb-6">
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
          <h2 className="text-2xl font-extrabold text-white">Register as Captain</h2>
          <p className="text-xs text-slate-400">Drive with Uber and earn on your schedule</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NAME */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">First Name</label>
              <input
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold text-sm placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Last Name</label>
              <input
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold text-sm placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
                required
              />
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="captain@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold text-sm placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold text-sm placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
              required
            />
          </div>

          {/* VEHICLE DETAILS */}
          <div className="pt-2 border-t border-slate-800/80 space-y-3">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Vehicle Details</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Color (e.g. White)"
                value={vehicleColor}
                onChange={(e) => setVehicleColor(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold text-sm placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
                required
              />
              <input
                placeholder="Model (e.g. Dzire)"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold text-sm placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Plate Number"
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold text-sm placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
                required
              />
              <input
                type="number"
                placeholder="Capacity (e.g. 4)"
                value={vehicleCapacity}
                onChange={(e) => setVehicleCapacity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold text-sm placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
                required
              />
            </div>

            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold text-sm outline-none focus:border-indigo-500 transition"
              required
            >
              <option value="">Select Vehicle Category</option>
              <option value="car">Car (UberGo / UberXL)</option>
              <option value="auto">Auto (Auto Rickshaw)</option>
              <option value="bike">Bike (Motorcycle)</option>
              <option value="van">Van</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl text-sm transition shadow-lg shadow-indigo-600/30 active:scale-95 flex items-center justify-center gap-2 mt-4"
          >
            <span>Create Captain Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800/80 text-center">
          <p className="text-xs text-slate-400">
            Already registered as Captain?{" "}
            <Link to="/captain-login" className="text-indigo-400 font-bold hover:underline">
              Sign In here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CaptainSignup;
