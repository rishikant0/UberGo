import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import FinishRide from "../components/FinishRide";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const CaptainRiding = () => {
  const [finishRidePanel, setfinishRidePanel] = useState(false);
  const finishRidePanelRef = useRef(null);

  useGSAP(() => {
    gsap.to(finishRidePanelRef.current, {
      y: finishRidePanel ? "0%" : "100%",
      duration: 0.45,
      ease: "power3.out",
    });
  }, [finishRidePanel]);

  return (
    <div className="h-screen w-full relative bg-black">

      {/* HOME BUTTON */}
      <Link
        to="/captain-home"
        className="fixed top-4 left-4 z-50 h-11 w-11 bg-white/90 backdrop-blur shadow-lg flex items-center justify-center rounded-full active:scale-95 transition"
      >
        <i className="ri-home-5-line text-xl text-gray-800"></i>
      </Link>

      {/* MAP */}
      <div className="h-full w-full relative">
        <img
          className="w-full h-full object-cover"
          src="https://cdn.theatlantic.com/thumbor/BlEOtTo9L9mjMLuyCcjG3xYr4qE=/0x48:1231x740/960x540/media/img/mt/2017/04/IMG_7105/original.png"
          alt="map"
        />

        {/* MAP GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
      </div>

      {/* FLOATING ACTION BAR */}
      <div className="absolute bottom-6 left-4 right-4 z-40">
        <div className="bg-yellow-400 rounded-2xl px-5 py-4 shadow-[0_12px_35px_rgba(0,0,0,0.35)] backdrop-blur flex items-center justify-between">

          {/* DISTANCE */}
          <div>
            <p className="text-xs font-medium text-black/70">Distance</p>
            <h3 className="text-lg font-bold text-black">4 km away</h3>
          </div>

          {/* CTA */}
          <button
            onClick={() => setfinishRidePanel(true)}
            className="
              bg-gradient-to-r from-green-500 to-emerald-600
              text-white
              px-6
              py-3
              rounded-2xl
              font-semibold
              shadow-[0_8px_20px_rgba(16,185,129,0.5)]
              active:scale-95
              transition
              flex
              items-center
              gap-2
            "
          >
            <i className="ri-flag-line text-lg"></i>
            Complete Ride
          </button>
        </div>
      </div>

      {/* FINISH RIDE PANEL */}
      <div
        ref={finishRidePanelRef}
        className="
          fixed
          bottom-0
          left-0
          right-0
          translate-y-full
          bg-white
          z-50
          px-5
          py-4
          rounded-t-[32px]
          shadow-[0_-20px_40px_rgba(0,0,0,0.3)]
        "
      >
        {/* HANDLE */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"></div>

        <FinishRide setfinishRidePanel={setfinishRidePanel} />
      </div>
    </div>
  );
};

export default CaptainRiding;
