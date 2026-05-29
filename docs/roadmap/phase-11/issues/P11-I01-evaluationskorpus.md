# [P11-I01] Evaluationskorpus anlegen

```text
Phase: 11
Issue-ID: P11-I01
GitHub: #71
Blockiert von: P10-I02 (#70)
```

## Meta

- **Issue-ID:** P11-I01
- **GitHub:** #71
- **Blockiert von:** [P10-I02](../../phase-10/issues/P10-I02-team-review-doku.md) (#70)
- **Blockiert:** [P11-I02](./P11-I02-laufzeit-messung.md) (#72)

## Abhängigkeiten

- [P10-I02-team-review-doku.md](../../phase-10/issues/P10-I02-team-review-doku.md)

## Ziel

Drei künstliche lange Markdown-Quelldateien mit eingebauten Fehlern und definierten Schlüsselpunkten gemäss [SPEC.md](../../../../SPEC.md) §8 für manuelle Evaluation.

## Testbare Akzeptanzkriterien

- [ ] Verzeichnis `docs/evaluation/corpus/` mit drei `.md`-Dateien (z. B. `eval-01.md`, `eval-02.md`, `eval-03.md`).
- [ ] `docs/evaluation/corpus/README.md`: pro Datei Liste der **eingebauten Fehler** (falsch widersprüchliche Fakten) und **Schlüsselpunkte** (für 80-%-Checkliste).
- [ ] Dateien lang genug für realistischen RAG-Lauf (gemeinsam Kontext unter typischem Limit oder ein Ordner pro Datei dokumentiert).
- [ ] Keine Summary-Ausgabedateien im Korpus; Quellenfilter-konform.
- [ ] Anleitung: Korpus in Test-Vault-Ordner kopieren, **Create Summary** ausführen.

## Dev-Lifecycle

1. PR nur Korpus + README.
2. Review gegen SPEC §8 Inhaltsabdeckung.
3. Merge.

## Ausserhalb des Scopes

- Automatisierte LLM-Auswertung.
- Generierungszeit-Messung (P11-I02).
