# GitHub CLI (`gh`)

Nur Shell und Automatisierung. Team-Regeln zu Issue-Text, Board und Speicherorten: [zusammenarbeit/README.md](../zusammenarbeit/README.md). Was in Repo-Issue-`.md`-Dateien stehen soll: [.agents/AGENTS.md](../../.agents/AGENTS.md).

## Branch an Issue

Web-UI «Create branch» nicht; `gh` ja.

```bash
gh issue develop <issue-nummer> --checkout
gh issue develop <issue-nummer> -n <name> --checkout
```

[gh issue develop](https://cli.github.com/manual/gh_issue_develop)

## Issue / PR (Beispiele)

```bash
gh issue list
gh issue view <nummer>
gh issue create --title "..." --body-file pfad.md
gh pr create --fill
gh pr list
```

Auth: `gh auth login` / `gh auth status` gültig für Repo.

## Branch-Name

Kein erzwungenes `feat/`. Default von `gh issue develop`, oder `-n <name>`. PR-Beschreibung: Team kann `[P4-Ixx]` nutzen.
