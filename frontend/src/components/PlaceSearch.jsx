import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';

/**
 * PlaceSearch Component
 * Allows users to search for places and select them on the map
 */
const PlaceSearch = ({ onPlaceSelect, placeholder = "Search for a place..." }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);
  const debounceTimer = useRef(null);

  // Debounced search function
  const searchPlaces = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 3) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Using Nominatim (OpenStreetMap) geocoding API - free, no API key needed
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: searchQuery,
          format: 'json',
          limit: 5,
          addressdetails: 1,
          'accept-language': 'en'
        },
        headers: {
          'User-Agent': 'Taxi-Price-Predictor' // Required by Nominatim
        }
      });

      setResults(response.data || []);
      setShowResults(true);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce search input
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      if (query.trim()) {
        searchPlaces(query);
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300); // 300ms debounce

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query, searchPlaces]);

  // Handle place selection
  const handleSelectPlace = useCallback((place) => {
    const lat = parseFloat(place.lat);
    const lng = parseFloat(place.lon);
    
    onPlaceSelect({ lat, lng, name: place.display_name });
    setQuery(place.display_name);
    setShowResults(false);
    setResults([]);
    searchRef.current?.blur();
  }, [onPlaceSelect]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < results.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && selectedIndex >= 0 && results[selectedIndex]) {
      e.preventDefault();
      handleSelectPlace(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowResults(false);
      searchRef.current?.blur();
    }
  }, [results, selectedIndex, handleSelectPlace]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target) &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format place name for display
  const formatPlaceName = (place) => {
    const parts = place.display_name.split(',');
    if (parts.length > 2) {
      return `${parts[0]}, ${parts[parts.length - 2]}, ${parts[parts.length - 1]}`;
    }
    return place.display_name;
  };

  return (
    <div className="relative w-full" ref={resultsRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 z-10">
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          ) : (
            <span className="text-lg">🔍</span>
          )}
        </div>
        <input
          ref={searchRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setShowResults(true);
          }}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3 glass-card rounded-xl border border-slate-700/50 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setShowResults(false);
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-card-strong rounded-xl border border-slate-700/50 shadow-2xl z-50 max-h-80 overflow-y-auto animate-fadeIn">
          {results.map((place, index) => (
            <button
              key={place.place_id}
              onClick={() => handleSelectPlace(place)}
              className={`w-full text-left px-4 py-3 hover:bg-slate-800/50 transition-colors border-b border-slate-700/30 last:border-b-0 ${
                index === selectedIndex ? 'bg-blue-500/20' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5">
                  {place.type === 'city' || place.type === 'town' ? '🏙️' :
                   place.type === 'road' || place.type === 'highway' ? '🛣️' :
                   place.type === 'building' ? '🏢' : '📍'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-200 truncate">
                    {formatPlaceName(place)}
                  </p>
                  {place.address && (
                    <p className="text-xs text-slate-400 mt-1">
                      {place.address.city || place.address.town || place.address.village || ''}
                      {place.address.country && `, ${place.address.country}`}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {showResults && !isLoading && query.length >= 3 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-card-strong rounded-xl border border-slate-700/50 shadow-2xl z-50 p-4 text-center animate-fadeIn">
          <p className="text-sm text-slate-400">No places found. Try a different search.</p>
        </div>
      )}
    </div>
  );
};

export default PlaceSearch;

