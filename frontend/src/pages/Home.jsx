import axios from "axios";
import React, { useState, useRef, useEffect, useContext } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";

import LocatationSearch from "../components/LocatationSearch";
import VehicalPanel from "../components/VehicalPanel";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";

import { SocketDataContext } from "../context/socketContext";
import { UserDataContext } from "../context/usercontext";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [activeField, setActiveField] = useState(null);

  const [panelOpen, setPanelOpen] = useState(false);
  const [vehicalPanel, setvehicalPanel] = useState(false);
  const [confirmRidepopUp, setconfirmRidepopUp] = useState(false);
  const [vehicalFound, setvehicalFound] = useState(false);
  const [waitingForDriver, setwaitingForDriver] = useState(false);

  const [fare, setfare] = useState({});
  const [vehicalType, setvehicalType] = useState(null);

  const { sendMessage, receiveMessage } = useContext(SocketDataContext);
  const { user } = useContext(UserDataContext);

  const panelRef = useRef(null);
  const vehicalPanelRef = useRef(null);
  const confirmRidePopRef = useRef(null);
  const vehicalFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);

  /* ================= SOCKET JOIN ================= */
  useEffect(() => {
    if (user && user._id) {
      sendMessage("join", { role: "user", userId: user._id });
    }
  }, [user, sendMessage]);

  /* ================= RIDE CONFIRMED LISTENER ================= */
  useEffect(() => {
    receiveMessage("ride-confirmed", (ride) => {
      setvehicalFound(false);
      setwaitingForDriver(true);
    });
  }, [receiveMessage]);

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

  /* ================= FIND TRIP ================= */

  async function findTrip() {
    if (!pickup || !destination) return;

    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first");

    try {
      setvehicalPanel(true);
      setPanelOpen(false);

      const res = await axios.get(
        `${import.meta.env.VITE_URL}/rides/get-fare`,
        {
          params: { pickup, destination },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setfare(res.data.fare);
    } catch (err) {
      alert("Failed to fetch fare");
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
      <div className="absolute top-0 left-0 right-0 bg-white z-20 py-4 flex justify-center shadow">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          className="w-14"
          alt="Uber"
        />
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
          setvehicalType={setvehicalType}
          setvehicalPanel={setvehicalPanel}
          setconfirmRidepopUp={setconfirmRidepopUp}
        />
      </div>

      {/* CONFIRM RIDE POPUP */}
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
        />
      </div>

      {/* LOOKING FOR DRIVER */}
      <div
        ref={vehicalFoundRef}
        className="fixed bottom-0 left-0 right-0 translate-y-full bg-white z-50 p-4"
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

      {/* WAITING FOR DRIVER */}
      <div
        ref={waitingForDriverRef}
        className="fixed bottom-0 left-0 right-0 translate-y-full bg-white z-50 p-4"
      >
        <WaitingForDriver setwaitingForDriver={setwaitingForDriver} />
      </div>

    </div>
  );
};

export default Home;
