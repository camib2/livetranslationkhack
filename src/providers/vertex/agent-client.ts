export interface AgentReply {
  text: string;
}

export interface DetectIntentInput {
  sessionId: string;
  language: string;
  text: string;
}

export class VertexAgentClient {
  async detectIntent(input: DetectIntentInput): Promise<AgentReply> {
    const normalizedText = input.text.trim();

    if (!normalizedText) {
      return {
        text: "I did not catch that. Please repeat your request."
      };
    }

    // TODO: replace this placeholder with a real Vertex agent call.
    // For now, return a simple acknowledgment without the "Acknowledged:" prefix
    return {
      text: `Your message has been received: ${normalizedText}`
    };
  }
}
