# 贡献指南（Contributing Guide）

> 本项目由 AIcoding Agent（Manus/Codex/Claude Code）驱动开发，人类 Owner 负责审批和决策。

---

## 1. 贡献流程

```text
1. 阅读 AICODING.md 和相关产品文档
2. 创建 Issue（使用 agent_task 模板）或接收任务
3. 从 main 创建 feature 分支
4. 按 D23 执行规约开发
5. 提交 PR（使用 PR 模板）
6. 等待 CI 通过 + Owner Review
7. 合并到 main
```

## 2. 分支规则

- `main`：受保护，禁止直接 push、禁止 force push
- 所有变更必须通过 PR
- PR 需要至少 1 人审批
- PR 需要 CI 通过（status checks 配置后）

## 3. Commit 规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

- `feat(scope):` 新功能
- `fix(scope):` 修复
- `docs(scope):` 文档
- `refactor(scope):` 重构
- `test(scope):` 测试
- `ci(scope):` CI/CD
- `chore(scope):` 杂项

## 4. PR 要求

每个 PR 必须按照 `.github/PULL_REQUEST_TEMPLATE.md` 填写完整信息，包括：

- 关联文档和 Issue
- 实现范围与不做范围
- 影响分析（数据库/API/队列/Prompt/计费/合规）
- 测试证据
- 风险和回滚方式

## 5. 代码规范

- Python：遵循 PEP 8，使用 type hints
- TypeScript：遵循 ESLint + Prettier
- 所有代码必须有对应测试
- 不得硬编码密钥、密码、API Key
- 不得提交 `.env` 文件

## 6. 文档要求

- 新模块必须有 README
- API 变更必须更新 D16 或提交 Contract Change Request
- Prompt 变更必须记录版本号
- 每个 PR 必须说明是否需要回写产品文档

## 7. 安全要求

- 参见 `SECURITY.md`
- 发现安全漏洞请私下报告，不要公开 Issue

---

*本文件由 Manus Agent 自动生成。*
