import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ShieldCheck, Bell, RefreshCw, AlertCircle, Sparkles } from "lucide-react";

import CaptainNavbar from "../components/CaptainNavbar";
import OnlineToggleHeader from "../components/OnlineToggleHeader";
import CaptainDetails from "../components/CaptainDetails";
import LiveMap from "../components/LiveMap";
import EarningsChart from "../components/EarningsChart";
import RecentTripsList from "../components/RecentTripsList";
import DemandInsightsCard from "../components/DemandInsightsCard";
import RidePopUp from "../components/RidePopUp";
import ConfirmedRide from "../components/ConfirmedRide";
import RideCancelledCard from "../components/RideCancelledCard";

import { SocketDataContext } from "../context/socketContext.jsx";
import { CaptainDataContext } from "../context/captaincontext.jsx";

const Captain_Home = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [timeframe, setTimeframe] = useState("today");
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [isTogglingOnline, setIsTogglingOnline] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [ridePopUpPanel, setRidePopUpPanel] = useState(false);
  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false);
  const [rideData, setRideData] = useState(null);

  const ridePopUpPanelRef = useRef(null);
  const confirmRidePopUpPanelRef = useRef(null);

  const { socket, isConnected } = useContext(SocketDataContext);
  const { captain, isLoading: isLoadingCaptain } = useContext(CaptainDataContext);
  const navigate = useNavigate();

  const showToast = (msg, type = "success") => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  /* ================= AUTH CHECK & DASHBOARD FETCH ================= */
  const fetchDashboardData = async () => {
    const token = localStorage.getItem("captainToken");
    if (!token) {
      navigate("/captain-login");
      return;
    }

    try {
      setIsLoadingDashboard(true);
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/captains/dashboard?timeframe=${timeframe}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data?.success) {
        setDashboardData(res.data);
        setIsOnline(Boolean(res.data.isOnline));
        if (res.data.activeRide) {
          setRideData(res.data.activeRide);
          if (res.data.activeRide.status === "accepted" || res.data.activeRide.status === "arrived") {
            setConfirmRidePopUpPanel(true);
          }
        }
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("captainToken");
        navigate("/captain-login");
      }
    } finally {
      setIsLoadingDashboard(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [timeframe]);

  /* ================= TOGGLE ONLINE / OFFLINE ================= */
  const handleToggleOnline = async () => {
    const token = localStorage.getItem("captainToken");
    if (!token) return;

    try {
      setIsTogglingOnline(true);
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/captains/toggle-online`,
        { isOnline: !isOnline },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success) {
        const nextState = Boolean(res.data.isOnline);
        setIsOnline(nextState);
        showToast(
          nextState
            ? "🟢 You are now ONLINE & active for rides!"
            : "⚫ You are now OFFLINE",
          nextState ? "success" : "info"
        );
        fetchDashboardData();
      }
    } catch (err) {
      console.error("Toggle online error:", err);
      showToast(err.response?.data?.message || "Failed to update status", "error");
    } finally {
      setIsTogglingOnline(false);
    }
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("captainToken");
    navigate("/captain-login");
  };

  /* ================= SOCKET JOIN & LOCATION TRACKING ================= */
  useEffect(() => {
    if (!socket || !isConnected || !captain?._id) return;

    socket.emit("join", {
      userId: captain._id,
      role: "captain",
    });

    const intervalId = setInterval(() => {
      if (navigator.geolocation && isOnline) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            socket.emit("update-location-captain", {
              userId: captain._id,
              location: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              },
            });
          },
          (error) => console.warn("Socket location broadcast error:", error)
        );
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, [socket, isConnected, captain, isOnline]);

  const [cancelledInfo, setCancelledInfo] = useState(null);

  /* ================= SOCKET EVENT LISTENERS ================= */
  useEffect(() => {
    if (!socket) return;

    socket.on("new-ride", (data) => {
      console.log("🚖 New ride request received:", data);
      setRideData(data);
      setRidePopUpPanel(true);
      showToast("🚕 New Ride Request Available!", "success");
    });

    socket.on("ride-started", (data) => {
      console.log("🚗 Ride started event:", data);
      navigate("/captain-riding", { state: data });
    });

    socket.on("ride-cancelled", (data) => {
      console.log("❌ Ride cancelled event received by captain:", data);
      setRidePopUpPanel(false);
      setConfirmRidePopUpPanel(false);
      setRideData(null);
      setCancelledInfo(data);
    });

    return () => {
      socket.off("new-ride");
      socket.off("ride-started");
      socket.off("ride-cancelled");
    };
  }, [socket, navigate]);

  /* ================= ACCEPT RIDE ================= */
  const confirmedRide = async () => {
    try {
      const token = localStorage.getItem("captainToken");
      if (!token) {
        showToast("Captain authentication required", "error");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_URL}/rides/confirm`,
        { rideId: rideData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.success) {
        setRidePopUpPanel(false);
        setConfirmRidePopUpPanel(true);
        setRideData(response.data.ride);
        showToast("✅ Ride accepted! Head to pickup location.", "success");
      }
    } catch (err) {
      console.error("Confirm ride error:", err);
      showToast(err.response?.data?.message || "Failed to confirm ride", "error");
    }
  };

  /* ================= GSAP ANIMATIONS FOR POPUPS ================= */
  useGSAP(() => {
    if (ridePopUpPanelRef.current) {
      gsap.to(ridePopUpPanelRef.current, {
        y: ridePopUpPanel ? "0%" : "100%",
        duration: 0.4,
        ease: "power3.out",
      });
    }
  }, [ridePopUpPanel]);

  useGSAP(() => {
    if (confirmRidePopUpPanelRef.current) {
      gsap.to(confirmRidePopUpPanelRef.current, {
        y: confirmRidePopUpPanel ? "0%" : "100%",
        duration: 0.4,
        ease: "power3.out",
      });
    }
  }, [confirmRidePopUpPanel]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row font-['Plus_Jakarta_Sans',sans-serif] relative overflow-x-hidden">
      
      {/* TOAST NOTIFICATION BANNER */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 animate-bounce">
          <div
            className={`px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md border text-sm font-bold flex items-center gap-3 ${
              toastMessage.type === "error"
                ? "bg-rose-950/90 text-rose-300 border-rose-800"
                : toastMessage.type === "info"
                ? "bg-slate-900/90 text-slate-200 border-slate-700"
                : "bg-emerald-950/90 text-emerald-300 border-emerald-800"
            }`}
          >
            <Sparkles className="w-5 h-5 shrink-0 text-emerald-400" />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* SIDEBAR & NAVIGATION */}
      <CaptainNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        isOnline={isOnline}
        toggleOnline={handleToggleOnline}
        isTogglingOnline={isTogglingOnline}
      />

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        
        {/* ONLINE/OFFLINE HEADER CONTROL */}
        <OnlineToggleHeader
          isOnline={isOnline}
          toggleOnline={handleToggleOnline}
          isToggling={isTogglingOnline}
          activeRide={dashboardData?.activeRide}
        />

        {/* TAB 1: HOME DASHBOARD */}
        {activeTab === "home" && (
          <div className="space-y-6">
            
            {/* TOP SPLIT: MAP + CAPTAIN SUMMARY CARDS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* LIVE INTERACTIVE MAP */}
              <div className="lg:col-span-7 h-[380px] lg:h-[500px] w-full">
                <LiveMap
                  isOnline={isOnline}
                  activeRide={dashboardData?.activeRide}
                />
              </div>

              {/* CAPTAIN PROFILE & PERFORMANCE SUMMARY */}
              <div className="lg:col-span-5 space-y-6">
                <CaptainDetails
                  dashboardData={dashboardData}
                  isLoading={isLoadingDashboard}
                  isOnline={isOnline}
                />
              </div>
            </div>

            {/* ANALYTICS & RECENT TRIPS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* EARNINGS CHART */}
              <div className="lg:col-span-7">
                <EarningsChart
                  analyticsData={dashboardData?.analytics}
                  timeframe={timeframe}
                  setTimeframe={setTimeframe}
                  isLoading={isLoadingDashboard}
                />
              </div>

              {/* DEMAND INSIGHTS & RECENT TRIPS */}
              <div className="lg:col-span-5 space-y-6">
                <DemandInsightsCard demandInfo={dashboardData?.demandInsights} />
                <RecentTripsList
                  trips={dashboardData?.recentTrips || []}
                  isLoading={isLoadingDashboard}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EARNINGS TAB */}
        {activeTab === "earnings" && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h2 className="text-2xl font-black text-white mb-2">Earnings Overview</h2>
              <p className="text-xs text-slate-400">Detailed payment analytics and weekly payouts</p>
            </div>
            <EarningsChart
              analyticsData={dashboardData?.analytics}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
              isLoading={isLoadingDashboard}
            />
          </div>
        )}

        {/* TAB 3: TRIPS TAB */}
        {activeTab === "trips" && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h2 className="text-2xl font-black text-white mb-2">Ride History</h2>
              <p className="text-xs text-slate-400">Complete log of all trips, fares, and ratings</p>
            </div>
            <RecentTripsList
              trips={dashboardData?.recentTrips || []}
              isLoading={isLoadingDashboard}
            />
          </div>
        )}

        {/* TAB 4: ACCOUNT TAB */}
        {activeTab === "account" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <h2 className="text-2xl font-black text-white">Account Details</h2>
            <div className="space-y-4 text-sm text-slate-300">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <p className="text-xs text-slate-500 font-bold uppercase">Name</p>
                <p className="text-base font-bold text-white mt-1">
                  {dashboardData?.captain?.fullname?.firstname} {dashboardData?.captain?.fullname?.lastname}
                </p>
              </div>
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <p className="text-xs text-slate-500 font-bold uppercase">Email</p>
                <p className="text-base font-bold text-white mt-1">{dashboardData?.captain?.email}</p>
              </div>
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <p className="text-xs text-slate-500 font-bold uppercase">Vehicle Type & Plate</p>
                <p className="text-base font-bold text-emerald-400 mt-1">
                  {dashboardData?.captain?.vehicle?.type} • {dashboardData?.captain?.vehicle?.model} ({dashboardData?.captain?.vehicle?.plateNumber})
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-2xl transition shadow-lg shadow-rose-600/30"
              >
                Sign Out of Captain Account
              </button>
            </div>
          </div>
        )}

      </main>

      {/* RIDE REQUEST POPUP */}
      <div
        ref={ridePopUpPanelRef}
        className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-50 px-4 py-4 rounded-t-3xl shadow-2xl translate-y-full"
      >
        <RidePopUp
          ride={rideData}
          setridePopUpPanel={setRidePopUpPanel}
          setconfirmridePopUpPanel={setConfirmRidePopUpPanel}
          confirmedRide={confirmedRide}
        />
      </div>

      {/* CONFIRMED RIDE POPUP */}
      <div
        ref={confirmRidePopUpPanelRef}
        className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-50 px-4 py-4 rounded-t-3xl shadow-2xl translate-y-full"
      >
        <ConfirmedRide
          setconfirmRidePanel={setConfirmRidePopUpPanel}
          pickup={rideData?.pickup}
          destination={rideData?.destination}
          fare={rideData?.fare}
          rideId={rideData?._id}
          ride={rideData}
        />
      </div>

      {/* RIDE CANCELLED OVERLAY */}
      {cancelledInfo && (
        <RideCancelledCard
          cancelledBy={cancelledInfo.cancelledBy}
          cancelReason={cancelledInfo.cancelReason}
          onGoHome={() => {
            setCancelledInfo(null);
            setRideData(null);
            setRidePopUpPanel(false);
            setConfirmRidePopUpPanel(false);
          }}
        />
      )}
    </div>
  );
};

export default Captain_Home;
