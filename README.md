# ffhs-gkisw-obsidian-plugin

## Über das Projekt

Im Projekt entsteht ein Werkzeug, das Benutzer:innen beim Erstellen von Zusammenfassungen in Obsidian unterstützt: ein Plugin, das Markdown-Dateien aus einem Ordner eines Vaults einliest und daraus eine strukturierte Zusammenfassung erzeugt.

Bedienung über die Obsidian-Oberfläche, beispielsweise über ein Kontextmenü mit der Aktion «Summary erstellen». Nach dem Start liest das Plugin die relevanten Markdown-Dateien, bereitet die Inhalte auf, holt passende Ausschnitte über einen Retrieval-Mechanismus und übergibt sie zusammen mit einem Prompt an ein lokales Sprachmodell (über Ollama). Das Ergebnis landet als Markdown-Datei im Zielordner, mit ordnerspezifischem Namen (z. B. `MeinOrdner_summary.md`; optional `MeinOrdner_summary_2.md` für weitere Versionen), siehe [SPEC.md](SPEC.md) US-03.

Architektur in Kurzform:

- Obsidian-Oberfläche: Einstieg, z. B. Kontextmenü.
- Plugin: steuert den Ablauf.
- Markdown im Vault: Input und Wissensbasis.
- Chunking: zerlegt Texte in handliche Abschnitte.
- Embeddings: Vektoren für die Abschnitte.
- Vektorindex / Retrieval: speichert Embeddings, semantische Suche.
- Lokales LLM (Ollama): erzeugt den Zusammenfassungstext.
- `{Ordnername}_summary.md`: Standard-Ausgabedatei; optional nummerierte Varianten `_summary_2`, `_summary_3`, …

Das Plugin erstellt und speichert die Datei; das Modell liefert nur den Inhalt der Zusammenfassung. So bleibt der Kontext des Modells fokussiert, und das Plugin kann die üblichen Obsidian-Events nutzen, um auf Änderungen im Vault zu reagieren.

Das Projekt entsteht im Rahmen des Bachelorstudiums Informatik an der FFHS, im Kurs «Generative KI für Softwareentwickler» (GKISW), als Projektarbeit. Autoren: Gian Luca Tehrani, Kaan Kaplan, Yannik Gartmann. Architektur, Anforderungen und Schnittstellen sind in der [SPEC.md](SPEC.md) dokumentiert.

## Abhängigkeiten

Für die Arbeit an diesem Repository rechnen wir mit einem agentischen Coding-Agenten (z. B. [Cursor](https://cursor.com) oder [Claude Code](https://www.anthropic.com/claude-code)) sowie der [GitHub CLI](https://cli.github.com) (`gh`) für Issues, Branches und den Umgang mit GitHub.

**Build:** Node.js **20 oder neuer** (siehe `engines` in `package.json`). Auf einem frischen Clone: `npm ci`, danach `npm run build` erzeugt `main.js` im Repository-Root. `npm run dev` startet parallel `tsc --noEmit --watch` und esbuild im Watch-Modus. Einmaliges Typecheck ohne Bundle: `npm run typecheck`. Tests: `npm test` (Vitest). In einen Test-Vault deployen: `npm run deploy -- "<vault-pfad>"` (siehe unten).

### Plugin in einem Test-Vault installieren

Plugin-ID (Ordnername): `ffhs-gkisw-obsidian-plugin` (siehe `manifest.json`).

Ziel im Vault:

`.obsidian/plugins/ffhs-gkisw-obsidian-plugin/`

Dort liegen `manifest.json`, `main.js` und optional `main.js.map`.

**Automatisch bauen und kopieren** (`scripts/deploy-to-vault.mjs`):

```bash
npm run deploy -- "/pfad/zum/Test Vault"
```

Der Pfad kann sein:

- Vault-Root → kopiert nach `<vault>/.obsidian/plugins/ffhs-gkisw-obsidian-plugin/`
- `.obsidian` → kopiert nach `<vault>/.obsidian/plugins/ffhs-gkisw-obsidian-plugin/`
- `.obsidian/plugins` → legt den Plugin-Unterordner an
- bereits der Plugin-Ordner `.../plugins/ffhs-gkisw-obsidian-plugin` → überschreibt Dateien dort

**Pfade mit Leerzeichen in Anführungszeichen setzen**, sonst bricht die Shell den Pfad (z. B. `Test Vault` wird zu `Test`).

Beispiele:

```bash
npm run deploy -- "/Users/you/vaults/Test Vault"
npm run deploy -- "/Users/you/vaults/Test Vault/.obsidian"
npm run deploy -- "/Users/you/vaults/Test Vault/.obsidian/plugins/ffhs-gkisw-obsidian-plugin"
```

In Obsidian: Einstellungen → Community plugins → Plugin aktivieren. Keine rote Fehlermeldung für dieses Plugin = Laden ok (`minAppVersion` in `manifest.json` beachten).

**Manuell:** nach `npm run build` die drei Dateien oben in den Plugin-Ordner kopieren.

Weitere Voraussetzungen (Ollama, Produktfunktionen) ergänzen wir hier nach und nach, sobald die zugehörigen Arbeitspakete umgesetzt sind.

## Roadmap

[Phasenplan und Status](docs/roadmap/overview.md) (inkl. Links zu den Phasen-READMEs).

## Zusammenarbeit

[Arbeit im Team und mit GitHub](docs/zusammenarbeit/README.md) (Issues, Planung im Repo, Rollen).
