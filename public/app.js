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

let socket = null;
let recorder = null;
let mediaStream = null;
let recordedChunks = [];
let lastReplyText = "";

const canRecordAudio = Boolean(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);

function addLog(message) {
  const item = document.createElement("li");
  const timestamp = new Date().toLocaleTimeString();
  item.innerHTML = `<time>${timestamp}</time>${message}`;
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
  if (!recorder || recorder.state === "inactive") {
    return;
  }

  recorder.stop();
}

function resetRecordingUi() {
  recorder = null;
  recordedChunks = [];
  speakButton.classList.remove("is-recording");
  speakButton.textContent = "Start Recording";
  setConnectedUi(socket?.readyState === WebSocket.OPEN);
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

connectButton.addEventListener("click", () => {
  socket = new WebSocket(createSocketUrl());
  setStatus("Connecting");

  socket.addEventListener("open", () => {
    addLog("WebSocket connected.");
    sendEvent("session.start", getSelectedLanguages());
  });

  socket.addEventListener("message", async (event) => {
    const message = JSON.parse(event.data);

    switch (message.type) {
      case "session.ready":
        sessionIdInput.value = message.payload.sessionId;
        setStatus(`Ready (${message.payload.expectedUserLanguage} -> ${message.payload.agentLanguage})`);
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
        agentResponse.value = message.payload.text;
        addLog(`Agent response received: "${message.payload.text}"`);
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
    socket = null;
  });

  socket.addEventListener("error", () => {
    addLog("WebSocket transport error.");
    setStatus("Connection error");
  });
});

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
  sendEvent("transcript.final", { text });
  setStatus("Transcript sent");
});

clearTranscriptButton.addEventListener("click", () => {
  transcriptInput.value = "";
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

setConnectedUi(false);
speakButton.textContent = canRecordAudio ? "Start Recording" : "Recording Unavailable";
replayButton.disabled = true;
