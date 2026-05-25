GitHub-Issue anlegen für: $ARGUMENTS

SSOT: `docs/zusammenarbeit/README.md`.

**Input erforderlich:** Pfad zu `docs/roadmap/phase-N/issues/….md`. Fehlt → einmal nach Pfad fragen.

## Flow

**1.** `issues/*.md` lesen (ID aus Dateiname / Kopfblock).

**2.** `docs/roadmap/phase-N/README.md` Tabelle → **GitHub-Titel** exakt aus Tabellenspalte übernehmen.

**3.** Permalink aufbauen: org/repo/branch via `git remote` / `gh repo view` ermitteln.
Format: `https://github.com/<org>/<repo>/blob/<default-branch>/docs/roadmap/phase-N/issues/<file>.md`

**4.** Body = **ein** Kontextsatz + **eine** Permalink-Zeile. Kein Spez-Copy aus der `.md`.

**5.** Abhängigkeiten aus `.md` parsen (nicht nachfragen wenn eindeutig):

- Links unter `## Abhängigkeiten` → `./….md` gleicher Ordner
- `## Meta` **Blockiert von** / Kopfblock `Blockiert von:`
- IDs `PN-Iyy` sammeln, aktuelle Datei raus, Deduplizieren

**6.** Pro ID: Tabellentitel gleiche README → `gh issue list --json number,title --state all`. Title enthält `[PN-Iyy]` oder Tabellentitel-Match → eine `#`. Bei 0 oder mehreren gleich guten Treffern → kurz nachfragen.

**7.** `gh issue create` (Body mehrzeilig → `--body-file`). Neue Nummer **N** merken.

**7b.** Label: `Phase N` aus Issue-ID (`P5-I01` → Label `Phase 5`).

- Label fehlt → `gh label create "Phase N" --description "Roadmap Phase N" --color "1D76DB"`
- Danach: `gh issue edit N --add-label "Phase N"`

**8.** Deps verknüpfen: `gh issue edit` wenn Flags verfügbar; sonst `#N` + `#`-Liste ausgeben für manuelle Web-UI-Verknüpfung.

**Output:** Link `#N` + Label `Phase N` + erkannte Deps + ob Schritt 8 auto oder manuell.

## Inhalt-Regeln (nicht verletzen)

- Titel = exakt aus Phasen-README-Tabelle
- Body = Kurz + **ein** Permalink
- Kein Spez-Text aus der `.md` in den Issue-Body kopieren
