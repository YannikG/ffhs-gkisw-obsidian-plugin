# [P12-I01] Freigabe-Checkliste und Testnachweise

```text
Phase: 12
Issue-ID: P12-I01
GitHub: #74
Blockiert von: P11-I03 (#73)
```

## Meta

- **Issue-ID:** P12-I01
- **GitHub:** #74
- **Blockiert von:** [P11-I03](../../phase-11/issues/P11-I03-markdown-inhalt-evaluation.md) (#73)
- **Blockiert:** [P12-I02](./P12-I02-version-release-notizen.md) (#75)

## Abhängigkeiten

- [P11-I03-markdown-inhalt-evaluation.md](../../phase-11/issues/P11-I03-markdown-inhalt-evaluation.md)

## Ziel

MVP-Freigabe vorbereiten: alle Nachweise aus Phase 9–11 gegen [SPEC.md](../../../../SPEC.md) und Roadmap abgleichen.

## Testbare Akzeptanzkriterien

- [ ] `docs/release/mvp-checklist.md` (oder Abschnitt in Phase-12-README) mit abhakbaren Punkten:

| Nachweis | Quelle |
|----------|--------|
| Code-Review abgeschlossen | Phase 9 / P9-I03 |
| MVP-Klicktests | P9-I02 PR |
| Architektur-Doku | `docs/architecture.md` |
| Generierungszeit | `docs/evaluation/results/generation-time.md` |
| Inhalt & Format | `docs/evaluation/results/content-coverage.md` |
| CI grün auf `master` | letzter Workflow-Link |

- [ ] Jede Zeile abgehakt oder mit Team-Vermerk «bewusst offen» + Begründung.
- [ ] Team-Entscheid **Go** für MVP-Freigabe im Issue-Kommentar oder Checkliste datiert.

## Dev-Lifecycle

1. Checkliste ausfüllen nach P11-I03-Merge.
2. PR nur Doku.
3. Review durch Projektteam.

## Ausserhalb des Scopes

- Version-Bump (P12-I02).
- Community-Store-Veröffentlichung.
