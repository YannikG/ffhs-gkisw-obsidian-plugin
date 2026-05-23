# [P7-I02] Retrieve Top-K (semantisch)

```text
Phase: 7
Issue-ID: P7-I02
Blockiert von: P7-I01, P6-I07
```

## Meta

- **Issue-ID:** P7-I02
- **Blockiert von:** [P7-I01](./P7-I01-retrieval-query-text.md), [P6-I07](../../phase-6/issues/P6-I07-rag-modul-integration.md)
- **Blockiert:** P7-I03

## Abhängigkeiten

- [P7-I01-retrieval-query-text.md](./P7-I01-retrieval-query-text.md)
- [P6-I07-rag-modul-integration.md](../../phase-6/issues/P6-I07-rag-modul-integration.md)
- [P6-I03-vectors-db-schema.md](../../phase-6/issues/P6-I03-vectors-db-schema.md) (`searchSimilarInFolder`)

## Ziel

Semantisches **Retrieval Top-K** im **Ordner**-Scope: Query-Text embedden → cosine Similarity in `vectors.db` nur unter `vault_path`-Prefix des Ordners → geordnete Chunk-Liste.

## Testbare Akzeptanzkriterien

- [ ] Export z. B. `retrieveTopKForFolder({ folderPath, queryText, k })` → Chunks mit `vaultPath`, `chunkIndex`, `text` (Similarity absteigend).
- [ ] **min(K, verfügbar):** bei 3 Chunks im Scope und K=8 → 3 Treffer; bei K=2 → 2 Treffer.
- [ ] **0 Treffer** → leeres Array (kein Fehler hier; Orchestrator P7-I04 → **Leeres Retrieval**).
- [ ] Nutzt P6-Embeddings-Client und `searchSimilarInFolder(embedding, folderPrefix, k)` aus P6-I03.
- [ ] Unit-Tests mit Mock-Embed und Mock-Store; `npm test` grün.

## Dev-Lifecycle

1. TDD: Mock mit 3 Chunks, K=8 → Länge 3.
2. PR ohne Menü; Abhängigkeit P6-I03-API muss erfüllt sein.
3. Review gegen [SPEC.md](../../../../SPEC.md) §4.2.

## Ausserhalb des Scopes

- `buildRetrievalContext`, Settings `retrievalTopK` (P7-I03).
- Create Summary Menü (P7-I04).
