import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CaptainDataContext } from "../context/captaincontext";
import axios from "axios";

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
        localStorage.setItem("token", response.data.token);
        navigate("/captain-home");
      }
    } catch (error) {
      console.log("Backend error:", error.response?.data);
    }

    // ✅ RESET FORM (INSIDE handleSubmit)
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setVehicleColor("");
    setVehiclePlate("");
    setVehicleModel("");
    setVehicleCapacity("");
    setVehicleType("");
  };

  return (
    <div className="min-h-screen bg-white px-5 pt-5 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-xl font-bold">Uber</h1>
        <span className="text-xl">→</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* NAME */}
        <div>
          <p className="text-sm font-medium mb-2">
            What's our Captain's name
          </p>
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="input"
              required
            />
            <input
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="input"
              required
            />
          </div>
        </div>

        {/* EMAIL */}
        <div>
          <p className="text-sm font-medium mb-2">
            What's our Captain's email
          </p>
          <input
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input w-full"
            required
          />
        </div>

        {/* PASSWORD */}
        <div>
          <p className="text-sm font-medium mb-2">Enter Password</p>
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input w-full"
            required
          />
        </div>

        {/* VEHICLE */}
        <div>
          <p className="text-sm font-medium mb-3">Vehicle Information</p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              placeholder="Vehicle Color"
              value={vehicleColor}
              onChange={(e) => setVehicleColor(e.target.value)}
              className="input"
              required
            />
            <input
              placeholder="Vehicle Model"
              value={vehicleModel}
              onChange={(e) => setVehicleModel(e.target.value)}
              className="input"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              placeholder="Vehicle Plate"
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value)}
              className="input"
              required
            />
            <input
              type="number"
              placeholder="Capacity"
              value={vehicleCapacity}
              onChange={(e) => setVehicleCapacity(e.target.value)}
              className="input"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="input"
              required
            >
              <option value="">Select</option>
              <option value="car">Car</option>
              <option value="auto">Auto</option>
              <option value="bike">Bike</option>
              <option value="van">Van</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-lg font-semibold"
        >
          Create Captain Account
        </button>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/captainlogin" className="text-blue-600">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default CaptainSignup;
