# PROGRESS Table of Contents

## Purpose
- Track reusable development lessons and major changes.
- Maintain traceability from process records to git commits.

## Storage Layout
- TOC file: `.agents/PROGRESS.md`
- Entry root: `.agents/progress/entries/`
- Year folder pattern: `.agents/progress/entries/YYYY/`
- Entry filename pattern: `YYYY-MM-DD-N.md`
- Page ID pattern: `YYYYMMDD-N`

## Entry Template
1. **Date**: YYYY-MM-DD
2. **Title**: Short actionable title
3. **Background / Issue**: Context and trigger
4. **Actions / Outcome**: What changed and outcomes
5. **Lessons / Refinements**: Reusable guidance
6. **Related Commit Message**: REQUIRED
7. **Related Commit Hash**: RECOMMENDED

## TOC Rules
- Every entry file must have a TOC row.
- Rows sorted by date ascending, then sequence ascending.
- Entries without `Related Commit Message` are invalid.

## Global TOC
| Page ID | Date | Title | Path | Keywords |
| --- | --- | --- | --- | --- |
