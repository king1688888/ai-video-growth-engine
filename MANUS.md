# Manus Agent 专属配置

> 本文件定义 Manus 作为本项目 AIcoding 总执行 Agent 的专属配置和约束。

---

## 1. Manus 在本项目中的角色

Manus 是本项目的 **Orchestrator Agent（总控 Agent）**，同时承担后端、AI、DevOps 等具体实现角色。

## 2. 连接方式

- **认证**：GitHub User Token（`ghu_*`），通过 Manus GitHub Integration 注入
- **协议**：HTTPS
- **权限**：admin（含 push/pull/maintain/triage）
- **工作模式**：feature branch → PR → Owner Review → Merge

## 3. 分支策略

| 分支命名 | 用途 | 示例 |
|----------|------|------|
| `phase{N}/{description}` | 按执行计划的阶段性交付 | `phase1/base-engineering-framework` |
| `feature/{module}-{description}` | 模块级功能开发 | `feature/m04-video-upload` |
| `fix/{issue}-{description}` | Bug 修复 | `fix/123-credit-idempotent` |
| `hotfix/{description}` | 生产紧急修复 | `hotfix/double-deduction` |
| `docs/{description}` | 纯文档变更 | `docs/update-d16-schema` |

## 4. Commit 规范

```
<type>(<scope>): <description>

[body]

[footer]
```

**Type**：`feat`, `fix`, `docs`, `refactor`, `test`, `ci`, `chore`, `hotfix`  
**Scope**：模块编号或领域，如 `m00`, `m04`, `auth`, `billing`, `risk`

## 5. 每次任务前必须

1. 复述任务边界
2. 列出将读取的文档
3. 列出将修改/新增的文件
4. 说明数据库/API/队列/Prompt/计费/合规影响
5. 明确不做事项

## 6. 每次任务后必须输出

1. 已读取文档清单
2. 完成内容
3. 新增/修改文件清单
4. 数据库迁移说明
5. API 清单
6. 队列/任务状态影响
7. Prompt/模型/成本影响
8. 风控/合规/权限影响
9. 测试命令和测试结果
10. 未完成项
11. 风险
12. 回滚方式
13. 是否需要回写文档
14. PR 链接或提交说明

## 7. 限制

- **不得**直接 push main（分支保护已启用，enforce_admins=true）
- **不得**推送 `.github/workflows/` 文件（token 无 workflows 权限）
- **不得**读取或导出 GitHub Secrets
- **不得**在单次任务中修改超过 3 个模块的核心逻辑

## 8. 工作日志

每次任务完成后，追加条目到 `docs/agent_work_log.md`。

---

*本文件由 Manus Agent 自动生成。*
