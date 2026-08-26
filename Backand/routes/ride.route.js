import express from "express";
import { body, query } from "express-validator";
import rideController from "../controllers/ride.controller.js";
import { authUser, authCaptain, authUserOrCaptain } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* =========================
   USER — CREATE RIDE
========================= */
router.post(
  "/create",
  authUser,
  body("pickup")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid pickup address"),
  body("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid destination address"),
  body("vehicleType")
    .isIn(["auto", "car", "motorcycle", "bike", "van"])
    .withMessage("Invalid vehicle type"),
  rideController.createRide
);

/* =========================
   USER — GET FARE
========================= */
router.get(
  "/get-fare",
  authUser,
  query("pickup")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid pickup address"),
  query("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid destination address"),
  rideController.getFare
);

/* =========================
   ACTIVE RIDE RECOVERY & CANCEL
========================= */
router.get("/active-user", authUser, rideController.getActiveUserRide);
router.get("/active-captain", authCaptain, rideController.getActiveCaptainRide);
router.post("/cancel", authUserOrCaptain, rideController.cancelRide);

/* =========================
   CHAT MESSAGES
========================= */
router.get("/:rideId/messages", rideController.getRideMessages);
router.post("/:rideId/messages", rideController.sendRideMessage);

/* =========================
   CAPTAIN — ACCEPT RIDE
========================= */
router.post(
  "/confirm",
  authCaptain,
  body("rideId")
    .isMongoId()
    .withMessage("Invalid ride ID"),
  rideController.confirmRide
);

/* =========================
   CAPTAIN — ARRIVED AT PICKUP
========================= */
router.post(
  "/arrived",
  authCaptain,
  body("rideId")
    .isMongoId()
    .withMessage("Invalid ride ID"),
  rideController.arrivedAtPickup
);

/* =========================
   CAPTAIN — START RIDE (OTP VERIFY)
========================= */
router.post(
  "/start",
  authCaptain,
  body("rideId")
    .isMongoId()
    .withMessage("Invalid ride ID"),
  body("otp")
    .isLength({ min: 4, max: 4 })
    .withMessage("Invalid OTP"),
  rideController.startRide
);

/* =========================
   USER — PROCESS PAYMENT
========================= */
router.post(
  "/process-payment",
  body("rideId")
    .isMongoId()
    .withMessage("Invalid ride ID"),
  body("paymentMethod")
    .isString()
    .withMessage("Invalid payment method"),
  rideController.processPayment
);

/* =========================
   CAPTAIN — COMPLETE RIDE
========================= */
router.post(
  "/complete",
  authCaptain,
  body("rideId")
    .isMongoId()
    .withMessage("Invalid ride ID"),
  rideController.completeRide
);

export default router;
