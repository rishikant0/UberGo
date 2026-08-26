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

  vehicleType: {
    type: String,
    enum: ["car", "bike", "motorcycle", "auto", "van"],
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "arrived", "ongoing", "completed", "cancelled"],
    default: "pending",
  },

  fare: {
    type: Number,
    required: true,
  },

  distance: Number,

  duration: Number,

  paymentMethod: {
    type: String,
    enum: ["cash", "qr", "upi", "card", null],
    default: null,
  },

  paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },

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

  cancelledBy: {
    type: String,
    enum: ["user", "captain", null],
    default: null,
  },

  cancelReason: {
    type: String,
    default: null,
  },

  cancelledAt: {
    type: Date,
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Ride", rideSchema);
