# Agent-Anweisungen (Repository-weit)

`.agents/` = Einstieg für KI-Tools. **`gh` / Branches:** `docs/agents-docs/github-cli.md`. **Team-Regeln zu Issues, Board, Spez:** `docs/zusammenarbeit/README.md`. Cursor optional: `.cursor/rules/docs-kontext-zuerst.mdc`.

## `docs/` zuerst

Vor Codeänderung, projektbezogener Shell oder inhaltlicher Bewertung: **`docs/`** lesen. Nur-Lesen für diese Regel vor andern Werkzeugaktionen.

**Mindestumfang**

1. `docs/roadmap/overview.md` vollständig.
2. Weitere passende `docs/`-Dateien (betroffenes Phase-`README`, bei KI-Arbeit `docs/roadmap/methodik-gkisw-prompt-patterns.md`).
3. Phasenplan / Issue-Ketten / Agenten-Workflow: `docs/agents-docs/README.md`. Team-Prozess (Issues, Permalinks, Board): `docs/zusammenarbeit/README.md`.

**Arbeit an einem Issue:** Zuerst immer das **GitHub-Issue** lesen (`gh issue view <nr>` oder Issue-URL). Enthält der Body einen Permalink auf `docs/roadmap/…/issues/*.md`, diese **Repo-`.md`** lesen. **Ohne** solchen Link: Spezifikation aus **Titel und Body** des GitHub-Issues (z. B. Bugs). Implementierung und Bewertung nur gegen diesen Rahmen, nicht «frei schwebend».

**PR und Review:** PR **gegen dieselbe Issue-Nummer** führen (z. B. `Fixes #n` / `Closes #n` in Beschreibung oder von `gh issue develop` erzeugter Branch mit zugehörigem PR). Review: Akzeptanz und Findings **gegen Issue und ggf. verlinkte `.md`** formulieren, nicht ohne Bezug.

**`SPEC.md`** (Root): bei Plugin-Spezifikation oder Verhalten, sobald `docs/`-Kontext klar.

**Nur `docs/` oder Metadaten:** gezielt lesen; `overview.md` kurz prüfen, wenn der Schrittstand in der Roadmap relevant ist.

**`docs/roadmap/**/issues/_.md`:** Nur Fakten (Ziel, `./`-Links auf Vorgänger-`.md`, Akzeptanzkriterien, Scope, dev-Schritte). **Nicht** in File: `gh`-/GitHub-/Permalink-Meta (→ `github-cli.md`). **Issue-Body:** Permalink + kurz auf die Repo-`.md`(SSOT:`docs/zusammenarbeit/README.md`). **Neues GitHub-Issue aus Vorlage:** `.agents/skills/github-issue-anlegen/SKILL.md`und Pfad zur`issues/_.md`. **Vorlagen nicht editieren** ohne explizite Planänderung durch Nutzer. **Implementierung nach Issue:** `.agents/skills/implement-plan-workflow/SKILL.md`(immer mit **GitHub-Issue**-URL oder -Nummer). **Test-first / TDD:**`.agents/skills/tdd/SKILL.md` (red-green-refactor, vertical slices; companion to implement-plan-workflow).
