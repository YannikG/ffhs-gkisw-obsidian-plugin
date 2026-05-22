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
Der für einen Lauf zusammengeführte Text aller eingeschlossenen Quell-`.md` unter dem **Ordner**, noch ohne Retrieval-Chunks. Reihenfolge der Dateien: Vault-Pfad alphabetisch aufsteigend (reproduzierbar). Format im Prompt (P5-I04): pro Datei `### ` + vault-relativer Pfad in Backticks, Inhalt, Trennung `---` zwischen Dateien (API `sourceContext`).
_Avoid_: RAG, Index, Embedding (gelten erst ab späteren Phasen); blosser Inhalts-Concat ohne Pfad

**Summary-System-Prompt** (Phase 5):
Meta-Instruktionen an das Modell auf **Englisch** (Rollen, Markdown/Obsidian-Regeln, Quelltreue, Ausgabesprache-Regel). Die **Summary**-Ausgabe folgt **Summary-Ausgabesprache**, nicht zwingend Englisch.
_Avoid_: deutsche System-Prompts in Phase 5 ohne Team-Entscheid; Englische Summary erzwingen wenn Quellen deutsch sind

**Summary-User-Prompt** (Phase 5):
User-Message mit englischen Abschnitts-Labels (z. B. `## Folder`, `## Source corpus`), eingebettet `folderLabel` und `sourceContext` (**Ordner-Quellkorpus** unverändert aus P5-I04).
_Avoid_: deutsche Rahmenlabels wenn System-Prompt Englisch; Korpus im Prompt umformatieren (bleibt P5-I04)

**Summary-Quelltreue** (Phase 5, Prompt, Eval-Vorbereitung):
Faktische Aussagen aus dem **Ordner-Quellkorpus** nicht korrigieren oder weglassen, auch wenn sie falsch oder widersprüchlich wirken (SPEC §7, eingebaute Fehler für Evaluation). Plausibilität geht nachrangig.
_Avoid_: «Fact-checking» oder stilles Entfernen von Fehlern in der Summary

