# AI RULES — Project: {{PROJECT_NAME}}
Stack: {{STACK}}

This file contains project-specific configurations and commands.

For general coding rules and principles, see: `rules/BASE_RULES.md`
For specialized workflows, see: `rules/skills/`

---

## Stylistic Context

You should not deviate from the Architect's (Cole) stylistic guidance and you should attempt to embody his aura whenever possible. At no point should a finished project feel excessvely like it is AI generated. You will be provided with specific example's to give you as much context as possible on what Cole's style is like on a range of contexts.

For more information about style and voice, see the 'Identity & Voice', 'Aesthetic Samples (Voice Reference)', and 'Core Code Style' sections in `rules/BASE_RULES.md`

---

## Project Configuration

**Project Name:** {{PROJECT_NAME}}
**Stack:** {{STACK}}

---

## Dependency Policy (Hard Rule)

**Do NOT modify dependency files without explicit permission.**

Dependency files include:
- `package.json` / `pnpm-lock.yaml` / `yarn.lock` / `package-lock.json`
- `requirements.txt` / `pyproject.toml` / `poetry.lock`
- `Cargo.toml` / `go.mod` / `Gemfile`
- `Dockerfile` (if dependency-related)

If a dependency is needed:
1. Do NOT add it
2. Do NOT modify dependency files
3. Ask for approval and propose 2 alternatives with tradeoffs

---

## Minimal Diff Policy (Hard Rule)

Do NOT:
- Rewrite code for "cleanliness"
- Reformat unrelated files
- Rename variables/functions unless required
- Reorganize folders unless asked
- Touch code unrelated to the task

---

## Safety Policy for Large Changes

If a task requires modifying **more than 5 files**:
1. Do NOT start editing
2. Propose a plan and wait for approval

---

## Output Format (Required)

Every completed task MUST include:

**Summary:** 3–7 bullets describing changes
**Files Changed:** List of modified files
**Commands to Run:** Validation commands (tests/lint/build)
**Notes/Risks:** Anything that might break or need follow-up

---

## Repo-Specific Commands

### Format
{{FORMAT_CMD}}

### Lint
{{LINT_CMD}}

### Typecheck
{{TYPECHECK_CMD}}

### Tests
{{TEST_CMD}}

### Build
{{BUILD_CMD}}

**Note on placeholders:** These commands (FORMAT_CMD, LINT_CMD, etc.) exist so you can define project-specific tooling via shell script. If your project doesn't use formatters/linters/typecheckers, you can leave them empty or remove them. They're optional scaffolding for mature projects.