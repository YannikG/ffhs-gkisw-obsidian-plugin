# [P4-I08] Linting, Formatierung und Skripte für Quality Gates

```text
Phase: 4
Issue-ID: P4-I08
Blockiert von: P4-I01 → nach Anlage GitHub-# eintragen
```

## Meta

- **Issue-ID:** P4-I08
- **Blockiert von:** P4-I01
- **Blockiert:** P4-I06 (Lint- und Format-Jobs), P4-I07 (Doku zu Qualität)

## Abhängigkeiten

- [P4-I01-tooling-build-pipeline.md](./P4-I01-tooling-build-pipeline.md)

## Ziel

Verbindliche **Quality Gates** im Boilerplate: statische Analyse (**Lint**) und einheitliche **Formatierung** mit überprüfbarem Dry-Run (`format:check`), lokal und später in **GitHub Actions** (I06). Technische Empfehlung: **ESLint** (mit TypeScript-Support) plus **Prettier**; alternativ ein **Biome**-Setup, wenn das Team eine einzige Konfiguration bevorzugt (im PR kurz begründen).

## Testbare Akzeptanzkriterien

- [ ] `npm run lint` existiert und beendet mit Exitcode 0 auf dem Stand nach Merge (bestehenden Code ggf. einmalig formatieren und linten, damit `main` grün ist).
- [ ] `npm run format:check` (oder `npm run format -- --check` je nach Tool) existiert und schlägt fehl, wenn eine Datei absichtlich unformatiert wird (kurz im PR beschrieben).
- [ ] Optional aber empfohlen: `.editorconfig` für grundlegende Editor-Konsistenz; optional Prettier-Ignore für generierte Artefakte (`main.js` falls im Repo).
- [ ] Kurzer Abschnitt in der Entwicklerdoku (kann in diesem PR stubben, final in I07): welche Befehle vor jedem PR zu erwarten sind.

## Dev-Lifecycle

1. PR sollte vorwiegend Konfiguration und ggf. maschinelle Formatierung enthalten; Logikänderungen vermeiden.
2. Review: Regeln nicht übertreiben (Team-Konsens); CI-Anbindung erfolgt in I06, hier nur Skripte und Konfig-Dateien bereitstellen.
3. Merge.

## Abhängigkeit zu I06

I06 ruft die Skripte auf CI auf. Wenn I06 zuerst gemerged wurde: Folge-PR in I06 ergänzt die Jobs nach Merge von I08.
