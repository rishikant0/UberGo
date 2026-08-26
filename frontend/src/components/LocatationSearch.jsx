import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapPin, Search, Flag, Compass } from "lucide-react";

const LocatationSearch = ({
  pickup,
  destination,
  onSelectLocation,
  activeField,
  setPanelOpen,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let inputVal = "";

    if (activeField === "pickup") {
      inputVal = typeof pickup === "object" ? pickup?.address || "" : pickup || "";
    } else if (activeField === "destination") {
      inputVal = typeof destination === "object" ? destination?.address || "" : destination || "";
    }

    if (!inputVal || inputVal.trim().length < 2) {
      setSuggestions([]);
      setErrorMsg(null);
      return;
    }

    const token = localStorage.getItem("token");

    const fetchSuggestions = async () => {
      setLoading(true);
      setErrorMsg(null);

      try {
        const options = {
          params: { input: inputVal.trim() },
        };

        if (token) {
          options.headers = { Authorization: `Bearer ${token}` };
        }

        const res = await axios.get(
          `${import.meta.env.VITE_URL}/maps/get-suggestions`,
          options
        );

        const data = Array.isArray(res.data) ? res.data : [];
        setSuggestions(data);
      } catch (err) {
        console.error("Suggestion error:", err?.response?.data || err.message);
        setErrorMsg("Unable to fetch suggestions. Please check network.");
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [pickup, destination, activeField]);

  const handleSelect = (item) => {
    const locObj = {
      address: typeof item === "string" ? item : item.description,
      lat: typeof item === "object" && item.lat ? item.lat : 23.3441,
      lng: typeof item === "object" && item.lng ? item.lng : 85.3096,
    };

    onSelectLocation(activeField, locObj);
    setSuggestions([]);
    if (setPanelOpen) setPanelOpen(true);
  };

  if (!activeField) return null;

  return (
    <div className="bg-white max-h-72 overflow-y-auto rounded-2xl shadow-xl text-slate-900 border border-slate-200 mt-2.5 divide-y divide-slate-100 z-40">
      
      {/* LOADING STATE */}
      {loading && (
        <div className="flex items-center justify-center gap-2.5 py-4 px-4 text-xs font-bold text-slate-600">
          <Search className="w-4 h-4 text-indigo-600 animate-spin" />
          <span>Searching addresses for "{activeField}"...</span>
        </div>
      )}

      {/* ERROR STATE */}
      {errorMsg && !loading && (
        <div className="p-3.5 text-center text-xs font-semibold text-rose-600 bg-rose-50">
          {errorMsg}
        </div>
      )}

      {/* SUGGESTIONS LIST */}
      {!loading &&
        suggestions.map((item, index) => {
          const mainTitle = typeof item === "string" ? item : item.description;
          const subtitle = item.city ? item.city : "Tap to set as location";

          return (
            <div
              key={index}
              onClick={() => handleSelect(item)}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-100/90 active:bg-slate-200 transition-colors group"
            >
              <div className="w-8.5 h-8.5 flex items-center justify-center rounded-xl bg-slate-100 text-slate-700 shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                {activeField === "pickup" ? (
                  <MapPin className="w-4 h-4 text-emerald-600 group-hover:text-emerald-400" />
                ) : (
                  <Flag className="w-4 h-4 text-rose-600 group-hover:text-rose-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate leading-snug">
                  {mainTitle}
                </p>
                <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">
                  {subtitle}
                </p>
              </div>
            </div>
          );
        })}

      {/* EMPTY INITIAL GUIDANCE */}
      {!loading && suggestions.length === 0 && !errorMsg && (
        <div className="p-4 text-center text-xs text-slate-600 font-medium space-y-1">
          <p className="font-extrabold text-slate-800">
            {activeField === "pickup"
              ? "📍 Type to search pickup location"
              : "🏁 Type to search destination address"}
          </p>
          <p className="text-[11px] text-slate-500">
            Try typing "RIMS", "Joda Talab", "Airport", or "Ranchi"
          </p>
        </div>
      )}
    </div>
  );
};

export default LocatationSearch;
