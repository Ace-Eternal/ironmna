# Repository Guidelines

## Project Structure & Module Organization
- `src/` contains application code.
- Key folders in `src/`: `views/` (pages), `components/` (shared UI), `router/` (route config), `stores/` (Redux Toolkit state), `api/` (request modules), `utils/` and `hooks/` (shared logic), `layout/` (shell/layout), `assets/` (static resources), `types/` (TypeScript types).
- `mock/` holds local mock API handlers used by Vite mock plugin.
- `public/` stores static files copied as-is at build time.
- `build/` contains build/helper scripts; output artifacts are generated into `dist/`.

## Build, Test, and Development Commands
- `pnpm serve`: start local Vite dev server.
- `pnpm build`: clean `dist/`, run TypeScript compile checks, then produce production build.
- `pnpm preview`: preview the production build locally.
- `pnpm lint:eslint`: run ESLint on `src/`, `mock/`, `build/` and auto-fix issues.
- `pnpm lint:prettier`: format source files with Prettier.
- `pnpm clean:cache`: remove eslint cache and reinstall dependencies.

## Coding Style & Naming Conventions
- Follow `.editorconfig`: UTF-8, LF, 2-space indentation.
- Use TypeScript-first patterns; prefer explicit types in shared/public APIs.
- Component files use `PascalCase` (for example `UserTable.tsx`), hooks use `useXxx` naming, utility modules use descriptive `camelCase` names.
- Keep imports stable and grouped (framework, third-party, internal).
- Run `pnpm lint:eslint` and `pnpm lint:prettier` before opening a PR.

## Testing Guidelines
- No dedicated test runner is configured yet (no `test` script or baseline test suite).
- Minimum validation for changes: `pnpm build` and targeted manual checks through `pnpm serve`.
- When adding tests, place them near features (for example `src/views/user/__tests__/user-list.spec.tsx`) and propose the test script in the same PR.

## Commit & Pull Request Guidelines
- Commit messages are enforced by Commitlint (Conventional Commits).
- Use allowed types such as `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `build`, `ci`, `perf`, `revert`.
- Format: `type(scope): short summary` (example: `feat(router): add role-based guard`).
- PRs should include: purpose summary, key changes, validation steps run, linked issue(s), and UI screenshots/GIFs for visual updates.
