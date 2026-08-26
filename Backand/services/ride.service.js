import rideModel from "../models/ride.model.js";
import {
  getAddressCoordinate,
  getDistanceTime,
} from "./maps.service.js";

import crypto from "crypto";

/* =========================
   FARE CONFIGURATION
========================= */
const fareRates = {
  auto: { perKm: 10, perMinute: 2, baseFare: 50 },
  car: { perKm: 15, perMinute: 3, baseFare: 75 },
  motorcycle: { perKm: 8, perMinute: 1.5, baseFare: 40 },
};

/* =========================
   GET FARE (FOR ALL VEHICLES)
========================= */
const getFare = async (pickup, destination) => {

  if (!pickup || !destination) {
    throw new Error("Pickup and destination are required");
  }

  // 1️⃣ Address → Coordinates
  const start = await getAddressCoordinate(pickup);
  const end = await getAddressCoordinate(destination);

  // ✅ FIXED — pass numbers (NOT objects)
  const route = await getDistanceTime(
    start.lat,
    start.lng,
    end.lat,
    end.lng
  );

  // 2️⃣ Calculate fare for ALL vehicle types
  const fares = {};
  for (const [vehicleType, rates] of Object.entries(fareRates)) {
    const baseFare = rates.baseFare;
    const distanceFare = route.distanceKm * rates.perKm;
    const timeFare = route.durationMinutes * rates.perMinute;
    
    fares[vehicleType] = Math.round(baseFare + distanceFare + timeFare);
  }

  return {
    ...fares,
    distance: route.distanceKm,
    duration: route.durationMinutes,
  };
};

/* =========================
   OTP GENERATION
========================= */
const generateOtp = (length = 4) =>
  crypto.randomInt(10 ** (length - 1), 10 ** length).toString();

/* =========================
   CREATE RIDE
========================= */
const createRide = async ({ user, pickup, destination, vehicleType }) => {

  if (!vehicleType) {
    throw new Error("Vehicle type is required");
  }

  const fareData = await getFare(pickup, destination);
  const fare = fareData[vehicleType];

  return rideModel.create({
    user,
    pickup,
    destination,
    vehicleType,
    fare,
    distance: fareData.distance || 0,
    otp: generateOtp(4),
    status: "pending",
  });
};

/* =========================
   CONFIRM RIDE (CAPTAIN ACCEPTS)
========================= */
const confirmRide = async ({ rideId, captain }) => {
  if (!rideId) {
    throw new Error("Ride ID is required");
  }

  const updatedRide = await rideModel
    .findOneAndUpdate(
      { _id: rideId, status: "pending" },
      {
        status: "accepted",
        captain: captain._id,
      },
      { new: true }
    )
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!updatedRide) {
    throw new Error("Ride no longer available");
  }

  return updatedRide;
};

/* =========================
   EXPORT
========================= */
export default {
  createRide,
  getFare,
  confirmRide,
};
