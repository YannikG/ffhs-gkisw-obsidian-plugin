# [P6-I02] Ollama-Embeddings-HTTP-Client

```text
Phase: 6
Issue-ID: P6-I02
GitHub: #35
Blockiert von: P5-I07 (#25)
```

## Meta

- **Issue-ID:** P6-I02
- **GitHub:** #35
- **Blockiert von:** [P5-I07](../../phase-5/issues/P5-I07-phase5-dokumentation.md) (#25)
- **Blockiert:** P6-I03

## Abhängigkeiten

- [P5-I07-phase5-dokumentation.md](../../phase-5/issues/P5-I07-phase5-dokumentation.md)
- [P5-I02-ollama-http-client.md](../../phase-5/issues/P5-I02-ollama-http-client.md) (Client-Muster, Config)

## Ziel

Erweiterung von `src/ollama/` um Embedding-Aufrufe gegen die Ollama-REST-API (SPEC §5) für das konfigurierte **Embedding-Modell** (`nomic-embed-text` Default). Gleiche Fehlerphilosophie wie Chat (typisierte Resultate, Timeout).

## Testbare Akzeptanzkriterien

- [ ] Export z. B. `embed(inputs, options)` auf bestehendem Client (`createOllamaClient`) oder dokumentiert erweiterte Factory; `embeddingModel` und Base URL aus Config.
- [ ] Erfolg: Vektor(en) als `number[]` pro Input-String; Fixture-Test mit gemocktem `fetch`.
- [ ] Fehler: HTTP-Fehler, Timeout, nicht erreichbare Instanz → typisiertes Resultat (kein stilles `catch`).
- [ ] `src/ollama/*.test.ts` ergänzt; `npm test` grün.
- [ ] Kein Vault, kein SQLite in diesem Issue.

## Dev-Lifecycle

1. TDD: ein Embedding-Erfolgstest mit Mock-`fetch` → Implementierung.
2. Optional manueller Smoke gegen lokales Ollama mit `nomic-embed-text`.
3. Review, Merge.

## Ausserhalb des Scopes

- Batch-Optimierung über API-Minimum hinaus (nur so viel Batching wie die gewählte Ollama-API nahelegt).
- Chunking (P6-I01), Persistenz (P6-I03).
