import rideService from "../services/ride.service.js";
import { validationResult } from "express-validator";
import {
  getAddressCoordinate,
  getCaptainsInTheRadius,
} from "../services/maps.service.js";
import { sendMessageToSocketId, sendMessageToUserId } from "../socket.js";

import rideModel from "../models/ride.model.js";
import CaptainModel from "../models/captain.model.js";
import MessageModel from "../models/message.model.js";

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
      5,
      vehicleType
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
      } else if (captain._id) {
        sendMessageToUserId(captain._id, {
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
      return res.status(404).json({ message: "Ride not found or no longer available" });
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
    return res.status(400).json({ message: err.message || "Failed to confirm ride" });
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
      .select("+otp")
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

    res.status(200).json({ success: true, ride });

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

    res.status(200).json({ success: true, ride });

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
        paymentStatus: "paid",
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

    res.status(200).json({ success: true, message: "Payment processed successfully", ride });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   ACTIVE RIDE RECOVERY
========================= */
const getActiveUserRide = async (req, res) => {
  try {
    const ride = await rideModel
      .findOne({
        user: req.user._id,
        status: { $in: ["pending", "accepted", "arrived", "ongoing"] },
      })
      .select("+otp")
      .populate("user")
      .populate("captain");

    return res.status(200).json({ success: true, ride });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getActiveCaptainRide = async (req, res) => {
  try {
    const ride = await rideModel
      .findOne({
        captain: req.captain._id,
        status: { $in: ["accepted", "arrived", "ongoing"] },
      })
      .select("+otp")
      .populate("user")
      .populate("captain");

    return res.status(200).json({ success: true, ride });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* =========================
   CHAT MESSAGES CONTROLLER
========================= */
const getRideMessages = async (req, res) => {
  const { rideId } = req.params;
  try {
    const messages = await MessageModel.find({ ride: rideId }).sort({ createdAt: 1 });
    return res.status(200).json({ success: true, messages });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const sendRideMessage = async (req, res) => {
  const { rideId } = req.params;
  const { message, receiverId, receiverModel, senderModel } = req.body;

  if (!message || !receiverId) {
    return res.status(400).json({ message: "Message content and receiverId are required" });
  }

  try {
    const senderId = req.user ? req.user._id : req.captain ? req.captain._id : null;
    const senderName = req.user
      ? `${req.user.fullname?.firstname || "User"} ${req.user.fullname?.lastname || ""}`.trim()
      : req.captain
      ? `${req.captain.fullname?.firstname || "Captain"} ${req.captain.fullname?.lastname || ""}`.trim()
      : "Sender";

    const savedMessage = await MessageModel.create({
      ride: rideId,
      sender: senderId,
      senderModel: senderModel || (req.user ? "User" : "Captain"),
      senderName,
      receiver: receiverId,
      receiverModel: receiverModel || (req.user ? "Captain" : "User"),
      message: message.trim(),
    });

    const msgPayload = {
      _id: savedMessage._id,
      rideId,
      senderId,
      senderModel: savedMessage.senderModel,
      senderName: savedMessage.senderName,
      receiverId,
      message: savedMessage.message,
      timestamp: savedMessage.createdAt,
    };

    sendMessageToUserId(receiverId, {
      event: "receive-message",
      data: msgPayload,
    });

    return res.status(201).json({ success: true, message: msgPayload });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* =========================
   CANCEL RIDE (USER OR CAPTAIN BEFORE OTP)
========================= */
const cancelRide = async (req, res) => {
  const { rideId, reason } = req.body;

  if (!rideId) {
    return res.status(400).json({ success: false, message: "Ride ID is required" });
  }

  const cancelledBy = req.user ? "user" : req.captain ? "captain" : null;
  const requesterId = req.user ? req.user._id : req.captain ? req.captain._id : null;

  if (!cancelledBy || !requesterId) {
    return res.status(401).json({ success: false, message: "Unauthorized cancellation request" });
  }

  try {
    const existingRide = await rideModel.findById(rideId).populate("user").populate("captain");

    if (!existingRide) {
      return res.status(404).json({ success: false, message: "Ride not found" });
    }

    // Verify requester belongs to this ride or created it
    const isUserOfRide = existingRide.user && String(existingRide.user._id || existingRide.user) === String(requesterId);
    const isCaptainOfRide = existingRide.captain && String(existingRide.captain._id || existingRide.captain) === String(requesterId);

    if (!isUserOfRide && !isCaptainOfRide && existingRide.status !== "pending") {
      return res.status(403).json({ success: false, message: "You are not authorized to cancel this ride" });
    }

    // STRICT RULE: REJECT CANCELLATION IF TRIP HAS STARTED (ongoing), COMPLETED, OR ALREADY CANCELLED
    if (existingRide.status === "ongoing") {
      return res.status(400).json({
        success: false,
        message: "Ride cannot be cancelled after the trip has started.",
      });
    }

    if (existingRide.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Completed rides cannot be cancelled.",
      });
    }

    if (existingRide.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Ride has already been cancelled.",
      });
    }

    // ATOMIC UPDATE: Only update if status is pending, accepted, or arrived
    const updatedRide = await rideModel
      .findOneAndUpdate(
        {
          _id: rideId,
          status: { $in: ["pending", "accepted", "arrived"] },
        },
        {
          status: "cancelled",
          cancelledBy,
          cancelReason: reason || "No reason provided",
          cancelledAt: new Date(),
        },
        { new: true }
      )
      .populate("user")
      .populate("captain");

    if (!updatedRide) {
      return res.status(400).json({
        success: false,
        message: "Ride cannot be cancelled (already started, completed, or cancelled).",
      });
    }

    const cancelPayload = {
      rideId: updatedRide._id,
      cancelledBy,
      cancelReason: updatedRide.cancelReason,
      cancelledAt: updatedRide.cancelledAt,
      ride: updatedRide,
    };

    // Broadcast real-time cancellation event to both User and Captain
    if (updatedRide.user?._id) {
      sendMessageToUserId(updatedRide.user._id, {
        event: "ride-cancelled",
        data: cancelPayload,
      });
    }

    if (updatedRide.captain?._id) {
      sendMessageToUserId(updatedRide.captain._id, {
        event: "ride-cancelled",
        data: cancelPayload,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ride cancelled successfully",
      ride: updatedRide,
    });

  } catch (err) {
    console.error("Cancel ride error:", err.message);
    return res.status(500).json({ success: false, message: err.message });
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
  getActiveUserRide,
  getActiveCaptainRide,
  getRideMessages,
  sendRideMessage,
  cancelRide,
};
