# [P4-I04] Einstellungen und Persistenz (SPEC-Defaults)

```text
Phase: 4
Issue-ID: P4-I04
Blockiert von: P4-I02 → nach Anlage GitHub-# eintragen
```

## Meta

- **Issue-ID:** P4-I04
- **Blockiert von:** P4-I02

## Abhängigkeiten

- [P4-I02-manifest-plugin-lebenszyklus.md](./P4-I02-manifest-plugin-lebenszyklus.md)

## Ziel

`PluginSettingTab` mit Feldern gemäss `SPEC.md` Abschnitt 6: Ollama Base URL, Generierungsmodell, Embedding-Modell; Defaults wie in SPEC; Werte über Plugin-Reload persistent.

## Parallelität

Parallel zu P4-I03 und P4-I05 möglich.

## Testbare Akzeptanzkriterien

- [ ] Drei Eingabefelder (oder gleichwertige UI) mit Defaults: `http://127.0.0.1:11434`, `gemma4:e2b`, `nomic-embed-text`.
- [ ] Werte ändern, Obsidian neu starten oder Plugin neu laden: geänderte Werte sind noch vorhanden (`loadData` / `saveData`).
- [ ] Fehlerhafte Eingaben (optional): leere URL zeigt Notice oder Validierung; minimaler Test in PR-Beschreibung dokumentiert.

## Dev-Lifecycle

1. Screenshots der Einstellungsseite in PR empfohlen.
2. Review prüft SPEC-Konformität der Defaults.
3. Merge.

## Blockiert

P4-I07 (Doku soll finale Einstellungen beschreiben).
