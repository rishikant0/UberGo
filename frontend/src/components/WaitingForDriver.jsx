import React, { useState } from "react";
import axios from "axios";
import { 
  MapPin, Flag, CreditCard, ShieldCheck, Phone, MessageSquare, 
  ChevronDown, KeyRound, AlertCircle, XCircle 
} from "lucide-react";

import { getVehicleDetails } from "../utils/vehicleUtils";
import CallModal from "./CallModal";
import RideChatModal from "./RideChatModal";
import CancelRideModal from "./CancelRideModal";

const WaitingForDriver = (props) => {
  const [showCallModal, setShowCallModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);

  const ride = props.ride;
  const captain = ride?.captain;
  const vehicle = captain?.vehicle;
  const captainName = captain?.fullname?.firstname
    ? `${captain.fullname.firstname} ${captain.fullname.lastname || ""}`.trim()
    : "Captain Assigned";

  const vehicleDisplay = getVehicleDetails(ride?.vehicleType || vehicle?.vehicleType);

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

  const handleConfirmCancel = async (reason) => {
    const rideId = ride?._id || props.ride?._id;
    if (!rideId) {
      props.setwaitingForDriver?.(false);
      return;
    }

    try {
      setLoadingCancel(true);
      const token = localStorage.getItem("token");
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

  // Check if trip has started after OTP
  const isTripStarted = ride?.status === "ongoing";

  return (
    <div className="relative text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] max-w-lg mx-auto pb-4">
      
      {/* DRAG HANDLE */}
      <div
        onClick={() => props.setwaitingForDriver?.(false)}
        className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-3 cursor-pointer hover:bg-slate-400 transition"
      ></div>

      {/* HEADER TITLE */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              {ride?.status === "arrived" ? "Captain Arrived at Pickup!" : "Captain on the Way"}
            </h3>
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Matching Vehicle: <span className="font-bold text-emerald-600">{vehicleDisplay.name}</span> ({vehicleDisplay.icon})
          </p>
        </div>

        <button
          onClick={() => props.setwaitingForDriver?.(false)}
          className="p-1 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* CAPTAIN PROFILE CARD */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 mb-3 shadow-xl flex items-center justify-between border border-slate-800">
        <div className="flex items-center gap-3.5 min-w-0">
          <img
            src={
              captain?.photo ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(captainName)}&background=0D9488&color=fff&bold=true`
            }
            alt={captainName}
            className="h-14 w-14 rounded-2xl object-cover border-2 border-emerald-400 shrink-0 bg-slate-800 shadow-md"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(captainName || "Captain")}&background=0D9488&color=fff&bold=true`;
            }}
          />

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-extrabold text-white truncate">{captainName}</h4>
              <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full shrink-0">
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
              {vehicle?.plateNumber || "MH 02 EQ 8829"}
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCallClick}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow transition active:scale-95"
            title="Call Captain"
          >
            <Phone className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setShowChatModal(true)}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl shadow border border-slate-700 transition active:scale-95"
            title="Message Captain"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PROMINENT OTP PIN CARD (BEFORE TRIP START) */}
      {!isTripStarted && ride?.otp && (
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-2 border-emerald-500/50 rounded-2xl p-3.5 mb-3 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <KeyRound className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Start Ride PIN (Share with Captain)</p>
              <p className="text-2xl font-mono font-black text-emerald-400 tracking-widest leading-none mt-0.5">
                {ride.otp}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-extrabold bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20 shrink-0">
            Share OTP
          </span>
        </div>
      )}

      {/* TRIP DETAILS CARD */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-3 mb-3 shadow-sm text-xs">
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Pickup Location</h4>
            <p className="font-extrabold text-slate-900 leading-snug mt-0.5">
              {ride?.pickup || props.pickup || "Pickup Location"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
            <Flag className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Destination Address</h4>
            <p className="font-extrabold text-slate-900 leading-snug mt-0.5">
              {ride?.destination || props.destination || "Destination Address"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2.5 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-600">Trip Fare ({vehicleDisplay.name})</span>
          </div>
          <span className="text-xl font-black text-emerald-600">₹{ride?.fare || props.fare || 0}</span>
        </div>
      </div>

      {/* STRICT CANCELLATION RULE: CANCEL BUTTON ONLY APPEARS BEFORE TRIP START */}
      {!isTripStarted && (
        <button
          onClick={() => setShowCancelModal(true)}
          className="w-full py-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-extrabold rounded-xl shadow-sm transition active:scale-95 flex items-center justify-center gap-2 text-xs"
        >
          <XCircle className="w-4 h-4 text-rose-600" />
          <span>Cancel Ride Request</span>
        </button>
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
        rideId={ride?._id}
        currentUserId={ride?.user?._id || ride?.user}
        currentRole="user"
        receiverId={captain?._id}
        receiverName={captainName}
        receiverPhoto={captain?.photo}
      />

      {/* CANCEL MODAL */}
      <CancelRideModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirmCancel={handleConfirmCancel}
        role="user"
        loading={loadingCancel}
      />
    </div>
  );
};

export default WaitingForDriver;
