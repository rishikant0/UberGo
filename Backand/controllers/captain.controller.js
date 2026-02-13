import captainModel from "../models/captain.model.js";
import blacklistTokenModel from "../models/blacklistToken.model.js";
import { createCaptain } from "../services/captain.service.js";
import { validationResult } from "express-validator";

/* ================= DEBUG CAPTAIN LOOKUP (DEV) ================= */
const debugCaptain = async (req, res, next) => {
  try {
    let { email } = req.params;
    if (email && typeof email === "string") {
      email = email.toLowerCase().trim();
    }

    console.log("[debugCaptain] lookup for:", email);

    const captain = await captainModel.findOne({ email });
    if (!captain) {
      return res.status(200).json({ found: false });
    }

    return res.status(200).json({
      found: true,
      captain: { _id: captain._id.toString(), email: captain.email },
    });
  } catch (error) {
    next(error);
  }
};

/* ================= REGISTER CAPTAIN ================= */
const registerCaptain = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { fullname, email, password, vehicle } = req.body;

    if (email && typeof email === "string") {
      email = email.toLowerCase().trim();
    }

    const existingCaptain = await captainModel.findOne({ email });
    if (existingCaptain) {
      return res.status(400).json({ message: "Captain already exists" });
    }

    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await createCaptain({
      fullname,
      email,
      password: hashedPassword,
      vehicle,
    });

    const token = captain.generateAuthToken();

    const safeCaptain = captain.toObject();
    delete safeCaptain.password;

    res.status(201).json({ token, captain: safeCaptain });
  } catch (err) {
    next(err);
  }
};

/* ================= LOGIN CAPTAIN ================= */
const loginCaptain = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { email, password } = req.body;

    if (email && typeof email === "string") {
      email = email.toLowerCase().trim();
    }

    const captain = await captainModel.findOne({ email }).select("+password");
    if (!captain) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await captain.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = captain.generateAuthToken();
    res.cookie("token", token);

    const safeCaptain = captain.toObject();
    delete safeCaptain.password;

    res.status(200).json({ token, captain: safeCaptain });
  } catch (error) {
    next(error);
  }
};

/* ================= GET PROFILE ================= */
const getCaptainProfile = async (req, res, next) => {
  res.status(200).json({ captain: req.captain });
};

/* ================= LOGOUT ================= */
const logoutCaptain = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (token) {
      await blacklistTokenModel.create({ token });
    }

    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};

/* ================= EXPORTS ================= */
export default {
  registerCaptain,
  loginCaptain,
  getCaptainProfile,
  logoutCaptain,
  debugCaptain,
};
