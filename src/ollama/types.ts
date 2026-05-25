/** Default chat timeout (ms); P5-I06 persists this in settings. */
export const DEFAULT_OLLAMA_TIMEOUT_MS = 90_000;

export const DEFAULT_OLLAMA_EMBEDDING_MODEL = 'nomic-embed-text';

export interface OllamaClientConfig {
  baseUrl: string;
  generationModel: string;
  embeddingModel?: string;
  timeoutMs?: number;
}

export type OllamaChatRole = 'system' | 'user' | 'assistant';

export interface OllamaChatMessage {
  role: OllamaChatRole;
  content: string;
}

export interface OllamaChatOptions {
  timeoutMs?: number;
}

export interface OllamaEmbedOptions {
  timeoutMs?: number;
}

export type OllamaErrorKind = 'connection' | 'http' | 'timeout' | 'model' | 'response';

export interface OllamaError {
  kind: OllamaErrorKind;
  message: string;
  status?: number;
}

export type OllamaResult<T> = { ok: true; value: T } | { ok: false; error: OllamaError };

export interface OllamaClient {
  checkOllamaReachable(): Promise<OllamaResult<void>>;
  chat(messages: OllamaChatMessage[], options?: OllamaChatOptions): Promise<OllamaResult<string>>;
  embed(inputs: string[], options?: OllamaEmbedOptions): Promise<OllamaResult<number[][]>>;
}
