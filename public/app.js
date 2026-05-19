// Internationalization (i18n) translations
const i18n = {
  en: {
    modal_title: "Select Your Profile",
    select_profile: "Who are you?",
    profile_support: "IT Support",
    profile_enduser: "End User",
    user_name_label: "Your Name",
    support_status_label: "Your Status",
    status_free: "Available",
    status_busy: "Busy",
    select_language: "Select your language",
    session_type: "Session Mode",
    session_create: "Join Support Session",
    session_pool_wait: "Wait for Support Request",
    session_create_direct: "Create Direct Session",
    session_code_label: "Enter Session Code",
    lang_english: "English",
    lang_italian: "Italian",
    lang_finnish: "Finnish",
    button_start: "Start Session",
    button_end: "End Session",
    button_record: "Start Recording",
    button_replay: "Replay Last Reply",
    button_send: "Send Transcript",
    button_clear: "Clear",
    button_cancel: "Cancel",
    waiting_title: "Connecting...",
    waiting_message: "Please wait while we connect you to an available agent",
    waiting_support: "Waiting for users to join...",
    eyebrow: "Voice Agent Demo",
    title: "Live Translation Console",
    subtitle: "Record a customer turn, transcribe it with Speechmatics, route the transcript through the agent, and play the returned voice response.",
    label_agent_language: "Agent language",
    label_user_language: "Expected user language",
    label_session: "Session",
    label_status: "Status",
    heading_transcript: "Transcript Input",
    desc_transcript: "Speechmatics transcript or manual test utterance.",
    heading_output: "Agent Output",
    desc_output: "Response text returned by the backend and spoken locally if no audio bytes exist yet.",
    heading_timeline: "Event Timeline",
    desc_timeline: "WebSocket-level lifecycle for debugging the pipeline.",
    heading_notes: "Usage Notes",
    note1: "Recording sends audio to the middleware, then to Speechmatics STT.",
    note2: "Manual transcript still bypasses STT for fast agent testing.",
    note3: "The TTS provider is still stubbed, so the page uses browser playback fallback."
  },
  it: {
    modal_title: "Seleziona il tuo profilo",
    select_profile: "Chi sei?",
    profile_support: "Supporto IT",
    profile_enduser: "Utente finale",
    user_name_label: "Il tuo nome",
    support_status_label: "Il tuo stato",
    status_free: "Disponibile",
    status_busy: "Occupato",
    select_language: "Seleziona la tua lingua",
    session_type: "Modalità sessione",
    session_create: "Unisciti a sessione di supporto",
    session_pool_wait: "Attendi richiesta di supporto",
    session_create_direct: "Crea sessione diretta",
    session_code_label: "Inserisci codice sessione",
    lang_english: "Inglese",
    lang_italian: "Italiano",
    lang_finnish: "Finlandese",
    button_start: "Inizia sessione",
    button_end: "Termina sessione",
    button_record: "Avvia registrazione",
    button_replay: "Riproduci risposta",
    button_send: "Invia trascrizione",
    button_clear: "Cancella",
    button_cancel: "Annulla",
    waiting_title: "Connessione...",
    waiting_message: "Attendere mentre ti connettiamo a un agente disponibile",
    waiting_support: "Attesa di utenti...",
    eyebrow: "Demo agente vocale",
    title: "Console di traduzione dal vivo",
    subtitle: "Registra un turno del cliente, trascrivilo con Speechmatics, instrada la trascrizione attraverso l'agente e riproduci la risposta vocale restituita.",
    label_agent_language: "Lingua dell'agente",
    label_user_language: "Lingua utente prevista",
    label_session: "Sessione",
    label_status: "Stato",
    heading_transcript: "Input trascrizione",
    desc_transcript: "Trascrizione Speechmatics o enunciato di test manuale.",
    heading_output: "Output dell'agente",
    desc_output: "Testo di risposta restituito dal backend e parlato localmente se non esistono ancora byte audio.",
    heading_timeline: "Cronologia degli eventi",
    desc_timeline: "Ciclo di vita a livello WebSocket per il debug della pipeline.",
    heading_notes: "Note di utilizzo",
    note1: "La registrazione invia audio al middleware, quindi a Speechmatics STT.",
    note2: "La trascrizione manuale evita comunque STT per test rapido dell'agente.",
    note3: "Il provider TTS è ancora stub, quindi la pagina utilizza il fallback di riproduzione del browser."
  },
  fi: {
    modal_title: "Valitse profiilisi",
    select_profile: "Kuka olet?",
    profile_support: "IT-tuki",
    profile_enduser: "Loppukäyttäjä",
    user_name_label: "Sinun nimesi",
    support_status_label: "Sinun tilasi",
    status_free: "Saatavilla",
    status_busy: "Varattu",
    select_language: "Valitse kielesi",
    session_type: "Istunnon tila",
    session_create: "Liity tukistuntoon",
    session_pool_wait: "Odota tukipyynnöstä",
    session_create_direct: "Luo suora istunto",
    session_code_label: "Kirjoita istuntkoodi",
    lang_english: "Englanti",
    lang_italian: "Italia",
    lang_finnish: "Suomi",
    button_start: "Aloita istunto",
    button_end: "Lopeta istunto",
    button_record: "Aloita nauhoitus",
    button_replay: "Toista vastaus uudelleen",
    button_send: "Lähetä litterointi",
    button_clear: "Tyhjennä",
    button_cancel: "Peruuta",
    waiting_title: "Yhdistäminen...",
    waiting_message: "Odota, kun yhdistämme sinut käytettävissä olevaan agentiin",
    waiting_support: "Odottamassa käyttäjiä liittyä...",
    eyebrow: "Ääniagenttidemo",
    title: "Live-käännöskonsooli",
    subtitle: "Tallenna asiakaskierros, litterooi se Speechmaticsin avulla, reitita litterointi agentin kautta ja toista palautettu äänivastaus.",
    label_agent_language: "Agentin kieli",
    label_user_language: "Odotettu käyttäjän kieli",
    label_session: "Istunto",
    label_status: "Tila",
    heading_transcript: "Litteroinnin syöttö",
    desc_transcript: "Speechmatics-litterointi tai manuaalinen testilauseke.",
    heading_output: "Agentin tulos",
    desc_output: "Taustaosasta palautettu vastaus teksti ja puhuttu paikallisesti, jos äänibyteä ei vielä ole.",
    heading_timeline: "Tapahtumajärjestys",
    desc_timeline: "WebSocket-tason elinkaari putken virheenetsintää varten.",
    heading_notes: "Käyttöohjeet",
    note1: "Nauhoitus lähettää äänen välikerrokseen ja sitten Speechmatics STT:lle.",
    note2: "Manuaalinen litterointi silti ohittaa STT:n agentin nopean testauksen vuoksi.",
    note3: "TTS-palvelun toimittaja on vielä pino, joten sivu käyttää selaimen takaisinmeno-vaihtoehtoa."
  }
};

