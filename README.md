# ffhs-gkisw-obsidian-plugin

## Über das Projekt

Im Projekt entsteht ein Werkzeug, das Benutzer:innen beim Erstellen von Zusammenfassungen in Obsidian unterstützt: ein Plugin, das Markdown-Dateien aus einem Ordner eines Vaults einliest und daraus eine strukturierte Zusammenfassung erzeugt.

Bedienung über die Obsidian-Oberfläche, beispielsweise über ein Kontextmenü mit der Aktion «Summary erstellen». Nach dem Start liest das Plugin die relevanten Markdown-Dateien, bereitet die Inhalte auf, holt passende Ausschnitte über einen Retrieval-Mechanismus und übergibt sie zusammen mit einem Prompt an ein lokales Sprachmodell (über Ollama). Das Ergebnis landet als Markdown-Datei, typischerweise `summary.md`, im gleichen Ordner oder in einem festgelegten Zielordner.

Architektur in Kurzform:

- Obsidian-Oberfläche: Einstieg, z. B. Kontextmenü.
- Plugin: steuert den Ablauf.
- Markdown im Vault: Input und Wissensbasis.
- Chunking: zerlegt Texte in handliche Abschnitte.
- Embeddings: Vektoren für die Abschnitte.
- Vektorindex / Retrieval: speichert Embeddings, semantische Suche.
- Lokales LLM (Ollama): erzeugt den Zusammenfassungstext.
- `summary.md`: Ausgabedatei.

Das Plugin erstellt und speichert die Datei; das Modell liefert nur den Inhalt der Zusammenfassung. So bleibt der Kontext des Modells fokussiert, und das Plugin kann die üblichen Obsidian-Events nutzen, um auf Änderungen im Vault zu reagieren.

Das Projekt entsteht im Rahmen des Bachelorstudiums Informatik an der FFHS, im Kurs «Generative KI für Softwareentwickler» (GKISW), als Projektarbeit. Architektur, Anforderungen und Schnittstellen sind in der [SPEC.md](SPEC.md) dokumentiert.

## Abhängigkeiten

Für die Arbeit an diesem Repository rechnen wir mit einem agentischen Coding-Agenten (z. B. [Cursor](https://cursor.com) oder [Claude Code](https://www.anthropic.com/claude-code)) sowie der [GitHub CLI](https://cli.github.com) (`gh`) für Issues, Branches und den Umgang mit GitHub.

**Build:** Node.js **20 oder neuer** (siehe `engines` in `package.json`). Auf einem frischen Clone: `npm ci`, danach `npm run build` erzeugt `main.js` im Repository-Root. Für schnelle Iteration: `npm run dev` startet esbuild im Watch-Modus (ohne paralleles `tsc --noEmit`; vollständiges Typechecking erfolgt über `npm run build` bzw. `npm run typecheck`).

Weitere Voraussetzungen (Obsidian, Ollama, Installation im Vault) ergänzen wir hier nach und nach, sobald die zugehörigen Arbeitspakete umgesetzt sind.

## Roadmap

[Phasenplan und Status](docs/roadmap/overview.md) (inkl. Links zu den Phasen-READMEs).

## Zusammenarbeit

[Arbeit im Team und mit GitHub](docs/zusammenarbeit/README.md) (Issues, Planung im Repo, Rollen).
