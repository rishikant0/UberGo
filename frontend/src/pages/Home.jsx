import axios from "axios";
import React, { useState, useRef, useEffect, useContext, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import { useNavigate } from "react-router-dom";

import LocatationSearch from "../components/LocatationSearch";
import VehicalPanel from "../components/VehicalPanel";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";

import { SocketDataContext } from "../context/socketContext";
import { UserDataContext } from "../context/usercontext";

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_URL || "http://localhost:4000",
  timeout: 10000, // 10 second timeout
});

// Add request interceptor to include token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle 401 globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("🔐 Unauthorized - Clearing token and redirecting to login");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const Home = () => {

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [activeField, setActiveField] = useState(null);

  const [panelOpen, setPanelOpen] = useState(false);
  const [vehicalPanel, setvehicalPanel] = useState(false);
  const [confirmRidepopUp, setconfirmRidepopUp] = useState(false);
  const [vehicalFound, setvehicalFound] = useState(false);
  const [waitingForDriver, setwaitingForDriver] = useState(false);

  // 🔥 IMPORTANT — null for loading state
  const [fare, setfare] = useState(null);

  const [vehicalType, setvehicalType] = useState(null);
  const [ride, setRide] = useState(null);

  const [serverOnline, setServerOnline] = useState(null);
  const [authError, setAuthError] = useState(null);

  const { sendMessage, receiveMessage, socket } = useContext(SocketDataContext);
  const { user, isLoading } = useContext(UserDataContext);
  const navigate = useNavigate();

  const panelRef = useRef(null);
  const vehicalPanelRef = useRef(null);
  const confirmRidePopRef = useRef(null);
  const vehicalFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);

  /* ================= CHECK AUTH ON MOUNT ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // Only redirect if loading is done and there's no token
    if (!isLoading && !token) {
      setAuthError("No token found. Please login first.");
      navigate("/login");
    }
  }, [isLoading, navigate]);

  /* ================= CHECK SERVER CONNECTIVITY ================= */
  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL}/`, {
          timeout: 5000,
        });
        console.log("✅ Backend server is online");
        setServerOnline(true);
      } catch (err) {
        console.error("❌ Backend server is offline:", err.message);
        setServerOnline(false);
        alert("⚠️ Server is not responding. Make sure backend is running on port 4000");
      }
    };

    checkServer();
  }, []);

  /* ================= SOCKET JOIN ================= */
  useEffect(() => {
    if (user && user._id) {
      console.log("User joining socket with ID:", user._id);
      sendMessage("join", { role: "user", userId: user._id });
    }
  }, [user, sendMessage]);

  /* ================= RIDE CONFIRMED ================= */
  const handleRideConfirmed = useCallback((rideData) => {
    console.log("🎉 EVENT RECEIVED: ride-confirmed", rideData);
    console.log("Updating state: vehicalFound=false, waitingForDriver=true");
    
    setvehicalFound(false);      // Close "Looking for Driver"
    setwaitingForDriver(true);   // Open "Waiting for Driver"
    setRide(rideData);
  }, []);

  // ✅ FIX: Set up listener once when socket is ready
  useEffect(() => {
    if (!socket) return;

    // Add listener
    socket.on("ride-confirmed", handleRideConfirmed);
    console.log("✅ ride-confirmed listener attached");

    // Cleanup on unmount
    return () => {
      socket.off("ride-confirmed", handleRideConfirmed);
      console.log("❌ ride-confirmed listener removed");
    };
  }, [socket, handleRideConfirmed]);

  /* ================= STATE DEBUG LOGGING ================= */
  useEffect(() => {
    console.log("📊 Panel State Changed:", {
      vehicalFound,
      waitingForDriver,
      rideExists: !!ride
    });
  }, [vehicalFound, waitingForDriver, ride]);

  /* ================= GSAP ANIMATIONS ================= */

  useGSAP(() => {
    gsap.to(panelRef.current, {
      y: panelOpen ? "0%" : "70%",
      duration: 0.4,
    });
  }, [panelOpen]);

  useGSAP(() => {
    gsap.to(vehicalPanelRef.current, {
      y: vehicalPanel ? "0%" : "100%",
      duration: 0.4,
    });
  }, [vehicalPanel]);

  useGSAP(() => {
    gsap.to(confirmRidePopRef.current, {
      y: confirmRidepopUp ? "0%" : "100%",
      duration: 0.4,
    });
  }, [confirmRidepopUp]);

  useGSAP(() => {
    gsap.to(vehicalFoundRef.current, {
      y: vehicalFound ? "0%" : "100%",
      duration: 0.4,
    });
  }, [vehicalFound]);

  useGSAP(() => {
    gsap.to(waitingForDriverRef.current, {
      y: waitingForDriver ? "0%" : "100%",
      duration: 0.4,
    });
  }, [waitingForDriver]);

  /* ================= FIND TRIP (IMPROVED) ================= */

  async function findTrip() {
    if (!pickup || !destination) {
      alert("Please enter both pickup and destination");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setAuthError("No authentication token. Please login first.");
      navigate("/login");
      return;
    }

    try {
      setfare(null); // show loading state
      console.log("🔍 Fetching fare for:", { pickup, destination });

      const res = await apiClient.get("/rides/get-fare", {
        params: { pickup, destination },
      });

      console.log("✅ Fare response:", res.data);

      if (res.data.success && res.data.fare) {
        setfare(res.data.fare);
        setvehicalPanel(true);
        setPanelOpen(false);
      } else {
        console.error("Invalid response format:", res.data);
        alert("Failed to fetch fare - Invalid response from server");
      }

    } catch (err) {
      console.error("❌ Fare fetch error:", err);

      if (err.response?.status === 401) {
        setAuthError("Unauthorized - Token expired or invalid");
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else if (err.response?.status === 500) {
        alert("Server error: " + (err.response?.data?.message || "Please try again later"));
      } else if (err.code === "ECONNABORTED") {
        alert("Request timeout - Server is not responding. Check if backend is running on port 4000");
      } else if (!err.response) {
        alert("⚠️ Cannot connect to server. Is the backend running?");
        setServerOnline(false);
      } else {
        alert(`Error: ${err.response?.data?.message || err.message}`);
      }
    }
  }

  /* ================= CREATE RIDE (IMPROVED) ================= */

  async function createRide() {
    if (!pickup || !destination || !vehicalType) {
      alert("Please select a vehicle type");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setAuthError("No authentication token. Please login first.");
      navigate("/login");
      return;
    }

    try {
      console.log("🚗 Creating ride with:", { pickup, destination, vehicalType });

      const res = await apiClient.post("/rides/create", {
        pickup,
        destination,
        vehicleType: vehicalType,
      });

      console.log("✅ Ride created:", res.data);

      // Close panels
      setconfirmRidepopUp(false);
      setvehicalPanel(false);
      setPanelOpen(false);

      // Show searching driver screen
      setvehicalFound(true);

    } catch (err) {
      console.error("❌ Create ride error:", err);

      if (err.response?.status === 401) {
        setAuthError("Unauthorized - Token expired or invalid");
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else if (err.response?.status === 500) {
        alert("Server error: " + (err.response?.data?.message || "Please try again later"));
      } else if (err.code === "ECONNABORTED") {
        alert("Request timeout - Server is not responding.");
      } else if (!err.response) {
        alert("Cannot connect to server. Is the backend running?");
        setServerOnline(false);
      } else {
        alert(`Error: ${err.response?.data?.message || err.message}`);
      }
    }
  }


  /* ================= UI ================= */

  return (
    <div className="h-screen w-full relative overflow-hidden bg-gray-100">

      {/* MAP */}
      {!panelOpen && (
        <div className="absolute inset-0">
          <img
            src="https://cdn.theatlantic.com/thumbor/BlEOtTo9L9mjMLuyCcjG3xYr4qE=/0x48:1231x740/960x540/media/img/mt/2017/04/IMG_7105/original.png"
            className="w-full h-full object-cover"
            alt="map"
          />
        </div>
      )}

      {/* TOP BAR */}
      <div className="absolute top-0 left-0 right-0 bg-white z-20 py-4 flex justify-between items-center px-4 shadow">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          className="w-14"
          alt="Uber"
        />
        
        {/* Server Status Indicator */}
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            serverOnline === true ? "bg-green-500" :
            serverOnline === false ? "bg-red-500" :
            "bg-yellow-500"
          }`}></div>
          <span className="text-xs font-medium">
            {serverOnline === true ? "Online" :
             serverOnline === false ? "Offline" :
             "Checking..."}
          </span>
        </div>
      </div>

      {/* INPUT PANEL */}
      <div
        ref={panelRef}
        className="absolute bottom-0 left-0 right-0 h-full bg-white rounded-t-3xl translate-y-[70%]"
      >
        <div className="px-5 pt-12 space-y-4">

          <input
            value={pickup}
            onFocus={() => {
              setPanelOpen(true);
              setActiveField("pickup");
            }}
            onChange={(e) => setPickup(e.target.value)}
            placeholder="Pickup location"
            className="w-full bg-gray-100 p-3 rounded-lg"
          />

          <input
            value={destination}
            onFocus={() => {
              setPanelOpen(true);
              setActiveField("destination");
            }}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Destination"
            className="w-full bg-gray-100 p-3 rounded-lg"
          />

          <button
            onClick={findTrip}
            className="w-full bg-black text-white py-3 rounded-lg"
          >
            Confirm Locations
          </button>

        </div>

        <LocatationSearch
          pickup={pickup}
          destination={destination}
          setPickup={setPickup}
          setDestination={setDestination}
          activeField={activeField}
          setvehicalPanel={setvehicalPanel}
          setPanelOpen={setPanelOpen}
        />
      </div>

      {/* VEHICLE PANEL */}
      <div
        ref={vehicalPanelRef}
        className="fixed bottom-0 left-0 right-0 translate-y-full bg-white z-40 p-4"
      >
        <VehicalPanel
          pickup={pickup}
          destination={destination}
          fares={fare}
          setvehicalType={setvehicalType}
          setvehicalPanel={setvehicalPanel}
          setconfirmRidepopUp={setconfirmRidepopUp}
        />
      </div>

      {/* CONFIRM POPUP */}
      <div
        ref={confirmRidePopRef}
        className="fixed bottom-0 left-0 right-0 translate-y-full bg-white z-50 p-4"
      >
        <ConfirmRidePopUp
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicalType={vehicalType}
          setconfirmRidepopUp={setconfirmRidepopUp}
          setvehicalFound={setvehicalFound}
          createRide={createRide}
        />
      </div>

      {/* LOOKING DRIVER */}
      <div
        ref={vehicalFoundRef}
        className="fixed bottom-0 left-0 right-0 translate-y-full bg-white z-50 p-4 max-h-96 overflow-y-auto"
      >
        <LookingForDriver
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicalType={vehicalType}
          setvehicalFound={setvehicalFound}
          setwaitingForDriver={setwaitingForDriver}
        />
      </div>

      {/* WAITING DRIVER */}
      <div
        ref={waitingForDriverRef}
        className="fixed bottom-0 left-0 right-0 translate-y-full bg-white z-[51] p-4 max-h-96 overflow-y-auto"
      >
        <WaitingForDriver
          ride={ride}
          setvehicalFound={setvehicalFound}
          setwaitingForDriver={setwaitingForDriver}
          waitingForDriver={waitingForDriver}
        />
      </div>

    </div>
  );
};

export default Home;
