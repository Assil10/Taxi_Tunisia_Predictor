import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const History = lazy(() => import('./pages/History'));

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0a0e27]">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-slate-400">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0a0e27] text-slate-100 relative overflow-hidden">
        {/* Optimized gradient background - reduced blur and animations */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {/* Single static gradient orb for better performance */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 via-purple-500/15 to-transparent rounded-full blur-2xl" />
          <div className="absolute top-1/2 -right-40 w-96 h-96 bg-gradient-to-bl from-purple-500/20 via-pink-500/15 to-transparent rounded-full blur-2xl" />
          
          {/* Simplified grid pattern - static */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-screen">
          <Navbar />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </Router>
  );
}

export default App;

