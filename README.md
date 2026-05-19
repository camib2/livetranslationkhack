# Voice Agent Middleware

Lightweight Node.js/TypeScript middleware for a multilingual voice agent stack:

- client audio into backend
- Speechmatics for streaming STT
- Vertex AI agent for reasoning and tool execution
- Speechmatics TTS for audio responses

## Getting started

1. Copy `.env.example` to `.env`.
2. Install dependencies with `npm install`.
3. Start the dev server with `npm run dev`.

## Initial routes

- `GET /health`
- `GET /` Demo browser console
- `GET /ws/voice` WebSocket entrypoint for live voice sessions

## Current scope

This scaffold includes:

- typed configuration loading
- in-memory session store
- demo browser client for text injection and browser speech fallback
- language-pair selection for expected user language and agent language
- Speechmatics translation for recorded audio when the language pair differs
- WebSocket session entrypoint
- turn orchestrator boundaries
- provider client stubs for Speechmatics STT, Speechmatics TTS, and Vertex

The provider methods are intentionally thin placeholders so you can wire the real APIs next without changing the service layout.
