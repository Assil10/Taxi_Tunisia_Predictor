import React, { useState, lazy, Suspense, useCallback, useMemo } from 'react';
import PredictionCard from '../components/PredictionCard';
import { predictFare } from '../services/api';

// Lazy load MapSelector for better performance
const MapSelector = lazy(() => import('../components/MapSelector'));

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
  const [routeGeometry, setRouteGeometry] = useState(null); // Route geometry for map visualization

  const handlePredict = useCallback(async () => {
    // Validate inputs
    if (!startPoint || !endPoint) {
      setError('Please select both start and end points on the map');
      return;
    }

    setError(null);
    setIsLoading(true);
    setPrediction(null);
    setRouteGeometry(null); // Clear previous route while loading

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

      // Update route geometry for map visualization
      if (result.route_geometry) {
        setRouteGeometry(result.route_geometry);
      } else {
        setRouteGeometry(null);
      }

      setPrediction(result);
    } catch (err) {
      setError(err.message || 'Failed to predict fare. Please try again.');
      console.error('Prediction error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [startPoint, endPoint, autoDetectCity, city, timeOfDay]);

  const handleReset = useCallback(() => {
    setStartPoint(null);
    setEndPoint(null);
    setPrediction(null);
    setError(null);
    setRouteGeometry(null);
  }, []);

  // Clear route geometry when points change
  const handleStartPointChange = useCallback((point) => {
    setStartPoint(point);
    setRouteGeometry(null); // Clear route when start point changes
  }, []);

  const handleEndPointChange = useCallback((point) => {
    setEndPoint(point);
    setRouteGeometry(null); // Clear route when end point changes
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeInUp">
          <div className="inline-block mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-50" />
              <h1 className="relative text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                🚕 AI Taxi Price Predictor
              </h1>
            </div>
          </div>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Select your route on the map and get an instant, AI-powered fare prediction
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column: Map and Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map */}
            <div className="glass-card-strong rounded-2xl p-4 sm:p-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                  <span className="text-2xl">🗺️</span>
                  Interactive Map
                </h3>
                {startPoint && endPoint && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Route Selected
                  </div>
                )}
              </div>
              <div className="h-96 sm:h-[500px] relative rounded-xl overflow-hidden">
                <Suspense fallback={
                  <div className="w-full h-full flex items-center justify-center bg-slate-900/50">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                      <p className="text-sm text-slate-400">Loading map...</p>
                    </div>
                  </div>
                }>
                  <MapSelector
                    startPoint={startPoint}
                    endPoint={endPoint}
                    onStartPointChange={handleStartPointChange}
                    onEndPointChange={handleEndPointChange}
                    routeGeometry={routeGeometry}
                  />
                </Suspense>
              </div>
            </div>

            {/* Input Controls */}
            <div className="glass-card-strong rounded-2xl p-6 sm:p-8 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                <span className="text-2xl">⚙️</span>
                Trip Details
              </h2>
              
              <div className="space-y-6">
                {/* Auto-Detect City Toggle */}
                <div className="glass-card rounded-xl p-5 border border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                        <span className="text-xl">🌍</span>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-200">
                          Auto-detect City
                        </label>
                        <p className="text-xs text-slate-400 mt-1">
                          Automatically detect city from map coordinates
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAutoDetectCity(!autoDetectCity)}
                      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                        autoDetectCity 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                          : 'bg-slate-700'
                      }`}
                      role="switch"
                      aria-checked={autoDetectCity}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                          autoDetectCity ? 'translate-x-8' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* City Selection - Only show when auto-detect is OFF */}
                {!autoDetectCity && (
                  <div className="animate-fadeIn">
                    <label className="block text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                      <span>🏙️</span>
                      Select City
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 glass-card rounded-xl text-slate-200 border border-slate-700/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-900/50"
                    >
                      {CITIES.map((c) => (
                        <option key={c} value={c} className="bg-slate-900">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Time of Day Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                    <span>🕐</span>
                    Time of Day
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {TIME_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setTimeOfDay(option.value)}
                        className={`px-4 py-4 rounded-xl font-semibold transition-all duration-300 transform ${
                          timeOfDay === option.value
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105 glow-blue'
                            : 'glass-card text-slate-300 hover:bg-slate-800/50 hover:scale-[1.02] border border-slate-700/50'
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
                    className="flex-1 btn-gradient text-white px-6 py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin">⏳</span>
                        Predicting...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        🔮 Predict Fare
                      </span>
                    )}
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-4 glass-card text-slate-300 rounded-xl font-semibold hover:bg-slate-800/50 transition-all border border-slate-700/50"
                  >
                    🔄 Reset
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="glass-card border border-red-500/50 bg-red-500/10 text-red-400 px-5 py-4 rounded-xl animate-fadeIn">
                    <p className="font-semibold flex items-center gap-2">
                      <span>⚠️</span>
                      {error}
                    </p>
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

