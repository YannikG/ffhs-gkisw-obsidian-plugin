---
name: grill-with-docs
description: >-
  Grill session: plan stress-test against domain language and documented decisions.
  One question at a time, recommended answer each time. Updates CONTEXT.md (glossary)
  and docs/adr/ inline when terms or hard decisions crystallise. Use when user wants
  to sharpen a plan, feature idea, or architecture before implementation. Triggers:
  grill, grill me, stress-test plan, domain interview, sharpen terminology.
disable-model-invocation: true
---

# Grill with docs

Relentless interview on **one aspect at a time**. Wait for user answer before next question. Each question: **your recommended answer** (short, concrete).

If answer is in repo → **read code/docs first**, then ask only what stays open.

**Language:** User-facing grill talk may use **caveman** if user invoked `/caveman` or caveman skill. **Written artefacts** (`CONTEXT.md`, ADRs, edits to `docs/`) use **Schweizer Hochdeutsch**: Umlaute, **ss** never ß, normal punctuation.

## Before first question

Read (in order, do not skip):

1. [`.agents/AGENTS.md`](../../AGENTS.md) — agent rules.
2. [`docs/roadmap/overview.md`](../../../docs/roadmap/overview.md) — full file.
3. [`SPEC.md`](../../../SPEC.md) — product/architecture SSOT for MVP.
4. [`CONTEXT.md`](../../../CONTEXT.md) if it exists.
5. [`docs/adr/`](../../../docs/adr/) — scan existing ADR titles.
6. Topic-related: phase [`README`](../../../docs/roadmap/), [`docs/agents-docs/README.md`](../../../docs/agents-docs/README.md), open **GitHub issue** + linked `docs/roadmap/**/issues/*.md` if user gave issue # or URL.

**Do not** patch `docs/roadmap/**/issues/*.md` during grill unless user explicitly wants roadmap/plan change there (team SSOT: [`docs/zusammenarbeit/README.md`](../../../docs/zusammenarbeit/README.md)).

**Do not** link Root-[`CONTEXT.md`](../../../CONTEXT.md) from `docs/roadmap/**/README.md` or `issues/*.md` (agent glossary only; Einstieg [`docs/agents-docs/domaenensprache.md`](../../../docs/agents-docs/domaenensprache.md)).

## Doc map (this repo)

| Artefact | Role | When to write |
|----------|------|----------------|
| [`docs/agents-docs/domaenensprache.md`](../../../docs/agents-docs/domaenensprache.md) | Agent entry: when to use `CONTEXT.md` vs SPEC/issues. | Exists; extend if workflow changes. |
| [`CONTEXT.md`](../../../CONTEXT.md) | **Glossary only** — domain terms, relationships, example dialogue. No implementation, no API, no file paths. Not linked from phase READMEs/issues. | Lazily on first resolved term. Format: [CONTEXT-FORMAT.md](./CONTEXT-FORMAT.md). |
| [`docs/adr/NNNN-slug.md`](../../../docs/adr/) | **Hard, surprising, trade-off decisions** only. | Lazily when all three ADR criteria met. Format: [ADR-FORMAT.md](./ADR-FORMAT.md). |
| [`SPEC.md`](../../../SPEC.md) | Implementation/product spec (MVP). | **Do not edit** during grill unless user explicitly asks to update spec after a decision. |
| `docs/roadmap/**` | Phases, issue templates, acceptance. | Read-only during grill unless user orders plan edit. |

Single context (no `CONTEXT-MAP.md` unless team adds one later).

## During session

### Challenge glossary

Term conflicts with [`CONTEXT.md`](../../../CONTEXT.md) → call out immediately.  
Example: «CONTEXT: **Summary** = output file. You mean source notes — which term?»

### Sharpen fuzzy language

Overload («account», «folder», «summary», «index») → propose **one canonical term**, map aliases under _Avoid_.

Project anchors (check against SPEC before canonising):

- **Vault**, **Ordner** (folder context menu target), **Summary** / **Zusammenfassung** (output artefact)
- **RAG**, **Chunk**, **Embedding**, **Vektorindex** (`vectors.db`)
- **Ollama** (local LLM/embeddings), **Plugin-Datenverzeichnis** vs Vault paths

### Concrete scenarios

Invent edge cases: empty folder, only subfolders, `{Ordnername}_summary.md` overwrite vs `_summary_2`, vault rename, index stale, Ollama down, huge folder. Force precise boundaries.

### Cross-reference code

User states behaviour → check `src/`, tests. Contradiction → surface: «Code does X; you said Y — which wins?»

### Cross-reference SPEC and roadmap

Conflict with `SPEC.md` or issue `.md` → surface; do not silently «fix» spec. Offer: update CONTEXT/ADR, or user-driven SPEC/issue change later via normal workflow ([`implement-plan-workflow`](../implement-plan-workflow/SKILL.md)).

### Update CONTEXT.md inline

On resolved term → edit `CONTEXT.md` **immediately** (no batch). [CONTEXT-FORMAT.md](./CONTEXT-FORMAT.md).

### ADRs sparingly

Offer ADR only if **all** true (see [ADR-FORMAT.md](./ADR-FORMAT.md)):

1. Hard to reverse  
2. Surprising without context  
3. Real trade-off (alternatives existed)

Examples that may qualify here: `vectors.db` location, event-driven reindex strategy, overwrite vs versioned summary files, model tag choice lock-in.

### End of session

Short recap: terms locked, ADRs created/skipped, open questions, suggested next step (e.g. GitHub issue + `implement-plan-workflow`, or SPEC edit PR).

## After grill → implementation

Do **not** start coding in the same session unless user asks. Typical handoff:

1. User opens/updates GitHub issue (permalink to roadmap `.md` if applicable).  
2. [`implement-plan-workflow`](../implement-plan-workflow/SKILL.md) + optional [`tdd`](../tdd/SKILL.md).

## Triggers

`grill`, `grill me`, `stress-test plan`, `domain interview`, `sharpen terminology`, `grill with docs`, `/grill`.
