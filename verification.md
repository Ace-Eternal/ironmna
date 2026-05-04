# 验证报告

- 日期：2026-05-04
- 执行者：Codex

## 结果

- 后端 `mvn test` 通过，完成新增 dashboard 接口与订单筛选接口编译验证。
- 前端 `pnpm build` 通过，首页可构建为生产资源。
- 本地后端连接远端 MySQL 后，`/iron/dashboard/home` 返回真实经营看板数据。
- 订单列表筛选参数 `customerId`、`month`、`materialType`、`steelType` 已完成接口冒烟验证。

## 口径说明

材料明细、材料重量、材料类型、钢号排行统一统计“有效订单下的有效材料明细”。远端库中存在挂在已删除订单下的有效材料明细；若只按 `order_item.is_deleted=0` 统计，会导致首页材料图点击到账单列表为空。

## 遗留风险

- 现有测试框架未实际运行测试用例，`mvn test` 报告 `Tests run: 0`。
- 未做浏览器自动截图验证；前端已启动在 `http://127.0.0.1:8201/`，可直接登录后查看首页。

## 部署验证

- 日期：2026-05-04
- 执行者：Codex
- 本地构建：`mvn clean package -DskipTests` 生成后端 jar；`pnpm build` 生成前端 `dist`。
- 服务器动作：仅上传本地构建产物、解压前端静态文件、替换 jar、重启 Java 进程、reload Nginx；未在服务器执行构建。
- 部署目录：`/home/ubuntu/ironman/react`
- 备份目录：`/home/ubuntu/ironman/react/backups/20260504211904`
- 公网前端：`http://106.54.35.68/` 返回 `200 OK`
- 公网接口：`http://106.54.35.68/iron/dashboard/home` 返回 `code=0`

## 前端空白页修复验证

- 日期：2026-05-04
- 执行者：Codex
- 原因：生产 HTML 使用 `./assets/...` 相对资源路径，刷新 `/login`、`/home` 等前端路由时会请求 `/login/assets/...` 或 `/home/assets/...`，Nginx 返回 `index.html`，浏览器无法按 JavaScript 模块加载，导致空白页。
- 修复：将 Vite `base` 调整为 `/`，本地重新执行 `pnpm build`，仅上传并替换服务器前端 `dist`，未在服务器构建。
- 验证：`http://106.54.35.68/`、`http://106.54.35.68/login`、`http://106.54.35.68/home` 均返回引用 `/assets/...` 的 HTML；`/assets/index-5a21fae8.js` 返回 `Content-Type: application/javascript`。

## 根路径登录重定向验证

- 日期：2026-05-04
- 执行者：Codex
- 修复：线上 Nginx `location = /` 返回 `302 /login#/login`；仓库 Nginx 模板同步增加该规则。
- 验证：`curl -I http://106.54.35.68/` 返回 `302 Moved Temporarily`，`Location: http://106.54.35.68/login#/login`；`http://106.54.35.68/login` 返回 `200 OK`；`/iron/dashboard/home` 仍返回 `code=0`。

## 经验沉淀

- 前端空白页不要只看 `/` 是否返回 `200 OK`，还必须检查入口 JS 的 `Content-Type` 是否为 `application/javascript`。
- Vite 单页应用部署在域名根路径时，生产 `base` 应保持为 `/`，避免嵌套路由刷新后资源路径变成 `/login/assets/...`。
- 用户入口是裸域名或裸 IP 时，Nginx 应显式配置 `location = /` 重定向到登录页，避免依赖前端运行后再跳转。
- 每次替换前端 `dist` 后，应同时验证 `/`、`/login`、`/home` 和 `/iron/dashboard/home`。
