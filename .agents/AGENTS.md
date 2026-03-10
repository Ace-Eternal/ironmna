# Minimal Governance Rules

1. **Git Flow Branching Strategy**
   - Use only these branches: `main`, `develop`, `feature/*`, `release/*`, and `hotfix/*`.
   - Start daily work from `develop` into `feature/*`, create `release/*` from `develop` before a release, and create `hotfix/*` from `main` for production fixes.
   - Delete completed `feature/*`, `release/*`, and `hotfix/*` branches after merge.

2. **Angular Commit Convention**
   - Follow Angular Commit / Conventional Commits format: `type(scope): subject`.
   - Allowed `type` values: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, and `revert`.
   - Write the `subject` in imperative mood, keep it short, and do not end it with a period.

3. **Comment Language Rule**
   - When `PROJECT_LANG=zh`, comments may use Chinese, but only ASCII punctuation is allowed.
   - When `PROJECT_LANG=en`, comments must be written in English.

4. **Doxygen Documentation Rule**
   - Public modules, classes, and functions must use Doxygen style comments (`/** ... */`).
   - Include at least `@brief`, `@param`, and `@return` when a return value exists.

5. **Architecture Principle**
   - Design and implementation must follow high cohesion and low coupling (`高内聚低耦合`).
   - Direct cross-layer dependencies on non-public interfaces are not allowed.

6. **Rule Priority**
   - Rules in `RULES.md` override default agent habits and preferences.
