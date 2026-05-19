# Phase 8: Finalisierung

[Zurück zur Roadmap-Übersicht](../overview.md)

**Status:** Entwurf

Feinschliff der Plugin-Einstellungen und UX; Basis-Felder existieren aus P4-I04, weitere aus P5–P7. Optional: Einstellung zum Überschreiben der Summary-Basisdatei.

Voraussetzung: [Phase 7](../phase-7/README.md). Architektur: [SPEC.md](../../../SPEC.md) §6.

## Definition of Done (Entwurf)

- [ ] Einstellung **Summary-Überschreiben** (Basisdatei optional überschreiben; Default aus).
- [ ] Settings-UX: Validierung, Hilfetexte für Limit, Timeout, Top-K, Chunking.
- [ ] Optional: Ollama-Verbindungstest aus Einstellungen.
- [ ] Manueller Klicktest der Einstellungsseite dokumentiert.

## Arbeitspakete (Entwurf)

| ID | Kurzbeschreibung |
|----|------------------|
| P8-I01 | Settings-UX und Validierung (Felder aus P5–P7) |
| P8-I02 | Generierungsmodell-Auswahl (Dropdown o. ä. für e2b/e4b) |
| P8-I03 | **Summary-Überschreiben** (optional, nur Basisdatei) |
| P8-I04 | Ollama-Verbindungstest-Button |

## Verweise

- [Phase 7](../phase-7/README.md)
- [Phase 9](../phase-9/README.md)
- [SPEC.md](../../../SPEC.md)
