# Ethik, Governance und Sicherheit

Stand: Juni 2026 · Projekt: Obsidian Summarizer (GKISW). Produktspezifikation: [SPEC.md](../SPEC.md). Architektur: [docs/architecture.md](architecture.md).

Dieses Dokument fasst die Ethik-Stellen, die Einordnung gemäss EU AI Act und die bekannten Schwachstellen des MVP zusammen. Quellen: Gruppenarbeit GKISW (`Ethik-Stellen im MVP.pdf`, `Governance und EU AI Act.odt`, `Schwachstellen.odt`).

---

## Geistiges Eigentum (IP)

**Drittanbieter:** npm-Pakete (`package.json`) und Ollama-Modelle (`gemma4:e2b`, `nomic-embed-text`) stammen von Drittanbietern. Lizenzen vor Nutzung prüfen.

**KI-generierter Code:** Teile des Codes wurden mit Cursor, Gemini oder Claude Code erzeugt. Herkunft des generierten Codes und zugrunde liegende Trainingsdaten sind für das Team nicht vollständig nachvollziehbar.

**Massnahmen:** Repository unter MIT-Lizenz; npm- und Modell-Lizenzen prüfen; KI-generierten Code im Team reviewen; nur committen, was verstanden und verantwortet werden kann.

---

## Bias und Inhaltstreue

**Risiko:** Das Modell kann Stereotype oder einseitige Darstellungen bei Personen und Gruppen erzeugen. Die Summary ist weder garantiert neutral noch vollständig.

**Quelltreue:** Laut Evaluation (SPEC §8, [docs/evaluation/results/](evaluation/results/)) hält sich die Ausgabe meist an die Markdown-Quellen; in Einzelfällen fliesst Modellwissen ein (Evaluationskorpus: eingebaute Fehler in Quellen nicht immer in der Summary).

**Empfehlung:** Bei sensiblen Themen die Summary manuell gegen die Quellen prüfen.

---

## Transparenz

**Technische Transparenz:** Ollama muss separat installiert und konfiguriert werden; die Plugin-Einstellungen machen den lokalen Betrieb sichtbar (Base URL, Modelle, «Verbindung testen»).

**Ausgabe:** Die erzeugte `{Ordnername}_summary.md` sieht aus wie eine normale Notiz, ohne automatischen Hinweis auf KI-Generierung.

**Abgrenzung:** Gemäss EU-AI-Act-Einordnung (siehe unten) entfällt für dieses MVP keine gesetzliche Kennzeichnungspflicht bei rein lokalem Betrieb. **Produktransparenz** bleibt dennoch sinnvoll: optional am Anfang der Summary vermerken, dass der Text automatisch erzeugt wurde (derzeit nicht im Plugin implementiert; Empfehlung für manuelle Nachbearbeitung oder spätere Erweiterung).

---

## Governance und EU AI Act

**Risikoklasse:** «Minimales Risiko» — Begründung:

| Kriterium | Bewertung |
|-----------|-----------|
| Datenverarbeitung | Lokal auf dem Gerät; LLM und Vektorindex ohne externe Dienste |
| Entscheidungswirkung | Keine automatisierten Entscheidungen mit Konsequenzen (keine Ablehnung, Priorisierung, Eskalation) |
| Grundrechtseingriff | Keine regulierte Berührung von Grundrechten im Sinne des Acts |
| Nutzerinteraktion | Vault-Inhalte werden lokal eingegeben und lokal verarbeitet |

**Folgen für das MVP:** Keine spezifischen Pflichten aus dem EU AI Act (keine Konformitätsbewertung, kein Risikomanagement-System, keine gesetzliche KI-Kennzeichnung bei rein lokalem Gebrauch).

**Praktischer Ansatz:** Lokale Ausführung, volle Datenhoheit, keine Cloud-APIs für Vault-Inhalte (SPEC §1 Out-of-Scope).

**Bei Erweiterungen** (Cloud-LLM, automatisierte Entscheidungen mit Wirkung, Mehrbenutzer-Betrieb): Risikoklasse neu bewerten; Mini-Checkliste Kontext, Entscheidungswirkung, Datenrisiken, Transparenz, Autonomie, Fehlermodi anwenden.

---

## Schwachstellen und Angriffsvektoren

### Prompt-Injection (lokal)

**Theorie:** In Markdown-Quellen können Anweisungen stehen, die das lokale LLM beeinflussen (Prompt Injection).

**Gegenargumentation MVP:** Das LLM läuft lokal beim Benutzer; kein Zugriff auf externe Ressourcen oder Team-Infrastruktur. Schaden beschränkt sich auf den eigenen Vault und die eigene Maschine.

Referenz: [arxiv.org/html/2511.15759v1](https://arxiv.org/html/2511.15759v1)

### Weitere Risiken

Ausser Prompt-Injection wurden keine weiteren sicherheitsrelevanten Angriffsvektoren identifiziert: das System läuft offline lokal, ohne Verbindung zu Projekt-Servern und ohne Kommunikation zwischen Benutzer:innen.

**Datenschutz:** Vault-Inhalte verlassen das Gerät nicht (SPEC §7 PRD-NF01/NF02). Siehe auch [SPEC.md §7](../SPEC.md#7-prompting-ziele-kein-fixer-text) und Datenschutz in SPEC §1.

---

## Risikoanalyse (Kurz)

Aus Initial-Spec `Projekt_Summarizer.pdf` §6 — MVP läuft lokal; keine ausführliche Enterprise-Risikoanalyse.

| Risiko | Eintritt | Massnahme / Einschätzung |
|--------|----------|---------------------------|
| Gewählter Stack funktioniert nicht | sehr unwahrscheinlich | Planung und Spec vor Implementierung |
| Obsidian hebt Plugin-Unterstützung auf | sehr unwahrscheinlich | — |
| Ollama nicht mehr verfügbar | sehr unwahrscheinlich | — |
| Gewählte Modelle nicht verfügbar | sehr unwahrscheinlich | Alternative Tags bei Eintritt evaluieren |
| Komplettausfall Projektteam | sehr unwahrscheinlich | — |

Gesamteinschätzung MVP-Gelingen: **sehr gering** (Initial-Spec). Technische Restrisiken (Inhaltsabdeckung, Bias): [docs/release/notes.md](release/notes.md), SPEC §8.

---

## Verweise

- Evaluation und Metriken: [SPEC.md §8](../SPEC.md#8-akzeptanzkriterien-und-evaluation), [docs/release/notes.md](release/notes.md)
- Architektur und Datenfluss: [docs/architecture.md](architecture.md)
- Installation und Nutzung: [docs/benutzer.md](benutzer.md)
