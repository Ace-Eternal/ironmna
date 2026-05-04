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
