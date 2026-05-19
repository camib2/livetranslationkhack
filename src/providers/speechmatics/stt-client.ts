import { setTimeout as delay } from "node:timers/promises";

import { env } from "../../config/env.js";

export interface StartRealtimeSessionInput {
  sessionId: string;
  language: string;
}

export interface TranscribeRecordedAudioInput {
  audio: Buffer;
  mimeType: string;
  expectedUserLanguage: string;
  agentLanguage: string;
}

export interface TranscriptionResult {
  transcript: string;
  translatedText?: string;
  agentInputText: string;
  expectedUserLanguage: string;
  agentLanguage: string;
}

export class SpeechmaticsSttClient {
  private readonly batchUrl = env.speechmaticsBatchUrl.replace(/\/+$/, "");

  async startRealtimeSession(input: StartRealtimeSessionInput): Promise<void> {
    void input;
    // TODO: open a WebSocket to Speechmatics realtime STT and stream client audio through it.
  }

  async transcribeRecordedAudio(input: TranscribeRecordedAudioInput): Promise<TranscriptionResult> {
    const jobId = await this.createBatchJob(input);
    await this.waitForJob(jobId);
    const transcript = await this.getPlainTranscript(jobId);
    const translatedText =
      input.expectedUserLanguage === input.agentLanguage ? undefined : await this.getTranslatedTranscript(jobId, input.agentLanguage);

    return {
      transcript,
      translatedText,
      agentInputText: translatedText ?? transcript,
      expectedUserLanguage: input.expectedUserLanguage,
      agentLanguage: input.agentLanguage
    };
  }

