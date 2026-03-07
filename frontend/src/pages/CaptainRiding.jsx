import React, { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const CaptainRiding = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ride = location.state?.ride;

  const [showPaymentPanel, setShowPaymentPanel] = useState(false);
  const [loading, setLoading] = useState(false);
  const paymentPanelRef = useRef(null);

  // Animation for payment panel
  useGSAP(() => {
    gsap.to(paymentPanelRef.current, {
      y: showPaymentPanel ? "0%" : "100%",
      duration: 0.5,
      ease: "power2.out",
    });
  }, [showPaymentPanel]);

  const handlePaymentSelect = async (method) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("captainToken");
      if (!token) {
        alert("Please login again");
        return;
      }

      // Call backend to complete ride
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/rides/complete`,
        { rideId: ride?._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data) {
        alert(`Payment via ${method} completed! Ride finished.`);
        
        // Navigate to home after completion
        setTimeout(() => {
          navigate("/captain-home");
        }, 1000);
      }

    } catch (err) {
      alert(err.response?.data?.message || "Error completing ride");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gray-100">

      {/* HOME BUTTON */}
      <Link
        to="/captain-home"
        className="fixed top-4 left-4 z-50 h-10 w-10 bg-white shadow-md flex items-center justify-center rounded-full"
      >
        <i className="ri-home-5-line text-lg"></i>
      </Link>

      {/* MAP */}
      <div className="h-1/2 w-full">
        <img
          className="w-full h-full object-cover"
          src="https://cdn.theatlantic.com/thumbor/BlEOtTo9L9mjMLuyCcjG3xYr4qE=/0x48:1231x740/960x540/media/img/mt/2017/04/IMG_7105/original.png"
          alt="map"
        />
      </div>

      {/* DETAILS */}
      <div className="h-1/2 bg-white rounded-t-3xl px-4 pt-4 pb-8 overflow-y-auto">

        {/* PASSENGER CARD */}
        <div className="flex items-center gap-4 bg-white rounded-xl shadow-sm p-4 mb-4">
          <img
            className="h-16 w-16 rounded-full object-cover"
            src="https://i.pinimg.com/originals/f1/0f/f7/f10ff7555c3ff371e3c629b5f3882c90.png"
            alt="passenger"
          />
          <div className="flex-1">
            <h4 className="text-sm font-semibold">
              {ride?.user?.fullname?.firstname || "Passenger"}
            </h4>
            <p className="text-xs text-gray-500">Rating: ⭐ 4.8</p>
            <p className="text-xs text-green-600 font-semibold">5 rides</p>
          </div>
        </div>

        {/* TRIP DETAILS */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-4">
          <div className="flex items-start gap-3">
            <i className="ri-map-pin-line text-green-600 text-xl mt-1"></i>
            <div>
              <p className="text-xs text-gray-500">Pickup Location</p>
              <p className="font-semibold text-sm">{ride?.pickup}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <i className="ri-map-pin-2-line text-red-600 text-xl mt-1"></i>
            <div>
              <p className="text-xs text-gray-500">Destination</p>
              <p className="font-semibold text-sm">{ride?.destination}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-xs text-gray-500">Fare Amount</p>
            <p className="text-2xl font-bold text-green-600">₹{ride?.fare}</p>
          </div>
        </div>

        {/* REACHED BUTTON */}
        <button 
          onClick={() => setShowPaymentPanel(true)}
          disabled={loading}
          className="w-full mt-5 bg-green-600 text-white py-4 rounded-2xl font-semibold hover:bg-green-700 disabled:bg-gray-400 transition"
        >
          {loading ? "Processing..." : "Reached Destination"}
        </button>
      </div>

      {/* PAYMENT METHODS PANEL */}
      <div
        ref={paymentPanelRef}
        className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-3xl shadow-2xl translate-y-full"
      >
        <div className="p-6">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>

          <h3 className="text-xl font-bold mb-4 text-center">
            Select Payment Method
          </h3>

          <p className="text-center text-gray-600 mb-6">
            Receive: <span className="text-2xl font-bold text-green-600">₹{ride?.fare}</span>
          </p>

          {/* PAYMENT OPTIONS */}
          <div className="space-y-3">
            {/* CASH */}
            <button
              onClick={() => handlePaymentSelect("Cash")}
              disabled={loading}
              className="w-full p-4 bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 rounded-xl flex items-center gap-4 transition disabled:opacity-50"
            >
              <i className="ri-money-rupee-circle-line text-3xl text-green-600"></i>
              <div className="flex-1 text-left">
                <p className="font-semibold">Cash Payment</p>
                <p className="text-sm text-gray-500">Collect from passenger</p>
              </div>
              <i className="ri-arrow-right-s-line text-xl text-gray-400"></i>
            </button>

            {/* CARD */}
            <button
              onClick={() => handlePaymentSelect("Card")}
              disabled={loading}
              className="w-full p-4 bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 rounded-xl flex items-center gap-4 transition disabled:opacity-50"
            >
              <i className="ri-bank-card-line text-3xl text-blue-600"></i>
              <div className="flex-1 text-left">
                <p className="font-semibold">Credit/Debit Card</p>
                <p className="text-sm text-gray-500">Pay via secure gateway</p>
              </div>
              <i className="ri-arrow-right-s-line text-xl text-gray-400"></i>
            </button>

            {/* WALLET */}
            <button
              onClick={() => handlePaymentSelect("Wallet")}
              disabled={loading}
              className="w-full p-4 bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 rounded-xl flex items-center gap-4 transition disabled:opacity-50"
            >
              <i className="ri-wallet-line text-3xl text-purple-600"></i>
              <div className="flex-1 text-left">
                <p className="font-semibold">UPay Wallet</p>
                <p className="text-sm text-gray-500">Instant payment</p>
              </div>
              <i className="ri-arrow-right-s-line text-xl text-gray-400"></i>
            </button>

            {/* UPI */}
            <button
              onClick={() => handlePaymentSelect("UPI")}
              disabled={loading}
              className="w-full p-4 bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 rounded-xl flex items-center gap-4 transition disabled:opacity-50"
            >
              <i className="ri-smartphone-line text-3xl text-orange-600"></i>
              <div className="flex-1 text-left">
                <p className="font-semibold">UPI</p>
                <p className="text-sm text-gray-500">Google Pay, PhonePe, etc.</p>
              </div>
              <i className="ri-arrow-right-s-line text-xl text-gray-400"></i>
            </button>
          </div>

          {/* CLOSE BUTTON */}
          <button
            onClick={() => setShowPaymentPanel(false)}
            disabled={loading}
            className="w-full mt-6 p-4 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaptainRiding;