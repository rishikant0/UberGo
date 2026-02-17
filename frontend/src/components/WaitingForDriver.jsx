import React from "react";

const WaitingForDriver = (props) => {
  const captain = props.ride?.captain;
  const vehicle = captain?.vehicle;
  const otp = props.ride?.otp;

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
        Driver Arriving
      </h3>
      <p className="text-center text-xs text-gray-500 mb-4">
        Your driver is on the way to pick you up
      </p>

      {/* DRIVER + VEHICLE CARD */}
      <div className="flex items-center gap-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-sm p-4 mb-5">

        {/* DRIVER PHOTO */}
        <div className="relative">
          <img
            className="h-16 w-16 rounded-full object-cover border-2 border-blue-400"
            src={captain?.photo || `https://ui-avatars.com/api/?name=${captain?.fullname?.firstname}+${captain?.fullname?.lastname}&background=random`}
            alt={captain?.fullname?.firstname}
            onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=Driver&background=random`}
          />
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
        </div>

        {/* DRIVER INFO */}
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900">
            {captain?.fullname?.firstname} {captain?.fullname?.lastname}
            <span className="text-xs font-normal text-gray-500 ml-2">• Driver</span>
          </h4>
          <div className="flex items-center gap-1 mt-1">
            <i className="ri-star-fill text-yellow-400 text-xs"></i>
            <p className="text-xs text-gray-600 font-medium">4.8 (234 rides)</p>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {vehicle?.model} • {vehicle?.color}
          </p>
        </div>

        {/* VEHICLE NUMBER */}
        <div className="text-right">
          <p className="text-xs text-gray-500 font-medium">License Plate</p>
          <p className="text-sm font-bold text-blue-600 bg-white px-2 py-1 rounded">
            {vehicle?.plateNumber || "N/A"}
          </p>
        </div>
      </div>

      {/* OTP SECTION */}
      {otp && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-5">
          <p className="text-center text-xs text-red-600 font-medium mb-2">
            Share this OTP with your driver
          </p>
          <div className="flex justify-center gap-2">
            {otp.split("").map((digit, idx) => (
              <div
                key={idx}
                className="w-12 h-12 bg-red-500 text-white rounded-lg flex items-center justify-center text-lg font-bold shadow-md"
              >
                {digit}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TRIP DETAILS */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-4">

        {/* PICKUP */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center flex-shrink-0">
            <i className="ri-map-pin-line text-green-700"></i>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-900">Pickup Location</h4>
            <p className="text-xs text-gray-500 mt-1">
              {props.ride?.pickup || "Loading..."}
            </p>
          </div>
        </div>

        {/* DESTINATION */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-red-200 flex items-center justify-center flex-shrink-0">
            <i className="ri-map-pin-fill text-red-700"></i>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-900">Destination</h4>
            <p className="text-xs text-gray-500 mt-1">
              {props.ride?.destination || "Loading..."}
            </p>
          </div>
        </div>

        {/* FARE */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0">
            <i className="ri-bank-card-line text-blue-700"></i>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-900">Fare Amount</h4>
            <p className="text-xs text-gray-500 mt-1">
              ₹{props.ride?.fare || "0"} • Cash Payment
            </p>
          </div>
        </div>
      </div>

      {/* LIVE TRACKING */}
      <div className="mt-5 bg-white border border-gray-200 rounded-lg p-3 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <p className="text-xs font-medium text-gray-700">Live Tracking Active</p>
        </div>
        <p className="text-xs text-gray-500">
          Driver location updates every 5 seconds
        </p>
      </div>

      {/* SAFETY INFO */}
      <div className="mt-4 flex gap-2 text-center text-xs">
        <button className="flex-1 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
          <i className="ri-phone-line mr-1"></i> Call Driver
        </button>
        <button className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
          <i className="ri-chat-3-line mr-1"></i> Message
        </button>
        <button className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">
          <i className="ri-alert-line mr-1"></i> Report
        </button>
      </div>
    </div>
  );
};

export default WaitingForDriver;
