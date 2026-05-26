# Feature Flag 政策

> Authority: D03, D23

---

## 当前 Feature Flags

| Flag | 默认值 | 用途 | 变更审批 |
|------|--------|------|----------|
| `FEATURE_VIDEO_LINK_INPUT` | false | 视频链接输入（P1） | Owner |
| `FEATURE_VIDEO_GENERATION` | false | 视频生成（MVP3） | Owner |
| `FEATURE_AUTO_PUBLISH` | false | 自动发布（永久禁止） | 不可开启 |
| `FEATURE_BATCH_ANALYSIS` | false | 批量分析（MVP2） | Owner |
| `FEATURE_MOCK_AI` | true(dev)/false(prod) | AI Mock 模式 | DevOps |

## 规则

1. **新功能必须通过 Feature Flag 控制**，不得直接进入主流程
2. **MVP2+ 功能的 Flag 在 MVP1 生产中必须为 false**
3. **`FEATURE_AUTO_PUBLISH` 永远不可开启**（D00 禁止事项）
4. **`FEATURE_MOCK_AI` 在生产环境必须为 false**
5. Flag 开启需要：PR + 测试 + Owner 审批
6. Flag 关闭（回滚）可以立即执行，事后补 PR

## 生命周期

```text
创建 Flag（默认 false）→ 开发完成 → 测试通过 → 灰度开启 → 全量开启 → 稳定后移除 Flag
```

---
