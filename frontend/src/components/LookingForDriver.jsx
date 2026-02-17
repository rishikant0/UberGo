import React, { useEffect, useState } from "react";

const LookingForDriver = (props) => {
  const [animationIndex, setAnimationIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationIndex((prev) => (prev + 1) % 3);
    }, 600);

    return () => clearInterval(interval);
  }, []);

  const dots = [".", "..", "..."][animationIndex];

  // 🔥 SAFE FARE CALCULATION (NO CRASH)
  let displayFare = "Calculating...";

  if (props.fare) {
    if (typeof props.fare === "object") {
      displayFare =
        props.vehicalType && props.fare[props.vehicalType]
          ? props.fare[props.vehicalType]
          : props.fare.car || "---";
    } else {
      displayFare = props.fare;
    }
  }

  return (
    <div className="relative px-4 pt-12 pb-6">

      {/* CLOSE HANDLE */}
      <div
        onClick={() => props.setvehicalFound(false)}
        className="absolute top-2 left-0 right-0 flex justify-center cursor-pointer"
      >
        <i className="ri-arrow-down-wide-line text-3xl text-gray-400"></i>
      </div>

      {/* TITLE */}
      <h3 className="text-center text-base font-semibold mb-2">
        Looking for driver
      </h3>

      <p className="text-center text-xs text-gray-500 mb-4">
        Finding nearby drivers{dots}
      </p>

      {/* SEARCHING ANIMATION */}
      <div className="flex justify-center mb-6">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>

          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-500 animate-spin"></div>

          <div className="flex items-center justify-center h-full text-2xl">
            🔍
          </div>
        </div>
      </div>

      {/* VEHICLE IMAGE */}
      <div className="flex justify-center mb-4">
        <img
          className="h-20 object-contain opacity-75"
          src="https://tb-static.uber.com/prod/vehicles-importer/2024/maruti-suzuki/dzire/high_res/1813669578094.png"
          alt="vehicle"
        />
      </div>

      {/* DETAILS CARD */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-4">

        {/* PICKUP */}
        <div className="flex items-start gap-3">
          <i className="ri-map-pin-line text-lg text-gray-700"></i>
          <div>
            <h4 className="text-sm font-medium">Pickup Location</h4>
            <p className="text-xs text-gray-500 mt-1">
              {props.pickup || "—"}
            </p>
          </div>
        </div>

        {/* DESTINATION */}
        <div className="flex items-start gap-3">
          <i className="ri-map-pin-fill text-lg text-gray-700"></i>
          <div>
            <h4 className="text-sm font-medium">Destination</h4>
            <p className="text-xs text-gray-500 mt-1">
              {props.destination || "—"}
            </p>
          </div>
        </div>

        {/* FARE */}
        <div className="flex items-start gap-3">
          <i className="ri-bank-card-line text-lg text-gray-700"></i>
          <div>
            <h4 className="text-sm font-medium">Estimated Fare</h4>
            <p className="text-xs text-gray-500 mt-1">
              ₹{displayFare}
            </p>
          </div>
        </div>
      </div>

      {/* CANCEL BUTTON */}
      <button
        onClick={() => props.setvehicalFound(false)}
        className="mt-6 w-full py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
      >
        Cancel Search
      </button>
    </div>
  );
};

export default LookingForDriver;
