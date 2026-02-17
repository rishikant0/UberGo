import axios from "axios";
import CaptainModel from "../models/captain.model.js";

const GEOAPIFY_BASE = "https://api.geoapify.com/v1";

/* =========================
   1️⃣ Address → Coordinates
========================= */
export const getAddressCoordinate = async (address) => {
  const API_KEY = process.env.GEOAPIFY_API_KEY;

  if (!address) throw new Error("Address is required");
  if (!API_KEY) throw new Error("Geoapify API key not configured");

  const response = await axios.get(`${GEOAPIFY_BASE}/geocode/search`, {
    params: { text: address, apiKey: API_KEY },
  });

  if (!response.data.features.length) {
    throw new Error("Unable to fetch coordinates");
  }

  const [lng, lat] = response.data.features[0].geometry.coordinates;

  return { lat, lng };
};


/* =========================
   2️⃣ Distance + Time
========================= */
export const getDistanceTime = async (
  originLat,
  originLng,
  destLat,
  destLng
) => {
  const API_KEY = process.env.GEOAPIFY_API_KEY;

  if (!API_KEY) throw new Error("Geoapify API key not configured");

  const response = await axios.get(`${GEOAPIFY_BASE}/routing`, {
    params: {
      waypoints: `${originLat},${originLng}|${destLat},${destLng}`,
      mode: "drive",
      apiKey: API_KEY,
    },
  });

  const route = response.data.features[0].properties;

  return {
    distanceKm: +(route.distance / 1000).toFixed(2),
    durationMinutes: Math.ceil(route.time / 60),
  };
};


/* =========================
   3️⃣ Autocomplete
========================= */
export const getAutoCompleteSuggestions = async (input) => {
  const API_KEY = process.env.GEOAPIFY_API_KEY;

  if (!input) throw new Error("Input is required");
  if (!API_KEY) throw new Error("Geoapify API key not configured");

  const response = await axios.get(
    `${GEOAPIFY_BASE}/geocode/autocomplete`,
    {
      params: {
        text: input,
        limit: 5,
        apiKey: API_KEY,
      },
    }
  );

  const features = response.data.features || [];

  return features.map((item) => ({
    description: item.properties.formatted,
    lat: item.properties.lat,
    lng: item.properties.lon,
  }));
};


/* =========================
   4️⃣ Nearby Captains
========================= */
export const getCaptainsInTheRadius = async (
  latitude,
  longitude,
  radiusInKm
) => {
  const maxDistanceMeters = radiusInKm * 1000;

  return CaptainModel.find({
    location: {
      $nearSphere: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        $maxDistance: maxDistanceMeters,
      },
    },
  });
};
