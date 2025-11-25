import React, { useEffect, useRef, memo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from 'react-leaflet';
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

// Component to handle map panning/zooming
function MapController({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom(), {
        animate: true,
        duration: 0.5
      });
    }
  }, [center, zoom, map]);
  
  return null;
}

const MapSelector = memo(({ startPoint, endPoint, onStartPointChange, onEndPointChange, routeGeometry, searchCenter }) => {
  const mapRef = useRef(null);

  const handleMapClick = useCallback((latlng, hasStart, hasEnd) => {
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
  }, [onStartPointChange, onEndPointChange]);

  // Use route geometry if available (actual streets), otherwise use straight line
  const polylinePositions = routeGeometry 
    ? routeGeometry  // Use actual route geometry from OSRM
    : (startPoint && endPoint 
      ? [[startPoint.lat, startPoint.lng], [endPoint.lat, endPoint.lng]]  // Fallback to straight line
      : []);

  return (
    <div className="w-full h-full rounded-xl overflow-hidden relative border border-slate-700/50 shadow-2xl">
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
        
        {/* Map controller for programmatic panning */}
        {searchCenter && <MapController center={[searchCenter.lat, searchCenter.lng]} zoom={15} />}
        
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
                <p className="font-bold text-green-400 flex items-center justify-center gap-2">
                  <span>📍</span>
                  Start Point
                </p>
                <p className="text-xs text-slate-400 mt-1">
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
                <p className="font-bold text-red-400 flex items-center justify-center gap-2">
                  <span>🎯</span>
                  End Point
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {endPoint.lat.toFixed(4)}, {endPoint.lng.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Route polyline - shows actual street route if available, otherwise straight line */}
        {polylinePositions.length > 0 && (
          <Polyline
            positions={polylinePositions}
            color={routeGeometry ? "#3b82f6" : "#60a5fa"}
            weight={routeGeometry ? 6 : 4}
            opacity={routeGeometry ? 0.9 : 0.6}
            dashArray={routeGeometry ? undefined : "15, 10"}
          />
        )}
      </MapContainer>
      
      {/* Help tip overlay */}
      <div className="absolute bottom-4 left-4 glass-card-strong px-4 py-3 rounded-xl shadow-xl z-[1000] border border-slate-700/50 animate-fadeIn">
        <p className="text-sm text-slate-200 flex items-center gap-2">
          <span className="text-lg">💡</span>
          <span>
            <span className="font-semibold">Click</span> to set {!startPoint ? 'start' : !endPoint ? 'end' : 'new'} point
          </span>
        </p>
      </div>

      {/* Status indicators - switch based on state */}
      {startPoint && !endPoint && (
        <div className="absolute top-4 right-4 glass-card-strong px-4 py-2 rounded-xl shadow-xl z-[1000] border border-green-500/30 animate-fadeIn">
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full pulse-dot"></span>
            <span className="text-slate-200 font-medium">Start selected</span>
          </div>
        </div>
      )}
      
      {startPoint && endPoint && (
        <div className="absolute top-4 right-4 glass-card-strong px-4 py-2 rounded-xl shadow-xl z-[1000] border border-blue-500/30 animate-fadeIn">
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 bg-blue-400 rounded-full pulse-dot"></span>
            <span className="text-slate-200 font-medium">Route ready</span>
          </div>
        </div>
      )}
    </div>
  );
});

MapSelector.displayName = 'MapSelector';

export default MapSelector;

