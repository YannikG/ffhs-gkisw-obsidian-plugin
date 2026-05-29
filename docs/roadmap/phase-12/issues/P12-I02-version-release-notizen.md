# [P12-I02] Version, Manifest und Release-Notizen

```text
Phase: 12
Issue-ID: P12-I02
GitHub: #75
Blockiert von: P12-I01 (#74)
```

## Meta

- **Issue-ID:** P12-I02
- **GitHub:** #75
- **Blockiert von:** [P12-I01](./P12-I01-freigabe-checkliste.md) (#74)
- **Blockiert:** —

## Abhängigkeiten

- [P12-I01-freigabe-checkliste.md](./P12-I01-freigabe-checkliste.md)

## Ziel

MVP-Version im Plugin-Manifest festhalten; Release-Notizen für Team und README.

## Testbare Akzeptanzkriterien

- [ ] `manifest.json` `version` auf MVP-Stand gesetzt (Semver, z. B. `1.0.0` oder Team-Vereinbarung `0.2.0`).
- [ ] Root-[`README.md`](../../../../README.md): Abschnitt **Release** oder Verweis auf `docs/release/notes.md` mit MVP-Funktionsumfang.
- [ ] `docs/release/notes.md`: Datum, Version, Kurzliste Features (Create Summary, RAG, Einstellungen).
- [ ] `npm run build` erzeugt `manifest.json` im `dist`/Plugin-Ordner konsistent.
- [ ] [Phase-12-README](../README.md) DoD vollständig.

## Dev-Lifecycle

1. Nach Go aus P12-I01.
2. PR mit Manifest + Doku.
3. Merge = MVP freigegeben (Roadmap Schritt 12).

## Ausserhalb des Scopes

- Obsidian Community Store Listing.
- Signiertes Release-Asset (optional Team-Entscheid).
