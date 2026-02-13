import rideModel from "../models/ride.model.js";
import { getDistanceTime } from "./maps.service.js";

import crypto from "crypto";

const fareRates = {
  auto: { perKm: 10, perMinute: 2, baseFare: 50 },
  car: { perKm: 15, perMinute: 3, baseFare: 75 },
  motorcycle: { perKm: 8, perMinute: 1.5, baseFare: 40 },
};

const getFare = async (pickup, destination, vehicleType = "car") => {
  if (!pickup || !destination) {
    throw new Error("Pickup and destination are required");
  }

  if (!fareRates[vehicleType]) {
    throw new Error("Invalid vehicle type");
  }

  const { distance, duration } = await getDistanceTime(
    pickup,
    destination
  );

  const rates = fareRates[vehicleType];

  const baseFare = rates.baseFare;
  const distanceFare = (distance / 1000) * rates.perKm;
  const timeFare = (duration / 60) * rates.perMinute;

  return {
    totalFare: Math.round(baseFare + distanceFare + timeFare),
  };
};

const generateOtp = (length = 4) =>
  crypto.randomInt(10 ** (length - 1), 10 ** length).toString();

const createRide = async ({ user, pickup, destination, vehicleType }) => {
  const fareData = await getFare(pickup, destination, vehicleType);

  return rideModel.create({
    user,
    pickup,
    destination,
    vehicleType,
    fare: fareData.totalFare,
    otp: generateOtp(4),
    status: "pending",
  });
};

const confirmRide = async ({rideId}) => {
  if(!rideId) {
    throw new Error("Ride ID is required");
  }

  const ride = await rideModel.findOne(rideId).populate("user");

  if (!ride) {
    throw new Error("Ride not found");
  }

  return rideModel.findByIdAndUpdate(
    rideId,
    { status: "accepted" ,
      captain:captain._id
     },
    { new: true }
  );
};
   
export default {
  createRide,
  getFare,
  confirmRide,
  
};
