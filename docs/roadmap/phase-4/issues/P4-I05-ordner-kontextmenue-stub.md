# [P4-I05] Ordner-Kontextmenü «Create Summary» (Stub)

```text
Phase: 4
Issue-ID: P4-I05
Blockiert von: P4-I02 → nach Anlage GitHub-# eintragen
```

## Meta

- **Issue-ID:** P4-I05
- **Blockiert von:** P4-I02

## Abhängigkeiten

- [P4-I02-manifest-plugin-lebenszyklus.md](./P4-I02-manifest-plugin-lebenszyklus.md)

## Ziel

Am **Ordner** im File-Explorer ein Menüeintrag **Create Summary** (Anzeigename laut SPEC), der nur eine **Notice** oder klar sichtbares Stub-Feedback zeigt; keine LLM- und keine Dateischreib-Logik.

## Parallelität

Parallel zu P4-I03 und P4-I04.

## Testbare Akzeptanzkriterien

- [ ] Rechtsklick auf einen Ordner zeigt den Eintrag (nur bei Ordnern, nicht bei Dateien).
- [ ] Klick zeigt Obsidian-Notice mit eindeutigem Text (z. B. «Stub: Create Summary»).
- [ ] `onunload` entfernt den `file-menu`-Handler.

## Dev-Lifecycle

1. Manueller Test Pflicht; in PR kurz beschrieben (Vault-Typ, Obsidian-Version).
2. Review.
3. Merge.

## Abgrenzung Phase 3

Wenn das Team den Feinschliff (Wortlaut, Icons, Fortschritt) Phase 3 zuweist: im PR auf [Phase-3-README](../../phase-3/README.md) verweisen; hier nur funktionaler Stub.
