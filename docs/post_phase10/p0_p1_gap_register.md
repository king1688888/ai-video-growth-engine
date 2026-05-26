# P0/P1 差距登记簿（Phase 13 更新）

> 最后更新: 2026-05-26 Phase 13  
> 基于: phase_0_10_evidence_audit.md

---

## P0 差距

| ID | 差距 | 状态 | 修复证据 |
|----|------|------|----------|
| P0-01 | PR #7-#14 未合并到 main | ✅ **已修复** | 所有 PR 已合并，main 有 162 文件 |
| P0-02 | pnpm install 未执行 | ✅ **已修复** | pnpm install 成功，Done in 15.1s |
| P0-03 | Prisma migrate 未执行 | ❌ 未修复 | 需要真实 DB 连接（Owner 配置） |
| P0-04 | API 业务逻辑全部 TODO | ❌ 未修复 | 大量工作，需后续阶段逐步实现 |
| P0-05 | JWT 认证未实现 | ❌ 未修复 | 需实现 auth module |
| P0-06 | BullMQ 未连接 Redis | ❌ 未修复 | 需要真实 Redis（Owner 配置） |
| P0-07 | 真实模型调用未配置 | ❌ 未修复 | 需要 Owner 配置 API Key |
| P0-08 | 前端未安装依赖 | ✅ **已修复** | pnpm install 包含前端依赖 |
| P0-09 | 无监控告警 | ❌ 未修复 | 需部署时配置 |
| P0-10 | 无 staging 环境 | ❌ 未修复 | 需 Owner 部署 |
| P0-11 | E2E 未在真实环境执行 | ❌ 未修复 | 需前后端联调 |
| P0-12 | CI 未检查代码 | ⚠️ 待更新 | 需通过浏览器更新 workflow |

## 修复进度

| 状态 | 数量 |
|------|------|
| ✅ 已修复 | 3 (P0-01, P0-02, P0-08) |
| ❌ 未修复 | 8 (P0-03~07, P0-09~11) |
| ⚠️ 待更新 | 1 (P0-12) |

## 剩余 P0 分类

### Owner 必须手动完成（Manus 无法执行）

| ID | 动作 |
|----|------|
| P0-03 | 配置 PostgreSQL + DATABASE_URL |
| P0-06 | 配置 Redis + REDIS_URL |
| P0-07 | 配置 OPENAI_API_KEY + 设置 FEATURE_MOCK_AI=false |
| P0-09 | 配置 Sentry DSN + Grafana |
| P0-10 | 在 Railway/Render 创建项目并部署 |

### Manus 可在后续阶段修复

| ID | 动作 | 阶段 |
|----|------|------|
| P0-04 | 实现 API 业务逻辑 | 14-16 |
| P0-05 | 实现 JWT 认证 | 14 |
| P0-11 | 执行 E2E | 16 |
| P0-12 | 更新 CI workflow | 14 |

---

## P1 差距（无变化）

P1-01 ~ P1-10 保持不变，待内测期间解决。

---

## 测试回归证据

Phase 13 合并后，在 main 分支上重新运行所有测试：

```
All prompt registry tests passed! (4/4)
All risk engine tests passed! (7/7)
All billing tests passed! (7/7)
All compliance tests passed! (6/6)
All security/RBAC tests passed! (5/5)
Total: 29/29 PASS
```

---

*本登记簿随修复进展持续更新。*
