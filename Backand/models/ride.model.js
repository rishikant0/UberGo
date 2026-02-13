import mongoose from "mongoose";

const rideSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Captain",
    required: false,
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
  distance: {
    type: Number,
  },
  paymentID: {
    type: String,
  },
  orderID: {
    type: String,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null,
  },
  otp: {
    type: String,
    select: false,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});



export default mongoose.model("Ride", rideSchema);
