# ADR-0001: AIcoding Agent 治理模式

> 状态：已接受  
> 日期：2026-05-26  
> 决策者：项目 Owner + Manus Agent  
> 权威文档：D23（`AICODING_AGENT_EXECUTION_PROTOCOL`）

---

## 背景

本项目采用 AIcoding Agent（Manus/Codex/Claude Code）驱动开发。AI Agent 具备高效率但也存在以下风险：范围蔓延、只做 UI Demo、跳过风控/计费/测试、硬编码密钥、多 Agent 契约冲突、交接断档。需要一套治理机制确保 Agent 行为可控、可审计、可交接。

## 决策

采用 **单仓库受控模式 + 统一执行规约 + 结构化交付** 的 Agent 治理方案。

### 核心决策点

| # | 决策 | 理由 |
|---|------|------|
| 1 | 单仓库 + 分支保护 + PR 模式 | 简化管理，Owner 可审批每次变更 |
| 2 | 统一 PR 模板（强制影响分析） | 防止 Agent 跳过风控/计费/合规检查 |
| 3 | 统一 Issue 模板（任务卡标准化） | 确保任务输入完整，防止范围蔓延 |
| 4 | JSON Schema 定义交付结构 | 使交付可机器校验，不依赖自然语言 |
| 5 | Contract Change Request 机制 | 防止多 Agent 各自修改硬契约 |
| 6 | 模块交接报告强制化 | 确保 Agent 切换时不丢失上下文 |
| 7 | doc_alias 替代硬编码编号 | 解决文档编号演进导致的引用失效 |
| 8 | enforce_admins=true | 即使 admin 也不能绕过 PR 审批 |

### 工作流

```text
Owner 创建 Issue（任务卡）
  → Agent 读取文档
  → Agent 复述边界
  → Agent 创建 feature branch
  → Agent 实现 + 测试
  → Agent 提交 PR（按模板）
  → CI 自动检查
  → Owner Review + Approve
  → Merge to main
  → Agent 更新交接文档
```

## 替代方案（已否决）

| 方案 | 否决理由 |
|------|----------|
| 双仓库模式（staging → production） | 增加管理复杂度，当前单人 Owner 不需要 |
| 无 PR 模板（自由格式） | Agent 会跳过影响分析，导致合规/计费遗漏 |
| 无 Issue 模板（口头派活） | 任务边界不清，Agent 自行扩展范围 |
| 允许直接 push main | 无审查机制，高风险 |
| 人工文档管理（不用 Schema） | 不可机器校验，Agent 交付格式不统一 |

## 影响

| 影响领域 | 说明 |
|----------|------|
| 开发效率 | 略有下降（需填写模板），但减少返工 |
| 质量保障 | 显著提升（强制测试/影响分析/风控检查） |
| 可维护性 | 显著提升（交接文档/启动命令/回滚方案） |
| 可审计性 | 显著提升（PR 历史/Issue 追踪/Schema 校验） |
| Owner 负担 | 需要审批 PR，但模板化降低审批成本 |

## 实施

本 ADR 通过以下文件落地：

| 文件 | 作用 |
|------|------|
| `AICODING.md` | Agent 执行规约摘要（仓库入口） |
| `MANUS.md` | Manus Agent 专属配置 |
| `CONTRIBUTING.md` | 贡献指南 |
| `SECURITY.md` | 安全策略 |
| `.github/PULL_REQUEST_TEMPLATE.md` | PR 强制模板 |
| `.github/ISSUE_TEMPLATE/agent_task.yml` | 任务卡模板 |
| `docs/handoff/module_handoff_template.md` | 交接模板 |
| `docs/acceptance/acceptance_evidence_template.md` | 验收证据模板 |
| `docs/schemas/*.schema.json` | 结构化交付 Schema |

## 后续

- Phase 1 开始后，每个模块的 PR 必须按本治理模式执行
- 如果发现治理过重影响效率，可通过新 ADR 调整
- CI workflow 配置后，可自动校验 PR 模板完整性

---

*本 ADR 由 Manus Agent 基于 D23 自动生成。*
