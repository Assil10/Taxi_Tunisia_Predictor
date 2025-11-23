import React, { useState, useEffect } from 'react';

const PredictionCard = ({ prediction, isLoading }) => {
  const [animatedPrice, setAnimatedPrice] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (prediction && prediction.predicted_price) {
      setIsAnimating(true);
      const targetPrice = prediction.predicted_price;
      const duration = 1000; // 1 second animation
      const steps = 30;
      const increment = targetPrice / steps;
      let current = 0;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        current += increment;
        
        if (step >= steps) {
          setAnimatedPrice(targetPrice);
          setIsAnimating(false);
          clearInterval(timer);
        } else {
          setAnimatedPrice(current);
        }
      }, duration / steps);
    }
  }, [prediction]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-xl p-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-16 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!prediction) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-8 transform transition-all duration-300 hover:scale-105">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="mr-2">💰</span>
        Predicted Fare
      </h2>
      
      <div className="mb-6">
        <div className="text-5xl font-bold text-primary-600 mb-2">
          {isAnimating ? animatedPrice.toFixed(2) : prediction.predicted_price.toFixed(2)}
          <span className="text-2xl ml-2">DT</span>
        </div>
        <p className="text-gray-500 text-sm">Tunisian Dinar</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Distance</p>
          <p className="text-xl font-semibold text-blue-700">
            {prediction.distance_km} km
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Duration</p>
          <p className="text-xl font-semibold text-green-700">
            {prediction.duration_min} min
          </p>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">City:</span>
          <span className="font-semibold">{prediction.city}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Time of Day:</span>
          <span className="font-semibold capitalize">{prediction.time_of_day}</span>
        </div>
      </div>
    </div>
  );
};

export default PredictionCard;

