/**
 * Express Server for Taxi Price Predictor API
 * Main entry point for backend
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import predictRoutes from './routes/predict.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend.vercel.app', 'https://your-frontend.netlify.app'] // Add your actual frontend URLs
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Taxi Price Predictor API is running' });
});

// API Routes
app.use('/api', predictRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log('='.repeat(60));
      console.log('🚕 TUNISIAN TAXI PRICE PREDICTOR - BACKEND API');
      console.log('='.repeat(60));
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/health`);
      console.log(`🔮 Predict endpoint: http://localhost:${PORT}/api/predict`);
      console.log(`📜 History endpoint: http://localhost:${PORT}/api/history`);
      console.log('='.repeat(60));
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;

