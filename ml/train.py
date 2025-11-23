"""
Train Machine Learning Model for Taxi Price Prediction in Tunisia
Generates synthetic dataset and trains a RandomForestRegressor model
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import pickle
import os

def generate_synthetic_data(n_samples=2000):
    """
    Generate synthetic Tunisian taxi fare data based on realistic pricing rules
    
    Pricing Rules:
    - Base fare: 1.000-2.000 DT
    - Price per km: 0.7-1.2 DT
    - Night tariff: +20%
    - City variations (Tunis: +0%, Sousse: -5%, Sfax: -5%, Others: -10%)
    """
    np.random.seed(42)
    
    cities = ['Tunis', 'Sousse', 'Sfax', 'Bizerte', 'Gabes', 'Kairouan', 'Gafsa']
    time_of_day_options = ['morning', 'afternoon', 'night']
    
    data = []
    
    for _ in range(n_samples):
        # Generate realistic distance (0.5 to 50 km)
        distance_km = np.random.uniform(0.5, 50)
        
        # Generate duration based on distance (average 30 km/h in city)
        duration_min = distance_km * 2 + np.random.uniform(-5, 5)
        duration_min = max(2, duration_min)  # Minimum 2 minutes
        
        # Random city and time
        city = np.random.choice(cities)
        time_of_day = np.random.choice(time_of_day_options)
        
        # Calculate base fare
        base_fare = np.random.uniform(1.0, 2.0)
        
        # Price per km varies by city
        city_multipliers = {
            'Tunis': 1.0,
            'Sousse': 0.95,
            'Sfax': 0.95,
            'Bizerte': 0.90,
            'Gabes': 0.90,
            'Kairouan': 0.90,
            'Gafsa': 0.90
        }
        price_per_km = np.random.uniform(0.7, 1.2) * city_multipliers[city]
        
        # Night tariff (+20%)
        if time_of_day == 'night':
            price_per_km *= 1.2
        
        # Calculate total fare
        fare = base_fare + (distance_km * price_per_km)
        
        # Add some randomness for traffic, route variations
        fare *= np.random.uniform(0.95, 1.05)
        
        # Round to 2 decimal places
        fare = round(fare, 2)
        
        data.append({
            'distance_km': round(distance_km, 2),
            'duration_min': round(duration_min, 1),
            'city': city,
            'time_of_day': time_of_day,
            'fare': fare
        })
    
    return pd.DataFrame(data)

def encode_features(df):
    """Encode categorical features for ML model"""
    df_encoded = df.copy()
    
    # One-hot encode city
    cities = ['Tunis', 'Sousse', 'Sfax', 'Bizerte', 'Gabes', 'Kairouan', 'Gafsa']
    for city in cities:
        df_encoded[f'city_{city}'] = (df_encoded['city'] == city).astype(int)
    
    # One-hot encode time_of_day
    time_options = ['morning', 'afternoon', 'night']
    for time in time_options:
        df_encoded[f'time_{time}'] = (df_encoded['time_of_day'] == time).astype(int)
    
    # Drop original categorical columns
    df_encoded = df_encoded.drop(['city', 'time_of_day'], axis=1)
    
    return df_encoded

def train_model():
    """Main training function"""
    print("🚕 Generating synthetic Tunisian taxi data...")
    df = generate_synthetic_data(n_samples=2000)
    
    print(f"✅ Generated {len(df)} samples")
    print("\nDataset Statistics:")
    print(df.describe())
    print(f"\nCity distribution:\n{df['city'].value_counts()}")
    print(f"\nTime of day distribution:\n{df['time_of_day'].value_counts()}")
    
    # Encode features
    print("\n🔧 Encoding features...")
    df_encoded = encode_features(df)
    
    # Prepare features and target
    feature_cols = [col for col in df_encoded.columns if col != 'fare']
    X = df_encoded[feature_cols]
    y = df_encoded['fare']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Train RandomForest model
    print("\n🌲 Training RandomForestRegressor...")
    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate model
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print(f"\n📊 Model Performance:")
    print(f"   Mean Absolute Error: {mae:.2f} DT")
    print(f"   R² Score: {r2:.4f}")
    
    # Save model
    model_path = 'model.pkl'
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    
    # Save feature columns for prediction
    feature_info = {
        'feature_columns': feature_cols,
        'cities': ['Tunis', 'Sousse', 'Sfax', 'Bizerte', 'Gabes', 'Kairouan', 'Gafsa'],
        'time_options': ['morning', 'afternoon', 'night']
    }
    
    with open('model_features.pkl', 'wb') as f:
        pickle.dump(feature_info, f)
    
    print(f"\n✅ Model saved to {model_path}")
    print(f"✅ Feature info saved to model_features.pkl")
    
    return model

if __name__ == '__main__':
    print("=" * 60)
    print("🚕 TUNISIAN TAXI PRICE PREDICTOR - MODEL TRAINING")
    print("=" * 60)
    train_model()
    print("\n" + "=" * 60)
    print("✅ Training completed successfully!")
    print("=" * 60)

