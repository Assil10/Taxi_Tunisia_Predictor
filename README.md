# 🚕 AI Taxi Price Predictor - Tunisia

A full-stack web application that predicts taxi fares in Tunisia using Machine Learning, GPS coordinates, and real-time route data.

## 🌟 Features

- **Interactive Map**: Select pickup and drop-off points using OpenStreetMap
- **Real-time Route Calculation**: Uses OSRM API to calculate distance and duration
- **ML-Powered Predictions**: RandomForest model trained on Tunisian taxi pricing data
- **City & Time Variations**: Accounts for different cities and time-of-day pricing
- **Prediction History**: View all previous predictions stored in MongoDB
- **Modern UI**: Beautiful, responsive design with TailwindCSS

## 🛠️ Tech Stack

### Frontend
- **React** + **Vite** - Modern React framework
- **TailwindCSS** - Utility-first CSS framework
- **React Leaflet** - Interactive maps
- **React Router** - Client-side routing

### Backend
- **Node.js** + **Express** - RESTful API server
- **MongoDB** + **Mongoose** - Database and ODM
- **Axios** - HTTP client for OSRM API

### Machine Learning
- **Python** + **scikit-learn** - ML model training and prediction
- **RandomForestRegressor** - Ensemble learning model
- **Pandas** + **NumPy** - Data processing

### APIs
- **OSRM** (Open Source Routing Machine) - Route calculation
- **OpenStreetMap** - Map tiles

## 📁 Project Structure

```
taxi-ai/
├── backend/
│   ├── app.js                 # Express server entry point
│   ├── routes/
│   │   └── predict.js         # API routes
│   ├── services/
│   │   ├── osrm.js            # OSRM API integration
│   │   └── pythonPredict.js   # Python ML script caller
│   ├── models/
│   │   └── TaxiPrediction.js  # MongoDB schema
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── package.json
│   └── .env.example
├── ml/
│   ├── train.py               # Model training script
│   ├── predict.py             # Prediction script
│   ├── model.pkl              # Trained model (generated)
│   ├── model_features.pkl     # Feature info (generated)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── MapSelector.jsx
│   │   │   └── PredictionCard.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   └── History.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **MongoDB** (local or cloud instance)
- **npm** or **yarn**

### Installation

#### 1. Clone the repository

```bash
cd Taxi_Price_Predictor
```

#### 2. Set up Machine Learning Model

```bash
cd ml
pip install -r requirements.txt
python train.py
```

This will:
- Generate synthetic Tunisian taxi data
- Train a RandomForest model
- Save `model.pkl` and `model_features.pkl`

#### 3. Set up Backend

```bash
cd ../backend
npm install
cp .env.example .env
```

Edit `.env` and set your MongoDB connection:
```
MONGODB_URI=mongodb://localhost:27017/taxi_predictor
PORT=5000
```

Start the backend:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

#### 4. Set up Frontend

```bash
cd ../frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 📡 API Endpoints

### POST `/api/predict`

Predict taxi fare based on route and conditions.

**Request Body:**
```json
{
  "start": {"lat": 36.8065, "lng": 10.1815},
  "end": {"lat": 36.8200, "lng": 10.1900},
  "city": "Tunis",
  "time_of_day": "night"
}
```

**Response:**
```json
{
  "distance_km": 2.5,
  "duration_min": 8.3,
  "predicted_price": 4.25,
  "city": "Tunis",
  "time_of_day": "night",
  "start": {"lat": 36.8065, "lng": 10.1815},
  "end": {"lat": 36.8200, "lng": 10.1900}
}
```

### GET `/api/history`

Get prediction history.

**Query Parameters:**
- `limit` (optional): Number of results (default: 50)
- `skip` (optional): Number to skip (default: 0)

**Response:**
```json
{
  "predictions": [...],
  "total": 100,
  "limit": 50,
  "skip": 0
}
```

## 🎯 Usage

1. **Open the application** in your browser (`http://localhost:3000`)

2. **Select your route:**
   - Click on the map to set the start point (green marker)
   - Click again to set the end point (red marker)
   - A blue dashed line shows the route

3. **Configure trip details:**
   - Select the city from the dropdown
   - Choose time of day (Morning/Afternoon/Night)

4. **Get prediction:**
   - Click "🔮 Predict Fare"
   - The predicted price will appear with animation

5. **View history:**
   - Navigate to "History" page to see all previous predictions

## 🧠 Machine Learning Model

The model uses a **RandomForestRegressor** trained on synthetic data that follows Tunisian taxi pricing rules:

- **Base fare**: 1.000 - 2.000 DT
- **Price per km**: 0.7 - 1.2 DT
- **Night tariff**: +20%
- **City variations**: Different multipliers per city

### Features Used:
- Distance (km)
- Duration (minutes)
- City (one-hot encoded)
- Time of day (one-hot encoded)

### Retraining the Model

To retrain with different parameters or more data:

```bash
cd ml
python train.py
```

## 🔧 Configuration

### Environment Variables

**Backend** (`.env`):
```
MONGODB_URI=mongodb://localhost:27017/taxi_predictor
PORT=5000
```

**Frontend** (optional `.env`):
```
VITE_API_URL=http://localhost:5000/api
```

## 🐛 Troubleshooting

### Python script not found
- Ensure Python is in your system PATH
- Try using `python3` instead of `python` in `pythonPredict.js`

### OSRM API errors
- The app includes a fallback to calculate straight-line distance if OSRM is unavailable
- For production, consider hosting your own OSRM instance

### MongoDB connection issues
- Ensure MongoDB is running
- Check your connection string in `.env`
- For cloud MongoDB (Atlas), update the URI accordingly

## 📝 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on the repository.

---

**Built with ❤️ for Tunisia** 🇹🇳

