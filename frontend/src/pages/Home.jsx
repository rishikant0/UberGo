import axios from "axios";
import React, { useState, useRef, useEffect, useContext, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import { 
  MapPin, Flag, ArrowRight, Search, Home as HomeIcon, Briefcase, 
  Compass, LogOut, ChevronUp, ChevronDown, X 
} from "lucide-react";

import LocatationSearch from "../components/LocatationSearch";
import VehicalPanel from "../components/VehicalPanel";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import LiveMap from "../components/LiveMap";
import RideCancelledCard from "../components/RideCancelledCard";

import { SocketDataContext } from "../context/socketContext";
import { UserDataContext } from "../context/usercontext";

// Axios instance with base URL
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_URL || "http://localhost:4000",
  timeout: 10000,
});

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
  // pickup and destination can be objects { address, lat, lng } or string text
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [activeField, setActiveField] = useState(null);

  const [panelOpen, setPanelOpen] = useState(false);
  const [vehicalPanel, setvehicalPanel] = useState(false);
  const [confirmRidepopUp, setconfirmRidepopUp] = useState(false);
  const [vehicalFound, setvehicalFound] = useState(false);
  const [waitingForDriver, setwaitingForDriver] = useState(false);

  const [fare, setfare] = useState(null);
  const [vehicalType, setvehicalType] = useState(null);
  const [ride, setRide] = useState(null);

  const [serverOnline, setServerOnline] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  const { sendMessage, socket, isConnected } = useContext(SocketDataContext);
  const { user, isLoading } = useContext(UserDataContext);
  const navigate = useNavigate();

  const panelRef = useRef(null);
  const vehicalPanelRef = useRef(null);
  const confirmRidePopRef = useRef(null);
  const vehicalFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);

  /* ================= AUTH CHECK ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!isLoading && !token) {
      navigate("/login");
    }
  }, [isLoading, navigate]);

  /* ================= CHECK SERVER STATUS ================= */
  useEffect(() => {
    const checkServer = async () => {
      try {
        await axios.get(`${import.meta.env.VITE_URL}/`, { timeout: 5000 });
        setServerOnline(true);
      } catch (err) {
        setServerOnline(false);
      }
    };
    checkServer();
  }, []);

  /* ================= ACTIVE RIDE RECOVERY ON MOUNT ================= */
  useEffect(() => {
    const fetchActiveRide = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await apiClient.get("/rides/active-user");
        if (res.data?.success && res.data.ride) {
          const activeRide = res.data.ride;
          setRide(activeRide);

          if (activeRide.status === "accepted" || activeRide.status === "arrived") {
            setvehicalFound(false);
            setwaitingForDriver(true);
          } else if (activeRide.status === "pending") {
            setvehicalFound(true);
          } else if (activeRide.status === "ongoing") {
            navigate("/riding", { state: { ride: activeRide } });
          }
        }
      } catch (err) {
        console.warn("No active user ride found on mount:", err.message);
      }
    };

    fetchActiveRide();
  }, [navigate]);

  /* ================= SOCKET JOIN ================= */
  useEffect(() => {
    if (user && user._id && isConnected) {
      sendMessage("join", { role: "user", userId: user._id });
    }
  }, [user, isConnected, sendMessage]);

  /* ================= RIDE LISTENERS ================= */
  const handleRideConfirmed = useCallback((rideData) => {
    console.log("🎉 EVENT RECEIVED: ride-confirmed", rideData);
    setvehicalFound(false);
    setwaitingForDriver(true);
    setRide(rideData);
  }, []);

  const [cancelledInfo, setCancelledInfo] = useState(null);

  useEffect(() => {
    if (!socket) return;

    socket.on("ride-confirmed", handleRideConfirmed);

    const handleDriverArrived = (rideData) => {
      console.log("🚖 Driver Arrived:", rideData);
      setRide(rideData);
      setwaitingForDriver(true);
    };

    const handleRideStarted = (rideData) => {
      console.log("🎯 EVENT RECEIVED: ride-started", rideData);
      setvehicalFound(false);
      setwaitingForDriver(false);
      setRide(rideData);
      navigate("/riding", { state: { ride: rideData } });
    };

    const handleRideCancelled = (data) => {
      console.log("❌ EVENT RECEIVED: ride-cancelled", data);
      setvehicalFound(false);
      setwaitingForDriver(false);
      setconfirmRidepopUp(false);
      setvehicalPanel(false);
      setRide(null);
      setCancelledInfo(data);
    };

    socket.on("driver-arrived", handleDriverArrived);
    socket.on("ride-started", handleRideStarted);
    socket.on("ride-cancelled", handleRideCancelled);

    return () => {
      socket.off("ride-confirmed", handleRideConfirmed);
      socket.off("driver-arrived", handleDriverArrived);
      socket.off("ride-started", handleRideStarted);
      socket.off("ride-cancelled", handleRideCancelled);
    };
  }, [socket, handleRideConfirmed, navigate]);

  /* ================= GSAP ANIMATIONS ================= */
  useGSAP(() => {
    if (window.innerWidth < 768) {
      gsap.to(panelRef.current, {
        height: panelOpen ? "82vh" : "55vh",
        duration: 0.35,
        ease: "power2.out",
      });
    }
  }, [panelOpen]);

  useGSAP(() => {
    gsap.to(vehicalPanelRef.current, {
      y: vehicalPanel ? "0%" : "100%",
      duration: 0.35,
    });
  }, [vehicalPanel]);

  useGSAP(() => {
    gsap.to(confirmRidePopRef.current, {
      y: confirmRidepopUp ? "0%" : "100%",
      duration: 0.35,
    });
  }, [confirmRidepopUp]);

  useGSAP(() => {
    gsap.to(vehicalFoundRef.current, {
      y: vehicalFound ? "0%" : "100%",
      duration: 0.35,
    });
  }, [vehicalFound]);

  useGSAP(() => {
    gsap.to(waitingForDriverRef.current, {
      y: waitingForDriver ? "0%" : "100%",
      duration: 0.35,
    });
  }, [waitingForDriver]);

  /* ================= LOCATION SELECTION HANDLERS ================= */
  const handleSelectLocation = (field, locObj) => {
    if (field === "pickup") {
      setPickup(locObj);
    } else if (field === "destination") {
      setDestination(locObj);
    }
  };

  const getPickupText = () => {
    if (!pickup) return "";
    return typeof pickup === "object" ? pickup.address || "" : pickup;
  };

  const getDestinationText = () => {
    if (!destination) return "";
    return typeof destination === "object" ? destination.address || "" : destination;
  };

  /* ================= REVERSE GEOCODE GPS BUTTON ================= */
  const handleCurrentGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setGpsLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          const res = await apiClient.get("/maps/reverse-geocode", {
            params: { lat, lng },
          });

          const address = res.data?.address || `Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;

          setPickup({ address, lat, lng });
          setPanelOpen(true);
        } catch (err) {
          setPickup({ address: `Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`, lat, lng });
        } finally {
          setGpsLoading(false);
        }
      },
      (err) => {
        alert("GPS Error: Unable to fetch location");
        setGpsLoading(false);
      }
    );
  };

  /* ================= QUICK PLACES SHORTCUTS ================= */
  const handleQuickPlace = (type) => {
    if (type === "mall") {
      setDestination({
        address: "Nucleus Mall, Circular Road, Ranchi",
        lat: 23.3705,
        lng: 85.3262,
      });
    } else if (type === "techpark") {
      setDestination({
        address: "Software Technology Park, Namkum, Ranchi",
        lat: 23.3412,
        lng: 85.3812,
      });
    }
    setPanelOpen(true);
  };

  /* ================= FIND TRIP (GET FARE) ================= */
  async function findTrip() {
    const pickupStr = getPickupText();
    const destStr = getDestinationText();

    if (!pickupStr || !destStr) {
      alert("Please enter both pickup and destination addresses");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setfare(null);

      // Pass exact lat/lng if available for high-accuracy routing & fare calculation
      const params = {
        pickup: pickupStr,
        destination: destStr,
      };

      if (typeof pickup === "object" && pickup.lat && pickup.lng) {
        params.pickupLat = pickup.lat;
        params.pickupLng = pickup.lng;
      }
      if (typeof destination === "object" && destination.lat && destination.lng) {
        params.destLat = destination.lat;
        params.destLng = destination.lng;
      }

      const res = await apiClient.get("/rides/get-fare", { params });

      if (res.data.success && res.data.fare) {
        setfare(res.data.fare);
        setvehicalPanel(true);
        setPanelOpen(false);
      } else {
        alert("Failed to calculate fare");
      }
    } catch (err) {
      console.error("Fare error:", err);
      alert(err.response?.data?.message || "Failed to fetch fare");
    }
  }

  /* ================= CREATE RIDE ================= */
  async function createRide() {
    const pickupStr = getPickupText();
    const destStr = getDestinationText();

    if (!pickupStr || !destStr || !vehicalType) {
      alert("Please select a vehicle type");
      return;
    }

    try {
      const payload = {
        pickup: pickupStr,
        destination: destStr,
        vehicleType: vehicalType,
      };

      if (typeof pickup === "object" && pickup.lat && pickup.lng) {
        payload.pickupLat = pickup.lat;
        payload.pickupLng = pickup.lng;
      }
      if (typeof destination === "object" && destination.lat && destination.lng) {
        payload.destLat = destination.lat;
        payload.destLng = destination.lng;
      }

      const res = await apiClient.post("/rides/create", payload);

      if (res.data?.success) {
        setconfirmRidepopUp(false);
        setvehicalPanel(false);
        setPanelOpen(false);
        setvehicalFound(true);
      }
    } catch (err) {
      console.error("Create ride error:", err);
      alert(err.response?.data?.message || "Failed to create ride");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="h-screen w-full relative overflow-hidden bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* 1. COMPACT FLOATING HEADER */}
      <header className="fixed top-3 left-3 right-3 md:top-4 md:left-6 md:right-6 z-40 bg-slate-900/90 border border-slate-800/80 backdrop-blur-xl h-14 md:h-16 px-4 md:px-6 rounded-2xl shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg md:text-xl shadow-md">
            U
          </div>
          <span className="text-base md:text-lg font-black tracking-tight text-white">UBER</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-950 border border-slate-800 rounded-full text-xs font-bold">
            <span
              className={`w-2 h-2 rounded-full ${
                serverOnline ? "bg-emerald-400 animate-pulse" : "bg-rose-500"
              }`}
            ></span>
            <span className={serverOnline ? "text-emerald-400" : "text-rose-400"}>
              {serverOnline ? "Online" : "Connecting..."}
            </span>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 font-bold text-sm hover:bg-slate-700 transition"
            >
              {user?.fullname?.firstname?.[0] || "U"}
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-slate-100">
                <div className="px-3 py-2 border-b border-slate-800 mb-1">
                  <p className="text-xs font-bold text-white leading-tight">
                    {user?.fullname?.firstname} {user?.fullname?.lastname}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-950/40 rounded-xl transition text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout Account</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. RESPONSIVE CONTAINER */}
      <div className="h-full w-full flex flex-col md:flex-row pt-18 md:pt-20">
        
        {/* MAP SECTION */}
        <div className="w-full md:w-[60%] lg:w-[65%] h-[42vh] md:h-full relative shrink-0">
          <LiveMap isOnline={true} pickup={pickup} destination={destination} />
        </div>

        {/* RIDE BOOKING PANEL */}
        <div
          ref={panelRef}
          className="w-full md:w-[40%] lg:w-[35%] h-[58vh] md:h-full bg-white text-slate-900 rounded-t-[28px] md:rounded-t-none md:rounded-l-3xl shadow-2xl flex flex-col z-30 transition-all overflow-hidden border-t md:border-t-0 md:border-l border-slate-200"
        >
          <div className="md:hidden py-2 flex justify-center cursor-pointer bg-white">
            <div
              onClick={() => setPanelOpen(!panelOpen)}
              className="w-12 h-1.5 bg-slate-300 rounded-full hover:bg-slate-400 transition"
            ></div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pt-2 pb-6 space-y-4 max-w-md mx-auto w-full">
            
            {/* PANEL HEADER */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Find a Ride</h2>
                <p className="text-xs font-semibold text-slate-500">Real-time geocoding & live fares</p>
              </div>
              
              <button
                onClick={() => setPanelOpen(!panelOpen)}
                className="md:hidden text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-indigo-100 transition"
              >
                <span>{panelOpen ? "Collapse" : "Expand"}</span>
                {panelOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* PICKUP INPUT */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pickup Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-emerald-600 z-10" />
                <input
                  value={getPickupText()}
                  onFocus={() => {
                    setPanelOpen(true);
                    setActiveField("pickup");
                  }}
                  onChange={(e) => {
                    setPickup(e.target.value);
                    setActiveField("pickup");
                  }}
                  placeholder="📍 Search pickup location (e.g. RIMS, Ranchi)..."
                  className="w-full h-12 bg-slate-100 border border-slate-300 focus:border-slate-900 focus:bg-white text-slate-900 font-semibold text-sm pl-11 pr-10 rounded-xl outline-none transition shadow-sm"
                />
                {getPickupText() && (
                  <button
                    onClick={() => setPickup("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* DESTINATION INPUT */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Destination Address
              </label>
              <div className="relative">
                <Flag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-rose-600 z-10" />
                <input
                  value={getDestinationText()}
                  onFocus={() => {
                    setPanelOpen(true);
                    setActiveField("destination");
                  }}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    setActiveField("destination");
                  }}
                  placeholder="🏁 Where are you going (e.g. Joda Talab, Airport)?"
                  className="w-full h-12 bg-slate-100 border border-slate-300 focus:border-slate-900 focus:bg-white text-slate-900 font-semibold text-sm pl-11 pr-10 rounded-xl outline-none transition shadow-sm"
                />
                {getDestinationText() && (
                  <button
                    onClick={() => setDestination("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* QUICK SAVED PLACES CHIPS */}
            <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1 no-scrollbar">
              <button
                type="button"
                onClick={handleCurrentGPS}
                disabled={gpsLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-xs font-bold text-slate-700 shrink-0 transition"
              >
                <Compass className={`w-3.5 h-3.5 text-emerald-600 ${gpsLoading ? "animate-spin" : ""}`} />
                <span>{gpsLoading ? "Locating..." : "Current GPS"}</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickPlace("mall")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-xs font-bold text-slate-700 shrink-0 transition"
              >
                <HomeIcon className="w-3.5 h-3.5 text-indigo-600" />
                <span>Nucleus Mall</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickPlace("techpark")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-xs font-bold text-slate-700 shrink-0 transition"
              >
                <Briefcase className="w-3.5 h-3.5 text-purple-600" />
                <span>Tech Park</span>
              </button>
            </div>

            {/* PRIMARY CTA */}
            <button
              onClick={findTrip}
              className="w-full h-13 bg-slate-950 hover:bg-slate-800 text-white font-extrabold rounded-xl shadow-xl transition active:scale-95 flex items-center justify-center gap-2 text-base mt-2"
            >
              <span>Confirm Ride Locations</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* HIGH PRECISION REAL-TIME AUTOCOMPLETE SUGGESTIONS */}
            <LocatationSearch
              pickup={pickup}
              destination={destination}
              onSelectLocation={handleSelectLocation}
              activeField={activeField}
              setPanelOpen={setPanelOpen}
            />
          </div>
        </div>

      </div>

      {/* MODALS */}
      
      {/* VEHICLE SELECTION SHEET */}
      <div
        ref={vehicalPanelRef}
        className="fixed bottom-0 left-0 right-0 translate-y-full bg-white text-slate-900 z-50 p-5 rounded-t-3xl shadow-2xl"
      >
        <VehicalPanel
          pickup={getPickupText()}
          destination={getDestinationText()}
          fares={fare}
          setvehicalType={setvehicalType}
          setvehicalPanel={setvehicalPanel}
          setconfirmRidepopUp={setconfirmRidepopUp}
        />
      </div>

      {/* CONFIRM RIDE POPUP */}
      <div
        ref={confirmRidePopRef}
        className="fixed bottom-0 left-0 right-0 translate-y-full bg-white text-slate-900 z-50 p-5 rounded-t-3xl shadow-2xl"
      >
        <ConfirmRidePopUp
          pickup={getPickupText()}
          destination={getDestinationText()}
          fare={fare}
          vehicalType={vehicalType}
          setconfirmRidepopUp={setconfirmRidepopUp}
          setvehicalFound={setvehicalFound}
          createRide={createRide}
        />
      </div>

      {/* SEARCHING FOR DRIVER */}
      <div
        ref={vehicalFoundRef}
        className="fixed bottom-0 left-0 right-0 translate-y-full bg-white text-slate-900 z-50 p-5 rounded-t-3xl max-h-[85vh] overflow-y-auto shadow-2xl"
      >
        <LookingForDriver
          pickup={getPickupText()}
          destination={getDestinationText()}
          fare={fare}
          vehicalType={vehicalType}
          setvehicalFound={setvehicalFound}
          setwaitingForDriver={setwaitingForDriver}
        />
      </div>

      {/* WAITING FOR DRIVER */}
      <div
        ref={waitingForDriverRef}
        className="fixed bottom-0 left-0 right-0 translate-y-full bg-white text-slate-900 z-[55] p-5 rounded-t-3xl max-h-[85vh] overflow-y-auto shadow-2xl"
      >
        <WaitingForDriver
          ride={ride}
          setvehicalFound={setvehicalFound}
          setwaitingForDriver={setwaitingForDriver}
          waitingForDriver={waitingForDriver}
        />
      </div>

      {/* RIDE CANCELLED OVERLAY */}
      {cancelledInfo && (
        <RideCancelledCard
          cancelledBy={cancelledInfo.cancelledBy}
          cancelReason={cancelledInfo.cancelReason}
          onGoHome={() => {
            setCancelledInfo(null);
            setRide(null);
            setPickup(null);
            setDestination(null);
          }}
        />
      )}
    </div>
  );
};

export default Home;
