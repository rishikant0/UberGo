import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/usercontext";

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
  // Store JWT token returned by the server
  localStorage.setItem("token", response.data.token);
  navigate("/home");
}

    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Login failed");
    }
    setEmail("");
        setPassword("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <img
        className="w-16 mb-10"
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt="Uber"
      />

      <p className="text-xl font-extrabold text-black mb-6 text-center">
        User Login
      </p>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-7"
      >
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What's your email
          </label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg"
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
            className="w-full px-4 py-3 border rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-xl"
        >
          Login
        </button>

        <p className="text-center mt-4">
          New here?{" "}
          <Link to="/usersignup" className="text-blue-600 hover:underline">
            Create new Account
          </Link>
        </p>
      </form>
   {/* Captain Login */} <Link to="/captain-login" className="w-full max-w-md mt-6 text-center bg-green-400 text-white py-3 rounded-xl text-lg font-semibold hover:bg-gray-900 transition" > Sign in as Captain </Link> </div> ); }; 

export default UserLogin;
