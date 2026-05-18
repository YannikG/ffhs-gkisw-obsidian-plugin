# Zusammenarbeit im Repository

Auf dieser Seite halten wir fest, wie wir als Team zusammenarbeiten: anhand der Roadmap-Phasen, mit GitHub-Issues entlang des Umsetzungsplans, und mit klarer Zuständigkeit für Spezifikation und Code.

## Verantwortung und Arbeitsweise

Für den Code bleiben die Menschen im Team verantwortlich. Wer etwas beiträgt, prüft die eigenen Änderungen und trägt sie mit. KI-Hilfen können unterstützen, ersetzen aber weder Review noch ein eigenes Verständnis der Lösung.

## Roadmap und Issues

Wir orientieren uns an den Phasen unter [`docs/roadmap/`](../roadmap/overview.md) und fassen konkrete Arbeit in GitHub-Issues, die zu den beschriebenen Arbeitspaketen passen. Der eigentliche Umsetzungsplan steht in den Markdown-Dateien unter `docs/roadmap/phase-N/issues/` sowie in den jeweiligen Phase-READMEs; auf GitHub geht es vor allem um Ablauf, Verknüpfung und Board.

## Wo liegt die Spezifikation (SSOT)

| Ort | Rolle |
|-----|--------|
| `docs/roadmap/phase-N/issues/*.md` | Kanonische Spezifikation: Ziel, Abhängigkeiten, testbare Akzeptanzkriterien, Scope, Dev-Schritte. |
| GitHub-Issue | Status, kurze Abstimmung, Board; verweist mit einem Permalink auf die zugehörige Markdown-Datei. |

Die Datei im Repository ist die Referenz für Inhalt und Review; das GitHub-Issue begleitet den Vorgang und die Verknüpfungen.

## GitHub-Issue anlegen

Wenn du ein GitHub-Issue aus einer bestehenden Vorlage im Repo anlegen willst, nutze den Skill [github-issue-anlegen](../../.agents/skills/github-issue-anlegen/SKILL.md) und gib den Pfad zur kanonischen Datei unter `docs/roadmap/phase-N/issues/` an. Wie Titel, Body, Abhängigkeiten und die Nutzung von `gh` zusammenspielen, steht ausschliesslich in diesem Skill; anschliessend lohnt ein kurzer Blick im Browser.

## Spezifikation und Implementierung

Beim Umsetzen sind die Arbeitspaket-Dateien unter `docs/roadmap/**/issues/**` jederzeit vorgängig verfügbar: Vom GitHub-Issue den Permalink öffnen und die Spezifikation dort lesen, bevor und während du den Code anpasst. Die kanonischen Markdown-Dateien selbst werden nicht im selben Pull Request wie die eigentliche Implementierung geändert, ausser das Team plant ausdrücklich eine Änderung genau an dieser Spezifikation.

## Projektboard und Meilenstein

- In der Spalte «Ready» (oder gleichwertig) soll ein Issue erst dann landen, wenn alle in GitHub als Vorgänger verknüpften Issues erledigt sind.
- Meilensteine richten wir nach Team-Vereinbarung.

## Projekt-Skills (KI-Hilfen im Repo)

Im Ordner [`.agents/skills/`](../../.agents/skills/) liegen Markdown-Anleitungen für Cursor bzw. andere Agenten: sie beschreiben, wie das Modell bei bestimmten Aufgaben vorgehen soll. Die folgende Tabelle ist nur ein Überblick; Details und Trigger stehen jeweils in der verlinkten `SKILL.md`.

| Skill | Kurzbeschreibung |
|--------|------------------|
| [caveman](../../.agents/skills/caveman/SKILL.md) | Sehr knappe Antworten bei gleichbleibender technischer Genauigkeit; spart Zeit und Tokens, wenn du diesen Stil ausdrücklich möchtest. |
| [github-issue-anlegen](../../.agents/skills/github-issue-anlegen/SKILL.md) | Du nennst den Skill und den Pfad zur `issues/*.md`; der Agent legt das GitHub-Issue an, inklusive Titel, Permalink im Body und Abhängigkeiten aus der Datei, soweit sich das auf GitHub abbilden lässt. |
| [implement-plan-workflow](../../.agents/skills/implement-plan-workflow/SKILL.md) | Du gibst ein GitHub-Issue per URL oder Nummer. Enthält der Body einen Permalink auf eine `issues/*.md`, gilt diese Datei als Spezifikation und wird beim Implementieren nicht mitbearbeitet; fehlt der Link, gelten Titel und Body des Issues (etwa bei Bugs). |
| [review-and-fix](../../.agents/skills/review-and-fix/SKILL.md) | Review mit anschliessender Nachbesserung zu Qualität, Architektur und Sicherheit, bis keine offensichtlichen Findings mehr offen sind. |
| [tdd](../../.agents/skills/tdd/SKILL.md) | Test-first mit red-green-refactor und vertikalen Slices; Verhalten aus Issue-Akzeptanzkriterien, Vitest und Obsidian-Grenzen siehe Begleitdateien im Skill-Ordner. |

---

- [Roadmap-Übersicht](../roadmap/overview.md)
