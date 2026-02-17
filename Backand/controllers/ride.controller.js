import rideService from "../services/ride.service.js";
import { validationResult } from "express-validator";
import {
  getAddressCoordinate,
  getCaptainsInTheRadius,
} from "../services/maps.service.js";
import { sendMessageToSocketId } from "../socket.js";
import rideModel from "../models/ride.model.js";


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

    // Get pickup coordinates
    const pickupCoordinates = await getAddressCoordinate(pickup);

    // Find nearby captains
    const captainsInRadius = await getCaptainsInTheRadius(
      pickupCoordinates.lat,
      pickupCoordinates.lng,
      5
    );

    // Hide OTP from captains
    ride.otp = "";

    // Populate user info
    const rideWithUser = await rideModel
      .findById(ride._id)
      .populate("user");

    // Notify captains
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
      return res.status(404).json({
        message: "Ride not found",
      });
    }

    // 🔥 IMPORTANT — populate captain & user with OTP
    ride = await rideModel
      .findById(ride._id)
      .populate("user")
      .populate("captain")
      .select("+otp"); // Include OTP in response

    console.log("Ride confirmed:", {
      rideId: ride._id,
      userSocketId: ride.user?.socketId,
      captainId: ride.captain?._id,
      status: ride.status,
      otp: ride.otp
    });

    // Notify user via socket
    if (ride.user?.socketId) {
      console.log(`Sending ride-confirmed to user ${ride.user._id} via socket ${ride.user.socketId}`);
      sendMessageToSocketId(ride.user.socketId, {
        event: "ride-confirmed",
        data: ride,
      });
    } else {
      console.warn(`User ${ride.user?._id} has no socketId. Event not sent.`);
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

    // Send OTP to user
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
   START RIDE — VERIFY OTP
========================= */
const startRide = async (req, res) => {

  const { rideId, otp } = req.body;

  try {

    let ride = await rideModel
      .findById(rideId)
      .populate("user")
      .populate("captain");

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (ride.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    ride.status = "ongoing";
    await ride.save();

    // Notify user
    if (ride.user?.socketId) {
      sendMessageToSocketId(ride.user.socketId, {
        event: "ride-started",
        data: ride,
      });
    }

    res.status(200).json({
      success: true,
      ride,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
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
