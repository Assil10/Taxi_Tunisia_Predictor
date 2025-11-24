import React, { useState } from 'react';
import MapSelector from '../components/MapSelector';
import PredictionCard from '../components/PredictionCard';
import { predictFare } from '../services/api';

// All 24 Tunisian governorates
const CITIES = [
  'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Zaghouan',
  'Bizerte', 'Béja', 'Jendouba', 'Kef', 'Siliana', 'Kairouan',
  'Kasserine', 'Sidi Bouzid', 'Sousse', 'Monastir', 'Mahdia',
  'Sfax', 'Gabes', 'Medenine', 'Tataouine', 'Gafsa', 'Tozeur', 'Kebili'
];
const TIME_OPTIONS = [
  { value: 'morning', label: '🌅 Morning' },
  { value: 'afternoon', label: '☀️ Afternoon' },
  { value: 'night', label: '🌙 Night' }
];

const Home = () => {
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [city, setCity] = useState('Tunis');
  const [timeOfDay, setTimeOfDay] = useState('afternoon');
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [autoDetectCity, setAutoDetectCity] = useState(true); // Toggle for auto-detect city

  const handlePredict = async () => {
    // Validate inputs
    if (!startPoint || !endPoint) {
      setError('Please select both start and end points on the map');
      return;
    }

    setError(null);
    setIsLoading(true);
    setPrediction(null);

    try {
      // Send city only if auto-detect is OFF, otherwise let backend detect
      const result = await predictFare({
        start: startPoint,
        end: endPoint,
        city: autoDetectCity ? undefined : city, // Auto-detect if toggle is ON
        time_of_day: timeOfDay
      });
      
      // Update city state with detected city from backend (if auto-detect was ON)
      if (autoDetectCity && result.city) {
        setCity(result.city);
      }

      setPrediction(result);
    } catch (err) {
      setError(err.message || 'Failed to predict fare. Please try again.');
      console.error('Prediction error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStartPoint(null);
    setEndPoint(null);
    setPrediction(null);
    setError(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🚕 AI Taxi Price Predictor
          </h1>
          <p className="text-gray-600">
            Select your route on the map and get an instant fare prediction
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Map and Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="h-96 relative">
                <MapSelector
                  startPoint={startPoint}
                  endPoint={endPoint}
                  onStartPointChange={setStartPoint}
                  onEndPointChange={setEndPoint}
                />
              </div>
            </div>

            {/* Input Controls */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Trip Details
              </h2>
              
              <div className="space-y-4">
                {/* Auto-Detect City Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Auto-detect City
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Automatically detect city from map coordinates
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoDetectCity(!autoDetectCity)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                      autoDetectCity ? 'bg-primary-600' : 'bg-gray-300'
                    }`}
                    role="switch"
                    aria-checked={autoDetectCity}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        autoDetectCity ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* City Selection - Only show when auto-detect is OFF */}
                {!autoDetectCity && (
                  <div className="animate-fadeIn">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Time of Day Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time of Day
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setTimeOfDay(option.value)}
                        className={`px-4 py-3 rounded-lg font-medium transition-all ${
                          timeOfDay === option.value
                            ? 'bg-primary-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handlePredict}
                    disabled={isLoading || !startPoint || !endPoint}
                    className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-md"
                  >
                    {isLoading ? '⏳ Predicting...' : '🔮 Predict Fare'}
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    🔄 Reset
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <p className="font-medium">⚠️ {error}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Prediction Card */}
          <div className="lg:col-span-1">
            <PredictionCard prediction={prediction} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

