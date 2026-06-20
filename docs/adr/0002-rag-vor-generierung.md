# RAG vor LLM-Generierung

**Status:** accepted

Bei grossen Ordnern passt der gesamte Markdown-Inhalt nicht in den Kontext des Generierungsmodells. Alternative: ganzen Ordner in den Prompt packen (einfach, skaliert schlecht) gegenüber **Retrieval-Augmented Generation** (Chunking, Embeddings, semantische Suche, Top-K in den Prompt).

**Entscheid:** RAG-Pipeline mit lokalem Vektorindex (`vectors.db` im Plugin-Datenverzeichnis, nicht im Vault), Embeddings via `nomic-embed-text`, Generierung via `gemma4:e2b`.

**Begründung:** Fokussierter Prompt, bessere Skalierung, Trennung Plugin (Orchestrierung, Persistenz) vs. LLM (nur Summary-Text). Index-Policy: Vault-Events, on-demand vor Summary, Idle-Hintergrund ([docs/architecture.md](../architecture.md)).

**Konsequenz:** Mixed-Topic-Ordner können unter Top-K liegen — dokumentierte Evaluations-Limitation (SPEC §8).

Quelle: Architektur Initial-Spec und [docs/modules/rag.md](../modules/rag.md).
