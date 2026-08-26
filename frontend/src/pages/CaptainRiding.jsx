import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { 
  MapPin, Flag, CreditCard, Phone, MessageSquare, ArrowLeft, 
  CheckCircle2, QrCode, Wallet, ChevronDown 
} from "lucide-react";

import LiveMap from "../components/LiveMap";
import { SocketDataContext } from "../context/socketContext.jsx";
import { CaptainDataContext } from "../context/captaincontext.jsx";
import { getVehicleDetails } from "../utils/vehicleUtils";
import CallModal from "../components/CallModal";
import RideChatModal from "../components/RideChatModal";

const CaptainRiding = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ride = location.state?.ride || location.state;

  const [showPaymentPanel, setShowPaymentPanel] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showCallModal, setShowCallModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  const { socket } = useContext(SocketDataContext);
  const { captain } = useContext(CaptainDataContext);

  const paymentPanelRef = useRef(null);

  useGSAP(() => {
    if (paymentPanelRef.current) {
      gsap.to(paymentPanelRef.current, {
        y: showPaymentPanel ? "0%" : "100%",
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, [showPaymentPanel]);

  const [chatToast, setChatToast] = useState(null);

  /* ================= SOCKET JOIN & LISTENERS ================= */
  useEffect(() => {
    if (!socket || !captain?._id) return;

    socket.emit("join", {
      userId: captain._id,
      role: "captain",
    });

    const handlePaymentCompleted = (data) => {
      console.log("Captain received payment-completed:", data);
      navigate("/finish-ride", { state: { role: "captain", ride: data.ride || ride } });
    };

    const handleReceiveMessage = (msgData) => {
      if (String(msgData.rideId) === String(ride?._id)) {
        setChatToast(msgData);
      }
    };

    socket.on("payment-completed", handlePaymentCompleted);
    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("payment-completed", handlePaymentCompleted);
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [socket, captain, ride, navigate]);

  /* ================= COMPLETE & PROCESS PAYMENT ================= */
  const handlePaymentSelect = async (method) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("captainToken");
      if (!token) {
        alert("Please login again");
        return;
      }

      // 1. Complete ride first
      await axios.post(
        `${import.meta.env.VITE_URL}/rides/complete`,
        { rideId: ride?._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2. Process payment status
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/rides/process-payment`,
        { rideId: ride?._id, paymentMethod: method },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success || res.status === 200) {
        navigate("/finish-ride", { state: { role: "captain", ride: res.data.ride || ride } });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error processing ride completion");
    } finally {
      setLoading(false);
    }
  };

  const passenger = ride?.user;
  const passengerName = passenger?.fullname?.firstname
    ? `${passenger.fullname.firstname} ${passenger.fullname.lastname || ""}`.trim()
    : "Passenger";

  const vehicleDisplay = getVehicleDetails(ride?.vehicleType || captain?.vehicle?.type);

  const handleCallClick = () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    if (isMobile && passenger?.phone) {
      window.location.href = `tel:${passenger.phone}`;
    } else {
      setShowCallModal(true);
    }
  };

  return (
    <div className="h-screen w-full relative overflow-hidden bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col md:flex-row">
      
      {/* HEADER */}
      <div className="absolute top-4 left-4 z-40 flex items-center gap-3">
        <Link
          to="/captain-home"
          className="w-10 h-10 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white flex items-center justify-center shadow-xl backdrop-blur-md hover:bg-slate-800 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="px-3.5 py-2 rounded-2xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-xl flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-bold text-white tracking-wide uppercase">
            Captain Navigation Mode ({vehicleDisplay.name} {vehicleDisplay.icon})
          </span>
        </div>
      </div>

      {/* MAP */}
      <div className="w-full md:w-[60%] lg:w-[65%] h-[45vh] md:h-full relative shrink-0">
        <LiveMap
          isOnline={true}
          pickup={ride?.pickup}
          destination={ride?.destination}
          rideId={ride?._id}
        />
      </div>

      {/* RIDE DETAILS PANEL */}
      <div className="w-full md:w-[40%] lg:w-[35%] h-[55vh] md:h-full bg-white text-slate-900 rounded-t-[28px] md:rounded-t-none md:rounded-l-3xl shadow-2xl flex flex-col z-30 overflow-hidden border-t md:border-t-0 md:border-l border-slate-200">
        <div className="md:hidden py-2 flex justify-center cursor-pointer bg-white">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full"></div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pt-2 pb-6 space-y-4 max-w-md mx-auto w-full">
          {/* PASSENGER CARD */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-xl flex items-center gap-3.5 border border-slate-800">
            <img
              className="h-14 w-14 rounded-2xl object-cover border-2 border-indigo-400 shadow-md bg-slate-800 shrink-0"
              src={
                passenger?.photo ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(passengerName)}&background=4F46E5&color=fff&bold=true`
              }
              alt={passengerName}
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(passengerName || "User")}&background=4F46E5&color=fff&bold=true`;
              }}
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-base font-extrabold text-white truncate">
                  {passengerName}
                </h4>
                <span className="text-[11px] font-bold bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full shrink-0">
                  ⭐ 4.9
                </span>
              </div>
              <p className="text-xs font-medium text-slate-300 mt-0.5 truncate">
                {passenger?.email || "Passenger Profile"}
              </p>
              <div className="inline-block bg-slate-800 border border-slate-700 text-indigo-400 px-2 py-0.5 rounded-md text-xs font-mono font-bold mt-1.5">
                Collect ₹{ride?.fare || 0} at Destination
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
              <span>Call Passenger</span>
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
                  {ride?.pickup || "Pickup location loading..."}
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
                  {ride?.destination || "Destination address loading..."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-3 border-t border-slate-200">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                <CreditCard className="w-4 h-4" />
              </div>
              <div className="flex-1 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Trip Earnings ({vehicleDisplay.name})</h4>
                  <p className="text-xs font-semibold text-slate-600">Collect from Passenger</p>
                </div>
                <span className="text-2xl font-black text-emerald-600">
                  ₹{ride?.fare || 0}
                </span>
              </div>
            </div>
          </div>

          {/* REACHED DESTINATION CTA */}
          <button 
            onClick={() => setShowPaymentPanel(true)}
            disabled={loading}
            className="w-full h-13 bg-slate-950 hover:bg-slate-800 text-white font-extrabold rounded-xl shadow-xl transition active:scale-95 flex items-center justify-center gap-2 text-base"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Reached Destination & Complete Ride</span>
          </button>
        </div>
      </div>

      {/* PAYMENT / COMPLETE MODAL */}
      <div
        ref={paymentPanelRef}
        className="fixed bottom-0 left-0 right-0 bg-white text-slate-900 z-50 rounded-t-3xl shadow-2xl p-6 translate-y-full max-w-lg mx-auto border-t border-slate-200"
      >
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4"></div>
        <h3 className="text-lg font-black text-center mb-1">Confirm Payment Collection</h3>
        <p className="text-center text-xs font-semibold text-slate-500 mb-5">
          Collect Total Fare: <span className="text-xl font-black text-emerald-600">₹{ride?.fare || 0}</span>
        </p>

        <div className="space-y-3 mb-4">
          <button
            onClick={() => handlePaymentSelect("cash")}
            disabled={loading}
            className="w-full p-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl flex items-center justify-between font-bold text-sm transition"
          >
            <div className="flex items-center gap-2.5">
              <Wallet className="w-5 h-5 text-emerald-600" />
              <span>Collected Cash Payment</span>
            </div>
            <span className="text-emerald-700 font-black">₹{ride?.fare}</span>
          </button>

          <button
            onClick={() => setShowQrModal(true)}
            disabled={loading}
            className="w-full p-4 bg-indigo-50 hover:bg-indigo-100 border border-indigo-300 rounded-xl flex items-center justify-between font-bold text-sm transition"
          >
            <div className="flex items-center gap-2.5">
              <QrCode className="w-5 h-5 text-indigo-600" />
              <span>Show QR / Collect Online UPI</span>
            </div>
            <span className="text-indigo-700 font-black">UPI QR</span>
          </button>
        </div>

        <button
          onClick={() => setShowPaymentPanel(false)}
          disabled={loading}
          className="w-full py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold text-xs transition"
        >
          Cancel
        </button>
      </div>

      {/* UPI QR CODE DISPLAY MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <h3 className="text-lg font-black text-white">Passenger UPI Payment QR</h3>
            <p className="text-xs font-semibold text-slate-400">
              Ask passenger to scan and pay exact fare amount
            </p>

            <div className="bg-white p-4 rounded-2xl w-48 h-48 mx-auto flex items-center justify-center shadow-lg">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=uberclone@upi%26pn=UberCaptain%26am=${ride?.fare || 100}%26cu=INR`}
                alt="UPI QR Code"
                className="w-full h-full object-contain"
              />
            </div>

            <p className="text-xl font-black text-emerald-400">₹{ride?.fare || 0}</p>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setShowQrModal(false);
                  handlePaymentSelect("qr");
                }}
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl shadow-lg transition text-xs"
              >
                {loading ? "Completing..." : "Confirm Online Payment Received"}
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
        contactName={passengerName}
        phone={passenger?.phone}
      />

      {/* CHAT MODAL */}
      <RideChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        rideId={ride?._id}
        currentUserId={captain?._id}
        currentRole="captain"
        receiverId={passenger?._id}
        receiverName={passengerName}
        receiverPhoto={passenger?.photo}
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

export default CaptainRiding;