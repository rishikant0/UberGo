import rideService from "../services/ride.service.js";
import { validationResult } from "express-validator";
import {
  getAddressCoordinate,
  getCaptainsInTheRadius,
} from "../services/maps.service.js";
import { sendMessageToSocketId } from "../socket.js";

import rideModel from "../models/ride.model.js";
import CaptainModel from "../models/captain.model.js";

/* =========================
   CREATE RIDE
========================= */
const createRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination, vehicleType } = req.body;

  try {
    const ride = await rideService.createRide({
      user: req.user._id,
      pickup,
      destination,
      vehicleType,
    });

    const pickupCoordinates = await getAddressCoordinate(pickup);

    const captainsInRadius = await getCaptainsInTheRadius(
      pickupCoordinates.lat,
      pickupCoordinates.lng,
      5
    );

    // Hide OTP from captains
    ride.otp = "";

    const rideWithUser = await rideModel
      .findById(ride._id)
      .populate("user");

    captainsInRadius.forEach((captain) => {
      if (captain.socketId) {
        sendMessageToSocketId(captain.socketId, {
          event: "new-ride",
          data: rideWithUser,
        });
      }
    });

    return res.status(201).json({
      success: true,
      ride,
    });

  } catch (err) {
    console.error("Create ride error:", err.message);
    return res.status(500).json({ message: err.message });
  }
};


/* =========================
   GET FARE
========================= */
const getFare = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination } = req.query;

  try {
    const fare = await rideService.getFare(pickup, destination);

    return res.status(200).json({
      success: true,
      fare,
    });

  } catch (err) {
    console.error("Fare error:", err.message);
    return res.status(500).json({ message: err.message });
  }
};


/* =========================
   CONFIRM RIDE (CAPTAIN ACCEPTS)
========================= */
const confirmRide = async (req, res) => {
  const { rideId } = req.body;

  try {
    let ride = await rideService.confirmRide({
      rideId,
      captain: req.captain,
    });

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    ride = await rideModel
      .findById(ride._id)
      .populate("user")
      .populate("captain")
      .select("+otp");

    // Notify USER that driver accepted
    if (ride.user?.socketId) {
      sendMessageToSocketId(ride.user.socketId, {
        event: "ride-confirmed",
        data: ride,
      });
    }

    return res.status(200).json({
      success: true,
      ride,
    });

  } catch (err) {
    console.error("Confirm ride error:", err.message);
    return res.status(500).json({ message: err.message });
  }
};


/* =========================
   DRIVER ARRIVED AT PICKUP
========================= */
const arrivedAtPickup = async (req, res) => {
  const { rideId } = req.body;

  try {
    const ride = await rideModel
      .findByIdAndUpdate(
        rideId,
        { status: "arrived" },
        { new: true }
      )
      .populate("user")
      .populate("captain");

    if (ride.user?.socketId) {
      sendMessageToSocketId(ride.user.socketId, {
        event: "driver-arrived",
        data: ride,
      });
    }

    res.status(200).json(ride);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* =========================
   ⭐ START RIDE — VERIFY OTP
========================= */
const startRide = async (req, res) => {
  const { rideId, otp } = req.body;

  try {
    let ride = await rideModel
      .findById(rideId)
      .select("+otp")
      .populate("user")
      .populate("captain");

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // OTP verification
    if (String(ride.otp) !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Update status
    ride.status = "ongoing";
    await ride.save();

    /* ========= NOTIFY USER ========= */
    if (ride.user?.socketId) {
      sendMessageToSocketId(ride.user.socketId, {
        event: "ride-started",
        data: ride,
      });
    }

    /* ========= ⭐ NOTIFY CAPTAIN ========= */
    if (ride.captain?.socketId) {
      sendMessageToSocketId(ride.captain.socketId, {
        event: "ride-started",
        data: ride,
      });
    }

    return res.status(200).json({
      success: true,
      ride,
    });

  } catch (err) {
    console.error("Start ride error:", err.message);
    return res.status(500).json({ message: err.message });
  }
};


/* =========================
   COMPLETE RIDE
========================= */
const completeRide = async (req, res) => {
  const { rideId } = req.body;

  try {
    const ride = await rideModel
      .findByIdAndUpdate(
        rideId,
        { status: "completed" },
        { new: true }
      )
      .populate("user")
      .populate("captain");

    if (ride.user?.socketId) {
      sendMessageToSocketId(ride.user.socketId, {
        event: "ride-completed",
        data: ride,
      });
    }

    if (ride.captain?.socketId) {
      sendMessageToSocketId(ride.captain.socketId, {
        event: "ride-completed",
        data: ride,
      });
    }

    res.status(200).json(ride);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* =========================
   EXPORT
========================= */
export default {
  createRide,
  getFare,
  confirmRide,
  arrivedAtPickup,
  startRide,
  completeRide,
};
