import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import History from './pages/History';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0a0e27] text-slate-100 relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {/* Large gradient orbs */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-transparent rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/2 -right-40 w-96 h-96 bg-gradient-to-bl from-purple-500/30 via-pink-500/20 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-gradient-to-tr from-blue-500/20 via-cyan-500/20 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
          
          {/* Grid pattern overlay */}
          <div 
            className="absolute inset-0 opacity-10"
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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

