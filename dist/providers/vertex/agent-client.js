export class VertexAgentClient {
    async detectIntent(input) {
        const normalizedText = input.text.trim();
        if (!normalizedText) {
            return {
                text: "I did not catch that. Please repeat your request."
            };
        }
        // TODO: replace this placeholder with a real Vertex agent call.
        return {
            text: `Acknowledged: ${normalizedText}`
        };
    }
}
