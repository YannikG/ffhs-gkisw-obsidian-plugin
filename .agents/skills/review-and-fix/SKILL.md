---
name: review-and-fix
description: >
  Runs a strict review-and-remediation loop for SRP, code quality, maintainability,
  clean architecture, code cleanliness, documentation, security, and safety. Use
  when user asks to review and fix code, run maintainability cleanup, perform
  architecture quality review, or resolve findings until no actionable issues remain.
---

# Review And Fix

Perform review plus remediation, not review-only. Continue until all actionable findings are fixed or a true blocker is reported.

## Trigger Phrases

Apply this skill when user asks for:

- "review and fix"
- SRP review
- maintainability cleanup
- clean architecture review
- code quality cleanup
- documentation quality pass

## Quality Checklist

Check each touched area for:

- **Single Responsibility Principle (SRP):** functions/classes/components/services do one clear job.
- **Maintainability:** duplication, high complexity, hidden coupling, poor naming, brittle branching, hard-to-test logic.
- **Clean Architecture:** dependency direction is correct, boundaries are respected, no feature leakage across layers.
- **Security and safety:** input validation, auth checks, secrets handling, unsafe deserialization, injection risks, dangerous side effects, data-loss scenarios.
- **Code Cleanliness:** dead code, stale TODOs, inconsistent patterns, unsafe type usage, unclear APIs, weak error handling.
- **Type safety:** use concrete types everywhere possible; avoid `any`; avoid long-lived `unknown`; narrow unsafe boundaries immediately.
- **Documentation:** public/reused APIs have concise docs where needed, comments explain non-obvious constraints, docs stay aligned with behavior.
- **Testing and safety:** changed behavior has adequate tests, regressions are prevented, lint/type/test expectations are met.

## Review-Fix Loop (Mandatory)

Repeat this loop until done criteria passes:

1. **Scan**
   - Inspect relevant changed files and impacted call paths.
   - Collect concrete findings only (no vague style opinions).

2. **Classify**
   - Assign severity:
     - `critical`: broken behavior, data loss/security risk, architecture break.
     - `high`: likely bug/regression or major maintainability risk.
     - `medium`: meaningful quality debt that is straightforward to fix now.
     - `low`: optional polish.
   - Mark each item as `actionable-now` or `blocked`.

3. **Fix**
   - Fix all `critical`, `high`, and `medium` findings that are `actionable-now`.
   - Prefer smallest safe refactor that removes root cause.
   - Keep behavior stable unless user requested behavior change.

4. **Validate**
   - Run relevant checks for modified scope (lint/type/test/build as available).
   - If checks fail, treat failures as new findings and fix them in same loop.

5. **Re-Review**
   - Re-check touched code and nearby affected areas for second-order issues.
   - Ensure fixes did not introduce coupling, complexity, or documentation drift.

6. **Repeat**
   - Continue loop until done criteria is satisfied.

## Done Criteria

Only declare completion when all are true:

- No remaining `critical` or `high` findings.
- No `medium` findings that are safe and feasible to fix now.
- Validation checks for changed scope pass (or unavoidable pre-existing failures are explicitly documented).
- Remaining items, if any, are true blockers with clear reason and next required decision/input.

## Finding Format

Use concise actionable entries:

`<severity> | <location> | <problem> | <fix>`

Example:

`high | src/app/orders/order.service.ts | Service handles validation + persistence + mapping in one method (SRP breach) | Extract validation and mapping collaborators, keep service orchestration only`

## Blocker Rules

Stop auto-fixing and report blocker when:

- requirement is ambiguous and fix needs product decision,
- proposed change is destructive/irreversible,
- fix requires credentials/systems/user action unavailable to agent,
- constraint conflict makes safe fix impossible in current scope.

When blocked, report:

- current status,
- findings already fixed,
- exact blocker,
- minimal next action needed from user.

## Boundaries

- Do not stop after first review pass if actionable findings remain.
- Do not leave known `critical/high` issues unfixed.
- Do not invent requirements or rewrite unrelated architecture.
- Do not skip validation silently.
- Do not require database data normalization unless user explicitly asks for normalization.
- Use explicit types across code paths; avoid `unknown` and `any` unless unavoidable at boundary, then narrow immediately.
- If user explicitly requests review-only mode, follow user request and disable fix loop for that task.
