# [P10-I01] Architektur- und Implementationsbeschreibung

```text
Phase: 10
Issue-ID: P10-I01
GitHub: #69
Blockiert von: P9-I03 (#68)
```

## Meta

- **Issue-ID:** P10-I01
- **GitHub:** #69
- **Blockiert von:** [P9-I03](../../phase-9/issues/P9-I03-findings-triage.md) (#68)
- **Blockiert:** [P10-I02](./P10-I02-team-review-doku.md) (#70)

## Abhängigkeiten

- [P9-I03-findings-triage.md](../../phase-9/issues/P9-I03-findings-triage.md)

## Ziel

Ist-Architektur und Implementierung im Repo dokumentieren. [SPEC.md](../../../../SPEC.md) bleibt verbindliche Produktspezifikation; diese Doku beschreibt den **aktuellen Code**.

## Testbare Akzeptanzkriterien

- [ ] Neue Datei `docs/architecture.md` mit mindestens:
  - Datenfluss (Mermaid, Create Summary mit RAG).
  - Modulübersicht (`main`, `settings`, `ollama`, `summary`, `rag`).
  - **Index-Policy** (Idle, Events, On-Demand).
  - **Summary-Lauf** (Retrieval-Query → Top-K → Kontextlimit → Chat → Schreiben).
  - Einstellungen-Übersicht (Verweis SPEC §6).
- [ ] [`src/README.md`](../../../../src/README.md): Phase-Ownership P6–P8; RAG vollständig verdrahtet; Import-Regeln aktuell; kein «Not yet wired» für `rag/`.
- [ ] Root-[`README.md`](../../../../README.md): Link auf `docs/architecture.md`; kurzer MVP-Funktionsüberblick für Leser:innen (nicht nur Entwickler-Onboarding).
- [ ] Kein Widerspruch zu SPEC.md; Abweichungen explizit als «Implementation note» markieren.
- [ ] PR nur Doku (oder minimale Korrekturen bei Inkonsistenzen).

## Dev-Lifecycle

1. Codebase lesen; Doku schreiben.
2. Review gegen SPEC §4.
3. Merge.

## Ausserhalb des Scopes

- SPEC.md ersetzen oder umschreiben.
- Evaluationsnachweise (Phase 11).
- Team-Review-Runde (P10-I02).