// State management
let userProfile = null;
let userName = "";
let userStatus = "free";
let userLanguage = localStorage.getItem("userLanguage") || "en";
let currentLanguage = userLanguage;
// Set browser reference language on page load
document.documentElement.lang = userLanguage;
let sessionMode = "create"; // "create" or "join"
let joinSessionCode = null;
let currentSessionCode = null;

const profileModal = document.querySelector("#profileModal");
const profileLanguageSelect = document.querySelector("#profileLanguageSelect");
const profileSubmitButton = document.querySelector("#profileSubmitButton");
const userNameInput = document.querySelector("#userNameInput");
const joinSessionSection = document.querySelector("#joinSessionSection");
const sessionCodeInput = document.querySelector("#sessionCodeInput");

// Conversation view elements
const conversationView = document.querySelector("#conversationView");
const conversationContainer = document.querySelector("#conversationContainer");
const chatSessionCode = document.querySelector("#chatSessionCode");
const chatStatus = document.querySelector("#chatStatus");
const messageInput = document.querySelector("#messageInput");
const sendMessageButton = document.querySelector("#sendMessageButton");
const endSessionButton = document.querySelector("#endSessionButton");

// Waiting view elements
const cancelWaitingButton = document.querySelector("#cancelWaitingButton");

const connectButton = document.querySelector("#connectButton");
const disconnectButton = document.querySelector("#disconnectButton");
const sendTranscriptButton = document.querySelector("#sendTranscriptButton");
const clearTranscriptButton = document.querySelector("#clearTranscriptButton");
const speakButton = document.querySelector("#speakButton");
const replayButton = document.querySelector("#replayButton");
const agentLanguageSelect = document.querySelector("#agentLanguage");
const expectedUserLanguageSelect = document.querySelector("#expectedUserLanguage");
const transcriptInput = document.querySelector("#transcriptInput");
const agentResponse = document.querySelector("#agentResponse");
const statusInput = document.querySelector("#status");
const sessionIdInput = document.querySelector("#sessionId");
const eventLog = document.querySelector("#eventLog");
const audioPlayer = document.querySelector("#audioPlayer");

// Voice panel elements
const voiceStartButton = document.querySelector("#voiceStartButton");
const voiceStopButton = document.querySelector("#voiceStopButton");
const voiceIndicator = document.querySelector("#voiceIndicator");
const voiceStatus = document.querySelector("#voiceStatus");
const voiceIndicatorBottom = document.querySelector("#voiceIndicatorBottom");
const voiceStatusBottom = document.querySelector("#voiceStatusBottom");
const interimTranscript = document.querySelector("#interimTranscript");
const finalTranscript = document.querySelector("#finalTranscript");
const transcriptionDisplay = document.querySelector("#transcriptionDisplay");

