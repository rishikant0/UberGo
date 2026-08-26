import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  MapPin, Flag, CreditCard, Phone, MessageSquare, CheckCircle2, 
  ChevronDown, KeyRound, XCircle 
} from "lucide-react";

import { getVehicleDetails } from "../utils/vehicleUtils";
import CallModal from "./CallModal";
import RideChatModal from "./RideChatModal";
import CancelRideModal from "./CancelRideModal";

const ConfirmedRide = (props) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(props.status || "accepted");

  const [showCallModal, setShowCallModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);

  const navigate = useNavigate();

  const ride = props.ride;
  const passenger = ride?.user;
  const passengerName = passenger?.fullname?.firstname
    ? `${passenger.fullname.firstname} ${passenger.lastname || passenger.fullname.lastname || ""}`.trim()
    : "Passenger";

  const vehicleDisplay = getVehicleDetails(props.vehicalType || ride?.vehicleType);

  /* 1. NOTIFY USER ARRIVED AT PICKUP */
  const handleArrived = async () => {
    const token = localStorage.getItem("captainToken");
    if (!token || !props.rideId) return;

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/rides/arrived`,
        { rideId: props.rideId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 200) {
        setStatus("arrived");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to notify arrival");
    } finally {
      setLoading(false);
    }
  };

  /* 2. VERIFY OTP & START RIDE */
  const verifyOtpAndStartRide = async () => {
    if (otp.length !== 4) {
      alert("Enter valid 4-digit OTP");
      return;
    }

    const token = localStorage.getItem("captainToken");
    if (!token || !props.rideId) {
      alert("Captain authentication or Ride ID missing");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/rides/start`,
        {
          rideId: props.rideId,
          otp: otp,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        if (props.setconfirmRidePanel) {
          props.setconfirmRidePanel(false);
        }
        navigate("/captain-riding", {
          state: { ride: res.data.ride },
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP. Please check with passenger.");
    } finally {
      setLoading(false);
    }
  };

  /* 3. CAPTAIN CANCEL RIDE BEFORE OTP */
  const handleConfirmCancel = async (reason) => {
    const rideId = props.rideId || ride?._id;
    if (!rideId) {
      props.setconfirmRidePanel?.(false);
      return;
    }

    try {
      setLoadingCancel(true);
      const token = localStorage.getItem("captainToken");
      await axios.post(
        `${import.meta.env.VITE_URL}/rides/cancel`,
        { rideId, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowCancelModal(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel ride");
    } finally {
      setLoadingCancel(false);
    }
  };

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

  const isTripStarted = status === "ongoing" || ride?.status === "ongoing";

  return (
    <div className="relative text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] max-w-lg mx-auto pb-4">
      {/* DRAG HANDLE */}
      <div
        onClick={() => props.setconfirmRidePanel?.(false)}
        className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4 cursor-pointer hover:bg-slate-400 transition"
      ></div>

      {/* STATUS HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              {status === "arrived" ? "At Pickup Point" : "En Route to Pickup"}
            </h3>
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Vehicle: <span className="text-emerald-600 font-bold">{vehicleDisplay.name}</span> ({vehicleDisplay.icon})
          </p>
        </div>

        <button
          onClick={() => props.setconfirmRidePanel?.(false)}
          className="p-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* PASSENGER CARD */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 mb-3 shadow-xl flex items-center justify-between border border-slate-800">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={
              passenger?.photo ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(passengerName)}&background=4F46E5&color=fff&bold=true`
            }
            alt={passengerName}
            className="h-12 w-12 rounded-xl object-cover border-2 border-indigo-400 shrink-0 bg-slate-800"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(passengerName || "User")}&background=4F46E5&color=fff&bold=true`;
            }}
          />
          <div className="min-w-0">
            <h4 className="text-base font-extrabold text-white truncate">{passengerName}</h4>
            <p className="text-xs text-slate-400 font-semibold truncate">{props.pickup}</p>
          </div>
        </div>

        {/* QUICK CALL & MESSAGE */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCallClick}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow transition"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowChatModal(true)}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl shadow border border-slate-700 transition"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TRIP DETAILS CARD */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3.5 mb-3 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pickup Point</h4>
            <p className="text-sm font-extrabold text-slate-900 leading-snug mt-0.5">{props.pickup}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
            <Flag className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Destination</h4>
            <p className="text-sm font-extrabold text-slate-900 leading-snug mt-0.5">{props.destination}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 pt-3 border-t border-slate-200">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
            <CreditCard className="w-4 h-4" />
          </div>
          <div className="flex-1 flex justify-between items-center">
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Trip Earnings</h4>
              <p className="text-xs font-semibold text-slate-600">Collect Cash / Online</p>
            </div>
            <span className="text-xl font-black text-emerald-600">₹{props.fare}</span>
          </div>
        </div>
      </div>

      {/* ARRIVED BUTTON (BEFORE ARRIVAL) */}
      {status !== "arrived" && !isTripStarted && (
        <button
          onClick={handleArrived}
          disabled={loading}
          className="w-full h-13 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl shadow-xl transition active:scale-95 flex items-center justify-center gap-2 text-base mb-3"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>{loading ? "Updating..." : "I Have Arrived at Pickup"}</span>
        </button>
      )}

      {/* OTP ENTRY CARD */}
      {!isTripStarted && (
        <div className="bg-slate-950 text-white rounded-2xl p-4 shadow-xl border border-slate-800 space-y-3 mb-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <KeyRound className="w-4 h-4" />
            <span>Enter 4-Digit Passenger PIN to Start Ride</span>
          </div>

          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="ENTER OTP (e.g. 4148)"
            maxLength={4}
            inputMode="numeric"
            pattern="[0-9]*"
            className="w-full h-14 bg-slate-900 border-2 border-slate-800 focus:border-emerald-500 text-center text-3xl font-mono font-black tracking-widest text-emerald-400 rounded-xl outline-none transition"
          />

          <button
            onClick={verifyOtpAndStartRide}
            disabled={loading || otp.length !== 4}
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-extrabold rounded-xl shadow-lg transition active:scale-95 text-sm"
          >
            {loading ? "Verifying..." : "Verify OTP & Start Ride"}
          </button>
        </div>
      )}

      {/* CAPTAIN CANCEL RIDE BUTTON (ONLY BEFORE OTP / TRIP START) */}
      {!isTripStarted && (
        <button
          onClick={() => setShowCancelModal(true)}
          className="w-full py-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-extrabold rounded-xl shadow-sm transition active:scale-95 flex items-center justify-center gap-2 text-xs"
        >
          <XCircle className="w-4 h-4 text-rose-600" />
          <span>Cancel Ride</span>
        </button>
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
        rideId={props.rideId}
        currentUserId={ride?.captain?._id || ride?.captain}
        currentRole="captain"
        receiverId={passenger?._id}
        receiverName={passengerName}
        receiverPhoto={passenger?.photo}
      />

      {/* CANCEL RIDE MODAL */}
      <CancelRideModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirmCancel={handleConfirmCancel}
        role="captain"
        loading={loadingCancel}
      />
    </div>
  );
};

export default ConfirmedRide;
