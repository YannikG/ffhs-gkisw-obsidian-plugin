# [P4-I09] Unit-Test-Infrastruktur und erstes Beispiel

```text
Phase: 4
Issue-ID: P4-I09
Blockiert von: P4-I01 → nach Anlage GitHub-# eintragen
```

## Meta

- **Issue-ID:** P4-I09
- **Blockiert von:** P4-I01
- **Blockiert:** P4-I06 (Test-Job), P4-I07 (Test-Doku); Ergänzungstests in späteren Issues

## Abhängigkeiten

- [P4-I01-tooling-build-pipeline.md](./P4-I01-tooling-build-pipeline.md)

## Ziel

Automatische **Unit-Tests** sind technisch und prozessual Teil des Boilerplates: Runner konfiguriert, ein erstes sinnvolles Beispiel (kein reines `expect(true)` ohne Bezug), Skript `npm test` (oder explizit dokumentierter Name), lauffähig lokal und vorbereitet für CI (I06).

## Technische Empfehlung (nicht zwingend, im PR begründen bei Abweichung)

- **Vitest** mit TypeScript, Ausführung in Node; Testdateien-Konvention im Repo festlegen (z. B. `*.test.ts` neben Quellcode oder unter `tests/`).

## Testbare Akzeptanzkriterien

- [ ] `npm test` (oder dokumentiertes Äquivalent) beendet mit Exitcode 0 auf sauberem Clone nach `npm ci`.
- [ ] Mindestens **eine** Testdatei, die **wartbare** Logik prüft (z. B. Factory für Default-Einstellungen aus einem reinen Modul, String-Normalisierung, Chunk-Hilfsfunktion ohne Obsidian; sobald P4-I04 existiert, kann der Test auf dieselbe Default-Logik zeigen und Merge-Reihenfolge per Rebase koordiniert werden).
- [ ] Kurze README- oder Kommentar-Notiz: wie Obsidian-spezifischer Code in Unit-Tests behandelt wird (Mocks, keine Pflicht für E2E in diesem Issue).
- [ ] Optional: `npm run test:watch` oder Vitest-Watch im `package.json`, in I07 dokumentiert.

## Dev-Lifecycle

1. Lokal: `npm ci`, `npm test`; PR mit kurzer Begründung der Runner-Wahl.
2. Review: ein Teammitglied führt auf zweitem Clone nur `npm ci` und `npm test` aus.
3. Merge; danach I06 um Test-Job ergänzen (eigenes PR oder gleicher PR, falls Branch-Koordination vereinbart).

## Ausserhalb des Scopes

End-to-End-Tests in echtem Obsidian-Fenster, Lasttests, vollständige Abdeckung der Plugin-Oberfläche (folgen späteren Phasen).
