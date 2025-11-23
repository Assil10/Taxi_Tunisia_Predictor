/**
 * OSRM (Open Source Routing Machine) Service
 * Fetches distance and duration between two GPS coordinates
 */

import axios from 'axios';

const OSRM_BASE_URL = 'http://router.project-osrm.org/route/v1/driving';

/**
 * Get route information (distance and duration) from OSRM API
 * 
 * @param {number} startLat - Starting latitude
 * @param {number} startLng - Starting longitude
 * @param {number} endLat - Ending latitude
 * @param {number} endLng - Ending longitude
 * @returns {Promise<{distance: number, duration: number}>} Distance in meters and duration in seconds
 */
export const getRouteInfo = async (startLat, startLng, endLat, endLng) => {
  try {
    // OSRM API format: /route/v1/{profile}/{coordinates}?options={options}
    // Coordinates format: lng,lat;lng,lat
    const url = `${OSRM_BASE_URL}/${startLng},${startLat};${endLng},${endLat}?overview=false`;
    
    const response = await axios.get(url);
    
    if (response.data.code !== 'Ok' || !response.data.routes || response.data.routes.length === 0) {
      throw new Error('No route found between the given coordinates');
    }
    
    const route = response.data.routes[0];
    const distance = route.distance; // in meters
    const duration = route.duration; // in seconds
    
    // Convert to km and minutes
    return {
      distance_km: parseFloat((distance / 1000).toFixed(2)),
      duration_min: parseFloat((duration / 60).toFixed(1))
    };
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

