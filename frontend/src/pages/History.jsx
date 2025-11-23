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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📜 Prediction History
          </h1>
          <p className="text-gray-600">
            View all your previous fare predictions ({total} total)
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">⚠️ {error}</p>
          </div>
        )}

        {/* Predictions List */}
        {predictions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg">No predictions yet. Start predicting fares on the home page!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {predictions.map((prediction) => (
              <div
                key={prediction._id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-2xl font-bold text-primary-600">
                      {prediction.predicted_price.toFixed(2)} DT
                    </div>
                    <p className="text-sm text-gray-500">
                      {formatDate(prediction.datetime)}
                    </p>
                  </div>
                  <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {prediction.city}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Distance:</span>
                    <span className="font-semibold">{prediction.distance_km} km</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold">{prediction.duration_min} min</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-semibold capitalize">{prediction.time_of_day}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Route Coordinates:</p>
                  <p className="text-xs text-gray-600">
                    Start: {prediction.start_lat.toFixed(4)}, {prediction.start_lng.toFixed(4)}
                  </p>
                  <p className="text-xs text-gray-600">
                    End: {prediction.end_lat.toFixed(4)}, {prediction.end_lng.toFixed(4)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;

