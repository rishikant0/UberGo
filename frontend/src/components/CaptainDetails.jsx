import React, { useContext } from "react";
import { CaptainDataContext } from "../context/captaincontext.jsx";

const CaptainDetails = () => {
  const { captain } = useContext(CaptainDataContext);

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <img
          className="h-14 w-14 rounded-full object-cover border-2 border-gray-200"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBlPlpTtK_z4wQ4W74DmV5pxpZYatxBAmzrg&s"
          alt="driver"
        />
        <div>
          <h4>
  {captain?.fullname?.firstname} {captain?.fullname?.lastname}
</h4>

          <p className="text-xs text-gray-500">Captain • Online</p>
         
        </div>
      </div>

      {/* EARNINGS */}
      <div className="bg-gradient-to-r from-black to-gray-900 text-white rounded-2xl p-5 mb-6 shadow-lg">
        <p className="text-xs opacity-80 mb-1">Today’s earnings</p>
        <h3 className="text-2xl font-bold">₹294.89</h3>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-gray-50 rounded-2xl p-4 shadow-sm">
          <i className="ri-timer-line text-xl"></i>
          <h5 className="text-sm font-semibold mt-1">10.5</h5>
          <p className="text-xs text-gray-500">Hours</p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 shadow-sm">
          <i className="ri-pin-distance-line text-xl"></i>
          <h5 className="text-sm font-semibold mt-1">48 km</h5>
          <p className="text-xs text-gray-500">Distance</p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 shadow-sm">
          <i className="ri-slideshow-line text-xl"></i>
          <h5 className="text-sm font-semibold mt-1">12</h5>
          <p className="text-xs text-gray-500">Trips</p>
        </div>
      </div>
    </>
  );
};

export default CaptainDetails;
