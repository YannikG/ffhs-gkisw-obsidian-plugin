# [P6-I07] rag-Modul und Plugin-Integration

```text
Phase: 6
Issue-ID: P6-I07
Blockiert von: P6-I04, P6-I05, P6-I06
```

## Meta

- **Issue-ID:** P6-I07
- **Blockiert von:** [P6-I04](./P6-I04-idle-index-vault-events.md), [P6-I05](./P6-I05-quellenfilter-index.md), [P6-I06](./P6-I06-einstellungen-vektorindex.md)
- **Blockiert:** Phase 7 (Retrieval-Anbindung)

## Abhängigkeiten

- [P6-I04-idle-index-vault-events.md](./P6-I04-idle-index-vault-events.md)
- [P6-I05-quellenfilter-index.md](./P6-I05-quellenfilter-index.md)
- [P6-I06-einstellungen-vektorindex.md](./P6-I06-einstellungen-vektorindex.md)
- [P5-I07-phase5-dokumentation.md](../../phase-5/issues/P5-I07-phase5-dokumentation.md)

## Ziel

`src/rag/` mit stabiler, testbarer öffentlicher API; dünne Integration in `main.ts` (Idle + Events beim Laden, sauberes `onunload`). On-Demand-Fassade mit Obsidian-Notice «Indexiere…» für Ordner-Scope (Phase 7 ruft diese Fassade). Kein Retrieval in Create Summary in dieser Phase.

## Testbare Akzeptanzkriterien

- [ ] Exporte mindestens: Index öffnen/starten, Hintergrund-Index starten, `indexFolderScopeWithNotice(folderPath)` (Notice + blockierendes `indexFolderScope` aus P6-I04), `resetIndex` (oder Delegation an P6-I06-Flow).
- [ ] Optional: `retrieveTopK` als Stub oder minimale Prefix-Abfrage nur für Tests (Vollverhalten Phase 7).
- [ ] `main.ts`: registriert Idle- und Event-Handler; `onunload` disposed Handler und schliesst DB-Verbindung.
- [ ] Unit-Test: Mock-Plugin, Handler registriert und disposed; On-Demand-Fassade ruft Notice-Port auf.
- [ ] [`src/README.md`](../../../../src/README.md) Modultabelle `rag/` aktualisiert.
- [ ] `npm test`, `npm run build`, CI grün.

## Dev-Lifecycle

1. TDD: Export-Smoke und On-Demand-Notice mit Mock-Ports.
2. Integration `main.ts`; manueller Kurztest in Obsidian (Index startet, keine Startup-Blockade).
3. Review gegen [Phase-6-README](../README.md) DoD.

## Ausserhalb des Scopes

- Create Summary mit Retrieval (Phase 7).
- Top-K-Einstellung in der UI (Phase 7/8).
- E2E-Automatisierung in Obsidian-Fenster.