let socket = null;
let mediaRecorder = null;
let mediaStream = null;
let recordedChunks = [];
let lastReplyText = "";

// Audio recording setup (replaces Web Speech API with MediaRecorder)
let isListening = false;
let silenceDetector = null;
let silenceTimeout = 2000; // 2 seconds of silence before sending
let lastAudioTime = 0;
let silenceCheckInterval = null;
let audioContext = null;
let analyser = null;

// Check if microphone is supported
const microphoneSupported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

const setupAudioRecording = async () => {
  try {
    if (!microphoneSupported) {
      throw new Error("Your browser does not support microphone access. Please use Chrome, Firefox, or Safari.");
    }
    
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    // Setup audio context for silence detection
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    const source = audioContext.createMediaStreamAudioSource(mediaStream);
    source.connect(analyser);
    // Connect to destination so audio context processes the stream
    if (audioContext.state === 'suspended') {
      audioContext.resume();
      addLog("AudioContext resumed");
    }
    
    addLog(`✓ Audio context ready - sample rate: ${audioContext.sampleRate}Hz`);
    console.log(`Audio setup: context=${audioContext.state}, fftSize=${analyser.fftSize}`);
    
    // Create MediaRecorder
    mediaRecorder = new MediaRecorder(mediaStream);
    recordedChunks = [];
    addLog(`✓ MediaRecorder created - mimeType: ${mediaRecorder.mimeType}`);
    console.log(`MediaRecorder: state=${mediaRecorder.state}, mimeType=${mediaRecorder.mimeType}`);

    mediaRecorder.ondataavailable = (event) => {
      recordedChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      // Stop silence detection
      if (silenceCheckInterval) clearInterval(silenceCheckInterval);
      
      const audioBlob = new Blob(recordedChunks, { type: "audio/webm" });
      recordedChunks = [];
      
      if (audioBlob.size > 100) { // Only send if audio is not empty
        addLog(`Recorded ${(audioBlob.size / 1024).toFixed(1)} KB of audio. Sending to Speechmatics.`);
        updateChatStatus("Sending audio to Speechmatics");
        sendEvent("audio.upload", { audioBlob, mimeType: "audio/webm" });
      }
      
      // Stop the audio stream
      mediaStream.getTracks().forEach(track => track.stop());
      mediaStream = null;
    };

    addLog("Audio recording ready");
  } catch (error) {
    console.error("Failed to setup audio recording:", error);
    mediaRecorder = null;
    
    let errorMessage = "Error: Could not access microphone";
    if (error.message && error.message.includes("browser does not support")) {
      errorMessage = error.message;
    } else if (error.name === "NotAllowedError") {
      errorMessage = "Microphone permission denied. Please allow microphone access to use voice recording.";
    } else if (error.name === "NotFoundError") {
      errorMessage = "No microphone device found";
    } else if (error.name === "NotReadableError") {
      errorMessage = "Microphone is already in use";
    }
    
    addLog(errorMessage);
    if (voiceStatus) voiceStatus.textContent = errorMessage;
    if (voiceStatusBottom) voiceStatusBottom.textContent = errorMessage;
    // Don't disable the button - let user retry after allowing permissions
    // if (voiceStartButton) voiceStartButton.disabled = true;
  }
};

let lastLogTime = 0;

