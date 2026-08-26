import {
  getAddressCoordinate,
  getDistanceTime,
  getAutoCompleteSuggestions,
  reverseGeocode
} from "../services/maps.service.js";

/* =========================
   COORDINATES
========================= */
export const getCoordinates = async (req, res) => {
  try {
    const { address } = req.query;

    const coordinates = await getAddressCoordinate(address);

    res.status(200).json(coordinates);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/* =========================
   REVERSE GEOCODE
========================= */
export const reverseGeocodeController = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    const address = await reverseGeocode(lat, lng);

    res.status(200).json({ address });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/* =========================
   DISTANCE + TIME
========================= */
export const getDistanceTimeController = async (req, res) => {
  try {
    const { originLat, originLng, destLat, destLng } = req.query;

    const result = await getDistanceTime(
      { lat: Number(originLat), lng: Number(originLng) },
      { lat: Number(destLat), lng: Number(destLng) }
    );

    res.status(200).json(result);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/* =========================
   AUTOCOMPLETE
========================= */
export const getAutoCompleteSuggestionsController = async (req, res) => {
  try {
    const { input } = req.query;

    const suggestions = await getAutoCompleteSuggestions(input);

    res.status(200).json(suggestions);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
