# RAG — Vektorindex und Retrieval

**Retrieval-Augmented Generation:** Statt alle Notizen in den Prompt zu kopieren, werden Texte in **Chunks** zerlegt, als **Vektoren** gespeichert und bei Bedarf die **semantisch passendsten Abschnitte** geladen.

Architektur: [docs/architecture.md](../architecture.md). Spezifikation: [SPEC.md §4](../../SPEC.md#4-architektur).

---

## Konzept

| Begriff | Bedeutung im Plugin |
|---------|---------------------|
| **Chunk** | Abschnitt aus einer Markdown-Datei (Grösse/Overlap einstellbar) |
| **Embedding** | Vektorrepräsentation eines Chunks via Ollama `nomic-embed-text` |
| **Vektorindex** | SQLite-Datenbank (`vectors.db`) im Plugin-Datenverzeichnis |
| **Retrieval** | Suchanfrage als Vektor berechnen → ähnlichste Top-K-Chunks → Kontext für das LLM |

---

## Wann wird indexiert?

| Priorität | Auslöser | Zweck |
|-----------|----------|-------|
| Hoch | Vault-Datei geändert/neu | Index aktuell halten |
| Mittel | Create Summary | Sicherstellen, dass der Ordner vollständig indexiert ist |
| Niedrig | Idle nach Start | Nachziehen ohne UI zu blockieren |

Details: [docs/architecture.md § Index-Policy](../architecture.md#index-policy-rag).

---

## Retrieval-Ablauf (bei Create Summary)

1. Aus den **Inhalten der Quellnotizen** eine **Suchanfrage** bilden (gekürzt auf eine Obergrenze).
2. Für die Suchanfrage einen Vektor berechnen (dasselbe Embedding-Modell wie beim Index).
3. **Top-K** ähnlichste Chunks aus dem Index laden (K einstellbar).
4. Chunks zu einem **Kontextstring** zusammenfügen — begrenzt durch **Kontextlimit**.

Landet der Kontext über dem Limit, bricht der Lauf mit Notice ab (kein stilles Kürzen).

---

## Abgrenzung

- **Nicht im Vault:** Index-DB gehört zum Plugin, nicht zu den Notizen.
- **Keine Summary als Quelle:** Eigene Ausgabedateien werden weder indexiert noch gelesen — [sources.md](./sources.md).
- **Ollama Embeddings:** [docs/ollama/README.md](../ollama/README.md).

---

## Siehe auch

- [summary.md](./summary.md) — wie RAG in den Gesamtlauf eingebunden ist
- [docs/ethik.md](../ethik.md) — Inhaltstreue, Limitationen
