# Mock 依赖审计

> 审计日期: 2026-05-26

---

## 当前 Mock 依赖

| # | Mock 项 | 位置 | 生产风险 | 隔离状态 |
|---|---------|------|----------|----------|
| 1 | MockProviderAdapter | workers/ai-engine/src/providers/model_router.py | 高 | ✅ 生产自动禁用（环境检查） |
| 2 | MockASRProvider | workers/video-processor/src/providers.py | 高 | ✅ 生产自动禁用 |
| 3 | MockOCRProvider | workers/video-processor/src/providers.py | 高 | ✅ 生产自动禁用 |
| 4 | FEATURE_MOCK_AI=true | .env.example | 高 | ⚠️ 需确保生产为 false |
| 5 | IS_PAYMENT_MOCK=true | packages/billing/src/credit-service.ts | 高 | ⚠️ 需确保生产为 false |
| 6 | CreditService 内存实现 | packages/billing/src/credit-service.ts | 高 | ❌ 生产需替换为 Prisma |
| 7 | API TODO placeholder | apps/api/src/*/controller.ts | 高 | ❌ 生产返回假数据 |
| 8 | 环境变量 placeholder | .env.example (sk-placeholder) | 中 | ✅ validateProductionEnvironment 检测 |

## 生产安全检查

已实现的安全检查（packages/shared/src/guards/rbac.ts）：
- ✅ `FEATURE_MOCK_AI=true` 在生产会被检测
- ✅ `sk-placeholder` API Key 在生产会被检测
- ✅ 默认 JWT Secret 在生产会被检测
- ✅ Dev DB 密码在生产会被检测

## 未隔离的 Mock 风险

| # | 风险 | 严重度 | 修复方式 |
|---|------|--------|----------|
| 1 | CreditService 内存实现在生产会丢失数据 | P0 | 替换为 Prisma 事务 |
| 2 | API TODO 在生产返回 placeholder | P0 | 实现真实业务逻辑 |

---
