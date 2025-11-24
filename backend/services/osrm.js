/**
 * OSRM (Open Source Routing Machine) Service
 * Fetches distance and duration between two GPS coordinates
 */

import axios from 'axios';

const OSRM_BASE_URL = 'http://router.project-osrm.org/route/v1/driving';

/**
 * Decode polyline string to array of [lat, lng] coordinates
 * OSRM uses encoded polyline format
 * 
 * @param {string} encoded - Encoded polyline string
 * @returns {Array<[number, number]>} Array of [lat, lng] coordinates
 */
function decodePolyline(encoded) {
  const poly = [];
  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;

  while (index < len) {
    let b;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    poly.push([lat / 1e5, lng / 1e5]);
  }
  return poly;
}

/**
 * Get route information (distance, duration, and geometry) from OSRM API
 * 
 * @param {number} startLat - Starting latitude
 * @param {number} startLng - Starting longitude
 * @param {number} endLat - Ending latitude
 * @param {number} endLng - Ending longitude
 * @returns {Promise<{distance_km: number, duration_min: number, geometry?: Array<[number, number]>}>} 
 */
export const getRouteInfo = async (startLat, startLng, endLat, endLng) => {
  try {
    // OSRM API format: /route/v1/{profile}/{coordinates}?options={options}
    // Coordinates format: lng,lat;lng,lat
    // overview=full returns full route geometry
    const url = `${OSRM_BASE_URL}/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
    
    const response = await axios.get(url);
    
    if (response.data.code !== 'Ok' || !response.data.routes || response.data.routes.length === 0) {
      throw new Error('No route found between the given coordinates');
    }
    
    const route = response.data.routes[0];
    const distance = route.distance; // in meters
    const duration = route.duration; // in seconds
    
    // Extract route geometry (GeoJSON format from OSRM)
    let geometry = null;
    if (route.geometry && route.geometry.coordinates) {
      // OSRM returns coordinates as [lng, lat], we need [lat, lng] for Leaflet
      geometry = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
    }
    
    // Convert to km and minutes
    const result = {
      distance_km: parseFloat((distance / 1000).toFixed(2)),
      duration_min: parseFloat((duration / 60).toFixed(1))
    };
    
    // Add geometry if available
    if (geometry) {
      result.geometry = geometry;
    }
    
    return result;
  } catch (error) {
    console.error('OSRM API Error:', error.message);
    
    // Fallback: Calculate straight-line distance if OSRM fails
    if (error.response?.status === 429 || error.code === 'ECONNREFUSED') {
      console.log('⚠️  OSRM unavailable, using fallback distance calculation');
      return calculateStraightLineDistance(startLat, startLng, endLat, endLng);
    }
    
    throw new Error(`Failed to get route information: ${error.message}`);
  }
};

/**
 * Calculate straight-line distance (Haversine formula) as fallback
 * 
 * @param {number} lat1 - Starting latitude
 * @param {number} lon1 - Starting longitude
 * @param {number} lat2 - Ending latitude
 * @param {number} lon2 - Ending longitude
 * @returns {{distance_km: number, duration_min: number}} Estimated distance and duration
 */
function calculateStraightLineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance_km = R * c;
  
  // Estimate duration (assuming average 30 km/h in city)
  const duration_min = (distance_km / 30) * 60;
  
  return {
    distance_km: parseFloat(distance_km.toFixed(2)),
    duration_min: parseFloat(duration_min.toFixed(1))
  }
}

export default { getRouteInfo };

