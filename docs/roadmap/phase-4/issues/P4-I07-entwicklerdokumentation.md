# [P4-I07] Initiales README, Entwicklerdokumentation und Onboarding

```text
Phase: 4
Issue-ID: P4-I07
Blockiert von: P4-I02, P4-I04, P4-I05, P4-I06, P4-I08, P4-I09 → GitHub-# eintragen
```

## Meta

- **Issue-ID:** P4-I07
- **Blockiert von:** P4-I02, P4-I04, P4-I05 (Inhalt muss zur Wirklichkeit passen); **Pflicht:** P4-I06 (finaler CI-Workflow mit Build, Test, Lint, Format), P4-I08 und P4-I09, damit das **initiale** `README.md` dieselbe Realität beschreibt wie die Pipeline auf `main`.

## Abhängigkeiten

- [P4-I02-manifest-plugin-lebenszyklus.md](./P4-I02-manifest-plugin-lebenszyklus.md), [P4-I04-einstellungen-persistenz.md](./P4-I04-einstellungen-persistenz.md), [P4-I05-ordner-kontextmenue-stub.md](./P4-I05-ordner-kontextmenue-stub.md), [P4-I06-ci-workflow.md](./P4-I06-ci-workflow.md), [P4-I08-lint-format-quality-gates.md](./P4-I08-lint-format-quality-gates.md), [P4-I09-unit-tests-infrastruktur.md](./P4-I09-unit-tests-infrastruktur.md)

## Ziel

**Initiales Root-`README.md`:** Projekt kurz vorstellen, Entwicklung und Qualitätsschritte erklären. Neues Teammitglied kann Repository klonen, bauen, **Unit-Tests**, **Lint** und **Format-Check** lokal ausführen (inkl. optional dokumentiertem Watch-Mode für Tests), Plugin in eine Vault kopieren oder verlinken und Einstellungen sowie Stub-Menü nach Anleitung prüfen.

## Reihenfolge (wichtig)

Zuerst **P4-I06** mit allen vereinbarten Jobs auf `main` abschliessen (oder den finalen Stand klar im PR beschreiben), **danach** das initiale `README.md` inhaltlich fertigstellen oder einen Stub-PR durch einen inhaltlichen PR ersetzen. Kein README, das noch nicht existierende Skripte oder Checks verspricht.

## Testbare Akzeptanzkriterien

- [ ] **Root-`README.md`** ist das zentrale Einstiegsdokument (kein reiner Titel-Platzhalter mehr); enthält mindestens: Kurzbeschreibung des Plugins, Link oder Verweis auf `SPEC.md`, Node-Version, `npm ci`, `npm run build`, `npm run dev`, **`npm test`**, **`npm run lint`**, **`npm run format:check`** (exakte Skriptnamen wie in `package.json`), Installationspfad `.obsidian/plugins/<id>/`.
- [ ] Optional: Zusätzliche Details in `docs/development.md`, wenn das Team die Aufteilung will; das Root-README verlinkt dorthin.
- [ ] Kurzer Abschnitt **Tests:** wo Testdateien liegen (`*.test.ts` / `*.spec.ts` nach Teamkonvention), wie man einen einzelnen Test oder Watch startet, Hinweis dass Obsidian-API in Unit-Tests typischerweise **gemockt** wird (Link oder Satz zu Vitest `vi.mock` / gleichwertig).
- [ ] Abschnitt **Qualität vor PR:** Reihenfolge empfohlen (`format:check`, `lint`, `test`, `build`) oder Verweis auf `npm run verify`, falls das Team ein Sammelskript einführt.
- [ ] Hinweis auf `minAppVersion` und typischen Fehler «Plugin lädt nicht».
- [ ] Verweis auf **GitHub Actions:** PRs benötigen grüne Checks inklusive **Build, Tests, Lint und Format** (wie in I06).
- [ ] **Onboarding-Test:** eine zweite Person (oder dasselbe Teammitglied nach 24h auf anderem Clone) folgt nur der Doku und bestätigt per Checkliste im PR-Kommentar oder separatem Kommentar auf dem Issue (inkl. erfolgreichem `npm test`, `npm run lint`, `npm run format:check`).

## Dev-Lifecycle

1. PR mit «Documentation only»; Review von jemandem, der I02/I04/I05 nicht implementiert hat (Idealfall).
2. Merge.

## Scope

Keine Benutzer-Handbuch-Finalisierung für Community-Store (das bleibt späteren Phasen vorbehalten).
