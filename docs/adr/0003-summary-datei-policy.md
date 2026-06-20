# Summary-Dateinamen und Versionierung

**Status:** accepted

Summary-Ausgabe muss in Obsidian eindeutig auffindbar sein (Suche, Graph, Backlinks). Konflikt: fester Name pro Ordner vs. mehrere Läufe ohne Datenverlust.

**Entscheid:** Basisdatei `{Ordnername}_summary.md` beim ersten Lauf; weitere Läufe erzeugen `{Ordnername}_summary_2.md`, `_summary_3.md`, … Basisdatei wird standardmässig **nicht** überschrieben. Optionaler Toggle «Summary-Basisdatei überschreiben» in den Einstellungen.

**Begründung:** US-03 — ordnerbezogene Namen, keine stille Überschreibung; Nutzer:innen behalten Versionen. Plugin schreibt und benennt Dateien; LLM liefert nur Inhalt ([docs/architecture.md](../architecture.md)).

**Konsequenz:** Summary-Dateien werden von der Quellenpolicy ausgeschlossen (kein RAG-Feedback-Loop) — siehe [docs/modules/sources.md](../modules/sources.md).

Verbindlich: [SPEC.md](../../SPEC.md) US-03, §6.
