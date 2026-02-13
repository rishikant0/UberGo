import express from "express";
import { query } from "express-validator";
import { authUser } from "../middlewares/auth.middleware.js";
import mapController from "../controllers/maps.controller.js";

const router = express.Router();

router.get(
  "/get-coordinates",
  query("address")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid address"),
  authUser,
  mapController.getCoordinates
);

router.get(
  "/get-distance-time",
  query("origin").isString().isLength({ min: 3 }),
  query("destination").isString().isLength({ min: 3 }),
  authUser,
  mapController.getDistanceTime
);

router.get(
  "/get-suggestion",
  query("input")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Input must be at least 3 characters"),
  mapController.getAutoCompleteSuggestions
);

// 🔴 THIS LINE IS CRITICAL
export default router;
