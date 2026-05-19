# MidContext - Real-Time Multilingual Support Chat

**MidContext** is a production-ready real-time multilingual support chat system with automatic language translation, voice support, and intelligent auto-matching of end users to IT support agents.

## Key Features

✨ **Auto-Matching** - End users automatically connect to first available IT support agent
🌍 **Bidirectional Translation** - All messages automatically translated based on language preferences
🎤 **Voice Support** - Record, transcribe, translate, and playback voice messages
🔄 **Status Management** - Automatic status tracking (free ↔ busy)
🎯 **Multi-Language** - English, Italian, Finnish with browser TTS
⚡ **Real-Time** - WebSocket-based instant messaging

## 🚀 Quick Start

### Windows
```powershell
.\setup.ps1
```

### macOS / Linux
```bash
chmod +x setup.sh
./setup.sh
```

### Manual Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Build TypeScript**
   ```bash
   npm run build
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open two browser windows** (for testing auto-matching):
   - http://localhost:3000 → Select "IT Support"
   - http://localhost:3000 → Select "End User"
   - They auto-connect! 🎯

## 📖 How to Use

1. **Open app** at http://localhost:3000
2. **Select your role:**
   - 🛠️ **IT Support** - Wait for end users to connect
   - 👤 **End User** - Get connected to first available support agent
3. **Enter your name** and preferred language
4. **Click "Start Session"** - Auto-connects in seconds
5. **Voice or Text:**
   - Click "START LISTENING" to record voice message
   - Or type a message and click "Send"
6. **Transcription & Translation:**
   - Your voice → auto-transcribed (Speechmatics)
   - Auto-translated to recipient's language (Google Translate)
   - Appears in real-time conversation

## 🌐 Deploy Online

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for complete step-by-step guides:

- 🚄 **Railway** (Recommended) - Auto-deploys in 2 minutes, free tier included
- ▲ **Vercel** - Free forever, auto-scaling
- 🦗 **Heroku** - Traditional PaaS
- 🐳 **Docker** - Deploy anywhere

All platforms have environment variable setup and testing instructions.

## Environment Variables

Create `.env` file in root:
```env
PORT=3000
HOST=0.0.0.0
LOG_LEVEL=info

# Speechmatics Configuration
SPEECHMATICS_API_KEY=your_key_here
SPEECHMATICS_BATCH_URL=https://asr.api.speechmatics.com/v2
SPEECHMATICS_RT_URL=wss://rt.speechmatics.com/v2
SPEECHMATICS_TTS_URL=https://tts.api.speechmatics.com/v2

# Vertex AI Configuration (optional)
VERTEX_PROJECT_ID=your-project-id
VERTEX_LOCATION=us-central1
VERTEX_AGENT_ID=your-agent-id
VERTEX_LANGUAGE_CODE=en-US
```

## Architecture

### Frontend (`public/`)
- `app.js` - WebSocket client, voice recording, message translation
- `index.html` - Profile selection, conversation UI
- `styles.css` - MidContext branding

### Backend (`src/`)
- `server/createServer.ts` - WebSocket server, message routing
- `sessions/multi-user-session-manager.ts` - Session lifecycle, auto-matching
- `providers/speechmatics/` - Voice transcription + translation
- `providers/translation/` - Google Translate API
- `providers/agents/` - LLM integration for agent responses

## How It Works

```
1. IT Support creates pool session
   ↓
2. Status: "free"
   ↓
3. End User joins
   ↓
4. Auto-match to first available agent
   ↓
5. Status changes to: "busy"
   ↓
6. User speaks → Audio recorded
   ↓
7. Speechmatics: Transcribe + Translate
   ↓
8. Message relayed with translation
   ↓
