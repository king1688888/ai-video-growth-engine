# 阶段 0-10 产物索引（Artifact Index）

> 日期: 2026-05-26

---

## Phase 0 — 文档理解与规划（PR #4, MERGED）

| 文件路径 | 说明 |
|----------|------|
| `docs/document_index.md` | D00-D24 文档总索引 + 编号冲突声明 |
| `docs/implementation_master_plan.md` | 15 阶段执行总计划 |
| `docs/contract_authority_map.md` | 文档权威关系图 |
| `docs/risk_register.md` | P0/P1/P2 风险登记簿（33项） |
| `docs/open_questions.md` | 12 个开放问题 + 18 个默认决策 |
| `docs/agent_work_log.md` | Agent 工作日志 |

## Phase 2 — Agent 治理协议（PR #5, MERGED）

| 文件路径 | 说明 |
|----------|------|
| `AICODING.md` | Agent 执行规约摘要 |
| `MANUS.md` | Manus Agent 专属配置 |
| `CONTRIBUTING.md` | 贡献指南 |
| `SECURITY.md` | 安全策略 |
| `.github/PULL_REQUEST_TEMPLATE.md` | PR 强制模板 |
| `.github/ISSUE_TEMPLATE/agent_task.yml` | 任务卡模板 |
| `docs/handoff/module_handoff_template.md` | 交接模板 |
| `docs/acceptance/acceptance_evidence_template.md` | 验收证据模板 |
| `docs/schemas/*.schema.json` (6个) | 结构化交付 Schema |
| `docs/decisions/ADR-0001-agent-governance.md` | Agent 治理 ADR |

## Phase 3 — 架构冻结（PR #7, OPEN）

| 文件路径 | 说明 |
|----------|------|
| `docs/architecture/technical_architecture_final.md` | 技术栈 + 服务拓扑 |
| `docs/architecture/module_boundary_final.md` | M00-M14 模块边界 |
| `docs/architecture/data_flow_final.md` | 主数据流 |
| `docs/architecture/database_schema_final_plan.md` | 24 表迁移计划 |
| `docs/architecture/api_contract_final_plan.md` | 30+ API 端点 |
| `docs/architecture/async_task_state_machine_final.md` | 四层任务模型 + DAG |
| `docs/architecture/object_storage_lifecycle_plan.md` | S3 Bucket + 生命周期 |
| `docs/architecture/prompt_registry_plan.md` | 10 个 P0 Prompt |
| `docs/architecture/model_router_plan.md` | Provider Adapter + 降级 |
| `docs/architecture/billing_credit_plan.md` | 积分幂等规则 |
| `docs/architecture/risk_compliance_plan.md` | R0-R5 风控链路 |
| `docs/architecture/security_permission_plan.md` | RBAC + 脱敏 |
| `docs/architecture/test_release_gate_plan.md` | D20 门禁 |
| `docs/architecture/deployment_plan.md` | Vercel + Railway |
| `docs/decisions/ADR-0002-tech-stack.md` | 技术栈 ADR |
| `docs/contract_conflicts.md` | 无阻断冲突 |

## Phase 4 — 工程骨架（PR #8, OPEN）

| 文件路径 | 说明 |
|----------|------|
| `package.json`, `turbo.json`, `pnpm-workspace.yaml` | Monorepo 配置 |
| `tsconfig.json`, `.prettierrc` | TypeScript + 格式化 |
| `apps/api/*` | NestJS API 骨架 + /health |
| `apps/web/*` | Next.js 前端骨架 |
| `apps/worker/*` | Node Worker 占位 |
| `packages/shared/*` | 共享类型/常量/错误码 |
| `packages/{database,ai-core,prompts,risk,billing,testing}/*` | 包占位 |
| `docker-compose.yml` | PostgreSQL + Redis + MinIO |
| `.env.example` | 环境变量模板 |
| `docs/setup/local_development.md` | 本地开发指南 |
| `docs/setup/environment_variables.md` | 环境变量说明 |

