# 操作日志

- 2026-05-04 Codex：扫描前后端结构，确认首页原为静态 ECharts 示例数据，业务表为 `customer`、`t_order`、`order_item`。
- 2026-05-04 Codex：只读查询远端 MySQL，确认有效订单、客户、材料、金额、客户排行和材料排行基础数据。
- 2026-05-04 Codex：新增 `GET /dashboard/home` 聚合接口和 dashboard 服务。
- 2026-05-04 Codex：扩展 `GET /order/getOrderList` 可选筛选参数 `customerId`、`month`、`materialType`、`steelType`。
- 2026-05-04 Codex：将首页改为请求真实 dashboard 数据，补充经营指标卡、趋势图、客户排行、材料类型占比、钢号排行、最近订单表。
- 2026-05-04 Codex：验证发现部分有效材料明细挂在已删除订单下，调整 dashboard 材料统计为“有效订单下的有效明细”。
- 2026-05-04 Codex：执行 `mvn test`、`pnpm build` 和本地接口冒烟验证。
- 2026-05-04 Codex：按用户要求在本地执行 `mvn clean package -DskipTests` 和 `pnpm build`，上传 jar 与前端 dist 包到服务器，服务器仅替换产物并重启服务，未执行服务器构建。
- 2026-05-04 Codex：更新 `DEPLOYMENT.md`，沉淀生产部署流程，并明确服务器内存不足，必须本地打包，禁止服务器构建。
- 2026-05-04 Codex：排查公网空白页，确认 Vite 相对资源路径导致嵌套路由刷新时 JS 加载为 HTML；将 `base` 改为 `/`，本地重打前端并仅替换服务器 dist。
- 2026-05-04 Codex：按用户要求将公网根路径 `/` 在 Nginx 层重定向到 `/login#/login`，并同步更新仓库 Nginx 模板和验证文档。
- 2026-05-04 Codex：将空白页排查、Vite `base` 规则、根路径登录重定向和验证命令沉淀到 `DEPLOYMENT.md`。
