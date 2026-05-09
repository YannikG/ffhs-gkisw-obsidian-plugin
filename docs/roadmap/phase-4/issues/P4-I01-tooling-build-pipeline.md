# [P4-I01] Build-Pipeline: Node 20+, TypeScript, esbuild

```text
Phase: 4
Issue-ID: P4-I01
Blockiert von: (GitHub-Issue-Nummern eintragen, hier: keine)
Blockiert: (nach Anlage: P4-I02, P4-I06, P4-I08, P4-I09)
```

## Meta

- **Phase:** 4
- **Issue-ID:** P4-I01
- **Blockiert von:** keine
- **Blockiert:** P4-I02, P4-I06 (final nach I08 und I09), P4-I08 (Konfiguration), P4-I09

## Abhängigkeiten

- keine

## Ziel

Lokales und CI-taugliches TypeScript-Bundle erzeugen, das als `main.js` in Obsidian eingebunden werden kann.

## Testbare Akzeptanzkriterien

- [ ] `package.json` enthält `"engines": { "node": ">=20" }` (oder gleichwertige Dokumentation in README, falls engines weggelassen wird).
- [ ] Skripte: `npm run build` erzeugt `main.js` im Plugin-Root (oder dokumentierter Ausgabepfad).
- [ ] Skript `npm run dev` startet Watch-Mode (oder dokumentiertes Äquivalent).
- [ ] `npm ci` auf frischem Clone beendet sich mit Exitcode 0.
- [ ] `tsconfig.json` ist vorhanden; `npm run build` typecheckt (entweder via `tsc --noEmit` als eigenes Skript oder via esbuild mit strikter Konfiguration; Team wählt eine Variante und dokumentiert sie).

## Dev-Lifecycle

1. **Implementierung:** nur Tooling-Dateien, noch kein Obsidian-spezifisches Verhalten nötig; minimaler Einstieg `src/main.ts` darf leerer Stub sein, der gebündelt wird.
2. **Lokal verifizieren:** `npm ci`, `npm run build`, bei Watch einmal starten und beenden.
3. **Pull Request:** Titel enthält `[P4-I01]`; Beschreibung verlinkt diese Datei oder Phase-4-README.
4. **Review:** zweites Teammitglied prüft Skripte und reproduziert `npm ci` / `npm run build`.
5. **Merge:** nach mindestens einem Approval; danach GitHub-Issue schliessen, nachfolgende Issues startbar machen.

## Ausserhalb des Scopes

Obsidian-`manifest.json`-Felder inhaltlich finalisieren (gehört in I02), Einstellungen, UI.
