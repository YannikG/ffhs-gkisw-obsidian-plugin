# [P5-I02] Ollama-HTTP-Client (Healthcheck und Chat)

```text
Phase: 5
Issue-ID: P5-I02
Blockiert von: P4-I04
```

## Meta

- **Issue-ID:** P5-I02
- **Blockiert von:** P4-I04
- **Blockiert:** P5-I06

## Abhängigkeiten

- [P4-I04-einstellungen-persistenz.md](../../phase-4/issues/P4-I04-einstellungen-persistenz.md)

## Ziel

Reiner HTTP-Client unter `src/ollama/` für Erreichbarkeitsprüfung und Chat-Completion über Ollama `/api/chat`. Konfiguration über ein Client-Config-Objekt (Base URL, Generierungsmodell, Timeout in ms); Persistenz in Einstellungen folgt in P5-I06.

## Testbare Akzeptanzkriterien

- [ ] Exportierte API (z. B. `createOllamaClient(config)`).
- [ ] `checkOllamaReachable` (oder gleichwertig) liefert klares Resultat bei Erfolg und bei Verbindungsfehler.
- [ ] `chat(messages, options)` ruft `/api/chat` mit `generationModel` auf; Timeout über Client-Config (Default 90 s, Tests mit kurzem Timeout).
- [ ] Fehler (HTTP, Timeout, fehlendes Modell) als typisierte Resultate, kein stilles `catch`.
- [ ] `src/ollama/*.test.ts` mit gemocktem `fetch`; `npm test` grün.
- [ ] Kein Embedding-Endpoint in diesem Issue.

## Dev-Lifecycle

1. TDD: Healthcheck-Test → Implementierung → Chat-Test → Implementierung.
2. PR ohne Obsidian-Pflicht; manueller Smoke optional gegen lokales Ollama.
3. Review, Merge.

## Scope

Keine Obsidian-Notices, kein Vault, kein Prompttext (P5-I03). Embeddings: Phase 6.
