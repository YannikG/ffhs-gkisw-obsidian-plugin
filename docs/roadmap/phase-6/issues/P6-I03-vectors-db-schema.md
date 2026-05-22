# [P6-I03] vectors.db und SQLite-Schema

```text
Phase: 6
Issue-ID: P6-I03
Blockiert von: P6-I02
```

## Meta

- **Issue-ID:** P6-I03
- **Blockiert von:** [P6-I02](./P6-I02-ollama-embeddings-client.md), [P5-I07](../../phase-5/issues/P5-I07-phase5-dokumentation.md)
- **Blockiert:** P6-I04, P6-I06

## Abhängigkeiten

- [P6-I02-ollama-embeddings-client.md](./P6-I02-ollama-embeddings-client.md)
- [P5-I07-phase5-dokumentation.md](../../phase-5/issues/P5-I07-phase5-dokumentation.md)

## Ziel

Lokaler **Vektorindex** als SQLite-Datenbank `vectors.db` im **Plugin-Datenverzeichnis** (nicht im Vault, SPEC §4.1). Schema für Chunk-Metadaten und Vektoren (`sqlite-wasm-vec`); CRUD und Abfrage nach Ordner-Scope (Pfad-Prefix) für Phase 7.

## Testbare Akzeptanzkriterien

- [ ] Persistenz unter Plugin-Datenpfad; Dateiname `vectors.db`.
- [ ] Schema mindestens: `vault_path`, `chunk_index`, `embedding_model`, `text` (oder Hash), Vektor-Spalte kompatibel mit `sqlite-wasm-vec`; `mtime` oder `content_hash` für Invalidierung dokumentiert.
- [ ] API (Pure oder dünn): `upsertChunks`, `deleteByVaultPath`, `queryByFolderPrefix(folderPath)`, `truncateAll` (leert alle Index-Tabellen, Schema bleibt).
- [ ] Unit-Test: zwei Chunks upserten → Abfrage per Ordner-Prefix liefert Treffer → `deleteByVaultPath` entfernt alle Chunks der Datei → `npm test` grün.
- [ ] **Manueller Obsidian-Smoke** in PR beschrieben (WASM/Electron-Risiko); bei Blocker Kurzbegründung und Follow-up.
- [ ] `npm run build` grün nach Abhängigkeits-Ergänzung in `package.json`.

## Dev-Lifecycle

1. TDD: Roundtrip upsert/query/delete auf Test-DB.
2. PR mit Begründung der WASM-/Bundle-Wahl; Build prüfen.
3. Review gegen [SPEC.md](../../../../SPEC.md) §4.1, Tech-Stack-Checkliste §9.

## Ausserhalb des Scopes

- Retrieval Top-K und Ranking-Qualität (Phase 7).
- Idle-Job, Vault-Events (P6-I04).
- Einstellungs-UI (P6-I06); Embedding-Aufrufe bleiben in P6-I02.
