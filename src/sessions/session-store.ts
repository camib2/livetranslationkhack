import { randomUUID } from "node:crypto";

import type { VoiceSession } from "../types/session.js";

export class SessionStore {
  private readonly sessions = new Map<string, VoiceSession>();

  create(input: { expectedUserLanguage?: string; agentLanguage?: string } = {}): VoiceSession {
    const timestamp = new Date().toISOString();
    const session: VoiceSession = {
      id: randomUUID(),
      expectedUserLanguage: input.expectedUserLanguage ?? "en",
      agentLanguage: input.agentLanguage ?? "en",
      createdAt: timestamp,
      updatedAt: timestamp,
      state: "idle",
      transcriptBuffer: []
    };

    this.sessions.set(session.id, session);
    return session;
  }

  get(sessionId: string): VoiceSession | undefined {
    return this.sessions.get(sessionId);
  }

  update(sessionId: string, patch: Partial<VoiceSession>): VoiceSession {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    const updated: VoiceSession = {
      ...session,
      ...patch,
      updatedAt: new Date().toISOString()
    };

    this.sessions.set(sessionId, updated);
    return updated;
  }

  appendTranscript(sessionId: string, text: string): VoiceSession {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    return this.update(sessionId, {
      transcriptBuffer: [...session.transcriptBuffer, text]
    });
  }

  close(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return;
    }

    this.sessions.set(sessionId, {
      ...session,
      state: "closed",
      updatedAt: new Date().toISOString()
    });
  }
}
