# [P6-I04] Idle-Index und Vault-Events

```text
Phase: 6
Issue-ID: P6-I04
Blockiert von: P6-I03, P6-I05
```

## Meta

- **Issue-ID:** P6-I04
- **Blockiert von:** [P6-I03](./P6-I03-vectors-db-schema.md), [P6-I05](./P6-I05-quellenfilter-index.md)
- **Blockiert:** P6-I07

## Abhängigkeiten

- [P6-I03-vectors-db-schema.md](./P6-I03-vectors-db-schema.md)
- [P6-I05-quellenfilter-index.md](./P6-I05-quellenfilter-index.md)
- [P5-I07-phase5-dokumentation.md](../../phase-5/issues/P5-I07-phase5-dokumentation.md)

## Ziel

**Index-Policy:** kein blockierender Voll-Scan beim Obsidian-Start. Vault-weite Pflege des **Vektorindex** per `requestIdleCallback` (Fallback dokumentiert) und Vault-**Events** für `.md` (create, modify, delete). On-Demand: `indexFolderScope(folderPath)` blockierend für den Ordner-Baum, **ohne** Obsidian-Notice (Notice in P6-I07).

## Testbare Akzeptanzkriterien

- [ ] **Enumeration:** Obsidian-Adapter nutzt `vault.getMarkdownFiles()`, danach Pure-Quellenfilter, Sortierung `vaultPath` alphabetisch aufsteigend.
- [ ] **Idle:** maximal **3 Dateien** pro Idle-Tick; Event-getriebene Arbeit hat Vorrang vor Idle-Queue.
- [ ] **Events:** Änderung an `.md` → betroffene Datei re-indexieren; Löschung → `deleteByVaultPath` für alle Chunks der Datei.
- [ ] **`indexFolderScope(folderPath)`:** Promise, die nach vollständigem Index des Baums resolved; kein UI in diesem Issue (injizierbare Ports in Tests).
- [ ] Unit-Tests: Orchestrator mit Mock-Store und Mock-Vault; z. B. Delete-Event entfernt Chunks; Idle verarbeitet höchstens 3 Pfade pro Tick.
- [ ] `npm test` grün.

## Dev-Lifecycle

1. TDD: Delete-Event → Store-Port `deleteByVaultPath` aufgerufen.
2. Obsidian-Adapter dünn; Logik testbar ohne Fenster.
3. Review gegen SPEC §4.3 und Index-Policy (Hybrid, vault-weit).

## Ausserhalb des Scopes

- Notice «Indexiere…» (P6-I07).
- Dauer-Fortschritts-UI für Idle-Hintergrund-Job.
- Create Summary, Retrieval (Phase 7).
- Parallele Summary-Läufe und Index-Priorität gegenüber Summary (spätere Klärung, nicht MVP).
