import { randomUUID } from "node:crypto";
export class SessionStore {
    sessions = new Map();
    create(input = {}) {
        const timestamp = new Date().toISOString();
        const session = {
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
    get(sessionId) {
        return this.sessions.get(sessionId);
    }
    update(sessionId, patch) {
        const session = this.sessions.get(sessionId);
        if (!session) {
            throw new Error(`Session not found: ${sessionId}`);
        }
        const updated = {
            ...session,
            ...patch,
            updatedAt: new Date().toISOString()
        };
        this.sessions.set(sessionId, updated);
        return updated;
    }
    appendTranscript(sessionId, text) {
        const session = this.sessions.get(sessionId);
        if (!session) {
            throw new Error(`Session not found: ${sessionId}`);
        }
        return this.update(sessionId, {
            transcriptBuffer: [...session.transcriptBuffer, text]
        });
    }
    close(sessionId) {
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
