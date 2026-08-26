import express from "express";
import { body } from "express-validator";
import captainController from "../controllers/captain.controller.js";
import { authCaptain } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid email"),

    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 characters"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),

    body("vehicle.type")
      .isIn(["car", "bike", "auto", "van"])
      .withMessage("Invalid vehicle type"),

    body("vehicle.color")
      .notEmpty()
      .withMessage("Vehicle color is required"),

    body("vehicle.plateNumber")
      .notEmpty()
      .withMessage("Vehicle plate number is required")
      .isLength({ min: 6 })
      .withMessage("Invalid plate number"),

    body("vehicle.capacity")
      .isInt({ min: 1, max: 8 })
      .withMessage("Vehicle capacity must be between 1 and 8"),
  ],
  captainController.registerCaptain
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  captainController.loginCaptain
);

// Debug route (dev only): check if a captain exists by email
router.get("/debug/:email", captainController.debugCaptain);

router.get(
  "/profile",
  authCaptain,
  captainController.getCaptainProfile
);

router.get(
  "/dashboard",
  authCaptain,
  captainController.getCaptainDashboard
);

router.post(
  "/toggle-online",
  authCaptain,
  captainController.toggleOnlineStatus
);

router.get(
  "/logout",
  authCaptain,
  captainController.logoutCaptain
);

export default router;
