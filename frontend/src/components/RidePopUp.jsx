import React from "react";

const RidePopUp = (props) => {
  return (
    <div
      className="relative px-5 pt-10 pb-6 bg-white rounded-t-3xl"
    >
      {/* DRAG HANDLE */}
      <div
        onClick={() => props.setridePopUpPanel(false)}
        className="absolute top-3 left-0 right-0 flex justify-center cursor-pointer"
      >
        <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
      </div>

      {/* TITLE */}
      <h1 className="text-center text-lg font-semibold mb-6 text-gray-900">
        New ride available
      </h1>

      {/* RIDER INFO */}
      <div className="flex items-center justify-between mb-5">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <img
            src="https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?auto=format&fit=crop&w=300"
            alt="rider"
            className="h-12 w-12 rounded-full object-cover ring-2 ring-green-500"
          />
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{props.ride?.user.fullName.firstname + " " + props.ride?.user.fullName.lastname}</h3>
            <p className="text-xs text-gray-500">Rider</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">2.5 km</p>
          <p className="text-xs text-gray-500">away</p>
        </div>
      </div>

      {/* DETAILS CARD */}
      <div className="bg-gray-50 rounded-2xl p-4 space-y-4 shadow-sm">
        {/* PICKUP */}
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center">
            <i className="ri-map-pin-line text-gray-700"></i>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900">151/12-B</h4>
            <p className="text-xs text-gray-500">
             {props.ride?.pickup}
            </p>
          </div>
        </div>

        {/* DESTINATION */}
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center">
            <i className="ri-map-pin-fill text-gray-700"></i>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900">151/12</h4>
            <p className="text-xs text-gray-500">{props.ride?.destination}</p>
          </div>
        </div>

        {/* PAYMENT */}
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center">
            <i className="ri-bank-card-line text-gray-700"></i>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900">₹{props.ride?.fare}</h4>
            <p className="text-xs text-gray-500">Cash payment</p>
          </div>
        </div>
      </div>

     {/* ACTION BUTTONS */}
<div className="flex gap-4 mt-6">

  {/* ACCEPT */}
  <button
    onClick={() => {
      props.setconfirmridePopUpPanel(true);
      props.confirmedRide?.(); // safe call
    }}
    className="
      flex-1
      bg-gradient-to-r from-green-500 to-emerald-600
      text-white
      py-3.5
      rounded-2xl
      font-semibold
      shadow-[0_10px_30px_rgba(16,185,129,0.45)]
      active:scale-95
      transition
      flex
      items-center
      justify-center
      gap-2
    "
  >
    <i className="ri-check-line text-lg"></i>
    Accept
  </button>

  {/* IGNORE */}
  <button
    onClick={() => props.setridePopUpPanel(false)}
    className="
      flex-1
      bg-gray-100
      text-gray-700
      py-3.5
      rounded-2xl
      font-semibold
      border
      border-gray-200
      active:scale-95
      transition
      flex
      items-center
      justify-center
      gap-2
    "
  >
    <i className="ri-close-line text-lg"></i>
    Ignore
  </button>

</div>

      </div>
   
  );
};

export default RidePopUp;
