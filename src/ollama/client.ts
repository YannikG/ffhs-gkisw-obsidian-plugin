import {
  DEFAULT_OLLAMA_EMBEDDING_MODEL,
  DEFAULT_OLLAMA_TIMEOUT_MS,
  type OllamaChatMessage,
  type OllamaClient,
  type OllamaClientConfig,
  type OllamaError,
  type OllamaResult,
} from './types.js';

interface TagsResponse {
  models?: Array<{ name?: string }>;
}

interface ChatResponse {
  message?: { content?: string };
  error?: string;
}

interface EmbedResponse {
  embeddings?: number[][];
}

interface ErrorBody {
  error?: string;
}

export function createOllamaClient(
  config: OllamaClientConfig,
  deps: { fetch?: typeof fetch } = {},
): OllamaClient {
  const fetchFn = deps.fetch ?? fetch;
  const baseUrl = normalizeBaseUrl(config.baseUrl);
  const defaultTimeoutMs = config.timeoutMs ?? DEFAULT_OLLAMA_TIMEOUT_MS;
  const embeddingModel = config.embeddingModel ?? DEFAULT_OLLAMA_EMBEDDING_MODEL;

  return {
    checkOllamaReachable: () =>
      checkReachable(fetchFn, baseUrl, config.generationModel, embeddingModel, defaultTimeoutMs),
    chat: (messages, options) =>
      runChat(
        fetchFn,
        baseUrl,
        config.generationModel,
        messages,
        options?.timeoutMs ?? defaultTimeoutMs,
      ),
    embed: (inputs, options) =>
      runEmbed(fetchFn, baseUrl, embeddingModel, inputs, options?.timeoutMs ?? defaultTimeoutMs),
  };
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.trim().replace(/\/+$/, '');
}

function resolveTimeoutMs(timeoutMs: number): number {
  return timeoutMs > 0 ? timeoutMs : DEFAULT_OLLAMA_TIMEOUT_MS;
}

async function checkReachable(
  fetchFn: typeof fetch,
  baseUrl: string,
  generationModel: string,
  embeddingModel: string,
  timeoutMs: number,
): Promise<OllamaResult<void>> {
  const result = await requestJson<TagsResponse>(fetchFn, `${baseUrl}/api/tags`, {
    method: 'GET',
    timeoutMs,
  });
  if (!result.ok) {
    return result;
  }

  if (!modelListed(result.value, generationModel)) {
    return {
      ok: false,
      error: {
        kind: 'model',
        message: `Modell "${generationModel}" ist bei Ollama nicht geladen.`,
      },
    };
  }

  if (!modelListed(result.value, embeddingModel)) {
    return {
      ok: false,
      error: {
        kind: 'model',
        message: `Modell "${embeddingModel}" ist bei Ollama nicht geladen.`,
      },
    };
  }

  return { ok: true, value: undefined };
}

async function runChat(
  fetchFn: typeof fetch,
  baseUrl: string,
  generationModel: string,
  messages: OllamaChatMessage[],
  timeoutMs: number,
): Promise<OllamaResult<string>> {
  const result = await requestJson<ChatResponse>(fetchFn, `${baseUrl}/api/chat`, {
    method: 'POST',
    timeoutMs,
    body: JSON.stringify({
      model: generationModel,
      messages,
      stream: false,
    }),
  });

  if (!result.ok) {
    return result;
  }

  const content = result.value.message?.content;
  if (typeof content !== 'string') {
    return {
      ok: false,
      error: {
        kind: 'response',
        message: 'Ollama-Antwort enthält keinen Nachrichtentext.',
      },
    };
  }

  return { ok: true, value: content };
}

async function runEmbed(
  fetchFn: typeof fetch,
  baseUrl: string,
  embeddingModel: string,
  inputs: string[],
  timeoutMs: number,
): Promise<OllamaResult<number[][]>> {
  const result = await requestJson<EmbedResponse>(fetchFn, `${baseUrl}/api/embed`, {
    method: 'POST',
    timeoutMs,
    body: JSON.stringify({ model: embeddingModel, input: inputs }),
  });

  if (!result.ok) {
    return result;
  }

  const embeddings = result.value.embeddings;
  if (!Array.isArray(embeddings)) {
    return {
      ok: false,
      error: {
        kind: 'response',
        message: 'Ollama-Antwort enthält keine Embeddings.',
      },
    };
  }

  return { ok: true, value: embeddings };
}

function modelListed(tags: TagsResponse, generationModel: string): boolean {
  const models = tags.models ?? [];
  return models.some((entry) => {
    const name = entry.name;
    if (typeof name !== 'string') {
      return false;
    }
    return name === generationModel || name.startsWith(`${generationModel}:`);
  });
}

async function requestJson<T>(
  fetchFn: typeof fetch,
  url: string,
  init: { method: 'GET' | 'POST'; timeoutMs: number; body?: string },
): Promise<OllamaResult<T>> {
  const timeoutMs = resolveTimeoutMs(init.timeoutMs);
  let response: Response;

  try {
    response = await fetchFn(url, {
      method: init.method,
      headers: init.body ? { 'Content-Type': 'application/json' } : undefined,
      body: init.body,
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    return { ok: false, error: mapFetchError(error) };
  }

  let parsed: unknown;
  try {
    parsed = await response.json();
  } catch {
    if (!response.ok) {
      return {
        ok: false,
        error: {
          kind: 'http',
          message: `Ollama HTTP ${response.status}.`,
          status: response.status,
        },
      };
    }
    return {
      ok: false,
      error: {
        kind: 'response',
        message: 'Ollama-Antwort ist kein gültiges JSON.',
        status: response.status,
      },
    };
  }

  const bodyError = extractBodyError(parsed);

  if (!response.ok || (typeof bodyError === 'string' && bodyError.length > 0)) {
    return { ok: false, error: toHttpError(response.status, bodyError) };
  }

  return { ok: true, value: parsed as T };
}

function extractBodyError(parsed: unknown): string | undefined {
  if (parsed && typeof parsed === 'object' && 'error' in parsed) {
    const error = (parsed as ErrorBody).error;
    return typeof error === 'string' ? error : undefined;
  }
  return undefined;
}

function toHttpError(status: number, bodyError?: string): OllamaError {
  const message = bodyError ?? `Ollama HTTP ${status}.`;
  if (isModelError(bodyError)) {
    return { kind: 'model', message, status };
  }
  return { kind: 'http', message, status };
}

function mapFetchError(error: unknown): OllamaError {
  if (isTimeoutError(error)) {
    return {
      kind: 'timeout',
      message: 'Ollama-Anfrage hat das Zeitlimit überschritten.',
    };
  }
  if (error instanceof Error && error.message.length > 0) {
    return {
      kind: 'connection',
      message: error.message,
    };
  }
  return {
    kind: 'connection',
    message: 'Ollama ist nicht erreichbar.',
  };
}

function isTimeoutError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'TimeoutError';
}

function isModelError(bodyError?: string): boolean {
  if (!bodyError) {
    return false;
  }
  const lower = bodyError.toLowerCase();
  return (
    lower.includes('model') &&
    (lower.includes('not found') ||
      lower.includes('does not exist') ||
      lower.includes('nicht gefunden') ||
      lower.includes('nicht geladen'))
  );
}
