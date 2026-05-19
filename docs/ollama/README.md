# Ollama-Modelle (Entwicklung)

Kanonische Modell-Tags für dieses Projekt: [SPEC.md](../../SPEC.md) §4.1 und §6.

## Voraussetzungen

- [Ollama](https://ollama.com/download) installiert (Desktop-App oder CLI).
- Dienst läuft (App geöffnet oder `ollama serve`); Default-URL: `http://127.0.0.1:11434`.

## Modelle laden

Aus dem Repository-Root oder einem beliebigen Verzeichnis:

```bash
ollama pull gemma4:e2b
ollama pull nomic-embed-text
```

Optional (höhere Qualität, mehr RAM):

```bash
ollama pull gemma4:e4b
```

Die Tags `gemma4:e2b` und `gemma4:e4b` sind in der [öffentlichen Ollama Library](https://ollama.com/library/gemma4/tags) verfügbar. Bei Fehlschlag von `ollama pull gemma4:e2b`: Ollama-Version aktualisieren und erneut versuchen. Alternativ den längeren Library-Tag pullen (z. B. `gemma4:e2b-it-q4_K_M`, gleiches Modell laut Library) und in den Plugin-Einstellungen eintragen.

## Verifikation

```bash
ollama list
```

Erwartung mindestens: `gemma4:e2b`, `nomic-embed-text` (optional `gemma4:e4b`).

HTTP-Smoke (Erreichbarkeit der API):

```bash
curl -s http://127.0.0.1:11434/api/tags
```

Erwartung: HTTP 200 und JSON mit den geladenen Modellen.

## Referenz-Umgebung exportieren

Für Abgleich auf einer Maschine, die die Tags bereits hat:

```bash
ollama show gemma4:e2b --modelfile
ollama show gemma4:e4b --modelfile
```

Hinweis: Exporte enthalten oft lokale Blob-Pfade (`FROM /Users/.../.ollama/...`); diese sind **nicht** portabel. Für die Entwicklung reicht `ollama pull` mit den SPEC-Tags.

## Plugin-Defaults

Nach dem Laden der Modelle passen die Plugin-Einstellungs-Defaults zu [SPEC.md](../../SPEC.md) §6: Base URL `http://127.0.0.1:11434`, Generierung `gemma4:e2b`, Embeddings `nomic-embed-text`.
