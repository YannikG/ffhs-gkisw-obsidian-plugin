# Obsidian Summarizer — Domänensprache

Kurz: Glossar für Agenten (Grill-with-docs). **Nicht** in Phase-READMEs oder `issues/*.md` verlinken; Menschen und Issues: [SPEC.md](SPEC.md), `docs/roadmap/**/issues/*.md`. Einstieg: [docs/agents-docs/domaenensprache.md](docs/agents-docs/domaenensprache.md).

## Language

**Summary** (Ausgabe):
Die erzeugte Markdown-Zusammenfassung im Vault, Dateiname nach US-03 (`{Ordnername}_summary.md` oder versioniert `_summary_2`, …).
_Avoid_: Report, abstract (ohne Klärung)

**Summary-Basisdatei**:
Die erste Ausgabe pro Ordner: `{Ordnername}_summary.md`. Wird beim ersten erfolgreichen Lauf erzeugt und danach **nicht** überschrieben.
_Avoid_: «die Summary» ohne Version, wenn `_summary_2` gemeint ist

**Summary-Version**:
Nummerierte Ausgabe `{Ordnername}_summary_2.md`, `_summary_3`, … bei erneutem **Create Summary**, solange die **Summary-Basisdatei** bereits existiert.
_Avoid_: Revision, Kopie (ohne Klärung)

**Summary-Schreibmodus** (Phase 5, ohne Einstellungs-UI):
Hybrid — erster Lauf → **Summary-Basisdatei**; jeder weitere Lauf → nächste freie **Summary-Version** (`nextSummaryOutputVersion`). Kein Überschreiben der Basisdatei, kein Bestätigungsdialog in Phase 5. Erfolgs-Notice nennt den erzeugten Dateinamen.
_Avoid_: Überschreiben als Standard in Phase 5, generische Erfolgs-Notice ohne Dateiname

**Summary-Überschreiben** (Phase 8, optional):
Zusätzliche Einstellung: bestehende **Summary-Basisdatei** darf überschrieben werden (abweichend vom hybrid-Default). Kein voller Modus-Umschalter im MVP.
_Avoid_: drei Modi in der UI ohne Bedarf

**Ordner** (Kontext):
Der per Kontextmenü gewählte Vault-Ordner; Quellumfang = alle `.md` darunter rekursiv (US-01).
_Avoid_: Verzeichnis, path (im UI-Text)

**Vault**:
Die Obsidian-Notizensammlung des Nutzers; das Plugin liest und schreibt nur über freigegebene Obsidian-Pfade.
_Avoid_: Repository, Projektordner

**Ordner-Quellkorpus** (Phase 5, ohne RAG):
Der für einen Lauf zusammengeführte Text aller eingeschlossenen Quell-`.md` unter dem **Ordner**, noch ohne Retrieval-Chunks. Reihenfolge der Dateien: Vault-Pfad alphabetisch aufsteigend (reproduzierbar).
_Avoid_: RAG, Index, Embedding (gelten erst ab späteren Phasen)

**Kontextlimit** (Phase 5 und 7):
Obergrenze (Zeichen) für den Kontext vor dem Ollama-Chat: Phase 5 = **Ordner-Quellkorpus**; Phase 7 = Summe der Retrieval-Chunks. Überschreitung → Abbruch mit Notice. Wert ist **einstellbar** (Plugin-Einstellungen, UI ab Phase 5); Default 32'000 Zeichen für `gemma4:e2b` und `gemma4:e4b` (gleicher Startwert, Nutzer kann anpassen).

**Ollama-Timeout**:
Maximale Wartezeit für einen Chat-Aufruf; einstellbar, Default z. B. 90 Sekunden. Überschreitung → Notice + Abbruch des Laufs.
_Avoid_: unbegrenztes Warten, Timeout nur im Code ohne Einstellung

**Leerer Quellordner** (keine Quellen):
Nach Einlesen existiert kein eingeschlossenes Quell-`.md` unter dem **Ordner** (leer, nur ausgeschlossene Dateien, nur Nicht-Markdown). → Abbruch mit Notice, keine Summary-Datei.
_Avoid_: leere Summary erzeugen, stilles No-Op

**Chunk** (Phase 6+):
Kleiner Textabschnitt aus einer Quell-`.md` für Embedding und Retrieval. **Chunk-Grösse** und **Overlap** sind in den Plugin-Einstellungen einstellbar (ab Phase 6); Defaults: 1000 Zeichen, Overlap 200.
_Avoid_: ganze Datei als ein Chunk (ohne Klärung)

**Vektorindex** (Phase 6+):
Lokale SQLite-Datenbank (`vectors.db` im Plugin-Datenverzeichnis) mit Embeddings pro **Chunk** aus Quell-`.md`.
_Avoid_: Index (ohne Klärung), Datenbank allein

