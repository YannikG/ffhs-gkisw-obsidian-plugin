# [P5-I01] Ollama-Entwickler-Setup und Modelle

```text
Phase: 5
Issue-ID: P5-I01
GitHub: #19
Blockiert von: P4-I07 (#9)
```

## Meta

- **Issue-ID:** P5-I01
- **GitHub:** #19
- **Blockiert von:** [P4-I07-entwicklerdokumentation.md](../../phase-4/issues/P4-I07-entwicklerdokumentation.md) (#9)

## Abhängigkeiten

- [P4-I07-entwicklerdokumentation.md](../../phase-4/issues/P4-I07-entwicklerdokumentation.md)

## Ziel

Entwickler:innen können Ollama lokal installieren, die SPEC-Modelle laden und die Erreichbarkeit prüfen, bevor Plugin-Code gegen eine echte Instanz getestet wird.

## Parallelität

Parallel zu P5-I02 bis P5-I05.

## Testbare Akzeptanzkriterien

- [ ] Root-[README.md](../../../../README.md) enthält einen Abschnitt «Ollama»: Installation, Start, `ollama pull` für `gemma4:e2b`, optional `gemma4:e4b`, `nomic-embed-text` (SPEC §4.1).
- [ ] Kurzbeschriebene Verifikation (z. B. `ollama list`, Health-Request auf Default-URL).
- [ ] Keine neue Plugin-Laufzeitlogik in diesem Issue.

## Dev-Lifecycle

1. README-Änderung in kleinem PR.
2. Review: ein Teammitglied führt die dokumentierten Schritte auf frischem Setup durch.
3. Merge.

## Scope

Kein Ollama in CI; kein automatischer Modell-Download im Plugin.
