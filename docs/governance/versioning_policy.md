# 版本治理政策

> Authority: D24

---

## 版本号规则

```text
MAJOR.MINOR.PATCH
  │      │      └── Bug 修复、Prompt 微调
  │      └────────── 新功能、新 Prompt、新模型
  └─────────────────── MVP 大版本（1.0 = MVP1, 2.0 = MVP2）
```

## 当前版本

| 版本 | 状态 | 说明 |
|------|------|------|
| 0.1.0 | 开发中 | MVP1 工程骨架 |
| 1.0.0 | 目标 | MVP1 内测发布 |
| 1.1.0 | 规划 | MVP1.5（链接输入 + 支付接入） |
| 2.0.0 | 规划 | MVP2（对标账号分析） |

## 发布规则

| 类型 | 版本变化 | 审批 | 测试 |
|------|----------|------|------|
| Hotfix | x.x.PATCH | Owner 口头 | 最小回归 |
| Feature | x.MINOR.0 | PR Review | 全套 |
| Breaking | MAJOR.0.0 | Owner + 全团队 | 全套 + 迁移 |

## CHANGELOG 规则

每个 PR 合并后，更新 CHANGELOG.md：

```markdown
## [x.x.x] - YYYY-MM-DD
### Added
### Changed
### Fixed
### Security
```

---
