import express from "express";
import axios from "axios";
import { authUser } from "../middlewares/auth.middleware.js";

const router = express.Router();
const API_KEY = process.env.GEOAPIFY_API_KEY;

/* ------------------------------------------
   1️⃣ Address → Coordinates
-------------------------------------------*/
const getCoordinates = async (req, res) => {
  const { address } = req.query;

  try {
    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${API_KEY}`;

    const response = await axios.get(url);

    const location = response.data.features[0].properties;

    res.json({
      lat: location.lat,
      lng: location.lon
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to get coordinates",
      error: error.message
    });
  }
};

/* ------------------------------------------
   2️⃣ Distance & Time (Routing)
-------------------------------------------*/
const getDistanceTime = async (req, res) => {
  const { origin, destination } = req.query;

  try {
    const url = `https://api.geoapify.com/v1/routing?waypoints=${encodeURIComponent(origin)}|${encodeURIComponent(destination)}&mode=drive&apiKey=${API_KEY}`;

    const response = await axios.get(url);

    const route = response.data.features[0].properties;

    res.json({
      distance: route.distance,   // meters
      time: route.time           // seconds
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to get distance/time",
      error: error.message
    });
  }
};

/* ------------------------------------------
   3️⃣ Location Suggestions (Autocomplete)
-------------------------------------------*/
const getAutoCompleteSuggestions = async (req, res) => {
  const { input } = req.query;

  try {
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(input)}&apiKey=${API_KEY}`;

    const response = await axios.get(url);

    const suggestions = response.data.features.map(item => ({
      description: item.properties.formatted
    }));

    res.json({ suggestions });

  } catch (error) {
    res.status(500).json({
      message: "Failed to get suggestions",
      error: error.message
    });
  }
};

/* ------------------------------------------
   ROUTES
-------------------------------------------*/
router.get("/get-coordinates", authUser, getCoordinates);
router.get("/get-distance-time", authUser, getDistanceTime);
router.get("/get-suggestions", authUser, getAutoCompleteSuggestions);

export default router;
