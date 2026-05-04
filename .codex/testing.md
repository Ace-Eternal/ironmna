# 测试记录

- 日期：2026-05-04
- 执行者：Codex
- 任务：首页经营数据可视化

## 后端

- 命令：`mvn test`
- 结果：通过
- 备注：当前 Maven Surefire 实际报告 `Tests run: 0`，说明项目现有测试配置未发现可执行测试用例；本次至少完成了后端编译验证。

## 前端

- 命令：`pnpm build`
- 结果：通过
- 备注：构建过程中保留既有 Vite 警告，包括 `mockjs` eval 警告和部分动态导入提示。

## 接口冒烟

- `GET http://127.0.0.1:8888/iron/dashboard/home`：返回 `code=0`，核心指标为订单 8、客户 6、有效订单材料明细 32、重量 914.32、订单金额 5668.96。
- `GET /iron/order/getOrderList?customerId=3`：返回 3 条迪华订单。
- `GET /iron/order/getOrderList?month=2025-10`：返回 2 条 2025-10 订单。
- `GET /iron/order/getOrderList?materialType=方钢`：返回 8 条关联有效订单。
- `GET /iron/order/getOrderList?steelType=P20`：返回 2 条关联有效订单。

## 本地服务

- 后端：`http://127.0.0.1:8888/iron`
- 前端：`http://127.0.0.1:8201/`
