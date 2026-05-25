Grill session: stress-test plan against domain language and documented decisions. $ARGUMENTS

Relentless interview, **ein Aspekt auf einmal**. Auf User-Antwort warten vor nächster Frage. Jede Frage: **empfohlene Antwort** (kurz, konkret).

Wenn Antwort im Repo → **zuerst Code/Docs lesen**, dann nur noch offene Punkte fragen.

**Schriftliche Artefakte** (`CONTEXT.md`, ADRs, `docs/`): Schweizer Hochdeutsch — ss nie ß, Umlaute ä/ö/ü.

## Vor der ersten Frage lesen (nicht überspringen)

1. `.agents/AGENTS.md` — Agent-Regeln
2. `docs/roadmap/overview.md` — vollständig
3. `SPEC.md` — Produkt/Architektur-SSOT
4. `CONTEXT.md` — falls vorhanden
5. `docs/adr/` — bestehende ADR-Titel scannen
6. Thema-spezifisch: Phase-README, `docs/agents-docs/README.md`, offenes GitHub-Issue + verlinkte `issues/*.md`

## Während der Session

**Glossar challengen:** Term-Konflikt mit `CONTEXT.md` → sofort ansprechen.

**Unscharfe Sprache schärfen:** Überladene Begriffe («account», «folder», «summary») → einen kanonischen Term vorschlagen.

Projekt-Anker (gegen SPEC prüfen vor Kanonisierung):
- **Vault**, **Ordner**, **Summary/Zusammenfassung** (Output-Artefakt)
- **RAG**, **Chunk**, **Embedding**, **Vektorindex** (`vectors.db`)
- **Ollama**, **Plugin-Datenverzeichnis** vs Vault-Pfade

**Konkrete Szenarien erfinden:** leerer Ordner, nur Unterordner, `{Name}_summary.md` Überschreiben vs `_summary_2`, Vault-Umbenennung, Index veraltet, Ollama down, riesiger Ordner.

**Code querprüfen:** User behauptet Verhalten → `src/` + Tests prüfen. Widerspruch → «Code macht X; du sagst Y — was gilt?»

**`CONTEXT.md` inline updaten:** bei resolvierten Begriffen sofort editieren (kein Batch).

**ADRs sparsam:** nur wenn alle drei Kriterien erfüllt:
1. Schwer umkehrbar
2. Überraschend ohne Kontext
3. Echter Trade-off (Alternativen existierten)

## Doc-Map

| Artefakt | Rolle | Wann schreiben |
|----------|------|----------------|
| `CONTEXT.md` | Glossar — nur Domänen-Terms | Lazy, bei erstem resolvierten Begriff |
| `docs/adr/NNNN-slug.md` | Harte, überraschende Entscheidungen | Lazy, wenn alle 3 ADR-Kriterien erfüllt |
| `SPEC.md` | Impl/Produkt-Spec | **Nicht editieren** ausser User will explizit |
| `docs/roadmap/**` | Phasen, Issue-Templates | Read-only ausser User bestellt Plan-Edit |

## Session-Ende

Kurzes Recap: Terms gesperrt, ADRs erstellt/übersprungen, offene Fragen, empfohlener nächster Schritt (z. B. GitHub-Issue + `/implement-plan`).

## Nach dem Grill → Implementierung

**Nicht** im gleichen Session coden ausser User fragt. Typisches Handoff:
1. User öffnet/aktualisiert GitHub-Issue
2. `/implement-plan` + optional `/tdd`
