# Benutzer-Handbuch — Obsidian Summarizer

Installation, Erstkonfiguration und **Create Summary** für Endnutzer:innen. Technische Spezifikation: [SPEC.md](../SPEC.md). Entwickler-Setup: [README.md § Entwicklung](../README.md#entwicklung).

---

## Voraussetzungen

| Komponente | Version / Hinweis |
|------------|-------------------|
| **Obsidian** | Desktop (Plugin `isDesktopOnly`); mindestens `minAppVersion` aus `manifest.json` |
| **Ollama** | Lokal installiert und laufend |
| **Modelle** | `gemma4:e2b` (Generierung), `nomic-embed-text` (Embeddings) |

---

## Ollama vorbereiten

1. Ollama von [ollama.com/download](https://ollama.com/download) installieren und starten (Desktop-App oder `ollama serve`).
2. Modelle laden:

```bash
ollama pull gemma4:e2b
ollama pull nomic-embed-text
```

3. Prüfen:

```bash
ollama list
curl -s http://127.0.0.1:11434/api/tags
```

Erwartung: beide Modelle in `ollama list`; HTTP 200 von der API.

Details und Troubleshooting: [docs/ollama/README.md](ollama/README.md).

---

## Plugin in Obsidian installieren

Plugin-ID (Ordnername): `ffhs-gkisw-obsidian-plugin`.

Zielverzeichnis im Vault:

`.obsidian/plugins/ffhs-gkisw-obsidian-plugin/`

Dort müssen liegen: `manifest.json`, `main.js` (optional `main.js.map`).

### Variante A — Artefakte kopieren

Nach einem Build (lokal oder vom Projektteam) die drei Dateien in den Plugin-Ordner kopieren.

### Variante B — Build aus dem Repository

```bash
git clone <repo-url>
cd ffhs-gkisw-obsidian-plugin
npm ci
npm run build
npm run deploy -- "/pfad/zum/Vault"
```

Der Deploy-Pfad kann Vault-Root, `.obsidian` oder der Plugin-Ordner sein. **Pfade mit Leerzeichen in Anführungszeichen setzen.**

### Aktivieren

Obsidian → **Einstellungen → Community plugins** → **Obsidian Summarizer** aktivieren.

**Plugin lädt nicht:** Obsidian-Version prüfen; Ordnername exakt `ffhs-gkisw-obsidian-plugin`; `main.js` und `manifest.json` im Plugin-Ordner vorhanden.

---

## Einstellungen

**Einstellungen → Obsidian Summarizer** — drei Abschnitte:

| Abschnitt | Zweck | Wichtige Felder |
|-----------|-------|-----------------|
| **Ollama** | Verbindung zum lokalen LLM | Base URL (Default `http://127.0.0.1:11434`), Generierungsmodell, Embedding-Modell, Timeout |
| **Vektorindex** | RAG-Parameter | Chunk-Grösse, Overlap, Top-K, Kontextlimit; **Vektorindex zurücksetzen** |
| **Zusammenfassung** | Ausgabeverhalten | Toggle **Summary-Basisdatei überschreiben** |

**Erstkonfiguration:** Defaults unverändert lassen, wenn Ollama-Standard-URL und SPEC-Modelle genutzt werden. Button **Verbindung testen** — Erfolgs-Notice nennt beide Modelle. Bei Fehler: Ollama läuft? Modelle geladen? URL korrekt?

Vollständige Feldliste: [SPEC.md §6](../SPEC.md#6-einstellungen-minimum).

---

## Create Summary — Schritt für Schritt

1. Im **Datei-Explorer** einen **Ordner** wählen (nicht eine einzelne Datei).
2. **Rechtsklick** → **Create Summary**.
3. Notices beobachten: Indexierung, Generierung, Erfolg mit Dateiname.
4. Die neue Notiz `{Ordnername}_summary.md` im selben Ordner öffnen.

**Leerer Ordner** (keine `.md`-Quellen): Abbruch mit Notice, keine Ausgabedatei.

---

## Summary-Dateinamen und Versionierung

| Situation | Dateiname |
|-----------|-----------|
| Erster erfolgreicher Lauf | `{Ordnername}_summary.md` |
| Weitere Läufe (Toggle aus) | `{Ordnername}_summary_2.md`, `_summary_3.md`, … |
| Toggle **Basisdatei überschreiben** an | Erneute Läufe überschreiben `{Ordnername}_summary.md` |

`{Ordnername}` = letztes Segment des Ordnerpfads, für Dateinamen bereinigt (SPEC US-03).

---

## Typische Fehler und Notices

| Symptom | Massnahme |
|---------|-----------|
| Verbindungstest schlägt fehl | Ollama starten; `ollama pull` für beide Modelle; URL in Einstellungen prüfen |
| Kein Menüeintrag | Plugin aktivieren; Obsidian neu laden |
| Aktion am **File** statt Ordner | Nur Ordner-Kontextmenü unterstützt |
| Generierung bricht ab | Kontextlimit in Einstellungen erhöhen oder Ordner verkleinern; Timeout erhöhen |
| Summary wirkt unvollständig | Bekannte Limitation bei gemischten Themen (Top-K-Retrieval); siehe unten |

Vault-Inhalte gehen nur an die konfigurierte lokale Ollama-URL — nicht an Cloud-Dienste (SPEC NF01/NF02).

---

## Limitationen

| Thema | Kurz |
|-------|------|
| **Inhaltsabdeckung** | Bei Ordnern mit mehreren Themen kann Top-K nicht alles abdecken (Eval: 67 % gesamt, 100 % bei Ein-Thema-Ordner). Details: [docs/release/notes.md](release/notes.md), [SPEC.md §8](../SPEC.md#8-akzeptanzkriterien-und-evaluation) |
| **Bias / Quelltreue** | Summary nicht garantiert neutral; Modell kann Quellfehler «korrigieren» | 
| **Ethik & Sicherheit** | IP, EU AI Act, Prompt-Injection: [docs/ethik.md](ethik.md) |

---

## Weitere Hilfe

| Thema | Link |
|-------|------|
| Ollama-Setup | [docs/ollama/README.md](ollama/README.md) |
| Architektur (technisch) | [docs/architecture.md](architecture.md) |
| Produktspezifikation | [SPEC.md](../SPEC.md) |
