# KI-Zusammenarbeit im Projekt

Wie generative KI im GKISW-Projekt **Obsidian Summarizer** eingesetzt wurde — technische Rolle, Grenzen und Team-Verantwortung.

Verwandt: [docs/architecture.md](architecture.md), [docs/ethik.md](ethik.md).

---

## Zwei Rollen der KI

| Rolle | Wo | Funktion |
|-------|-----|----------|
| **Produkt-KI (Runtime)** | Ollama lokal | Embeddings + Summary-Text aus Vault-Inhalten (RAG-Pipeline) |
| **Entwicklungs-KI (Build-Zeit)** | Cursor, Claude Code, Gemini | Code, Tests, Dokumentation unter Team-Leitplanken |

Dieses Dokument betrifft primär **Entwicklungs-KI**. Runtime-Verhalten: [docs/architecture.md](architecture.md), [docs/modules/summary.md](modules/summary.md).

---

## Entwicklungs-KI — Vorgehen

Entscheidung aus Initial-ADR ([0001](adr/0001-lokal-only-ollama.md)): Architektur und Anforderungen werden **vom Team erarbeitet**; KI-Agenten implementieren iterativ entlang fester Spezifikation.

| Leitplanke | Umsetzung |
|------------|-----------|
| Spezifikation zuerst | [SPEC.md](../SPEC.md), `docs/roadmap/phase-N/issues/*.md` als SSOT |
| Domänensprache | [docs/agents-docs/domaenensprache.md](agents-docs/domaenensprache.md), [CONTEXT.md](../CONTEXT.md) |
| Agent-Anweisungen | [.agents/AGENTS.md](../.agents/AGENTS.md), Skills unter [.agents/skills/](../.agents/skills/) |
| Review-Pflicht | Pull Requests, Team-Review (z. B. [Phase-10-Protokoll](roadmap/phase-10/team-review-protokoll.md)) |
| Qualitätssicherung | CI: Format, Lint, Tests, Build |

**Ziel:** Halluzination und Fehlprogrammierung durch klare Grenzen, testbare Akzeptanzkriterien und menschliches Review reduzieren.

---

## Typische KI-Aufgaben im Repo

| Bereich | Beispiel |
|---------|----------|
| Implementierung | Issues entlang `docs/roadmap/.../issues/*.md` (Skills: implement-plan, tdd) |
| Tests | Vitest-Suites neben Modulen; Obsidian gemockt |
| Dokumentation | Architektur, Module, Benutzer-Handbuch, ADRs |
| Review | Skill review-and-fix; GitHub PR-Review durch Team |

KI ersetzt **kein** Verständnis: nur committen, was reviewt und verantwortet werden kann ([docs/ethik.md](ethik.md) § IP).

---

## Grenzen

| Grenze | Konsequenz |
|--------|------------|
| Kein Cloud-LLM für Vault-Inhalte | Runtime-Datenschutz (SPEC NF01/NF02) |
| Keine autonomen Produktentscheidungen | Architektur- und Scope-Entscheide im Team + ADRs |
| Evaluations-Lücken dokumentiert | Inhaltsabdeckung 67 % — kein «KI-Fix» ohne Spec-Änderung |
| Prompt-Injection lokal | Risiko auf eigenen Vault beschränkt ([docs/ethik.md](ethik.md)) |
