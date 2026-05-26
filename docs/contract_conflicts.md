# 契约冲突登记（Contract Conflicts）

> 版本：V1.0  
> 日期：2026-05-26  
> 维护人：Manus Agent（CTO Role）

---

## 当前状态：未发现阻断冲突

经过对 D00、D03-D05、D06-D13、D15-D24 全部文档的交叉比对，当前未发现阻断性契约冲突。

## 已识别的非阻断差异

| # | 差异 | 涉及文档 | 影响 | 处理方式 |
|---|------|----------|------|----------|
| 1 | D15 推荐 Python FastAPI Worker，架构冻结采用 Python + 队列回调模式 | D15 vs 架构冻结 | 低 | 兼容：Python Worker 仍使用 FastAPI 作为健康检查和内部 API，主通信走 BullMQ |
| 2 | D00 文档地图编号与实际文件编号不一致（D18-D23） | D00 vs D18-D24 | 低 | 已在 document_index.md 记录，使用 doc_alias 解决 |
| 3 | D16 提到 `video_input_sources` 表，D17 DAG 中直接使用 `source_asset_id` | D16 vs D17 | 低 | 兼容：`video_input_sources` 作为来源元数据表，`source_asset_id` 引用 `assets` 表 |
| 4 | D15 提到 Prometheus/Grafana，部署计划首选 Grafana Cloud Free | D15 vs 部署计划 | 低 | 兼容：Grafana Cloud Free 包含 Prometheus 兼容数据源 |

## 潜在风险点（非冲突，需关注）

| # | 风险点 | 说明 | 监控方式 |
|---|--------|------|----------|
| 1 | Python Worker 与 Node 队列通信 | BullMQ 原生是 Node 库，Python Worker 需要通过 HTTP 回调或 Redis 直接消费 | Phase 1 验证 POC |
| 2 | Prisma 与复杂 JSONB 查询 | Content DNA 等 JSONB 字段可能需要 raw SQL | 开发时评估，必要时补充 raw query |
| 3 | Cloudflare R2 中国大陆访问速度 | 如首发用户在国内，可能需要切换到阿里 OSS | OQ-04 部署环境决策后确认 |

## 变更控制

如果后续开发中发现真正的契约冲突，必须：

1. 在本文件登记冲突
2. 提交 ContractChangeRequest（按 `docs/schemas/contract_change_request.schema.json`）
3. 等待 Owner 审批
4. 实施变更并回写相关文档

---

*本文档由 Manus Agent 自动生成。当前无阻断冲突，可安全进入工程实施阶段。*
