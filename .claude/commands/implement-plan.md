Implement plan workflow for issue: $ARGUMENTS

**Immer** GitHub-Issue (URL oder #) erforderlich. Kein `gh issue create` zum Start.

**Pre-checks:** working tree clean — sonst stoppen und fragen. `gh` login prüfen.

**S1 — Spec locken**

1. `gh issue view $ARGUMENTS` → Titel, Body lesen.
2. Body scannen: enthält `…/docs/roadmap/…/issues/….md` → Pfad im Checkout **lesen** (Read), = Roadmap-Fall.
3. Roadmap-Fall: nur diese MD als Plan/Akzeptanzkriterien. Nur-Issue-Fall: Spec = Titel + Body (+ `gh issue view $ARGUMENTS --comments`).
4. Kein `gh issue edit` mit Impl-Text überschreiben.

**S2 — Branch**

`git fetch` + `pull` → `gh issue develop $ARGUMENTS --checkout`. Nicht auf default branch coden.

**S3 — Implementierung**

Gegen Spec aus S1. Companion-Skills aktiv:

- Während Code: `/caveman` für komprimierte Kommunikation
- Test-first: `/tdd`
- Keine Edits auf `docs/roadmap/**/issues/*.md` im Impl-PR (ausser User will explizit Planänderung)

**S4 — Exit**

`/review-and-fix` ausführen. Findings gegen gleiche Spec wie S1.

Repo-Kontext: `.agents/AGENTS.md`, `docs/agents-docs/README.md`, `docs/zusammenarbeit/README.md`.
