# [P6-I01] Absatz-Chunking (Pure)

```text
Phase: 6
Issue-ID: P6-I01
Blockiert von: P5-I07
```

## Meta

- **Issue-ID:** P6-I01
- **Blockiert von:** [P5-I07](../../phase-5/issues/P5-I07-phase5-dokumentation.md) (Phase-5-DoD)
- **Blockiert:** P6-I05

## Abhängigkeiten

- [P5-I07-phase5-dokumentation.md](../../phase-5/issues/P5-I07-phase5-dokumentation.md)

## Ziel

Reine Funktion zum Zerlegen von Markdown-Quelltext in **Chunks** für Embedding und Index: absatz- und überschriftenbewusst, mit konfigurierbarer **Chunk-Grösse** und **Chunk-Overlap** (Defaults 1000 / 200 Zeichen, SPEC §6).

## Testbare Akzeptanzkriterien

- [ ] Export z. B. `chunkMarkdown(text, { size, overlap })` → geordnete Liste mit `chunkIndex` (0-basiert) und `text` pro Chunk.
- [ ] **Block-Trennung:** Absätze an `\n\n+`; Markdown-Überschriften (`^#{1,6}\s`) starten jeweils einen eigenen Block.
- [ ] **Zusammenführen:** Blöcke werden zu Chunks zusammengeführt, bis `size` erreicht ist (letzter Block darf allein stehen, auch wenn kleiner als `size`).
- [ ] **Chunk-Overlap:** Chunk N+1 beginnt mit Wiederholung der letzten vollständigen Blöcke von Chunk N; Summe der Zeichen dieser Blöcke ≤ `overlap`; kein Schnitt mitten im Block.
- [ ] Defaults `DEFAULT_CHUNK_SIZE = 1000`, `DEFAULT_CHUNK_OVERLAP = 200` exportiert (von P6-I06 in Einstellungen übernommen).
- [ ] Unit-Tests: Markdown mit mehreren Absätzen und Überschrift → erwartete Chunk-Anzahl, Overlap-Inhalt am Start von Chunk 2.
- [ ] `npm test` grün.

## Dev-Lifecycle

1. TDD: ein Verhaltenstest (Overlap + Absatzgrenzen) → minimale Implementierung.
2. PR nur Pure-Modul (z. B. unter `src/rag/` oder `src/rag/chunking.ts`); keine Obsidian-Imports.
3. Review gegen diese Datei und [SPEC.md](../../../../SPEC.md) §4.2, §6.

## Ausserhalb des Scopes

- Token-Counting; Sonderbehandlung von Code-Fences (nicht mitten in ``` splitten): nicht MVP.
- Ollama, SQLite, Vault, Einstellungs-UI (P6-I02, P6-I03, P6-I06).
