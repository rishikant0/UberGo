import express from "express";
import { authUser } from "../middlewares/auth.middleware.js";

import {
  getCoordinates,
  getDistanceTimeController,
  getAutoCompleteSuggestionsController
} from "../controllers/maps.controller.js";

const router = express.Router();

/* -----------------------------
   ROUTES
------------------------------*/

router.get("/get-coordinates", authUser, getCoordinates);

router.get("/get-distance-time", authUser, getDistanceTimeController);

router.get("/get-suggestions", authUser, getAutoCompleteSuggestionsController);

export default router;
