# Inhalts-Checkliste — P11-I03

```text
Datum:   2026-06-04
Modell:  gemma4:e2b
Lauf:    evaluation_summary.md (aus P11-I02)
```

Ziel laut [SPEC.md §8](../../../SPEC.md#8-akzeptanzkriterien-und-evaluation): ca. **80 % Schlüsselpunkte**; eingebaute Fehler sollen in Summary sichtbar sein (Nachweis: Modell nutzt Quelltexte).

---

## eval-01 — Maschinelles Lernen

### Schlüsselpunkte (5/5 = 100 %) ✅

- [x] Supervised / Unsupervised / Reinforcement Learning — alle drei genannt
- [x] Overfitting + Gegenmassnahmen (Regularisierung, Dropout, Validierungsset)
- [x] Validierungsset getrennt vom Testset
- [x] Gradientenabstieg + Lernrate (SGD, Mini-Batch)
- [x] Neuronale Netze (Schichten, Aktivierungsfunktionen ReLU/Sigmoid)

### Eingebaute Fehler (1/3 reproduziert)

| Fehler | In Summary? | Notiz |
|--------|-------------|-------|
| F1: AlexNet gewann ImageNet 2010 | ✅ Ja | Wortgleich reproduziert |
| F2: Random Forest von Yann LeCun | ❌ Nein | Random Forest nicht erwähnt |
| F3: LSTM eingeführt 1998 | ❌ Nein | LSTM erwähnt, Jahreszahl fehlt |

---

## eval-02 — Relationale Datenbanken

### Schlüsselpunkte (3/5 = 60 %) ❌

- [ ] ACID-Eigenschaften (alle vier) — **nicht erwähnt**
- [x] Normalisierung 1NF / 2NF / 3NF — vollständig abgedeckt
- [x] PRIMARY KEY und FOREIGN KEY (referenzielle Integrität, Kaskadierung)
- [ ] JOIN-Typen (INNER, LEFT OUTER, FULL OUTER) — **nicht erwähnt**
- [x] Indexierung: Zweck, B-Baum, Lese- vs. Schreibperformance

### Eingebaute Fehler (1/3 reproduziert)

| Fehler | In Summary? | Notiz |
|--------|-------------|-------|
| F1: SQL von Oracle eingeführt | ❌ Nein | SQL-Ursprung nicht thematisiert |
| F2: PRIMARY KEY erlaubt NULL | ✅ Ja | «Es erlaubt NULL-Werte, wenn der Datensatz noch nicht vollständig ist.» |
| F3: INNER JOIN gibt alle Zeilen zurück | ❌ Nein | JOINs nicht thematisiert |

---

## eval-03 — Netzwerkprotokolle

### Schlüsselpunkte (2/5 = 40 %) ❌

- [ ] OSI-Modell (sieben Schichten + Beispielprotokolle) — **nicht erwähnt**
- [x] TCP vs. UDP — korrekt gegenübergestellt
- [x] DNS-Auflösung — kurz erwähnt («hierarchisch»), ohne Detailschritte
- [ ] TLS/HTTPS (Verschlüsselung, Port 443, Zertifikate) — **nicht erwähnt**
- [ ] IPv4 vs. IPv6 (Adresslänge, CIDR) — **nicht erwähnt**

### Eingebaute Fehler (0/3 reproduziert)

| Fehler | In Summary? | Notiz |
|--------|-------------|-------|
| F1: HTTP Port 8080 | ❌ Nein | HTTP nicht thematisiert |
| F2: UDP garantiert Zustellung | ❌ Nein | Modell formulierte korrekt: «Garantiert keine Paketzustellung» — Fehler korrigiert statt reproduziert |
| F3: IPv6 64 Bit | ❌ Nein | IPv6 nicht thematisiert |

---

## Gesamtbewertung

| Metrik | Ergebnis | Ziel | Status |
|--------|----------|------|--------|
| Schlüsselpunkte gesamt | 10/15 = 67 % | ≥ 80 % | ❌ unter Ziel |
| Schlüsselpunkte eval-01 | 5/5 = 100 % | ≥ 80 % | ✅ |
| Schlüsselpunkte eval-02 | 3/5 = 60 % | ≥ 80 % | ❌ |
| Schlüsselpunkte eval-03 | 2/5 = 40 % | ≥ 80 % | ❌ |
| Eingebaute Fehler reproduziert | 2/9 = 22 % | sichtbar | ❌ |

### Interpretation

Das Modell deckt den ML-Korpus gut ab. Die Netzwerk- und Datenbank-Inhalte werden nur teilweise wiedergegeben, vermutlich weil die semantische Suche (Top-K Retrieval) nicht alle relevanten Chunks zurückliefert. Die Inhaltsabdeckung liegt unter dem 80-%-Ziel der SPEC.

Eingebaute Fehler werden selten reproduziert: Das Modell tendiert dazu, bekannte Fakten zu korrigieren (z. B. UDP-Verhalten), was zeigt, dass das eigene Modellwissen gegenüber den Quelltexten dominiert. Dies ist ein Hinweis auf das bekannte RAG-Problem der «Knowledge Conflict».

**Massnahme:** Als Finding für Phase 12 / Follow-up dokumentieren. Kein Blocking-Defekt für die Freigabe; Verhalten im Rahmen der MVP-Erwartungen bei einem leichten Standardmodell.

---

## Markdown-Format Spot-Check

Geprüft mit `node scripts/check-markdown.mjs` (P11-I03):

| Prüfpunkt | Ergebnis |
|-----------|----------|
| Keine kaputten Code-Fences | ✅ Pass |
| $/$$ nicht zerrissen | ✅ Pass (keine Math-Blöcke in Summary) |
| Wikilinks (`[[...]]`) | N/A — keine Wikilinks in generierter Summary |
| Valides Markdown (manuell) | ✅ Pass — strukturiert, Überschriften und Listen korrekt |