**Summary-Link-Policy** (Phase 5, Prompt):
Nur Obsidian-**Wikilinks** zwischen **bestehenden** Quell-`.md` im **Ordner-Quellkorpus** ([Obsidian: Notizen verlinken](https://obsidian.md/de/help/link-notes)). Bestehende `[[…]]` aus Quellen beibehalten wenn relevant. **Keine** erfundenen Wikilinks, **keine** externen URLs, die nicht wörtlich in den Quellen stehen.
_Avoid_: neue `[[Notiz]]` ausserhalb des Laufs; erfundene `https://`-Links

**Summary-Länge und -Ton** (Phase 5, Prompt, US-02):
Qualitativ **concise** und **key points** (Aufzählungen wo sinnvoll); kein festes Wortlimit in Phase 5. Nicht den ganzen **Ordner-Quellkorpus** paraphrasieren oder grossflächig zitieren. Obergrenze indirekt über **Kontextlimit** und Modell.
_Avoid_: festes Wortlimit oder Prozent-Ratio im MVP-Prompt; Summary so lang wie Quellen

**Summary-Body-Struktur** (Phase 5, Prompt):
Keine Pflicht-H1 im generierten Markdown; der sichtbare Titel kommt vom Obsidian-Dateinamen (**Summary**-Datei). Body: Absätze und Aufzählungen nach Inhalt. Optionales YAML-Frontmatter erlaubt, nicht Pflicht in Phase 5.
_Avoid_: `# Zusammenfassung: …` als feste erste Zeile (doppelt zum Dateinamen); Frontmatter als MVP-Pflicht

**Summary-Ausgabesprache** (Phase 5, Prompt):
Sprache der erzeugten **Summary** folgt der dominanten Sprache im **Ordner-Quellkorpus**; bei Deutsch → Schweizer Hochdeutsch (ss, Umlaute, kein scharfes S). Rein englische Quellen → Englisch. Gemischt: Deutsch wenn klar dominant, sonst Englisch.
_Avoid_: immer Deutsch erzwingen bei englischen Quellen; mehrsprachige Summary pro Abschnitt ohne MVP-Bedarf

**Ordner-Label** (API `folderLabel`, Phase 5):
Sanitisierter Ordner-Basename, identisch dem Token in Summary-Dateinamen vor `_summary` (via `sanitizeFolderBasename`). Orchestrator (P5-I06) übergibt denselben Wert an `buildSummaryMessages` und `buildSummaryOutputFilename`.
_Avoid_: Rohsegment mit Leerzeichen im Prompt, wenn der Dateiname `Test_Vault` lautet; «Label» ohne Klärung als voller Vault-Pfad

**Kontextlimit** (Phase 5 und 7):
Obergrenze (Zeichen) für den Kontext vor dem Ollama-Chat: Phase 5 = **Ordner-Quellkorpus**; Phase 7 = Summe der Retrieval-Chunks. Überschreitung → Abbruch mit Notice. Wert ist **einstellbar** (Plugin-Einstellungen, UI ab Phase 5); Default 32'000 Zeichen für `gemma4:e2b` und `gemma4:e4b` (gleicher Startwert, Nutzer kann anpassen).

**Ollama-Timeout**:
Maximale Wartezeit für einen Chat-Aufruf; einstellbar, Default z. B. 90 Sekunden. Überschreitung → Notice + Abbruch des Laufs.
_Avoid_: unbegrenztes Warten, Timeout nur im Code ohne Einstellung

**Leerer Quellordner** (keine Quellen):
Nach Einlesen existiert kein eingeschlossenes Quell-`.md` unter dem **Ordner** (leer, nur ausgeschlossene Dateien, nur Nicht-Markdown). → Abbruch mit Notice, keine Summary-Datei.
_Avoid_: leere Summary erzeugen, stilles No-Op

**Chunk** (Phase 6+):
Kleiner Textabschnitt aus einer Quell-`.md` für Embedding und Retrieval. Entsteht durch **Absatz-Chunking** (nicht ganze Datei als ein Chunk). **Chunk-Grösse** und **Chunk-Overlap** sind in den Plugin-Einstellungen einstellbar (ab Phase 6); Defaults: 1000 Zeichen, Overlap 200.
_Avoid_: ganze Datei als ein Chunk (ohne Klärung)

**Absatz-Chunking** (Phase 6):
Zerlegung von Quell-Markdown in **Chunks** an Absatzgrenzen (`\n\n`) und Überschriften (`#` … `######`); Blöcke werden bis zur **Chunk-Grösse** zusammengeführt.
_Avoid_: reines Zeichen-Fenster ohne Absatzgrenzen

**Chunk-Overlap** (Phase 6):
Zwischen aufeinanderfolgenden **Chunks** derselben Datei: am Anfang von Chunk N+1 werden die letzten vollständigen Absatz-Blöcke von Chunk N wiederholt, bis die Summe der Zeichen ≤ **Chunk-Overlap** (Default 200); kein Schnitt mitten im Absatz.
_Avoid_: rohe Zeichen-Overlap ohne Blockgrenzen

**Vektorindex** (Phase 6+):
Lokale SQLite-Datenbank (`vectors.db` im Plugin-Datenverzeichnis) mit Embeddings pro **Chunk** aus Quell-`.md`.
_Avoid_: Index (ohne Klärung), Datenbank allein

**Embedding-Modell-Wechsel**:
Änderung des Embedding-Modells in den Einstellungen → Notice + vollständiger Re-Index: alle Index-Tabellen in derselben `vectors.db` leeren (**truncate**), Schema bleibt, danach vault-weiter Neuaufbau. Alter Vektorinhalt wird nicht weiterverwendet.
_Avoid_: gemischte Embeddings im selben Index, stiller Re-Index, zweite DB-Datei pro Modell

**Index zurücksetzen** (UI):
In den Einstellungen (ab Phase 6): Aktion «Vektorindex zurücksetzen / neu aufbauen» für Troubleshooting; gleicher Mechanismus wie beim **Embedding-Modell-Wechsel** (truncate + Re-Index).
_Avoid_: nur verstecktes Löschen von `vectors.db` ohne UI

**Generierungsmodell-Wechsel**:
Wechsel `gemma4:e2b` ↔ `gemma4:e4b` erfordert **keinen** Re-Index; wirkt ab dem nächsten **Summary-Lauf**.
_Avoid_: Re-Index bei reinem Generierungsmodell-Wechsel

**Index-Policy** (Phase 6, Hybrid):
Kein blockierender Voll-Scan beim Obsidian-Start. Ein leichter **Hintergrund-Job** (Idle) und Vault-**Events** pflegen den **Vektorindex** vault-weit schrittweise. **Retrieval** und «Create Summary» lesen nur Chunks aus dem gewählten **Ordner**-Scope. Ist der Scope noch nicht indexiert → On-Demand-Nachindex für diesen Baum vor dem Retrieve.

**Index-Fortschritt** (UI):
On-Demand-Index für den **Ordner**-Scope: öffentliche Plugin-Fassade zeigt Notice «Indexiere…», Lauf wartet bis fertig (reine Index-Logik ohne Notice: separates Modul/Issue). Idle-Hintergrund-Job vault-weit: maximal **3 Dateien** pro Idle-Tick, keine dauernde UI.
_Avoid_: blockierender Startup-Scan, Hintergrund-Job mit ständiger Fortschrittsanzeige

**Retrieval-Query** (Phase 7):
Text für das Query-Embedding vor semantischem Top-K: **roher Concat** der eingeschlossenen Quell-`.md` im **Ordner** (Leerzeile zwischen Dateien), nicht das Chat-Prompt-Format. Obergrenze **8'000 Zeichen** (Dateien alphabetisch anhängen bis Cap). Daraus ein Embedding → Similarity im **Ordner**-Scope.
_Avoid_: gleiches `###`-Format wie **Retrieval-Kontext**; Vollkorpus im Chat als Query

**Retrieval-Kontext** (Phase 7):
Die Top-K-Chunks formatiert für `buildSummaryMessages` (`sourceContext`): pro Chunk `### \`vault_path\`` (optional Chunk-Index), Text, `---` — analog **Ordner-Quellkorpus**, Inhalt aus dem **Vektorindex**, nicht Volltext aller Quellen.
_Avoid_: **Ordner-Quellkorpus** und **Retrieval-Kontext** verwechseln

**Retrieval Top-K** (Phase 7):
Maximale Anzahl Chunks, die ins Prompt dürfen (vor Prüfung des **Kontextlimits**). Einstellbar in den Plugin-Einstellungen (UI ab P7-I03); Default **8**. Liefert **min(K, verfügbar)** Treffer im Ordner-Scope.
_Avoid_: «alle Treffer», feste K ohne Einstellung, Fehler wenn weniger als K Chunks existieren

**Summary-Lauf** (Orchestrierung):
Ein aktiver Create-Summary-Lauf zur Zeit; zweiter Klick → Notice «Läuft bereits» oder wird ignoriert.
_Avoid_: parallele Ollama-Aufrufe ohne Absicherung, stille Doppel-Läufe

**Leeres Retrieval** (Phase 7):
Nach On-Demand-Index: **0 Chunks** im Ordner-Scope → Abbruch mit Notice «Keine indexierten Inhalte für die Zusammenfassung.», keine Summary. Kein Fallback auf **Ordner-Quellkorpus**.
_Avoid_: stilles Weiter mit leerem Prompt, automatischer Volltext-Fallback

**Keine Quellen im Ordner** (Phase 7, vor Index):
Kein eingeschlossenes Quell-`.md` für die Retrieval-Query → Notice «Keine Quellen in diesem Ordner.», vor On-Demand/Embed. Unterscheidet sich von **Leeres Retrieval**.
_Avoid_: eine Notice für beide Fälle

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
- SPEC US-03 «Standard: überschreiben» vs **Summary-Schreibmodus** hybrid — resolved: [SPEC.md](SPEC.md) US-03 beschreibt hybrid als MVP-Standard; optionales Überschreiben nur per Einstellung (Phase 8).
