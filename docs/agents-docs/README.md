# agents-docs

Index für Agenten-Workflows unter `docs/`. Gesamtübersicht: [docs/README.md](../README.md). Produkt: [docs/roadmap/README.md](../roadmap/README.md), [SPEC.md](../../SPEC.md).

**[AGENTS.md](../../.agents/AGENTS.md)** — Einstieg, Lesepflicht. Rest: Tabelle.

| Datei | Inhalt |
|-------|--------|
| [github-cli.md](./github-cli.md) | `gh`: Auth, Branch an Issue, Issue/PR-Beispiele, Namenskonvention |
| [github-issue-anlegen](../../.agents/skills/github-issue-anlegen/SKILL.md) | Skill + Pfad zu `issues/*.md` → Agent legt Issue an; leitet Abhängigkeiten aus der `.md` ab und setzt sie nach Möglichkeit auf GitHub |
| [phasen-planen-fuer-agenten.md](./phasen-planen-fuer-agenten.md) | Phase lesen, DoD, Issues, Abschluss |
| [domaenensprache.md](./domaenensprache.md) | Glossar `CONTEXT.md` (nur Agenten/Grill); Specs bleiben in `issues/*.md` + SPEC |
| [adr/README.md](../adr/README.md) | ADR-Ablage (noch leer); Format im grill-with-docs-Skill |
| [grill-with-docs](../../.agents/skills/grill-with-docs/SKILL.md) | Grill: Domänensprache; pflegt `CONTEXT.md`/`docs/adr/`; keine `CONTEXT.md`-Links in Roadmap |
| [implement-plan-workflow](../../.agents/skills/implement-plan-workflow/SKILL.md) | Implement: immer GitHub-Issue; mit Permalink → Repo-`issues/*.md` lesen (nicht editieren); ohne → Spez = Issue-Body |
| [tdd](../../.agents/skills/tdd/SKILL.md) | TDD: red-green-refactor, vertical slices; Vitest `*.test.ts`, mock `obsidian` at boundary only |
| [issue-vorlage/](./issue-vorlage/) | Neues Issue-MD: [VORLAGE.md](./issue-vorlage/VORLAGE.md) + [README](./issue-vorlage/README.md) |
| [Zusammenarbeit](../zusammenarbeit/README.md) | Team-Regeln: SSOT, Issue anlegen, Board, Spez vs. Implementierung |
