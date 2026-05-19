# [P5-I06] Create Summary End-to-End (ohne RAG)

```text
Phase: 5
Issue-ID: P5-I06
Blockiert von: P5-I02, P5-I03, P5-I04, P5-I05
```

## Meta

- **Issue-ID:** P5-I06
- **Blockiert von:** P5-I02, P5-I03, P5-I04, P5-I05
- **Blockiert:** P5-I07

## Abhängigkeiten

- [P5-I02-ollama-http-client.md](./P5-I02-ollama-http-client.md)
- [P5-I03-system-prompt-modul.md](./P5-I03-system-prompt-modul.md)
- [P5-I04-ordner-markdown-einlesen.md](./P5-I04-ordner-markdown-einlesen.md)
- [P5-I05-summary-datei-schreiben.md](./P5-I05-summary-datei-schreiben.md)
- [P4-I05-ordner-kontextmenue-stub.md](../../phase-4/issues/P4-I05-ordner-kontextmenue-stub.md)

## Ziel

Menü-Stub durch echten **Summary-Lauf** ersetzen: **Ordner** → **Ordner-Quellkorpus** → Ollama Chat → **Summary** schreiben. Ein Lauf zur Zeit; Notices bei Fehlern und Erfolg (mit Dateiname).

## Testbare Akzeptanzkriterien

- [ ] Einstellungsseite erweitert um **Kontextlimit** (Default 32'000 Zeichen) und **Ollama-Timeout** (Default 90 s); Persistenz wie bestehende Felder.
- [ ] Ablauf: Klick → lesen → Korpus bilden → bei **Kontextlimit** oder **leerer Quellordner**: Notice + Abbruch, keine Summary.
- [ ] Sonst: «Generiere…»-Notice (kein Streaming) → `/api/chat` → Schreiben → Erfolgs-Notice mit erzeugtem Dateinamen.
- [ ] Zweiter Klick während Lauf: Notice «Läuft bereits» oder ignorieren (nur ein aktiver Lauf).
- [ ] Fehlerfälle mit Notice: Ollama nicht erreichbar, Modell fehlt, Timeout.
- [ ] Manueller Test: Vault-Ordner mit mindestens einer `.md` → **Summary-Basisdatei**; zweiter Lauf → **Summary-Version**.
- [ ] Orchestrator-Unit-Tests mit injizierten Ports (client, vault, notices); `npm test` und `npm run build` grün.
- [ ] `onunload` entfernt Handler weiterhin sauber.

## Dev-Lifecycle

1. TDD auf Orchestrator (Fehlerpfade zuerst).
2. Integration Menü; manueller Test mit lokalem Ollama dokumentiert in PR.
3. Review gegen diese Datei und [SPEC.md](../../../../SPEC.md).
4. Merge.

## Scope

Kein **Vektorindex**, kein Retrieval (Phase 6/7). Kein Streaming in die Summary-Datei.
