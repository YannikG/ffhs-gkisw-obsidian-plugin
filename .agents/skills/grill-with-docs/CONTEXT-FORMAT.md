# CONTEXT.md Format (FFHS GKISW Obsidian Plugin)

Single file at repo root: [`CONTEXT.md`](../../../CONTEXT.md).

**Not** a substitute for [`SPEC.md`](../../../SPEC.md) (product/tech spec) or `docs/roadmap/**` (phases, issues). Glossary and domain relationships only. **Do not** link from `docs/roadmap/**/README.md` or `issues/*.md` (see [`docs/agents-docs/domaenensprache.md`](../../../docs/agents-docs/domaenensprache.md)).

## Structure

```md
# Obsidian Summarizer — Domänensprache

Kurz: wofür dieser Kontext existiert (1–2 Sätze, keine Technologie-Liste).

## Language

**Summary** (Ausgabe):
Die erzeugte Markdown-Zusammenfassung im Vault, Dateiname nach US-03 (`{Ordnername}_summary.md`).
_Avoid_: Report, abstract (ohne Klärung)

**Ordner** (Kontext):
Der per Kontextmenü gewählte Vault-Ordner inkl. Unterordner als Quellumfang.
_Avoid_: Verzeichnis, path (im UI-Text)

**Vault**:
Die Obsidian-Notizensammlung des Nutzers; Plugin liest/schreibt nur freigegebene Pfade.
_Avoid_: Repository, Projektordner

## Relationships

- Ein **Ordner**-Kontext liefert Quell-`.md`-Dateien (rekursiv) für genau eine **Summary**-Erzeugung.
- **Summary** liegt im selben **Ordner** wie die Kontextaktion (nicht global ein Dateiname).

## Example dialogue

> **Dev:** «Wird bei erneutem **Create Summary** die bestehende **Summary** ersetzt?»
> **Fachexpertin:** «Nein: Basisdatei bleibt; nächste **Summary-Version** `_summary_2`, … (hybrid).»

## Flagged ambiguities

- «Zusammenfassung» vs **Summary** — resolved: **Summary** = Datei/Artefakt; «Zusammenfassung» = Prozess/UI-Label ok.
```

## Rules

- **Opinionated:** pick one canonical term; list _Avoid_ aliases.
- **Flag conflicts** in «Flagged ambiguities» with resolution.
- **Definitions tight:** one sentence; what it **is**, not full behaviour (behaviour → SPEC / issues).
- **Project-specific only:** no generic programming glossary (Promise, timeout, lint).
- **Subheadings** under Language when clusters grow (z. B. RAG, UI, Persistenz).
- **Example dialogue** required once the file has ≥3 terms.
- **Schweizer Rechtschreibung** in German prose: Umlaute, **ss**, keine ß.

## Single context

This repo uses one root `CONTEXT.md`. If the team later adds `CONTEXT-MAP.md`, read the map first and write per-context files as described in the map.
