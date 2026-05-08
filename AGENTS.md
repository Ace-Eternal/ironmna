# AGENTS.md

本文件为 Ironman 仓库的根级代理操作指南。执行任何改动前先阅读本文件；进入子目录后，如存在更近的 `AGENTS.md`，以更近文件为准。

## 项目概览

- `iron-management-backend/`: Spring Boot 3.0.2 + Java 17 + MyBatis-Plus 后端，默认服务上下文为 `/iron`。
- `react-admin-design-main/`: Vite + React 18 + TypeScript + Ant Design 前端，包管理器为 `pnpm`。
- `word-template/`: 后端导出 Word 文档使用的模板资源。
- `docker-compose.yml`: 本地 MySQL、后端和前端容器编排基线。
- `artifacts/`、`runtime-logs/`、`iron-management-backend/target/`、`react-admin-design-main/dist/`: 构建或运行产物，除非任务明确要求，否则不要手工改动。

## 通用工作规则

- 先读现有实现和文档，再改代码。优先参考 `ARCHITECTURE.md`、`DEPLOYMENT.md`、相关模块代码和测试。
- 保持小步修改，每次变更都应能被本地命令验证。
- 优先复用项目已有库、工具、服务和组件，不引入新的框架或自研公共层，除非现有能力无法满足需求。
- 不要提交密钥、数据库文件、日志、构建产物或本地环境差异。
- 修改配置、启动参数、接口路径或部署行为时，同步更新相关文档。
- 注释用于解释业务意图、边界条件或非显然约束；避免复述代码。

## 后端约定

- 主代码位于 `iron-management-backend/src/main/java/com/example`。
- 控制器位于 `controller`，保持薄层：只做 HTTP 参数接收、响应包装和状态转换。
- 新业务编排优先放入 `com.example.<domain>.application`，例如 `order.application`、`customer.application`、`dashboard.application`。
- 现有 `service`、`mapper` 和 XML mapper 作为持久化层使用；不要把复杂业务逻辑写进 mapper 或 controller。
- 通用异常、文件、资源和 Web 配置放在 `common` 下。
- 使用 MyBatis-Plus 现有模型和查询方式；新增 SQL 时同步检查 `src/main/resources/mapper` 与 `sql/` 初始化脚本的一致性。
- 文档导出相关逻辑应继续通过 `DocumentTemplateService` 与 `word-template/template.docx` 协作，避免硬编码绝对路径。
- 环境变量以 `application.yaml`、`application-dev.yaml`、`application-prod.yaml` 和 `.env.example` 为准。

常用命令：

```powershell
cd iron-management-backend
mvn test
mvn spring-boot:run
mvn clean package -DskipTests
```

## 前端约定

- `react-admin-design-main/AGENTS.md` 包含前端子项目规则，修改前端时必须同时遵循。
- 新 TypeScript 源码优先放在 `.ts`、`.tsx` 文件中；不要为新 TypeScript 文件新增手写 `.js` 镜像。
- 领域 API 优先放入 `src/modules/<domain>/api.ts`，`src/api` 仅作为兼容聚合导出。
- 页面位于 `src/views`，共享组件位于 `src/components`，全局状态位于 `src/stores`，通用请求能力位于 `src/shared/api`。
- 保持 Vite 生产 `base: '/'`，不要改成 `./`，否则刷新 `/login`、`/home` 等路径会导致资源请求错误。
- UI 改动遵循现有 Ant Design、Less module、Redux Toolkit、React Router 结构，避免引入新的设计系统。
- 新增请求路径时确认后端上下文 `/iron` 和前端代理配置保持一致。

常用命令：

```powershell
cd react-admin-design-main
pnpm serve
pnpm build
pnpm lint:eslint
pnpm lint:prettier
```

## 测试与验证

- 后端改动至少运行 `mvn test`；涉及打包或启动配置时再运行 `mvn clean package -DskipTests` 或 `mvn spring-boot:run`。
- 前端没有独立测试脚本；前端改动至少运行 `pnpm build`，样式或交互改动还应通过 `pnpm serve` 做本地页面检查。
- 跨端接口改动需要同时验证后端接口契约、前端调用参数和返回数据解构。
- Docker 或部署相关改动需要检查 `docker compose config`，并按影响范围决定是否运行 `docker compose up --build`。
- 记录未能执行的验证命令和原因，不要声称未运行的测试已经通过。

## 本地开发与部署注意事项

- 本地前端默认通过 Vite 启动，后端默认端口 `8888`、上下文 `/iron`，Docker Compose 前端端口为 `8201`。
- 生产部署必须先在本地构建产物，再上传 `artifacts/Iron_Management_Backend-0.0.1-SNAPSHOT.jar` 和 `artifacts/frontend-dist.tar.gz`。
- 不要在生产服务器执行 `mvn package`、`pnpm build` 或 `docker compose up --build`。
- 生产 Nginx 根路径 `/` 需要重定向到 `/login#/login`，并保持 `/iron/` 代理到后端。
- 后端模板路径、导出目录、数据库连接、CORS 来源都应通过环境变量配置。

## Git 与交付

- 遵循 Conventional Commits：`type(scope): summary`，常用类型包括 `feat`、`fix`、`docs`、`refactor`、`test`、`chore`、`build`、`ci`、`perf`、`revert`。
- 提交前检查 `git status --short`，区分自己的改动和已有未提交改动。
- 不要回滚用户或其他代理的改动，除非任务明确要求。
- 交付说明应包含变更摘要、验证命令和未覆盖风险。

## 代理自检清单

- 是否读过相关模块的现有实现和至少一个相似用法？
- 是否沿用了当前后端分层、前端目录和命名习惯？
- 是否避免修改运行产物、日志和无关文件？
- 是否运行了与改动范围匹配的本地验证命令？
- 是否把配置、部署或接口契约变化同步到了文档？
