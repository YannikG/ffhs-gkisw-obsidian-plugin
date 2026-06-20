# ffhs-gkisw-obsidian-plugin

**Version 1.0.0 — MVP Release** · [Dokumentation](docs/README.md) · [Benutzer](docs/benutzer.md) · [Architektur](docs/architecture.md) · [Ethik](docs/ethik.md) · [Release Notes](docs/release/notes.md) · [SPEC](SPEC.md)

## Über das Projekt

Im Projekt entsteht ein Werkzeug, das Benutzer:innen beim Erstellen von Zusammenfassungen in Obsidian unterstützt: ein Plugin, das Markdown-Dateien aus einem Ordner eines Vaults einliest und daraus eine strukturierte Zusammenfassung erzeugt.

Bedienung über die Obsidian-Oberfläche über ein Kontextmenü mit der Aktion **Create Summary**. Nach dem Start liest das Plugin die relevanten Markdown-Dateien, bereitet die Inhalte auf, holt passende Ausschnitte über einen Retrieval-Mechanismus (RAG) und übergibt sie zusammen mit einem Prompt an ein lokales Sprachmodell (über Ollama). Das Ergebnis landet als Markdown-Datei im Zielordner, mit ordnerspezifischem Namen (z. B. `MeinOrdner_summary.md`; optional `MeinOrdner_summary_2.md` für weitere Versionen), siehe [SPEC.md](SPEC.md) US-03.

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

Das Projekt entsteht im Rahmen des Bachelorstudiums Informatik an der FFHS, im Kurs «Generative KI für Softwareentwickler» (GKISW), als Projektarbeit. Autoren: Gian Luca Tehrani, Kaan Kaplan, Yannik Gartmann. Spezifikation: [SPEC.md](SPEC.md). Architektur: [docs/architecture.md](docs/architecture.md).

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
| `npm run test:watch` | Vitest im Watch-Modus |
| `npm run lint` | ESLint |
| `npm run format:check` | Prettier-Prüfung (CI; siehe Hinweis unten) |
| `npm run format` | Prettier schreibt Korrekturen |
| `npm run deploy -- "<vault-pfad>"` | Bauen und in einen Test-Vault kopieren (siehe unten) |

Spezifikation und Verhalten: [SPEC.md](SPEC.md). Systemarchitektur: [docs/architecture.md](docs/architecture.md). Module: [docs/modules/README.md](docs/modules/README.md).

### Ollama

Lokale [Ollama](https://ollama.com/download)-Instanz mit den Modell-Tags aus [SPEC.md](SPEC.md) §4.1. Vault-Inhalte gehen nur an `127.0.0.1` (oder die konfigurierte Base URL), siehe SPEC PRD-NF02. Endnutzer-Schritte: [docs/benutzer.md](docs/benutzer.md).

1. **Installation:** Ollama von [ollama.com/download](https://ollama.com/download) installieren und starten (Desktop-App oder `ollama serve`). Default-API: `http://127.0.0.1:11434`.
2. **Modelle laden:**

```bash
ollama pull gemma4:e2b
ollama pull nomic-embed-text
```

Optional (mehr RAM, bessere Qualität): `ollama pull gemma4:e4b`.

Details und Troubleshooting: [docs/ollama/README.md](docs/ollama/README.md).

3. **Verifikation:**

```bash
ollama list
curl -s http://127.0.0.1:11434/api/tags
```

`ollama list` soll mindestens `gemma4:e2b` und `nomic-embed-text` zeigen. `curl` liefert JSON mit den installierten Modellen (HTTP 200).

Die Plugin-Einstellungen nutzen dieselben Defaults (SPEC §6): Base URL `http://127.0.0.1:11434`, Generierung `gemma4:e2b`, Embeddings `nomic-embed-text`.

### Tests

- Testdateien: `src/**/*.test.ts` (Vitest, neben dem Modul).
- Gesamtsuite: `npm test`.
- Einzeldatei: `npx vitest run src/settings.test.ts`
- Watch: `npm run test:watch` (oder `npx vitest` / `npx vitest --watch`)

In Unit-Tests läuft kein echtes Obsidian: `vitest.config.ts` mappt `obsidian` auf `src/test-utils/obsidian-stub.ts`. Zusätzliche Grenzen mocken mit Vitest `vi.mock('obsidian', …)` nach Bedarf.

### Qualität vor Pull Request

Details: [docs/qualitaet.md](docs/qualitaet.md). Reihenfolge wie in [GitHub Actions](.github/workflows/ci.yml):

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

#### Kurztest in Obsidian

1. Plugin aktivieren, keine Ladefehlermeldung.
2. **Einstellungen** des Plugins — drei Abschnitte (Ollama / Vektorindex / Zusammenfassung). Defaults laut [SPEC.md](SPEC.md) §6: Ollama-URL `http://127.0.0.1:11434`, Generierungsmodell `gemma4:e2b`, Embedding-Modell `nomic-embed-text`. Wert ändern, Plugin neu laden: Wert bleibt erhalten.
3. Einstellungen → Button **Verbindung testen**: Erfolgs-Notice nennt beide Modelle.
4. Im Datei-Explorer **Rechtsklick auf einen Ordner** (nicht auf eine Datei) → **Create Summary** → Notices für Indexierung und Generierung → Erfolgs-Notice mit `{Ordnername}_summary.md`.

Ollama-Setup siehe Abschnitt **Ollama** oben. Ethik, Governance und bekannte Limitationen: [docs/ethik.md](docs/ethik.md).

### Onboarding-Checkliste (Reviewer, P4-I07)

Nach Merge oder im PR-Kommentar abhaken — nur diese README (+ [docs/modules/README.md](docs/modules/README.md)), kein mündliches Zusatzwissen:

- [ ] Frischer Clone: `npm ci` → `npm run build` (Exit 0)
- [ ] `npm test`, `npm run lint`, `npm run format:check` (jeweils Exit 0)
- [ ] `npm run deploy -- "…"` oder manuelles Kopieren → Plugin lädt in Obsidian
- [ ] Einstellungen: Defaults, Änderung überlebt Reload; «Verbindung testen» zeigt Erfolgs-Notice
- [ ] Ordner → **Create Summary** → Erfolgs-Notice mit `{Ordnername}_summary.md`

## Release

**v1.0.0** (2026-06-04) — MVP freigegeben. Vollständige Release-Notizen: [docs/release/notes.md](docs/release/notes.md).

## Roadmap

[docs/roadmap/README.md](docs/roadmap/README.md) — zwölf Phasen mit Links zu `phase-N/README.md` und Issue-Spezifikationen.

## Zusammenarbeit

[docs/zusammenarbeit/README.md](docs/zusammenarbeit/README.md) — Issues, Board, Spezifikation im Repo.
