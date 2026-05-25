Review and fix loop for current changes. $ARGUMENTS

**Ziel:** konkrete Issues finden → beheben → validieren → wiederholen bis **done** oder **Blocker**.

## Scan-Dimensionen (berührter Scope)

- **SRP:** eine Aufgabe pro Fn/Klasse/Komponente
- **Wartbarkeit:** Duplikate, Komplexität, Kopplung, Namen, untestbare Logik
- **Clean Arch:** Abhängigkeitsrichtung, Layer-Grenzen, kein Feature-Bleed
- **Security:** Validierung, Secrets, Deserialisierung, Injection, Datenverlust-Pfade
- **Sauberkeit:** toter Code, stale TODOs, schwache Typen, Fehlerbehandlungslücken
- **Typen:** konkrete Typen; kein `any`; kein langes `unknown` — an Grenzen sofort einengen
- **Docs:** öffentliche APIs dokumentiert wo nötig; Kommentare nur für nicht-offensichtliche Constraints
- **Tests:** Verhaltensänderungen abgedeckt; Lint/Type/Test bestanden

## Loop (zwingend)

Wiederholen bis Done-Kriterien erfüllt:

1. **Scan** — geänderte Dateien + betroffene Call-Pfade. Findings = konkret (keine vagen Style-Nits)
2. **Klassifizieren** — Severity:
   - `critical`: kaputtes Verhalten, Datenverlust/Security, Arch-Bruch
   - `high`: wahrscheinlicher Bug/Regression oder grosses Wartbarkeitsrisiko
   - `medium`: echter Debt, günstige Behebung jetzt
   - `low`: optionale Politur
3. **Beheben** — alle `critical`/`high`/`medium` die `actionable-now` sind
4. **Validieren** — `npm run lint && npm run typecheck && npm test` für geänderten Scope
5. **Re-Review** — berührter Code + Nachbarn auf Second-Order-Schäden
6. **Wiederholen** bis done

## Finding-Format

`<severity> | <location> | <problem> | <fix>`

## Done (alle wahr)

- Kein offenes `critical` oder `high`
- Kein `medium` mehr das sicher + machbar ist
- Validierung besteht für geänderten Scope (oder bestehende Fehler **explizit** notiert)

## Blocker → Auto-Fix stoppen, melden

- Mehrdeutige Anforderung
- Destruktive / irreversible Änderung
- Braucht Credentials / User-Schritt
- Constraint-Konflikt ohne sicheren Fix im Scope