const startVoiceListening = async () => {
  if (!mediaRecorder) {
    addLog("Requesting microphone access...");
    await setupAudioRecording();
  }
  
  if (!mediaRecorder) {
    addLog("Cannot start recording - microphone not available");
    return;
  }
  
  if (mediaRecorder.state === 'recording') {
    addLog("Already recording");
    return;
  }

  isListening = true;
  recordedChunks = [];
  lastAudioTime = Date.now();
  lastLogTime = Date.now();

  if (voiceStartButton) voiceStartButton.classList.add("hidden");
  if (voiceStopButton) voiceStopButton.classList.remove("hidden");
  if (voiceIndicator) {
    voiceIndicator.classList.remove("idle");
    voiceIndicator.classList.add("listening");
  }
  if (voiceStatus) voiceStatus.textContent = "Listening... (speak now)";
  if (voiceIndicatorBottom) voiceIndicatorBottom.classList.remove("hidden");
  if (voiceStatusBottom) voiceStatusBottom.textContent = "Listening...";
  if (interimTranscript) interimTranscript.textContent = "";
  if (finalTranscript) finalTranscript.textContent = "Recording...";

  try {
    mediaRecorder.start();
    addLog("Recording started - speak now!");
  } catch (error) {
    addLog(`Error starting recording: ${error.message}`);
    isListening = false;
    if (voiceStartButton) voiceStartButton.classList.remove("hidden");
    if (voiceStopButton) voiceStopButton.classList.add("hidden");
    return;
  }

  // Detect silence using audio levels
  silenceCheckInterval = setInterval(() => {
    if (!isListening || !analyser) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);
    
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const average = sum / dataArray.length;

    // Log audio levels periodically (every 1 second)
    const now = Date.now();
    if (now - lastLogTime > 1000) {
      const silenceTime = (now - lastAudioTime) / 1000;
      console.log(`🎤 Audio level: ${average.toFixed(1)} dB | Silence: ${silenceTime.toFixed(1)}s`);
      addLog(`Audio: ${average.toFixed(1)} dB | Silence: ${silenceTime.toFixed(1)}s`);
      lastLogTime = now;
    }

    // If audio level is significant, update lastAudioTime
    if (average > 30) { // Threshold for detecting audio
      lastAudioTime = Date.now();
      if (average > 50) {
        console.log(`🔊 Audio detected! Level: ${average.toFixed(1)}`);
      }
    }

    // Check if 2 seconds of silence
    if (now - lastAudioTime > silenceTimeout) {
      console.log(`⏹️ Silence timeout reached - stopping recording`);
      stopVoiceListening();
    }
  }, 100);
};

const stopVoiceListening = () => {
  if (!mediaRecorder || mediaRecorder.state !== 'recording') return;

  isListening = false;
  if (silenceCheckInterval) clearInterval(silenceCheckInterval);

  if (voiceStartButton) voiceStartButton.classList.remove("hidden");
  if (voiceStopButton) voiceStopButton.classList.add("hidden");
  if (voiceIndicator) {
    voiceIndicator.classList.add("idle");
    voiceIndicator.classList.remove("listening");
  }
  if (voiceStatus) voiceStatus.textContent = "Processing...";
  if (voiceIndicatorBottom) voiceIndicatorBottom.classList.add("hidden");
  if (finalTranscript) finalTranscript.textContent = "Processing audio...";

  mediaRecorder.stop();
};

// Text-to-Speech for responses
const languageCodeToSpeechLanguage = (lang) => {
  const map = {
    en: "en-US",
    it: "it-IT",
    fi: "fi-FI"
  };
  return map[lang] || "en-US";
};

const speakText = (text, lang = userLanguage) => {
  if (!("speechSynthesis" in window)) {
    console.warn("Speech Synthesis API not supported");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = languageCodeToSpeechLanguage(lang);
  utterance.rate = 0.95;
  utterance.pitch = 1;
  utterance.volume = 1;

  window.speechSynthesis.cancel(); // Cancel any ongoing speech
  window.speechSynthesis.speak(utterance);
};

const canRecordAudio = Boolean(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);

// Utility functions
function t(key) {
  return i18n[currentLanguage]?.[key] || i18n["en"][key] || key;
}

function updateUI() {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    const text = t(key);
    
    // Handle different element types
    if (element.tagName === "BUTTON" || element.tagName === "LABEL" || element.tagName === "SPAN" || element.tagName === "P" || element.tagName === "H1" || element.tagName === "H2" || element.tagName === "LI") {
      element.textContent = text;
    }
  });
  
  // Update option elements
  document.querySelectorAll("option[data-i18n]").forEach((option) => {
    const key = option.getAttribute("data-i18n");
    option.textContent = t(key);
  });
}

function setLanguage(lang) {
  currentLanguage = lang;
  userLanguage = lang;
  localStorage.setItem("userLanguage", lang);
  
  // Set browser reference language
  document.documentElement.lang = lang;
  
  updateUI();
}

function addLog(message) {
  const item = document.createElement("li");
  const timestamp = new Date().toLocaleTimeString();
  item.innerHTML = `<time>${timestamp}</time> ${message}`;
  eventLog.prepend(item);
}

function setStatus(message) {
  statusInput.value = message;
}

function setConnectedUi(isConnected) {
  connectButton.disabled = isConnected;
  disconnectButton.disabled = !isConnected;
  sendTranscriptButton.disabled = !isConnected;
  speakButton.disabled = !isConnected || !canRecordAudio;
  agentLanguageSelect.disabled = isConnected;
  expectedUserLanguageSelect.disabled = isConnected;
  messageInput.disabled = !isConnected;
  sendMessageButton.disabled = !isConnected;
  endSessionButton.disabled = !isConnected;
}

