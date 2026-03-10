# PROGRESS

## Purpose
- Keep a minimal, searchable index of progress entries.
- Ensure each entry is traceable to a commit message.

## Storage Layout
- TOC file: `.agents/PROGRESS.md`
- Entry root: `.agents/progress/entries/`
- Entry file pattern: `YYYY-MM-DD-N.md`
- Page ID pattern: `YYYYMMDD-N`

## Entry Template
1. **Date**: YYYY-MM-DD
2. **Title**: Short title
3. **Summary**: Key change and result
4. **Related Commit Message**: REQUIRED
5. **Related Commit Hash**: RECOMMENDED

## TOC Rules
- Every entry must be listed in the Global TOC.
- Entries without **Related Commit Message** are not allowed into storage.

## Global TOC
| Page ID | Date | Title | Path | Related Commit Message | Related Commit Hash |
| --- | --- | --- | --- | --- | --- |
| 20260310-1 | 2026-03-10 | 优化账单页与侧边栏 | [.agents/progress/entries/2026/2026-03-10-1.md](D:/iscas2025/code/ironman/.agents/progress/entries/2026/2026-03-10-1.md) | `feat(order): 优化账单详情页编辑体验并精简侧边栏菜单` | |
