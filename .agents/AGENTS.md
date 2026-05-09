# Agent-Anweisungen (Repository-weit)

Diese Datei liegt absichtlich unter **`.agents/`**, damit **verschiedene KI- und Agenten-Tools** (nicht nur Cursor) dieselben Projektregeln finden können. Inhalt ist die kanonische Fassung; bei Cursor ergänzt optional `.cursor/rules/docs-kontext-zuerst.mdc` einen Verweis hierher.

---

## Dokumentation zuerst (`docs/`)

Bevor du Code änderst, projektbezogene Shell-Befehle ausführst oder inhaltlich bewertest (Roadmap, Anforderungen, Architektur, Produktverhalten), verschaff dir zuerst Projektbezug, indem du den Ordner **`docs/`** am Repository-Root **liest** (siehe Mindestumfang). Reine Datei-Lesevorgänge zum Erfüllen dieser Regel haben Vorrang vor anderen Werkzeugaktionen.

### Mindestumfang

1. **`docs/roadmap/overview.md`** vollständig lesen (aktueller Phasenstand, Verweise auf Phasen-READMEs, Querverweise).
2. Danach alle **weiteren Dateien unter `docs/`**, die zur Nutzeranfrage passen (insbesondere das **README** der betroffenen Roadmap-Phase, z. B. `docs/roadmap/phase-3/README.md` bei UI-/UX-Themen, sowie `docs/roadmap/methodik-gkisw-prompt-patterns.md`, wenn es um Arbeitsweise mit KI geht).

### Spezifikation im Repository-Root

Implementierungsnahe Details stehen in **`SPEC.md`** im Repository-Root (verlinkt aus der Roadmap-Übersicht). Wenn die Aufgabe Spezifikation oder Verhalten des Plugins betrifft, **`SPEC.md`** einbeziehen, sobald der Kontext aus `docs/` klar ist.

### Pragmatik

Wenn die Nutzeranfrage **ausschliesslich** `docs/` oder reine Metadaten betrifft, reicht gezieltes Lesen der betroffenen `docs/`-Dateien; `overview.md` trotzdem kurz prüfen, falls der Stand der Phasen für die Antwort relevant sein könnte.
