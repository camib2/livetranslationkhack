# MidContext - Hackathon Quick Start Guide

**MidContext** is a real-time multilingual support chat system with automatic language translation and voice support.

## Quick Start (One Command!)

### Windows
**Double-click:** `setup.bat`

Or open PowerShell and run:
```powershell
.\setup.ps1
```

### macOS / Linux
```bash
chmod +x setup.sh
./setup.sh
```

The server will start automatically at **http://localhost:3000**

## Live Demo (2 Browsers)

### Browser 1: IT Support Agent
1. Open http://localhost:3000
2. Select **"IT Support"**
3. Enter your name (e.g., "John Support")
4. Click **"Start Session"**
5. You'll see a pool code (e.g., "ABC123")

### Browser 2: End User
1. Open http://localhost:3000 in a new browser/tab
2. Select **"End User"**
3. Enter your name (e.g., "Alice Customer")
4. Click **"Start Session"**
5. **Auto-match!** You'll be connected to the IT Support agent

## Features to Demo

### 1. **Auto-Matching** ✅
- End users automatically match to first available IT support
- No session codes needed for end users
- Real-time status management

### 2. **Bidirectional Message Translation** ✅
- IT Support: English
- End User: Italian or Finnish
- Messages automatically translate for recipient's language

### 3. **Voice Support** 🎤
Click **"Start Listening"** to:
- Record audio with 2-second silence detection
- Audio auto-sends after silence
- Voice gets transcribed and translated
- Recipient hears audio in their language via text-to-speech

### 4. **Multi-Language Support** 🌍
- **English (en)**
- **Italian (it)**
- **Finnish (fi)**

Change language in the dropdown before connecting.

## Testing Scenarios

### Scenario 1: Text Translation
1. **Browser 1** (English): Type "I need help with my account"
2. **Browser 2** (Italian): Sees "Ho bisogno di aiuto con il mio account"
3. **Browser 2** (Italian): Type "Accedi al portale"
4. **Browser 1** (English): Sees "Log into the portal"

### Scenario 2: Voice Translation
1. **Browser 1** (English): Click "Start Listening" → Say "How can I reset my password"
2. **Browser 2** (Italian): Hears Italian voice: "Come posso reimpostare la mia password"
3. Click "Allow" when browser asks for microphone permission

### Scenario 3: Multi-User Support
1. Create multiple IT Support sessions (Browser 1, 3, 5...)
2. Create multiple End User sessions (Browser 2, 4, 6...)
3. Each end user auto-matches to an available agent
4. All conversations run simultaneously

## Troubleshooting

### "Microphone permission denied"
- Click the permission popup when browser asks
- Or check browser settings → Privacy & Security → Microphone → Allow this site

### "Server not starting"
- Make sure Node.js is installed: `node --version`
- Kill any process on port 3000: `netstat -ano | findstr :3000` (Windows)
- Try: `npm run dev` manually

### "Can't connect between browsers"
- Make sure both tabs are on http://localhost:3000
- Clear browser cache if needed
- Check browser console for errors (F12)

## For Multiple PCs

**PC 1 (Server):**
```powershell
.\setup.bat
# Note the IP address shown
```

**PC 2 (Client):**
Open browser and go to: `http://<PC1_IP>:3000`

Example: `http://192.168.1.100:3000`

## Architecture

```
Frontend (public/)
├── app.js          - WebSocket client, voice recording, UI logic
├── index.html      - Profile selection, chat interface
└── styles.css      - MidContext branding

Backend (src/)
├── server/         - WebSocket server, message routing
├── sessions/       - Session management & auto-matching
├── providers/
│   ├── speechmatics/ - Voice transcription & translation
│   ├── translation/  - Google Translate integration
│   └── agents/       - LLM agent for responses
└── utils/          - Helpers & utilities
```

## Key Technologies

- **Frontend:** Vanilla JavaScript (no frameworks)
- **Backend:** Fastify + TypeScript
- **WebSocket:** Real-time communication
- **Voice:** MediaRecorder + AudioContext (browser)
- **STT:** Speechmatics batch API
- **Translation:** Google Translate API + Speechmatics
- **TTS:** Browser speechSynthesis API

## Judges' Checklist ✅

- [x] Auto-matching works
- [x] Multi-language translation works
- [x] Voice recording works (with microphone permission)
- [x] UI is clean and intuitive
- [x] Real-time messaging works
- [x] Status management works
- [x] Multiple simultaneous sessions work

## Questions?

Check the `SKILL.md` or `README.md` files for detailed documentation.

---

**MidContext v1.0.0** - Built for the Hackathon 🚀
