# 最小治理规则

1. **Git Flow 分支策略**
   - 分支仅使用：`main`、`develop`、`feature/*`、`release/*`、`hotfix/*`。
   - 日常开发从 `develop` 拉 `feature/*`；发布前从 `develop` 建 `release/*`；线上紧急修复从 `main` 建 `hotfix/*`。
   - 合并后删除已完成的 `feature/*`、`release/*`、`hotfix/*` 分支。

2. **提交规范（Angular / Conventional Commits）**
   - 提交信息格式：`type(scope): subject`。
   - `type` 仅允许：`feat`、`fix`、`docs`、`style`、`refactor`、`perf`、`test`、`build`、`ci`、`chore`、`revert`。
   - `subject` 使用祈使句，简短且无句号。

3. **注释语言规范**
   - 当 `PROJECT_LANG=zh` 时，注释可使用中文，但只允许半角标点。
   - 当 `PROJECT_LANG=en` 时，注释必须为英文。

4. **Doxygen 注释规范**
   - 对外暴露的模块、类、函数必须使用 Doxygen 风格注释（`/** ... */`）。
   - 至少包含：`@brief`、参数说明（`@param`）、返回说明（`@return`，如有返回值）。

5. **架构原则**
   - 设计与实现必须满足高内聚、低耦合。
   - 禁止跨层直接依赖未公开接口。

6. **规则优先级**
   - `RULES.md` 的规则优先级高于 agent 默认习惯与默认偏好。
