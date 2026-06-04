# MVP-Freigabe-Checkliste — P12-I01

```text
Datum:   2026-06-04
Version: 0.1.4 (manifest.json)
```

Nachweise aus Phase 9–11 gegen [SPEC.md](../../SPEC.md) und Roadmap abgeglichen.

## Freigabe-Checkliste

| # | Nachweis | Status | Quelle |
|---|----------|--------|--------|
| 1 | Code-Review abgeschlossen | ✅ | P9-I01 (#66, geschlossen ohne Findings) |
| 2 | MVP-Klicktests (7/8 Pass; F-01+F-02 behoben in PR #85) | ✅ | P9-I02 PR #85; [results](../roadmap/phase-9/mvp-checkliste-ergebnisse.md) |
| 3 | Findings triagiert (2 Fixes, 0 Follow-ups offen) | ✅ | P9-I03 PR #86; [triage](../roadmap/phase-9/findings-triage.md) |
| 4 | Architektur-Doku vorhanden | ✅ | `docs/architecture.md` (PR #87) |
| 5 | Team-Review Doku durchgeführt | ✅ | P10-I02 PR #88; [protokoll](../roadmap/phase-10/team-review-protokoll.md) |
| 6 | Generierungszeit < 80 s | ✅ | 15 s auf Windows 11 / Ollama 0.24.0 / gemma4:e2b; [results](../evaluation/results/generation-time.md) |
| 7 | Markdown-Format valide | ✅ | `npm run check-markdown`; [results](../evaluation/results/content-coverage.md) |
| 8 | Inhaltsabdeckung | ⚠️ bewusst offen | 67 % (Ziel 80 %) — siehe Begründung unten |
| 9 | Eingebaute Fehler in Summary sichtbar | ⚠️ bewusst offen | 2/9 reproduziert — siehe Begründung unten |
| 10 | CI grün auf `master` | ✅ | [Run #26869436227](https://github.com/YannikG/ffhs-gkisw-obsidian-plugin/actions/runs/26869436227) (2026-06-03) |
| 11 | `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` grün | ✅ | 193 Tests bestanden (lokal, Stand 2026-06-04) |

## Bewusst offene Punkte

### Inhaltsabdeckung 67 % (Ziel 80 %)

Ursache: Mixed-Topic-Ordner mit drei thematisch verschiedenen Dateien. Das Top-K-Retrieval liefert nicht alle relevanten Chunks für alle Themen in einem einzigen Lauf. eval-01 (ML, ein Thema) erreicht 100 %.

**Einschätzung:** Kein Blocking-Defekt für den MVP. Das Verhalten ist bei leichten RAG-Modellen und breiten Korpora bekannt. Follow-up in Phase 12 oder als separate Issue nach Freigabe.

### Eingebaute Fehler selten reproduziert (2/9)

Ursache: Das Modell (`gemma4:e2b`) verfügt über eigenes Weltwissen und korrigiert fehlerhafte Fakten aus den Quelltexten («Knowledge Conflict»). Dies zeigt, dass das Modell RAG-Kontext liest, aber bei Konflikten mit Trainingswissen dem eigenen Wissen vertraut.

**Einschätzung:** Kein Defekt; erwartet für kleine Generierungsmodelle. Für stärkere Reproduktion wäre `gemma4:e4b` oder ein expliziterer System-Prompt nötig («Nutze ausschliesslich den bereitgestellten Kontext»).

## Team-Go

| Person | Entscheid | Datum |
|--------|-----------|-------|
| Gian Luca Tehrani | Go ✅ | 2026-06-04 |
| Yannik Gartmann | — ausstehend — | |
| Kaan Kaplan | — ausstehend — | |

MVP-Freigabe erteilt nach Mehrheit oder Einstimmigkeit des Teams.