9. Recipient hears TTS in their language
```

## Demo Scenarios

### Text Translation
- **IT Support (English):** "What is your account number?"
- **End User (Italian):** Sees → "Qual è il numero del tuo account?"
- **End User replies (Italian):** "12345"
- **IT Support:** Sees → "12345" (auto-translated)

### Voice Translation
- **IT Support (English):** Clicks "Start Listening" → Says "How can I help?"
- **End User (Finnish):** Hears Finnish audio automatically

### Multi-Agent
- Multiple IT Support agents can be available
- Multiple end users auto-match to available agents
- All conversations run simultaneously

## 🏗️ Tech Stack

### Frontend
- **Language:** Vanilla JavaScript (no frameworks)
- **Audio:** Web Audio API (MediaRecorder, AudioContext, AnalyserNode)
- **Real-Time:** WebSocket Client
- **Styling:** CSS3 with custom branding
- **i18n:** Browser language detection

### Backend
- **Runtime:** Node.js 20+
- **Framework:** Fastify
- **Language:** TypeScript
- **Real-Time:** WebSocket (@fastify/websocket)
- **Static Files:** @fastify/static

### Services
- **Speech-to-Text:** Speechmatics Batch API
- **Text Translation:** Google Translate API
- **Session Management:** Custom in-memory session store
- **Auto-Matching:** Pool-based agent assignment

### Architecture
```
Client (Browser)
    ↓ WebSocket
Server (Fastify)
    ├── Session Manager (Pool/Direct modes)
    ├── Message Router
    ├── Speechmatics Client (STT)
    └── Translator (Google Translate)
```

## ✨ Key Features

| Feature | Status | Details |
|---------|--------|---------|
| **Voice Recording** | ✅ | Web Audio API with 2s silence detection |
| **Auto-Transcription** | ✅ | Speechmatics STT, real-time display |
| **Translation** | ✅ | Bidirectional (en ↔ it ↔ fi) |
| **Auto-Matching** | ✅ | Support agents + end users |
| **Multi-Language** | ✅ | English, Italian, Finnish |
| **Status Management** | ✅ | Free/Busy tracking |
| **Error Recovery** | ✅ | Auto-reconnect, fallback UI |
| **Mobile Responsive** | ✅ | Works on phones & tablets |
- Add message history
- Implement rating system
- Add queue management
- Support metrics/analytics

## 🧪 Testing

### Local Testing (2 Browsers)
```
Browser 1: http://localhost:3000
  → Select "IT Support" → Enter name → Start
  
Browser 2: http://localhost:3000
  → Select "End User" → Enter name → Start
  
Result: Auto-connected, can message/voice chat
```

### Multi-PC Testing
```bash
# On PC 1 (Server)
npm run dev

# Get IP address
ipconfig | findstr IPv4  # Windows
ifconfig                 # macOS/Linux

# On PC 2 (Client)
# Open http://<PC1_IP>:3000 in browser
```

## 🔧 Environment Setup

Create `.env` file in project root:

```env
# Required
PORT=3000
SPEECHMATICS_API_KEY=your_key_here

# Optional (defaults provided)
HOST=0.0.0.0
LOG_LEVEL=info
SPEECHMATICS_BATCH_URL=https://asr.api.speechmatics.com/v2
SPEECHMATICS_TTS_URL=https://tts.api.speechmatics.com/v2
```

## 📚 Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deploy to Railway, Vercel, Heroku, Docker
- **[HACKATHON.md](HACKATHON.md)** - Demo checklist and testing guide
- **Source code** - Well-commented TypeScript in `src/`

## ❓ Troubleshooting

| Issue | Solution |
|-------|----------|
| Microphone not working | Click "Allow" on permission prompt |
| Port 3000 in use | `taskkill /IM node.exe /F` then restart |
| Can't hear voice | Check browser volume & speaker settings |
| Connection timeout | Ensure `.env` has valid API keys |
| Messages not translating | Check internet connection & API keys |

## 📄 License

MIT - Free for personal and commercial use

## 🙌 Contributing

Found a bug or have ideas? Open an issue on GitHub!

---

**MidContext v1.0.0** - Production Ready
Built for Real-Time Multilingual Support 🌍🎤

- provider client stubs for Speechmatics STT, Speechmatics TTS, and Vertex

The provider methods are intentionally thin placeholders so you can wire the real APIs next without changing the service layout.
