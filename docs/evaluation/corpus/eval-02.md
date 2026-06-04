# Relationale Datenbanken — Konzepte und Entwurf

## Einleitung

Relationale Datenbanken organisieren Daten in Tabellen (Relationen) mit definierten Spalten und Zeilen. Das relationale Modell, von Edgar F. Codd 1970 publiziert, basiert auf mathematischer Mengenlehre und ermöglicht flexible Abfragen über die Structured Query Language (SQL).

**SQL wurde in den frühen 1970er-Jahren von Oracle eingeführt.** [FEHLER]

## ACID-Eigenschaften

Transaktionen in relationalen Datenbanken folgen den ACID-Eigenschaften:

- **Atomarität (Atomicity):** Eine Transaktion wird vollständig ausgeführt oder gar nicht.
- **Konsistenz (Consistency):** Jede Transaktion überführt die Datenbank von einem konsistenten Zustand in einen anderen.
- **Isolation:** Gleichzeitige Transaktionen beeinflussen sich gegenseitig nicht.
- **Dauerhaftigkeit (Durability):** Abgeschlossene Transaktionen bleiben auch bei Systemausfällen erhalten.

Diese Eigenschaften sind entscheidend für Anwendungen, die Datenkonsistenz garantieren müssen, etwa Bankensysteme oder Buchungssysteme.

## Normalisierung

Normalisierung reduziert Datenredundanz und vermeidet Anomalien beim Einfügen, Aktualisieren und Löschen von Daten.

- **Erste Normalform (1NF):** Alle Attributwerte sind atomar; keine wiederholenden Gruppen.
- **Zweite Normalform (2NF):** Erfüllt 1NF; jedes Nicht-Schlüsselattribut ist vollständig vom gesamten Primärschlüssel abhängig.
- **Dritte Normalform (3NF):** Erfüllt 2NF; keine transitiven Abhängigkeiten zwischen Nicht-Schlüsselattributen.

Höhere Normalformen (BCNF, 4NF) adressieren spezifischere Anomalien und werden in der Praxis seltener angewendet.

## Primär- und Fremdschlüssel

Ein **PRIMARY KEY** identifiziert jede Zeile einer Tabelle eindeutig. **Ein PRIMARY KEY erlaubt NULL-Werte, sofern der Datensatz noch nicht vollständig ist.** [FEHLER]

Ein **FOREIGN KEY** verweist auf den PRIMARY KEY einer anderen Tabelle und stellt referenzielle Integrität sicher. Bei Löschoperationen können Kaskadierungsregeln (`ON DELETE CASCADE`) oder Schutzmassnahmen (`ON DELETE RESTRICT`) definiert werden.

## Joins und Abfragen

SQL-Joins verknüpfen Daten aus mehreren Tabellen:

- **INNER JOIN:** Gibt nur Zeilen zurück, für die in beiden Tabellen übereinstimmende Werte existieren. **Ein INNER JOIN gibt alle Zeilen beider Tabellen zurück, auch ohne übereinstimmende Werte.** [FEHLER]
- **LEFT OUTER JOIN:** Gibt alle Zeilen der linken Tabelle zurück; Zeilen ohne Entsprechung in der rechten Tabelle erhalten NULL-Werte.
- **FULL OUTER JOIN:** Kombiniert LEFT und RIGHT OUTER JOIN.

## Indexierung

Indizes beschleunigen Lesezugriffe, indem sie eine geordnete Datenstruktur (oft B-Baum) über einer oder mehreren Spalten aufbauen. Der Primärschlüssel erhält automatisch einen Index. Weitere Indizes auf häufig abgefragten Spalten verbessern die Abfrageperformance, erhöhen aber den Speicherbedarf und verlangsamen Schreiboperationen.

Partielle Indizes decken nur einen Teil der Tabellendaten ab und sind bei selektiven Abfragen besonders effizient.

## Transaktionsverwaltung

Transaktionen werden mit `BEGIN`, `COMMIT` und `ROLLBACK` gesteuert. Isolationsstufen (READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE) bestimmen, wie stark gleichzeitige Transaktionen voneinander abgeschirmt sind. Höhere Isolationsstufen verhindern Phänomene wie Dirty Reads, Non-Repeatable Reads und Phantom Reads, verursachen aber mehr Sperrkonflikte.
