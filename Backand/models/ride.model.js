import mongoose from "mongoose";

const rideSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Captain", // ⭐ MUST MATCH MODEL NAME
  },

  pickup: {
    type: String,
    required: true,
  },

  destination: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "ongoing", "completed", "cancelled"],
    default: "pending",
  },

  fare: {
    type: Number,
    required: true,
  },

  distance: Number,

  paymentID: String,

  orderID: String,

  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null,
  },

  otp: {
    type: String,
    select: false,
    required: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Ride", rideSchema);
