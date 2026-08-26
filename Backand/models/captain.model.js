import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const captainSchema = new mongoose.Schema(
  {
    /* =====================
       GEO LOCATION
    ===================== */
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        default: [0, 0],
      },
    },

    /* =====================
       BASIC DETAILS
    ===================== */
    fullname: {
      firstname: {
        type: String,
        required: true,
        minlength: 3,
        trim: true,
      },
      lastname: {
        type: String,
        trim: true,
      },
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    socketId: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "inactive",
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    activeSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CaptainSession",
      default: null,
    },

    photo: {
      type: String,
      default: null,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4.8,
    },

    totalRides: {
      type: Number,
      default: 0,
    },

    /* =====================
       VEHICLE DETAILS
    ===================== */
    vehicle: {
      type: {
        type: String,
        enum: ["car", "bike", "auto", "van"],
        required: true,
      },

      model: {
        type: String,
        required: true,
      },

      color: String,

      plateNumber: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
      },

      capacity: {
        type: Number,
        required: true,
        min: 1,
        max: 8,
      },
    },
  },
  { timestamps: true }
);

/* =====================
   GEO INDEX
===================== */
captainSchema.index({ location: "2dsphere" });

/* =====================
   PASSWORD METHODS
===================== */
captainSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

captainSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

/* =====================
   JWT TOKEN
===================== */
captainSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, role: "captain" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

/* =====================
   AUTO CAPACITY
===================== */
captainSchema.pre("validate", function () {
  if (!this.vehicle) return;

  if (this.vehicle.type === "bike") this.vehicle.capacity = 1;
  else if (this.vehicle.type === "auto") this.vehicle.capacity = 3;
});

const Captain = mongoose.model("Captain", captainSchema);

export default Captain;
