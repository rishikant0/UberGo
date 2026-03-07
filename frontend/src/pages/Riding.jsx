import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SocketDataContext } from "../context/socketContext.jsx";
import { UserDataContext } from "../context/usercontext.jsx";

const Riding = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ride = location.state?.ride;

  const [rideStatus, setRideStatus] = useState("waiting");
  const [rideData, setRideData] = useState(ride);
  const [showPaymentPanel, setShowPaymentPanel] = useState(false);
  const [loading, setLoading] = useState(false);

  const { socket } = useContext(SocketDataContext);
  const { user } = useContext(UserDataContext);

  const completedPanelRef = useRef(null);
  const paymentPanelRef = useRef(null);

  /* ===== Animations ===== */

  useGSAP(() => {
    if (completedPanelRef.current) {
      gsap.to(completedPanelRef.current, {
        opacity: rideStatus === "completed" ? 1 : 0,
        duration: 0.8,
      });
    }
  }, [rideStatus]);

  useGSAP(() => {
    if (paymentPanelRef.current) {
      gsap.to(paymentPanelRef.current, {
        y: showPaymentPanel ? "0%" : "100%",
        duration: 0.5,
      });
    }
  }, [showPaymentPanel]);

  /* ===== SOCKET JOIN ===== */

  useEffect(() => {
    if (!socket || !user?._id) return;

    socket.emit("join", {
      userId: user._id,
      role: "user",
    });

    socket.on("join-confirmed", (data) => {
      console.log("User joined socket:", data);
    });

    return () => {
      socket.off("join-confirmed");
    };
  }, [socket, user]);

  /* ===== RIDE EVENTS ===== */

  useEffect(() => {
    if (!socket) return;

    socket.off("ride-started");
    socket.off("ride-completed");

    socket.on("ride-started", (data) => {
      console.log("Ride started:", data);
      setRideStatus("ongoing");
      setRideData(data);
    });

    socket.on("ride-completed", (data) => {
      console.log("Ride completed:", data);
      setRideStatus("completed");
      setRideData(data);
      setShowPaymentPanel(true);
    });

    return () => {
      socket.off("ride-started");
      socket.off("ride-completed");
    };
  }, [socket]);

  /* ===== PAYMENT ===== */

  const handlePaymentSelect = async (method) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) return alert("Login again");

      const res = await axios.post(
        `${import.meta.env.VITE_URL}/rides/process-payment`,
        {
          rideId: rideData?._id,
          paymentMethod: method,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        alert(`Payment via ${method} completed!`);
        setTimeout(() => navigate("/home"), 1500);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Payment error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gray-100">

      {/* HOME BUTTON */}
      <Link
        to="/home"
        className="fixed top-4 left-4 z-50 h-10 w-10 bg-white shadow-md flex items-center justify-center rounded-full"
      >
        <i className="ri-home-5-line text-lg"></i>
      </Link>

      {/* MAP */}
      <div className="h-1/2 w-full relative">
        <img
          className="w-full h-full object-cover"
          src="https://cdn.theatlantic.com/thumbor/BlEOtTo9L9mjMLuyCcjG3xYr4qE=/0x48:1231x740/960x540/media/img/mt/2017/04/IMG_7105/original.png"
          alt="map"
        />
      </div>

      {/* DETAILS PANEL */}
      <div className="h-1/2 bg-white rounded-t-3xl px-4 pt-4 pb-8 overflow-y-auto">

        {rideStatus !== "completed" && (
          <>

            {/* DRIVER CARD */}
            <div className="flex items-center gap-4 bg-white rounded-xl shadow-sm p-4 mb-4">

              <img
                className="h-16 w-16 rounded-full object-cover"
                src={
                  rideData?.captain?.photo ||
                  `https://ui-avatars.com/api/?name=${rideData?.captain?.fullname?.firstname}+${rideData?.captain?.fullname?.lastname}&background=random`
                }
                alt="driver"
              />

              <div className="flex-1">
                <h4 className="text-sm font-semibold">
                  {rideData?.captain?.fullname?.firstname}{" "}
                  {rideData?.captain?.fullname?.lastname}
                </h4>

                <p className="text-xs text-gray-500 mt-1">
                  {rideData?.captain?.vehicle?.model} •{" "}
                  {rideData?.captain?.vehicle?.color}
                </p>

                <p className="text-xs text-green-600 font-semibold mt-1">
                  Plate: {rideData?.captain?.vehicle?.plateNumber || "N/A"}
                </p>
              </div>

            </div>

            {/* TRIP DETAILS */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-4">

              <div className="flex items-start gap-3">
                <i className="ri-map-pin-line text-green-600 text-xl"></i>
                <div>
                  <p className="text-xs text-gray-500">Pickup</p>
                  <p className="font-semibold text-sm">{rideData?.pickup}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <i className="ri-map-pin-2-line text-red-600 text-xl"></i>
                <div>
                  <p className="text-xs text-gray-500">Destination</p>
                  <p className="font-semibold text-sm">{rideData?.destination}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-xs text-gray-500">Fare</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{rideData?.fare}
                </p>
              </div>

            </div>

            {/* STATUS */}
            <div className="mt-6 text-center">

              {rideStatus === "waiting" && (
                <p className="text-gray-600 text-sm">
                  Driver is on the way 🚗
                </p>
              )}

              {rideStatus === "ongoing" && (
                <p className="text-blue-600 font-semibold text-sm">
                  Ride in Progress
                </p>
              )}

            </div>

          </>
        )}

        {rideStatus === "completed" && (
          <div ref={completedPanelRef} className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ride Completed ✓</h2>

            <p className="mb-4">
              Total Fare: ₹{rideData?.fare}
            </p>

            <button
              onClick={() => setShowPaymentPanel(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-xl"
            >
              Pay Now
            </button>
          </div>
        )}

      </div>

      {/* PAYMENT PANEL */}

      <div
        ref={paymentPanelRef}
        className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-3xl shadow-2xl translate-y-full"
      >

        <div className="p-6 space-y-3">

          <button
            disabled={loading}
            onClick={() => handlePaymentSelect("Cash")}
            className="w-full bg-gray-100 p-4 rounded-xl"
          >
            Pay Cash
          </button>

          <button
            disabled={loading}
            onClick={() => handlePaymentSelect("UPI")}
            className="w-full bg-gray-100 p-4 rounded-xl"
          >
            Pay UPI
          </button>

          <button
            onClick={() => setShowPaymentPanel(false)}
            className="w-full bg-red-500 text-white p-4 rounded-xl"
          >
            Cancel
          </button>

        </div>

      </div>

    </div>
  );
};

export default Riding;