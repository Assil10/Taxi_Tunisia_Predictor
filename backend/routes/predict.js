/**
 * Prediction Routes
 * Handles API endpoints for fare prediction and history
 */

import express from 'express';
import { getRouteInfo } from '../services/osrm.js';
import { predictFare } from '../services/pythonPredict.js';
import TaxiPrediction from '../models/TaxiPrediction.js';

const router = express.Router();

/**
 * POST /api/predict
 * Predict taxi fare based on GPS coordinates, city, and time of day
 * 
 * Request body:
 * {
 *   "start": {"lat": 36.8, "lng": 10.1},
 *   "end": {"lat": 36.81, "lng": 10.15},
 *   "time_of_day": "night",
 *   "city": "Tunis"
 * }
 */
router.post('/predict', async (req, res) => {
  try {
    const { start, end, time_of_day, city } = req.body;
    
    // Validate input
    if (!start || !end || !time_of_day || !city) {
      return res.status(400).json({
        error: 'Missing required fields: start, end, time_of_day, city'
      });
    }
    
    if (!start.lat || !start.lng || !end.lat || !end.lng) {
      return res.status(400).json({
        error: 'Invalid coordinates. start and end must have lat and lng'
      });
    }
    
    const validTimeOfDay = ['morning', 'afternoon', 'night'];
    if (!validTimeOfDay.includes(time_of_day)) {
      return res.status(400).json({
        error: `time_of_day must be one of: ${validTimeOfDay.join(', ')}`
      });
    }
    
    // Step 1: Get distance and duration from OSRM
    console.log(`📍 Getting route info from ${start.lat},${start.lng} to ${end.lat},${end.lng}`);
    const routeInfo = await getRouteInfo(
      start.lat,
      start.lng,
      end.lat,
      end.lng
    );
    
    const { distance_km, duration_min } = routeInfo;
    
    // Step 2: Get fare prediction from ML model
    console.log(`🤖 Predicting fare: ${distance_km}km, ${duration_min}min, ${city}, ${time_of_day}`);
    const predicted_price = await predictFare(
      distance_km,
      duration_min,
      city,
      time_of_day
    );
    
    // Step 3: Save prediction to database
    const prediction = new TaxiPrediction({
      start_lat: start.lat,
      start_lng: start.lng,
      end_lat: end.lat,
      end_lng: end.lng,
      distance_km,
      duration_min,
      predicted_price,
      city,
      time_of_day,
      datetime: new Date()
    });
    
    await prediction.save();
    
    // Step 4: Return result
    res.json({
      distance_km,
      duration_min,
      predicted_price,
      city,
      time_of_day,
      start: {
        lat: start.lat,
        lng: start.lng
      },
      end: {
        lat: end.lat,
        lng: end.lng
      }
    });
    
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({
      error: 'Failed to predict fare',
      message: error.message
    });
  }
});

/**
 * GET /api/history
 * Get prediction history
 * 
 * Query params:
 * - limit: Number of results to return (default: 50)
 * - skip: Number of results to skip (default: 0)
 */
router.get('/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;
    
    const predictions = await TaxiPrediction.find()
      .sort({ datetime: -1 })
      .limit(limit)
      .skip(skip)
      .select('-__v')
      .lean();
    
    const total = await TaxiPrediction.countDocuments();
    
    res.json({
      predictions,
      total,
      limit,
      skip
    });
    
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch prediction history',
      message: error.message
    });
  }
});

export default router;

