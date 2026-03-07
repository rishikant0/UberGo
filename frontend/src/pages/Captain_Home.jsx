import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import ConfirmedRide from "../components/ConfirmedRide";

import { SocketDataContext } from "../context/socketContext.jsx";
import { CaptainDataContext } from "../context/captaincontext.jsx";

const Captain_Home = () => {

  const [ridePopUpPanel, setRidePopUpPanel] = useState(false);
  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false);
  const [rideData, setRideData] = useState(null);

  const ridePopUpPanelRef = useRef(null);
  const confirmRidePopUpPanelRef = useRef(null);

  const { socket, isConnected } = useContext(SocketDataContext);
  const { captain, isLoading } = useContext(CaptainDataContext);

  const navigate = useNavigate();

  /* ================= AUTH CHECK ================= */
  useEffect(() => {
    const token = localStorage.getItem("captainToken");

    if (!isLoading && !token) {
      console.warn("Captain not logged in — redirecting");
      navigate("/captain-login");
    }
  }, [isLoading, navigate]);

  /* ================= LOGOUT ================= */
  function handleLogout() {
    localStorage.removeItem("captainToken");
    navigate("/captain-login");
  }

  /* ================= SOCKET JOIN + LOCATION ================= */
  useEffect(() => {
    if (!socket || !isConnected || !captain?._id) return;

    // Join captain room
    socket.emit("join", {
      userId: captain._id,
      role: "captain",
    });

    // Send location every 5 seconds
    const intervalId = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          socket.emit("update-location-captain", {
            userId: captain._id,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          });
        },
        (error) => console.error("Location error:", error)
      );
    }, 5000);

    return () => clearInterval(intervalId);

  }, [socket, isConnected, captain]);

  /* ================= NEW RIDE EVENT ================= */
  useEffect(() => {
    if (!socket) return;

    socket.on("new-ride", (data) => {
      console.log("🚖 New ride request:", data);
      setRideData(data);
      setRidePopUpPanel(true);
    });

    return () => socket.off("new-ride");

  }, [socket]);

  /* 🔥 RIDE STARTED EVENT → GO TO RIDING SCREEN */
  useEffect(() => {
    if (!socket) return;

    socket.on("ride-started", (data) => {
      console.log("🚗 Ride started:", data);

      // Navigate to Captain Riding page
      navigate("/captain-riding", { state: data });
    });

    return () => socket.off("ride-started");

  }, [socket, navigate]);

  /* ================= ACCEPT RIDE ================= */
  async function confirmedRide() {

    try {
      const token = localStorage.getItem("captainToken");

      if (!token) {
        alert("Captain not logged in");
        return;
      }

      console.log("📤 Confirming ride:", rideData._id);

      const response = await axios.post(
        `${import.meta.env.VITE_URL}/rides/confirm`,
        { rideId: rideData._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {

        console.log("✅ Ride confirmed:", response.data.ride);

        setRidePopUpPanel(false);
        setConfirmRidePopUpPanel(true);
        setRideData(response.data.ride);

      } else {
        alert("Failed to confirm ride");
      }

    } catch (err) {
      console.error("❌ Confirm error:", err.response?.data || err.message);
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  }

  /* ================= ANIMATIONS ================= */

  useGSAP(() => {
    gsap.to(ridePopUpPanelRef.current, {
      y: ridePopUpPanel ? "0%" : "100%",
    });
  }, [ridePopUpPanel]);

  useGSAP(() => {
    gsap.to(confirmRidePopUpPanelRef.current, {
      y: confirmRidePopUpPanel ? "0%" : "100%",
    });
  }, [confirmRidePopUpPanel]);

  /* ================= UI ================= */

  return (
    <div className="h-screen w-full bg-[#f5f5f5] relative overflow-hidden">

      {/* LOGOUT BUTTON */}
      <button
        onClick={handleLogout}
        className="fixed top-4 left-4 z-50 h-11 w-11 bg-white shadow-xl flex items-center justify-center rounded-full"
      >
        <i className="ri-logout-box-r-line text-xl text-gray-700"></i>
      </button>

      {/* MAP */}
      <div className="h-1/2 w-full relative">
        <img
          className="w-full h-full object-cover"
          src="https://cdn.theatlantic.com/thumbor/BlEOtTo9L9mjMLuyCcjG3xYr4qE=/0x48:1231x740/960x540/media/img/mt/2017/04/IMG_7105/original.png"
          alt="map"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40"></div>
      </div>

      {/* CAPTAIN DETAILS PANEL */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] px-6 pt-6 pb-24 shadow-xl">
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"></div>
        <CaptainDetails rideData={rideData} />
      </div>

      {/* RIDE REQUEST POPUP */}
      <div
        ref={ridePopUpPanelRef}
        className="fixed bottom-0 left-0 right-0 bg-white z-50 px-4 py-3 rounded-t-2xl shadow-lg translate-y-full"
      >
        <RidePopUp
          ride={rideData}
          setridePopUpPanel={setRidePopUpPanel}
          setconfirmridePopUpPanel={setConfirmRidePopUpPanel}
          confirmedRide={confirmedRide}
        />
      </div>

      {/* CONFIRMED RIDE POPUP */}
      <div
        ref={confirmRidePopUpPanelRef}
        className="fixed bottom-0 left-0 right-0 bg-white z-50 px-4 py-3 rounded-t-2xl shadow-lg translate-y-full"
      >
        <ConfirmedRide
          setconfirmRidePanel={setConfirmRidePopUpPanel}
          pickup={rideData?.pickup}
          destination={rideData?.destination}
          fare={rideData?.fare}
          vehicalType={rideData?.vehicleType}
          rideId={rideData?._id}
        />
      </div>

    </div>
  );
};

export default Captain_Home;
