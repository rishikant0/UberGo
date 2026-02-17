import React from "react";

const RidePopUp = (props) => {

  const riderName = props.ride?.user?.fullname
    ? `${props.ride.user.fullname.firstname} ${props.ride.user.fullname.lastname || ""}`
    : "Rider";

  return (
    <div className="relative px-5 pt-10 pb-6 bg-white rounded-t-3xl">

      {/* DRAG HANDLE */}
      <div
        onClick={() => props.setridePopUpPanel(false)}
        className="absolute top-3 left-0 right-0 flex justify-center cursor-pointer"
      >
        <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
      </div>

      {/* TITLE */}
      <h1 className="text-center text-lg font-semibold mb-6">
        New ride available
      </h1>

      {/* RIDER INFO */}
      <div className="flex items-center justify-between mb-5">

        <div className="flex items-center gap-3">
          <img
            src="https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?auto=format&fit=crop&w=300"
            alt="rider"
            className="h-12 w-12 rounded-full object-cover ring-2 ring-green-500"
          />

          <div>
            <h3 className="text-sm font-semibold">
              {riderName}
            </h3>
            <p className="text-xs text-gray-500">Rider</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm font-semibold">2.5 km</p>
          <p className="text-xs text-gray-500">away</p>
        </div>
      </div>

      {/* DETAILS CARD */}
      <div className="bg-gray-50 rounded-2xl p-4 space-y-4">

        {/* PICKUP */}
        <div className="flex gap-3">
          <i className="ri-map-pin-line text-gray-700"></i>
          <p className="text-sm">{props.ride?.pickup || "Pickup"}</p>
        </div>

        {/* DESTINATION */}
        <div className="flex gap-3">
          <i className="ri-map-pin-fill text-gray-700"></i>
          <p className="text-sm">{props.ride?.destination || "Destination"}</p>
        </div>

        {/* PAYMENT */}
        <div className="flex gap-3">
          <i className="ri-bank-card-line text-gray-700"></i>
          <p className="text-sm">₹{props.ride?.fare || 0}</p>
        </div>

      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4 mt-6">

        <button
          onClick={() => {
            props.setconfirmridePopUpPanel(true);
            props.confirmedRide?.();
          }}
          className="flex-1 bg-green-600 text-white py-3 rounded-xl"
        >
          Accept
        </button>

        <button
          onClick={() => props.setridePopUpPanel(false)}
          className="flex-1 bg-gray-200 py-3 rounded-xl"
        >
          Ignore
        </button>

      </div>

    </div>
  );
};

export default RidePopUp;
