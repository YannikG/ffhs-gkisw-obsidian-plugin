# [P4-I06] GitHub Actions: Build, Tests und Quality Gates

```text
Phase: 4
Issue-ID: P4-I06
Blockiert von: P4-I01 (minimal); P4-I08, P4-I09 (finaler Workflow) → GitHub-# eintragen
```

## Meta

- **Issue-ID:** P4-I06
- **Blockiert von:** **P4-I01** (für ersten Workflow-PR). Für den **finalen** Workflow mit allen Gates zusätzlich **P4-I08** und **P4-I09**.

## Abhängigkeiten

- [P4-I01-tooling-build-pipeline.md](./P4-I01-tooling-build-pipeline.md) (erster Workflow-PR)
- [P4-I08-lint-format-quality-gates.md](./P4-I08-lint-format-quality-gates.md), [P4-I09-unit-tests-infrastruktur.md](./P4-I09-unit-tests-infrastruktur.md) (finaler Workflow mit allen Gates)

## Ziel

Unter `.github/workflows/` liegt ein Workflow (oder mehrere klar benannte), der auf **Pull Requests** (und sinnvoll auf `push` zu `main`) ausführt: `npm ci`, **`npm run build`**, optional **`npm run typecheck`** falls als Skript geführt, **`npm test`**, **`npm run lint`**, **`npm run format:check`**. Fehlgeschlagene Schritte brechen die Pipeline ab (**Quality Gates**).

## Parallelität

Nach I01: minimaler Workflow nur **build** möglich. **Abschluss I06:** alle genannten Schritte sind im Standard-Workflow aktiv, sobald I08 und I09 gemerged sind (bei Bedarf zweiter PR für I06 nach Nachziehen der Skripte).

## Testbare Akzeptanzkriterien

- [ ] Workflow-Datei(en) unter `.github/workflows/`; Trigger für PRs dokumentiert.
- [ ] `npm ci` und `npm run build` laufen auf CI; Fehler brechen ab.
- [ ] Nach I09: `npm test` im Workflow; Nachweis, dass ein absichtlich fehlschlagender Test einen roten Check erzeugt (kurz im Issue oder PR dokumentiert).
- [ ] Nach I08: `npm run lint` und `npm run format:check` im Workflow; Nachweis, dass absichtlich unformatierter Code oder Lint-Verstoss den Check rot macht (Experiment-Branch oder dokumentierter Screenshot der roten Pipeline).
- [ ] Referenz-PR mit **grünen** Checks (Link im Issue-Kommentar).

## Dev-Lifecycle

1. PR früh öffnen; nach Merge von I08 und I09 Workflow ergänzen oder rebasen und erneut prüfen.
2. Review: Workflow-Datei auf übliche Risiken prüfen (Pinning optional, keine Secrets im Log).
3. Merge.

## Blockiert

P4-I07: dort werden dieselben Befehle lokal beschrieben, PR-Pflicht-Checks genannt, und das **initiale Root-`README.md`** **nach** diesem Workflow finalisiert (siehe Reihenfolge in P4-I07).
