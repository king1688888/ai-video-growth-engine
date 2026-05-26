# AIcoding 执行规约（Agent Governance Protocol）

> 权威文档：D23（`AICODING_AGENT_EXECUTION_PROTOCOL`）  
> 本文件是 D23 的仓库级落地摘要，所有 AIcoding Agent 在开始任务前必须阅读。

---

## 1. 核心原则

```text
先读文档，再做计划；
先锁契约，再写代码；
先做真实逻辑，再做页面表达；
先有测试证据，再说完成；
先过风控合规，再允许导出；
先记录成本日志，再允许扣费；
先交接清楚，再进入下一个 Agent。
```

## 2. 执行流程（不可跳步）

1. 接收任务卡
2. 读取 D00（根上下文）
3. 读取任务直接相关专项文档
4. **复述**任务目标、边界、不做事项
5. 检查依赖：表/API/Prompt/队列/页面/权限/计费/合规
6. 判断是否需要 Contract Change Request
7. 输出实施计划与拟修改文件清单
8. 创建 Git feature 分支
9. 实现代码/文档/配置
10. 添加或更新测试
11. 运行本地验证命令
12. 生成质量门禁报告
13. 更新 README/CHANGELOG/迁移说明
14. 输出交付说明（按 PR 模板）
15. 提交 PR
16. 等待验收

## 3. 禁止事项

- 不得自行扩大 MVP1 范围
- 不得实现搬运/克隆/洗稿/仿脸/仿声/自动发布
- 不得只做 UI Demo
- 不得用 mock 冒充真实能力（必须 mock 时标记 `is_mock=true`）
- 不得跳过数据库/API/任务队列/日志/成本记录/积分扣费/风控/权限/测试/交接
- 不得写死 API Key、密钥、账号密码
- 不得直接修改 main 分支

## 4. 契约权威

| 领域 | 权威文档 | 变更方式 |
|------|----------|----------|
| 数据库/API | D16 | Contract Change Request |
| 任务状态机 | D17 | Contract Change Request |
| 计费/积分 | D19 | Contract Change Request |
| 合规/风控 | D21 | 更严格规则优先 |
| 测试/发布门禁 | D20 | 不可绕过 |
| Agent 行为 | D23 | Owner 审批 |

## 5. 交付必需项

每次 PR 必须包含（参见 `.github/PULL_REQUEST_TEMPLATE.md`）：

- 关联文档和 Issue
- 实现范围与不做范围
- 数据库/API/队列/Prompt/计费/合规影响
- 测试命令和结果
- 风险说明
- 回滚方式
- 未完成项
- 是否需要回写文档

## 6. Mock 规则

| 场景 | 允许 | 要求 |
|------|------|------|
| 本地开发 | 是 | 放在 `fixtures/` 或 `mocks/`，显示 Demo 标识 |
| 前端联调 | 是 | 必须标记 `is_mock=true` |
| 集成测试 | 仅第三方不可用时 | 必须有真实逻辑测试覆盖 |
| 验收/生产 | **否** | Mock 不得作为验收通过依据 |

## 7. 相关文件

- `MANUS.md` — Manus Agent 专属配置
- `CONTRIBUTING.md` — 贡献指南
- `SECURITY.md` — 安全策略
- `.github/PULL_REQUEST_TEMPLATE.md` — PR 模板
- `.github/ISSUE_TEMPLATE/agent_task.yml` — 任务卡模板
- `docs/handoff/module_handoff_template.md` — 模块交接模板
- `docs/acceptance/acceptance_evidence_template.md` — 验收证据模板

---

*本文件由 Manus Agent 基于 D23 自动生成。完整规约请参阅 `docs/product/D23.md`。*
