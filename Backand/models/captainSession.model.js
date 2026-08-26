import mongoose from "mongoose";

const captainSessionSchema = new mongoose.Schema(
  {
    captain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Captain",
      required: true,
      index: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    endedAt: {
      type: Date,
      default: null,
    },
    durationMinutes: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "ended"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("CaptainSession", captainSessionSchema);
