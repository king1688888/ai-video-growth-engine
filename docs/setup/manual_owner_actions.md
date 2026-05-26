# 仓库 Owner 必须手动完成的配置清单

> 创建时间：2026-05-26  
> 仓库：king1688888/ai-video-growth-engine  
> 说明：以下配置项需要仓库 Owner 在 GitHub Web 界面或通过 API 手动完成，Manus Agent 不应自行执行这些操作以确保安全可控。

---

## 🔴 P0 — 必须立即完成（阻塞后续开发）

### 1. 配置 main 分支保护规则

**操作路径：** Settings → Branches → Add branch protection rule

**配置项：**

| 设置项 | 推荐值 | 说明 |
|--------|--------|------|
| Branch name pattern | `main` | 保护 main 分支 |
| Require a pull request before merging | ✅ 启用 | 禁止直接 push |
| Required approvals | 1 | 至少 1 人审批（Owner 自己即可） |
| Dismiss stale pull request approvals | ✅ 启用 | 代码变更后需重新审批 |
| Require status checks to pass | ✅ 启用 | CI 通过才能合并 |
| Require branches to be up to date | ✅ 启用 | 合并前必须与 main 同步 |
| Do not allow bypassing the above settings | ⚠️ 建议启用 | 即使 admin 也不能绕过 |
| Restrict who can push | ✅ 启用 | 仅允许通过 PR 合并 |
| Allow force pushes | ❌ 禁止 | 防止历史篡改 |
| Allow deletions | ❌ 禁止 | 防止分支被删除 |

**快捷操作（通过 GitHub CLI，Owner 可在本地执行）：**

```bash
gh api repos/king1688888/ai-video-growth-engine/branches/main/protection \
  --method PUT \
  --input - <<EOF
{
  "required_status_checks": {
    "strict": true,
    "contexts": []
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
EOF
```

> **注意：** `required_status_checks.contexts` 暂时为空数组，待 CI workflow 配置完成后，需回来添加具体的 check 名称（如 `ci / test`）。

---

### 2. 启用 Dependabot Vulnerability Alerts

**操作路径：** Settings → Code security and analysis

| 设置项 | 操作 |
|--------|------|
| Dependabot alerts | 点击 Enable |
| Dependabot security updates | 点击 Enable |

**或通过 API：**

```bash
gh api repos/king1688888/ai-video-growth-engine/vulnerability-alerts --method PUT
```

---

### 3. 确认仓库可见性

**当前状态：** Public（公开）

**需要确认：**
- 如果项目文档包含商业敏感信息，建议改为 Private
- 如果希望开源或公开展示，保持 Public
- Public 仓库的优势：免费使用 GitHub Actions、CodeQL、Secret Scanning 全部功能

**如需改为 Private：**
Settings → General → Danger Zone → Change repository visibility

---

## 🟡 P1 — 本周内完成（不阻塞但影响安全）

### 4. 启用 CodeQL / Code Scanning

**操作路径：** Settings → Code security and analysis → Code scanning

| 设置项 | 操作 |
|--------|------|
| CodeQL analysis | 点击 Set up → Default |

> **说明：** Public 仓库免费使用 CodeQL。建议在有代码提交后启用，当前仅有文档无需扫描。

---

### 5. 配置 Dependabot 版本更新

**操作：** Manus Agent 可通过 PR 提交 `.github/dependabot.yml` 配置文件，但 Owner 需审批合并。

---

### 6. 审核 GitHub Apps 和 Webhooks

**操作路径：** Settings → Integrations

**检查项：**
- 确认已安装的 GitHub Apps 列表
- 移除不必要的 App 授权
- 检查 Webhooks 是否有异常目标地址

---

## 🟢 P2 — 下周完成（增强安全）

### 7. 启用 Secret Scanning Non-Provider Patterns

**操作路径：** Settings → Code security and analysis

| 设置项 | 操作 |
|--------|------|
| Secret scanning → Scan for non-provider patterns | 点击 Enable |

---

### 8. 配置 Environments（可选）

如果后续需要部署，建议配置：
- `staging` 环境：无需审批
- `production` 环境：需要 Owner 手动审批

**操作路径：** Settings → Environments → New environment

---

### 9. 配置 Repository Secrets（后续需要时）

当项目需要 API Keys 时：

**操作路径：** Settings → Secrets and variables → Actions

**原则：**
- 所有密钥通过 GitHub Secrets 管理
- Manus Agent 不得读取或导出任何 Secret
- Secret 名称遵循 `SERVICE_API_KEY` 格式

---

## 验证清单

完成上述配置后，请逐项验证：

| # | 验证项 | 验证方法 | 通过 |
|---|--------|----------|------|
| 1 | main 分支保护生效 | 尝试直接 push main，应被拒绝 | ☐ |
| 2 | PR 审批要求生效 | 创建 PR，确认需要 approve | ☐ |
| 3 | Force push 被禁止 | 尝试 `git push --force origin main`，应失败 | ☐ |
| 4 | Dependabot alerts 启用 | Settings 页面确认状态为 Enabled | ☐ |
| 5 | Secret scanning 工作 | 提交含测试密钥的文件，应被阻止 | ☐ |

---

## 完成后通知 Manus Agent

当以上 P0 项全部完成后，请在下一次任务中告知 Manus：

> "分支保护已配置完成，可以开始开发工作。"

Manus Agent 将：
1. 验证分支保护规则是否生效
2. 开始通过 feature branch → PR 模式推进开发
3. 不再直接操作 main 分支

---

*本文档由 Manus Agent 自动生成。所有操作建议均基于 GitHub 最佳实践和项目安全要求。*
