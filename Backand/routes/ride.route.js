import express from "express";
import { body, query } from "express-validator";
import rideController from "../controllers/ride.controller.js";
import { authUser, authCaptain } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/create",
  authUser,
  body("pickup").isString().isLength({ min: 3 }).withMessage("Invalid pickup address"),
  body("destination").isString().isLength({ min: 3 }).withMessage("Invalid destination address"),
  body("vehicleType").isIn(["auto", "car", "motorcycle"]).withMessage("Invalid vehicle type"),
  rideController.createRide
);

router.get(
  "/get-fare",
  authUser,
  query("pickup").isString().isLength({ min: 3 }).withMessage("Invalid pickup address"),
  query("destination").isString().isLength({ min: 3 }).withMessage("Invalid destination address"),
  query("vehicleType")
    .optional()
    .isIn(["auto", "car", "motorcycle"])
    .withMessage("Invalid vehicle type"),
  rideController.getFare
);

router.post(
  "/confirm",
  authCaptain,
  body("rideId").isMongoId().withMessage("Invalid ride ID"),
  rideController.confirmRide
);

export default router;
