import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-card-strong sticky top-0 z-50 border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                <span className="text-2xl">🚕</span>
              </div>
            </div>
            <div className="ml-4">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI Taxi Predictor
              </span>
              <span className="ml-2 text-xs text-slate-400 font-medium">Tunisia</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-2">
            <Link
              to="/"
              className={`relative inline-flex items-center px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                isActive('/')
                  ? 'text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {isActive('/') && (
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur-sm" />
              )}
              <span className="relative flex items-center gap-2">
                <span>🏠</span>
                <span>Home</span>
              </span>
              {isActive('/') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
              )}
            </Link>
            <Link
              to="/history"
              className={`relative inline-flex items-center px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                isActive('/history')
                  ? 'text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {isActive('/history') && (
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur-sm" />
              )}
              <span className="relative flex items-center gap-2">
                <span>📜</span>
                <span>History</span>
              </span>
              {isActive('/history') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

