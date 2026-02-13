import rideService from "../services/ride.service.js";
import { validationResult } from "express-validator";
import {
  getAddressCoordinate,
  getCaptainsInTheRadius,
} from "../services/maps.service.js";
import { sendMessageToSocketId } from "../socket.js";
import rideModel from "../models/ride.model.js";

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

    // 1️⃣ Get pickup coordinates
    const pickupCoordinates = await getAddressCoordinate(pickup);

    console.log("Pickup Coordinates:", pickupCoordinates);

    // 2️⃣ Find captains within 5km radius
    const captainsInRadius = await getCaptainsInTheRadius(
      pickupCoordinates.lat,
      pickupCoordinates.lng,
      5
    );

    // 3️⃣ Clear OTP before sending to captains
    ride.otp = "";



    const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate("user");    
    // 4️⃣ Notify captains via socket
    captainsInRadius.forEach((captain) => {
      if (captain.socketId) {
        sendMessageToSocketId(captain.socketId, {
          event: "new-ride",
          data: rideWithUser,
        });
      }
    });

    // 5️⃣ Respond to user
    return res.status(201).json({
      success: true,
      ride,
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getFare = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination, vehicleType } = req.query;

  try {
    const fare = await rideService.calculateFare(
      pickup,
      destination,
      vehicleType
    );

    return res.status(200).json({
      success: true,
      fare,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const confirmRide = async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
   const ride = await rideService.confirmRide({rideId,captain:req.captain});

   sendMessageToSocketId(ride.user.socketId, {
    event: "ride-confirmed",
    data: ride,
   });

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Ride confirmed successfully",
      ride,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export default {
  createRide,
  getFare,
  confirmRide,
};
