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
import type { ClientEventMap, ServerEventMap } from "../types/session.js";

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
    let currentSessionId: string | null = null;

    async function processFinalTranscript(sessionId: string, text: string): Promise<void> {
      socket.send(
        JSON.stringify({
          type: "session.status",
          payload: {
            state: "thinking",
            message: "Agent is processing the finalized transcript"
          }
        } satisfies { type: keyof ServerEventMap; payload: ServerEventMap["session.status"] })
      );

      const result = await orchestrator.handleFinalTranscript(sessionId, text);

      socket.send(
        JSON.stringify({
          type: "agent.response",
          payload: {
            text: result.responseText
          }
        } satisfies { type: keyof ServerEventMap; payload: ServerEventMap["agent.response"] })
      );

      socket.send(
        JSON.stringify({
          type: "tts.ready",
          payload: {
            text: result.responseText,
            audioBase64: result.audio.length > 0 ? result.audio.toString("base64") : undefined,
            mimeType: result.audio.length > 0 ? "audio/wav" : undefined
          }
        } satisfies { type: keyof ServerEventMap; payload: ServerEventMap["tts.ready"] })
      );

      socket.send(
        JSON.stringify({
          type: "session.status",
          payload: {
            state: "listening",
            message: "Ready for the next turn"
          }
        } satisfies { type: keyof ServerEventMap; payload: ServerEventMap["session.status"] })
      );
    }

    socket.on("message", async (rawMessage: Buffer | string) => {
      try {
        const event = JSON.parse(rawMessage.toString()) as {
          type: keyof ClientEventMap;
          payload: ClientEventMap[keyof ClientEventMap];
        };

        switch (event.type) {
          case "session.start": {
            const payload = event.payload as ClientEventMap["session.start"];
            const expectedUserLanguage = payload.expectedUserLanguage ?? payload.language ?? "en";
            const agentLanguage = payload.agentLanguage ?? payload.language ?? "en";
            const session = sessionStore.create({ expectedUserLanguage, agentLanguage });
            currentSessionId = session.id;

            sessionStore.update(session.id, { state: "listening" });
            await sttClient.startRealtimeSession({
              sessionId: session.id,
              language: session.expectedUserLanguage
            });

            socket.send(
              JSON.stringify({
                type: "session.status",
                payload: {
                  state: "listening",
                  message: "Session started"
                }
              } satisfies { type: keyof ServerEventMap; payload: ServerEventMap["session.status"] })
            );

            const response: { type: keyof ServerEventMap; payload: ServerEventMap["session.ready"] } = {
              type: "session.ready",
              payload: {
                sessionId: session.id,
                expectedUserLanguage: session.expectedUserLanguage,
                agentLanguage: session.agentLanguage
              }
            };

            socket.send(JSON.stringify(response));
            return;
          }

          case "transcript.final": {
            if (!currentSessionId) {
              throw new Error("Session has not been started");
            }

            const payload = event.payload as ClientEventMap["transcript.final"];
            await processFinalTranscript(currentSessionId, payload.text);
            return;
          }

          case "audio.recorded": {
            if (!currentSessionId) {
              throw new Error("Session has not been started");
            }

            const payload = event.payload as ClientEventMap["audio.recorded"];
            const session = sessionStore.get(currentSessionId);

            if (!session) {
              throw new Error(`Session not found: ${currentSessionId}`);
            }

            socket.send(
              JSON.stringify({
                type: "session.status",
                payload: {
                  state: "listening",
                  message:
                    session.expectedUserLanguage === session.agentLanguage
                      ? "Speechmatics is transcribing the recorded turn"
                      : "Speechmatics is transcribing and translating the recorded turn"
                }
              } satisfies { type: keyof ServerEventMap; payload: ServerEventMap["session.status"] })
            );

            const transcription = await sttClient.transcribeRecordedAudio({
              audio: Buffer.from(stripDataUrlPrefix(payload.audioBase64), "base64"),
              mimeType: payload.mimeType,
              expectedUserLanguage: payload.expectedUserLanguage ?? session.expectedUserLanguage,
              agentLanguage: payload.agentLanguage ?? session.agentLanguage
            });

            socket.send(
              JSON.stringify({
                type: "transcript.final",
                payload: {
                  text: transcription.transcript,
                  translatedText: transcription.translatedText,
                  agentInputText: transcription.agentInputText,
                  expectedUserLanguage: transcription.expectedUserLanguage,
                  agentLanguage: transcription.agentLanguage
                }
              } satisfies { type: keyof ServerEventMap; payload: ServerEventMap["transcript.final"] })
            );

            await processFinalTranscript(currentSessionId, transcription.agentInputText);
            return;
          }

          case "session.end": {
            if (currentSessionId) {
              sessionStore.close(currentSessionId);
            }
            socket.send(
              JSON.stringify({
                type: "session.status",
                payload: {
                  state: "closed",
                  message: "Session ended"
                }
              } satisfies { type: keyof ServerEventMap; payload: ServerEventMap["session.status"] })
            );
            socket.close();
            return;
          }

          default:
            throw new Error(`Unsupported event type: ${String(event.type)}`);
        }
      } catch (error) {
        app.log.error({ error }, "websocket event handling failed");
        socket.send(
          JSON.stringify({
            type: "error",
            payload: {
              message: error instanceof Error ? error.message : "Unknown error"
            }
          } satisfies { type: keyof ServerEventMap; payload: ServerEventMap["error"] })
        );
      }
    });
  });

  return app;
}

function stripDataUrlPrefix(value: string): string {
  const marker = "base64,";
  const markerIndex = value.indexOf(marker);
  return markerIndex >= 0 ? value.slice(markerIndex + marker.length) : value;
}
