/**
 * Geocoding Service
 * Detects city name from GPS coordinates using reverse geocoding
 */

import axios from 'axios';

// All 24 Tunisian governorates with approximate coordinates (for fallback)
const TUNISIAN_CITIES = {
  // Greater Tunis area
  'Tunis': { lat: 36.8065, lng: 10.1815, radius: 0.3 },
  'Ariana': { lat: 36.8601, lng: 10.1934, radius: 0.2 },
  'Ben Arous': { lat: 36.7531, lng: 10.2189, radius: 0.2 },
  'Manouba': { lat: 36.8081, lng: 10.0972, radius: 0.2 },
  // Northeast
  'Nabeul': { lat: 36.4561, lng: 10.7376, radius: 0.2 },
  'Zaghouan': { lat: 36.4029, lng: 10.1429, radius: 0.15 },
  'Bizerte': { lat: 37.2744, lng: 9.8739, radius: 0.2 },
  // Northwest
  'Béja': { lat: 36.7256, lng: 9.1814, radius: 0.15 },
  'Jendouba': { lat: 36.5000, lng: 8.7800, radius: 0.15 },
  'Kef': { lat: 36.1822, lng: 8.7147, radius: 0.15 },
  'Siliana': { lat: 36.0847, lng: 9.3708, radius: 0.15 },
  // Center
  'Kairouan': { lat: 35.6711, lng: 10.1008, radius: 0.15 },
  'Kasserine': { lat: 35.1676, lng: 8.8361, radius: 0.15 },
  'Sidi Bouzid': { lat: 35.0381, lng: 9.4847, radius: 0.15 },
  // East Coast
  'Sousse': { lat: 35.8254, lng: 10.6360, radius: 0.2 },
  'Monastir': { lat: 35.7784, lng: 10.8262, radius: 0.15 },
  'Mahdia': { lat: 35.5047, lng: 11.0622, radius: 0.15 },
  // Southeast
  'Sfax': { lat: 34.7406, lng: 10.7600, radius: 0.2 },
  'Gabes': { lat: 33.8815, lng: 10.0982, radius: 0.2 },
  'Medenine': { lat: 33.3547, lng: 10.5053, radius: 0.15 },
  'Tataouine': { lat: 32.9297, lng: 10.4511, radius: 0.15 },
  // Southwest
  'Gafsa': { lat: 34.4250, lng: 8.7842, radius: 0.2 },
  'Tozeur': { lat: 33.9197, lng: 8.1331, radius: 0.15 },
  'Kebili': { lat: 33.7044, lng: 8.9694, radius: 0.15 }
};

/**
 * Detect city from GPS coordinates using reverse geocoding
 * Uses Nominatim (OpenStreetMap) API for free reverse geocoding
 * 
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<string>} City name
 */
export const detectCityFromCoordinates = async (lat, lng) => {
  try {
    // Use Nominatim reverse geocoding API (free, no API key needed)
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Taxi-Price-Predictor/1.0' // Required by Nominatim
      },
      timeout: 5000
    });
    
    if (response.data && response.data.address) {
      const address = response.data.address;
      
      // Try to extract city from address (different fields in different countries)
      const city = address.city || 
                   address.town || 
                   address.village || 
                   address.municipality ||
                   address.county;
      
      if (city) {
        // Check if it's one of our known cities
        const normalizedCity = normalizeCityName(city);
        if (normalizedCity) {
          return normalizedCity;
        }
      }
    }
    
    // Fallback: Use coordinate-based detection
    return detectCityByCoordinates(lat, lng);
    
  } catch (error) {
    console.warn('Reverse geocoding failed, using coordinate-based detection:', error.message);
    // Fallback: Use coordinate-based detection
    return detectCityByCoordinates(lat, lng);
  }
};

/**
 * Normalize city name to match our known cities
 * 
 * @param {string} cityName - City name from geocoding
 * @returns {string|null} Normalized city name or null
 */
function normalizeCityName(cityName) {
  const normalized = cityName.toLowerCase().trim();
  
  // Map variations to our city names (all 24 governorates)
  const cityMap = {
    'tunis': 'Tunis',
    'tunisia': 'Tunis',
    'ariana': 'Ariana',
    'ben arous': 'Ben Arous',
    'manouba': 'Manouba',
    'nabeul': 'Nabeul',
    'zaghouan': 'Zaghouan',
    'bizerte': 'Bizerte',
    'beja': 'Béja',
    'béja': 'Béja',
    'jendouba': 'Jendouba',
    'kef': 'Kef',
    'siliana': 'Siliana',
    'kairouan': 'Kairouan',
    'kasserine': 'Kasserine',
    'sidi bouzid': 'Sidi Bouzid',
    'sousse': 'Sousse',
    'monastir': 'Monastir',
    'mahdia': 'Mahdia',
    'sfax': 'Sfax',
    'gabes': 'Gabes',
    'gabès': 'Gabes',
    'medenine': 'Medenine',
    'médénine': 'Medenine',
    'tataouine': 'Tataouine',
    'gafsa': 'Gafsa',
    'tozeur': 'Tozeur',
    'kebili': 'Kebili',
    'kébili': 'Kebili'
  };
  
  // Direct match
  if (cityMap[normalized]) {
    return cityMap[normalized];
  }
  
  // Partial match
  for (const [key, value] of Object.entries(cityMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }
  
  return null;
}

/**
 * Detect city by calculating distance to known city centers
 * 
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {string} City name (defaults to 'Tunis')
 */
function detectCityByCoordinates(lat, lng) {
  let closestCity = 'Tunis'; // Default
  let minDistance = Infinity;
  
  for (const [cityName, cityData] of Object.entries(TUNISIAN_CITIES)) {
    const distance = calculateDistance(lat, lng, cityData.lat, cityData.lng);
    
    // If within city radius, return immediately
    if (distance <= cityData.radius) {
      return cityName;
    }
    
    // Track closest city
    if (distance < minDistance) {
      minDistance = distance;
      closestCity = cityName;
    }
  }
  
  return closestCity;
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 * 
 * @param {number} lat1 - Latitude 1
 * @param {number} lon1 - Longitude 1
 * @param {number} lat2 - Latitude 2
 * @param {number} lon2 - Longitude 2
 * @returns {number} Distance in degrees (approximate)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default { detectCityFromCoordinates };