function createSocketUrl() {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/ws/voice`;
}

function sendEvent(type, payload = {}) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    throw new Error("WebSocket is not connected");
  }

  socket.send(JSON.stringify({ type, payload }));
}

function getSelectedLanguages() {
  return {
    agentLanguage: agentLanguageSelect.value,
    expectedUserLanguage: expectedUserLanguageSelect.value
  };
}

function getRecorderOptions() {
  const supportedTypes = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];
  const mimeType = supportedTypes.find((type) => MediaRecorder.isTypeSupported(type));
  return mimeType ? { mimeType } : {};
}

function stopMediaStream() {
  if (!mediaStream) {
    return;
  }

  for (const track of mediaStream.getTracks()) {
    track.stop();
  }

  mediaStream = null;
}

function stopRecording() {
  if (!mediaRecorder || mediaRecorder.state === "inactive") {
    return;
  }

  mediaRecorder.stop();
}

function resetRecordingUi() {
  mediaRecorder = null;
  recordedChunks = [];
}

async function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      resolve(result.includes("base64,") ? result.split("base64,")[1] : result);
    };
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read audio recording"));
    reader.readAsDataURL(blob);
  });
}

async function startRecording() {
  if (!canRecordAudio) {
    setStatus("Browser audio recording is unavailable");
    addLog("Browser audio recording is unavailable.");
    return;
  }

  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });

    recordedChunks = [];
    recorder = new MediaRecorder(mediaStream, getRecorderOptions());
    const recorderMimeType = recorder.mimeType || "audio/webm";

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    recorder.onerror = (event) => {
      addLog(`Recording error: ${event.error?.message ?? "unknown recording error"}`);
      setStatus("Recording error");
      stopMediaStream();
      resetRecordingUi();
    };

    recorder.onstop = async () => {
      try {
        stopMediaStream();

        if (recordedChunks.length === 0) {
          setStatus("No audio captured");
          addLog("No audio was captured.");
          return;
        }

        const audioBlob = new Blob(recordedChunks, { type: recorderMimeType });
        const audioBase64 = await blobToBase64(audioBlob);
        const languages = getSelectedLanguages();

        addLog(`Recorded ${(audioBlob.size / 1024).toFixed(1)} KB of audio. Sending to Speechmatics.`);
        setStatus("Sending audio to Speechmatics");
        sendEvent("audio.recorded", {
          audioBase64,
          mimeType: audioBlob.type || recorderMimeType,
          ...languages
        });
      } catch (error) {
        addLog(`Audio upload failed: ${error instanceof Error ? error.message : "unknown error"}`);
        setStatus("Audio upload failed");
      } finally {
        resetRecordingUi();
      }
    };

    recorder.start();
    speakButton.classList.add("is-recording");
    speakButton.textContent = "Stop Recording";
    setStatus("Recording");
    addLog(`Recording started with ${recorderMimeType}.`);
  } catch (error) {
    stopMediaStream();
    resetRecordingUi();
    addLog(`Microphone access failed: ${error instanceof Error ? error.message : "unknown error"}`);
    setStatus("Microphone access failed");
  }
}

function speakReply(text) {
  if (!text) {
    return;
  }

  lastReplyText = text;
  replayButton.disabled = false;

  if (!window.speechSynthesis) {
    addLog("Browser speech synthesis is unavailable.");
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = agentLanguageSelect.value || "en";
  window.speechSynthesis.speak(utterance);
}

// Function to establish WebSocket connection
const connectToWebSocket = () => {
  socket = new WebSocket(createSocketUrl());
  setStatus("Connecting");

  socket.addEventListener("open", () => {
    addLog("WebSocket connected.");
    const payload = {
      ...getSelectedLanguages(),
      profile: userProfile,
      sessionMode: sessionMode,
      userName: userName
    };
    
    if (userProfile === "support") {
      payload.status = userStatus;
    }
    
    if (sessionMode === "join" && joinSessionCode) {
      payload.joinCode = joinSessionCode;
    }
    
    sendEvent("session.start", payload);
  });

  socket.addEventListener("message", async (event) => {
    const message = JSON.parse(event.data);

    switch (message.type) {
      case "session.ready":
        sessionIdInput.value = message.payload.sessionId;
        let sessionCode = message.payload.sessionCode || "Unknown";
        updateChatSessionCode(sessionCode);
        updateChatStatus("Ready");
        hideWaitingView(); // Hide waiting screen
        showConversationView();
        
        if (message.payload.sessionCode) {
          addLog(`✅ Session created! Code: ${message.payload.sessionCode}`);
        } else {
          addLog(`✅ Joined session: ${message.payload.sessionId}`);
        }
        addLog(
          `Session ready: ${message.payload.sessionId} (${message.payload.expectedUserLanguage} -> ${message.payload.agentLanguage})`
        );
        setConnectedUi(true);
        break;

      case "session.status":
        setStatus(message.payload.message ?? message.payload.state);
        addLog(`Session status: ${message.payload.state}`);
        break;

      case "transcript.final":
        transcriptInput.value = message.payload.text;
        addLog(`Speechmatics transcript (${message.payload.expectedUserLanguage}): "${message.payload.text}"`);
        if (message.payload.translatedText) {
          addLog(`Speechmatics translation (${message.payload.agentLanguage}): "${message.payload.translatedText}"`);
        }
        break;

      case "agent.response":
        addLog(`Agent response received: "${message.payload.text}"`);
        
        // Handle relayed user message from other participant
        if (message.payload.isUserMessage) {
          addLog(`Relayed user message from ${message.payload.fromProfile}: "${message.payload.text}"`);
          // Display with the sender's profile
          const senderProfile = message.payload.fromProfile;
          addMessageToConversation(message.payload.text, senderProfile);
          // Play audio in current user's language after message is displayed
          speakText(message.payload.text, currentLanguage);
          updateChatStatus("Ready");
        } 
        // Handle agent response or relayed agent response
        else if (message.payload.isAgentResponse) {
          // Relayed agent response from other participant
          addLog(`Relayed agent response: "${message.payload.text}"`);
          addMessageToConversation(message.payload.text, "support", message.payload.audioBase64, !!message.payload.audioBase64);
          // Don't auto-speak relayed agent responses
          updateChatStatus("Ready");
        } 
        else {
          // Direct agent response (from orchestrator)
          addLog(`Direct agent response: "${message.payload.text}"`);
          agentResponse.value = message.payload.text;
          addMessageToConversation(message.payload.text, "support", message.payload.audioBase64, !!message.payload.audioBase64);
          
          // Auto-speak the response in the agent's language
          speakText(message.payload.text, message.payload.agentLanguage || "en");
          updateChatStatus("Ready");
        }
        break;

      case "tts.ready":
        addLog("TTS response received.");
        if (message.payload.audioBase64) {
          const audioUrl = `data:${message.payload.mimeType};base64,${message.payload.audioBase64}`;
          audioPlayer.src = audioUrl;
          await audioPlayer.play().catch(() => undefined);
        } else {
          speakReply(message.payload.text);
        }
        break;

      case "error":
        addLog(`Server error: ${message.payload.message}`);
        setStatus(`Error: ${message.payload.message}`);
        break;

      default:
        addLog(`Unhandled message type: ${message.type}`);
    }
  });

  socket.addEventListener("close", () => {
    addLog("WebSocket disconnected.");
    setStatus("Disconnected");
    sessionIdInput.value = "Not started";
    setConnectedUi(false);
    stopRecording();
    stopMediaStream();
    hideConversationView();
    socket = null;
  });

  socket.addEventListener("error", () => {
    addLog("WebSocket transport error.");
    setStatus("Connection error");
  });
};

// Add click listener to connectButton if it exists (for backwards compatibility)
if (connectButton) {
  connectButton.addEventListener("click", connectToWebSocket);
}

disconnectButton.addEventListener("click", () => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    return;
  }

  sendEvent("session.end", {});
});

sendTranscriptButton.addEventListener("click", () => {
  const text = transcriptInput.value.trim();
  if (!text) {
    setStatus("Enter a transcript first");
    return;
  }

  addLog(`Manual transcript sent to agent (${agentLanguageSelect.value}): "${text}"`);
  // Add user's message to conversation
  addMessageToConversation(text, userProfile, null, false);
  sendEvent("transcript.final", { text });
  setStatus("Transcript sent");
});

clearTranscriptButton.addEventListener("click", () => {
  transcriptInput.value = "";
});

// Conversation View Handlers
sendMessageButton.addEventListener("click", () => {
  const text = messageInput.value.trim();
  if (!text) {
    return;
  }

  addLog(`Manual message sent from conversation: "${text}"`);
  addMessageToConversation(text, userProfile, null, false);
  sendEvent("transcript.final", { text });
  messageInput.value = "";
  updateChatStatus("Processing...");
});

messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessageButton.click();
  }
});

endSessionButton.addEventListener("click", () => {
  sendEvent("session.end", {});
  hideConversationView();
  showProfileModal();
  currentTranscript = "";
  allFinalTranscripts = [];
  userProfile = null;
  addLog("Session ended. Ready for a new session.");
});

cancelWaitingButton.addEventListener("click", () => {
  hideWaitingView();
  showProfileModal();
  // Disconnect from server
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.close();
  }
  currentTranscript = "";
  allFinalTranscripts = [];
  userProfile = null;
  addLog("Connection cancelled. Returning to profile selection.");
});

speakButton.addEventListener("click", async () => {
  if (recorder && recorder.state === "recording") {
    stopRecording();
    return;
  }

  await startRecording();
});

replayButton.addEventListener("click", () => {
  speakReply(lastReplyText);
});

// Profile Modal Handlers
function showProfileModal() {
  profileModal.classList.remove("hidden");
}

function hideProfileModal() {
  profileModal.classList.add("hidden");
}

// Conversation View Functions
function showConversationView() {
  conversationView.classList.remove("hidden");
  conversationContainer.scrollTop = conversationContainer.scrollHeight;
}

function hideConversationView() {
  conversationView.classList.add("hidden");
  conversationContainer.innerHTML = ""; // Clear messages
}

function showWaitingView(isSupport, sessionCode = null) {
  const waitingView = document.getElementById("waitingView");
  const waitingTitle = document.getElementById("waitingTitle");
  const waitingMessage = document.getElementById("waitingMessage");
  const waitingSessionCode = document.getElementById("waitingSessionCode");
  
  waitingView.classList.remove("hidden");
  
  if (isSupport) {
    waitingTitle.textContent = t("waiting_title");
    waitingMessage.textContent = t("waiting_support");
    if (sessionCode) {
      waitingSessionCode.textContent = `Session Code: ${sessionCode}`;
      waitingSessionCode.classList.remove("hidden");
    } else {
      waitingSessionCode.classList.add("hidden");
    }
  } else {
    waitingTitle.textContent = t("waiting_title");
    waitingMessage.textContent = t("waiting_message");
    waitingSessionCode.classList.add("hidden");
  }
}

function hideWaitingView() {
  const waitingView = document.getElementById("waitingView");
  waitingView.classList.add("hidden");
}

function updateChatStatus(status) {
  chatStatus.textContent = status;
}

function updateChatSessionCode(code) {
  currentSessionCode = code;
  chatSessionCode.textContent = `Session: ${code || "-"}`;
}

function addMessageToConversation(text, fromProfile, audioBase64, hasPlayButton) {
  const messageGroup = document.createElement("div");
  messageGroup.className = `message-group ${fromProfile === "enduser" ? "user" : "support"}`;

  const avatar = document.createElement("div");
  avatar.className = "message-avatar";
  
  // Create SVG icon avatar instead of text
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "currentColor");
  
  if (fromProfile === "enduser") {
    // User icon for end user
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M12 12C13.66 12 15 10.66 15 9C15 7.34 13.66 6 12 6C10.34 6 9 7.34 9 9C9 10.66 10.34 12 12 12ZM12 14C10.67 14 8 14.9 8 16.14V18H16V16.14C16 14.9 13.33 14 12 14Z");
    svg.appendChild(path);
  } else {
    // Support/Help icon for support
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 19H11V17H13V19ZM15.07 11.25L14.17 12.17C13.45 12.9 13 13.5 13 15H11V14.5C11 13.4 11.45 12.4 12.17 11.67L13.41 10.41C13.78 10.05 14 9.55 14 9C14 7.9 13.1 7 12 7C10.9 7 10 7.9 10 9H8C8 6.79 9.79 5 12 5C14.21 5 16 6.79 16 9C16 9.88 15.64 10.68 15.07 11.25Z");
    svg.appendChild(path);
  }
  
  avatar.appendChild(svg);

  const content = document.createElement("div");
  content.className = "message-content";

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";

  const textEl = document.createElement("p");
  textEl.className = "message-text";
  textEl.textContent = text;
  bubble.appendChild(textEl);

  // Add play button if audio exists
  if (hasPlayButton && audioBase64) {
    const controls = document.createElement("div");
    controls.className = "message-controls";

    const playBtn = document.createElement("button");
    playBtn.className = "play-button";
    
    // Create SVG for play icon
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "16");
    svg.setAttribute("height", "16");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "currentColor");
    svg.style.marginRight = "4px";
    
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M8 5V19L19 12L8 5Z");
    svg.appendChild(path);
    
    playBtn.appendChild(svg);
    playBtn.appendChild(document.createTextNode("Play"));
    playBtn.onclick = () => {
      const audio = new Audio(`data:audio/wav;base64,${audioBase64}`);
      audio.play();
    };

    controls.appendChild(playBtn);
    bubble.appendChild(controls);
  }

  content.appendChild(bubble);

  const timestamp = document.createElement("span");
  timestamp.className = "message-timestamp";
  timestamp.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  content.appendChild(timestamp);

  if (fromProfile === "enduser") {
    messageGroup.appendChild(content);
    messageGroup.appendChild(avatar);
  } else {
    messageGroup.appendChild(avatar);
    messageGroup.appendChild(content);
  }

  conversationContainer.appendChild(messageGroup);
  conversationContainer.scrollTop = conversationContainer.scrollHeight;
}

function checkProfileSelection() {
  const selectedProfile = document.querySelector('input[name="profile"]:checked');
  if (!selectedProfile) {
    alert("Please select a profile");
    return false;
  }
  return true;
}

function updateSessionModeOptions() {
  const selectedProfile = document.querySelector('input[name="profile"]:checked');
  const endUserModes = document.querySelector("#endUserModes");
  const supportModes = document.querySelector("#supportModes");
  const supportStatusSection = document.querySelector("#supportStatusSection");
  const joinSessionSection = document.querySelector("#joinSessionSection");
  
  if (!selectedProfile) return;

  if (selectedProfile.value === "support") {
    // Show support modes, hide end user modes
    // Status is automatically managed by app (free -> busy)
    if (endUserModes) endUserModes.classList.add("hidden");
    if (supportModes) supportModes.classList.remove("hidden");
    if (joinSessionSection) joinSessionSection.classList.add("hidden");
    sessionMode = "pool"; // Default to pool mode for support
  } else {
    // Show end user modes, hide support modes
    if (endUserModes) endUserModes.classList.remove("hidden");
    if (supportModes) supportModes.classList.add("hidden");
    // Don't show join session section - only pool joining via code
    if (joinSessionSection) joinSessionSection.classList.add("hidden");
    sessionMode = "create"; // Default to pool join mode for end user
  }

  updateUI();
}

// Add event listeners to profile radio buttons
document.addEventListener("DOMContentLoaded", () => {
  const profileRadios = document.querySelectorAll('input[name="profile"]');
  profileRadios.forEach(radio => {
    radio.addEventListener("change", updateSessionModeOptions);
  });
});

profileLanguageSelect.addEventListener("change", (e) => {
  setLanguage(e.target.value);
});

profileSubmitButton.addEventListener("click", () => {
  if (!checkProfileSelection()) {
    return;
  }

  // Validate user name
  const nameValue = userNameInput.value.trim();
  if (!nameValue) {
    alert("Please enter your name");
    return;
  }

  const selectedProfile = document.querySelector('input[name="profile"]:checked');
  const selectedMode = document.querySelector('input[name="sessionMode"]:checked');
  
  userProfile = selectedProfile.value;
  userName = nameValue;
  sessionMode = selectedMode?.value || "create";
  
  // Status is auto-managed by the app (defaults to "free" for support)
  if (userProfile === "support") {
    userStatus = "free";
  }
  
  if (sessionMode === "join") {
    const code = sessionCodeInput.value.trim().toUpperCase();
    if (!code) {
      alert("Please enter a session code");
      return;
    }
    joinSessionCode = code;
  }
  
  // Set default languages based on profile
  if (userProfile === "support") {
    agentLanguageSelect.value = "en";
    expectedUserLanguageSelect.value = userLanguage;
  } else {
    agentLanguageSelect.value = "en";
    expectedUserLanguageSelect.value = userLanguage;
  }

  hideProfileModal();
  addLog(`Profile selected: ${userProfile} (${userName}) (${userLanguage}) - Mode: ${sessionMode}`);
  if (userProfile === "support") {
    addLog(`Support Status: ${userStatus}`);
  }
  if (joinSessionCode) {
    addLog(`Joining session: ${joinSessionCode}`);
  }
  
  // Show waiting view
  showWaitingView(userProfile === "support");
  
  // Automatically start the WebSocket connection
  connectToWebSocket();
});

// Session mode radio button listeners
document.addEventListener("DOMContentLoaded", () => {
  const sessionModeRadios = document.querySelectorAll('input[name="sessionMode"]');
  sessionModeRadios.forEach(radio => {
    radio.addEventListener("change", (e) => {
      if (e.target.value === "join") {
        joinSessionSection.classList.remove("hidden");
      } else {
        joinSessionSection.classList.add("hidden");
      }
    });
  });

  // Voice button event listeners
  if (voiceStartButton) {
    voiceStartButton.addEventListener("click", startVoiceListening);
  }

  if (voiceStopButton) {
    voiceStopButton.addEventListener("click", stopVoiceListening);
  }
});

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  // Set initial language
  profileLanguageSelect.value = userLanguage;
  setLanguage(userLanguage);
  
  // Initialize session mode options based on default profile (end user)
  const endUserModes = document.querySelector("#endUserModes");
  const supportModes = document.querySelector("#supportModes");
  if (endUserModes) endUserModes.classList.remove("hidden");
  if (supportModes) supportModes.classList.add("hidden");
  
  // Show profile modal on first load or if profile not set
  if (!userProfile) {
    showProfileModal();
  }
  
  setConnectedUi(false);
  speakButton.textContent = canRecordAudio ? t("button_record") : "Recording Unavailable";
  replayButton.disabled = true;
});

