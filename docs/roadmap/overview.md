# Roadmap Übersicht

Diese Datei bildet die **gesamte Projekt-Roadmap** ab (sechs Phasen). Zu **jeder** Phase gibt es einen Ordner `phase-N` mit einem **README**: abgeschlossene Phasen bleiben dort **bewusst minimal** (nur Status **Erledigt**), damit nichts «übersprungen» wirkt. Die aktuelle Arbeitsphase enthält die ausführlichere Planung.

**Aktueller Stand laut Team:** Phase **1** und **2** sind abgeschlossen; es wird in **Phase 3** weitergearbeitet. Phasen **4** bis **6** sind in der Dokumentation angelegt und folgen der Reihenfolge der Roadmap.

| Phase | Titel | Inhalt (Kurz) | Status | README |
|-------|--------|----------------|--------|--------|
| 1 | Konzeption & Setup | Anforderungsanalyse, Architektur-Design, Techstack, Projektinitialisierung | Erledigt | [phase-1](./phase-1/README.md) |
| 2 | MVP-Entwicklung (Core Features) | Markdown-Parsing, Ollama-Integration, einfache Zusammenfassungen | Erledigt | [phase-2](./phase-2/README.md) |
| 3 | UI & UX Optimierung | Obsidian-Oberfläche, Kontextmenü, Einstellungen, Fortschritt | In Arbeit | [phase-3](./phase-3/README.md) |
| 4 | Erweiterte Funktionen (RAG & Vektor-DB) | In Phase-4-Issues (P4-I01–P4-I09): **nur** Codebasis, CI und Qualität; **kein** RAG-, Embedding- oder Vektor-DB-Kern | Geplant | [phase-4](./phase-4/README.md) |
| 5 | Testing & Qualitätssicherung | Unit- und Integrationstests, Performance, Bugfixing für stabile Version | Geplant | [phase-5](./phase-5/README.md) |
| 6 | Deployment & Dokumentation | Benutzerdokumentation, README, Veröffentlichung des Plugins | Geplant | [phase-6](./phase-6/README.md) |

## Phase 4 (Boilerplate) im Detail

- [Phase-4 README](./phase-4/README.md) (Einordnung, DoD, Abhängigkeitsgraph, Issuetabelle, Verweise)
- [Issue-Vorlagen `docs/roadmap/phase-4/issues/`](./phase-4/issues/) (Verzeichnis)

## Spezifikation und Arbeitsweise

- [SPEC.md](../../SPEC.md) (Repository-Root, Implementierungsreferenz)
- [GKISW Prompt-Patterns](./methodik-gkisw-prompt-patterns.md)

## Zusammenarbeit und Agenten

- [Zusammenarbeit im Repository](../zusammenarbeit/README.md) (Verantwortung, Roadmap, SSOT, Issues, Board)
- [Shell `gh`](../agents-docs/github-cli.md)
- [Agenten-Themenindex](../agents-docs/README.md)
- [Phasen planen (Agenten)](../agents-docs/phasen-planen-fuer-agenten.md)
- [Issue-Markdown-Vorlage](../agents-docs/issue-vorlage/VORLAGE.md)

## Nächste Schritte (Meta)

- In **Phase 3** die konkreten UI-/UX-Arbeitspakete und Definition of Done festhalten.
- **Phase 4:** Issue-Vorlagen für **Boilerplate und CI** unter `docs/roadmap/phase-4/issues/` (siehe Phase-4-README); **kein** RAG-/Vektor-DB-Kern in diesen Paketen. **Phase 5–6:** READMEs bei Start mit Zielen und Issues befüllen.
