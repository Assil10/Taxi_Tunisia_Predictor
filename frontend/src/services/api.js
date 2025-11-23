/**
 * API Service for communicating with backend
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Predict taxi fare
 * @param {Object} predictionData - Prediction data
 * @param {Object} predictionData.start - Start coordinates {lat, lng}
 * @param {Object} predictionData.end - End coordinates {lat, lng}
 * @param {string} predictionData.city - City name
 * @param {string} predictionData.time_of_day - 'morning', 'afternoon', or 'night'
 * @returns {Promise<Object>} Prediction result
 */
export const predictFare = async (predictionData) => {
  try {
    const response = await api.post('/predict', predictionData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      error.response?.data?.error || 
      'Failed to predict fare'
    );
  }
};

/**
 * Get prediction history
 * @param {number} limit - Number of results to return
 * @param {number} skip - Number of results to skip
 * @returns {Promise<Object>} History data
 */
export const getHistory = async (limit = 50, skip = 0) => {
  try {
    const response = await api.get('/history', {
      params: { limit, skip }
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      error.response?.data?.error || 
      'Failed to fetch history'
    );
  }
};

export default {
  predictFare,
  getHistory
};

