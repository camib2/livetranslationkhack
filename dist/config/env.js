import dotenv from "dotenv";
dotenv.config();
function required(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}
function optional(name, fallback) {
    return process.env[name] ?? fallback;
}
export const env = {
    port: Number(optional("PORT", "3000")),
    host: optional("HOST", "0.0.0.0"),
    logLevel: optional("LOG_LEVEL", "info"),
    speechmaticsApiKey: required("SPEECHMATICS_API_KEY"),
    speechmaticsBatchUrl: optional("SPEECHMATICS_BATCH_URL", "https://asr.api.speechmatics.com/v2"),
    speechmaticsRtUrl: required("SPEECHMATICS_RT_URL"),
    speechmaticsTtsUrl: required("SPEECHMATICS_TTS_URL"),
    vertexProjectId: required("VERTEX_PROJECT_ID"),
    vertexLocation: required("VERTEX_LOCATION"),
    vertexAgentId: required("VERTEX_AGENT_ID"),
    vertexLanguageCode: required("VERTEX_LANGUAGE_CODE")
};
