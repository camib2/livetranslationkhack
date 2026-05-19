export class TurnOrchestrator {
    logger;
    sessionStore;
    agentClient;
    ttsClient;
    constructor(logger, sessionStore, agentClient, ttsClient) {
        this.logger = logger;
        this.sessionStore = sessionStore;
        this.agentClient = agentClient;
        this.ttsClient = ttsClient;
    }
    async handleFinalTranscript(sessionId, text) {
        const session = this.sessionStore.appendTranscript(sessionId, text);
        this.sessionStore.update(sessionId, { state: "thinking" });
        this.logger.info({ sessionId, text, agentLanguage: session.agentLanguage, expectedUserLanguage: session.expectedUserLanguage }, "processing finalized transcript");
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
