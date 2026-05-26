# GitHub × Manus 连接方式审计报告

> 审计时间：2026-05-26  
> 审计人：Manus Agent（自动化研发接入 Agent）  
> 仓库：king1688888/ai-video-growth-engine  
> 仓库地址：https://github.com/king1688888/ai-video-growth-engine

---

## 1. 连接方式概述

| 检查项 | 结果 | 说明 |
|--------|------|------|
| Token 类型 | `ghu_*`（GitHub User Token） | 由 Manus GitHub Integration 自动注入 |
| 认证协议 | HTTPS | 通过 GH_TOKEN 环境变量认证 |
| 登录账户 | king1688888 | 即仓库 Owner |
| Git 用户名 | king1688888 | 全局配置 |
| Git 邮箱 | noreply@users.noreply.github.com | GitHub 隐私邮箱 |
| 权限级别 | admin / maintain / push / pull / triage | 完整管理员权限 |

## 2. 连接方式分析

### 2.1 是否官方 GitHub Integration 自动同步 main？

**否。** Manus 使用的是 GitHub User Token（`ghu_*` 前缀），通过 Manus 平台的 GitHub Connector 注入。这不是 GitHub App 自动同步机制，而是基于用户授权的 OAuth token。Manus **不会**自动同步任何内容到 main 分支，所有 git 操作均为 Agent 显式执行。

### 2.2 是否能通过 GitHub Connector 创建 branch + PR？

**是。** 经实际测试验证：

- **创建分支**：✅ 成功（已测试 `test-manus-connection` 分支）
- **推送分支**：✅ 成功
- **创建 PR**：✅ 成功（PR #1 已创建并关闭）
- **关闭 PR**：✅ 成功
- **删除远程分支**：✅ 成功

### 2.3 是否需要 Browser Operator 操作 GitHub 页面？

**不需要。** `gh` CLI 和 Git 命令行已能完成所有必要操作：

- 分支管理
- PR 创建/审查/合并/关闭
- API 调用（仓库设置、分支保护等）
- Workflow 管理

仅在以下场景可能需要浏览器：
- GitHub Settings 页面中某些 UI-only 配置（如 Environments、某些安全设置的启用）
- 需要人工审批的 PR review

## 3. 能力边界

| 能力 | 支持 | 备注 |
|------|------|------|
| 直接 push main | ✅ 可以但**不应该** | main 未保护，技术上可行 |
| 创建 feature branch | ✅ | 推荐工作方式 |
| 创建 PR | ✅ | 通过 `gh pr create` |
| 合并 PR | ✅ | 有 admin 权限 |
| 设置分支保护 | ✅ | 有 admin 权限，可通过 API 设置 |
| 配置 GitHub Actions | ✅ | 可创建 workflow 文件 |
| 管理 Secrets | ⚠️ | 可通过 API 设置，但不应读取 |
| 配置 Dependabot | ✅ | 可创建配置文件 |
| 配置 CodeQL | ⚠️ | 需要 GitHub Advanced Security（Public 仓库免费） |

## 4. 安全风险评估

### 4.1 高风险项

| 风险 | 等级 | 说明 |
|------|------|------|
| main 分支无保护 | 🔴 高 | 任何 push 直接生效，无审查 |
| Manus 有 admin 权限 | 🟡 中 | 可执行任何仓库操作 |
| 仓库为 Public | 🟡 中 | 代码公开可见，需防止敏感信息泄露 |
| 无 required status checks | 🔴 高 | 无 CI 验证即可合并 |

### 4.2 已有安全措施

| 措施 | 状态 |
|------|------|
| Secret Scanning | ✅ 已启用 |
| Secret Scanning Push Protection | ✅ 已启用 |
| Secret Scanning Non-Provider Patterns | ❌ 未启用 |
| Secret Scanning Validity Checks | ❌ 未启用 |
| Dependabot Security Updates | ❌ 未启用 |
| Dependabot Vulnerability Alerts | ❌ 未启用 |
| CodeQL / Code Scanning | ❌ 未配置 |

## 5. 执行模式建议

### 推荐模式：单仓库受控模式（feature branch → PR → protected main）

**理由：**

1. Manus 已验证可以创建分支和 PR，无需双仓库。
2. 仓库 Owner 即为操作账户，权限充足。
3. 通过设置分支保护规则，可阻止 Manus 直接 push main。
4. Public 仓库在 GitHub Free 计划下支持分支保护规则。

**工作流程：**

```
Manus Agent
    │
    ├── 1. 从 main 创建 feature/xxx 分支
    ├── 2. 在 feature 分支上开发和提交
    ├── 3. 推送 feature 分支到 origin
    ├── 4. 创建 PR（feature → main）
    ├── 5. CI 自动运行检查
    │
Owner（人工）
    ├── 6. Review PR
    └── 7. Approve & Merge
```

### 不推荐双仓库模式的原因

- 增加管理复杂度
- 当前场景下单仓库 + 分支保护已足够
- Owner 即为唯一开发者，无需跨组织协作

## 6. 结论

Manus 与 GitHub 的连接方式安全可控，具备完整的分支管理和 PR 工作流能力。**关键前提是必须立即配置 main 分支保护规则**，否则 Manus 技术上可以直接 push main，违反项目安全要求。

---

*本文档由 Manus Agent 自动生成，作为仓库安全审计的一部分。*
