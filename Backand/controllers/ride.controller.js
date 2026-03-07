import rideService from "../services/ride.service.js";
import { validationResult } from "express-validator";
import {
  getAddressCoordinate,
  getCaptainsInTheRadius,
} from "../services/maps.service.js";
import { sendMessageToSocketId, sendMessageToUserId } from "../socket.js";

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
    console.log("📢 Notifying user of confirmation:", ride.user._id);
    if (ride.user?._id) {
      sendMessageToUserId(ride.user._id, {
        event: "ride-confirmed",
        data: ride,
      });
    } else if (ride.user?.socketId) {
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

    console.log("📢 Notifying user of arrival:", ride.user._id);
    if (ride.user?._id) {
      sendMessageToUserId(ride.user._id, {
        event: "driver-arrived",
        data: ride,
      });
    } else if (ride.user?.socketId) {
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

    // clear the OTP so it isn’t sent back to client anymore
    ride.otp = "";

    // Update status
    ride.status = "ongoing";
    await ride.save();

    /* ========= NOTIFY USER ========= */
    console.log("📢 Notifying user:", ride.user._id);
    if (ride.user?._id) {
      sendMessageToUserId(ride.user._id, {
        event: "ride-started",
        data: ride,
      });
    } else if (ride.user?.socketId) {
      sendMessageToSocketId(ride.user.socketId, {
        event: "ride-started",
        data: ride,
      });
    }

    /* ========= ⭐ NOTIFY CAPTAIN ========= */
    console.log("📢 Notifying captain:", ride.captain._id);
    if (ride.captain?._id) {
      sendMessageToUserId(ride.captain._id, {
        event: "ride-started",
        data: ride,
      });
    } else if (ride.captain?.socketId) {
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

    console.log("📢 Notifying user of completion:", ride.user._id);
    if (ride.user?._id) {
      sendMessageToUserId(ride.user._id, {
        event: "ride-completed",
        data: ride,
      });
    } else if (ride.user?.socketId) {
      sendMessageToSocketId(ride.user.socketId, {
        event: "ride-completed",
        data: ride,
      });
    }

    console.log("📢 Notifying captain of completion:", ride.captain._id);
    if (ride.captain?._id) {
      sendMessageToUserId(ride.captain._id, {
        event: "ride-completed",
        data: ride,
      });
    } else if (ride.captain?.socketId) {
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
   PROCESS PAYMENT
========================= */
const processPayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId, paymentMethod } = req.body;

  try {
    const ride = await rideModel.findByIdAndUpdate(
      rideId,
      {
        paymentMethod: paymentMethod,
        status: "completed",
      },
      { new: true }
    )
      .populate("user")
      .populate("captain");

    // Notify user of payment completion
    if (ride.user?._id) {
      sendMessageToUserId(ride.user._id, {
        event: "payment-completed",
        data: ride,
      });
    }

    // Notify captain of payment completion
    if (ride.captain?._id) {
      sendMessageToUserId(ride.captain._id, {
        event: "payment-completed",
        data: ride,
      });
    }

    res.status(200).json({ message: "Payment processed successfully", ride });

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
  processPayment,
  completeRide,
};
