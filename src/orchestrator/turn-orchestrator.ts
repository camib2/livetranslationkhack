import type { FastifyBaseLogger } from "fastify";

import { SpeechmaticsTtsClient } from "../providers/speechmatics/tts-client.js";
import { VertexAgentClient } from "../providers/vertex/agent-client.js";
import { SessionStore } from "../sessions/session-store.js";

export interface TurnResult {
  responseText: string;
  audio: Buffer;
}

export class TurnOrchestrator {
  constructor(
    private readonly logger: FastifyBaseLogger,
    private readonly sessionStore: SessionStore,
    private readonly agentClient: VertexAgentClient,
    private readonly ttsClient: SpeechmaticsTtsClient
  ) {}

  async handleFinalTranscript(sessionId: string, text: string): Promise<TurnResult> {
    const session = this.sessionStore.appendTranscript(sessionId, text);
    this.sessionStore.update(sessionId, { state: "thinking" });

    this.logger.info(
      { sessionId, text, agentLanguage: session.agentLanguage, expectedUserLanguage: session.expectedUserLanguage },
      "processing finalized transcript"
    );

    const agentReply = await this.agentClient.detectIntent({
      sessionId,
      language: session.agentLanguage,
      text
    });

    this.sessionStore.update(sessionId, { state: "speaking" });

    const audio = await this.ttsClient.synthesize({
      text: agentReply.text,
      language: session.agentLanguage
    });

    this.sessionStore.update(sessionId, { state: "listening" });

    return {
      responseText: agentReply.text,
      audio
    };
  }
}
