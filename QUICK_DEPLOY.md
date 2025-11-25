# ⚡ Quick Deployment Steps

## 🎯 Fastest Way to Deploy (15 minutes)

### 1. MongoDB Atlas (2 min)
- Sign up: https://www.mongodb.com/cloud/atlas
- Create free cluster
- Get connection string
- Whitelist IP: `0.0.0.0/0`

### 2. Deploy Backend - Railway (5 min)
1. Go to https://railway.app
2. Sign up with GitHub
3. New Project → Deploy from GitHub
4. Select your repo → Choose `backend` folder
5. Add Environment Variables:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   PORT=5000
   NODE_ENV=production
   ```
6. Deploy → Copy URL (e.g., `https://your-app.railway.app`)

### 3. Deploy Frontend - Vercel (5 min)
1. Go to https://vercel.com
2. Sign up with GitHub
3. New Project → Import repo
4. Root Directory: `frontend`
5. Add Environment Variable:
   ```
   VITE_API_URL=https://your-app.railway.app/api
   ```
6. Deploy → Copy URL (e.g., `https://your-app.vercel.app`)

### 4. Update Backend CORS (2 min)
1. Go back to Railway
2. Add Environment Variable:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
3. Redeploy

### 5. Test (1 min)
- Visit frontend URL
- Make a prediction
- Check if it works! ✅

---

## 🔗 Your Live URLs
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.railway.app`
- API Health: `https://your-app.railway.app/health`

---

## 📝 Notes
- All services have free tiers
- Railway gives $5 free credit monthly
- Vercel is free for personal projects
- MongoDB Atlas has 512MB free storage

---

## 🐛 If Python Fails
Railway should auto-detect Python from `nixpacks.toml`.
If not, check Railway logs and ensure `ml/` folder is included.

---

## ✅ Done!
Share your frontend URL on LinkedIn! 🚀

