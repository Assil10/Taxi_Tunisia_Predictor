import React, { useState, useEffect } from 'react';
import { getHistory } from '../services/api';

const History = () => {
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getHistory(100);
      setPredictions(data.predictions || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message || 'Failed to load prediction history');
      console.error('History load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="inline-block relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-50"></div>
              <div className="relative animate-spin rounded-full h-16 w-16 border-4 border-slate-700 border-t-blue-500"></div>
            </div>
            <p className="mt-6 text-slate-400 text-lg">Loading prediction history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 animate-fadeInUp">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3 flex items-center gap-3">
                <span className="text-5xl">📜</span>
                Prediction History
              </h1>
              <p className="text-slate-400 text-lg">
                View all your previous fare predictions
              </p>
            </div>
            {total > 0 && (
              <div className="glass-card-strong px-6 py-4 rounded-xl border border-slate-700/50">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {total}
                  </div>
                  <div className="text-xs text-slate-400 font-medium mt-1">Total Predictions</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="glass-card border border-red-500/50 bg-red-500/10 text-red-400 px-5 py-4 rounded-xl mb-6 animate-fadeIn">
            <p className="font-semibold flex items-center gap-2">
              <span>⚠️</span>
              {error}
            </p>
          </div>
        )}

        {/* Predictions List */}
        {predictions.length === 0 ? (
          <div className="glass-card-strong rounded-2xl p-16 text-center border border-slate-700/50 animate-fadeInUp">
            <div className="text-7xl mb-6 opacity-50">🚕</div>
            <h3 className="text-2xl font-bold text-slate-200 mb-3">
              No Predictions Yet
            </h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Start predicting fares on the home page to see your history here!
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 btn-gradient text-white px-6 py-3 rounded-xl font-semibold"
            >
              <span>🏠</span>
              Go to Home
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {predictions.map((prediction, index) => (
              <div
                key={prediction._id}
                className="glass-card-strong rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 border border-slate-700/50 animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Header with Price and City */}
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <div className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1">
                      {prediction.predicted_price.toFixed(2)} <span className="text-lg text-slate-300">DT</span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <span>🕐</span>
                      {formatDate(prediction.datetime)}
                    </p>
                  </div>
                  <div className="chip bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 text-blue-300">
                    {prediction.city}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="glass-card rounded-lg p-3 border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-transparent">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-sm">📏</span>
                      <p className="text-xs text-slate-400 font-medium">Distance</p>
                    </div>
                    <p className="text-lg font-bold text-blue-400">
                      {prediction.distance_km.toFixed(1)}<span className="text-xs text-slate-400 ml-1">km</span>
                    </p>
                  </div>
                  <div className="glass-card rounded-lg p-3 border border-green-500/20 bg-gradient-to-br from-green-500/10 to-transparent">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-sm">⏱️</span>
                      <p className="text-xs text-slate-400 font-medium">Duration</p>
                    </div>
                    <p className="text-lg font-bold text-green-400">
                      {prediction.duration_min.toFixed(0)}<span className="text-xs text-slate-400 ml-1">min</span>
                    </p>
                  </div>
                </div>

                {/* Time of Day */}
                <div className="glass-card rounded-lg px-4 py-2.5 mb-4 border border-slate-700/30">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                      <span>🕐</span>
                      Time of Day
                    </span>
                    <span className="font-semibold text-slate-200 capitalize">{prediction.time_of_day}</span>
                  </div>
                </div>

                {/* Coordinates (Collapsible) */}
                <details className="group">
                  <summary className="cursor-pointer text-xs text-slate-400 hover:text-slate-300 transition-colors flex items-center gap-2">
                    <span className="transform group-open:rotate-90 transition-transform">▶</span>
                    Route Coordinates
                  </summary>
                  <div className="mt-3 pt-3 border-t border-slate-700/30 space-y-1.5">
                    <p className="text-xs text-slate-500">
                      <span className="text-green-400">Start:</span> {prediction.start_lat.toFixed(4)}, {prediction.start_lng.toFixed(4)}
                    </p>
                    <p className="text-xs text-slate-500">
                      <span className="text-red-400">End:</span> {prediction.end_lat.toFixed(4)}, {prediction.end_lng.toFixed(4)}
                    </p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;

