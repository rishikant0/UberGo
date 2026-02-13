import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const driverSchema = new mongoose.Schema(
  {
    // Top-level GeoJSON location for geospatial queries
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
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

      color: {
        type: String,
      },

      plateNumber: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
      },


      location : {
  longitude: {
    type:Number,
  },
  latitude: {
    type:Number,
  }
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

// Create 2dsphere index for geospatial queries
driverSchema.index({ location: "2dsphere" });



/* =====================
   PASSWORD METHODS
===================== */
driverSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

driverSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

/* =====================
   JWT TOKEN
===================== */
driverSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, role: "driver" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

/* =====================
   AUTO SET CAPACITY (SMART)
===================== */
driverSchema.pre("validate", function () {
  if (!this.vehicle) return;
  if (this.vehicle.type === "bike") this.vehicle.capacity = 1;
  else if (this.vehicle.type === "auto") this.vehicle.capacity = 3;
});

const Driver = mongoose.model("Driver", driverSchema);
export default Driver;
