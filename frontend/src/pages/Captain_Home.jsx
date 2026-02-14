import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
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

  const { socket } = useContext(SocketDataContext);
  const { captain } = useContext(CaptainDataContext);

  /* =========================
     SOCKET + LOCATION UPDATE
  ========================= */
  useEffect(() => {
    if (!socket || !captain?._id) return;

    // Join socket room
    socket.emit("join", {
      userId: captain._id,
      role: "captain",
    });

    // Send location every 5 seconds
    const intervalId = setInterval(() => {
      if (!navigator.geolocation) {
        console.error("Geolocation not supported");
        return;
      }

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
        (error) => {
          console.error("Location error:", error);
        }
      );
    }, 5000);

    return () => clearInterval(intervalId);
  }, [socket, captain]);


  useEffect(() => {
    if (!socket) return;

    socket.on("new-ride", (data) => {
      console.log("New ride request received:", data);
      setRideData(data);
      setRidePopUpPanel(true);
    });

    return () => {
      socket.off("new-ride");
    };
  }, [socket]);

  async function confirmedRide() {
    const response = await axios.post(`${import.meta.env.VITE_URL}/rides/confirm`, {
      rideId: rideData._id,
     
    },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
   );

    if (response.data.success) {
      console.log("Ride confirmed successfully");
    } else {
      console.error("Failed to confirm ride");
    }
  }
  /* =========================
     GSAP ANIMATIONS
  ========================= */
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

  return (
    <div className="h-screen w-full bg-[#f5f5f5] relative overflow-hidden">
      {/* LOGOUT BUTTON */}
      <Link
        to="/home"
        className="fixed top-4 left-4 z-50 h-11 w-11 bg-white shadow-xl flex items-center justify-center rounded-full active:scale-95 transition"
      >
        <i className="ri-logout-box-r-line text-xl text-gray-700"></i>
      </Link>

      {/* MAP SECTION */}
      <div className="h-1/2 w-full relative">
        <img
          className="w-full h-full object-cover"
          src="https://cdn.theatlantic.com/thumbor/BlEOtTo9L9mjMLuyCcjG3xYr4qE=/0x48:1231x740/960x540/media/img/mt/2017/04/IMG_7105/original.png"
          alt="map"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40"></div>
      </div>

    {/* BOTTOM SHEET */}
<div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] px-6 pt-6 pb-24 shadow-[0_-20px_40px_rgba(0,0,0,0.15)]">
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
        />
      </div>

      {/* CONFIRM RIDE POPUP */}
      <div
        ref={confirmRidePopUpPanelRef}
        className="fixed bottom-0 left-0 right-0 bg-white z-50 px-4 py-3 rounded-t-2xl shadow-lg translate-y-full"
      >
        <ConfirmedRide
          setconfirmRidePanel={setConfirmRidePopUpPanel}
          setconfirmridePopUpPanel={setConfirmRidePopUpPanel}
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
