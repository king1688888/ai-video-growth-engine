# 验收证据索引（Evidence Index）

> 日期: 2026-05-26

---

## PR 证据链

| Phase | PR | 内容 | 状态 |
|-------|-----|------|------|
| 0 | #4 | 文档索引/计划/风险 | ✅ Merged |
| 2 | #5 | Agent 治理协议 | ✅ Merged |
| CI | #6 | CI Workflow | ✅ Merged |
| 3 | #7 | 架构冻结（16文档） | Open |
| 4 | #8 | 工程骨架（42文件） | Open |
| 5 | #9 | 核心 DB/API/Queue | Open |
| 6 | #10 | AI 核心链路 | Open |
| 7 | #11 | 计费/合规/安全 | Open |
| 8 | #12 | 前端/E2E | Open |
| 9 | #13 | 测试门禁/验收 | Pending |

## 测试证据

| 测试套件 | 结果 | 命令 |
|----------|------|------|
| Prompt Registry (4) | ✅ ALL PASS | `python3 workers/ai-engine/tests/test_prompt_registry.py` |
| Risk Engine (7) | ✅ ALL PASS | `python3 workers/ai-engine/tests/test_risk_engine.py` |
| Billing Idempotency (7) | ✅ ALL PASS | `npx tsx tests/billing/test_credit_service.ts` |
| Compliance (6) | ✅ ALL PASS | `npx tsx tests/compliance/test_compliance_service.ts` |
| Security/RBAC (5) | ✅ ALL PASS | `npx tsx tests/security/test_rbac.ts` |
| E2E Spec (4 flows) | ✅ VALIDATED | `npx tsx tests/e2e/main-flow.spec.ts` |
| **合计** | **29/29 + 4 flows** | |

## 文档证据

| 文档 | 位置 |
|------|------|
| 文档索引 | docs/document_index.md |
| 执行总计划 | docs/implementation_master_plan.md |
| 权威关系图 | docs/contract_authority_map.md |
| 风险登记簿 | docs/risk_register.md |
| 架构冻结（14文档） | docs/architecture/*.md |
| ADR-0001 Agent 治理 | docs/decisions/ADR-0001-agent-governance.md |
| ADR-0002 技术栈 | docs/decisions/ADR-0002-tech-stack.md |
| 契约冲突 | docs/contract_conflicts.md |

---

*本索引汇总所有验收证据。*
