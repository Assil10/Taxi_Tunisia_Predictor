"""
Predict Taxi Fare using trained ML model
Can be called from command line or imported as module
"""

import pickle
import sys
import json
import numpy as np

def load_model():
    """Load trained model and feature information"""
    try:
        with open('model.pkl', 'rb') as f:
            model = pickle.load(f)
        
        with open('model_features.pkl', 'rb') as f:
            feature_info = pickle.load(f)
        
        return model, feature_info
    except FileNotFoundError as e:
        raise FileNotFoundError(
            "Model files not found. Please run train.py first to train the model."
        )

def prepare_features(distance_km, duration_min, city, time_of_day, feature_info):
    """
    Prepare feature vector for prediction
    
    Args:
        distance_km: Distance in kilometers
        duration_min: Duration in minutes
        city: City name (Tunis, Sousse, Sfax, etc.)
        time_of_day: 'morning', 'afternoon', or 'night'
        feature_info: Dictionary with feature column names and options
    
    Returns:
        numpy array of features
    """
    feature_cols = feature_info['feature_columns']
    cities = feature_info['cities']
    time_options = feature_info['time_options']
    
    # Initialize feature vector with zeros
    features = np.zeros(len(feature_cols))
    
    # Set distance and duration
    features[0] = distance_km
    features[1] = duration_min
    
    # Set city one-hot encoding
    if city in cities:
        city_idx = cities.index(city)
        city_col_idx = feature_cols.index(f'city_{city}')
        features[city_col_idx] = 1
    
    # Set time_of_day one-hot encoding
    if time_of_day in time_options:
        time_col_idx = feature_cols.index(f'time_{time_of_day}')
        features[time_col_idx] = 1
    
    return features.reshape(1, -1)

def predict_fare(distance_km, duration_min, city='Tunis', time_of_day='afternoon'):
    """
    Predict taxi fare
    
    Args:
        distance_km: Distance in kilometers
        duration_min: Duration in minutes
        city: City name (default: 'Tunis')
        time_of_day: 'morning', 'afternoon', or 'night' (default: 'afternoon')
    
    Returns:
        Predicted fare in DT (Tunisian Dinar)
    """
    model, feature_info = load_model()
    
    # Prepare features
    features = prepare_features(distance_km, duration_min, city, time_of_day, feature_info)
    
    # Predict
    prediction = model.predict(features)[0]
    
    # Ensure non-negative and round to 2 decimal places
    prediction = max(0, round(prediction, 2))
    
    return prediction

def main():
    """Command line interface for prediction"""
    if len(sys.argv) < 3:
        print("Usage: python predict.py <distance_km> <duration_min> [city] [time_of_day]")
        print("Example: python predict.py 5.2 11 Tunis night")
        sys.exit(1)
    
    try:
        distance_km = float(sys.argv[1])
        duration_min = float(sys.argv[2])
        city = sys.argv[3] if len(sys.argv) > 3 else 'Tunis'
        time_of_day = sys.argv[4] if len(sys.argv) > 4 else 'afternoon'
        
        predicted_price = predict_fare(distance_km, duration_min, city, time_of_day)
        
        # Output as JSON for easy parsing
        result = {
            'distance_km': distance_km,
            'duration_min': duration_min,
            'city': city,
            'time_of_day': time_of_day,
            'predicted_price': predicted_price
        }
        
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({'error': str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()

