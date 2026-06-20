# Roadmap — 12 Phasen

Massgebende Reihenfolge der Projektarbeit. Jede Phase hat ein **Phase-README** (`phase-N/README.md`) und kanonische Issue-Spezifikationen (`phase-N/issues/*.md`).

**Weitere Dateien in diesem Ordner:** [methodik-gkisw-prompt-patterns.md](methodik-gkisw-prompt-patterns.md) (Prompt-Patterns für Agenten, ergänzt die Phasen-READMEs).

---

## Phasenübersicht

| Schritt | Bezeichnung | Beschreibung | Phase |
|---------|-------------|--------------|-------|
| 1 | Projektsetup | Git-Repo inklusive Berechtigungen des Projektteams. | [Phase 1](phase-1/README.md) |
| 2 | Agent Setup | Skills und Anweisungen für Agenten (Cursor). | [Phase 2](phase-2/README.md) |
| 3 | Planung | Projektplan gemäss Anforderungskatalog. | [Phase 3](phase-3/README.md) |
| 4 | Minimale Implementation | Plugin-Setup inklusive Boilerplate. | [Phase 4](phase-4/README.md) |
| 5 | Kommunikation mit dem LLM | Ollama, Chat, Summary ohne RAG, System-Prompt iterativ. | [Phase 5](phase-5/README.md) |
| 6 | Einbau RAG | RAG-Pipeline, SQLite-Vektorindex, Vault-Events. | [Phase 6](phase-6/README.md) |
| 7 | Verknüpfung RAG mit LLM | Retrieval an Create Summary anbinden. | [Phase 7](phase-7/README.md) |
| 8 | Finalisierung | Einstellungs-UI, Validierung, Summary-Überschreiben. | [Phase 8](phase-8/README.md) |
| 9 | Review | Automatisches und manuelles MVP-Review. | [Phase 9](phase-9/README.md) |
| 10 | Dokumentation | Systemarchitektur und Implementation dokumentieren. | [Phase 10](phase-10/README.md) |
| 11 | Testen | Evaluation gemäss SPEC §8. | [Phase 11](phase-11/README.md) |
| 12 | Freigabe | MVP-Freigabe nach erfolgreichen Tests. | [Phase 12](phase-12/README.md) |

---

## Navigation

| Link | Inhalt |
|------|--------|
| [docs/README.md](../README.md) | Dokumentations-Hub (gesamtes Repo) |
| [SPEC.md](../../SPEC.md) | Produktspezifikation MVP |
| [docs/zusammenarbeit/README.md](../zusammenarbeit/README.md) | Issues, Board, Team-Prozess |
