import { getAddressCoordinate, getDistanceTime as getDistanceTimeService, getAutoCompleteSuggestions as getAutoCompleteSuggestionsService } from "../services/maps.service.js";
import { validationResult } from "express-validator";

const getCoordinates = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { address } = req.query; // ✅ query, not body

  try {
    const coordinates = await getAddressCoordinate(address);

    return res.status(200).json({
      success: true,
      coordinates,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getDistanceTime = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { origin, destination } = req.query;

    const distanceTime = await getDistanceTimeService(origin, destination);

    res.status(200).json(distanceTime);
      }catch(err){
        console.error(err);
        res.status(500).json({message:'Internal server error'});
      }
}

const getAutoCompleteSuggestions = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { input } = req.query;

    console.log(`[maps.controller] autocomplete request input="${input}"`);

    const suggestions = await getAutoCompleteSuggestionsService(input);

    console.log(`[maps.controller] returning ${Array.isArray(suggestions) ? suggestions.length : 0} suggestions`);

    res.status(200).json(suggestions || []);
  } catch (err) {
    console.error("[maps.controller] error:", err?.message || err);
    // Return extra error details in development to help debugging
    const payload = { message: "Internal server error" };
    if (process.env.NODE_ENV !== "production") {
      payload.error = err?.message || String(err);
      payload.details = err?.response?.data || null;
    }
    res.status(500).json(payload);
  }
};



export default {
  getCoordinates,
  getDistanceTime,
  getAutoCompleteSuggestions
};
