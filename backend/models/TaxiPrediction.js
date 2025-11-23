/**
 * Taxi Prediction MongoDB Model
 * Stores prediction history with all relevant data
 */

import mongoose from 'mongoose';

const taxiPredictionSchema = new mongoose.Schema({
  start_lat: {
    type: Number,
    required: true
  },
  start_lng: {
    type: Number,
    required: true
  },
  end_lat: {
    type: Number,
    required: true
  },
  end_lng: {
    type: Number,
    required: true
  },
  distance_km: {
    type: Number,
    required: true
  },
  duration_min: {
    type: Number,
    required: true
  },
  predicted_price: {
    type: Number,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  time_of_day: {
    type: String,
    enum: ['morning', 'afternoon', 'night'],
    required: true
  },
  datetime: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
taxiPredictionSchema.index({ datetime: -1 });

const TaxiPrediction = mongoose.model('TaxiPrediction', taxiPredictionSchema);

export default TaxiPrediction;

