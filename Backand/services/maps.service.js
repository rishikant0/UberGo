import axios from "axios";
import CaptainModel from "../models/captain.model.js";

const GEOAPIFY_BASE = "https://api.geoapify.com/v1";
const API_KEY = process.env.GEOAPIFY_API_KEY;

/* =========================
   GEOCODING (Address → Lat/Lng)
========================= */
const getAddressCoordinate = async (address) => {
  if (!address) throw new Error("Address is required");

  const response = await axios.get(`${GEOAPIFY_BASE}/geocode/search`, {
    params: {
      text: address,
      apiKey: API_KEY,
    },
  });

  if (!response.data.features.length) {
    throw new Error("Unable to fetch coordinates");
  }

  const [lng, lat] = response.data.features[0].geometry.coordinates;
  return { lat, lng };
};

/* =========================
   ROUTING (Distance + Time)
========================= */
const getDistanceTime = async (start, end) => {
  if (!start || !end) {
    throw new Error("Start and end locations are required");
  }
  if (!API_KEY) throw new Error("Geoapify API key not configured");

  try {
    const response = await axios.get(`${GEOAPIFY_BASE}/routing`, {
      params: {
        waypoints: `${start.lat},${start.lng}|${end.lat},${end.lng}`,
        mode: "drive",
        apiKey: API_KEY,
      },
    });

    const route = response.data.features[0].properties;

    console.log(`[maps.service] routing distance ${route.distance}m, time ${route.time}s`);

    return {
      distanceMeters: route.distance,
      distanceKm: +(route.distance / 1000).toFixed(2),
      durationSeconds: route.time,
      durationMinutes: Math.ceil(route.time / 60),
    };
  } catch (err) {
    console.error("[maps.service] routing error:", err?.response?.data || err.message || err);
    throw new Error("Error calculating distance/time");
  }
};

/* =========================
   AUTOCOMPLETE SEARCH
========================= */
const getAutoCompleteSuggestions = async (input) => {
  if (!input) throw new Error("Input is required");
  if (!API_KEY) throw new Error("Geoapify API key not configured");

  try {
    let response = await axios.get(`${GEOAPIFY_BASE}/geocode/autocomplete`, {
      params: {
        text: input,
        limit: 5,
        apiKey: API_KEY,
      },
    });

    // Fallback to the search endpoint if autocomplete returns nothing
    if (!response?.data?.features?.length) {
      response = await axios.get(`${GEOAPIFY_BASE}/geocode/search`, {
        params: { text: input, limit: 5, apiKey: API_KEY },
      });
    }

    const features = response?.data?.features || [];

    console.log(`[maps.service] geocode returned ${features.length} features for input "${input}"`);

    return features
      .map((feature) => feature.properties?.formatted)
      .filter(Boolean);
  } catch (err) {
    console.error("[maps.service] AutoComplete error:", err?.response?.data || err.message || err);
    throw new Error("Error fetching suggestions");
  }
};

/* =========================
   NEARBY CAPTAINS (MongoDB)
========================= */
const getCaptainsInTheRadius = async (latitude, longitude, radiusInKm) => {
  // Use $nearSphere with GeoJSON Point and meters distance
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

export {
  getAddressCoordinate,
  getDistanceTime,
  getAutoCompleteSuggestions,
  getCaptainsInTheRadius,
};
