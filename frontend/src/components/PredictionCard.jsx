import React, { useState, useEffect, memo } from 'react';

const PredictionCard = memo(({ prediction, isLoading }) => {
  const [animatedPrice, setAnimatedPrice] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (prediction && prediction.predicted_price) {
      setIsAnimating(true);
      const targetPrice = prediction.predicted_price;
      const duration = 1500; // 1.5 second animation
      const steps = 60;
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
      <div className="glass-card-strong rounded-2xl p-8 animate-fadeInUp sticky top-28">
        <div className="space-y-6">
          <div className="h-8 bg-slate-700/50 rounded-lg shimmer w-1/2"></div>
          <div className="h-20 bg-slate-700/50 rounded-xl shimmer w-2/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-700/50 rounded shimmer"></div>
            <div className="h-4 bg-slate-700/50 rounded shimmer w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="glass-card-strong rounded-2xl p-8 animate-fadeInUp sticky top-28 border border-slate-700/50">
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity-50">🚕</div>
          <h3 className="text-xl font-semibold text-slate-300 mb-2">
            Ready to Predict
          </h3>
          <p className="text-sm text-slate-400">
            Select your route on the map and click "Predict Fare" to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card-strong rounded-2xl p-8 animate-scaleIn sticky top-28 border border-slate-700/50 transform transition-all duration-300 hover:scale-[1.02]">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-100 mb-2 flex items-center gap-2">
          <span className="text-3xl">💰</span>
          Predicted Fare
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
      </div>
      
      {/* Price Display */}
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl"></div>
        <div className="relative gradient-border p-6">
          <div className="text-center">
            <div className="text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              {isAnimating ? animatedPrice.toFixed(2) : prediction.predicted_price.toFixed(2)}
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl font-bold text-slate-300">DT</span>
              <span className="text-sm text-slate-400">Tunisian Dinar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="glass-card rounded-xl p-4 border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-transparent">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">📏</span>
            <p className="text-xs text-slate-400 font-medium">Distance</p>
          </div>
          <p className="text-2xl font-bold text-blue-400">
            {prediction.distance_km.toFixed(1)}
            <span className="text-sm text-slate-400 ml-1">km</span>
          </p>
        </div>
        <div className="glass-card rounded-xl p-4 border border-green-500/20 bg-gradient-to-br from-green-500/10 to-transparent">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">⏱️</span>
            <p className="text-xs text-slate-400 font-medium">Duration</p>
          </div>
          <p className="text-2xl font-bold text-green-400">
            {prediction.duration_min.toFixed(0)}
            <span className="text-sm text-slate-400 ml-1">min</span>
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3 pt-6 border-t border-slate-700/50">
        <div className="flex justify-between items-center glass-card rounded-lg px-4 py-3 border border-slate-700/30">
          <span className="text-sm text-slate-400 flex items-center gap-2">
            <span>🏙️</span>
            City
          </span>
          <span className="font-semibold text-slate-200">{prediction.city}</span>
        </div>
        <div className="flex justify-between items-center glass-card rounded-lg px-4 py-3 border border-slate-700/30">
          <span className="text-sm text-slate-400 flex items-center gap-2">
            <span>🕐</span>
            Time
          </span>
          <span className="font-semibold text-slate-200 capitalize">{prediction.time_of_day}</span>
        </div>
      </div>

      {/* Success indicator */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
        <span>Prediction Complete</span>
      </div>
    </div>
  );
});

PredictionCard.displayName = 'PredictionCard';

export default PredictionCard;

