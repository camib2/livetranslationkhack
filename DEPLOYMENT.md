# MidContext - Deployment Guide

## 🚀 Deploy Online

Choose your preferred hosting platform:

### **Option 1: Railway (Recommended - Easiest)**

Railway auto-detects Node.js and deploys instantly.

**Steps:**
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "Create New Project" → "Deploy from GitHub"
4. Select this repository
5. Railway auto-configures everything
6. Add environment variables in Project Settings:
   ```env
   SPEECHMATICS_API_KEY=your_key_here
   PORT=3000
   ```
7. Deploy button → Done! 🎉

**Cost:** Free tier with $5/month credits, then pay-as-you-go ($0.000139/second)

---

### **Option 2: Vercel (Simple, Free)**

Fast deployment with auto-scaling.

**Steps:**
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Select this GitHub repo
4. Framework Preset: **Other** (Node.js)
5. Root Directory: `.`
6. Environment Variables:
   ```env
   SPEECHMATICS_API_KEY=your_key_here
   ```
7. Click "Deploy" → Done! 🎉

**Cost:** Free for hobby projects

---

### **Option 3: Heroku (Traditional)**

Classic platform-as-a-service.

**Steps:**
```bash
npm install -g heroku
heroku login
heroku create your-app-name
heroku config:set SPEECHMATICS_API_KEY=your_key_here
git push heroku main
heroku open
```

**Cost:** $7-50/month (free tier discontinued)

---

### **Option 4: Docker + Any Host**

Deploy with Docker to any cloud provider.

**Create Dockerfile:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

**Build & Run Locally:**
```bash
docker build -t midcontext .
docker run -p 3000:3000 \
  -e SPEECHMATICS_API_KEY=your_key_here \
  -e PORT=3000 \
  midcontext
```

**Deploy to:**
- **AWS ECS** - Container orchestration
- **Google Cloud Run** - Serverless containers
- **DigitalOcean App Platform** - Simple docker deployment
- **Azure Container Instances** - Azure's serverless containers

---

## 📋 Environment Variables

All deployment platforms need these variables:

| Variable | Value | Required |
|----------|-------|----------|
| `PORT` | 3000 | No (defaults to 3000) |
| `HOST` | 0.0.0.0 | No |
| `SPEECHMATICS_API_KEY` | Your Speechmatics key | Yes |
| `SPEECHMATICS_BATCH_URL` | https://asr.api.speechmatics.com/v2 | No |
| `SPEECHMATICS_RT_URL` | wss://rt.speechmatics.com/v2 | No |
| `SPEECHMATICS_TTS_URL` | https://tts.api.speechmatics.com/v2 | No |

## 🧪 Test Your Deployment

Once deployed, open your app URL in two browser windows:

1. **Browser 1:** Select "IT Support" → Enter name → Click "Start Session"
2. **Browser 2:** Select "End User" → Enter name → Click "Start Session"
3. They should auto-match and connect instantly! 🎯

## 📊 Performance Tips

- **Railway**: ~50ms response time, auto-scaling
- **Vercel**: ~100ms response time, built-in CDN
- **Heroku**: ~200ms response time, manual scaling
- **Docker**: Depends on host provider

## 🐛 Troubleshooting

**"Port already in use"**
```bash
# Kill the process
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000   # Windows
```

**"Cannot connect to Speechmatics"**
- Check your SPEECHMATICS_API_KEY is valid
- Verify network connectivity
- Check firewall rules

**"WebSocket connection failed"**
- Ensure your deployment supports WebSocket
- Railway, Vercel, Heroku all support WebSocket
- Check CORS settings if deploying to subdomain

## 🔒 Security Checklist

- [ ] SPEECHMATICS_API_KEY is in environment variables (not in code)
- [ ] HTTPS enabled (all platforms provide this by default)
- [ ] Database credentials (if using database) in environment
- [ ] Rate limiting enabled for API endpoints
- [ ] CORS properly configured for your domain

---

**Questions?** Check [README.md](README.md) for architecture details or open an issue on GitHub!
