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
    let orchestratorSessionId: string | null = null;
    let currentUserId: string | null = null;
    let userProfile: "support" | "enduser" | null = null;

    async function processFinalTranscript(sessionId: string, text: string): Promise<void> {
      socket.send(
        JSON.stringify({
          type: "session.status",
          payload: {
            state: "thinking",
            message: "Processing..."
          }
        } satisfies { type: keyof ServerEventMap; payload: ServerEventMap["session.status"] })
      );

      // Relay user's message to other user in multi-user session
      const multiUserSession = sessionManager.getSessionForUser(currentUserId!);
      if (multiUserSession && multiUserSession.users.size > 1) {
        const otherUsers = sessionManager.getOtherUsersInSession(currentUserId!);
        for (const otherUser of otherUsers) {
          otherUser.socket.send(
            JSON.stringify({
              type: "agent.response",
              payload: {
                text: text,
                fromProfile: userProfile,
                isUserMessage: true
              }
            })
          );
        }
      }

      // Only get agent response if this is not a multi-user session
      // (in multi-user sessions, support agents talk to each other, not to bot)
      if (!multiUserSession || multiUserSession.users.size <= 1) {
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

        // Relay agent response to other user in multi-user session
        if (multiUserSession && multiUserSession.users.size > 1) {
          const otherUsers = sessionManager.getOtherUsersInSession(currentUserId!);
          for (const otherUser of otherUsers) {
            otherUser.socket.send(
              JSON.stringify({
                type: "agent.response",
                payload: {
                  text: result.responseText,
                  fromProfile: "support",
                  isAgentResponse: true
                }
              })
            );
          }
        }
      } else {
        // Multi-user session - just confirm message received
        socket.send(
          JSON.stringify({
            type: "session.status",
            payload: {
              state: "listening",
              message: "Message sent"
            }
          } satisfies { type: keyof ServerEventMap; payload: ServerEventMap["session.status"] })
        );
      }
    }

    socket.on("message", async (rawMessage: Buffer | string) => {
      try {
        const event = JSON.parse(rawMessage.toString()) as {
          type: keyof ClientEventMap;
          payload: ClientEventMap[keyof ClientEventMap];
        };

        switch (event.type) {
          case "session.start": {
            const payload = event.payload as ClientEventMap["session.start"] & { sessionMode?: string; joinCode?: string; profile?: string; userName?: string };
            const expectedUserLanguage = payload.expectedUserLanguage ?? payload.language ?? "en";
            const agentLanguage = payload.agentLanguage ?? payload.language ?? "en";
            const profile = (payload.profile as "support" | "enduser") || "enduser";
            const sessionMode = payload.sessionMode || "create";
            
            userProfile = profile;

            let multiUserSession;
            let sessionCode: string | undefined;

            // Create or join session
            if (sessionMode === "pool" && profile === "support") {
              // Support agent creates a pool session to wait for users
              const poolResult = sessionManager.createPoolSession(
                profile,
                expectedUserLanguage,
                expectedUserLanguage,
                agentLanguage,
                socket
              );

              currentSessionId = poolResult.sessionId;
              sessionCode = poolResult.poolCode;

              // Get the user ID
              const poolSession = sessionManager.getSessionForUser(poolResult.sessionId);
              if (poolSession) {
                for (const [userId, user] of poolSession.users) {
                  if (user.socket === socket) {
                    currentUserId = userId;
                    break;
                  }
                }
                multiUserSession = poolSession;
              }
            } else if (profile === "enduser" && (sessionMode === "create" || !payload.joinCode)) {
              // End user auto-matching with available support agent
              const assignResult = sessionManager.assignUserToAvailableAgent(
                profile,
                expectedUserLanguage,
                expectedUserLanguage,
                agentLanguage,
                socket,
                payload.userName
              );

              if (assignResult.success) {
                // Successfully assigned to a support agent
                currentSessionId = assignResult.sessionId!;
                currentUserId = assignResult.session!.endUser!.id;
                multiUserSession = assignResult.session!;

                // Notify support agent that user has joined
                if (multiUserSession.supportUser) {
                  multiUserSession.supportUser.socket.send(
                    JSON.stringify({
                      type: "session.status",
                      payload: {
                        state: "listening",
                        message: `End user "${payload.userName || "User"}" joined your session`
                      }
                    } satisfies { type: keyof ServerEventMap; payload: ServerEventMap["session.status"] })
                  );
                }
              } else {
                // No available support agents - create a waiting session
                const createResult = sessionManager.createSession(profile, expectedUserLanguage);
                sessionCode = createResult.sessionCode;
                currentSessionId = createResult.sessionId;

                const addResult = sessionManager.addUserToSession(
                  createResult.sessionId,
                  profile,
                  expectedUserLanguage,
                  expectedUserLanguage,
                  agentLanguage,
                  socket,
                  payload.userName
                );

                if (!addResult.success) {
                  socket.send(
                    JSON.stringify({
                      type: "error",
                      payload: {
                        message: addResult.message
                      }
                    } satisfies { type: keyof ServerEventMap; payload: ServerEventMap["error"] })
                  );
                  return;
                }

                multiUserSession = addResult.session!;

                // Get the user ID
                for (const [userId, user] of multiUserSession.users) {
                  if (user.socket === socket) {
                    currentUserId = userId;
                    break;
                  }
                }
              }
            } else if (sessionMode === "join" && payload.joinCode && profile === "enduser") {
              // End user joining a support pool
              const joinPoolResult = sessionManager.joinPoolSession(
                payload.joinCode,
                profile,
                expectedUserLanguage,
                expectedUserLanguage,
                agentLanguage,
                socket
              );

              if (!joinPoolResult.success) {
                // Try regular session join as fallback
                const joinResult = sessionManager.joinSessionByCode(
                  payload.joinCode,
                  profile,
                  expectedUserLanguage,
                  expectedUserLanguage,
                  agentLanguage,
                  socket
                );

                if (!joinResult.success) {
                  socket.send(
                    JSON.stringify({
                      type: "error",
                      payload: {
                        message: joinResult.message
                      }
                    } satisfies { type: keyof ServerEventMap; payload: ServerEventMap["error"] })
                  );
                  return;
                }

                currentSessionId = joinResult.sessionId!;
                multiUserSession = joinResult.session!;

                // Get the user ID from the session (it's the newly added user)
                for (const [userId, user] of multiUserSession.users) {
                  if (user.socket === socket) {
                    currentUserId = userId;
                    break;
                  }
                }
              } else {
                // Successfully joined pool
                currentSessionId = joinPoolResult.sessionId!;
                multiUserSession = joinPoolResult.session!;
                sessionCode = multiUserSession.code; // Set the pool code for the response

                // Get the user ID
                for (const [userId, user] of multiUserSession.users) {
                  if (user.socket === socket) {
                    currentUserId = userId;
                    break;
                  }
                }

                // Notify support agent that user has joined
                if (multiUserSession && multiUserSession.supportUser) {
                  multiUserSession.supportUser.socket.send(
                    JSON.stringify({
                      type: "session.status",
                      payload: {
                        state: "listening",
                        message: "An end user has joined your support session"
                      }
                    } satisfies { type: keyof ServerEventMap; payload: ServerEventMap["session.status"] })
                  );
                }
              }
            } else if (sessionMode === "join" && payload.joinCode) {
              // Join existing session
              const joinResult = sessionManager.joinSessionByCode(
                payload.joinCode,
                profile,
                expectedUserLanguage,
                expectedUserLanguage,
                agentLanguage,
                socket
              );

              if (!joinResult.success) {
                socket.send(
                  JSON.stringify({
                    type: "error",
                    payload: {
                      message: joinResult.message
                    }
                  } satisfies { type: keyof ServerEventMap; payload: ServerEventMap["error"] })
                );
                return;
              }

              currentSessionId = joinResult.sessionId!;
              multiUserSession = joinResult.session!;

              // Get the user ID from the session (it's the newly added user)
              for (const [userId, user] of multiUserSession.users) {
                if (user.socket === socket) {
                  currentUserId = userId;
                  break;
                }
              }
            } else {
              // Create new session
              const createResult = sessionManager.createSession(profile, expectedUserLanguage);
              sessionCode = createResult.sessionCode;
              currentSessionId = createResult.sessionId;

              const addResult = sessionManager.addUserToSession(
                createResult.sessionId,
                profile,
                expectedUserLanguage,
                expectedUserLanguage,
                agentLanguage,
                socket,
                payload.userName
              );

              if (!addResult.success) {
                socket.send(
                  JSON.stringify({
                    type: "error",
                    payload: {
                      message: addResult.message
                    }
                  } satisfies { type: keyof ServerEventMap; payload: ServerEventMap["error"] })
                );
                return;
              }

              multiUserSession = addResult.session!;

              // Get the user ID
              for (const [userId, user] of multiUserSession.users) {
                if (user.socket === socket) {
                  currentUserId = userId;
                  break;
                }
              }
            }

            // Also create session store for compatibility with existing orchestrator
            const storeSession = sessionStore.create({ expectedUserLanguage, agentLanguage });
            orchestratorSessionId = storeSession.id;

            await sttClient.startRealtimeSession({
              sessionId: orchestratorSessionId!,
              language: expectedUserLanguage
            });

            socket.send(
              JSON.stringify({
                type: "session.status",
                payload: {
                  state: "listening",
                  message: sessionMode === "create" ? "Session created, waiting for support agent..." : "Session joined successfully"
                }
              } satisfies { type: keyof ServerEventMap; payload: ServerEventMap["session.status"] })
            );

            const response: { type: keyof ServerEventMap; payload: any } = {
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
            if (multiUserSession && multiUserSession.users.size > 1) {
              for (const [, otherUser] of multiUserSession.users) {
                if (otherUser.socket !== socket) {
                  otherUser.socket.send(
                    JSON.stringify({
                      type: "session.status",
                      payload: {
                        state: "ready",
                        message: `${profile === "support" ? "End User" : "Support Agent"} has joined the session`
                      }
                    })
                  );
                }
              }
            }

            return;
          }

          case "transcript.final": {
            if (!orchestratorSessionId) {
              throw new Error("Session has not been started");
            }

            const payload = event.payload as ClientEventMap["transcript.final"];
            await processFinalTranscript(orchestratorSessionId, payload.text);
            return;
          }

          case "audio.recorded": {
            if (!orchestratorSessionId) {
              throw new Error("Session has not been started");
            }

            const payload = event.payload as ClientEventMap["audio.recorded"];
            const session = sessionStore.get(orchestratorSessionId);

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

            await processFinalTranscript(orchestratorSessionId, transcription.agentInputText);
            return;
          }

          case "session.end": {
            if (orchestratorSessionId) {
              sessionStore.close(orchestratorSessionId);
            }
            if (currentSessionId && currentUserId) {
              sessionManager.removeUserFromSession(currentUserId);
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
