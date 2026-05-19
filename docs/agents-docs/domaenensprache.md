# Domänensprache (Agenten)

Für **Menschen** in Issues und Reviews: [SPEC.md](../../SPEC.md) und kanonische `docs/roadmap/**/issues/*.md` (Fakten, Akzeptanzkriterien). Kein Verweis auf diese Datei in Phase-READMEs nötig.

## CONTEXT.md (nur KI / Grill)

| Artefakt | Rolle |
|----------|--------|
| [CONTEXT.md](../../CONTEXT.md) (Repo-Root) | Glossar und Beziehungen aus **Grill-with-docs**; kanonische Begriffe (z. B. **Summary**, **Ordner-Quellkorpus**, **Index-Policy**). Keine Implementierung, keine API. |
| [CONTEXT-FORMAT.md](../../.agents/skills/grill-with-docs/CONTEXT-FORMAT.md) | Schreibregeln für `CONTEXT.md`. |

**Wann lesen:** Vor Implementierung oder beim Schärfen von Plänen, wenn Begriffe unklar sind. Skill: [grill-with-docs](../../.agents/skills/grill-with-docs/SKILL.md).

**Wann nicht:** Phase-READMEs und Issue-Specs duplizieren Verhalten nicht aus `CONTEXT.md`; dort stehen testbare Fakten. Weicht `CONTEXT.md` von [SPEC.md](../../SPEC.md) ab, ist SPEC für Produktverhalten massgebend, bis das Team SPEC bewusst anpasst.

## ADRs

Entscheidungen mit Trade-off: [docs/adr/README.md](../adr/README.md) (Titel scannen, sobald Einträge existieren). Format: [ADR-FORMAT.md](../../.agents/skills/grill-with-docs/ADR-FORMAT.md).
