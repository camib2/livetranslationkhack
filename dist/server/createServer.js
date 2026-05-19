import Fastify from "fastify";
import websocket from "@fastify/websocket";
import { env } from "../config/env.js";
import { TurnOrchestrator } from "../orchestrator/turn-orchestrator.js";
import { SpeechmaticsSttClient } from "../providers/speechmatics/stt-client.js";
import { SpeechmaticsTtsClient } from "../providers/speechmatics/tts-client.js";
import { VertexAgentClient } from "../providers/vertex/agent-client.js";
import { registerDemoRoutes } from "../routes/demo.js";
import { registerHealthRoute } from "../routes/health.js";
import { SessionStore } from "../sessions/session-store.js";
import { sessionManager } from "../sessions/multi-user-session-manager.js";
export async function createServer() {
    const app = Fastify({
        logger: {
            level: env.logLevel
        }
    });
    const sessionStore = new SessionStore();
    const sttClient = new SpeechmaticsSttClient();
    const ttsClient = new SpeechmaticsTtsClient();
    const agentClient = new VertexAgentClient();
    const orchestrator = new TurnOrchestrator(app.log, sessionStore, agentClient, ttsClient);
    await app.register(websocket);
    await registerDemoRoutes(app);
    await registerHealthRoute(app);
    app.get("/ws/voice", { websocket: true }, (socket) => {
        let currentSessionId = null;
        let currentUserId = null;
        let userProfile = null;
        async function processFinalTranscript(sessionId, text) {
            socket.send(JSON.stringify({
                type: "session.status",
                payload: {
                    state: "thinking",
                    message: "Agent is processing the finalized transcript"
                }
            }));
            const result = await orchestrator.handleFinalTranscript(sessionId, text);
            socket.send(JSON.stringify({
                type: "agent.response",
                payload: {
                    text: result.responseText
                }
            }));
            socket.send(JSON.stringify({
                type: "tts.ready",
                payload: {
                    text: result.responseText,
                    audioBase64: result.audio.length > 0 ? result.audio.toString("base64") : undefined,
                    mimeType: result.audio.length > 0 ? "audio/wav" : undefined
                }
            }));
            socket.send(JSON.stringify({
                type: "session.status",
                payload: {
                    state: "listening",
                    message: "Ready for the next turn"
                }
            }));
            // Notify other user in multi-user session
            const multiUserSession = sessionManager.getSessionForUser(currentUserId);
            if (multiUserSession && multiUserSession.users.size > 1) {
                const otherUsers = sessionManager.getOtherUsersInSession(currentUserId);
                for (const otherUser of otherUsers) {
                    otherUser.socket.send(JSON.stringify({
                        type: "agent.response",
                        payload: {
                            text: result.responseText,
                            fromProfile: userProfile
                        }
                    }));
                }
            }
        }
        socket.on("message", async (rawMessage) => {
            try {
                const event = JSON.parse(rawMessage.toString());
                switch (event.type) {
                    case "session.start": {
                        const payload = event.payload;
                        const expectedUserLanguage = payload.expectedUserLanguage ?? payload.language ?? "en";
                        const agentLanguage = payload.agentLanguage ?? payload.language ?? "en";
                        const profile = payload.profile || "enduser";
                        const sessionMode = payload.sessionMode || "create";
                        userProfile = profile;
                        let multiUserSession;
                        let sessionCode;
                        // Create or join session
                        if (sessionMode === "join" && payload.joinCode) {
                            // Join existing session
                            const joinResult = sessionManager.joinSessionByCode(payload.joinCode, profile, expectedUserLanguage, expectedUserLanguage, agentLanguage, socket);
                            if (!joinResult.success) {
                                socket.send(JSON.stringify({
                                    type: "error",
                                    payload: {
                                        message: joinResult.message
                                    }
                                }));
                                return;
                            }
                            currentSessionId = joinResult.sessionId;
                            multiUserSession = joinResult.session;
                            // Get the user ID from the session (it's the newly added user)
                            for (const [userId, user] of multiUserSession.users) {
                                if (user.socket === socket) {
                                    currentUserId = userId;
                                    break;
                                }
                            }
                        }
                        else {
                            // Create new session
                            const createResult = sessionManager.createSession(profile, expectedUserLanguage);
                            sessionCode = createResult.sessionCode;
                            currentSessionId = createResult.sessionId;
                            const addResult = sessionManager.addUserToSession(createResult.sessionId, profile, expectedUserLanguage, expectedUserLanguage, agentLanguage, socket);
                            if (!addResult.success) {
                                socket.send(JSON.stringify({
                                    type: "error",
                                    payload: {
                                        message: addResult.message
                                    }
                                }));
                                return;
                            }
                            multiUserSession = addResult.session;
                            // Get the user ID
                            for (const [userId, user] of multiUserSession.users) {
                                if (user.socket === socket) {
                                    currentUserId = userId;
                                    break;
                                }
                            }
                        }
                        // Also create/update session store for compatibility with existing orchestrator
                        let storeSession = sessionStore.get(currentSessionId);
                        if (!storeSession) {
                            storeSession = sessionStore.create({ expectedUserLanguage, agentLanguage });
                            sessionStore.update(currentSessionId, { state: "listening" });
                        }
                        await sttClient.startRealtimeSession({
                            sessionId: currentSessionId,
                            language: expectedUserLanguage
                        });
                        socket.send(JSON.stringify({
                            type: "session.status",
                            payload: {
                                state: "listening",
                                message: sessionMode === "create" ? "Session created, waiting for support agent..." : "Session joined successfully"
                            }
                        }));
                        const response = {
                            type: "session.ready",
                            payload: {
                                sessionId: currentSessionId,
                                expectedUserLanguage,
                                agentLanguage,
                                ...(sessionCode && { sessionCode })
                            }
                        };
                        socket.send(JSON.stringify(response));
                        // Notify other user if both are connected
                        if (multiUserSession.users.size > 1) {
                            for (const [, otherUser] of multiUserSession.users) {
                                if (otherUser.socket !== socket) {
                                    otherUser.socket.send(JSON.stringify({
                                        type: "session.status",
                                        payload: {
                                            state: "ready",
                                            message: `${profile === "support" ? "End User" : "Support Agent"} has joined the session`
                                        }
                                    }));
                                }
                            }
                        }
                        return;
                    }
                    case "transcript.final": {
                        if (!currentSessionId) {
                            throw new Error("Session has not been started");
                        }
                        const payload = event.payload;
                        await processFinalTranscript(currentSessionId, payload.text);
                        return;
                    }
                    case "audio.recorded": {
                        if (!currentSessionId) {
                            throw new Error("Session has not been started");
                        }
                        const payload = event.payload;
                        const session = sessionStore.get(currentSessionId);
                        if (!session) {
                            throw new Error(`Session not found: ${currentSessionId}`);
                        }
                        socket.send(JSON.stringify({
                            type: "session.status",
                            payload: {
                                state: "listening",
                                message: session.expectedUserLanguage === session.agentLanguage
                                    ? "Speechmatics is transcribing the recorded turn"
                                    : "Speechmatics is transcribing and translating the recorded turn"
                            }
                        }));
                        const transcription = await sttClient.transcribeRecordedAudio({
                            audio: Buffer.from(stripDataUrlPrefix(payload.audioBase64), "base64"),
                            mimeType: payload.mimeType,
                            expectedUserLanguage: payload.expectedUserLanguage ?? session.expectedUserLanguage,
                            agentLanguage: payload.agentLanguage ?? session.agentLanguage
                        });
                        socket.send(JSON.stringify({
                            type: "transcript.final",
                            payload: {
                                text: transcription.transcript,
                                translatedText: transcription.translatedText,
                                agentInputText: transcription.agentInputText,
                                expectedUserLanguage: transcription.expectedUserLanguage,
                                agentLanguage: transcription.agentLanguage
                            }
                        }));
                        await processFinalTranscript(currentSessionId, transcription.agentInputText);
                        return;
                    }
                    case "session.end": {
                        if (currentSessionId) {
                            sessionStore.close(currentSessionId);
                            if (currentUserId) {
                                sessionManager.removeUserFromSession(currentUserId);
                            }
                        }
                        socket.send(JSON.stringify({
                            type: "session.status",
                            payload: {
                                state: "closed",
                                message: "Session ended"
                            }
                        }));
                        socket.close();
                        return;
                    }
                    default:
                        throw new Error(`Unsupported event type: ${String(event.type)}`);
                }
            }
            catch (error) {
                app.log.error({ error }, "websocket event handling failed");
                socket.send(JSON.stringify({
                    type: "error",
                    payload: {
                        message: error instanceof Error ? error.message : "Unknown error"
                    }
                }));
            }
        });
    });
    return app;
}
function stripDataUrlPrefix(value) {
    const marker = "base64,";
    const markerIndex = value.indexOf(marker);
    return markerIndex >= 0 ? value.slice(markerIndex + marker.length) : value;
}
