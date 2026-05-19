import { afterEach, describe, expect, it, vi } from 'vitest';
import { createOllamaClient } from './client.js';
import { DEFAULT_OLLAMA_TIMEOUT_MS } from './types.js';

const BASE_URL = 'http://127.0.0.1:11434';
const MODEL = 'gemma4:e2b';

function tagsBody(models: string[]) {
  return {
    models: models.map((name) => ({ name })),
  };
}

function mockFetch(handler: (url: string, init?: RequestInit) => Response | Promise<Response>) {
  return vi.fn((input: string | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString();
    return Promise.resolve(handler(url, init));
  }) as typeof fetch;
}

describe('createOllamaClient', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('checkOllamaReachable', () => {
    it('returns ok when tags list includes generation model', async () => {
      const fetchFn = mockFetch((url) => {
        expect(url).toBe(`${BASE_URL}/api/tags`);
        return new Response(JSON.stringify(tagsBody([MODEL])), { status: 200 });
      });

      const client = createOllamaClient(
        { baseUrl: BASE_URL, generationModel: MODEL },
        { fetch: fetchFn },
      );

      const result = await client.checkOllamaReachable();
      expect(result).toEqual({ ok: true, value: undefined });
    });

    it('normalizes trailing slash on base URL', async () => {
      const fetchFn = mockFetch((url) => {
        expect(url).toBe(`${BASE_URL}/api/tags`);
        return new Response(JSON.stringify(tagsBody([MODEL])), { status: 200 });
      });

      const client = createOllamaClient(
        { baseUrl: `${BASE_URL}/`, generationModel: MODEL },
        { fetch: fetchFn },
      );

      expect(await client.checkOllamaReachable()).toEqual({ ok: true, value: undefined });
    });

    it('returns connection error when fetch throws', async () => {
      const fetchFn = vi.fn().mockRejectedValue(new TypeError('fetch failed'));

      const client = createOllamaClient(
        { baseUrl: BASE_URL, generationModel: MODEL },
        { fetch: fetchFn },
      );

      const result = await client.checkOllamaReachable();
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.kind).toBe('connection');
        expect(result.error.message).toContain('fetch failed');
      }
    });

    it('returns http error when tags endpoint fails', async () => {
      const fetchFn = mockFetch(() =>
        new Response(JSON.stringify({ error: 'internal error' }), { status: 500 }),
      );

      const client = createOllamaClient(
        { baseUrl: BASE_URL, generationModel: MODEL },
        { fetch: fetchFn },
      );

      const result = await client.checkOllamaReachable();
      expect(result).toEqual({
        ok: false,
        error: {
          kind: 'http',
          message: 'internal error',
          status: 500,
        },
      });
    });

    it('returns http error on 404 without model hint in body', async () => {
      const fetchFn = mockFetch(() =>
        new Response(JSON.stringify({ error: 'not found' }), { status: 404 }),
      );

      const client = createOllamaClient(
        { baseUrl: BASE_URL, generationModel: MODEL },
        { fetch: fetchFn },
      );

      const result = await client.checkOllamaReachable();
      expect(result).toEqual({
        ok: false,
        error: {
          kind: 'http',
          message: 'not found',
          status: 404,
        },
      });
    });

    it('returns model error when generation model is not in tags', async () => {
      const fetchFn = mockFetch(() =>
        new Response(JSON.stringify(tagsBody(['other:model'])), { status: 200 }),
      );

      const client = createOllamaClient(
        { baseUrl: BASE_URL, generationModel: MODEL },
        { fetch: fetchFn },
      );

      const result = await client.checkOllamaReachable();
      expect(result).toEqual({
        ok: false,
        error: {
          kind: 'model',
          message: `Modell "${MODEL}" ist bei Ollama nicht geladen.`,
        },
      });
    });

    it('matches model tags with variant suffix', async () => {
      const fetchFn = mockFetch(() =>
        new Response(JSON.stringify(tagsBody([`${MODEL}:latest`])), { status: 200 }),
      );

      const client = createOllamaClient(
        { baseUrl: BASE_URL, generationModel: MODEL },
        { fetch: fetchFn },
      );

      expect(await client.checkOllamaReachable()).toEqual({ ok: true, value: undefined });
    });
  });

  describe('chat', () => {
    it('posts to /api/chat with stream false and returns assistant content', async () => {
      const messages = [
        { role: 'system' as const, content: 'Summarize.' },
        { role: 'user' as const, content: 'Hello' },
      ];

      const fetchFn = mockFetch((url, init) => {
        expect(url).toBe(`${BASE_URL}/api/chat`);
        expect(init?.method).toBe('POST');
        const body = JSON.parse(String(init?.body));
        expect(body).toEqual({
          model: MODEL,
          messages,
          stream: false,
        });
        return new Response(
          JSON.stringify({
            message: { role: 'assistant', content: 'Summary text' },
          }),
          { status: 200 },
        );
      });

      const client = createOllamaClient(
        { baseUrl: BASE_URL, generationModel: MODEL },
        { fetch: fetchFn },
      );

      const result = await client.chat(messages);
      expect(result).toEqual({ ok: true, value: 'Summary text' });
    });

    it('uses default timeout of 90 seconds', async () => {
      const timeoutSpy = vi.spyOn(AbortSignal, 'timeout');
      const fetchFn = mockFetch(() =>
        new Response(
          JSON.stringify({ message: { role: 'assistant', content: 'ok' } }),
          { status: 200 },
        ),
      );

      const client = createOllamaClient(
        { baseUrl: BASE_URL, generationModel: MODEL },
        { fetch: fetchFn },
      );

      await client.chat([{ role: 'user', content: 'hi' }]);
      expect(timeoutSpy).toHaveBeenCalledWith(DEFAULT_OLLAMA_TIMEOUT_MS);
    });

    it('returns timeout error when request aborts', async () => {
      const fetchFn = vi.fn().mockRejectedValue(
        new DOMException('The operation timed out.', 'TimeoutError'),
      );

      const client = createOllamaClient(
        { baseUrl: BASE_URL, generationModel: MODEL, timeoutMs: 50 },
        { fetch: fetchFn },
      );

      const result = await client.chat([{ role: 'user', content: 'hi' }]);
      expect(result).toEqual({
        ok: false,
        error: {
          kind: 'timeout',
          message: 'Ollama-Anfrage hat das Zeitlimit überschritten.',
        },
      });
    });

    it('returns http error on non-ok status', async () => {
      const fetchFn = mockFetch(() =>
        new Response(JSON.stringify({ error: 'internal error' }), { status: 500 }),
      );

      const client = createOllamaClient(
        { baseUrl: BASE_URL, generationModel: MODEL },
        { fetch: fetchFn },
      );

      const result = await client.chat([{ role: 'user', content: 'hi' }]);
      expect(result).toEqual({
        ok: false,
        error: {
          kind: 'http',
          message: 'internal error',
          status: 500,
        },
      });
    });

    it('returns model error when Ollama reports missing model', async () => {
      const fetchFn = mockFetch(() =>
        new Response(
          JSON.stringify({ error: "model 'missing' not found" }),
          { status: 404 },
        ),
      );

      const client = createOllamaClient(
        { baseUrl: BASE_URL, generationModel: MODEL },
        { fetch: fetchFn },
      );

      const result = await client.chat([{ role: 'user', content: 'hi' }]);
      expect(result).toEqual({
        ok: false,
        error: {
          kind: 'model',
          message: "model 'missing' not found",
          status: 404,
        },
      });
    });

    it('returns response error when assistant content is missing', async () => {
      const fetchFn = mockFetch(() =>
        new Response(JSON.stringify({ message: { role: 'assistant' } }), { status: 200 }),
      );

      const client = createOllamaClient(
        { baseUrl: BASE_URL, generationModel: MODEL },
        { fetch: fetchFn },
      );

      const result = await client.chat([{ role: 'user', content: 'hi' }]);
      expect(result).toEqual({
        ok: false,
        error: {
          kind: 'response',
          message: 'Ollama-Antwort enthält keinen Nachrichtentext.',
        },
      });
    });

    it('allows per-call timeout override', async () => {
      const timeoutSpy = vi.spyOn(AbortSignal, 'timeout');
      const fetchFn = mockFetch(() =>
        new Response(
          JSON.stringify({ message: { role: 'assistant', content: 'ok' } }),
          { status: 200 },
        ),
      );

      const client = createOllamaClient(
        { baseUrl: BASE_URL, generationModel: MODEL, timeoutMs: 90_000 },
        { fetch: fetchFn },
      );

      await client.chat([{ role: 'user', content: 'hi' }], { timeoutMs: 5_000 });
      expect(timeoutSpy).toHaveBeenCalledWith(5_000);
    });
  });
});
