# Claude Code — portfolio

@~/.claude/brains/indie-ecosystem.md

## Project Values
- **Minimal impact** — Make the smallest changes necessary. Don't over-engineer
- **No dirty state** — Don't leave the environment broken. Verify changes work before completing a task
- **Reversibility** — Ensure significant changes can be undone if needed

### Boundaries
<!-- TODO: Add project-specific boundaries -->

## Memory Bank
Auto-loaded at session start (brief, context, task, tech). Full files in `.memory-bank/`:
- `brief.md` — Project goals and scope
- `product.md` — Product context and constraints
- `context.md` — Recent changes and carry-forward notes
- `task.md` — Active tasks and sprint focus
- `architecture.md` — System architecture
- `tech.md` — Tech stack and tooling
- `stories/` — Dev stories for devlogs (not auto-loaded, use `/story` to capture)

After major tasks or architectural changes, update relevant Memory Bank files.

## Security
**CRITICAL**: NEVER commit, push, or expose secrets, API keys, tokens, or credentials to version control.

- NEVER hardcode secrets in code — use environment variables and `.env` files
- NEVER commit files containing secrets — verify with `git diff --cached` before committing
- ALWAYS check `.gitignore` has `.env*`, `credentials.*`, `secrets.*`, `*.key`, `*.pem`
- ASK before committing sensitive-looking files (`config.json`, `.env*`, `credentials.*`)
- If secrets are accidentally committed: STOP, alert user to revoke, remove from history, add to `.gitignore`
