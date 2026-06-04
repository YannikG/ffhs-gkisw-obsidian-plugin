# Evaluationskorpus — P11-I01

Drei künstliche Markdown-Quelldateien für die manuelle Evaluation gemäss [SPEC.md §8](../../../SPEC.md#8-akzeptanzkriterien-und-evaluation).

Jede Datei enthält **eingebaute Fehler** (falsche Fakten, mit `[FEHLER]` markiert) und **Schlüsselpunkte** für die 80-%-Abdeckungsprüfung.

---

## eval-01.md — Maschinelles Lernen

### Eingebaute Fehler

| # | Fehler in Datei | Korrekte Aussage |
|---|-----------------|------------------|
| F1 | AlexNet gewann ImageNet-Wettbewerb 2010 | AlexNet gewann 2012 |
| F2 | Random Forest wurde von Yann LeCun entwickelt | Entwickelt von Leo Breiman (2001) |
| F3 | LSTM-Netzwerke wurden 1998 eingeführt | Eingeführt 1997 (Hochreiter & Schmidhuber) |

### Schlüsselpunkte (80-%-Checkliste)

- [ ] Unterschied Supervised / Unsupervised / Reinforcement Learning
- [ ] Overfitting-Definition und Gegenmassnahmen (Regularisierung, Dropout)
- [ ] Rolle des Validierungssets (getrennt vom Testset)
- [ ] Gradientenabstieg und Lernrate
- [ ] Aufbau neuronaler Netze (Schichten, Aktivierungsfunktionen)

---

## eval-02.md — Relationale Datenbanken

### Eingebaute Fehler

| # | Fehler in Datei | Korrekte Aussage |
|---|-----------------|------------------|
| F1 | SQL von Oracle in frühen 1970er-Jahren eingeführt | SQL von IBM entwickelt (nicht Oracle); Codd's Modell 1970 |
| F2 | PRIMARY KEY erlaubt NULL-Werte | PRIMARY KEY verbietet NULL-Werte |
| F3 | INNER JOIN gibt alle Zeilen beider Tabellen zurück | INNER JOIN gibt nur übereinstimmende Zeilen zurück |

### Schlüsselpunkte (80-%-Checkliste)

- [ ] ACID-Eigenschaften (alle vier: Atomarität, Konsistenz, Isolation, Dauerhaftigkeit)
- [ ] Normalisierung 1NF / 2NF / 3NF
- [ ] PRIMARY KEY und FOREIGN KEY (referenzielle Integrität)
- [ ] JOIN-Typen (INNER, LEFT OUTER, FULL OUTER)
- [ ] Indexierung: Zweck, B-Baum, Trade-off Lese- vs. Schreibperformance

---

## eval-03.md — Netzwerkprotokolle

### Eingebaute Fehler

| # | Fehler in Datei | Korrekte Aussage |
|---|-----------------|------------------|
| F1 | HTTP verwendet standardmässig Port 8080 | HTTP verwendet Port 80 |
| F2 | UDP garantiert Paketzustellung und Reihenfolge | UDP ist verbindungslos, ohne Zustell- oder Reihenfolgegarantie |
| F3 | IPv6-Adressen sind 64 Bit lang | IPv6-Adressen sind 128 Bit lang |

### Schlüsselpunkte (80-%-Checkliste)

- [ ] OSI-Modell: sieben Schichten und Beispielprotokolle
- [ ] TCP vs. UDP: Verbindungsorientierung, Zuverlässigkeit, Anwendungsfälle
- [ ] DNS-Auflösungsprozess (hierarchisch, Cache, TTL)
- [ ] TLS/HTTPS: Verschlüsselung, Port 443, Zertifikate
- [ ] IPv4 vs. IPv6 (Adresslänge, Notation, CIDR)

---

## Anleitung: Korpus im Test-Vault verwenden

1. Einen Ordner im Test-Vault anlegen, z. B. `evaluation`.
2. Die drei Dateien `eval-01.md`, `eval-02.md`, `eval-03.md` in diesen Ordner kopieren (keine Summary-Dateien hinzufügen — Quellenfilter greift bei `*_summary*.md`).
3. Ollama starten; `gemma4:e2b` und `nomic-embed-text` verfügbar (Einstellungen → «Verbindung testen»).
4. Rechtsklick auf den Ordner `evaluation` → **Create Summary**.
5. Erfolgs-Notice abwarten; `evaluation_summary.md` öffnen.
6. Schlüsselpunkt-Checklisten oben abhaken (Ziel: ≥ 80 % pro Datei).
7. Prüfen, ob eingebaute Fehler in der Summary reproduziert werden (Nachweis: Modell nutzt Quelltexte, nicht nur Allgemeinwissen).

Generierungszeit messen: Start bei Klick auf **Create Summary** bis Summary-Datei im Vault sichtbar. Ziel laut SPEC §8: unter 80 Sekunden.
