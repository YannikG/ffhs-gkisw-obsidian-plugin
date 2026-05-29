# [P9-I01] Automatisches Review (review-and-fix)

```text
Phase: 9
Issue-ID: P9-I01
GitHub: #66
Blockiert von: P8-I02 (#65)
```

## Meta

- **Issue-ID:** P9-I01
- **GitHub:** #66
- **Blockiert von:** [P8-I02](../../phase-8/issues/P8-I02-summary-ueberschreiben.md) (#65)
- **Blockiert:** [P9-I02](./P9-I02-manuelle-mvp-checkliste.md) (#67)

## Abhängigkeiten

- [P8-I02-summary-ueberschreiben.md](../../phase-8/issues/P8-I02-summary-ueberschreiben.md)

## Ziel

Skill [review-and-fix](../../../.agents/skills/review-and-fix/SKILL.md) auf den MVP-Code (`src/`) anwenden: Findings klassifizieren, umsetzbare `critical`/`high`/`medium` beheben, validieren, Rest dokumentieren.

## Testbare Akzeptanzkriterien

- [ ] Review-Lauf gemäss Skill (Scan → Klassifikation → Fix → Lint/Type/Test/Build → Re-Review) auf Stand nach Phase-8-DoD.
- [ ] Findings-Log in PR-Beschreibung oder `docs/review/phase-9-findings.md` (Format: severity \| location \| problem \| fix).
- [ ] Keine offenen `critical` oder `high`; `medium` behoben oder als `blocked` mit Begründung.
- [ ] `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` grün nach Fixes.
- [ ] PR verweist auf dieses Issue.

## Dev-Lifecycle

1. Branch von `master` nach Merge Phase 8.
2. Review-and-fix-Loop bis Done-Kriterien des Skills.
3. Review gegen [Phase-9-README](../README.md) DoD.

## Ausserhalb des Scopes

- Manuelle Obsidian-Klicktests (P9-I02).
- Architektur-Doku (Phase 10).
- SPEC.md-Änderungen.
