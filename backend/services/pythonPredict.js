/**
 * Python ML Prediction Service
 * Calls Python script to get fare prediction from trained model
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Call Python prediction script and get fare prediction
 * 
 * @param {number} distance_km - Distance in kilometers
 * @param {number} duration_min - Duration in minutes
 * @param {string} city - City name
 * @param {string} time_of_day - 'morning', 'afternoon', or 'night'
 * @returns {Promise<number>} Predicted fare in DT
 */
export const predictFare = async (distance_km, duration_min, city, time_of_day) => {
  return new Promise((resolve, reject) => {
    // Path to Python predict script
    const pythonScriptPath = join(__dirname, '../../ml/predict.py');
    // Path to ml directory (working directory for Python script)
    const mlDirectory = join(__dirname, '../../ml');
    
    // Spawn Python process with working directory set to ml folder
    const pythonProcess = spawn('python', [
      pythonScriptPath,
      distance_km.toString(),
      duration_min.toString(),
      city,
      time_of_day
    ], {
      cwd: mlDirectory  // Set working directory to ml folder so it can find model.pkl
    });
    
    let stdout = '';
    let stderr = '';
    
    // Collect stdout
    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    // Collect stderr
    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    // Handle process completion
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python script error:', stderr);
        reject(new Error(`Python script failed with code ${code}: ${stderr}`));
        return;
      }
      
      try {
        // Parse JSON output from Python script
        const result = JSON.parse(stdout.trim());
        
        if (result.error) {
          reject(new Error(result.error));
          return;
        }
        
        resolve(result.predicted_price);
      } catch (error) {
        reject(new Error(`Failed to parse Python output: ${error.message}`));
      }
    });
    
    // Handle process errors
    pythonProcess.on('error', (error) => {
      reject(new Error(`Failed to spawn Python process: ${error.message}. Make sure Python is installed and accessible.`));
    });
  });
};

export default { predictFare };

