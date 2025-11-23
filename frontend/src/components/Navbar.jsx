import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-2xl mr-2">🚕</span>
              <span className="text-xl font-bold text-gray-800">
                AI Taxi Price Predictor
              </span>
              <span className="ml-2 text-sm text-gray-600">Tunisia</span>
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Home
            </Link>
            <Link
              to="/history"
              className={`inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium transition-colors ${
                isActive('/history')
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              History
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

