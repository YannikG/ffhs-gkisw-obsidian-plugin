---
name: implement-plan-workflow
description: >-
  Starts implementation of an agreed plan: verifies GitHub issue exists or
  creates one; if an existing issue is used, asks whether to refresh the issue
  body with the plan before branching. Checks out an issue-linked branch from
  master (repo default) via gh, enforces caveman communication during coding, then runs
  review-and-fix until no actionable findings remain including low. Use when
  the user says start implementing the plan, execute the plan, begin
  implementation after planning, or invokes /implement-plan.
disable-model-invocation: true
---

# Implement Plan Workflow

Use this skill when implementation should begin after a plan exists in chat or docs. Repository rules in `.cursor/rules/github-workflow-enforcement.mdc` and `.cursor/rules/github-issue-and-pr-workflow.mdc` stay authoritative; this skill does not replace them.

## Mandatory companion skills

1. **During implementation:** Read and follow `.agents/skills/caveman/SKILL.md` for assistant-to-user communication style and terseness. Resume normal clarity only where that skill says (security warnings, irreversible actions, ambiguous sequences). Code, commits, and PR text stay normal per caveman skill.
2. **After implementation:** Read and follow `.agents/skills/review-and-fix/SKILL.md` for the review-fix loop.

## Preconditions

- Working tree must be clean before branch or issue work. If dirty, stop and ask the user how to proceed (stash, commit, or discard). Do not create issues or branches on top of unrelated local changes.
- `gh` must be authenticated and available. If issue-linked branch checkout via `gh` is unavailable or fails, stop and ask the user (then branch manually from `master` once resolved).

## Step 1: GitHub issue

1. Derive a short search phrase from the current plan title or first distinctive keywords.
2. Run: `gh issue list --state open --search "<phrase> in:title"` (adjust query if no hits).
3. **If zero matches:** Create an issue with a clear title and body summarizing the plan. If this repository uses the Bytepeak project link step from `github-issue-and-pr-workflow.mdc`, add the issue to that project after creation.
4. **If one clear match:** Ask the user explicitly whether this issue should be updated with the current plan content (title and/or body). Wait for an answer before continuing. If they want an update, apply it with `gh issue edit` (use a body file or heredoc when the plan is long). If they decline, leave the issue unchanged. Then use that issue number for the branch.
5. **If multiple plausible issues or unclear fit:** Ask the user which issue to use or whether to open a new one. Do not guess. After the user picks a specific existing issue, ask the same update question as in step 4 before branching.

## Step 2: Branch from `master` only

Long-lived integration work uses **`master`** as the default branch. Feature branches must be created from up-to-date `master`.

1. Ensure local `master` exists and is up to date (`git fetch`, `git checkout master`, `git pull` as needed).
2. Prefer checking out a branch linked to the issue via authenticated `gh`, using the issue-branch workflow documented for your installed version (`gh issue help`). The new branch must be based on the repository default branch (`master`).
3. If that workflow is unavailable or fails, create and checkout a branch manually **from `master`**: `git checkout master && git pull && git checkout -b <issue-linked-name>`.
4. Confirm the current branch is not `master` and that it relates to the chosen issue (branch naming convention or metadata from `gh`).

## Step 3: Implement

Implement the plan on the active issue branch only. Obey all project rules (i18n, Angular, tests, etc.) from workspace configuration.

## Step 4: Review and fix (strict exit)

1. Apply the **review-and-fix** skill end to end.
2. **Exit criterion for this workflow:** No remaining actionable findings at **critical**, **high**, **medium**, or **low** severity in touched scope, unless a true blocker is documented per review-and-fix blocker rules. Re-run the review-fix loop until lows are cleared or the only leftovers are documented blockers needing user input.

## Trigger phrases

- "Start implementing the plan"
- "Execute the plan"
- "Begin implementation"
- `/implement-plan`
