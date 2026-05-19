export interface SynthesizeSpeechInput {
  text: string;
  language: string;
}

export class SpeechmaticsTtsClient {
  async synthesize(input: SynthesizeSpeechInput): Promise<Buffer> {
    void input;
    // TODO: call Speechmatics TTS and return audio bytes for streaming back to the client.
    return Buffer.from([]);
  }
}
