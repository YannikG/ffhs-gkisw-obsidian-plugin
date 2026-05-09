# [P4-I03] Modul-Skelett unter `src/`

```text
Phase: 4
Issue-ID: P4-I03
Blockiert von: P4-I02 → nach Anlage GitHub-# eintragen
```

## Meta

- **Issue-ID:** P4-I03
- **Blockiert von:** P4-I02

## Abhängigkeiten

- [P4-I02-manifest-plugin-lebenszyklus.md](./P4-I02-manifest-plugin-lebenszyklus.md)

## Ziel

Ordner und leere oder minimal typisierte Module vorbereiten, die später Ollama, Summary und RAG aufnehmen, ohne jetzt Fachlogik zu implementieren.

## Parallelität

Kann parallel zu P4-I04 und P4-I05 bearbeitet werden, wenn Dateikonventionen im README oder in I02 festgelegt sind.

## Testbare Akzeptanzkriterien

- [ ] Vorgeschlagene Struktur existiert, z. B. `src/settings.ts` (falls nicht schon durch I04), `src/ollama/` (Stub-Datei oder `README` im Ordner), `src/summary/` Platzhalter.
- [ ] `npm run build` bleibt grün.
- [ ] Kein neuer Laufzeitfehler in Obsidian beim Laden (Smoke-Test).

## Dev-Lifecycle

1. Kleine PR, nur Struktur und Namenskonvention.
2. Review-Fokus: Importkreise und Namenskonflikte mit I04/I05 koordinieren (Kommunikation im PR oder kurzes Sync).

## Scope-Grenze

Keine HTTP-Calls, keine SQLite-Dateien.
