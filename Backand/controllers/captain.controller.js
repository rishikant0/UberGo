import captainModel from "../models/captain.model.js";
import blacklistTokenModel from "../models/blacklistToken.model.js";
import captainSessionModel from "../models/captainSession.model.js";
import rideModel from "../models/ride.model.js";
import { createCaptain } from "../services/captain.service.js";
import { validationResult } from "express-validator";

/* ================= DEBUG CAPTAIN LOOKUP (DEV) ================= */
const debugCaptain = async (req, res, next) => {
  try {
    let { email } = req.params;
    if (email && typeof email === "string") {
      email = email.toLowerCase().trim();
    }

    console.log("[debugCaptain] lookup for:", email);

    const captain = await captainModel.findOne({ email });
    if (!captain) {
      return res.status(200).json({ found: false });
    }

    return res.status(200).json({
      found: true,
      captain: { _id: captain._id.toString(), email: captain.email },
    });
  } catch (error) {
    next(error);
  }
};

/* ================= REGISTER CAPTAIN ================= */
const registerCaptain = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { fullname, email, password, vehicle } = req.body;

    if (email && typeof email === "string") {
      email = email.toLowerCase().trim();
    }

    const existingCaptain = await captainModel.findOne({ email });
    if (existingCaptain) {
      return res.status(400).json({ message: "Captain already exists" });
    }

    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await createCaptain({
      fullname,
      email,
      password: hashedPassword,
      vehicle,
    });

    const token = captain.generateAuthToken();

    const safeCaptain = captain.toObject();
    delete safeCaptain.password;

    res.status(201).json({ token, captain: safeCaptain });
  } catch (err) {
    next(err);
  }
};

/* ================= LOGIN CAPTAIN ================= */
const loginCaptain = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { email, password } = req.body;

    if (email && typeof email === "string") {
      email = email.toLowerCase().trim();
    }

    const captain = await captainModel.findOne({ email }).select("+password");
    if (!captain) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await captain.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = captain.generateAuthToken();
    res.cookie("token", token);

    const safeCaptain = captain.toObject();
    delete safeCaptain.password;

    res.status(200).json({ token, captain: safeCaptain });
  } catch (error) {
    next(error);
  }
};

/* ================= GET PROFILE ================= */
const getCaptainProfile = async (req, res, next) => {
  res.status(200).json({ captain: req.captain });
};

/* ================= LOGOUT ================= */
const logoutCaptain = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (token) {
      await blacklistTokenModel.create({ token });
    }

    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};

