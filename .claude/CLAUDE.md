# Claude Code — portfolio

@~/.claude/brains/indie-ecosystem.md

## Reference
- Design system (color tokens, typography, components), frontend stack, hard constraints + quality gates live in root `AGENTS.md` — NOT auto-loaded. Read it before any UI/styling/build work.

## Project Values
- **Minimal impact** — Make the smallest changes necessary. Don't over-engineer
- **No dirty state** — Don't leave the environment broken. Verify changes work before completing a task
- **Reversibility** — Ensure significant changes can be undone if needed

### Boundaries
<!-- TODO: Add project-specific boundaries -->

## Security
**CRITICAL**: NEVER commit, push, or expose secrets, API keys, tokens, or credentials to version control.

- NEVER hardcode secrets in code — use environment variables and `.env` files
- NEVER commit files containing secrets — verify with `git diff --cached` before committing
- ALWAYS check `.gitignore` has `.env*`, `credentials.*`, `secrets.*`, `*.key`, `*.pem`
- ASK before committing sensitive-looking files (`config.json`, `.env*`, `credentials.*`)
- If secrets are accidentally committed: STOP, alert user to revoke, remove from history, add to `.gitignore`
