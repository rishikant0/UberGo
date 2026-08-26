import axios from "axios";
import CaptainModel from "../models/captain.model.js";

const GEOAPIFY_BASE = "https://api.geoapify.com/v1";

/* =========================
   1️⃣ Address → Coordinates
========================= */
export const getAddressCoordinate = async (address) => {
  const API_KEY = process.env.GEOAPIFY_API_KEY;

  // Try Geoapify if API key present
  if (API_KEY) {
    try {
      const response = await axios.get(`${GEOAPIFY_BASE}/geocode/search`, {
        params: { text: address, apiKey: API_KEY },
        timeout: 4000,
      });

      if (response.data?.features?.length > 0) {
        const [lng, lat] = response.data.features[0].geometry.coordinates;
        return { lat: Number(lat), lng: Number(lng) };
      }
    } catch (err) {
      console.warn("Geoapify search failed, trying Nominatim fallback:", err.message);
    }
  }

  // OpenStreetMap Nominatim Fallback
  try {
    const res = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: address,
        format: "json",
        limit: 1,
      },
      headers: { "User-Agent": "UberCloneApp/1.0" },
      timeout: 5000,
    });

    if (res.data && res.data.length > 0) {
      return {
        lat: Number(res.data[0].lat),
        lng: Number(res.data[0].lon),
      };
    }
  } catch (err) {
    console.error("Nominatim geocode failed:", err.message);
  }

  // Default fallback center coordinates if search returns nothing (e.g., Ranchi center)
  return { lat: 23.3441, lng: 85.3096 };
};


/* =========================
   2️⃣ Distance + Time
========================= */
export const getDistanceTime = async (origin, destination) => {
  const API_KEY = process.env.GEOAPIFY_API_KEY;

  const originLat = typeof origin === "object" ? origin.lat : null;
  const originLng = typeof origin === "object" ? origin.lng : null;
  const destLat = typeof destination === "object" ? destination.lat : null;
  const destLng = typeof destination === "object" ? destination.lng : null;

  if (API_KEY && originLat && originLng && destLat && destLng) {
    try {
      const response = await axios.get(`${GEOAPIFY_BASE}/routing`, {
        params: {
          waypoints: `${originLat},${originLng}|${destLat},${destLng}`,
          mode: "drive",
          apiKey: API_KEY,
        },
        timeout: 4000,
      });

      if (response.data?.features?.length > 0) {
        const route = response.data.features[0].properties;
        return {
          distanceKm: +(route.distance / 1000).toFixed(2),
          durationMinutes: Math.ceil(route.time / 60),
        };
      }
    } catch (err) {
      console.warn("Geoapify routing failed, using mathematical haversine fallback:", err.message);
    }
  }

  // Fallback distance calculation using Haversine formula
  if (originLat && originLng && destLat && destLng) {
    const R = 6371; // Earth radius in km
    const dLat = ((destLat - originLat) * Math.PI) / 180;
    const dLon = ((destLng - originLng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((originLat * Math.PI) / 180) *
        Math.cos((destLat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = +(R * c).toFixed(2);
    const time = Math.max(5, Math.ceil(dist * 3)); // approx 3 mins per km
    return { distanceKm: Math.max(1, dist), durationMinutes: time };
  }

  return { distanceKm: 5.2, durationMinutes: 15 };
};


/* =========================
   3️⃣ Autocomplete
========================= */
export const getAutoCompleteSuggestions = async (input) => {
  if (!input || input.trim().length < 2) {
    return [];
  }

  const query = input.trim();
  const API_KEY = process.env.GEOAPIFY_API_KEY;

  // Primary Geoapify lookup if key configured
  if (API_KEY) {
    try {
      const response = await axios.get(
        `${GEOAPIFY_BASE}/geocode/autocomplete`,
        {
          params: {
            text: query,
            limit: 6,
            apiKey: API_KEY,
          },
          timeout: 4000,
        }
      );

      const features = response.data?.features || [];
      if (features.length > 0) {
        return features.map((item) => ({
          description: item.properties.formatted || item.properties.name,
          lat: Number(item.properties.lat),
          lng: Number(item.properties.lon),
          city: item.properties.city || item.properties.state || "",
        }));
      }
    } catch (err) {
      console.warn("Geoapify autocomplete failed, switching to Nominatim fallback:", err.message);
    }
  }

  // OpenStreetMap Nominatim Fallback
  try {
    const res = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: query,
        format: "json",
        addressdetails: 1,
        limit: 6,
      },
      headers: { "User-Agent": "UberCloneApp/1.0" },
      timeout: 5000,
    });

    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return res.data.map((item) => ({
        description: item.display_name,
        lat: Number(item.lat),
        lng: Number(item.lon),
        city: item.address?.city || item.address?.town || item.address?.state || "",
      }));
    }
  } catch (err) {
    console.error("Nominatim autocomplete failed:", err.message);
  }

  // Local fallback entries for common queries if internet APIs fail
  const localDb = [
    { description: "RIMS Hospital & Medical College, Ranchi", lat: 23.3855, lng: 85.3435, city: "Ranchi" },
    { description: "RIMS Main Gate, Bariatu Road, Ranchi", lat: 23.3860, lng: 85.3440, city: "Ranchi" },
    { description: "Joda Talab, Bariatu, Ranchi", lat: 23.3912, lng: 85.3498, city: "Ranchi" },
    { description: "Birsa Munda Airport, Ranchi", lat: 23.3142, lng: 85.3218, city: "Ranchi" },
    { description: "Ranchi Railway Station, Station Road", lat: 23.3512, lng: 85.3375, city: "Ranchi" },
    { description: "Nucleus Mall, Circular Road, Ranchi", lat: 23.3705, lng: 85.3262, city: "Ranchi" },
  ];

  return localDb.filter((item) =>
    item.description.toLowerCase().includes(query.toLowerCase())
  );
};


/* =========================
   4️⃣ Reverse Geocode (Lat/Lng -> Address)
========================= */
export const reverseGeocode = async (lat, lng) => {
  try {
    const res = await axios.get("https://nominatim.openstreetmap.org/reverse", {
      params: {
        lat,
        lon: lng,
        format: "json",
      },
      headers: { "User-Agent": "UberCloneApp/1.0" },
      timeout: 4000,
    });

    if (res.data && res.data.display_name) {
      return res.data.display_name;
    }
  } catch (err) {
    console.warn("Reverse geocode failed:", err.message);
  }

  return `Location (${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)})`;
};


/* =========================
   5️⃣ Nearby Captains
========================= */
export const getCaptainsInTheRadius = async (
  latitude,
  longitude,
  radiusInKm,
  vehicleType
) => {
  const maxDistanceMeters = radiusInKm * 1000;

  let normalizedVehicleType = vehicleType;
  if (vehicleType === "motorcycle") {
    normalizedVehicleType = "bike";
  }

  const onlineFilter = {
    $or: [{ isOnline: true }, { status: "active" }],
  };

  if (normalizedVehicleType) {
    onlineFilter["vehicle.type"] = normalizedVehicleType;
  }

  try {
    const captainsNear = await CaptainModel.find({
      ...onlineFilter,
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

    if (captainsNear && captainsNear.length > 0) {
      return captainsNear;
    }
  } catch (err) {
    console.warn("Geospatial query fallback:", err.message);
  }

  // Fallback for local testing: return online captains matching vehicle type
  return CaptainModel.find(onlineFilter);
};
