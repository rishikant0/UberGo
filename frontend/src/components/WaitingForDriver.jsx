import React from "react";

const WaitingForDriver = (props) => {
  return (
    <div className="relative px-4 pt-12 pb-6">

      {/* DRAG / CLOSE HANDLE */}
      <div
        onClick={() => props.setwaitingForDriver(false)}
        className="absolute top-2 left-0 right-0 flex justify-center cursor-pointer"
      >
        <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
      </div>

      {/* TITLE */}
      <h3 className="text-center text-base font-semibold mb-1">
        Waiting for a driver
      </h3>
      <p className="text-center text-xs text-gray-500 mb-4">
        Connecting you with a nearby driver
      </p>

      {/* DRIVER + VEHICLE CARD */}
      <div className="flex items-center gap-4 bg-white rounded-xl shadow-sm p-4 mb-5">

        {/* VEHICLE IMAGE */}
        <img
          className="h-16 w-24 object-contain"
          src="https://tb-static.uber.com/prod/vehicles-importer/2024/maruti-suzuki/dzire/high_res/1813669578094.png"
          alt="vehicle"
        />

        {/* DRIVER INFO */}
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900">
            RK <span className="text-xs font-normal text-gray-500">• Driver</span>
          </h4>
          <p className="text-xs text-gray-600">MP-01-SR-2012</p>
          <p className="text-xs text-gray-500">Maruti Suzuki Dzire</p>
        </div>

        {/* ETA */}
        <div className="text-right">
          <p className="text-xs text-gray-500">Arriving</p>
          <p className="text-sm font-semibold text-gray-900">2 min</p>
        </div>
      </div>

      {/* TRIP DETAILS */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-4">

        {/* PICKUP */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <i className="ri-map-pin-line text-gray-700"></i>
          </div>
          <div>
            <h4 className="text-sm font-medium">151/12-B</h4>
            <p className="text-xs text-gray-500">
              Kokar, Ranchi, Jharkhand
            </p>
          </div>
        </div>

        {/* DESTINATION */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <i className="ri-map-pin-fill text-gray-700"></i>
          </div>
          <div>
            <h4 className="text-sm font-medium">151/12</h4>
            <p className="text-xs text-gray-500">
              Lalpur Chowk
            </p>
          </div>
        </div>

        {/* PAYMENT */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <i className="ri-bank-card-line text-gray-700"></i>
          </div>
          <div>
            <h4 className="text-sm font-medium">₹185.05</h4>
            <p className="text-xs text-gray-500">Cash payment</p>
          </div>
        </div>
      </div>

      {/* SAFETY / STATUS */}
      <div className="mt-5 text-center">
        <p className="text-xs text-gray-500">
          You can share your trip details once the driver arrives
        </p>
      </div>
    </div>
  );
};

export default WaitingForDriver;
