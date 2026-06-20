# Lokale Architektur statt Cloud-LLM

**Status:** accepted

Obsidian-Vaults enthalten oft persönliche oder vertrauliche Notizen. Für den GKISW-Prototyp wurde zwischen **lokaler Verarbeitung (Ollama + RAG auf dem Gerät)** und **Cloud-LLM (Vault-Inhalte an externe APIs)** gewählt.

**Entscheid:** Vollständig lokale Pipeline — Plugin steuert Workflow, Vektorindex und LLM-Aufruf auf `127.0.0.1`; keine Übertragung von Vault-Inhalten an Cloud-Dienste.

**Begründung:** Datenschutz und Datenhoheit, keine laufenden API-Kosten, Unabhängigkeit von Anbieter-Verfügbarkeit; passt zum Obsidian-Markdown-lokal-Konzept. Cloud-Variante technisch möglich, widerspricht aber PRD-NF01/NF02 und MVP-Scope (SPEC §1).

**Konsequenz:** Hardware- und Modellqualität beim Nutzer; Ollama-Setup Pflicht — dokumentiert in [docs/benutzer.md](../benutzer.md).

Quelle: Initial-Spec Gruppenarbeit `Projekt_Summarizer.pdf` §1. Umsetzung: [SPEC.md](../../SPEC.md) §1, §7.
