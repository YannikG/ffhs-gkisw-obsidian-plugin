# [P8-I01] Settings-UX und Validierung

```text
Phase: 8
Issue-ID: P8-I01
GitHub: #64
Blockiert von: P7-I05 (#47), P5-I02 (#20)
```

## Meta

- **Issue-ID:** P8-I01
- **GitHub:** #64
- **Blockiert von:** [P7-I05](../../phase-7/issues/P7-I05-vollkorpus-entfernen.md) (#47), [P5-I02](../../phase-5/issues/P5-I02-ollama-http-client.md) (#20)
- **Blockiert:** P8-I02

## Abhängigkeiten

- [P7-I05-vollkorpus-entfernen.md](../../phase-7/issues/P7-I05-vollkorpus-entfernen.md)
- [P5-I02-ollama-http-client.md](../../phase-5/issues/P5-I02-ollama-http-client.md)

## Ziel

Einstellungsseite für alle Felder aus P4–P7 finalisieren (Abschnitte, Hilfetexte, Validierung). Ollama-Erreichbarkeit prüft **Generierungs- und Embedding-Modell** (`/api/tags`); dieselbe Prüfung im **Create-Summary**-Orchestrator und per Button «Verbindung testen».

## Testbare Akzeptanzkriterien

- [ ] Drei UI-Abschnitte mit Überschriften: **Ollama**, **Vektorindex**, **Zusammenfassung**.
- [ ] **Kontextlimit**-Beschreibung: Obergrenze **Retrieval-Kontext** (Chunk-Texte), nicht **Ordner-Quellkorpus**.
- [ ] Hilfetexte nennen Defaults: Kontextlimit 32'000 Zeichen, Ollama-Timeout 90 s, Retrieval Top-K 8, Chunk-Grösse 1000, Chunk-Overlap 200.
- [ ] Zahlfelder: positive Ganzzahlen via bestehende Validierung; **keine** Kreuzvalidierung Overlap vs. Chunk-Grösse.
- [ ] **Generierungsmodell:** Freitext; Hilfetext empfiehlt `gemma4:e2b` und `gemma4:e4b`; Platzhalter `gemma4:e2b`.
- [ ] **Embedding-Modell:** Freitext unverändert (kein Dropdown).
- [ ] `ollama/`: öffentliche Dual-Check-Funktion prüft beide konfigurierten Modell-Tags; Fehlerformat unverändert (`Modell "{tag}" ist bei Ollama nicht geladen.`).
- [ ] Summary-Orchestrator nutzt Dual-Check vor Chat (ersetzt reinen Generierungsmodell-Check).
- [ ] Button «Verbindung testen» unter Ollama; Erfolgs-Notice nennt beide Modell-Tags; kein Settings-Persist.
- [ ] Unit-Tests: Dual-Check (beide ok / Generierung fehlt / Embedding fehlt / Netzwerk); Orchestrator bricht bei Fehler ab.
- [ ] `npm test`, `npm run build` grün.

## Dev-Lifecycle

1. TDD: Dual-Check-Tests → Implementierung in `ollama/`.
2. Orchestrator-Wiring und Button in `settings-tab.ts`.
3. Settings-UX: Abschnitte und Hilfetexte.
4. Review gegen [Phase-8-README](../README.md) DoD.

## Ausserhalb des Scopes

- **Summary-Überschreiben** (P8-I02).
- Embedding-Dropdown; dynamische Modellliste von Ollama.
- Chat- oder Embed-Probe beim Verbindungstest.
