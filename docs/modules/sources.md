# Quellenpolicy — Was zählt als Wissensbasis

Regeln, welche Vault-Pfade **indexiert** und als **Summary-Quelle** genutzt werden. Verhindert Feedback-Schleifen (Summary indexiert sich selbst) und schützt Obsidian-Metadaten.

Spezifikation: [SPEC.md §4.4](../../SPEC.md#44-quellenfilter-summary-ausgaben).

---

## Prinzip

Nur **eigene Inhalts-Markdown** aus dem gewählten Ordnerbaum fliessen in Index und Summary. Technische Pfade und **vom Plugin erzeugte Summaries** sind ausgeschlossen.

---

## Ein- und Ausschluss

| Vault-Pfad | Index & Quelle |
|------------|----------------|
| `.obsidian/` (Konfiguration) | ausgeschlossen |
| `*_summary.md`, `*_summary_<n>.md` | ausgeschlossen (Plugin-Ausgabe) |
| `summary.md` (Legacy-Name) | ausgeschlossen |
| Normale `.md`-Notizen | eingeschlossen |

Gleiche Regeln gelten für **Hintergrund-Index** und **Create Summary**.

---

## Warum das wichtig ist

- **Keine Selbstreferenz:** Eine Summary soll nicht aus älteren Summaries «zusammengesetzt» werden.
- **Stabilere Retrieval-Queries:** Suchanfrage basiert auf echten Quellnotizen.
- **Datenschutz im Kleinen:** `.obsidian` enthält keine Inhaltsnotizen, gehört aber nicht in den Korpus.

---

## Siehe auch

- [summary.md](./summary.md) — Ausgabenamen und Versionierung
- [rag.md](./rag.md) — Index nutzt dieselbe Policy