/* ================= TOGGLE ONLINE STATUS ================= */
const toggleOnlineStatus = async (req, res, next) => {
  try {
    const captainId = req.captain._id;
    let captain = await captainModel.findById(captainId);

    if (!captain) {
      return res.status(404).json({ message: "Captain not found" });
    }

    const { isOnline: targetOnline } = req.body;
    const newOnlineState = targetOnline !== undefined ? Boolean(targetOnline) : !captain.isOnline;

    if (!newOnlineState) {
      const activeRide = await rideModel.findOne({
        captain: captainId,
        status: { $in: ["accepted", "ongoing", "arrived"] },
      });

      if (activeRide) {
        return res.status(400).json({
          message: "Cannot go offline while you have an active ride in progress.",
          activeRide,
        });
      }
    }

    if (newOnlineState) {
      let activeSession = null;
      if (captain.activeSession) {
        activeSession = await captainSessionModel.findById(captain.activeSession);
      }

      if (!activeSession || activeSession.status !== "active") {
        activeSession = await captainSessionModel.create({
          captain: captainId,
          startedAt: new Date(),
          status: "active",
        });
      }

      captain.isOnline = true;
      captain.status = "active";
      captain.activeSession = activeSession._id;
      await captain.save();

      return res.status(200).json({
        success: true,
        isOnline: true,
        message: "You are now ONLINE and ready to accept rides",
        captain: {
          _id: captain._id,
          fullname: captain.fullname,
          email: captain.email,
          status: captain.status,
          isOnline: true,
        },
      });
    } else {
      let sessionDurationMinutes = 0;

      if (captain.activeSession) {
        const session = await captainSessionModel.findById(captain.activeSession);
        if (session && session.status === "active") {
          const endedAt = new Date();
          const diffMs = endedAt.getTime() - new Date(session.startedAt).getTime();
          sessionDurationMinutes = Math.max(1, Math.round(diffMs / 60000));
          session.endedAt = endedAt;
          session.durationMinutes = sessionDurationMinutes;
          session.status = "ended";
          await session.save();
        }
      } else {
        const openSession = await captainSessionModel.findOne({
          captain: captainId,
          status: "active",
        });
        if (openSession) {
          const endedAt = new Date();
          const diffMs = endedAt.getTime() - new Date(openSession.startedAt).getTime();
          sessionDurationMinutes = Math.max(1, Math.round(diffMs / 60000));
          openSession.endedAt = endedAt;
          openSession.durationMinutes = sessionDurationMinutes;
          openSession.status = "ended";
          await openSession.save();
        }
      }

      captain.isOnline = false;
      captain.status = "inactive";
      captain.activeSession = null;
      await captain.save();

      return res.status(200).json({
        success: true,
        isOnline: false,
        message: "You are now OFFLINE",
        sessionDurationMinutes,
        captain: {
          _id: captain._id,
          fullname: captain.fullname,
          email: captain.email,
          status: captain.status,
          isOnline: false,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

/* ================= GET CAPTAIN DASHBOARD DATA ================= */
const getCaptainDashboard = async (req, res, next) => {
  try {
    const captainId = req.captain._id;
    const timeframe = req.query.timeframe || "today";

    const captain = await captainModel.findById(captainId).select("-password");
    if (!captain) {
      return res.status(404).json({ message: "Captain not found" });
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const yesterdayEnd = new Date(todayEnd);
    yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);

    const todayRides = await rideModel.find({
      captain: captainId,
      status: "completed",
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });

    const earningsToday = todayRides.reduce((acc, r) => acc + (r.fare || 0), 0);
    const tripsToday = todayRides.length;
    const distanceToday = todayRides.reduce((acc, r) => acc + (r.distance || 5), 0);

    const yesterdayRides = await rideModel.find({
      captain: captainId,
      status: "completed",
      createdAt: { $gte: yesterdayStart, $lte: yesterdayEnd },
    });

    const earningsYesterday = yesterdayRides.reduce((acc, r) => acc + (r.fare || 0), 0);
    let trendPercentage = null;
    if (earningsYesterday > 0) {
      trendPercentage = +(((earningsToday - earningsYesterday) / earningsYesterday) * 100).toFixed(1);
    }

    const todaySessions = await captainSessionModel.find({
      captain: captainId,
      startedAt: { $gte: todayStart },
    });

    let totalOnlineMinutesToday = 0;
    todaySessions.forEach((s) => {
      if (s.status === "active") {
        const currentDiffMs = now.getTime() - new Date(s.startedAt).getTime();
        totalOnlineMinutesToday += currentDiffMs / 60000;
      } else {
        totalOnlineMinutesToday += s.durationMinutes || 0;
      }
    });

    const onlineHoursToday = +(totalOnlineMinutesToday / 60).toFixed(1);

    const recentTrips = await rideModel
      .find({ captain: captainId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("user", "fullname email phone");

    const activeRide = await rideModel
      .findOne({
        captain: captainId,
        status: { $in: ["accepted", "ongoing", "arrived"] },
      })
      .populate("user", "fullname email phone");

    let chartData = [];
    let hasData = false;

    if (timeframe === "today") {
      const slots = [
        { label: "12 AM", start: 0, end: 4 },
        { label: "4 AM", start: 4, end: 8 },
        { label: "8 AM", start: 8, end: 12 },
        { label: "12 PM", start: 12, end: 16 },
        { label: "4 PM", start: 16, end: 20 },
        { label: "8 PM", start: 20, end: 24 },
      ];

      chartData = slots.map((slot) => {
        const slotRides = todayRides.filter((r) => {
          const hour = new Date(r.createdAt).getHours();
          return hour >= slot.start && hour < slot.end;
        });

        const slotEarnings = slotRides.reduce((acc, r) => acc + (r.fare || 0), 0);
        if (slotEarnings > 0) hasData = true;

        return {
          label: slot.label,
          earnings: slotEarnings,
          trips: slotRides.length,
        };
      });

    } else if (timeframe === "week") {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const startOfWeek = new Date(todayStart);
      startOfWeek.setDate(startOfWeek.getDate() - 6);

      const weekRides = await rideModel.find({
        captain: captainId,
        status: "completed",
        createdAt: { $gte: startOfWeek, $lte: todayEnd },
      });

      chartData = Array.from({ length: 7 }).map((_, idx) => {
        const d = new Date(startOfWeek);
        d.setDate(d.getDate() + idx);

        const dRides = weekRides.filter((r) => {
          const rDate = new Date(r.createdAt);
          return (
            rDate.getFullYear() === d.getFullYear() &&
            rDate.getMonth() === d.getMonth() &&
            rDate.getDate() === d.getDate()
          );
        });

        const dEarnings = dRides.reduce((acc, r) => acc + (r.fare || 0), 0);
        if (dEarnings > 0) hasData = true;

        return {
          label: days[d.getDay()],
          earnings: dEarnings,
          trips: dRides.length,
        };
      });

    } else if (timeframe === "month") {
      const startOfMonth = new Date(todayStart);
      startOfMonth.setDate(startOfMonth.getDate() - 29);

      const monthRides = await rideModel.find({
        captain: captainId,
        status: "completed",
        createdAt: { $gte: startOfMonth, $lte: todayEnd },
      });

      chartData = [1, 2, 3, 4].map((wk) => {
        const wkStart = new Date(startOfMonth);
        wkStart.setDate(wkStart.getDate() + (wk - 1) * 7);
        const wkEnd = new Date(wkStart);
        wkEnd.setDate(wkEnd.getDate() + 7);

        const wkRides = monthRides.filter((r) => {
          const rDate = new Date(r.createdAt);
          return rDate >= wkStart && rDate < wkEnd;
        });

        const wkEarnings = wkRides.reduce((acc, r) => acc + (r.fare || 0), 0);
        if (wkEarnings > 0) hasData = true;

        return {
          label: `Week ${wk}`,
          earnings: wkEarnings,
          trips: wkRides.length,
        };
      });
    }

    return res.status(200).json({
      success: true,
      captain: {
        _id: captain._id,
        fullname: captain.fullname,
        email: captain.email,
        vehicle: captain.vehicle,
        photo: captain.photo,
        rating: captain.rating || 4.8,
        totalRides: captain.totalRides || 0,
        status: captain.status,
        isOnline: Boolean(captain.isOnline),
      },
      isOnline: Boolean(captain.isOnline),
      today: {
        earnings: earningsToday,
        trips: tripsToday,
        distance: distanceToday,
        onlineHours: onlineHoursToday,
      },
      yesterday: {
        earnings: earningsYesterday,
        trendPercentage,
      },
      analytics: {
        timeframe,
        hasData,
        chartData,
      },
      recentTrips,
      activeRide,
      demandInsights: {
        available: false,
        message: "Demand insights coming soon",
      },
    });

  } catch (error) {
    next(error);
  }
};

/* ================= EXPORTS ================= */
export default {
  registerCaptain,
  loginCaptain,
  getCaptainProfile,
  logoutCaptain,
  debugCaptain,
  toggleOnlineStatus,
  getCaptainDashboard,
};
