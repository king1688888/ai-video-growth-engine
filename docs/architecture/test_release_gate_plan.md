# 测试与发布门禁计划

> 权威文档：D20  
> 日期：2026-05-26

---

## 测试分层

| 层级 | 工具 | 覆盖范围 | 触发时机 |
|------|------|----------|----------|
| 单元测试 | Vitest (TS) / pytest (Python) | 模块内部逻辑 | 每次 commit |
| 集成测试 | Vitest + Supertest | API + DB + 队列 | PR |
| API 契约测试 | Zod Schema 校验 | 请求/响应结构 | PR |
| E2E 测试 | Playwright | 主流程端到端 | PR + 发布前 |
| AI Benchmark | 自定义框架 | Prompt 输出质量 | Prompt 变更时 |
| 安全扫描 | GitHub Secret Scanning + 自定义 | 密钥泄露 | 每次 push |

## 发布门禁（D20 G1-G9）

| 门禁 | 检查内容 | 阻塞发布 |
|------|----------|----------|
| G1 范围门禁 | 未超出 MVP1 范围 | 是 |
| G2 数据/API 门禁 | D16 契约一致 | 是 |
| G3 异步任务门禁 | D17 状态机正确 | 是 |
| G4 AI 质量门禁 | Benchmark 通过 | 是 |
| G5 合规门禁 | D21 底线满足 | 是 |
| G6 计费门禁 | D19 幂等正确 | 是 |
| G7 安全门禁 | D18 要求满足 | 是 |
| G8 E2E 门禁 | 主流程通过 | 是 |
| G9 监控门禁 | 可观测 | 是 |

## MVP1 出口条件

| # | 条件 | 验证方式 |
|---|------|----------|
| 1 | 主流程 100 条测试成功率 ≥ 80% | E2E 自动化 |
| 2 | JSON Schema 合法率 ≥ 95% | Schema 校验测试 |
| 3 | 高风险拦截准确率 ≥ 90% | 风控 Benchmark |
| 4 | 积分幂等 | 并发压力测试 |
| 5 | 后台可追踪 | 后台功能验证 |
| 6 | ≥ 30 真实样本 | 内测数据 |
| 7 | 脚本可用率 ≥ 60% | 人工评估 |

## CI/CD 流水线

```text
Push/PR → lint + typecheck → unit tests → build
  → integration tests → API contract tests
  → (PR merge) → staging deploy → smoke test
  → (release tag) → production deploy → health check → monitor
```

## 回滚策略

- 数据库：迁移支持 down 操作
- 应用：Docker 镜像版本回退
- 配置：Feature Flag 关闭新功能
- Prompt：回退到上一个 active 版本

---

*本文档为 MVP1 架构冻结版本。发布门禁以 D20 为权威。*
