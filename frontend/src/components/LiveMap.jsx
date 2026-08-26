import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import L from "leaflet";
import { Navigation, AlertCircle, RefreshCw, ZoomIn, ZoomOut } from "lucide-react";

// Fix standard Leaflet default marker icons in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom Icon for Captain / User GPS
const userGpsIcon = L.divIcon({
  className: "custom-user-gps-icon",
  html: `
    <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; width: 44px; height: 44px; background: rgba(59, 130, 246, 0.25); border-radius: 50%; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="position: absolute; width: 32px; height: 32px; background: #3B82F6; border: 3px solid #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
        <div style="width: 10px; height: 10px; background: #ffffff; border-radius: 50%;"></div>
      </div>
    </div>
  `,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

// Custom Pickup Icon (Emerald 📍)
const pickupIcon = L.divIcon({
  className: "custom-pickup-icon",
  html: `
    <div style="position: relative; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; width: 32px; height: 32px; background: #10B981; border: 3px solid #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(16,185,129,0.5);">
        <span style="font-size: 16px; color: #ffffff; font-weight: bold;">📍</span>
      </div>
    </div>
  `,
  iconSize: [42, 42],
  iconAnchor: [21, 21],
});

// Custom Destination Icon (Rose 🏁)
const destinationIcon = L.divIcon({
  className: "custom-dest-icon",
  html: `
    <div style="position: relative; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; width: 32px; height: 32px; background: #F43F5E; border: 3px solid #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(244,63,94,0.5);">
        <span style="font-size: 16px; color: #ffffff; font-weight: bold;">🏁</span>
      </div>
    </div>
  `,
  iconSize: [42, 42],
  iconAnchor: [21, 21],
});

// Helper component to fit map bounds when pickup/destination change
function MapBoundsFitter({ pickup, destination, center }) {
  const map = useMap();

  useEffect(() => {
    if (pickup?.lat && pickup?.lng && destination?.lat && destination?.lng) {
      const bounds = L.latLngBounds(
        [pickup.lat, pickup.lng],
        [destination.lat, destination.lng]
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    } else if (pickup?.lat && pickup?.lng) {
      map.flyTo([pickup.lat, pickup.lng], 15, { duration: 1 });
    } else if (destination?.lat && destination?.lng) {
      map.flyTo([destination.lat, destination.lng], 15, { duration: 1 });
    } else if (center && center[0] && center[1]) {
      map.flyTo(center, map.getZoom(), { duration: 1 });
    }
  }, [pickup, destination, center, map]);

  return null;
}

const LiveMap = ({
  isOnline = true,
  pickup = null,
  destination = null,
  onLocationUpdate = null,
}) => {
  // Default fallback center (Ranchi)
  const [position, setPosition] = useState([23.3441, 85.3096]);
  const [locationStatus, setLocationStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const mapRef = useRef(null);

  const fetchLocation = () => {
    setLocationStatus("loading");
    setErrorMessage("");

    if (!navigator.geolocation) {
      setLocationStatus("unavailable");
      setErrorMessage("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = [pos.coords.latitude, pos.coords.longitude];
        setPosition(newPos);
        setLocationStatus("granted");
        if (onLocationUpdate) {
          onLocationUpdate({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        }
      },
      (err) => {
        console.warn("Geolocation error:", err.message);
        setLocationStatus("denied");
        setErrorMessage("Location permission denied. Using estimated location.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const handleZoomIn = () => {
    if (mapRef.current) mapRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapRef.current) mapRef.current.zoomOut();
  };

  const hasPickupCoords = pickup && typeof pickup === "object" && pickup.lat && pickup.lng;
  const hasDestCoords = destination && typeof destination === "object" && destination.lat && destination.lng;

  return (
    <div className="relative w-full h-full min-h-[280px] bg-slate-900 overflow-hidden shadow-2xl">
      {/* Loading Overlay */}
      {locationStatus === "loading" && (
        <div className="absolute inset-0 z-20 bg-slate-900/70 backdrop-blur-sm flex flex-col items-center justify-center text-slate-300">
          <RefreshCw className="w-7 h-7 text-emerald-400 animate-spin mb-2" />
          <p className="text-xs font-semibold">Acquiring GPS position...</p>
        </div>
      )}

      {/* Control Buttons */}
      <div className="absolute bottom-5 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="w-9 h-9 bg-slate-900/90 border border-slate-700/60 text-slate-200 hover:text-white rounded-xl shadow-lg backdrop-blur-md flex items-center justify-center transition"
          title="Zoom In"
        >
          <ZoomIn className="w-4.5 h-4.5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-9 h-9 bg-slate-900/90 border border-slate-700/60 text-slate-200 hover:text-white rounded-xl shadow-lg backdrop-blur-md flex items-center justify-center transition"
          title="Zoom Out"
        >
          <ZoomOut className="w-4.5 h-4.5" />
        </button>
        <button
          onClick={fetchLocation}
          className="w-9 h-9 bg-emerald-600 border border-emerald-500 text-white rounded-xl shadow-lg backdrop-blur-md flex items-center justify-center hover:bg-emerald-500 transition"
          title="Recenter GPS"
        >
          <Navigation className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Map Container */}
      <MapContainer
        center={position}
        zoom={14}
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full min-h-[280px]"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <MapBoundsFitter pickup={pickup} destination={destination} center={position} />

        {/* User GPS Position Marker */}
        <Marker position={position} icon={userGpsIcon}>
          <Popup>
            <div className="p-1 text-slate-900 font-semibold text-xs text-center">
              <p className="font-bold">Your Location</p>
              <p className="text-slate-600 text-[11px]">GPS Active</p>
            </div>
          </Popup>
        </Marker>

        {/* Pickup Marker */}
        {hasPickupCoords && (
          <Marker position={[pickup.lat, pickup.lng]} icon={pickupIcon}>
            <Popup>
              <div className="p-1 text-slate-900 font-bold text-xs">
                📍 Pickup: {pickup.address || "Selected Location"}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Destination Marker */}
        {hasDestCoords && (
          <Marker position={[destination.lat, destination.lng]} icon={destinationIcon}>
            <Popup>
              <div className="p-1 text-slate-900 font-bold text-xs">
                🏁 Destination: {destination.address || "Selected Destination"}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route Line if both points set */}
        {hasPickupCoords && hasDestCoords && (
          <Polyline
            positions={[
              [pickup.lat, pickup.lng],
              [destination.lat, destination.lng],
            ]}
            color="#4F46E5"
            weight={4}
            opacity={0.8}
            dashArray="8, 8"
          />
        )}
      </MapContainer>
    </div>
  );
};

export default LiveMap;