**Embedding-Modell-Wechsel**:
Änderung des Embedding-Modells in den Einstellungen → Notice + vollständiger Re-Index (`vectors.db` neu). Alter Index wird nicht weiterverwendet.
_Avoid_: gemischte Embeddings im selben Index, stiller Re-Index

**Index zurücksetzen** (UI):
In den Einstellungen (ab Phase 6): Aktion «Vektorindex zurücksetzen / neu aufbauen» für Troubleshooting; löst vollständigen Re-Index aus.
_Avoid_: nur verstecktes Löschen von `vectors.db` ohne UI

**Generierungsmodell-Wechsel**:
Wechsel `gemma4:e2b` ↔ `gemma4:e4b` erfordert **keinen** Re-Index; wirkt ab dem nächsten **Summary-Lauf**.
_Avoid_: Re-Index bei reinem Generierungsmodell-Wechsel

**Index-Policy** (Phase 6, Hybrid):
Kein blockierender Voll-Scan beim Obsidian-Start. Ein leichter **Hintergrund-Job** (Idle) und Vault-**Events** pflegen den **Vektorindex** vault-weit schrittweise. **Retrieval** und «Create Summary» lesen nur Chunks aus dem gewählten **Ordner**-Scope. Ist der Scope noch nicht indexiert → On-Demand-Nachindex für diesen Baum vor dem Retrieve.

**Index-Fortschritt** (UI):
On-Demand-Index für den **Ordner**-Scope: Notice «Indexiere…», Lauf wartet bis fertig. Idle-Hintergrund-Job vault-weit: keine dauernde UI.
_Avoid_: blockierender Startup-Scan, Hintergrund-Job mit ständiger Fortschrittsanzeige

**Retrieval Top-K** (Phase 7):
Maximale Anzahl Chunks, die ins Prompt dürfen (vor Prüfung des **Kontextlimits**). Einstellbar in den Plugin-Einstellungen; sinnvoller Default z. B. 8.
_Avoid_: «alle Treffer», feste K ohne Einstellung

**Summary-Lauf** (Orchestrierung):
Ein aktiver Create-Summary-Lauf zur Zeit; zweiter Klick → Notice «Läuft bereits» oder wird ignoriert.
_Avoid_: parallele Ollama-Aufrufe ohne Absicherung, stille Doppel-Läufe

**Leeres Retrieval** (Phase 7):
Vor dem LLM-Aufruf: On-Demand-Index für den **Ordner**-Scope, falls nötig. Bleiben 0 Treffer → Abbruch mit Notice, keine Summary. Kein Fallback auf **Ordner-Quellkorpus**.
_Avoid_: stilles Weiter mit leerem Prompt, automatischer Volltext-Fallback

## Relationships

- Ein **Ordner**-Kontext liefert Quell-`.md`-Dateien (rekursiv) für genau eine **Summary**-Erzeugung pro Lauf.
- **Summary** liegt im selben **Ordner** wie die Kontextaktion.
- Existiert noch keine **Summary-Basisdatei** → Lauf erzeugt sie; existiert sie → Lauf erzeugt die nächste **Summary-Version**.
- In Phase 5 wird der **Ordner-Quellkorpus** vollständig (innerhalb des **Kontextlimits**) an Ollama übergeben; ab Phase 7 ersetzt Retrieval den vollen Korpus durch relevante Chunks aus dem **Ordner**-Scope im **Vektorindex**.
- Der **Vektorindex** wird vault-weit gepflegt; gelesen wird für die Summary vor allem aus dem aktuellen **Ordner**-Scope.

## Example dialogue

> **Dev:** «Ordner hat zu viel Markdown für das Modell — was tun?»
> **Fachexpertin:** «**Kontextlimit** überschritten: Abbruch mit Notice, kein RAG-Workaround in Phase 5. Später RAG.»

> **Dev:** «Zweiter Klick auf **Create Summary** — überschreiben?»
> **Fachexpertin:** «Nein: **Summary-Schreibmodus** hybrid — Basisdatei bleibt, neue **Summary-Version**.»

## Flagged ambiguities

- «Zusammenfassung» vs **Summary** — resolved: **Summary** = Datei/Artefakt; «Zusammenfassung» = Prozess oder UI-Label ok.
- «Kontext» vs **Ordner-Quellkorpus** — resolved: In Phase 5 explizit **Ordner-Quellkorpus**; «Kontext» allein zu ungenau.
- SPEC US-03 «Standard: überschreiben» vs **Summary-Schreibmodus** hybrid — resolved für Implementierung Phase 5: hybrid; SPEC später per Team-Workflow angleichen, nicht stillschweigend im Code widersprechen.
