export type SessionState = "idle" | "listening" | "thinking" | "speaking" | "closed";

export interface VoiceSession {
  id: string;
  expectedUserLanguage: string;
  agentLanguage: string;
  createdAt: string;
  updatedAt: string;
  state: SessionState;
  transcriptBuffer: string[];
}

export interface ClientEventMap {
  "session.start": {
    sessionId?: string;
    language?: string;
    expectedUserLanguage?: string;
    agentLanguage?: string;
  };
  "transcript.final": {
    text: string;
  };
  "audio.recorded": {
    audioBase64: string;
    mimeType: string;
    expectedUserLanguage?: string;
    agentLanguage?: string;
  };
  "session.end": Record<string, never>;
}

export interface ServerEventMap {
  "session.ready": {
    sessionId: string;
    expectedUserLanguage: string;
    agentLanguage: string;
  };
  "session.status": {
    state: SessionState;
    message?: string;
  };
  "agent.response": {
    text: string;
  };
  "transcript.final": {
    text: string;
    translatedText?: string;
    agentInputText: string;
    expectedUserLanguage: string;
    agentLanguage: string;
  };
  "tts.ready": {
    text: string;
    audioBase64?: string;
    mimeType?: string;
  };
  "error": {
    message: string;
  };
}