## Phase 5 — 核心 DB/API/Queue（PR #9, OPEN）

| 文件路径 | 说明 |
|----------|------|
| `packages/database/prisma/schema.prisma` | 24 表 + 11 枚举 |
| `packages/shared/src/types.ts` | 完整枚举定义 |
| `apps/api/src/{auth,profile,asset,task,billing,report,export,admin,queue}/*` | 全部 P0 API 模块 |

## Phase 6 — AI 核心链路（PR #10, OPEN）

| 文件路径 | 说明 |
|----------|------|
| `workers/video-processor/src/{main,processor,providers}.py` | 视频处理 Worker |
| `workers/ai-engine/src/prompts/registry.py` | 10 个 P0 Prompt |
| `workers/ai-engine/src/providers/model_router.py` | Model Router + Adapter |
| `workers/ai-engine/src/schemas/{content_dna,creative_ir}.json` | JSON Schema |
| `workers/ai-engine/src/pipelines/risk_engine.py` | 风控质检引擎 |
| `workers/ai-engine/tests/test_prompt_registry.py` | Prompt 测试（4） |
| `workers/ai-engine/tests/test_risk_engine.py` | 风控测试（7） |
| `fixtures/benchmark_samples/*` | Benchmark 最小集 |

## Phase 7 — 计费/合规/安全（PR #11, OPEN）

| 文件路径 | 说明 |
|----------|------|
| `packages/billing/src/credit-service.ts` | 积分服务（幂等） |
| `packages/risk/src/compliance-service.ts` | 合规服务 |
| `packages/shared/src/guards/rbac.ts` | RBAC + 脱敏 |
| `tests/billing/test_credit_service.ts` | 计费测试（7） |
| `tests/compliance/test_compliance_service.ts` | 合规测试（6） |
| `tests/security/test_rbac.ts` | 安全测试（5） |

## Phase 8 — 前端/E2E（PR #12, OPEN）

| 文件路径 | 说明 |
|----------|------|
| `apps/web/src/app/{auth,workspace,task,result,admin}/*` | 6 核心页面 |
| `apps/web/src/lib/api-client.ts` | API 客户端 |
| `tests/e2e/main-flow.spec.ts` | E2E 规范（4流程36步） |

## Phase 9 — 测试门禁/验收（PR #13, OPEN）

| 文件路径 | 说明 |
|----------|------|
| `docs/acceptance/final_acceptance_report.md` | 最终验收报告 |
| `docs/acceptance/gate_results.md` | 门禁结果 |
| `docs/acceptance/known_issues.md` | 已知问题 |
| `docs/acceptance/release_runbook.md` | 发布手册 |
| `docs/acceptance/rollback_plan.md` | 回滚方案 |
| `docs/acceptance/evidence_index.md` | 证据索引 |
| `docs/acceptance/owner_signoff_checklist.md` | Owner 签署清单 |

## Phase 10 — 迭代治理（PR #14, OPEN）

| 文件路径 | 说明 |
|----------|------|
| `docs/governance/iteration_policy.md` | 迭代总政策 |
| `docs/governance/prompt_change_policy.md` | Prompt 变更政策 |
| `docs/governance/model_change_policy.md` | 模型变更政策 |
| `docs/governance/risk_threshold_change_policy.md` | 风控变更政策 |
| `docs/governance/billing_change_policy.md` | 计费变更政策 |
| `docs/governance/incident_review_template.md` | 事故复盘模板 |
| `docs/governance/monthly_quality_review_template.md` | 月度回顾模板 |
| `docs/governance/feature_flag_policy.md` | Feature Flag 政策 |
| `docs/governance/versioning_policy.md` | 版本治理 |
| `docs/governance/roadmap_mvp1_5_mvp2.md` | 后续路线图 |

---

*本索引记录阶段 0-10 的全部产物路径。*
