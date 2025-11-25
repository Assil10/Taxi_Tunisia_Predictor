# 🚀 Deployment Guide - Taxi Price Predictor

This guide covers deploying your full-stack application (Frontend + Backend + ML) to production.

## 📋 Prerequisites

- GitHub account
- MongoDB Atlas account (free tier available)
- Railway/Render account (for backend)
- Vercel/Netlify account (for frontend)

---

## 🗄️ Step 1: Set Up MongoDB Atlas (Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (Free M0 tier)
4. Create a database user (username/password)
5. Whitelist IP: `0.0.0.0/0` (allow all IPs for now)
6. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/taxi_predictor`

---

## 🔧 Step 2: Deploy Backend (Railway - Recommended)

Railway supports Node.js + Python, perfect for your ML scripts.

### Option A: Railway Deployment

1. **Sign up**: [railway.app](https://railway.app) (use GitHub)

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `backend` folder

3. **Configure Environment Variables**:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   PORT=5000
   NODE_ENV=production
   ```

4. **Install Python**:
   - Go to Settings → Build
   - Add build command: `npm install && apt-get update && apt-get install -y python3 python3-pip`
   - Or use `nixpacks.toml` (see below)

5. **Deploy**:
   - Railway will auto-detect Node.js
   - Make sure `ml/` folder is accessible
   - Railway will provide a URL like: `https://your-app.railway.app`

### Option B: Render Deployment

1. **Sign up**: [render.com](https://render.com)

2. **Create Web Service**:
   - New → Web Service
   - Connect GitHub repo
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: `Node`

3. **Add Python Support**:
   - In Advanced → Build Command, add:
     ```
     npm install && apt-get update && apt-get install -y python3 python3-pip && pip3 install -r ../ml/requirements.txt
     ```

4. **Environment Variables**:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   PORT=5000
   NODE_ENV=production
   ```

5. **Copy ML Files**:
   - Make sure `ml/` folder is in the same repo
   - Render will include it in deployment

---

## 🎨 Step 3: Deploy Frontend (Vercel - Recommended)

1. **Sign up**: [vercel.com](https://vercel.com) (use GitHub)

2. **Import Project**:
   - Click "New Project"
   - Import your GitHub repo
   - Root Directory: `frontend`

3. **Configure Build Settings**:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```

5. **Deploy**:
   - Vercel will auto-deploy
   - You'll get a URL like: `https://your-app.vercel.app`

### Alternative: Netlify

1. **Sign up**: [netlify.com](https://netlify.com)

2. **Deploy**:
   - New site from Git
   - Root Directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```

---

## 🐍 Step 4: Ensure Python Works on Backend

### For Railway:

Create `nixpacks.toml` in `backend/` folder:
```toml
[phases.setup]
nixPkgs = ["nodejs-18_x", "python39", "python39Packages.pip"]

[phases.install]
cmds = [
  "npm install",
  "pip3 install -r ../ml/requirements.txt"
]

[start]
cmd = "npm start"
```

### For Render:

Add to `backend/package.json` scripts:
```json
"postinstall": "pip3 install -r ../ml/requirements.txt || echo 'Python deps installed'"
```

---

## ✅ Step 5: Update Frontend API URL

Update `frontend/src/services/api.js` or use environment variable:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-backend-url.railway.app/api';
```

---

## 🔍 Step 6: Test Deployment

1. **Backend Health Check**:
   ```
   https://your-backend-url.railway.app/health
   ```

2. **Frontend**:
   - Visit your Vercel URL
   - Try making a prediction
   - Check browser console for errors

---

## 🐛 Troubleshooting

### Python Not Found
- Ensure Python is installed in build environment
- Use `python3` instead of `python` in `pythonPredict.js`

### ML Files Not Found
- Ensure `ml/` folder is in repository
- Check file paths are relative to backend

### CORS Errors
- Update backend `cors` settings to allow frontend domain
- Add frontend URL to allowed origins

### MongoDB Connection
- Check MongoDB Atlas IP whitelist
- Verify connection string format
- Test connection string locally first

---

## 📝 Quick Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Backend deployed (Railway/Render)
- [ ] Backend environment variables set
- [ ] Python dependencies installed
- [ ] ML files accessible
- [ ] Frontend deployed (Vercel/Netlify)
- [ ] Frontend API URL configured
- [ ] Test prediction works
- [ ] Health check endpoint works

---

## 🎉 You're Live!

Your app should now be accessible at:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.railway.app`


