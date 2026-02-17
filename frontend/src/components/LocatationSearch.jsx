import React, { useState, useEffect } from "react";
import axios from "axios";

const LocatationSearch = ({
  pickup,
  setPickup,
  destination,
  setDestination,
  activeField,
  setvehicalPanel,
  setPanelOpen,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let input = "";

    if (activeField === "pickup") input = pickup;
    if (activeField === "destination") input = destination;

    const token = localStorage.getItem("token");

    if (!input || input.length < 3) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const options = { params: { input } };

        if (token) {
          options.headers = { Authorization: `Bearer ${token}` };
        }

        const res = await axios.get(
          `${import.meta.env.VITE_URL}/maps/get-suggestions`, // ✅ FIXED
          options
        );

        const data = Array.isArray(res.data) ? res.data : [];

        setSuggestions(data);

      } catch (err) {
        console.error(
          "Suggestion error:",
          err?.response?.data || err.message || err
        );
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);

    return () => clearTimeout(timer);
  }, [pickup, destination, activeField]);

 const handleSelect = (item) => {
  const value =
    typeof item === "string" ? item : item.description;

  if (activeField === "pickup") {
    // Set pickup only
    setPickup(value);

    // Keep search panel open for destination
    setPanelOpen(true);

    setSuggestions([]);
    return; // 🚀 STOP here — do NOT open vehicle panel
  }

  if (activeField === "destination") {
    // Set destination ONLY
    setDestination(value);

    // ❌ DO NOT open vehicle panel here - let findTrip() do it
    // ❌ This was causing "Calculating fare..." to show before API call
    
    setPanelOpen(true); // Keep input panel open so user can see "Confirm Locations" button
  }

  setSuggestions([]);
};


  return (
    <div className="bg-white max-h-72 overflow-y-auto rounded-t-2xl">
      {loading && (
        <p className="text-center text-sm text-gray-500 py-3">
          Searching locations…
        </p>
      )}

      {!loading &&
        suggestions.map((item, index) => (
          <div
            key={index}
            onClick={() => handleSelect(item)}
            className="flex items-center gap-4 px-5 py-3 border-b cursor-pointer hover:bg-gray-100"
          >
            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100">
              <i className="ri-map-pin-line text-gray-700"></i>
            </div>

            <span className="text-sm text-gray-900">
              {typeof item === "string"
                ? item
                : item.description}
            </span>
          </div>
        ))}

      {!loading && suggestions.length === 0 && (
        <p className="text-center text-sm text-gray-400 py-3">
          Start typing to search locations
        </p>
      )}
    </div>
  );
};

export default LocatationSearch;
