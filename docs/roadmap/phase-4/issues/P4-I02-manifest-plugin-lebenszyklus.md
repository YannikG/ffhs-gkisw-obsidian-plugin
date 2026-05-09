# [P4-I02] Obsidian-Manifest und Plugin-Lebenszyklus

```text
Phase: 4
Issue-ID: P4-I02
Blockiert von: P4-I01 → nach Anlage GitHub-# eintragen
Blockiert: P4-I03, P4-I04, P4-I05, P4-I07 (teilweise)
```

## Meta

- **Phase:** 4
- **Issue-ID:** P4-I02
- **Blockiert von:** P4-I01
- **Blockiert:** P4-I03, P4-I04, P4-I05, P4-I07 (teilweise)

## Abhängigkeiten

- [P4-I01-tooling-build-pipeline.md](./P4-I01-tooling-build-pipeline.md)

## Ziel

Plugin ist in Obsidian ladbar: `manifest.json`, Einstieg `main.js` aus Build, Klasse erweitert `Plugin`, `onload` / `onunload` ohne Laufzeitfehler.

## Testbare Akzeptanzkriterien

- [ ] `manifest.json` mit `id`, `name`, `version`, `minAppVersion` (sinnvoller Wert laut aktueller Obsidian-Doku).
- [ ] `main.ts` exportiert Standard-Plugin gemäss Obsidian-Sample-Pattern.
- [ ] Manuelle Prüfung: Vault öffnen, Plugin unter `.obsidian/plugins/<id>/` aktivieren, Obsidian **keine** rote Fehlermeldung für dieses Plugin.
- [ ] `onunload` entfernt registrierte Handler, falls in I02 schon welche existieren (keine Leaks für spätere Issues).

## Dev-Lifecycle

1. Nach Rebase auf I01-Merge: lokal bauen, Artefakte in Dev-Vault kopieren oder Symlink-Workflow aus provisorischer Doku.
2. PR mit Screenshot oder kurzem Screencast optional (Nachweis «lädt»).
3. Review mit zweitem Gerät oder zweiter Person empfohlen (minAppVersion-Fallen).
4. Merge; Issue schliessen.
