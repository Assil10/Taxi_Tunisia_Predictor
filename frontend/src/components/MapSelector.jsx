import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Default center: Tunis, Tunisia
const DEFAULT_CENTER = [36.8065, 10.1815];
const DEFAULT_ZOOM = 13;

/**
 * Map click handler component
 * Automatically sets start point first, then end point
 */
function MapClickHandler({ onMapClick, hasStart, hasEnd }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng, hasStart, hasEnd);
    },
  });
  return null;
}

const MapSelector = ({ startPoint, endPoint, onStartPointChange, onEndPointChange }) => {
  const mapRef = useRef(null);

  const handleMapClick = (latlng, hasStart, hasEnd) => {
    // If no start point, set start point
    if (!hasStart) {
      onStartPointChange({ lat: latlng.lat, lng: latlng.lng });
    }
    // If start point exists but no end point, set end point
    else if (!hasEnd) {
      onEndPointChange({ lat: latlng.lat, lng: latlng.lng });
    }
    // If both exist, update start point (user wants to reset)
    else {
      onStartPointChange({ lat: latlng.lat, lng: latlng.lng });
      onEndPointChange(null);
    }
  };

  // Create polyline if both points exist
  const polylinePositions = startPoint && endPoint
    ? [[startPoint.lat, startPoint.lng], [endPoint.lat, endPoint.lng]]
    : [];

  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-lg border-2 border-gray-300">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Map click handlers */}
        <MapClickHandler 
          onMapClick={handleMapClick} 
          hasStart={!!startPoint} 
          hasEnd={!!endPoint} 
        />
        
        {/* Start point marker */}
        {startPoint && (
          <Marker position={[startPoint.lat, startPoint.lng]}>
            <Popup>
              <div className="text-center">
                <p className="font-bold text-green-600">📍 Start Point</p>
                <p className="text-xs">
                  {startPoint.lat.toFixed(4)}, {startPoint.lng.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* End point marker */}
        {endPoint && (
          <Marker position={[endPoint.lat, endPoint.lng]}>
            <Popup>
              <div className="text-center">
                <p className="font-bold text-red-600">🎯 End Point</p>
                <p className="text-xs">
                  {endPoint.lat.toFixed(4)}, {endPoint.lng.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Route polyline */}
        {polylinePositions.length > 0 && (
          <Polyline
            positions={polylinePositions}
            color="blue"
            weight={4}
            opacity={0.7}
            dashArray="10, 10"
          />
        )}
      </MapContainer>
      
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md z-[1000]">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">💡 Tip:</span> Click on the map to set {!startPoint ? 'start' : !endPoint ? 'end' : 'new'} point
        </p>
      </div>
    </div>
  );
};

export default MapSelector;