  private async createBatchJob(input: TranscribeRecordedAudioInput): Promise<string> {
    const formData = new FormData();
    const config: Record<string, unknown> = {
      type: "transcription",
      transcription_config: {
        language: input.expectedUserLanguage
      }
    };

    if (input.expectedUserLanguage !== input.agentLanguage) {
      config.translation_config = {
        target_languages: [input.agentLanguage]
      };
    }

    formData.append("config", JSON.stringify(config));
    formData.append("data_file", new Blob([new Uint8Array(input.audio)], { type: input.mimeType }), fileNameFor(input.mimeType));

    const response = await fetch(`${this.batchUrl}/jobs`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.speechmaticsApiKey}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Speechmatics job creation failed: ${response.status} ${await response.text()}`);
    }

    const body = (await response.json()) as unknown;
    const jobId = extractJobId(body);

    if (!jobId) {
      throw new Error("Speechmatics job creation response did not include a job id");
    }

    return jobId;
  }

  private async waitForJob(jobId: string): Promise<void> {
    const timeoutAt = Date.now() + 60_000;

    while (Date.now() < timeoutAt) {
      const response = await fetch(`${this.batchUrl}/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${env.speechmaticsApiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Speechmatics job status failed: ${response.status} ${await response.text()}`);
      }

      const body = (await response.json()) as unknown;
      const status = extractJobStatus(body);

      if (status === "done") {
        return;
      }

      if (status === "rejected" || status === "failed") {
        throw new Error(`Speechmatics transcription job ${jobId} ended with status: ${status}`);
      }

      await delay(1_000);
    }

    throw new Error(`Speechmatics transcription job ${jobId} timed out`);
  }

  private async getPlainTranscript(jobId: string): Promise<string> {
    const response = await fetch(`${this.batchUrl}/jobs/${jobId}/transcript?format=txt`, {
      headers: {
        Authorization: `Bearer ${env.speechmaticsApiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Speechmatics transcript retrieval failed: ${response.status} ${await response.text()}`);
    }

    const transcript = (await response.text()).trim();

    if (!transcript) {
      throw new Error("Speechmatics returned an empty transcript");
    }

    return transcript;
  }

  private async getTranslatedTranscript(jobId: string, targetLanguage: string): Promise<string> {
    const response = await fetch(`${this.batchUrl}/jobs/${jobId}/transcript?format=json-v2`, {
      headers: {
        Authorization: `Bearer ${env.speechmaticsApiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Speechmatics translated transcript retrieval failed: ${response.status} ${await response.text()}`);
    }

    const body = (await response.json()) as unknown;
    const translatedText = extractTranslation(body, targetLanguage);

    if (!translatedText) {
      throw new Error(`Speechmatics did not return a translation for target language: ${targetLanguage}`);
    }

    return translatedText;
  }
}

function extractJobId(body: unknown): string | undefined {
  if (!body || typeof body !== "object") {
    return undefined;
  }

  const record = body as Record<string, unknown>;
  const job = record.job && typeof record.job === "object" ? (record.job as Record<string, unknown>) : undefined;
  const id = record.id ?? record.job_id ?? job?.id ?? job?.job_id;

  return typeof id === "string" ? id : undefined;
}

function extractJobStatus(body: unknown): string | undefined {
  if (!body || typeof body !== "object") {
    return undefined;
  }

  const record = body as Record<string, unknown>;
  const job = record.job && typeof record.job === "object" ? (record.job as Record<string, unknown>) : undefined;
  const status = record.status ?? job?.status;

  return typeof status === "string" ? status.toLowerCase() : undefined;
}

function fileNameFor(mimeType: string): string {
  if (mimeType.includes("mp4")) {
    return "recording.mp4";
  }

  if (mimeType.includes("ogg")) {
    return "recording.ogg";
  }

  if (mimeType.includes("wav")) {
    return "recording.wav";
  }

  return "recording.webm";
}

function extractTranslation(body: unknown, targetLanguage: string): string | undefined {
  if (!body || typeof body !== "object") {
    return undefined;
  }

  const record = body as Record<string, unknown>;
  const translations = record.translations;

  if (Array.isArray(translations)) {
    const exactMatch = translations.find((translation) => {
      if (!translation || typeof translation !== "object") {
        return false;
      }

      const translationRecord = translation as Record<string, unknown>;
      return translationRecord.language === targetLanguage || translationRecord.target_language === targetLanguage;
    });

    return textFromTranslationValue(exactMatch ?? translations[0]);
  }

  if (translations && typeof translations === "object") {
    const translationRecord = translations as Record<string, unknown>;
    return textFromTranslationValue(translationRecord[targetLanguage] ?? Object.values(translationRecord)[0]);
  }

  return undefined;
}

function textFromTranslationValue(value: unknown): string | undefined {
  if (typeof value === "string") {
    return normalizeTranscriptText(value);
  }

  if (!value || typeof value !== "object") {
    return undefined;
  }

  if (Array.isArray(value)) {
    return normalizeTranscriptText(
      value
        .map((item) => {
          if (typeof item === "string") {
            return item;
          }

          if (!item || typeof item !== "object") {
            return "";
          }

          const itemRecord = item as Record<string, unknown>;
          if (typeof itemRecord.content === "string") {
            return itemRecord.content;
          }

          const alternatives = itemRecord.alternatives;
          if (Array.isArray(alternatives)) {
            const firstAlternative = alternatives[0];
            if (firstAlternative && typeof firstAlternative === "object") {
              const alternativeRecord = firstAlternative as Record<string, unknown>;
              return typeof alternativeRecord.content === "string" ? alternativeRecord.content : "";
            }
          }

          return "";
        })
        .filter(Boolean)
        .join(" ")
    );
  }

  const record = value as Record<string, unknown>;

  if (typeof record.transcript === "string") {
    return normalizeTranscriptText(record.transcript);
  }

  if (typeof record.text === "string") {
    return normalizeTranscriptText(record.text);
  }

  return textFromTranslationValue(record.results);
}

function normalizeTranscriptText(value: string): string {
  return value.trim().replace(/\s+([.,!?;:])/g, "$1").replace(/\s+/g, " ");
}
