# .agents Workspace Guide

## Scope
- This directory stores agent coordination files only.
- Do not place business code or runtime assets here.

## Language
- `PROJECT_LANG=en`
- All newly generated files under `.agents/` must be written in English.

## Minimal Structure
- `AGENTS.md`: directory-level guidance for agents.
- `RULES.md`: user-maintained rules file.
- `PROGRESS.md`: progress table of contents and entry format.
- `progress/entries/`: dated progress entry storage.
- `skills/`: local skill storage.

## Change Policy
- Keep this directory minimal and operational.
- Do not expand scope without explicit user instruction.
- Do not rewrite `RULES.md` unless the user clearly authorizes it.
