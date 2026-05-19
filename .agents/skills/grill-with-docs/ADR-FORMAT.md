# ADR Format (FFHS GKISW Obsidian Plugin)

Directory: [`docs/adr/`](../../../docs/adr/). Create lazily on first ADR.

Files: `0001-slug.md`, `0002-slug.md`, … (four digits, kebab-case slug).

Numbering: highest existing `NNNN` + 1.

**Separate from** `docs/roadmap/**/issues/*.md` (implementation slices) and [`SPEC.md`](../../../SPEC.md) (MVP spec). ADRs record **why** a durable choice was made.

## Template

```md
# Kurztitel der Entscheidung

1–3 Sätze: Kontext, Entscheid, Begründung.
```

Optional (only when useful):

- **Status** frontmatter: `proposed | accepted | deprecated | superseded by ADR-NNNN`
- **Considered Options** — wenn verworfene Alternativen später wieder diskutiert werden
- **Consequences** — nicht-offensichtliche Folgen

German prose: Schweizer Rechtschreibung (Umlaute, ss).

## When to offer an ADR (all three required)

1. **Hard to reverse** — meaningful cost to change later  
2. **Surprising without context** — future reader asks «why this way?»  
3. **Real trade-off** — genuine alternatives, explicit choice  

Skip if easy to reverse, obvious, or no alternative mattered.

## What often qualifies in this project

- Index storage: `vectors.db` in plugin data dir vs vault  
- RAG refresh: Obsidian events vs manual rebuild  
- Summary overwrite vs versioned filenames (if not only in SPEC)  
- Ollama model tags / embedding model lock-in  
- Boundary: what never leaves localhost (PRD-NF01/NF02)  
- Integration shape: orchestrator vs separate services in `src/`

## What usually does not need an ADR

- Lint rule, test helper, variable rename  
- Obvious Obsidian API usage already in SPEC  
- Issue-scoped slice already fully captured in `docs/roadmap/.../issues/*.md` (link issue instead)

## After ADR

If decision changes MVP behaviour, user may update `SPEC.md` in a **separate** explicit step (not silent during grill).
