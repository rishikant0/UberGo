import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/captaincontext";

const CaptainLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { captain, setCaptain } = useContext(CaptainDataContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const captainData = {
      email,
      password,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/captains/login`,
        captainData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        setCaptain(response.data.captain);
        localStorage.setItem("token", response.data.token);
        navigate("/captain-home");
      }
    } catch (error) {
      console.log("Login error:", error.response?.data);
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <img
        src="https://media.designrush.com/inspiration_images/651560/conversions/1200x600wa-mobile.jpg"
        alt="Uber"
        className="w-30 h-30 sm:w-14 sm:h-14 md:w-30 md:h-30 object-contain mb-10"
      />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-7"
      >
        <p className="text-xl font-extrabold text-black mb-6 text-center">
          Captain Login
        </p>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What's your email
          </label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@gmail.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter password
          </label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-xl text-lg font-semibold hover:bg-gray-900 active:scale-95 transition"
        >
          Login
        </button>

        <p className="text-center mt-4">
          New here?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-medium hover:underline"
          >
            Register new Account
          </Link>
        </p>
      </form>

      <Link
        to="/login"
        className="w-full max-w-md mt-6 text-center bg-green-400 text-white py-3 rounded-xl text-lg font-semibold hover:bg-gray-900 transition"
      >
        Sign in as User
      </Link>
    </div>
  );
};

export default CaptainLogin;
