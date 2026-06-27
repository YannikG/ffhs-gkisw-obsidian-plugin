# GKISW: Vier Prompt-Patterns für die Implementierung

Aus der Folie «Vorbereitung — Effektive Prompts für die Implementierung» (FFHS GKISW, PVA 4). Die Patterns decken nach Folie rund **80 %** typischer Sprint-Arbeit ab und ergänzen die Phasen-READMEs; sie sind **kein** Ersatz für die formale Roadmap in [README.md](README.md).

## 1. Architektur-Prompt (zu Beginn)

**Muster:** «Lies `SPEC.md` und `README.md`. Erstelle das Grundgerüst: `[Datei]` mit `[Typen/Funktionssignaturen]`. Noch keine Implementierung, nur Schnittstellen und kurze TSDoc-Kommentare.»

**Anpassung dieses Repos:** TypeScript-Obsidian-Plugin; Ziel ist ein **lesbares Gerüst** (Module, öffentliche APIs, klar getrennte Schichten laut Architektur in der Doku), bevor Logik voll ausprogrammiert wird.

## 2. Implementierungs-Prompt

**Muster:** «Implementiere `[Funktion]` in `[Datei]`. Input: `[Typ]`. Output: `[Typ]`. Fehlerbehandlung: `[Strategie]`. Tests in `[Testdatei]`.»

**Anpassung:** Testpfad und Runner folgen der Repo-Konvention (z. B. Vitest, `*.test.ts`); den Testteil im Prompt explizit nennen, sobald das Tooling steht. Bei test-first-Arbeit: [tdd-Skill](../../.agents/skills/tdd/SKILL.md).

## 3. Debug-Prompt

**Muster:** «Folgender Fehler tritt auf: `[STACKTRACE oder Meldung]`. Die betroffene Stelle ist: `[CODEAusschnitt]`. Was könnte das Problem sein? Drei mögliche Ursachen, ein Fix-Vorschlag.»

## 4. Review-Prompt

**Muster:** «Reviewe `[CODE oder PR-Ausschnitt]` auf: 1. Korrektheit, 2. Edge Cases, 3. Security. Markiere konkrete Stellen.»

**Hinweis:** Für Obsidian-Plugins gehören zu «Security» u. a. Vault-Zugriff nur über die API, keine unbeabsichtigten Datenabflüsse ausserhalb von Ollama lokal gemäss NFR in der Spezifikation.
