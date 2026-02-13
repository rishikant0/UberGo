import React, { useState, useContext } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/usercontext";

const UserSignup = () => {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ ADDED ONLY THIS
  const [showPassword, setShowPassword] = useState(false);

  const [userData, setUserData] = useState({});

  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);

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

      if (response.status == 201) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem("token", data.token);

        navigate("/home");
      }

      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      alert(error.response?.data?.errors?.[0]?.msg || error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 pt-8">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt="Uber"
        className="w-14 mb-8"
      />

      <form className="max-w-md" onSubmit={handleSubmit}>
        {/* NAME */}
        <div className="mb-6">
          <label className="block text-base font-medium text-black mb-3">
            What's your name
          </label>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First name"
              value={firstname}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="bg-gray-100 px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-black"
            />
            <input
              type="text"
              placeholder="Last name"
              value={lastname}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="bg-gray-100 px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        {/* EMAIL */}
        <div className="mb-6">
          <label className="block text-base font-medium text-black mb-3">
            What's your email
          </label>
          <input
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-gray-100 px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-8 relative">
          <label className="block text-base font-medium text-black mb-3">
            Enter Password
          </label>

          <input
            type={showPassword ? "text" : "password"}
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-gray-100 px-4 py-3 pr-12 rounded-md outline-none focus:ring-2 focus:ring-black"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-[52px] text-sm text-gray-600 hover:text-black"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-lg text-lg font-semibold active:scale-95 transition"
        >
          Create Account
        </button>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium">
            Login here
          </Link>
        </p>
      </form>

      <p className="text-xs text-gray-500 mt-16 leading-relaxed max-w-md">
        By proceeding, you consent to get calls, WhatsApp or SMS messages,
        including by automated means, from Uber and its affiliates to the
        number provided.
      </p>
    </div>
  );
};

export default UserSignup;
