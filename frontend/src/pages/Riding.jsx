import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { 
  MapPin, Flag, CreditCard, Phone, MessageSquare, ShieldCheck, 
  ArrowLeft, CheckCircle2, ChevronDown, QrCode, Wallet 
} from "lucide-react";

import LiveMap from "../components/LiveMap";
import { SocketDataContext } from "../context/socketContext.jsx";
import { UserDataContext } from "../context/usercontext.jsx";
import { getVehicleDetails } from "../utils/vehicleUtils";
import CallModal from "../components/CallModal";
import RideChatModal from "../components/RideChatModal";

const Riding = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ride = location.state?.ride;

  const [rideStatus, setRideStatus] = useState(ride?.status || "ongoing");
  const [rideData, setRideData] = useState(ride);
  const [showPaymentPanel, setShowPaymentPanel] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showCallModal, setShowCallModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  const { socket } = useContext(SocketDataContext);
  const { user } = useContext(UserDataContext);

  const completedPanelRef = useRef(null);
  const paymentPanelRef = useRef(null);

  /* ===== ANIMATIONS ===== */
  useGSAP(() => {
    if (completedPanelRef.current) {
      gsap.to(completedPanelRef.current, {
        opacity: rideStatus === "completed" ? 1 : 0,
        duration: 0.5,
      });
    }
  }, [rideStatus]);

  useGSAP(() => {
    if (paymentPanelRef.current) {
      gsap.to(paymentPanelRef.current, {
        y: showPaymentPanel ? "0%" : "100%",
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, [showPaymentPanel]);

  /* ===== ACTIVE RIDE SYNC & SOCKET JOIN ===== */
  useEffect(() => {
    if (!socket || !user?._id) return;

    socket.emit("join", {
      userId: user._id,
      role: "user",
    });

    return () => {};
  }, [socket, user]);

  const [chatToast, setChatToast] = useState(null);

  /* ===== RIDE EVENTS ===== */
  useEffect(() => {
    if (!socket) return;

    const handleRideCompleted = (data) => {
      console.log("Ride completed:", data);
      setRideStatus("completed");
      setRideData(data);
      setShowPaymentPanel(true);
    };

    const handlePaymentCompleted = (data) => {
      console.log("Payment completed event received:", data);
      navigate("/finish-ride", { state: { role: "user", ride: data } });
    };

    const handleReceiveMessage = (msgData) => {
      if (String(msgData.rideId) === String(rideData?._id)) {
        setChatToast(msgData);
      }
    };

    socket.on("ride-completed", handleRideCompleted);
    socket.on("payment-completed", handlePaymentCompleted);
    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("ride-completed", handleRideCompleted);
      socket.off("payment-completed", handlePaymentCompleted);
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [socket, rideData, navigate]);

  /* ===== PAYMENT HANDLER ===== */
  const handlePaymentSelect = async (method) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) return alert("Please login again");

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

      if (res.data?.success || res.status === 200) {
        navigate("/finish-ride", { state: { role: "user", ride: res.data.ride || rideData } });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Payment processing failed");
    } finally {
      setLoading(false);
    }
  };

  const captain = rideData?.captain;
  const vehicle = captain?.vehicle;
  const captainName = captain?.fullname?.firstname
    ? `${captain.fullname.firstname} ${captain.fullname.lastname || ""}`.trim()
    : "Captain";

  const vehicleDisplay = getVehicleDetails(rideData?.vehicleType || vehicle?.vehicleType);

  const handleCallClick = () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    if (isMobile && captain?.phone) {
      window.location.href = `tel:${captain.phone}`;
    } else {
      setShowCallModal(true);
    }
  };

  return (
    <div className="h-screen w-full relative overflow-hidden bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col md:flex-row">
      
      {/* FLOATING TOP BRAND / BACK BAR */}
      <div className="absolute top-4 left-4 z-40 flex items-center gap-3">
        <Link
          to="/home"
          className="w-10 h-10 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white flex items-center justify-center shadow-xl backdrop-blur-md hover:bg-slate-800 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="px-3.5 py-2 rounded-2xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-xl flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-bold text-white tracking-wide uppercase">
            {rideStatus === "completed" ? "Ride Completed" : `Trip in Progress (${vehicleDisplay.name})`}
          </span>
        </div>
      </div>

      {/* MAP CONTAINER */}
      <div className="w-full md:w-[60%] lg:w-[65%] h-[45vh] md:h-full relative shrink-0">
        <LiveMap
          isOnline={true}
          pickup={rideData?.pickup}
          destination={rideData?.destination}
          rideId={rideData?._id}
        />
      </div>

      {/* RIDE DETAILS PANEL */}
      <div className="w-full md:w-[40%] lg:w-[35%] h-[55vh] md:h-full bg-white text-slate-900 rounded-t-[28px] md:rounded-t-none md:rounded-l-3xl shadow-2xl flex flex-col z-30 overflow-hidden border-t md:border-t-0 md:border-l border-slate-200">
        
        <div className="md:hidden py-2 flex justify-center cursor-pointer bg-white">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full"></div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pt-2 pb-6 space-y-4 max-w-md mx-auto w-full">
          
          {rideStatus !== "completed" && (
            <>
              {/* DRIVER CARD */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-xl flex items-center gap-3.5 border border-slate-800">
                <img
                  className="h-14 w-14 rounded-2xl object-cover border-2 border-emerald-400 shadow-md bg-slate-800 shrink-0"
                  src={
                    captain?.photo ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(captainName)}&background=0D9488&color=fff&bold=true`
                  }
                  alt={captainName}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(captainName || "Captain")}&background=0D9488&color=fff&bold=true`;
                  }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-extrabold text-white truncate">
                      {captainName}
                    </h4>
                    <span className="text-[11px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full shrink-0">
                      ⭐ 4.8
                    </span>
                  </div>

                  <p className="text-xs font-medium text-slate-300 mt-0.5 truncate flex items-center gap-1">
                    <span>{vehicleDisplay.icon}</span>
                    <span>{vehicleDisplay.name}</span>
                    <span>•</span>
                    <span>{vehicle?.color || "Black"} {vehicle?.model || "Vehicle"}</span>
                  </p>

                  <div className="inline-block bg-slate-800 border border-slate-700 text-emerald-400 px-2 py-0.5 rounded-md text-xs font-mono font-bold mt-1.5">
                    {vehicle?.plateNumber || "N/A"}
                  </div>
                </div>

                <img
                  src={vehicleDisplay.image}
                  alt={vehicleDisplay.name}
                  className="h-10 w-16 object-contain opacity-90 hidden sm:block shrink-0"
                />
              </div>

              {/* CONTACT BUTTONS */}
              <div className="grid grid-cols-2 gap-2.5 text-xs font-bold">
                <button
                  onClick={handleCallClick}
                  className="flex items-center justify-center gap-1.5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Driver</span>
                </button>

                <button
                  onClick={() => setShowChatModal(true)}
                  className="flex items-center justify-center gap-1.5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md transition active:scale-95"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>Message</span>
                </button>
              </div>

              {/* TRIP DETAILS CARD */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3.5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pickup Point</h4>
                    <p className="text-sm font-extrabold text-slate-900 leading-snug mt-0.5">
                      {rideData?.pickup || "Pickup address loading..."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Flag className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Destination Address</h4>
                    <p className="text-sm font-extrabold text-slate-900 leading-snug mt-0.5">
                      {rideData?.destination || "Destination address loading..."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-slate-200">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div className="flex-1 flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Trip Fare ({vehicleDisplay.name})</h4>
                      <p className="text-xs font-semibold text-slate-600">Cash / UPI Payment</p>
                    </div>
                    <span className="text-2xl font-black text-emerald-600">
                      ₹{rideData?.fare || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* RIDE STATUS BADGE */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                  <p className="text-xs font-black text-emerald-800 uppercase tracking-wider">
                    En Route to Destination — Ride in Progress
                  </p>
                </div>
              </div>
            </>
          )}

          {/* COMPLETED STATE */}
          {rideStatus === "completed" && (
            <div ref={completedPanelRef} className="py-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900">Ride Completed 🎉</h2>
                <p className="text-xs font-semibold text-slate-500 mt-1">
                  You have safely arrived at your destination!
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 my-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Final Fare Amount</p>
                <p className="text-3xl font-black text-emerald-600 mt-1">₹{rideData?.fare || 0}</p>
              </div>

              <button
                onClick={() => setShowPaymentPanel(true)}
                className="w-full h-13 bg-slate-950 hover:bg-slate-800 text-white font-extrabold rounded-xl shadow-xl transition active:scale-95 text-base"
              >
                Pay Now
              </button>
            </div>
          )}
        </div>
      </div>

      {/* PAYMENT PANEL MODAL */}
      <div
        ref={paymentPanelRef}
        className="fixed bottom-0 left-0 right-0 bg-white text-slate-900 z-50 rounded-t-3xl shadow-2xl p-6 translate-y-full max-w-lg mx-auto border-t border-slate-200"
      >
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4"></div>
        <h3 className="text-lg font-black text-center mb-1">Select Payment Method</h3>
        <p className="text-center text-xs font-semibold text-slate-500 mb-5">
          Total Amount Due: <span className="text-base font-black text-emerald-600">₹{rideData?.fare || 0}</span>
        </p>

        <div className="space-y-3 mb-4">
          <button
            disabled={loading}
            onClick={() => handlePaymentSelect("cash")}
            className="w-full p-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl flex items-center justify-between font-bold text-sm transition"
          >
            <div className="flex items-center gap-2.5">
              <Wallet className="w-5 h-5 text-emerald-600" />
              <span>Pay Cash to Captain</span>
            </div>
            <span className="text-emerald-700 font-black">₹{rideData?.fare}</span>
          </button>

          <button
            disabled={loading}
            onClick={() => setShowQrModal(true)}
            className="w-full p-4 bg-indigo-50 hover:bg-indigo-100 border border-indigo-300 rounded-xl flex items-center justify-between font-bold text-sm transition"
          >
            <div className="flex items-center gap-2.5">
              <QrCode className="w-5 h-5 text-indigo-600" />
              <span>Scan QR / Pay Online UPI</span>
            </div>
            <span className="text-indigo-700 font-black">UPI / QR</span>
          </button>
        </div>

        <button
          onClick={() => setShowPaymentPanel(false)}
          className="w-full py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold text-xs transition"
        >
          Cancel
        </button>
      </div>

      {/* UPI QR CODE PAYMENT MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <h3 className="text-lg font-black text-white">Scan UPI QR Code</h3>
            <p className="text-xs font-semibold text-slate-400">
              Scan with GPay, PhonePe, Paytm, or BHIM
            </p>

            <div className="bg-white p-4 rounded-2xl w-48 h-48 mx-auto flex items-center justify-center shadow-lg">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=uberclone@upi%26pn=UberRide%26am=${rideData?.fare || 100}%26cu=INR`}
                alt="UPI QR Code"
                className="w-full h-full object-contain"
              />
            </div>

            <p className="text-xl font-black text-emerald-400">₹{rideData?.fare || 0}</p>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setShowQrModal(false);
                  handlePaymentSelect("qr");
                }}
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl shadow-lg transition text-xs"
              >
                {loading ? "Processing..." : "I Have Completed Payment"}
              </button>

              <button
                onClick={() => setShowQrModal(false)}
                className="w-full py-2.5 bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold"
              >
                Close QR Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CALL MODAL */}
      <CallModal
        isOpen={showCallModal}
        onClose={() => setShowCallModal(false)}
        contactName={captainName}
        phone={captain?.phone}
      />

      {/* CHAT MODAL */}
      <RideChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        rideId={rideData?._id}
        currentUserId={user?._id}
        currentRole="user"
        receiverId={captain?._id}
        receiverName={captainName}
        receiverPhoto={captain?.photo}
      />

      {/* CHAT TOAST NOTIFICATION WHEN MODAL IS CLOSED */}
      {chatToast && !showChatModal && (
        <div className="fixed top-16 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 bg-slate-900 border border-slate-700 text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between font-['Plus_Jakarta_Sans',sans-serif]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
              💬
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase">New Message</p>
              <p className="text-xs font-semibold text-white truncate">{chatToast.message}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setChatToast(null);
              setShowChatModal(true);
            }}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shrink-0 ml-2 shadow cursor-pointer"
          >
            Open Chat
          </button>
        </div>
      )}
    </div>
  );
};

export default Riding;