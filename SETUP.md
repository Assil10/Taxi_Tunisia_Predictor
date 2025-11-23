# 🚀 Quick Setup Guide

Follow these steps to get the Taxi Price Predictor up and running:

## Step 1: Train the ML Model

```bash
cd ml
pip install -r requirements.txt
python train.py
```

This will generate `model.pkl` and `model_features.pkl` files.

## Step 2: Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**
```bash
# If installed as service, it should start automatically
# Or start manually:
mongod
```

**Mac/Linux:**
```bash
# Using Homebrew (Mac)
brew services start mongodb-community

# Or manually
mongod
```

**Using Docker:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

## Step 3: Configure Backend

```bash
cd backend
npm install

# Copy environment example
cp env.example .env

# Edit .env and set your MongoDB URI if needed
# Default: mongodb://localhost:27017/taxi_predictor
```

## Step 4: Start Backend Server

```bash
cd backend
npm start
```

Backend will run on `http://localhost:5000`

## Step 5: Start Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:3000`

## Step 6: Open in Browser

Navigate to `http://localhost:3000` and start predicting taxi fares! 🚕

## Troubleshooting

### Python not found
- Make sure Python 3.8+ is installed
- On Windows, you might need to use `py` instead of `python`
- Update `backend/services/pythonPredict.js` to use `py` if needed

### MongoDB connection error
- Check if MongoDB is running: `mongosh` or `mongo`
- Verify connection string in `.env`
- For MongoDB Atlas (cloud), update the URI in `.env`

### Port already in use
- Change `PORT` in backend `.env` file
- Update `vite.config.js` proxy target if you change backend port

### OSRM API rate limiting
- The app includes a fallback for straight-line distance
- For production, consider hosting your own OSRM instance

## Next Steps

- Try predicting a fare by clicking on the map
- Check the History page to see all predictions
- Customize the ML model by editing `ml/train.py`

Happy predicting! 🎉

