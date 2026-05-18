# ffhs-gkisw-obsidian-plugin

## Über das Projekt

Im Projekt entsteht ein Werkzeug, das Benutzer:innen beim Erstellen von Zusammenfassungen in Obsidian unterstützt: ein Plugin, das Markdown-Dateien aus einem Ordner eines Vaults einliest und daraus eine strukturierte Zusammenfassung erzeugt.

Bedienung über die Obsidian-Oberfläche, beispielsweise über ein Kontextmenü mit der Aktion **Create Summary** (Stub in Phase 4). Nach dem Start liest das Plugin die relevanten Markdown-Dateien, bereitet die Inhalte auf, holt passende Ausschnitte über einen Retrieval-Mechanismus und übergibt sie zusammen mit einem Prompt an ein lokales Sprachmodell (über Ollama). Das Ergebnis landet als Markdown-Datei im Zielordner, mit ordnerspezifischem Namen (z. B. `MeinOrdner_summary.md`; optional `MeinOrdner_summary_2.md` für weitere Versionen), siehe [SPEC.md](SPEC.md) US-03.

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

## Entwicklung

Für die Arbeit am Repository: Node.js **20 oder neuer** (`engines` in `package.json`), optional ein agentischer Coding-Agent (z. B. [Cursor](https://cursor.com)) und die [GitHub CLI](https://cli.github.com) (`gh`) für Issues und Branches.

### Lokales Setup

Auf einem frischen Clone:

```bash
npm ci
npm run build
```

| Skript | Zweck |
|--------|--------|
| `npm run build` | Typecheck und Bundle → `main.js` im Repository-Root |
| `npm run dev` | `tsc --noEmit --watch` und esbuild im Watch-Modus |
| `npm run typecheck` | TypeScript ohne Bundle |
| `npm test` | Vitest (alle Unit-Tests) |
| `npm run lint` | ESLint |
| `npm run format:check` | Prettier-Prüfung (CI; siehe Hinweis unten) |
| `npm run format` | Prettier schreibt Korrekturen |
| `npm run deploy -- "<vault-pfad>"` | Bauen und in einen Test-Vault kopieren (siehe unten) |

Spezifikation und Verhalten: [SPEC.md](SPEC.md). Modulübersicht unter `src/`: [src/README.md](src/README.md).

### Tests

- Testdateien: `src/**/*.test.ts` (Vitest, neben dem Modul).
- Gesamtsuite: `npm test`.
- Einzeldatei: `npx vitest run src/settings.test.ts`
- Watch: `npx vitest` oder `npx vitest --watch`

In Unit-Tests läuft kein echtes Obsidian: `vitest.config.ts` mappt `obsidian` auf `src/test-utils/obsidian-stub.ts`. Zusätzliche Grenzen mocken mit Vitest `vi.mock('obsidian', …)` nach Bedarf.

### Qualität vor Pull Request

Reihenfolge wie in [GitHub Actions](.github/workflows/ci.yml):

1. `npm run format:check` (oder `npm run format` zum Beheben)
2. `npm run lint`
3. `npm test`
4. `npm run build`

Pull Requests gegen `master` brauchen grüne Checks: Format, Lint, Tests und Build.

`format:check` und `format` betreffen nur Dateien ausserhalb [`.prettierignore`](.prettierignore) (u. a. `README.md`, `docs/`, `SPEC.md`).

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

In Obsidian: **Einstellungen → Community plugins** → **Obsidian Summarizer** aktivieren.

**Plugin lädt nicht** (roter Hinweis oder fehlt in der Liste): Obsidian-Version unter `minAppVersion` in `manifest.json` (aktuell `1.0.0`); Plugin-Ordnername muss exakt `ffhs-gkisw-obsidian-plugin` sein; `main.js` und `manifest.json` müssen im Plugin-Ordner liegen (nach `npm run build` bzw. `npm run deploy`).

**Manuell:** nach `npm run build` die drei Dateien oben in den Plugin-Ordner kopieren.

#### Kurztest in Obsidian (Boilerplate)

1. Plugin aktivieren, keine Ladefehlermeldung.
2. **Einstellungen** des Plugins (drei Felder): Defaults laut [SPEC.md](SPEC.md) §6 — Ollama-URL `http://127.0.0.1:11434`, Generierungsmodell `gemma4:e2b`, Embedding-Modell `nomic-embed-text`. Wert ändern, Plugin neu laden (oder Obsidian neu starten): Wert bleibt erhalten.
3. Im Datei-Explorer **Rechtsklick auf einen Ordner** (nicht auf eine Datei) → **Create Summary** → Notice mit Text `Stub: Create Summary`.

Weitere Produktfunktionen (Ollama, RAG, echte Zusammenfassung) folgen in späteren Phasen; siehe [Roadmap](docs/roadmap/overview.md).

### Onboarding-Checkliste (Reviewer, P4-I07)

Nach Merge oder im PR-Kommentar abhaken — nur diese README (+ verlinktes [src/README.md](src/README.md)), kein mündliches Zusatzwissen:

- [ ] Frischer Clone: `npm ci` → `npm run build` (Exit 0)
- [ ] `npm test`, `npm run lint`, `npm run format:check` (jeweils Exit 0)
- [ ] `npm run deploy -- "…"` oder manuelles Kopieren → Plugin lädt in Obsidian
- [ ] Einstellungen: Defaults, Änderung überlebt Reload
- [ ] Ordner → **Create Summary** → Notice `Stub: Create Summary`

## Roadmap

[Phasenplan und Status](docs/roadmap/overview.md) (inkl. Links zu den Phasen-READMEs).

## Zusammenarbeit

[Arbeit im Team und mit GitHub](docs/zusammenarbeit/README.md) (Issues, Planung im Repo, Rollen).
