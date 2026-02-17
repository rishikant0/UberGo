import {
  getAddressCoordinate,
  getDistanceTime,
  getAutoCompleteSuggestions
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
   DISTANCE + TIME
========================= */
export const getDistanceTimeController = async (req, res) => {
  try {
    const { originLat, originLng, destLat, destLng } = req.query;

    const result = await getDistanceTime(
      { lat: originLat, lng: originLng },
      { lat: destLat, lng: destLng }
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
