# Plugin-Architektur — Module und Abläufe

Fachliche Einordnung der Implementation unter `src/`. Technische Gesamtarchitektur: [docs/architecture.md](../architecture.md). Spezifikation: [SPEC.md §4](../../SPEC.md#4-architektur).

---

## Was das Plugin tut (End-to-End)

1. Benutzer:in wählt einen **Vault-Ordner** (Kontextmenü **Create Summary**).
2. Plugin sammelt **Markdown-Quellen** (Unterordner, ohne eigene Summary-Ausgaben).
3. **RAG** indexiert und holt die passendsten Textabschnitte.
4. **Ollama** erzeugt daraus eine strukturierte Summary.
5. Ergebnis als **`{Ordnername}_summary.md`** im selben Ordner (Versionierung siehe [summary.md](./summary.md)).

Alles lokal — keine Vault-Daten an externe Dienste (SPEC PRD-NF02).

---

## Themenbereiche

| Thema | Dokument | Kernidee |
|-------|----------|----------|
| Lokales LLM & Modelle | [docs/ollama/README.md](../ollama/README.md) | Zwei Modelle: Text erzeugen vs. Vektoren berechnen |
| RAG | [rag.md](./rag.md) | Index + semantische Suche statt Volltext im Prompt |
| Create Summary | [summary.md](./summary.md) | Orchestrierung, Prompt, Ausgabe im Vault |
| Quellenpolicy | [sources.md](./sources.md) | Was zählt als Wissensbasis — und was nicht |

**Einstellungen** (Ollama, Index, Schreibmodus): [SPEC.md §6](../../SPEC.md#6-einstellungen-minimum).

---

## Architektur-Prinzipien

- **Obsidian-Bindung nur in der äusseren Schicht:** UI, Vault-Zugriff und Settings-Persistenz nutzen Obsidian. Die Fachlogik bleibt davon frei, dadurch testbar und über Ports angebunden.
- **Nur ein Summary-Lauf gleichzeitig:** kein paralleles Überschreiben, klare Notices pro Phase.
- **Retrieval vor Generierung:** der Kontext stammt aus der semantischen Suche, nicht aus dem ungefilterten Ordner-Volltext.
- **Fehler bleiben sichtbar:** kein stilles Scheitern. Leerer Ordner, Ollama nicht erreichbar oder Kontext zu gross führen zu einer Notice und brechen den Lauf ab.

---

## Manueller Kurztest

1. Ollama mit beiden Modellen — [docs/ollama/README.md](../ollama/README.md).
2. Plugin aktivieren, Defaults prüfen, «Verbindung testen».
3. Ordner mit `.md` → **Create Summary** → `{Ordner}_summary.md`.
4. Zweiter Lauf → `_summary_2.md` (ohne Überschreib-Toggle).

Build/Tests: [README.md § Entwicklung](../../README.md#entwicklung).

---

## Roadmap-Bezug

Umsetzung in Phasen 4–8 (Shell → LLM → RAG → Verknüpfung → Settings): [docs/roadmap/README.md](../roadmap/README.md).
