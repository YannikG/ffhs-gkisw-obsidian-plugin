# Roadmap Übersicht

Die Roadmap besteht aus den **zwölf Schritten** in der folgenden Tabelle (Schritt, Bezeichnung, Beschreibung, Phase-README). Das ist die massgebende Reihenfolge der Arbeit.

| Schritt | Bezeichnung | Beschreibung | Phase-README |
|---------|-------------|--------------|--------------|
| 1 | Projektsetup | Erstellen des Git-Repos inklusive Berechtigungen des Projektteams. | [Phase 1](./phase-1/README.md) |
| 2 | Agent Setup | Erarbeiten passender Skills und Anweisungen für die Agenten (Cursor). | [Phase 2](./phase-2/README.md) |
| 3 | Planung | Gemäss dem Anforderungskatalog wird ein Projektplan zusammen mit dem Agenten erstellt, welcher dann von mehreren Agenten erarbeitet werden kann. | [Phase 3](./phase-3/README.md) |
| 4 | Minimale Implementation | Es wird einen Agenten beauftragt, die erste Implementation vorzunehmen; dies beinhaltet das Setup des Plugins inklusive Boilerplate-Code für das weitere Vorgehen. | [Phase 4](./phase-4/README.md) |
| 5 | Kommunikation mit dem LLM | Lokal wird Ollama installiert und die Modelle heruntergeladen. Ein Agent implementiert anschliessend die Kommunikation mit Ollama (JS) und ermöglicht das Generieren von Files. Im Hintergrund wird ein System-Prompt dem LLM mitgegeben, damit eine konsistente Qualität der Zusammenfassungen gewährleistet wird. Das System-Prompt wird vorab nicht genau spezifiziert und auf Try-and-Error-Basis bei der Implementation erarbeitet. | [Phase 5](./phase-5/README.md) |
| 6 | Einbau RAG | Ein Agent wird beauftragt, die RAG-Pipeline zu erarbeiten und in eine Vektordatenbank basierend auf SQLite einzupflegen. Die Pipeline wird automatisch beim Starten von Obsidian ausgeführt, hört auf den Event-Bus von Obsidian und pflegt die Datenbank basierend auf den Events. | [Phase 6](./phase-6/README.md) |
| 7 | Verknüpfung RAG mit LLM | Sobald die RAG-Pipeline steht, wird ein Agent beauftragt, die beiden Komponenten zu verbinden. | [Phase 7](./phase-7/README.md) |
| 8 | Finalisierung | In diesem Schritt werden die Optionen in den Einstellungen erstellt, mit denen Benutzer:innen gewisse Einstellungen vornehmen können. | [Phase 8](./phase-8/README.md) |
| 9 | Review | Agenten können Fehler machen; deshalb ist unter anderem ein automatisches Review mittels Agenten-Skill sowie ein manuelles Review des Codes und des MVP vorgesehen. Dabei wird der Code angeschaut und das Produkt per Klick getestet. | [Phase 9](./phase-9/README.md) |
| 10 | Dokumentation | Ein Agent wird beauftragt, die aktuelle Systemarchitektur und Implementation zu dokumentieren. So wird sichergestellt, dass zukünftige Erweiterungen durch Agenten mit dem richtigen Kontext erstellt werden. Ein Review der Dokumentation durch das Projektteam ist hier ebenfalls vorgesehen. | [Phase 10](./phase-10/README.md) |
| 11 | Testen | Gemäss den Kriterien aus der Evaluationsstrategie (Kapitel 5) werden die Tests durchgeführt und dokumentiert. | [Phase 11](./phase-11/README.md) |
| 12 | Freigabe | Nach erfolgreichen Tests ist der MVP freigegeben. | [Phase 12](./phase-12/README.md) |
